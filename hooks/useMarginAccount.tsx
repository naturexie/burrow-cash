import { getAssets } from "../redux/assetsSelectors";
import { useAppSelector } from "../redux/hooks";
import { getMarginAccount, getMarginAccountPositions } from "../redux/marginAccountSelectors";

export function useMarginAccount() {
  const assets = useAppSelector(getAssets);
  const useMarginAccountList = useAppSelector(getMarginAccountPositions);
  return { useMarginAccountList, assets };
}
