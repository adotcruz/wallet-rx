import { TxBuilderV2, Network, Market } from "@aave/protocol-js";
import { ethers } from "ethers";

export const deposit = async (provider, accountAddress) => {
  let txBuilder;
  let lendingPool;

  let customProvider = new ethers.providers.Web3Provider(provider);
  console.log("CUSTOM PROVIDER: ", customProvider);

  txBuilder = new TxBuilderV2(Network.mainnet, customProvider);
  console.log("txbuilder: ", txBuilder);

  lendingPool = txBuilder.getLendingPool(Market.Proto); // get all lending pool methods
  console.log("lending pool: ", lendingPool);

  console.log("triggering lending pool deposit for user ", accountAddress);
  // The lendingResponse a Promise array of ethereum transactions, which are executed with sendTransaction()
  // https://github.com/aave/aave-js/tree/8c4131acef1a908d69a328a6925a1caf65df7375#lending-pool-v2
  // TODO: update to take actual input for reserve and amount (remove hard-coding)
  let lendingResponse = await lendingPool.deposit({
    user: accountAddress,
    // USDC reserve
    reserve: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    amount: "10",
  });

  //   A Signer in ethers is an abstraction of an Ethereum Account, which can be used to sign messages and transactions
  //   https://docs.ethers.io/v5/api/signer/
  let signer = customProvider.getSigner();
  console.log("CURRENT SIGNER", signer);

  // Iterate through list of transactions, trigger them one by one
  let results = [];
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