import {
  GenericTokenBalance,
  ZapperAaveBalance,
  ZapperAddressBalanceResponse,
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

  // This function gets all the tokens in a users specified wallet.
  //
  // For V0, we only support fetching a users token in their polygon wallet.
  static async GetUserTokens(
    address: string,
    network: ZapperNetworks = ZapperNetworks.polygon
  ): Promise<GenericTokenBalance[]> {
    // Address must always be treated as lowercase for some functions.
    const standardizedAddress = address.toLowerCase();
    const endpoint = `v1/protocols/tokens/balances`;
    const params = `?addresses%5B%5D=${standardizedAddress}&network=${network}&api_key=${ZapperApiKey}`;
    try {
      const userTokensResponse = (await HttpService.get<ZapperAddressBalanceResponse>(
        `${ZapperEndpoint}/${endpoint}${params}`
      )) as ZapperAddressBalanceResponse;
      const userProducts = userTokensResponse[standardizedAddress];
      console.log("tokens in user wallet are:", userProducts);
      // Must find the products that are related to "Aave V2".
      for (const tokensInWallet of userProducts.products) {
        if (tokensInWallet.label == ZapperProtocolBalanceProductLabel.Tokens) {
          console.log("found polygon wallet tokens for user");
          return tokensInWallet.assets as GenericTokenBalance[];
        }
      }
      return [];
    } catch (error) {
      console.log("request failed", error);
      return [];
    }
  }

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
      const userAaveResponse = (await HttpService.get<ZapperAddressBalanceResponse>(
        `${ZapperEndpoint}/${endpoint}${params}`
      )) as ZapperAddressBalanceResponse;
      const userProducts = userAaveResponse[standardizedAddress];
      console.log("user account holdings are", userProducts);
      // Must find the products that are related to "Aave V2".
      for (const aaveProducts of userProducts.products) {
        if (aaveProducts.label == ZapperProtocolBalanceProductLabel.AaveV2) {
          console.log("found aave v2 holdings for user");
          return aaveProducts.assets as ZapperAaveBalance[];
        }
      }
      return [];
    } catch (error) {
      console.log("request failed", error);
      return [];
    }
  }
}
