import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import {
  SharedTokenBalanceProperties,
  ZapperCoinSymbols,
} from "../../models/Zapper";

declare interface DepositProps {
  onDeposit: (amount: number) => void;
  walletBalance: SharedTokenBalanceProperties[];
  tokenToDeposit?: ZapperCoinSymbols;
}

// This component is in charge of figuring out how much of a token a user should deposit.
//
// This component is a React functional component more info can be found:
// https://reactjs.org/docs/components-and-props.html#function-and-class-components
// It currently allows a user to pick a number, or to deposit max holidings of specified coin.
export const DepositComponent = ({
  onDeposit,
  walletBalance,
  tokenToDeposit = ZapperCoinSymbols.Dai,
}: DepositProps) => {
  // Float value of `userTypeDeposit` that is sent to Aave.
  const [depositAmount, setDepositAmount] = useState(0.0);
  // Needs to be a string so user can type in decimals.
  const [userTypedDeposit, setuserTypedDeposit] = useState("");
  const [isValidNumber, setIsValidNumber] = useState(false);
  // Total number of tokens a user can deposit.
  const [maxAmountToDeposit, setMaxAmountToDeposit] = useState(0.0);

  // Only want this effect to run once when the component is first loaded.
  useEffect(() => {
    const desiredToken = walletBalance
      .map((token) => token)
      .filter((token) => token.symbol == tokenToDeposit)[0];
    if (desiredToken) {
      setMaxAmountToDeposit(desiredToken.balance);
    }
  }, []);
  // Callback/event handlers for various DOM events.
  const updateAmountToDeposit = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;
    setuserTypedDeposit(inputValue);
    const inputValueAsFloat = parseFloat(inputValue);
    // Need to parseAsFloat in order to convert to number.
    if (!isNaN(inputValueAsFloat)) {
      setIsValidNumber(true);
      setDepositAmount(inputValueAsFloat);
    } else {
      setIsValidNumber(false);
    }
  };
  const sendDeposit = () => {
    console.log(depositAmount);
    onDeposit(depositAmount);
  };
  const setDepositValueAsMax = () => {
    setuserTypedDeposit(`${maxAmountToDeposit}`);
    setDepositAmount(maxAmountToDeposit);
    setIsValidNumber(true);
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>Amount</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          aria-label="Balance (to the nearest 18 decimal place)"
          onChange={updateAmountToDeposit}
          value={userTypedDeposit}
        />
        <InputGroup.Append>
          <Button onClick={setDepositValueAsMax}>Max</Button>
        </InputGroup.Append>
      </InputGroup>
      {isValidNumber ? (
        <Button className="mr-2" onClick={sendDeposit}>
          Deposit
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};
