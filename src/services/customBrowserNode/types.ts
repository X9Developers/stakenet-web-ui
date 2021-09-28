
import { BigNumber } from "ethers";
import { Evt } from "evt";
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { BrowserNode } from '@connext/vector-browser-node';
import {
  ConditionalTransferCreatedPayload,
  ConditionalTransferResolvedPayload,
  DepositReconciledPayload,
  EngineEvents,
  WithdrawalReconciledPayload,
  WithdrawalResolvedPayload
} from "@connext/vector-types";

export interface browserNode {
  publicIdentifier: string;
  supportedChains?: number[];
  iframeSrc?: string;
  senderChain?: TokenInfo;
  recipientChain?: TokenInfo;
}

export type CheckPendingTransferResponseSchema = {
  offChainSenderChainAssetBalanceBn: BigNumber;
  offChainRecipientChainAssetBalanceBn: BigNumber;
};

export const AddressZero = "0x0000000000000000000000000000000000000000";

export const HashZero = "0x0000000000000000000000000000000000000000000000000000000000000000";

export interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export interface ChainDetail {
  name: string;
  chainId: number;
  chainProvider: string;
  rpcProvider: JsonRpcProvider;
  assetName: string;
  assetId: string;
  assetDecimals: number;
  chainParams: AddEthereumChainParameter;
}

export type RecoverParamsSchema = {
  assetId: string;
  recipientAddress: string;
  // Callbacks
  onRecover?: (txHash: string, amountUi?: string, amountBn?: BigNumber) => void;
};

export type TokenInfo = {
  name: string;
  chainId: number;
  symbol: string;
  decimals: number;
  logo?: string;
  chain: string;
  network: string;
  networkId: number;
  assetId: string
  rpc: string[];
  faucets: string[];
  infoURL: string;
};

export type SetupParamsSchema = {
  routerPublicIdentifier: string; // "vectorA876de..."
  loginProvider: any;
  senderChainProvider: string;
  senderAssetId: string;
  recipientChainProvider: string;
  recipientAssetId: string;
  senderChainId?: number;
  recipientChainId?: number;
  iframeSrcOverride?: string;
};


export type WithdrawParamsSchema = {
  recipientAddress: string;
  onFinished?: (txHash: string, amountUi?: string, amountBn?: BigNumber) => void;
  withdrawalCallTo?: string;
  withdrawalCallData?: string;
  generateCallData?: (toWithdraw: string, toAssetId: string, node: BrowserNode) => Promise<{ callData?: string }>;
};

export type DepositParamsSchema = {
  transferAmount: string;
  webProvider: Web3Provider;
  preTransferCheck?: boolean;
  // callback
  onDeposited?: (txHash: string) => void;
};

export type EvtContainer = {
  [EngineEvents.CONDITIONAL_TRANSFER_CREATED]: Evt<ConditionalTransferCreatedPayload>;
  [EngineEvents.CONDITIONAL_TRANSFER_RESOLVED]: Evt<ConditionalTransferResolvedPayload>;
  [EngineEvents.DEPOSIT_RECONCILED]: Evt<DepositReconciledPayload>;
  [EngineEvents.WITHDRAWAL_RECONCILED]: Evt<WithdrawalReconciledPayload>;
  [EngineEvents.WITHDRAWAL_RESOLVED]: Evt<WithdrawalResolvedPayload>;
};


