import * as React from "react";
import { hot } from "react-hot-loader";
import getWeb3, { ExtendedWeb3WindowInterface } from "../web3/web3";
import { AaveClient } from "./Data/AaveClient";
import { V2_RESERVES, V2_USER_RESERVES } from "./Data/Query.js";
import { v2, TxBuilderV2, Network, Market } from "@aave/protocol-js";
import { EthereumTransactionTypeExtended } from "@aave/protocol-js";
import Web3 from "web3";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

export interface Web3Account {}

export interface AppState {
  isVerified: boolean;
  userReserves: string[];
}

class App extends React.Component<Record<string, unknown>, AppState> {
  private web3: ExtendedWeb3WindowInterface;
  private mainAccount?: Web3Account;

  constructor(props) {
    super(props);
    this.state = {
      isVerified: false,
      userReserves: [],
    };
  }

  private async getAccountInfo() {
    this.web3 = await getWeb3();

    this.mainAccount = (await this.web3.eth.getAccounts())[0];
    console.log("MAIN ACCOUNT: ", this.mainAccount);
    this.setState({
      isVerified: true,
    });

    // TODO: fetch real ETH price
    const ethPriceUsd = 2700;
    this.fetchAave(this.mainAccount, ethPriceUsd);

    // TODO: confirm which provider -- alternative below
    // const httpProvider = this.web3.eth.providers["HttpProvider"];

    const httpProvider = new Web3.providers.HttpProvider(
      "https://mainnet.infura.io/v3/a305eb1a2c9b42cdbcf61db762f8243e"
    );

    console.log("current web3 provider: ", httpProvider);

    let txBuilder;
    let lendingPool;

    txBuilder = new TxBuilderV2(Network.mainnet, httpProvider);
    console.log("txbuilder: ", txBuilder);

    lendingPool = txBuilder.getLendingPool(Market.Proto); // get all lending pool methods
    console.log("lending pool: ", lendingPool);

    let lendingResponse = await lendingPool.deposit({
      user: "0xC33D36523FBF8360792C2c372f5fE457BeeC001f",
      reserve: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      amount: "10000",
    });

    console.log("response from lending: ", lendingResponse);
  }

  // TODO: move to other module like aave-utils
  private async fetchAave(address, ethPrice) {
    let lowercaseAddress = address.toLowerCase();
    const v2Reserves = await AaveClient.query({
      query: V2_RESERVES,
      fetchPolicy: "cache-first",
    });
    const v2UserReserves = await AaveClient.query({
      query: V2_USER_RESERVES,
      variables: {
        id: lowercaseAddress,
      },
      fetchPolicy: "cache-first",
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
    let userReservesArray = [];
    reserves.forEach((reserve) => {
      const underlying = reserve.underlyingBalance;
      const underlyingUsd = reserve.underlyingBalanceUSD;
      const name = reserve.reserve.name;
      const summary = underlyingUsd + " USD and " + underlying + " " + name;

      userReservesArray.push(summary);
    });

    console.log("v2 user summary array: ", userReservesArray);

    this.setState({
      userReserves: userReservesArray,
    });
    return v2UserSummary;
  }

  componentDidMount() {
    this.getAccountInfo();
  }

  public render() {
    return (
      <div className="app">
        <div className="user-banner">
          <h1 className="font-weight-lighter underline--magical-thick">
            Voltaire
          </h1>
          {this.state.isVerified ? (
            <div>
              <h4 className="font-weight-light">Hello, {this.mainAccount}</h4>
            </div>
          ) : (
            <h3>not verified :(</h3>
          )}
        </div>

        <div className="user-wallet-info shadow-lg p-3 mb-5 bg-white rounded">
          <h3>
            Holdings in Aave (Polygon)
            <img
              src="https://pbs.twimg.com/profile_images/1186270065085370368/J1YJtvdI.jpg"
              height="30"
              className="rounded ml-2"
            />
          </h3>
          {this.state.userReserves}
        </div>
      </div>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
