import * as React from "react";
import { hot } from "react-hot-loader";
import getWeb3, { ExtendedWeb3WindowInterface } from "../web3/web3";
import { AaveClient } from "./Data/AaveClient";
import { V2_RESERVES, V2_USER_RESERVES } from "./Data/Query.js";
import { v2 } from "@aave/protocol-js";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

export interface Web3Account {}

export interface AppState {
  isVerified: boolean;
}

class App extends React.Component<Record<string, unknown>, AppState> {
  private web3: ExtendedWeb3WindowInterface;

  private mainAccount?: Web3Account;

  constructor(props) {
    super(props);
    this.state = {
      isVerified: false,
    };
  }

  private async setUpWeb3() {
    this.web3 = await getWeb3();
    this.mainAccount = (await this.web3.eth.getAccounts())[0];
    console.log(this.mainAccount);
    this.setState({
      isVerified: true,
    });
  }

  componentDidMount() {
    this.setUpWeb3();
  }

  public render() {
    // TODO: fetch real ETH price
    const ethPriceUsd = 2700;
    this.fetchAave(this.mainAccount, ethPriceUsd);
    return (
      <div className="app">
        <h1>Hello World!</h1>
        <p>Foo to the barz nice</p>
        <img src={reactLogo.default} height="480" />
        {this.state.isVerified ? (
          <div>
            <h1>You're verified!!</h1>
            <h3>welcome {this.mainAccount}</h3>
          </div>
        ) : (
          <h3>not verified :(</h3>
        )}
      </div>
    );
  }

  private async fetchAave(address, ethPrice) {
    console.log("fetching aave for account " + this.mainAccount);
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
    console.log("v2 user summary: ", v2UserSummary);
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
