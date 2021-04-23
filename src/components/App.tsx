import * as React from "react";
import { hot } from "react-hot-loader";
import getWeb3, { ExtendedWeb3WindowInterface} from "../web3/web3";

const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

class App extends React.Component<Record<string, unknown>, undefined> {

  private web3: ExtendedWeb3WindowInterface;

  componentDidMount() {
    getWeb3().then((result: ExtendedWeb3WindowInterface) => {
      this.web3 = result;
    })
  }

  public render() {
    return (
      <div className="app">
        <h1>Hello World!</h1>
        <p>Foo to the barz nice</p>
        <img src={reactLogo.default} height="480" />
      </div>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
