import BN from "bn.js";
import Decimal from "decimal.js";

import { decimalMin, getBurrow } from "../../utils";
import { expandTokenDecimal } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsOracle } from "../../interfaces";
import { Transaction } from "../wallet";
import { getMetadata, prepareAndExecuteTransactions } from "../tokens";
import { getAccountDetailed } from "../accounts";

export async function adjustCollateral({
  tokenId,
  extraDecimals,
  amount,
  isMax,
  enable_pyth_oracle,
}: {
  tokenId: string;
  extraDecimals: number;
  amount: string;
  isMax: boolean;
  enable_pyth_oracle: boolean;
}) {
  const { oracleContract, logicContract, account, call } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const detailedAccount = (await getAccountDetailed(account.accountId))!;

  const suppliedBalance = new Decimal(
    detailedAccount.supplied.find((a) => a.token_id === tokenId)?.balance || 0,
  );

  const collateralBalance = new Decimal(
    detailedAccount.collateral.find((a) => a.token_id === tokenId)?.balance || 0,
  );

  const totalBalance = suppliedBalance.add(collateralBalance);

  const expandedAmount = isMax
    ? totalBalance
    : decimalMin(totalBalance, expandTokenDecimal(amount, decimals + extraDecimals));

  if (expandedAmount.gt(collateralBalance)) {
    await prepareAndExecuteTransactions([
      {
        receiverId: logicContract.contractId,
        functionCalls: [
          {
            methodName: enable_pyth_oracle
              ? ChangeMethodsLogic[ChangeMethodsLogic.execute_with_pyth]
              : ChangeMethodsLogic[ChangeMethodsLogic.execute],
            gas: new BN("100000000000000"),
            args: {
              actions: [
                {
                  IncreaseCollateral: {
                    token_id: tokenId,
                    max_amount: !isMax
                      ? expandedAmount.sub(collateralBalance).toFixed(0)
                      : undefined,
                  },
                },
              ],
            },
          },
        ],
      } as Transaction,
    ]);
  } else if (expandedAmount.lt(collateralBalance)) {
    const decreaseCollateralTemplate = {
      DecreaseCollateral: {
        token_id: tokenId,
        max_amount: expandedAmount.gt(0)
          ? collateralBalance.sub(expandedAmount).toFixed(0)
          : undefined,
      },
    };
    await prepareAndExecuteTransactions([
      {
        receiverId: enable_pyth_oracle ? logicContract.contractId : oracleContract.contractId,
        functionCalls: [
          {
            methodName: enable_pyth_oracle
              ? ChangeMethodsLogic[ChangeMethodsLogic.execute_with_pyth]
              : ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
            gas: new BN("300000000000000"),
            args: enable_pyth_oracle
              ? {
                  actions: [decreaseCollateralTemplate],
                }
              : {
                  receiver_id: logicContract.contractId,
                  msg: JSON.stringify({
                    Execute: {
                      actions: [decreaseCollateralTemplate],
                    },
                  }),
                },
          },
        ],
      } as Transaction,
    ]);
  }
}
