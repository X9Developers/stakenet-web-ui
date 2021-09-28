import { BigNumber } from "ethers";
import { BaseProvider, Web3Provider, JsonRpcSigner, TransactionResponse } from '@ethersproject/providers';
import { Contract } from "@ethersproject/contracts";
import { formatUnits } from "ethers/lib/utils";
import { BrowserNode } from "@connext/vector-browser-node";
import { getAddress } from "@ethersproject/address";
import {
  ConditionalTransferCreatedPayload,
  ConditionalTransferResolvedPayload,
  DepositReconciledPayload,
  EngineEvents,
  FullChannelState,
  NodeParams,
  TransferNames,
  WithdrawalReconciledPayload,
  TransferQuote,
  WithdrawalResolvedPayload,
  ERC20Abi
} from "@connext/vector-types";

import { sha256 as soliditySha256 } from "@ethersproject/solidity";
import { AddressZero, EvtContainer } from "./types";
import { Evt } from "evt";

export const onDeposited = (txHash: string) => {
  console.log('txHash ', txHash)
}

export const onFinished = (params: string, successWithdrawalUi: string, withdrawalAmount: BigNumber) => {
  console.log("On finish ==>", params, 'successWithdrawalUi', successWithdrawalUi, 'withdrawalAmount', withdrawalAmount)
}

// number of confirmations for non-mainnet chains
export const NUM_CONFIRMATIONS = 10;
// TODO: need to stop using random chainIds in our testing, these could eventually be real chains...
export const CHAINS_WITH_ONE_CONFIRMATION = [1, 1337, 1338, 1340, 1341, 1342];

export const getConfirmationsForChain = (chainId: number): number => {
  return CHAINS_WITH_ONE_CONFIRMATION.includes(chainId) ? 1 : NUM_CONFIRMATIONS;
};

export const maxTimeOut = '864000'

export const getOnchainBalance = async (
  ethProvider: BaseProvider,
  assetId: string,
  address: string,
): Promise<BigNumber> => {
  const balance =
    assetId === AddressZero
      ? await ethProvider.getBalance(address)
      : await new Contract(assetId, ERC20Abi, ethProvider).balanceOf(address);
  return balance;
};

export const getUserBalance = async (
  injectedProvider: Web3Provider,
  senderChainAssetId: string,
  senderChainAssetDecimals: number,
): Promise<string> => {
  const userAddress = await injectedProvider!.getSigner().getAddress();
  console.log("injected signer address", userAddress);

  const balance = await getOnchainBalance(injectedProvider, senderChainAssetId, userAddress);

  const userBalance = formatUnits(balance.toString(), senderChainAssetDecimals);

  return userBalance;
};

export const onchainTransfer = async (
  depositAddress: string,
  assetId: string,
  transferAmountBn: BigNumber,
  signer: JsonRpcSigner,
): Promise<TransactionResponse> => {
  const tx =
    assetId === AddressZero
      ? await signer.sendTransaction({
        to: depositAddress,
        value: transferAmountBn.toHexString(),
      })
      : await new Contract(assetId, ERC20Abi, signer).transfer(depositAddress, transferAmountBn);

  return tx;
};

export const withdrawToAsset = async (
  node: BrowserNode,
  toChainId: number,
  _toAssetId: string,
  recipientAddr: string,
  routerPublicIdentifier: string,
  withdrawCallTo?: string,
  withdrawCallData?: string,
  generateCallData?: (toWithdraw: string, toAssetId: string, node: BrowserNode) => Promise<{ callData?: string }>,
): Promise<{ withdrawalTx: string; withdrawalAmount: string }> => {
  console.log("Starting withdrawal: ", {
    toChainId,
    _toAssetId,
    recipientAddr,
    routerPublicIdentifier,
    withdrawCallTo,
    withdrawCallData,
  });
  const withdrawChannel = await getChannelForChain(node, routerPublicIdentifier, toChainId);

  const toAssetId = getAddress(_toAssetId);
  const toWithdraw = getBalanceForAssetId(withdrawChannel, toAssetId, "bob");
  if (toWithdraw === "0") {
    throw new Error("Asset not in receiver channel");
  }

  let callData = withdrawCallData;
  if (generateCallData && typeof generateCallData === "function") {
    console.log("Using generateCallData function");
    const res = await generateCallData(toWithdraw, toAssetId, node);
    callData = res.callData ? res.callData : withdrawCallData;
  }

  const params: NodeParams.Withdraw = {
    amount: toWithdraw,
    assetId: toAssetId,
    channelAddress: withdrawChannel.channelAddress,
    publicIdentifier: withdrawChannel.bobIdentifier,
    recipient: recipientAddr,
    callTo: withdrawCallTo,
    callData,
  };

  console.log("withdraw params", params);
  const ret = await node.withdraw(params);
  if (ret.isError) {
    throw ret.getError();
  }
  const { transactionHash } = ret.getValue();
  console.log(ret.getValue());
  if (!transactionHash) {
    // TODO: prompt router to retry sending transaction
    throw new Error("Router failed to withdraw");
  }

  const result = {
    withdrawalTx: transactionHash,
    withdrawalAmount: toWithdraw,
  };
  return result;
};


