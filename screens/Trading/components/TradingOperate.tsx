import React, { useState } from "react";
import TradingToken from "./tokenbox";
import { RefLogoIcon, SetUp, ShrinkArrow } from "./TradingIcon";
import { useAppDispatch } from "../../../redux/hooks";
import RangeSlider from "./RangeSlider";
import ConfirmMobile from "./ConfirmMobile";

const TradingOperate = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("long");
  const [showSetUpPopup, setShowSetUpPopup] = useState(false);
  const [selectedSetUpOption, setSelectedSetUpOption] = useState("auto");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleTabClick = (tabString) => {
    setActiveTab(tabString);
  };
  const getTabClassName = (tabName) => {
    return activeTab === tabName
      ? "bg-primary text-dark-200 py-2.5 pl-6 pr-8 rounded-md"
      : "text-gray-300 py-2.5 pl-8 pr-10";
  };
  let timer;
  const handleMouseEnter = () => {
    clearTimeout(timer);
    setShowSetUpPopup(true);
  };
  const handleMouseLeave = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setShowSetUpPopup(false);
    }, 200);
  };
  const handleSetUpOptionClick = (option) => {
    setSelectedSetUpOption(option);
  };
  const handleConfirmButtonClick = () => {
    setIsConfirmModalOpen(true);
  };
  return (
    <div className="w-full pt-4 px-4 pb-9">
      <div className="flex justify-between items-center">
        <div className="flex bg-dark-200 px-0.5 py-0.5 rounded-md cursor-pointer mr-3">
          <div className={getTabClassName("long")} onClick={() => handleTabClick("long")}>
            Long NEAR
          </div>
          <div
            className={
              activeTab === "short"
                ? "bg-red-50 text-dark-200 py-2.5 pl-6 pr-8 rounded-md"
                : getTabClassName("short")
            }
            onClick={() => handleTabClick("short")}
          >
            Short NEAR
          </div>
        </div>
        <div
          className="relative z-40 cursor-pointer "
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <SetUp />
          {showSetUpPopup && (
            <div
              onMouseLeave={handleMouseLeave}
              className="absolute top-10 right-0 bg-dark-250 border border-dark-500 rounded-md py-6 px-4"
            >
              <p className="text-base mb-6">Max. Slippage Setting</p>
              <div className="flex items-center justify-between h-10">
                <div className="bg-dark-200 p-1 rounded-md flex items-center mr-3.5">
                  <div
                    className={`py-2 px-5 ${
                      selectedSetUpOption === "auto" ? "bg-gray-400 rounded " : ""
                    }`}
                    onClick={() => handleSetUpOptionClick("auto")}
                  >
                    Auto
                  </div>
                  <div
                    className={`py-2 px-5 ${
                      selectedSetUpOption === "custom" ? "bg-gray-400 rounded " : ""
                    }`}
                    onClick={() => handleSetUpOptionClick("custom")}
                  >
                    Custom
                  </div>
                </div>
                <div className="bg-dark-600 rounded-md py-2.5 px-4 flex items-center justify-between">
                  <input type="text" value={0.5} style={{ width: "32px" }} />
                  <div>%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5">
        {activeTab === "long" && (
          <>
            <div className="relative bg-dark-600 border border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md z-30">
              <input type="text" value={0} />
              <div className="absolute top-2 right-2">
                <TradingToken />
              </div>
              <p className="text-gray-300 mt-2 text-xs">Use: $0.00</p>
            </div>
            <div className="relative my-2.5 flex justify-end z-0 w-1/2" style={{ zoom: "2" }}>
              <ShrinkArrow />
            </div>
            <div className="relative bg-dark-600 border border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md z-20">
              <input type="text" value={0} />
              <div className="absolute top-2 right-2">
                <TradingToken />
              </div>
              <p className="text-gray-300 mt-2 text-xs">Long: $0.00</p>
            </div>
            <RangeSlider defaultValue={1.5} action="Long" />
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-gray-300">Position Size</div>
                <div>
                  45.2435 NEAR
                  <span className="text-xs text-gray-300 ml-1.5">($149.35)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-gray-300">Liq. Price</div>
                <div>$1.23</div>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-gray-300">Fee</div>
                <div className="flex items-center justify-center">
                  <p className="border-b border-dashed border-dark-800">0.26</p>
                  NEAR
                  <span className="text-xs text-gray-300 ml-1.5">($0.89)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-gray-300">Route</div>
                <div className="flex items-center justify-center">
                  <div className="border-r mr-1.5 pr-1.5 border-dark-800">
                    <RefLogoIcon />
                  </div>
                  NEAR &gt; USDT.e &gt; USDC.e
                </div>
              </div>
              <div
                className="flex items-center justify-between bg-primary text-dark-200 text-base rounded-md h-12 text-center cursor-pointer"
                onClick={handleConfirmButtonClick}
              >
                <div className="flex-grow">Long NEAR 1.5x</div>
              </div>
              {isConfirmModalOpen && (
                <ConfirmMobile
                  open={isConfirmModalOpen}
                  onClose={() => setIsConfirmModalOpen(false)}
                  action="Long"
                />
              )}
            </div>
          </>
        )}
        {activeTab === "short" && (
          <>
            <div className="relative bg-dark-600 border border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md z-30">
              <input type="text" value={0} />
              <div className="absolute top-2 right-2">
                <TradingToken />
              </div>
              <p className="text-gray-300 mt-2 text-xs">Use: $0.00</p>
            </div>
            <div className="relative my-2.5 flex justify-end z-0 w-1/2" style={{ zoom: "2" }}>
              <ShrinkArrow />
            </div>
            <div className="relative bg-dark-600 border border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md z-20">
              <input type="text" value={0} />
              <div className="absolute top-2 right-2">
                <TradingToken />
              </div>
              <p className="text-gray-300 mt-2 text-xs">Long: $0.00</p>
            </div>
            <RangeSlider defaultValue={1.75} action="Short" />
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-gray-300">Position Size</div>
                <div>
                  45.2435 NEAR
                  <span className="text-xs text-gray-300 ml-1.5">($149.35)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-gray-300">Liq. Price</div>
                <div>$1.23</div>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-gray-300">Fee</div>
                <div className="flex items-center justify-center">
                  <p className="border-b border-dashed border-dark-800">0.26</p>
                  NEAR
                  <span className="text-xs text-gray-300 ml-1.5">($0.89)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-gray-300">Route</div>
                <div className="flex items-center justify-center">
                  <div className="border-r mr-1.5 pr-1.5 border-dark-800">
                    <RefLogoIcon />
                  </div>
                  NEAR &gt; USDT.e &gt; USDC.e
                </div>
              </div>
              <div className="flex items-center justify-between bg-red-50 text-dark-200 text-base rounded-md h-12 text-center cursor-pointer">
                <div className="flex-grow">Long NEAR 1.5x</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TradingOperate;
