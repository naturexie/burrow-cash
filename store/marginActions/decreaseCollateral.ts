import BN from "bn.js";
import { getBurrow } from "../../utils";
import { expandTokenDecimal } from "../helper";
import { ChangeMethodsLogic } from "../../interfaces";
import { Transaction } from "../wallet";
import { prepareAndExecuteTransactions } from "../tokens";
import { Assets } from "../../redux/assetState";

export async function decreaseCollateral({
  pos_id,
  token_c_id,
  amount,
  assets,
}: {
  pos_id: string;
  token_c_id: string;
  amount: string;
  assets: Assets;
}) {
  const { logicContract } = await getBurrow();
  const transactions: Transaction[] = [];
  const expanded_c_amount = expandTokenDecimal(
    amount,
    assets[token_c_id].metadata.decimals + assets[token_c_id].config.extra_decimals,
  );
  transactions.push({
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.margin_execute_with_pyth],
        args: {
          actions: [
            {
              DecreaseCollateral: {
                pos_id,
                amount: expanded_c_amount.toFixed(0),
              },
            },
          ],
        },
        gas: new BN("300000000000000"),
      },
    ],
  });
  await prepareAndExecuteTransactions(transactions);
}
