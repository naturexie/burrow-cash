import React, { useState } from "react";
import Link from "next/link";
import { AddCollateral, Export } from "../../MarginTrading/components/Icon";
import ClosePositionMobile from "./ClosePositionMobile";
import ChangeCollateralMobile from "./ChangeCollateralMobile";
import { useMarginAccount } from "../../../hooks/useMarginAccount";
import { useMarginConfigToken } from "../../../hooks/useMarginConfig";
import { shrinkToken } from "../../../store/helper";
import { toInternationalCurrencySystem_number } from "../../../utils/uiNumber";

const TradingTable = ({ positionsList }) => {
  const [selectedTab, setSelectedTab] = useState("positions");
  const [isClosePositionModalOpen, setIsClosePositionMobileOpen] = useState(false);
  const [isChangeCollateralMobileOpen, setIsChangeCollateralMobileOpen] = useState(false);
  const { marginConfigTokens } = useMarginConfigToken();
  const { assets } = useMarginAccount();
  const handleTabClick = (tabNumber) => {
    setSelectedTab(tabNumber);
  };
  const handleClosePositionButtonClick = () => {
    setIsClosePositionMobileOpen(true);
  };
  const handleChangeCollateralButtonClick = () => {
    setIsChangeCollateralMobileOpen(true);
  };
  const getAssetById = (id) => {
    const assetsData = assets.data;
    return assetsData[id];
  };
  const getPositionType = (token_id) => {
    const type = marginConfigTokens.registered_tokens[token_id];
    return {
      label: type === 1 ? "Short" : "Long",
      class: type === 1 ? "text-red-50" : "text-primary",
    };
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full border border-dark-50 bg-gray-800 rounded-md">
        <div className="w-full border-b border-dark-50 flex">
          <Tab
            tabName="Positions"
            isSelected={selectedTab === "positions"}
            onClick={() => handleTabClick("positions")}
          />
          <Tab
            tabName="History"
            isSelected={selectedTab === "history"}
            onClick={() => handleTabClick("history")}
          />
        </div>
        <div className="py-4">
          {selectedTab === "positions" && (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-300 text-sm font-normal">
                  <th className="pl-5">Market</th>
                  <th>Size</th>
                  <th>Net Value</th>
                  <th>Collateral</th>
                  <th>Entry Price</th>
                  <th>Index Price</th>
                  <th>Liq. Price</th>
                  <th>PLN & ROE</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {positionsList &&
                  Object.values(positionsList as Record<string, any>).map((item, index) => {
                    // console.log(item);
                    const assetD = getAssetById(item.token_d_info.token_id);
                    const assetC = getAssetById(item.token_c_info.token_id);
                    const assetDecimals_d =
                      (assetD.metadata?.decimals ?? 0) + (assetD.config?.extra_decimals ?? 0);
                    const assetDecimals_c =
                      (assetC.metadata?.decimals ?? 0) + (assetC.config?.extra_decimals ?? 0);
                    const leverage_d = Number(
                      shrinkToken(item.token_d_info.balance, assetDecimals_d),
                    );
                    const leverage_c = Number(
                      shrinkToken(item.token_c_info.balance, assetDecimals_c),
                    );
                    const leverage = leverage_c !== 0 ? leverage_d / leverage_c : 0;
                    const positionType = getPositionType(item.token_d_info.token_id);
                    const sizeValue =
                      positionType.label === "Long"
                        ? shrinkToken(item.token_p_amount, assetDecimals_c)
                        : shrinkToken(item.token_d_info.balance, assetDecimals_d);
                    const netValue = shrinkToken(item.token_c_info.balance, assetDecimals_c);
                    return (
                      <Link href={`/trading/${item.token_p_id}`} key={index}>
                        <tr className="text-base hover:bg-dark-100 cursor-pointer font-normal">
                          <td className="py-5 pl-5 ">
                            {assetD.metadata?.symbol} / {assetC.metadata?.symbol}
                            <span
                              className={`text-xs ml-1.5 ${
                                getPositionType(item.token_d_info.token_id).class
                              }`}
                            >
                              {getPositionType(item.token_d_info.token_id).label}
                              <span className="ml-1.5">
                                {toInternationalCurrencySystem_number(leverage)}x
                              </span>
                            </span>
                          </td>
                          <td>${toInternationalCurrencySystem_number(sizeValue)}</td>
                          <td>${toInternationalCurrencySystem_number(netValue)}</td>
                          <td>
                            <div className="flex items-center">
                              <p className="mr-2.5"> - </p>
                              {/* <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleChangeCollateralButtonClick();
                                }}
                              >
                                <AddCollateral />
                              </div> */}
                            </div>
                          </td>
                          <td>$-</td>
                          <td>$-</td>
                          <td>$-</td>
                          <td>
                            <div className="flex items-center">
                              <p className="text-gray-1000"> -</p>
                              {/* <span className="text-gray-400 text-xs">-</span> */}
                            </div>
                          </td>
                          <td className="pr-5">
                            <div
                              className="text-gray-300 text-sm border border-dark-300 text-center h-6 rounded flex justify-center items-center"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleClosePositionButtonClick();
                              }}
                            >
                              Close
                            </div>
                          </td>
                        </tr>
                      </Link>
                    );
                  })}
                {isChangeCollateralMobileOpen && (
                  <ChangeCollateralMobile
                    open={isChangeCollateralMobileOpen}
                    onClose={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsChangeCollateralMobileOpen(false);
                    }}
                  />
                )}
                {isClosePositionModalOpen && (
                  <ClosePositionMobile
                    open={isClosePositionModalOpen}
                    onClose={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsClosePositionMobileOpen(false);
                    }}
                    action="Long"
                  />
                )}
              </tbody>
            </table>
          )}
          {selectedTab === "history" && (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-300 text-sm font-normal">
                  <th className="pl-5">Market</th>
                  <th>Operation</th>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Fee</th>
                  <th>Realized PNL & ROE</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <Link href="/trading">
                  <tr className="text-base hover:bg-dark-100 cursor-pointer font-normal">
                    <td className="py-5 pl-5 ">NEAR/USDC.e</td>
                    <td>Open Short</td>
                    <td className="text-red-50">Sell</td>
                    <td>$3.24</td>
                    <td>100 NEAR</td>
                    <td>$1.80</td>
                    <td>--</td>
                    <td className="pr-5">
                      <div>
                        2024-01-16, 13:23
                        {/* <Export /> */}
                      </div>
                    </td>
                  </tr>
                </Link>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
const Tab = ({ tabName, isSelected, onClick }) => (
  <div
    className={`pt-6 pl-10 pb-4 pr-7 text-gray-300 text-lg cursor-pointer ${
      isSelected ? "border-b-2 border-primary text-white" : ""
    }`}
    onClick={onClick}
  >
    {tabName}
  </div>
);

export default TradingTable;
