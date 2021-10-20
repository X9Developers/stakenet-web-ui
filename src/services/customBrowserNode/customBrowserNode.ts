import { BrowserNode } from '@connext/vector-browser-node';
import {
  EngineEvents,
  ChainAddresses,
  FullChannelState,
} from "@connext/vector-types";
import { onchainTransfer, withdrawToAsset, createEvtContainer, resolveToAssetTransfer, reconcileDeposit, getBalanceForAssetId, getChannelForChain, createFromAssetTransfer, maxTimeOut, getConfirmationsForChain, saveLocalStorage } from './util';
import { JsonRpcProvider } from '@ethersproject/providers';
import { PreImage } from './preImage';
import { parseUnits, formatUnits } from "@ethersproject/units";
import { cancelHangingToTransfers, cancelToAssetTransfer, requestCollateral, waitForSenderCancels } from './connext';
import { browserNode, TokenInfo, CheckPendingTransferResponseSchema, DepositParamsSchema, EvtContainer, HashZero, RecoverParamsSchema, WithdrawParamsSchema } from './types';
import { BigNumber } from 'ethers';


export class CustomBrowserNode {
  publicIdentifier = "";
  senderChainChannelAddress = "";
  recipientChainChannelAddress = "";
  crossChainTransferId = ""
  senderChainChannel?: FullChannelState;
  recipientChainChannel?: FullChannelState;
  public senderChain?: TokenInfo;
  public recipientChain?: TokenInfo;
  supportedChains?: number[];
  iframeSrc?: string;
  messagingUrl?: string;
  natsUrl?: string;
  authUrl?: string;
  chainAddresses?: ChainAddresses;
  browserNode: BrowserNode
  evts?: EvtContainer

  constructor(params: browserNode) {
    // this.logger = params.logger || pino();
    this.publicIdentifier = params.publicIdentifier;
    this.supportedChains = params.supportedChains || [];
    this.iframeSrc = params.iframeSrc;
    this.senderChain = params.senderChain;
    this.recipientChain = params.recipientChain;

    this.browserNode = new BrowserNode({
      chainProviders: {
        [params.senderChain!.chainId]: params.senderChain!.rpc[0],
        [params.recipientChain!.chainId]: params.recipientChain!.rpc[0]
      }
    });
  }

  public init = async () => {
    await this.browserNode.init()
    this.crossChainTransferId = `0x${PreImage.getRandom().toString()}`
    saveLocalStorage('crossChainTransferId', this.crossChainTransferId)
    await this.setupChannels()
    this.browserNode.getStateChannels().then(channels => {
      console.log('channels:', channels)
    })
    console.log("INITIALIZED BROWSER NODE");
    try {
      const _evts = this.evts ?? createEvtContainer(this.browserNode);
      this.evts = _evts;
    } catch (e) {
      const message = "Error while creating evt container";
      console.log(e, message);
      throw e;
    }

    let senderChainChannel: FullChannelState;
    try {
      senderChainChannel = await getChannelForChain(this.browserNode, this.publicIdentifier, this.senderChain!.chainId);
      console.log("SETTING DepositChannel: ", senderChainChannel);
    } catch (e) {
      const message = "Could not get sender channel";
      console.log(e, message);
      throw e;
    }
    const senderChainChannelAddress = senderChainChannel!.channelAddress;
    this.senderChainChannel = senderChainChannel;
    this.senderChainChannelAddress = senderChainChannelAddress;

    let recipientChainChannel: FullChannelState;
    try {
      recipientChainChannel = await getChannelForChain(
        this.browserNode,
        this.publicIdentifier,
        this.recipientChain!.chainId,
      );
      console.log("SETTING _withdrawChannel: ", recipientChainChannel);
    } catch (e) {
      const message = "Could not get sender channel";
      console.log(e, message);
      throw e;
    }

    const recipientChainChannelAddress = recipientChainChannel?.channelAddress!;
    this.recipientChainChannel = recipientChainChannel;
    this.recipientChainChannelAddress = recipientChainChannelAddress;

    try {
      const response = await this.checkPendingTransfer();
      console.log("SUCCESS INIT");
      return response;
    } catch (e) {
      const message = "Failed at Pending Transfer Check";
      console.log(e, message);
      throw e;
    }
  }


