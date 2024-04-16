import Decimal from "decimal.js";

import { decimalMax, getBurrow } from "../../utils";
import { expandTokenDecimal } from "../helper";
import { ChangeMethodsOracle, ChangeMethodsLogic } from "../../interfaces";
import { getMetadata, prepareAndExecuteTransactions } from "../tokens";
import { Transaction } from "../wallet";
import { transformAccount } from "../../transformers/account";
import getAccount from "../../api/get-account";

export async function repayFromDeposits({
  tokenId,
  amount,
  extraDecimals,
  isMax,
  enable_pyth_oracle,
}: {
  tokenId: string;
  amount: string;
  extraDecimals: number;
  isMax: boolean;
  enable_pyth_oracle: boolean;
}) {
  const { logicContract, oracleContract } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const account = await getAccount().then(transformAccount);
  if (!account) return;

  const extraDecimalMultiplier = expandTokenDecimal(1, extraDecimals);
  const expandedAmount = expandTokenDecimal(amount, decimals);

  const suppliedBalance = new Decimal(account.portfolio?.supplied[tokenId]?.balance || 0);
  const decreaseCollateralAmount = decimalMax(
    expandedAmount.mul(extraDecimalMultiplier).sub(suppliedBalance),
    0,
  );

  const transactions: Transaction[] = [];
  const repayTemplate = {
    Repay: {
      token_id: tokenId,
      amount: isMax ? undefined : expandedAmount.mul(extraDecimalMultiplier).toFixed(0),
    },
  };
  const decreaseCollateralTemplate = {
    DecreaseCollateral: {
      token_id: tokenId,
      amount: decreaseCollateralAmount.toFixed(0),
    },
  };
  transactions.push({
    receiverId: enable_pyth_oracle ? logicContract.contractId : oracleContract.contractId,
    functionCalls: [
      {
        methodName: enable_pyth_oracle
          ? ChangeMethodsLogic[ChangeMethodsLogic.execute_with_pyth]
          : ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
        args: enable_pyth_oracle
          ? {
              actions: [
                ...(decreaseCollateralAmount.gt(0) ? [decreaseCollateralTemplate] : []),
                repayTemplate,
              ],
            }
          : {
              receiver_id: logicContract.contractId,
              msg: JSON.stringify({
                Execute: {
                  actions: [
                    ...(decreaseCollateralAmount.gt(0) ? [decreaseCollateralTemplate] : []),
                    repayTemplate,
                  ],
                },
              }),
            },
      },
    ],
  });

  await prepareAndExecuteTransactions(transactions);
}
