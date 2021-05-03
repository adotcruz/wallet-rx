import Web3 from "web3";

interface Web3ExtendedProperties {
  currentProvider: any;
}

interface EthExtendedProperties {
  getAccounts: () => Promise<any[]>;
}
export interface ExtendedWeb3WindowInterface {
  ethereum?: any;
  web3?: Web3ExtendedProperties;
  eth;
}

declare const web3: Web3ExtendedProperties;

const getWeb3: () => Promise<ExtendedWeb3WindowInterface> = () =>
  new Promise((resolve) => {
    window.addEventListener("load", () => {
      let currentWeb3;

      if (((window as unknown) as ExtendedWeb3WindowInterface).ethereum) {
        currentWeb3 = new Web3(
          ((window as unknown) as ExtendedWeb3WindowInterface).ethereum
        );
        try {
          // Request account access if needed
          ((window as unknown) as ExtendedWeb3WindowInterface).ethereum.enable();
          // Acccounts now exposed
          resolve(currentWeb3);
        } catch (error) {
          // User denied account access...
          alert("Please allow access for the app to work");
        }
      } else if (((window as unknown) as ExtendedWeb3WindowInterface).web3) {
        ((window as unknown) as ExtendedWeb3WindowInterface).web3 = new Web3(
          (web3 as Web3ExtendedProperties).currentProvider
        );
        // Acccounts always exposed
        resolve(currentWeb3);
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    });
  });

export default getWeb3;
