import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";

export const initializeWallet: () => Promise<Web3> = async (): Promise<Web3> => {
  const torus = new Torus({
    buttonPosition: "top-left", // default: bottom-left
  });
  await torus.init({
    buildEnv: "production", // default: production
    enableLogging: true, // default: false
    network: {
      host: "mumbai", // default: mainnet
      chainId: 80001, // default: 1
      networkName: "Mumbai Test Network", // default: Main Ethereum Network
    },
    showTorusButton: true, // default: true
  });
  console.log("torus has init");
  await torus.login({}); // await torus.ethereum.enable()
  console.log("torus has logged in");
  console.log("here");
  return new Web3(torus.provider);
};
