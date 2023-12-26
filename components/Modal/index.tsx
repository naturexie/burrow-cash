import { useEffect, useState, createContext } from "react";
import { Modal as MUIModal, Typography, Box, Stack, useTheme } from "@mui/material";

import Decimal from "decimal.js";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { hideModal, updateAmount, updatePosition } from "../../redux/appSlice";
import { getModalStatus, getAssetData, getSelectedValues } from "../../redux/appSelectors";
import { getWithdrawMaxAmount } from "../../redux/selectors/getWithdrawMaxAmount";
import { getRepayPositions } from "../../redux/selectors/getRepayPositions";
import { getAccountId } from "../../redux/accountSelectors";
import { getBorrowMaxAmount } from "../../redux/selectors/getBorrowMaxAmount";
import { recomputeHealthFactor } from "../../redux/selectors/recomputeHealthFactor";
import { recomputeHealthFactorAdjust } from "../../redux/selectors/recomputeHealthFactorAdjust";
import { recomputeHealthFactorWithdraw } from "../../redux/selectors/recomputeHealthFactorWithdraw";
import { recomputeHealthFactorSupply } from "../../redux/selectors/recomputeHealthFactorSupply";
import { recomputeHealthFactorRepay } from "../../redux/selectors/recomputeHealthFactorRepay";
import { recomputeHealthFactorRepayFromDeposits } from "../../redux/selectors/recomputeHealthFactorRepayFromDeposits";
import { recomputeHealthFactorRepayFromDepositsLp } from "../../redux/selectors/recomputeHealthFactorRepayFromDepositsLp";
import { formatWithCommas_number } from "../../utils/uiNumber";
import { DEFAULT_POSITION } from "../../utils/config";
import { Wrapper } from "./style";
import { getModalData } from "./utils";
import {
  NotConnected,
  ModalTitle,
  RepayTab,
  HealthFactor,
  Rates,
  Alerts,
  CollateralSwitch,
  CollateralTip,
  BorrowLimit,
} from "./components";
import Controls from "./Controls";
import Action from "./Action";
import { fetchAssets, fetchRefPrices } from "../../redux/assetsSlice";
import { useDegenMode, usePortfolioAssets } from "../../hooks/hooks";
import {
  CollateralTypeSelectorBorrow,
  CollateralTypeSelectorRepay,
} from "./CollateralTypeSelector";

