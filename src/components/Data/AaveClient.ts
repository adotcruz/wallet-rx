import { ComputedUserReserve, v2 } from "@aave/protocol-js";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import {
  ZapperAaveBalance,
  ZapperAaveTokenCategory,
  ZapperCoinSymbols,
  ZapperSupportedProtocols,
} from "../../models/Zapper";
import { V2_RESERVES, V2_USER_RESERVES } from "./Query";

export const AaveClient = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic",
  }),
  cache: new InMemoryCache(),
});
// NOTE: The FormatAaveReserve function formats the data returned from the 
// aave SDK into a Zapper object, even though the response itself is not technically 
// from Zapper. We can change this in the future by renaming the ZapperAaveBalance 
// object to something generic like AaveBalance
export class AaveService {
  static FormatAaveReserve(
    reserve: ComputedUserReserve
  ): ZapperAaveBalance {
    return {
      symbol: reserve.reserve.symbol as ZapperCoinSymbols,
      label: reserve.reserve.name,
      protocol: ZapperSupportedProtocols.Aave,
      protocolDisplay: "",
      protocolSymbol: ZapperSupportedProtocols.Aave,
      price: 0,
      type: "",
      category: ZapperAaveTokenCategory.Deposit,
      apy: parseFloat(reserve.reserve.liquidityRate),
      address: reserve.reserve.underlyingAsset,
      img: "none.jpg",
      decimals: reserve.reserve.decimals,
      balanceRaw: "",
      balance: parseFloat(reserve.underlyingBalance),
      balanceUSD: parseFloat(reserve.underlyingBalanceUSD),
    };
  }

  static async GetAaveUserHoldings(
    address: string,
    ethPrice: number
  ): Promise<ZapperAaveBalance[]> {
    let lowercaseAddress = address.toLowerCase();
    const v2Reserves = await AaveClient.query({
      query: V2_RESERVES,
      fetchPolicy: "network-only",
    });
    const v2UserReserves = await AaveClient.query({
      query: V2_USER_RESERVES,
      variables: {
        id: lowercaseAddress,
      },
      fetchPolicy: "network-only",
    });
    let usdPriceEth = (1 / ethPrice) * 1000000000000000000;
    let v2UserSummary = v2.formatUserSummaryData(
      v2Reserves.data.reserves,
      v2UserReserves.data.userReserves,
      lowercaseAddress,
      usdPriceEth,
      Math.floor(Date.now() / 1000)
    );

    let reserves = v2UserSummary.reservesData;
    let aaveTokenBalances = reserves.map((reserve: ComputedUserReserve) =>
      this.FormatAaveReserve(reserve)
    );

    console.log("v2 user summary array: ", reserves);
    console.log("formatted to zapper: ", aaveTokenBalances);

    return aaveTokenBalances;
  }
}
