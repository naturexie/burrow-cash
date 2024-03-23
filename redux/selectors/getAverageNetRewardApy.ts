import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { shrinkToken } from "../../store";
import { toUsd } from "../utils";
import { Farm, FarmData, Portfolio } from "../accountState";
import { Asset, AssetsState } from "../assetState";

export const getAverageNetRewardApy2 = () =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      const suppliedKeys = Object.keys(account.portfolio.supplied);
      const filteredAssets = Object.values(assets.data).filter(
        (asset) => suppliedKeys.includes(asset.token_id) && asset.config.net_tvl_multiplier > 0,
      );
      const assetsTotalValue = filteredAssets.reduce((total, asset) => {
        return total + (asset.price?.usd || 0);
      }, 0);
      const farmKeys = Object.keys(account.portfolio.farms.netTvl);
      const totalNetTvl = farmKeys.reduce((total, farmKey) => {
        const farm = account.portfolio.farms.netTvl[farmKey];
        const asset = assets.data[farmKey];
        const assetPriceUsd = asset && asset.price && asset.price.usd ? asset.price.usd : 0;
        const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;
        const userBoostedShares = Number(shrinkToken(farm.boosted_shares, assetDecimals));
        const totalBoostedShares = Number(
          shrinkToken(farm.asset_farm_reward.boosted_shares, assetDecimals),
        );
        const rewardPerDay = Number(
          shrinkToken(farm.asset_farm_reward.reward_per_day || 0, assetDecimals),
        );
        const userRewardPerDayUSD =
          (userBoostedShares / totalBoostedShares) * rewardPerDay * assetPriceUsd;
        return total + userRewardPerDayUSD;
      }, 0);
      if (assetsTotalValue === 0 || totalNetTvl === 0) {
        return 0;
      }
      const averageNetRewardApy = (totalNetTvl / assetsTotalValue) * 365;
      if (averageNetRewardApy < 0.01) {
        return "<0.01";
      } else {
        return averageNetRewardApy.toFixed(2);
      }
    },
  );
export const getAverageNetRewardApy = () =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      const [, totalCollateral] = getNetGains(account.portfolio, assets, "collateral");
      const [, totalSupplied] = getNetGains(account.portfolio, assets, "supplied");
      const [, totalBorrowed] = getNetGains(account.portfolio, assets, "borrowed");
      const { netTvl } = account.portfolio.farms;
      const totalNetProfit = Object.entries(netTvl || {})
        .map(([rewardTokenId, farmData]) => {
          const rewardAsset = assets.data[rewardTokenId];
          const rewardAssetDecimals =
            rewardAsset.metadata.decimals + rewardAsset.config.extra_decimals;
          const boostedShares = Number(shrinkToken(farmData.boosted_shares, rewardAssetDecimals));
          const totalBoostedShares = Number(
            shrinkToken(farmData.asset_farm_reward.boosted_shares, rewardAssetDecimals),
          );
          const totalRewardsPerDay = Number(
            shrinkToken(farmData.asset_farm_reward.reward_per_day, rewardAssetDecimals),
          );
          const dailyAmount =
            totalBoostedShares > 0 ? (boostedShares / totalBoostedShares) * totalRewardsPerDay : 0;
          return dailyAmount * (rewardAsset.price?.usd || 0);
        })
        .reduce((acc, usd) => acc + usd, 0);
      const netLiquidity = totalCollateral + totalSupplied - totalBorrowed;
      return netLiquidity > 0 ? (totalNetProfit / netLiquidity) * 365 * 100 : 0;
    },
  );
export const getNetGains = (
  portfolio: Portfolio,
  assets: AssetsState,
  source: "supplied" | "collateral" | "borrowed",
) =>
  Object.keys(portfolio[source])
    .map((id) => {
      const asset = assets.data[id];
      const netTvlMultiplier = (asset?.config.net_tvl_multiplier || 0) / 10000;

      const { balance } = portfolio[source][id];
      const apr = Number(portfolio[source][id].apr);
      const balanceUSD = toUsd(balance, asset);

      return [balanceUSD * (netTvlMultiplier ? 1 : 0), apr];
    })
    .reduce(
      ([gain, sum], [balanceUSD, apr]) => [gain + balanceUSD * apr, sum + balanceUSD],
      [0, 0],
    );
