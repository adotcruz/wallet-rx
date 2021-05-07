import { v2 } from "@aave/protocol-js";
import Torus from "@toruslabs/torus-embed";
import * as React from "react";
import Button from "react-bootstrap/Button";
import { hot } from "react-hot-loader";
import Web3 from "web3";
import { GenericTokenBalance, ZapperAaveBalance } from "../models/Zapper";
import { ZapperService } from "../services/ZapperService";
import { initializeTorusConnection, signUserIntoTorus } from "../web3/wallet";
import { ExtendedWeb3WindowInterface } from "../web3/web3";
import "./../assets/scss/App.scss";
import { UserHoldingsComponent } from "./account/UserHoldings";
import { AaveClient } from "./Data/AaveClient";
import { V2_RESERVES, V2_USER_RESERVES } from "./Data/Query.js";
import { DepositComponent } from "./deposit/Deposit";
import { deposit } from "./Lend/AaveAction";
const reactLogo = require("./../assets/img/react_logo.svg");

export type Web3Account = string;

export interface AppState {
  isVerified: boolean;
  userReserves: string[];
  aaveHoldings?: ZapperAaveBalance[];
  // Users wallet hash.
  account?: Web3Account;
  currentEthPrice?: number;
  torus?: Torus;
  walletHoldings?: GenericTokenBalance[];
}

class App extends React.Component<Record<string, unknown>, AppState> {
  private web3: ExtendedWeb3WindowInterface;
  private mainAccount?: Web3Account;

  constructor(props) {
    super(props);
    this.state = {
      currentEthPrice: 0,
      isVerified: false,
      userReserves: [],
    };

    // Need to bind to `this` since this function is called from the DOM, where this loses its scope.
    this.signUserIn = this.signUserIn.bind(this);
    this.depositUserAmount = this.depositUserAmount.bind(this);
  }

  // Get a users aave specific holdings.
  private async getAaveTokenBalances(address: Web3Account) {
    this.setState({
      aaveHoldings: await ZapperService.GetUserAaveHoldings(address),
    });
  }

  // Get a user tokens in their wallet.
  private async getWalletTokenBalances(address: Web3Account) {
    this.setState({
      walletHoldings: await ZapperService.GetUserTokens(address),
    });
  }

  private async getAccountInfo() {
    // Must pass in Torus provider in order for Web3 to not use MetaMask by default.
    this.web3 = new Web3(this.state.torus.provider);
    this.mainAccount = (await this.web3.eth.getAccounts())[0];
    console.log("MAIN ACCOUNT: ", this.mainAccount);
    this.setState({
      account: this.mainAccount,
      isVerified: true,
    });

    this.fetchAave(this.mainAccount, this.state.currentEthPrice);
  }

  // Function to deposit to Aave lending pool.
  depositUserAmount(amount: number) {
    deposit(this.web3.eth.currentProvider, this.state.account, `${amount}`);
  }

  // TODO: move to another module like aave-utils
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
    await this.tryToSignUserInAutomatically();
  }

  private async tryToSignUserInAutomatically() {
    console.log("auto user sign-in", this.state.torus);
    if (this.state.torus.currentVerifier != "") {
      await this.setUpSignedInUser();
    }
  }

  // Once user is logged in then we can finish web3 set-up.
  private async setUpSignedInUser() {
    await this.getAccountInfo();
    this.getAaveTokenBalances(this.state.account);
    this.getWalletTokenBalances(this.state.account);
  }

  // This is the last function with Torus set-up.
  //
  // This is called when a user clicks the button to sign-in through Torus and finishes up initialization
  // of Web3.js by adding the Torus provider.
  private async signUserIn() {
    if (!this.state.torus) return;
    try {
      // If successfully logs in then user hash is returned.
      await signUserIntoTorus(this.state.torus);
      await this.setUpSignedInUser();
    } catch (e) {
      //TODO(adotcruz): Handle the case where the user can't log-in cleanly.
      console.log("could not log user in successfully");
    }
  }

  componentDidMount() {
    this.setUpTorus();
    this.getEthereumPrice();
  }

  // Calls the Zapper API and gets the current Ethereum price on Polygon/Matic.
  private async getEthereumPrice() {
    this.setState({
      currentEthPrice: await ZapperService.GetEthereumPrice(),
    });
  }

  public render() {
    return (
      <div className="app">
        <div className="user-banner">
          <h1 className="font-weight-lighter underline--magical-thick">
            Voltaire
          </h1>
          {/* {this.state.currentEthPrice != 0 ? (
            <h4>Current Eth Price: {this.state.currentEthPrice}</h4>
          ) : (
            ""
          )} */}
          {this.state.isVerified ? (
            <div>
              <h4 className="font-weight-light">
                👋 Hello, {this.mainAccount}
              </h4>
              <div className="user-wallet-info shadow-lg p-3 mt-5 mb-5 bg-white rounded">
                {this.state.walletHoldings ? (
                  <div>
                    <h3>💰 Wallet Holdings</h3>
                    <UserHoldingsComponent
                      balances={this.state.walletHoldings}
                    ></UserHoldingsComponent>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="p-3">
                {this.state.aaveHoldings ? (
                  <div>
                    <h3>
                      📈 Deposited funds (Aave Polygon)
                      <img
                        src="https://pbs.twimg.com/profile_images/1186270065085370368/J1YJtvdI.jpg"
                        height="30"
                        className="rounded ml-2"
                      />
                    </h3>
                    <UserHoldingsComponent
                      balances={this.state.aaveHoldings}
                    ></UserHoldingsComponent>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="depositDiv shadow-lg p-3 rounded mt-2 mb-5">
                <h3>💲 Deposit to earn yield</h3>
                {this.state.walletHoldings ? (
                  <DepositComponent
                    onDeposit={this.depositUserAmount}
                    walletBalance={this.state.walletHoldings}
                  ></DepositComponent>
                ) : (
                  ""
                )}
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
