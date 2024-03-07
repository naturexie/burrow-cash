import { useAppSelector } from "../redux/hooks";

import { getTotalBalance } from "../redux/selectors/getTotalBalance";

export function useProtocolNetLiquidity(withNetTvlMultiplier?: boolean) {
  const protocolDeposited = useAppSelector(getTotalBalance("supplied", withNetTvlMultiplier));
  const protocolBorrowed = useAppSelector(getTotalBalance("borrowed", withNetTvlMultiplier));
  const protocolNetLiquidity = protocolDeposited - protocolBorrowed;
  return { protocolDeposited, protocolBorrowed, protocolNetLiquidity };
}