  public setupChannels = async () => {
    await this.setupChannel(this.publicIdentifier, this.senderChain!.chainId)
    if (this.senderChain?.chainId !== this.recipientChain?.chainId) {
      await this.setupChannel(this.publicIdentifier, this.recipientChain!.chainId)
    }
  }

  public setupChannel = async (counterpartyIdentifier: string, chainId: number) => {
    const resp = await this.browserNode.setup({
      counterpartyIdentifier: counterpartyIdentifier,
      chainId: chainId,
      timeout: maxTimeOut,
    })
    const error = resp.isError ? resp.getError() : undefined
    const shouldAttemptRestore = (error?.context?.validationError ?? "").includes("Channel is already setup");
    if (error && shouldAttemptRestore) {
      await this.browserNode.restoreState({
        counterpartyIdentifier: counterpartyIdentifier,
        chainId: chainId
      })
    }
  }

  // public conditionalTranfers = async () => {
  //   console.log(`Calling reconcileDeposit with ${this.senderChainChannelAddress!} and ${this.senderChain?.assetId!}`);
  //   await reconcileDeposit(this.browserNode!, this.senderChainChannelAddress!, this.senderChain?.assetId!);

  //   const preImage = PreImage.getRandom()
  //   const preImageStr = `0x${preImage.toString()}`

  //   try {
  //     console.log(
  //       `Calling createFromAssetTransfer ${this.senderChain?.chainId!} ${this.senderChain?.assetId!} ${this.recipientChain?.chainId
  //       } ${this.recipientChain?.assetId} ${this.crossChainTransferId}`,
  //     );
  //     const transferDeets = await createFromAssetTransfer(
  //       this.browserNode!,
  //       this.senderChain?.chainId!,
  //       this.senderChain?.assetId!,
  //       this.recipientChain?.chainId!,
  //       this.recipientChain?.assetId!,
  //       this.publicIdentifier,
  //       this.crossChainTransferId,
  //       preImageStr,
  //       // transferQuote,
  //     );
  //     console.log("createFromAssetTransfer transferDeets: ", transferDeets);
  //   } catch (e) {
  //     if (e.message.includes("Fees charged are greater than amount")) {
  //       const message = "Last requested transfer is lower than fees charged";
  //       console.error(message, e);
  //       throw new Error(message);
  //     }
  //     console.log(e);
  //     throw e;
  //   }

  //   // listen for a sender-side cancellation, if it happens, short-circuit and show cancellation
  //   const senderCancel = this.evts![EngineEvents.CONDITIONAL_TRANSFER_RESOLVED].pipe(data => {
  //     return (
  //       data.transfer.meta?.routingId === this.crossChainTransferId &&
  //       // data.transfer.responderIdentifier === this.routerPublicIdentifier &&
  //       data.transfer.responderIdentifier === this.publicIdentifier &&
  //       Object.values(data.transfer.transferResolver)[0] === HashZero
  //     );
  //   }).waitFor(500_000);

  //   const receiverCreate = this.evts![EngineEvents.CONDITIONAL_TRANSFER_CREATED].pipe(data => {
  //     return (
  //       data.transfer.meta?.routingId === this.crossChainTransferId &&
  //       // data.transfer.initiatorIdentifier === this.routerPublicIdentifier
  //       data.transfer.initiatorIdentifier === this.publicIdentifier
  //     );
  //   }).waitFor(500_000);

  //   // wait a long time for this, it needs to send onchain txs
  //   // if the receiver create doesnt complete, sender side can get cancelled
  //   try {
  //     const senderCanceledOrReceiverCreated = await Promise.race([senderCancel, receiverCreate]);
  //     console.log("Received senderCanceledOrReceiverCreated: ", senderCanceledOrReceiverCreated);
  //     if (Object.values(senderCanceledOrReceiverCreated.transfer.transferResolver ?? {})[0] === HashZero) {
  //       const message = "Transfer was cancelled";
  //       console.log(message);
  //       throw new Error(message);
  //     }
  //   } catch (e) {
  //     const message = "Did not receive transfer after 500 seconds, please try again later or attempt recovery";
  //     console.log(e, message);
  //     throw e;
  //   }

