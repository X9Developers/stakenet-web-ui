import { BrowserNode } from "@connext/vector-browser-node";
import { ConditionalTransferResolvedPayload, NodeParams, NodeResponses } from "@connext/vector-types";
import { Evt } from 'evt';
import { getChannelForChain } from "./util";
import { getAddress } from '@ethersproject/address';
import { HashZero } from "./types";

export const waitForSenderCancels = async (
  node: BrowserNode,
  evt: Evt<ConditionalTransferResolvedPayload>,
  depositChannelAddress: string,
): Promise<void> => {
  const active = await node.getActiveTransfers({
    channelAddress: depositChannelAddress,
  });
  if (active.isError) {
    throw active.getError();
  }
  const hashlock = active.getValue().filter(t => {
    return Object.keys(t.transferState).includes("HashlockTransfer");
  });
  await Promise.all(
    hashlock.map(async t => {
      try {
        console.log("Waiting for sender cancellation: ", t);
        await evt.waitFor(
          data =>
            data.transfer.transferId === t.transferId &&
            data.channelAddress === depositChannelAddress &&
            Object.values(data.transfer.transferResolver)[0] === HashZero,
          300_000,
        );
      } catch (e) {
        console.error("Timed out waiting for cancellation:", e);
      }
    }),
  );
  const final = await node.getActiveTransfers({
    channelAddress: depositChannelAddress,
  });
  if (final.isError) {
    throw final.getError();
  }
  const remaining = final.getValue().filter(t => {
    return Object.keys(t.transferState).includes("HashlockTransfer");
  });
  if (remaining.length > 0) {
    throw new Error("Hanging sender transfers");
  }
};



export const cancelHangingToTransfers = async (
  node: BrowserNode,
  evt: Evt<ConditionalTransferResolvedPayload>,
  fromChainId: number,
  toChainId: number,
  _toAssetId: string,
  routerPublicIdentifier: string,
): Promise<(NodeResponses.ResolveTransfer | undefined)[]> => {
  const depositChannel = await getChannelForChain(node, routerPublicIdentifier, fromChainId);
  const withdrawChannel = await getChannelForChain(node, routerPublicIdentifier, toChainId);

  const toAssetId = getAddress(_toAssetId);
  const transfers = await node.getActiveTransfers({
    publicIdentifier: withdrawChannel.bobIdentifier,
    channelAddress: withdrawChannel.channelAddress,
  });
  if (transfers.isError) {
    throw transfers.getError();
  }

  const toCancel = transfers.getValue().filter(t => {
    const amResponder = t.responderIdentifier === withdrawChannel.bobIdentifier;
    const correctAsset = t.assetId === toAssetId;
    const isHashlock = Object.keys(t.transferState).includes("HashlockTransfer");
    const wasForwarded = !!t.meta?.routingId;
    return amResponder && correctAsset && isHashlock && wasForwarded;
  });

  // wait for all hanging transfers to cancel
  const hangingResolutions = (await Promise.all(
    toCancel.map(async transferToCancel => {
      try {
        console.warn(
          "Cancelling hanging receiver transfer w/routingId:",
          transferToCancel.meta!.routingId,
          "and transferId:",
          transferToCancel.transferId,
        );
        const params: NodeParams.ResolveTransfer = {
          publicIdentifier: withdrawChannel.bobIdentifier,
          channelAddress: withdrawChannel.channelAddress,
          transferId: transferToCancel.transferId,
          transferResolver: { preImage: HashZero },
        };
        // for receiver transfer cancellatino
        const resolved = await new Promise(async (res, rej) => {
          const resolveRes = await node.resolveTransfer(params);
          if (resolveRes.isError) {
            console.error("Failed to cancel transfer:", resolveRes.getError());
            return rej(resolveRes.getError()?.message);
          }
          return res(resolveRes.getValue());
        });
        // for sender transfer cancellation
        await evt.waitFor(
          data =>
            data.transfer.meta.routingId === transferToCancel.meta!.routingId &&
            data.channelAddress === depositChannel.channelAddress &&
            Object.values(data.transfer.transferResolver)[0] === HashZero,
          45_000,
        );
        return resolved;
      } catch (e) {
        console.error("Error cancelling hanging", e);
        return undefined;
      }
    }),
  )) as (NodeResponses.ResolveTransfer | undefined)[];
  return hangingResolutions;
};


export const cancelToAssetTransfer = async (
  node: BrowserNode,
  withdrawChannelAddess: string,
  transferId: string,
  cancellationReason: string,
): Promise<NodeResponses.ResolveTransfer> => {
  const params = {
    channelAddress: withdrawChannelAddess,
    transferId: transferId,
    transferResolver: { preImage: HashZero },
    meta: {
      cancellationReason,
    },
  };
  const ret = await node.resolveTransfer(params);
  if (ret.isError) {
    throw ret.getError();
  }
  return ret.getValue();
};

export const requestCollateral = async (node: BrowserNode, channelAddress: string, _assetId: string): Promise<void> => {
  const res = await node.requestCollateral({
    channelAddress: channelAddress,
    assetId: getAddress(_assetId),
  });
  if (res.isError) {
    throw res.getError();
  }
};
