import { omit } from "lodash";
import { IAssetDetailed, IMetadata } from "../interfaces/asset";
import { transformAssetFarms } from "./farms";
import { Assets } from "../redux/assetState";
import { nearMetadata } from "../components/Assets";
import { nearNativeTokens } from "../utils";

export function transformAssets({
  assets,
  metadata,
}: {
  assets: IAssetDetailed[];
  metadata: IMetadata[];
}): Assets {
  const data = assets.reduce((map, asset) => {
    const assetMetadata = metadata.find((m) => m.token_id === asset.token_id) as IMetadata;
    if (!asset.config) return map;
    if (asset.isLpToken) {
      asset.config.can_deposit = true;
      asset.config.can_withdraw = true;
    }
    if (!assetMetadata?.icon && nearNativeTokens.includes(assetMetadata?.token_id)) {
      assetMetadata.icon = nearMetadata.icon;
    }
    map[asset.token_id] = omit(
      {
        metadata: asset.isLpToken ? asset.lptMetadata : assetMetadata,
        ...asset,
        farms: transformAssetFarms(asset.farms),
      },
      ["lptMetadata"],
    );
    return map;
  }, {});

  return data;
}
