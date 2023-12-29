import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAccountRewards } from "./getAccountRewards";

export const getExtraDailyTotals = ({ isStaking = false }: { isStaking: boolean }) =>
  createSelector(
    (state: RootState) => state.assets,
    getAccountRewards,
    (state: RootState) => state.app.config,
    (assets, rewards, config) => {
      if (!hasAssets(assets)) return 0;
      if (!isStaking) {
        console.info(`=====getExtraDailyTotals1=====`);
      }
      const { extra, brrr } = rewards;
      const gainBrrr =
        (brrr.dailyAmount || 0) * (assets.data[config.booster_token_id]?.price?.usd || 0);
      if (!isStaking) {
        console.info(
          `token:${config.booster_token_id} gainBrrr:${gainBrrr}=> daily:${
            brrr.dailyAmount
          }*price:${assets.data[config.booster_token_id]?.price?.usd}`,
        );
      }
      const gainExtra = Object.keys(extra).reduce((acc, tokenId) => {
        const price = assets.data[tokenId]?.price?.usd || 0;
        const daily = isStaking ? extra[tokenId].newDailyAmount : extra[tokenId].dailyAmount;
        if (!isStaking) {
          console.info(`token:${tokenId} acc:${acc}=> daily:${daily}*price:${price}`);
        }
        return acc + daily * price;
      }, 0);

      return gainExtra + gainBrrr;
    },
  );