  //   const senderResolve = this.evts![EngineEvents.CONDITIONAL_TRANSFER_RESOLVED].pipe(data => {
  //     return (
  //       data.transfer.meta?.routingId === this.crossChainTransferId &&
  //       // data.transfer.responderIdentifier === this.routerPublicIdentifier
  //       data.transfer.responderIdentifier === this.publicIdentifier
  //     );
  //   }).waitFor(45_000);


  //   const transfer = await this.browserNode.getTransferByRoutingId({
  //     channelAddress: this.senderChainChannelAddress,
  //     routingId: this.crossChainTransferId,
  //     publicIdentifier: this.senderChainChannel?.bobIdentifier,
  //   });
  //   if (transfer.isError) {
  //     throw transfer.getError();
  //   }
  //   if (!transfer.getValue()) {
  //     throw new Error(`Cross-chain transfer not found in receiver channel: ${this.crossChainTransferId}`);
  //   }

  //   console.log("Transfer by RoutingId", transfer.getValue())

  //   try {
  //     await resolveToAssetTransfer(
  //       this.browserNode,
  //       this.recipientChain!.chainId,
  //       preImageStr,
  //       this.crossChainTransferId,
  //       this.publicIdentifier
  //     )
  //   } catch (e) {
  //     const message = "Error in resolveToAssetTransfer";
  //     console.log(e, message);
  //     throw e;
  //   }

  //   try {
  //     await senderResolve;
  //   } catch (e) {
  //     console.warn("Did not find resolve event from router, proceeding with withdrawal", e);
  //   }

  // }


  public createConditionalTranfer = async (amountToSend: string) => {
    console.log(`Calling reconcileDeposit with ${this.senderChainChannelAddress!} and ${this.senderChain?.assetId!}`);
    await reconcileDeposit(this.browserNode!, this.senderChainChannelAddress!, this.senderChain?.assetId!);

    const preImage = PreImage.getRandom()
    const preImageStr = `0x${preImage.toString()}`

    try {
      console.log(
        `Calling createFromAssetTransfer ${this.senderChain?.chainId!} ${this.senderChain?.assetId!} ${this.recipientChain?.chainId
        } ${this.recipientChain?.assetId} ${this.crossChainTransferId}`,
      );

      // const transferAmountBn = BigNumber.from(parseUnits(amountToSend, this.senderChain!.decimals)).toString();
      const transferAmountBn = amountToSend
      const transferDeets = await createFromAssetTransfer(
        this.browserNode!,
        this.senderChain?.chainId!,
        this.senderChain?.assetId!,
        this.recipientChain?.chainId!,
        this.recipientChain?.assetId!,
        this.publicIdentifier,
        this.crossChainTransferId,
        preImageStr,
        transferAmountBn,
        // transferQuote,
      );
      console.log("createFromAssetTransfer transferDeets: ", transferDeets);
      return transferDeets
    } catch (e) {
      if (e.message.includes("Fees charged are greater than amount")) {
        const message = "Last requested transfer is lower than fees charged";
        console.error(message, e);
        throw new Error(message);
      }
      console.log(e);
      throw e;
    }
  }

