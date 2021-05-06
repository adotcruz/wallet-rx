// Zapper supported networks.
//
// We currently only care about Ethereum/Polygon (Matic).
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

// Zapper specific coin symbols to differentiate coins.
export enum ZapperCoinSymbols {
  Dai = "DAI",
  eth = "ETH",
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

export interface ZapperAaveBalance {
  type: string;
  category: ZapperAaveTokenCategory;
  address: string;
  symbol: ZapperCoinSymbols;
  decimals: number;
  label: string;
  img: string;
  protocol: ZapperSupportedProtocols;
  protocolDisplay: string;
  protocolSymbol: string;
  price: number;
  apy: number;
  // Raw balance value.
  balanceRaw: string;
  // Number of tokens held.
  balance: number;
  // Value of tokens held (price * balace).
  balanceUSD: number;
}

export enum ZapperAaveBalanceMetadataLabels {
  Total = "Total",
  Assets = "Assets",
  Debt = "Debt",
  // Only shows up in `ZapperAaveProductInfo`.
  Health = "Health Factor",
}

export interface ZapperAaveBalanceMetadata {
  label: ZapperAaveBalanceMetadataLabels;
  value: number;
  type: string;
}

export enum ZapperProtocolBalanceProductLabel {
  AaveV2 = "Aave V2",
}
export interface ZapperAaveProductInfo {
  label: ZapperProtocolBalanceProductLabel;
  assets: ZapperAaveBalance[];
  // Only ontains `Health Factor`.
  meta: ZapperAaveBalanceMetadata;
}

// Response of /aave-v2 balance for a user.
export interface ZapperAaveBalanceResponse {
  [address: string]: {
    products: ZapperAaveProductInfo[];
    // Contains Total and Assets values for Aave holdings.
    meta: ZapperAaveBalanceMetadata[];
  };
}
