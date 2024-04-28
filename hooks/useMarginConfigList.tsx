import { getAssets } from "../redux/assetsSelectors";
import { useAppSelector } from "../redux/hooks";
import { getMarginConfig } from "../redux/marginConfigSelectors";

export function useMarginConfigToken() {
  const assets = useAppSelector(getAssets);
  const marginConfigTokens = useAppSelector(getMarginConfig);
  const assetsData = assets.data;

  const filteredMarginConfigTokens = Object.entries(marginConfigTokens.registered_tokens)
    .filter(([token, value]) => value === 1)
    .map(([token]) => token);

  const filterMarginConfigList = filteredMarginConfigTokens.reduce((item, token) => {
    if (assetsData[token]) {
      item[token] = assetsData[token];
    }
    return item;
  }, {});
  return { filterMarginConfigList };
}
