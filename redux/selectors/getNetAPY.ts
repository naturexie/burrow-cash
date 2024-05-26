import { createSelector } from "@reduxjs/toolkit";

import Decimal from "decimal.js";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getExtraDailyTotals } from "./getExtraDailyTotals";
import { getAccountRewards, getGains, getGainsArr } from "./getAccountRewards";
import { getProtocolRewards } from "./getProtocolRewards";
import { shrinkToken } from "../../store/helper";

export const getNetAPY = ({ isStaking = false }: { isStaking: boolean }) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    getExtraDailyTotals({ isStaking }),
    (assets, account, extraDaily) => {
      if (!hasAssets(assets)) return 0;
      const { borrows, collaterals } = account?.portfolio || {};
      const [gainBorrowed, totalBorrowed] = getGainsArr(borrows, assets);
      const [gainCollateral, totalCollateral] = getGainsArr(collaterals, assets);
      const [gainSupplied, totalSupplied] = getGains(account.portfolio, assets, "supplied");
      const gainExtra = extraDaily * 365;

      const netGains = gainCollateral + gainSupplied + gainExtra - gainBorrowed;
      const netTotals = totalCollateral + totalSupplied - totalBorrowed;
      const netAPY = (netGains / netTotals) * 100;

      return netAPY || 0;
    },
  );

export const getNetTvlAPY = ({ isStaking = false }) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    getAccountRewards,
    (assets, account, rewards) => {
      if (!hasAssets(assets)) return 0;
      const [, totalSupplied] = getGains(account.portfolio, assets, "supplied");
      const [, totalCollateral] = getGainsArr(account.portfolio.collaterals, assets);
      const [, totalBorrowed] = getGainsArr(account.portfolio.borrows, assets);

      const netTvlRewards = Object.values(rewards.net).reduce(
        (acc, r) => acc + (isStaking ? r.newDailyAmount : r.dailyAmount) * r.price,
        0,
      );
      const netLiquidity = totalCollateral + totalSupplied - totalBorrowed;
      let apy;
      if (new Decimal(netLiquidity).gt(0)) {
        apy = ((netTvlRewards * 365) / netLiquidity) * 100;
      }
      return apy || 0;
    },
  );
export const getTotalNetTvlAPY = createSelector(
  getProtocolRewards,
  (state: RootState) => state.assets,
  (rewards, assets) => {
    if (!rewards.length) return 0;
    const totalDailyNetTvlRewards = rewards.reduce((acc, r) => acc + r.dailyAmount * r.price, 0);
    const totalProtocolLiquidity = Number(
      shrinkToken(Object.values(assets.netTvlFarm || {})?.[0]?.boosted_shares, 18),
    );
    if (totalProtocolLiquidity > 0) {
      return ((totalDailyNetTvlRewards * 365) / totalProtocolLiquidity) * 100;
    }
    return 0;
  },
);
