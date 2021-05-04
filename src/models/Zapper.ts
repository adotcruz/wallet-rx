// Zapper supported networks.
//
// We currently only care about Ethereum/Polygon (Matic).
export enum ZapperNetworks {
  ethereum = "ethereum",
  polygon = "polygon",
}

// Zapper specific coin symbols to differentiate coins.
export enum ZapperCoinSymbols {
  eth = "ETH",
}

// Response of `/price` endpoint.
export interface ZapperCoinPrice {
  address: string;
  decimals: number;
  symbol: string;
  price: number;
}