  public resolveConditionalTransfer = async (preImage: string) => {
    const preImageStr = preImage
    // listen for a sender-side cancellation, if it happens, short-circuit and show cancellation
    const senderCancel = this.evts![EngineEvents.CONDITIONAL_TRANSFER_RESOLVED].pipe(data => {
      return (
        data.transfer.meta?.routingId === this.crossChainTransferId &&
        // data.transfer.responderIdentifier === this.routerPublicIdentifier &&
        data.transfer.responderIdentifier === this.publicIdentifier &&
        Object.values(data.transfer.transferResolver)[0] === HashZero
      );
    }).waitFor(500_000);

    const receiverCreate = this.evts![EngineEvents.CONDITIONAL_TRANSFER_CREATED].pipe(data => {
      return (
        data.transfer.meta?.routingId === this.crossChainTransferId &&
        // data.transfer.initiatorIdentifier === this.routerPublicIdentifier
        data.transfer.initiatorIdentifier === this.publicIdentifier
      );
    }).waitFor(500_000);

    // wait a long time for this, it needs to send onchain txs
    // if the receiver create doesnt complete, sender side can get cancelled
    try {
      const senderCanceledOrReceiverCreated = await Promise.race([senderCancel, receiverCreate]);
      console.log("Received senderCanceledOrReceiverCreated: ", senderCanceledOrReceiverCreated);
      if (Object.values(senderCanceledOrReceiverCreated.transfer.transferResolver ?? {})[0] === HashZero) {
        const message = "Transfer was cancelled";
        console.log(message);
        throw new Error(message);
      }
    } catch (e) {
      const message = "Did not receive transfer after 500 seconds, please try again later or attempt recovery";
      console.log(e, message);
      throw e;
    }

    const senderResolve = this.evts![EngineEvents.CONDITIONAL_TRANSFER_RESOLVED].pipe(data => {
      return (
        data.transfer.meta?.routingId === this.crossChainTransferId &&
        // data.transfer.responderIdentifier === this.routerPublicIdentifier
        data.transfer.responderIdentifier === this.publicIdentifier
      );
    }).waitFor(45_000);


    const transfer = await this.browserNode.getTransferByRoutingId({
      channelAddress: this.senderChainChannelAddress,
      routingId: this.crossChainTransferId,
      publicIdentifier: this.senderChainChannel?.bobIdentifier,
    });
    if (transfer.isError) {
      throw transfer.getError();
    }
    if (!transfer.getValue()) {
      throw new Error(`Cross-chain transfer not found in receiver channel: ${this.crossChainTransferId}`);
    }

    console.log("Transfer by RoutingId", transfer.getValue())

    try {
      await resolveToAssetTransfer(
        this.browserNode,
        this.recipientChain!.chainId,
        preImageStr,
        this.crossChainTransferId,
        this.publicIdentifier
      )
    } catch (e) {
      const message = "Error in resolveToAssetTransfer";
      console.log(e, message);
      throw e;
    }

    try {
      await senderResolve;
    } catch (e) {
      console.warn("Did not find resolve event from router, proceeding with withdrawal", e);
    }
  }


  async preTransferCheck(transferAmount: string): Promise<void> {
    if (!transferAmount) {
      const message = "Transfer Amount is undefined";
      console.log(message);
      throw new Error(message);
    }
    const transferAmountBn: BigNumber = BigNumber.from(parseUnits(transferAmount, this.senderChain!.decimals!));

    if (transferAmountBn.isZero()) {
      const message = "Transfer amount cannot be 0";
      console.log(message);
      throw new Error(message);
    }

    await reconcileDeposit(this.browserNode!, this.recipientChainChannelAddress, this.recipientChain?.assetId!);

  }

  async deposit(params: DepositParamsSchema): Promise<void> {
    const { transferAmount, preTransferCheck = true, webProvider, onDeposited } = params;

    if (preTransferCheck) {
      try {
        await this.preTransferCheck(transferAmount);
      } catch (e) {
        console.log("Error at preCheck", e);
        throw e;
      }
    }

    const transferAmountBn = BigNumber.from(parseUnits(transferAmount, this.senderChain!.decimals));
    console.log("transferAmountBn: ", transferAmountBn.toString());

    try {
      const signer = webProvider.getSigner();
      const depositTx = await onchainTransfer(
        this.senderChainChannelAddress,
        this.senderChain!.assetId,
        transferAmountBn,
        signer,
      );
      console.log("deposit submitted:", depositTx.hash);
      const confirmations = getConfirmationsForChain(this.senderChain!.chainId);
      const receipt = await depositTx.wait(confirmations);
      console.log("deposit mined:", receipt.transactionHash);

      signer.provider.waitForTransaction(depositTx.hash, confirmations).then(receipt => {
        if (receipt.status === 0) {
          // tx reverted
          const message = "Transaction reverted onchain";
          console.error(message, receipt);
          throw new Error(message);
        }
      });
      if (onDeposited) {
        onDeposited(depositTx.hash);
      }
    } catch (e) {
      console.log("Error at deposit", e);
      throw e;
    }
  }


