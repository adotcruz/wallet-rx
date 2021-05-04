import { HttpService } from "./HttpService";
import {
  ZapperCoinPrice,
  ZapperCoinSymbols,
  ZapperNetworks,
} from "../models/Zapper";

const ZapperEndpoint = "/zapper";
const ZapperApiKey = "96e0cc51-a62e-42ca-acee-910ea7d2a241";

export class ZapperService {
  static async GetEthereumPrice(
    network: ZapperNetworks = ZapperNetworks.polygon
  ): Promise<number> {
    const priceEndpoint = `v1/prices?network=${network}&api_key=${ZapperApiKey}`;
    try {
      const coinPrices = (await HttpService.get<ZapperCoinPrice[]>(
        `${ZapperEndpoint}/${priceEndpoint}`
      )) as ZapperCoinPrice[];
      console.log("coin prices fetched from zapper");
      for (const coinPrice of coinPrices) {
        if (coinPrice.symbol == ZapperCoinSymbols.eth) {
          console.log("ethereum price was found");
          return coinPrice.price;
        }
      }
      return 0;
    } catch (error) {
      console.log("request failed", error);
      return 0;
    }
  }
}