export const ModalContext = createContext(null) as any;
const Modal = () => {
  const isOpen = useAppSelector(getModalStatus);
  const accountId = useAppSelector(getAccountId);
  const asset = useAppSelector(getAssetData);
  const { amount } = useAppSelector(getSelectedValues);
  const dispatch = useAppDispatch();
  const { isRepayFromDeposits } = useDegenMode();
  const theme = useTheme();
  const portfolioAssets = usePortfolioAssets();
  const [selectedCollateralType, setSelectedCollateralType] = useState(DEFAULT_POSITION);

  const { action = "Deposit", tokenId, position } = asset;

  const { healthFactor, maxBorrowValue: adjustedMaxBorrowValue } = useAppSelector(
    action === "Withdraw"
      ? recomputeHealthFactorWithdraw(tokenId, +amount)
      : action === "Adjust"
      ? recomputeHealthFactorAdjust(tokenId, +amount)
      : action === "Supply"
      ? recomputeHealthFactorSupply(tokenId, +amount)
      : action === "Repay" && isRepayFromDeposits
      ? recomputeHealthFactorRepayFromDeposits(tokenId, +amount)
      : action === "Repay" && !isRepayFromDeposits
      ? recomputeHealthFactorRepay(tokenId, +amount, selectedCollateralType)
      : recomputeHealthFactor(tokenId, +amount, selectedCollateralType),
  );
  const { healthFactor: healthFactor_repay_lp, maxBorrowValue: adjustedMaxBorrowValue_repay_lp } =
    useAppSelector(
      action === "Repay" && isRepayFromDeposits && selectedCollateralType !== DEFAULT_POSITION
        ? recomputeHealthFactorRepayFromDepositsLp(tokenId, +amount, selectedCollateralType)
        : () => {
            return { healthFactor: 0, maxBorrowValue: 0 };
          },
    );
  const maxBorrowAmountPositions = useAppSelector(getBorrowMaxAmount(tokenId));
  const maxWithdrawAmount = useAppSelector(getWithdrawMaxAmount(tokenId));
  const repayPositions = useAppSelector(getRepayPositions(tokenId));
  const { maxBorrowAmount, maxBorrowValue } = maxBorrowAmountPositions[selectedCollateralType];
  const repayAmount = repayPositions[selectedCollateralType];
  const {
    symbol,
    apy,
    price,
    available,
    available$,
    totalTitle,
    rates,
    alerts,
    canUseAsCollateral,
  } = getModalData({
    ...asset,
    maxBorrowAmount,
    maxWithdrawAmount,
    isRepayFromDeposits,
    healthFactor,
    amount,
    borrowed: repayAmount,
  });
  const handleClose = () => dispatch(hideModal());
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAssets()).then(() => dispatch(fetchRefPrices()));
    }
  }, [isOpen]);
  useEffect(() => {
    if (position) {
      setSelectedCollateralType(position);
    }
  }, [position]);
  useEffect(() => {
    dispatch(updateAmount({ isMax: false, amount: "0" }));
    dispatch(updatePosition({ position: selectedCollateralType }));
  }, [selectedCollateralType]);
  if (action === "Adjust") {
    rates.push({
      label: "Use as Collateral",
      value: formatWithCommas_number(new Decimal(amount || 0).toFixed()),
      value$: new Decimal(price * +amount).toFixed(),
    });
  }
  const repay_to_lp =
    action === "Repay" && isRepayFromDeposits && selectedCollateralType !== DEFAULT_POSITION;
  const not_borrow_from_regular =
    action === "Repay" &&
    isRepayFromDeposits &&
    !((portfolioAssets[1] || []) as any[]).find((a) => a.tokenId === tokenId);
  return (
    <MUIModal open={isOpen} onClose={handleClose}>
      <Wrapper
        sx={{
          "& *::-webkit-scrollbar": {
            backgroundColor: theme.custom.scrollbarBg,
          },
        }}
      >
        <ModalContext.Provider
          value={{
            position: selectedCollateralType,
          }}
        >
          <Box sx={{ p: ["20px", "20px"] }}>
            {!accountId && <NotConnected />}
            <ModalTitle asset={asset} onClose={handleClose} />
            {action === "Borrow" ? (
              <CollateralTypeSelectorBorrow
                maxBorrowAmountPositions={maxBorrowAmountPositions}
                selectedCollateralType={selectedCollateralType}
                setSelectedCollateralType={setSelectedCollateralType}
              />
            ) : null}
            {action === "Repay" ? (
              <CollateralTypeSelectorRepay
                repayPositions={repayPositions}
                selectedCollateralType={selectedCollateralType}
                setSelectedCollateralType={setSelectedCollateralType}
              />
            ) : null}
            <RepayTab asset={asset} />
            <Controls
              amount={amount}
              available={available}
              action={action}
              tokenId={tokenId}
              asset={asset}
              totalAvailable={available}
              available$={available$}
            />
            <div className="flex flex-col gap-4 mt-6">
              {repay_to_lp ? <HealthFactor value={healthFactor_repay_lp} /> : null}
              {not_borrow_from_regular ? null : (
                <HealthFactor
                  value={healthFactor}
                  title={`${repay_to_lp ? "Health Factor(Single)" : ""}`}
                />
              )}
              <Rates rates={rates} />
              {!canUseAsCollateral ? (
                <CollateralTip />
              ) : (
                <CollateralSwitch
                  action={action}
                  canUseAsCollateral={canUseAsCollateral}
                  tokenId={asset.tokenId}
                />
              )}
              <BorrowLimit
                from={maxBorrowValue}
                to={repay_to_lp ? adjustedMaxBorrowValue_repay_lp : adjustedMaxBorrowValue}
              />
            </div>
            <Alerts data={alerts} />
            <Action
              maxBorrowAmount={maxBorrowAmount}
              healthFactor={healthFactor}
              collateralType={selectedCollateralType}
            />
          </Box>
        </ModalContext.Provider>
      </Wrapper>
    </MUIModal>
  );
};

export default Modal;
