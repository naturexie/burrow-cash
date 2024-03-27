import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getGains } from "./getAccountRewards";

export const getAverageAPY = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account,
  (assets, account) => {
    const [gainCollateral, totalCollateral] = getGains(account.portfolio, assets, "collateral");
    const [gainSupplied, totalSupplied] = getGains(account.portfolio, assets, "supplied");
    const [gainBorrowed, totalBorrowed] = getGains(account.portfolio, assets, "borrowed");
    const suplyGains = gainCollateral + gainSupplied;
    const supplyTotals = totalCollateral + totalSupplied;
    const averageSupplyApy = supplyTotals > 0 ? (suplyGains / supplyTotals) * 100 : 0;
    const averageBorrowedApy = totalBorrowed > 0 ? (gainBorrowed / totalBorrowed) * 100 : 0;
    return { averageSupplyApy, averageBorrowedApy };
  },
);
