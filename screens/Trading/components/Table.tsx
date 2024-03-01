import React, { useState } from "react";
import Link from "next/link";
import { AddCollateral, Export } from "../../MarginTrading/components/Icon";
import ClosePositionMobile from "./ClosePositionMobile";
import ChangeCollateralMobile from "./ChangeCollateralMobile";

const TradingTable = () => {
  const [selectedTab, setSelectedTab] = useState("positions");
  const [isClosePositionModalOpen, setIsClosePositionMobileOpen] = useState(false);
  const [isChangeCollateralMobileOpen, setIsChangeCollateralMobileOpen] = useState(false);
  const handleTabClick = (tabNumber) => {
    setSelectedTab(tabNumber);
  };
  const handleClosePositionButtonClick = () => {
    setIsClosePositionMobileOpen(true);
  };
  const handleChangeCollateralButtonClick = () => {
    setIsChangeCollateralMobileOpen(true);
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
                <Link href="/trading">
                  <tr className="text-base hover:bg-dark-100 cursor-pointer font-normal">
                    <td className="py-5 pl-5 ">
                      NEAR/USDC.e <span className="text-primary text-xs">Long 1.5X</span>
                    </td>
                    <td>$149.35</td>
                    <td>$100</td>
                    <td>
                      <div className="flex items-center">
                        <p className="mr-2.5"> 100 USDC.e </p>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleChangeCollateralButtonClick();
                          }}
                        >
                          <AddCollateral />
                        </div>
                      </div>
                    </td>
                    <td>$3.25</td>
                    <td>$3.24</td>
                    <td>$1.23</td>
                    <td>
                      <div className="flex items-center">
                        <p className="text-gray-1000"> +$0.2248</p>
                        <span className="text-gray-400 text-xs">(+0.01%)</span>
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
                {/* <tr className="text-base hover:bg-dark-100 cursor-pointer font-normal">
                  <td className="py-5 pl-5 ">
                    NEAR/USDC.e <span className="text-red-50 text-xs">Short 1.5X</span>
                  </td>
                  <td>$149.35</td>
                  <td>$100</td>
                  <td>
                    <div className="flex items-center">
                      <p className="mr-2.5"> 100 USDC.e </p>
                      <AddCollateral />
                    </div>
                  </td>
                  <td>$3.25</td>
                  <td>$3.24</td>
                  <td>$1.23</td>
                  <td>
                    <div className="flex items-center">
                      <p className="text-red-150"> -$0.0689</p>
                      <span className="text-gray-400 text-xs">(-2.01%)</span>
                    </div>
                  </td>
                  <td className="pr-5">
                    <div className="text-gray-300 text-sm border border-dark-300 text-center h-6 rounded flex justify-center items-center">
                      Close
                    </div>
                  </td>
                </tr> */}
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
                {/* <tr className="text-base hover:bg-dark-100 cursor-pointer font-normal">
                  <td className="py-5 pl-5 ">NEAR/USDC.e</td>
                  <td>Open Short</td>
                  <td className="text-primary">Buy</td>
                  <td>$3.24</td>
                  <td>45.2435 NEAR</td>
                  <td>$0.89</td>
                  <td>--</td>
                  <td className="pr-5">
                    <div>
                      2024-01-16, 13:23 */}
                {/* <Export /> */}
                {/* </div>
                  </td>
                </tr> */}
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
