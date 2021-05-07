export enum TokenReserves {
  UsdcPolygon = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  UsdcMainnet = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  DaiPolygon = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  DaiMainnet = "0x6b175474e89094c44da98b954eedeac495271d0f",
}

// Matic specific token symbols to differentiate tokens.
export enum MaticTokenSymbols {
  Dai = "DAI",
  eth = "ETH",
  Matic = "MATIC",
  UsdC = "USDC",
}

export enum TokenReservesSymbols {
  UsdcPolygon = MaticTokenSymbols.UsdC,
  DaiPolygon = MaticTokenSymbols.Dai,
}
