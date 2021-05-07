import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";

// This function creates the connection to the Torus api.
//
// The configuration passed into `torus.init` is what determines which network Torus is on, as well
// as other block chain information
export const initializeTorusConnection: () => Promise<Torus> = async (): Promise<Torus> => {
  const torus = new Torus({
  });
  await torus.init({
    buildEnv: "production", // default: production
    enableLogging: true, // default: false
    network: {
      host: "matic", // default: mainnet
      chainId: 137, // default: 1
      networkName: "Matic Network", // default: Main Ethereum Network
    },
    showTorusButton: true, // default: true
  });
  return torus;
};

// Function opens Torus modal for user to sign-in.
//
// If user signs in successfully then account hash is returned
export const signUserIntoTorus = (torus: Torus): Promise<string[]> => {
  return torus.login({}); // await torus.ethereum.enable()
};

// Function is unsued but leaving here for reference in case we ever want to do it all
// one step.
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
