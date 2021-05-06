import { TxBuilderV2, Network, Market } from "@aave/protocol-js";
import { ethers } from "ethers";

// https://docs.aave.com/developers/deployed-contracts/matic-polygon-market
const tokenReserves = {
  USDC_Polygon: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  USDC_Mainnet: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  DAI_Polygon: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  DAI_Mainnet: "0x6b175474e89094c44da98b954eedeac495271d0f",
};

export const deposit = async (provider, accountAddress) => {
  const customProvider = new ethers.providers.Web3Provider(provider);
  console.log("CUSTOM PROVIDER: ", customProvider);

  const txBuilder = new TxBuilderV2(Network.polygon, customProvider);
  console.log("txbuilder: ", txBuilder);

  const lendingPool = txBuilder.getLendingPool(Market.Proto); // get all lending pool methods
  console.log("lending pool: ", lendingPool);

  console.log("triggering lending pool deposit for user ", accountAddress);
  // The lendingResponse a Promise array of ethereum transactions, which are executed with sendTransaction()
  // https://github.com/aave/aave-js/tree/8c4131acef1a908d69a328a6925a1caf65df7375#lending-pool-v2
  const lendingResponse = await lendingPool.deposit({
    user: accountAddress,
    reserve: tokenReserves.USDC_Polygon,
    // TODO: update to take actual input for reserve and amount (remove hard-coding)
    amount: "1",
  });

  //   A Signer in ethers is an abstraction of an Ethereum Account, which can be used to sign messages and transactions
  //   https://docs.ethers.io/v5/api/signer/
  const signer = customProvider.getSigner();
  console.log("CURRENT SIGNER", signer);

  // Iterate through list of transactions, trigger them one by one
  const results = [];
  for (const t in lendingResponse) {
    let currentTx = await lendingResponse[t].tx();
    console.log("CURRENT TX: ", currentTx);
    // submit the txn (needs to be signed by user)
    let tx = await signer.sendTransaction(currentTx);
    // we then wait for one block confirmation before sending the next request
    let receipt = await tx.wait(1);
    console.log("SENDING TX", lendingResponse[t].txType, tx, receipt);
    results.push(tx);
  }
  console.log("ALL RESULTS: ", results);
};
