import { useAppSelector } from "../redux/hooks";
import { getMarginAccount, getMarginAccountPositions } from "../redux/marginAccountSelectors";

export function useMarginAccount() {
  const useMarginAccountList = useAppSelector(getMarginAccountPositions);
  return { useMarginAccountList };
}
