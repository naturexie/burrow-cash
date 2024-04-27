import BN from "bn.js";
import { getBurrow } from "../../utils";
import { expandTokenDecimal } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsToken } from "../../interfaces";
import { Transaction } from "../wallet";
import { prepareAndExecuteTransactions } from "../tokens";
import { Assets } from "../../redux/assetState";

export async function increaseCollateral({
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
  const expanded_token_c_amount = expandTokenDecimal(amount, assets[token_c_id].metadata.decimals);
  transactions.push({
    receiverId: token_c_id,
    functionCalls: [
      {
        methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
        gas: new BN("100000000000000"),
        args: {
          receiver_id: logicContract.contractId,
          amount: expanded_token_c_amount.toFixed(0),
          msg: '"DepositToMargin"',
        },
      },
    ],
  });
  transactions.push({
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.margin_execute_with_pyth],
        args: {
          actions: [
            {
              IncreaseCollateral: {
                pos_id,
                amount: expanded_c_amount.toFixed(0),
              },
            },
          ],
        },
        gas: new BN("100000000000000"),
      },
    ],
  });
  await prepareAndExecuteTransactions(transactions);
}
