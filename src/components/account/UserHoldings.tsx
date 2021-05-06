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
export const UserHoldingsComponent = ({
  balances: aaveHoldings,
}: UserHoldingsProps) => (
  <div>
    {aaveHoldings.map((token, index) => (
      <div key={index}>
        <h4>{token.label}</h4>
        <h5> Current APY: {token.apy}</h5>
        <div>Balance in USD: {token.balanceUSD}</div>
        <div>Balance: {token.balance}</div>
      </div>
    ))}
  </div>
);