export const getBalanceForAssetId = (
  channel: FullChannelState,
  // channel: any,
  assetId: string,
  participant: "alice" | "bob",
): string => {
  const assetIdx = channel.assetIds.findIndex((a) => getAddress(a) === getAddress(assetId));
  if (assetIdx === -1) {
    return "0";
  }
  return channel.balances[assetIdx].amount[participant === "alice" ? 0 : 1];
};

export const getChannelForChain = async (
  node: BrowserNode,
  routerIdentifier: string,
  chainId: number,
): Promise<FullChannelState> => {
  const depositChannelRes = await node.getStateChannelByParticipants({
    chainId,
    counterparty: routerIdentifier,
  });
  if (depositChannelRes.isError) {
    throw depositChannelRes.getError();
  }
  const channel = depositChannelRes.getValue();
  if (!channel) {
    throw new Error(`Could not find channel on ${chainId}`);
  }
  return channel as FullChannelState;
};



export const createEvtContainer = (node: BrowserNode): EvtContainer => {
  const createdTransfer = Evt.create<ConditionalTransferCreatedPayload>();
  const resolvedTransfer = Evt.create<ConditionalTransferResolvedPayload>();
  const deposit = Evt.create<DepositReconciledPayload>();
  const withdrawReconciled = Evt.create<WithdrawalReconciledPayload>();
  const withdrawResolved = Evt.create<WithdrawalResolvedPayload>();

  node.on(EngineEvents.CONDITIONAL_TRANSFER_CREATED, data => {
    console.log("EngineEvents.CONDITIONAL_TRANSFER_CREATED: ", data);
    createdTransfer.post(data);
  });
  node.on(EngineEvents.CONDITIONAL_TRANSFER_RESOLVED, data => {
    console.log("EngineEvents.CONDITIONAL_TRANSFER_RESOLVED: ", data);
    resolvedTransfer.post(data);
  });
  node.on(EngineEvents.DEPOSIT_RECONCILED, data => {
    console.log("EngineEvents.DEPOSIT_RECONCILED: ", data);
    deposit.post(data);
  });
  node.on(EngineEvents.WITHDRAWAL_RECONCILED, data => {
    console.log("EngineEvents.WITHDRAWAL_RECONCILED: ", data);
    withdrawReconciled.post(data);
  });
  node.on(EngineEvents.WITHDRAWAL_RESOLVED, data => {
    console.log("EngineEvents.WITHDRAWAL_RESOLVED: ", data);
    withdrawResolved.post(data);
  });
  return {
    [EngineEvents.CONDITIONAL_TRANSFER_CREATED]: createdTransfer,
    [EngineEvents.CONDITIONAL_TRANSFER_RESOLVED]: resolvedTransfer,
    [EngineEvents.DEPOSIT_RECONCILED]: deposit,
    [EngineEvents.WITHDRAWAL_RECONCILED]: withdrawReconciled,
    [EngineEvents.WITHDRAWAL_RESOLVED]: withdrawResolved,
  };
};


export const resolveToAssetTransfer = async (
  node: BrowserNode,
  toChainId: number,
  preImage: string,
  crossChainTransferId: string,
  routerPublicIdentifier: string,
): Promise<{ transferId: string }> => {
  const withdrawChannel = await getChannelForChain(node, routerPublicIdentifier, toChainId);

  const transfer = await node.getTransferByRoutingId({
    channelAddress: withdrawChannel.channelAddress,
    routingId: crossChainTransferId,
    publicIdentifier: withdrawChannel.bobIdentifier,
  });
  if (transfer.isError) {
    throw transfer.getError();
  }
  if (!transfer.getValue()) {
    throw new Error(`Cross-chain transfer not found in receiver channel: ${crossChainTransferId}`);
  }
  const params: NodeParams.ResolveTransfer = {
    publicIdentifier: withdrawChannel.bobIdentifier,
    channelAddress: withdrawChannel.channelAddress,
    transferId: transfer.getValue()!.transferId,
    transferResolver: { preImage },
    meta: { crossChainTransferId, routingId: crossChainTransferId },
  };
  const ret = await node.resolveTransfer(params);
  if (ret.isError) {
    throw ret.getError();
  }
  return { transferId: transfer.getValue()!.transferId };
};

