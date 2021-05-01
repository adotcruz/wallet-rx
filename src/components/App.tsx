import * as React from "react";
import { hot } from "react-hot-loader";
import getWeb3, { ExtendedWeb3WindowInterface } from "../web3/web3";

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
    return (
      <div className="app">
        <h1>Hello World!</h1>
        <p>Foo to the bar nice</p>
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
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
