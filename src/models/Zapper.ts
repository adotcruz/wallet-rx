export enum ZapperNetworks {
  ethereum = "ethereum",
  polygon = "polygon",
}

export enum ZapperCoinSymbols {
  eth = "ETH",
}

export interface ZapperCoinPrice {
  address: string;
  decimals: number;
  symbol: string;
  price: number;
}
