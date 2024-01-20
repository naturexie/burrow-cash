import Decimal from "decimal.js";

import BN from "bn.js";
import { decimalMax, getBurrow } from "../../utils";
import { expandTokenDecimal, expandToken } from "../helper";
import { ChangeMethodsOracle, ChangeMethodsLogic } from "../../interfaces";
import { getMetadata, prepareAndExecuteTransactions } from "../tokens";
import { Transaction } from "../wallet";
import { transformAccount } from "../../transformers/account";
import getAccount from "../../api/get-account";
import { DEFAULT_POSITION } from "../../utils/config";
import { NEAR_DECIMALS } from "../constants";

export async function repayFromDeposits({
  tokenId,
  amount,
  extraDecimals,
  position,
  isMax,
}: {
  tokenId: string;
  amount: string;
  extraDecimals: number;
  position?: string;
  isMax: boolean;
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
  // TODO
  const transactions: Transaction[] = [];
  const repayTemplate =
    !position || position === DEFAULT_POSITION
      ? {
          Repay: {
            token_id: tokenId,
            amount: isMax ? undefined : expandedAmount.mul(extraDecimalMultiplier).toFixed(0),
          },
        }
      : {
          PositionRepay: {
            asset_amount: {
              amount: isMax ? undefined : expandedAmount.mul(extraDecimalMultiplier).toFixed(0),
              token_id: tokenId,
            },
            position,
          },
        };
  transactions.push({
    receiverId: oracleContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
        args: {
          receiver_id: logicContract.contractId,
          msg: JSON.stringify({
            Execute: {
              actions: [
                ...(decreaseCollateralAmount.gt(0)
                  ? [
                      {
                        DecreaseCollateral: {
                          token_id: tokenId,
                          amount: decreaseCollateralAmount.toFixed(0),
                        },
                      },
                    ]
                  : []),
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
