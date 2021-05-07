import { SharedTokenBalanceProperties } from "../../models/Zapper";
declare interface UserHoldingsProps {
  balances: SharedTokenBalanceProperties[];
}

// This component is in charge of showing a users AaveHoldings.
//
// This component is a React functional component more info can be found:
// https://reactjs.org/docs/components-and-props.html#function-and-class-components
// It currently shows a tokens label, apy, balance (in USD), balance. It shows
// all tokens present in aave.

enum tokenIcons {
  "DAI" = "https://research.binance.com/static/images/projects/dai/logo.png",
  "MATIC" = "https://icodrops.com/wp-content/uploads/2018/06/yT_5Hap9_400x400.png",
  "USDC" = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
}

export const UserHoldingsComponent = ({ balances }: UserHoldingsProps) => (
  <div>
    {balances.map((token, index) => (
      <div key={index}>
        <h5 className="font-weight-lighter">
          {" "}
          <img src={tokenIcons[token.symbol]} alt="" width="15px" />{" "}
          {token.label}
        </h5>
        <div>
          {token.balance.toFixed(4)} (${token.balanceUSD.toFixed(4)} USD)
        </div>
        <div>
          {token.apy ? (
            <p>
              {" "}
              Earning <b>{(token.apy * 100).toFixed(2)}%</b> APY
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    ))}
  </div>
);
