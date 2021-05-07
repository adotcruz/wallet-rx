import { MaticTokenSymbols } from "./Tokens";

// Zapper supported networks.
//
// We currently only care about Ethereum/Polygon(Matic).
export enum ZapperNetworks {
  ethereum = "ethereum",
  polygon = "polygon",
}

export enum ZapperSupportedProtocolWalletBalances {
  Aave = "aave-v2",
}

export enum ZapperSupportedProtocols {
  Aave = "aave",
}

// Response of `/price` endpoint.
export interface ZapperCoinPrice {
  address: string;
  decimals: number;
  symbol: string;
  price: number;
}

// All models below are specific for Aave (can be generic for Protocols for future versions).
export enum ZapperAaveTokenCategory {
  Deposit = "deposit",
}

export enum ZapperAaveTokenType {
  EarnsInterest = "interest-bearing",
}

export interface SharedTokenBalanceProperties {
  type: string;
  category: ZapperAaveTokenCategory;
  address: string;
  symbol: MaticTokenSymbols;
  decimals: number;
  label: string;
  img: string;
  price: number;
  apy: number;
  // Raw balance value.
  balanceRaw: string;
  // Number of tokens held.
  balance: number;
  // Value of tokens held (price * balace).
  balanceUSD: number;
}

export declare type GenericTokenBalance = SharedTokenBalanceProperties;
export interface ZapperAaveBalance extends SharedTokenBalanceProperties {
  protocol: ZapperSupportedProtocols;
  protocolDisplay: string;
  protocolSymbol: string;
}

export enum ZapperAaveBalanceMetadataLabels {
  Total = "Total",
  Assets = "Assets",
  Debt = "Debt",
  // Only shows up in `ZapperAaveProductInfo`.
  Health = "Health Factor",
}

export interface ZapperAddressBalanceMetadata {
  label: ZapperAaveBalanceMetadataLabels;
  value: number;
  type: string;
}

export enum ZapperProtocolBalanceProductLabel {
  AaveV2 = "Aave V2",
  Tokens = "Tokens",
}
export interface ZapperAddressProductInfo {
  label: ZapperProtocolBalanceProductLabel;
  assets: ZapperAaveBalance[] | GenericTokenBalance[];
  // Only ontains `Health Factor`.
  meta: ZapperAddressBalanceMetadata;
}

// Response of /aave-v2 balance for a user.
export interface ZapperAddressBalanceResponse {
  [address: string]: {
    products: ZapperAddressProductInfo[];
    // Contains Total and Assets values for Aave holdings.
    meta: ZapperAddressBalanceMetadata[];
  };
}
