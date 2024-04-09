import { useAppSelector } from "../redux/hooks";
import { getAccountRewards, getAccountDailyRewards } from "../redux/selectors/getAccountRewards";
import { getNetLiquidityRewards, getProtocolRewards } from "../redux/selectors/getProtocolRewards";
import { getTokenLiquidity } from "../redux/selectors/getTokenLiquidity";
import { useProtocolNetLiquidity } from "./useNetLiquidity";
import { APY_FORMAT, USD_FORMAT } from "../store";
import { useAvailableAssets } from "./hooks";
import { getAssets } from "../redux/assetsSelectors";
import { standardizeAsset } from "../utils";

export function useRewards() {
  const assetRewards = useAppSelector(getAccountRewards);
  const protocol = useAppSelector(getProtocolRewards);
  const { brrr, totalUnClaimUSD } = assetRewards || {};
  const extra = Object.entries(assetRewards.extra);
  const net = Object.entries(assetRewards.net);
  const allRewards = Object.entries(assetRewards.sumRewards);

  let totalUnClaimUSDDisplay;
  if (totalUnClaimUSD !== undefined) {
    const IGNORE_AMOUNT = 0.01;
    if (!totalUnClaimUSD) {
      totalUnClaimUSDDisplay = 0;
    } else if (totalUnClaimUSD > 0 && totalUnClaimUSD < IGNORE_AMOUNT) {
      totalUnClaimUSDDisplay = `<${IGNORE_AMOUNT.toLocaleString(undefined, USD_FORMAT)}`;
    } else {
      totalUnClaimUSDDisplay = totalUnClaimUSD.toLocaleString(undefined, USD_FORMAT);
    }
  }

  // borrow + supply + net reward
  const all: Array<{ tokenId: string; data: any }> = [];
  allRewards.forEach(([key, value]) => {
    all.push({
      tokenId: key,
      data: standardizeAsset(value),
    });
  });

  return {
    brrr,
    extra,
    net,
    protocol,
    data: {
      array: all,
      totalUnClaimUSD,
      totalUnClaimUSDDisplay,
    },
  };
}
export function useDailyRewards() {
  const assetRewards = useAppSelector(getAccountDailyRewards);
  return assetRewards;
}

export function useNetLiquidityRewards() {
  const rewards = useAppSelector(getNetLiquidityRewards);
  return rewards;
}

export function useProRataNetLiquidityReward(tokenId, dailyAmount) {
  const rows = useAvailableAssets();
  const assets = useAppSelector(getAssets);
  const net_tvl_multiplier = (assets?.data?.[tokenId].config.net_tvl_multiplier || 0) / 10000;
  const { protocolNetLiquidity } = useProtocolNetLiquidity(true);
  const tokenLiquidity = useAppSelector(getTokenLiquidity(tokenId));

  if (!tokenId) return dailyAmount;
  const share = (tokenLiquidity * net_tvl_multiplier) / protocolNetLiquidity;
  return dailyAmount * share;
}
