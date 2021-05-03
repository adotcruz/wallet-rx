import { v2 } from "@aave/protocol-js";
import Torus from "@toruslabs/torus-embed";
import * as React from "react";
import { hot } from "react-hot-loader";
import Web3 from "web3";
import { initializeTorusConnection, signUserIntoTorus } from "../web3/wallet";
import { ExtendedWeb3WindowInterface } from "../web3/web3";
import "./../assets/scss/App.scss";
import { AaveClient } from "./Data/AaveClient";
import { V2_RESERVES, V2_USER_RESERVES } from "./Data/Query.js";
import Button from "react-bootstrap/Button";
const reactLogo = require("./../assets/img/react_logo.svg");

export interface Web3Account {}

export interface AppState {
  isVerified: boolean;
  torus?: Torus;
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

    // Need to bind to this since this function is called from the DOM.
    this.signUserIn = this.signUserIn.bind(this);
  }

  private async getAccountInfo() {
    // Must pass in Torus provider in order for Web3 to not use MetaMask by default.
    this.web3 = new Web3(this.state.torus.provider);
    this.mainAccount = (await this.web3.eth.getAccounts())[0];
    console.log("MAIN ACCOUNT: ", this.mainAccount);
    this.setState({
      isVerified: true,
    });

    // TODO: fetch real ETH price
    const ethPriceUsd = 2700;
    this.fetchAave(this.mainAccount, ethPriceUsd);
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

  // This function creates the connection to the Torus wallet when the application loads up.
  private async setUpTorus() {
    this.setState({ torus: await initializeTorusConnection() });
  }

  private async signUserIn() {
    if (!this.state.torus) return;
    try {
      // If successfully logs in then user hash is returned.
      await signUserIntoTorus(this.state.torus);
      // Once user is logged in then we can finish web3 set-up.
      await this.getAccountInfo();
    } catch (e) {
      //TODO(adotcruz): Handle the case where the user can't log-in cleanly.
      console.log("could not log user in successfully");
    }
  }

  componentDidMount() {
    this.setUpTorus();
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
          ) : (
            <div>
              <h3>not verified :(</h3>
              {this.state.torus ? (
                <Button onClick={this.signUserIn}>Sign in!</Button>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