// throws results to be used in retryWithDelay fn
export const reconcileDeposit = async (node: BrowserNode, channelAddress: string, _assetId: string): Promise<void> => {
  const ret = await node.reconcileDeposit({
    channelAddress,
    assetId: getAddress(_assetId),
  });
  if (ret.isError) {
    throw ret.getError();
  }
};

export const createlockHash = (preImage: string): string => soliditySha256(["bytes32"], [preImage]);

export const createFromAssetTransfer = async (
  node: BrowserNode,
  fromChainId: number,
  _fromAssetId: string,
  toChainId: number,
  _toAssetId: string,
  routerPublicIdentifier: string,
  crossChainTransferId: string,
  preImage: string,
  amountToSend: string,
  quote?: TransferQuote
): Promise<{ transferId: string; preImage: string }> => {
  const depositChannel = await getChannelForChain(node, routerPublicIdentifier, fromChainId);
  const fromAssetId = getAddress(_fromAssetId);
  const toAssetId = getAddress(_toAssetId);
  console.log(toAssetId)
  // const toTransfer = getBalanceForAssetId(depositChannel, fromAssetId, "bob");
  // if (toTransfer === "0") {
  //   throw new Error(
  //     `Asset (${fromAssetId}) not in channel, please deposit. Assets: ${depositChannel.assetIds.join(",")}`,
  //   );
  // }

  console.log('lockhash', createlockHash(preImage))
  // const params: NodeParams.ConditionalTransfer = {
  //   // recipient: depositChannel.bobIdentifier,
  //   recipient: depositChannel.aliceIdentifier,
  //   recipientChainId: toChainId,
  //   recipientAssetId: toAssetId,
  //   channelAddress: depositChannel.channelAddress,
  //   type: TransferNames.HashlockTransfer,
  //   assetId: fromAssetId,
  //   amount: toTransfer,
  //   meta: {
  //     routingId: crossChainTransferId,
  //     crossChainTransferId,
  //     fromAssetId,
  //     toAssetId,
  //   },
  //   details: { expiry: "0", lockHash: createlockHash(preImage) },
  //   publicIdentifier: depositChannel.bobIdentifier,
  //   // publicIdentifier: routerPublicIdentifier,
  //   quote,
  // };

  const params: NodeParams.ConditionalTransfer = {
    recipient: depositChannel.aliceIdentifier,
    recipientChainId: toChainId,
    recipientAssetId: fromAssetId,
    channelAddress: depositChannel.channelAddress,
    type: TransferNames.HashlockTransfer,
    assetId: fromAssetId,
    // amount: toTransfer,
    amount: amountToSend,
    meta: {
      routingId: crossChainTransferId,
      crossChainTransferId,
      requireOnline: false
    },
    details: { expiry: "0", lockHash: createlockHash(preImage) },
    publicIdentifier: depositChannel.bobIdentifier,
    timeout: '43200'
  };
  console.log('................................................')
  console.log('PREIMAGE: ', preImage)
  console.log('crossChainTransferId: ', crossChainTransferId)
  console.log('routingId: ', crossChainTransferId)
  console.log('................................................')
  console.log("transfer params", params);
  const ret = await node.conditionalTransfer(params);
  if (ret.isError) {
    throw ret.getError();
  }
  const { transferId } = ret.getValue();
  const transferData = {
    ...params,
    preImage,
    transferId
  }
  saveLocalStorage('transferData', JSON.stringify(transferData))
  return {
    transferId,
    preImage,
  };
};


export const saveLocalStorage = (name: string, data: any) => {
  let a = [];
  // Parse the serialized data back into an aray of objects
  const prevoiusData = localStorage.getItem(name)
  if (prevoiusData)
    a = JSON.parse(prevoiusData)
  else
    a = []
  // Push the new data (whether it be an object or anything else) onto the array
  const newData = { data: data, date: new Date() }
  a.push(newData);
  // Alert the array value
  // Re-serialize the array back into a string and store it in localStorage
  localStorage.setItem(name, JSON.stringify(a));
}