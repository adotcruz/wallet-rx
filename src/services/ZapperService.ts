import {
  ZapperAaveBalance,
  ZapperAaveBalanceResponse,
  ZapperCoinPrice,
  ZapperCoinSymbols,
  ZapperNetworks,
  ZapperProtocolBalanceProductLabel,
  ZapperSupportedProtocolWalletBalances,
} from "../models/Zapper";
import { HttpService } from "./HttpService";

const ZapperEndpoint = "/zapper";
const ZapperApiKey = "96e0cc51-a62e-42ca-acee-910ea7d2a241";

export class ZapperService {
  // This function gets the current Ethereum price on the specified `network`.
  //
  // Currently Voltaire only exists in Polygon, so we by default use the Polygon network.
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

  //TODO(adotcruz): Implement function that gets all the tokens in a user wallet.

  //This function gets all the tokens a user has lended in aave, as well as each respective APY.
  //
  // By default Protocol is set to Aave, and Network is set to Polygon, but this can be made
  // more generic as more support is added to different protocols/networks.
  static async GetUserAaveHoldings(
    address: string,
    protocol: ZapperSupportedProtocolWalletBalances = ZapperSupportedProtocolWalletBalances.Aave,
    network: ZapperNetworks = ZapperNetworks.polygon
  ): Promise<ZapperAaveBalance[]> {
    // Address must always be treated as lowercase for some functions.
    const standardizedAddress = address.toLowerCase();
    const endpoint = `v1/protocols/${protocol}/balances`;
    const params = `?addresses%5B%5D=${standardizedAddress}&network=${network}&api_key=${ZapperApiKey}`;
    try {
      const userAaveResponse = (await HttpService.get<ZapperAaveBalanceResponse>(
        `${ZapperEndpoint}/${endpoint}${params}`
      )) as ZapperAaveBalanceResponse;
      const userProducts = userAaveResponse[standardizedAddress];
      console.log("user account holdings are", userProducts);
      // Must find the products that are related to "Aave V2".
      for (const aaveProducts of userProducts.products) {
        if (aaveProducts.label == ZapperProtocolBalanceProductLabel.AaveV2) {
          console.log("found aave v2 holdings for user");
          return aaveProducts.assets;
        }
      }
      return [];
    } catch (error) {
      console.log("request failed", error);
      return [];
    }
  }
}