  async withdraw(params: WithdrawParamsSchema): Promise<void> {
    const { recipientAddress, onFinished, withdrawalCallTo, withdrawalCallData, generateCallData } = params;
    await reconcileDeposit(this.browserNode!, this.senderChainChannelAddress, this.senderChain!.assetId);
    const routerOffchain = BigNumber.from(
      getBalanceForAssetId(this.senderChainChannel!, this.senderChain!.assetId, "alice"),
    );

    if (routerOffchain.gt(0)) {
      console.log("Waiting for withdrawal resolve event for router at sender side");
      const routerWithdrawResolve = this.evts![EngineEvents.WITHDRAWAL_RESOLVED].pipe(data => {
        return (
          // data.transfer.responderIdentifier === this.routerPublicIdentifier &&
          data.transfer.responderIdentifier === this.publicIdentifier &&
          data.channelAddress === this.senderChainChannelAddress &&
          data.assetId === this.senderChain!.assetId
        );
      }).waitFor(45_000);

      try {
        await routerWithdrawResolve;
      } catch (e) {
        console.warn("Couldn't find withdraw resolve event for router at sender side, cancelling withdrawal", e);
        throw e;
      }
    }


    let result;
    try {
      result = await withdrawToAsset(
        this.browserNode!,
        this.recipientChain!.chainId,
        this.recipientChain!.assetId,
        recipientAddress,
        this.publicIdentifier,
        withdrawalCallTo,
        withdrawalCallData,
        generateCallData
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
    // display tx hash through explorer -> handles by the event.
    console.log("crossChainTransfer: ", result);

    const successWithdrawalUi = formatUnits(result.withdrawalAmount, this.recipientChain!.decimals);

    console.log(successWithdrawalUi);

    // check tx receipt for withdrawal tx
    const rpcProvider = new JsonRpcProvider(this.recipientChain?.rpc[0])
    // this.recipientChain?.rpcProvider.waitForTransaction(result.withdrawalTx).then(receipt => {
    rpcProvider.waitForTransaction(result.withdrawalTx).then(receipt => {
      if (receipt.status === 0) {
        // tx reverted
        const message = "Transaction reverted onchain";
        console.error(message, receipt);
        throw new Error(message);
      }
    });

    if (onFinished) {
      onFinished(result.withdrawalTx, successWithdrawalUi, BigNumber.from(result.withdrawalAmount));
    }
  }


  async checkPendingTransfer(): Promise<CheckPendingTransferResponseSchema> {
    try {
      await reconcileDeposit(this.browserNode!, this.senderChainChannelAddress, this.senderChain?.assetId!);
    } catch (e) {
      if (e.message.includes("must restore") || (e.context?.message ?? "").includes("must restore")) {
        console.warn(
          "Channel is out of sync, restoring before other operations. The channel was likely used in another browser.",
        );
        const restoreDepositChannelState = await this.browserNode!.restoreState({
          counterpartyIdentifier: this.publicIdentifier,
          chainId: this.senderChain?.chainId!,
        });
        if (restoreDepositChannelState.isError) {
          const message = "Could not restore sender channel state";
          console.error(message, restoreDepositChannelState.getError());
          throw restoreDepositChannelState.getError();
        }
        const restoreWithdrawChannelState = await this.browserNode!.restoreState({
          counterpartyIdentifier: this.publicIdentifier,
          chainId: this.recipientChain?.chainId!,
        });
        if (restoreWithdrawChannelState.isError) {
          const message = "Could not restore receiver channel state";
          console.error(message, restoreWithdrawChannelState.getError());
          throw restoreWithdrawChannelState.getError();
        }
        try {
          await reconcileDeposit(this.browserNode!, this.senderChainChannelAddress, this.senderChain?.assetId!);
        } catch (e) {
          const message = "Error in reconcileDeposit";
          console.error(message, e);
          throw e;
        }
      } else {
        const message = "Error in reconcileDeposit";
        console.error(message, e);
        throw e;
      }
    }

    // prune any existing receiver transfers
    try {
      const hangingResolutions = await cancelHangingToTransfers(
        this.browserNode!,
        this.evts![EngineEvents.CONDITIONAL_TRANSFER_CREATED],
        this.senderChain?.chainId!,
        this.recipientChain?.chainId!,
        this.recipientChain?.assetId!,
        this.publicIdentifier,
      );
      console.log("Found hangingResolutions: ", hangingResolutions);
    } catch (e) {
      const message = "Error in cancelHangingToTransfers";
      console.log(e, message);
      throw e;
    }

    // get active transfers
    const [depositActive, withdrawActive] = await Promise.all([
      this.browserNode!.getActiveTransfers({
        channelAddress: this.senderChainChannelAddress,
      }),
      this.browserNode!.getActiveTransfers({
        channelAddress: this.recipientChainChannelAddress,
      }),
    ]);
    const depositHashlock = depositActive.getValue().filter(t => Object.keys(t.transferState).includes("HashlockTransfer"));
    const withdrawHashlock = withdrawActive.getValue().filter(t => Object.keys(t.transferState).includes("HashlockTransfer"));
    console.warn(
      "deposit active on init",
      depositHashlock.length,
      "ids:",
      depositHashlock.map(t => t.transferId),
    );
    console.warn(
      "withdraw active on init",
      withdrawHashlock.length,
      "ids:",
      withdrawHashlock.map(t => t.transferId),
    );

    // set a listener to check for transfers that may have been pushed after a refresh after the hanging transfers have already been canceled
    this.evts!.CONDITIONAL_TRANSFER_CREATED.pipe(data => {
      return (
        data.transfer.responderIdentifier === this.browserNode!.publicIdentifier &&
        data.transfer.meta.routingId !== this.crossChainTransferId
      );
    }).attach(async data => {
      console.warn("Cancelling transfer thats not active");
      const senderResolution = this.evts!.CONDITIONAL_TRANSFER_RESOLVED.pipe(
        data =>
          data.transfer.meta.crossChainTransferId === this.crossChainTransferId &&
          data.channelAddress === this.senderChainChannelAddress,
      ).waitFor(45_000);

      const receiverResolution = this.evts!.CONDITIONAL_TRANSFER_RESOLVED.pipe(
        data =>
          data.transfer.meta.crossChainTransferId === this.crossChainTransferId &&
          data.channelAddress === this.recipientChainChannelAddress,
      ).waitFor(45_000);

      try {
        await cancelToAssetTransfer(
          this.browserNode!,
          this.recipientChainChannelAddress,
          data.transfer.transferId,
          `Widget: Canceling transfer for non-existent preimage`,
        );
      } catch (e) {
        const message = "Error in cancelToAssetTransfer";
        console.log(e, message);
        throw e;
      }

      try {
        await Promise.all([senderResolution, receiverResolution]);
        const message = "Transfer was cancelled";
        console.log(message);
        throw new Error(message);
      } catch (e) {
        const message = "Error waiting for sender and receiver cancellations";
        console.log(e, message);
        throw e;
      }
    });

    try {
      console.log("Waiting for sender cancellations..");
      await waitForSenderCancels(
        this.browserNode!,
        this.evts![EngineEvents.CONDITIONAL_TRANSFER_RESOLVED],
        this.senderChainChannelAddress,
      );
      console.log("done!");
    } catch (e) {
      const message = "Error in waitForSenderCancels";
      console.log(e, message);
      throw e;
    }

    // After reconciling, get channel again
    try {
      this.senderChainChannel = await getChannelForChain(
        this.browserNode!,
        this.publicIdentifier,
        this.senderChain?.chainId!,
      );
    } catch (e) {
      const message = "Could not get sender channel";
      console.log(e, message);
      throw e;
    }

    try {
      const {
        offChainSenderChainAssetBalanceBn,
        offChainRecipientChainAssetBalanceBn,
      } = await this.getOffChainChannelBalance();

      return {
        offChainSenderChainAssetBalanceBn,
        offChainRecipientChainAssetBalanceBn,
      };
    } catch (e) {
      const message = "Error at Off chain channel balance";
      console.log(e, message);
      throw e;
    }
  }

  async recover(params: RecoverParamsSchema): Promise<void> {
    const { assetId, recipientAddress, onRecover } = params;

    try {
      await reconcileDeposit(this.browserNode!, this.senderChainChannelAddress, assetId);
    } catch (e) {
      const message = "Error in reconcileDeposit";
      console.error(message, e);
      throw e;
    }

    let updatedChannel: FullChannelState;
    try {
      updatedChannel = await getChannelForChain(
        this.browserNode!,
        this.publicIdentifier,
        this.senderChain?.chainId!,
      );
    } catch (e) {
      const message = "Could not get sender channel";
      console.log(e, message);
      throw e;
    }

    const endingBalanceBn = BigNumber.from(getBalanceForAssetId(updatedChannel, assetId, "bob"));
    if (endingBalanceBn.isZero()) {
      const message = "No balance found to recover";
      console.error(message);
      throw new Error(message);
    }
    console.log(`Found ${endingBalanceBn.toString()} of ${assetId}, attempting withdrawal`);

    let result;
    try {
      result = await withdrawToAsset(
        this.browserNode!,
        this.senderChain?.chainId!,
        this.senderChain?.assetId!,
        recipientAddress,
        this.publicIdentifier,
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
    // display tx hash through explorer -> handles by the event.
    console.log("Recovery Withdraw: ", result);

    // const successRecoverUi = formatUnits(result.withdrawalAmount, this.senderChain?.assetDecimals!);
    const successRecoverUi = formatUnits(result.withdrawalAmount, this.senderChain!.decimals);

    console.log(successRecoverUi);

    // check tx receipt for withdrawal tx

    const rpcProvider = new JsonRpcProvider(this.senderChain?.rpc[0])
    // this.senderChain?.rpcProvider.waitForTransaction(result.withdrawalTx).then(receipt => {
    rpcProvider.waitForTransaction(result.withdrawalTx).then(receipt => {
      if (receipt.status === 0) {
        // tx reverted
        const message = "Transaction reverted onchain";
        console.error(message, receipt);
        throw new Error(message);
      }
    });

    ////// Doesn't throw error
    try {
      await Promise.all([
        reconcileDeposit(this.browserNode!, this.senderChainChannelAddress, this.senderChain!.assetId),
        reconcileDeposit(this.browserNode!, this.recipientChainChannelAddress, this.recipientChain!.assetId),
      ]);
    } catch (e) {
      const message = "Error in reconcileDeposit";
      console.error(message, e);
    }

    try {
      await Promise.all([
        requestCollateral(this.browserNode!, this.senderChainChannelAddress, this.senderChain!.assetId),
        requestCollateral(this.browserNode!, this.recipientChainChannelAddress, this.recipientChain!.assetId),
      ]);
    } catch (e) {
      const message = "Could not request collateral for recipient channel";
      console.log(e, message);
    }
    //////

    if (onRecover) {
      onRecover(result.withdrawalTx, successRecoverUi, BigNumber.from(result.withdrawalAmount));
    }
    console.log("Successfully Recover");
  }



  async getOffChainChannelBalance(): Promise<{
    offChainSenderChainAssetBalanceBn: BigNumber;
    offChainRecipientChainAssetBalanceBn: BigNumber;
  }> {
    const offChainSenderChainAssetBalance = BigNumber.from(
      getBalanceForAssetId(this.senderChainChannel!, this.senderChain?.assetId!, "bob"),
    );
    console.log(
      `Offchain balance for ${this.senderChainChannelAddress} of asset ${this.senderChain
        ?.assetId!}: ${offChainSenderChainAssetBalance}`,
    );

    const offChainRecipientChainAssetBalance = BigNumber.from(
      getBalanceForAssetId(this.recipientChainChannel!, this.recipientChain?.assetId!, "bob"),
    );
    console.log(
      `Offchain balance for ${this.recipientChainChannelAddress} of asset ${this.recipientChain
        ?.assetId!}: ${offChainRecipientChainAssetBalance}`,
    );

    return {
      offChainSenderChainAssetBalanceBn: offChainSenderChainAssetBalance,
      offChainRecipientChainAssetBalanceBn: offChainRecipientChainAssetBalance,
    };
  }

  // public checkPendingTRansfers = async () => {
  //   this.browserNode.getActiveTransfers({
  //     publicIdentifier: this.publicIdentifier,
  //     channelAddress: this.senderChainChannelAddress
  //   }).then(activeTransfers => {
  //     console.log(activeTransfers)
  //   })
  //   this.browserNode.getRegisteredTransfers({
  //     chainId: 1
  //   }).then(registreredTransfers => {
  //     console.log(registreredTransfers)
  //     registreredTransfers.getValue()
  //   })
  //   // this.browserNode.getTransferDispute({
  //   //   transferId: '0x1f655dc6447f3382ba35ce31fcaf096b18a13e844391a25fccf358558079fe30'
  //   // }).then(registreredTransfers => {
  //   //   console.log(registreredTransfers)
  //   //   registreredTransfers.getValue()?.transferDisputeExpiry
  //   // })
  // }

}