import React, { useState } from "react";
import TradingTable from "../../../Trading/components/Table";

const MyMarginTradingPage = () => {
  const [showCollateralPopup, setShowCollateralPopup] = useState(false);
  let timer;
  const handleMouseEnter = () => {
    clearTimeout(timer);
    setShowCollateralPopup(true);
  };
  const handleMouseLeave = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setShowCollateralPopup(false);
    }, 200);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex justify-between items-center w-full h-[100px] border border-dark-50 bg-gray-800 rounded-md mb-7">
        <div className="flex flex-1 justify-center">
          <div>
            <p className="text-gray-300 text-sm">Long Open Interest</p>
            <h2 className="text-h2">$298.70</h2>
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <div>
            <p className="text-gray-300 text-sm">Short Open Interest</p>
            <h2 className="text-h2">$100.05</h2>
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <div>
            <p className="text-gray-300 text-sm">Collateral</p>
            <div
              className="relative border-b border-dashed border-dark-800 cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="text-h2 " onMouseEnter={handleMouseEnter}>
                $200
              </div>
              {showCollateralPopup && (
                <div
                  className="absolute left-20 top-0 bg-dark-100 border border-dark-300 text-gray-30 p-2 rounded-md rounded-md w-32"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-4 h-4" />
                    <p className="ml-1 text-xs text-gray-300">USDC</p>
                    <div className="text-xs ml-auto">$100</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4" />
                    <p className="ml-1 text-xs text-gray-300">USDC</p>
                    <div className="text-xs ml-auto">$100</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <div>
            <p className="text-gray-300 text-sm">PLN</p>
            <h2 className="text-h2">+$0.16</h2>
          </div>
        </div>
      </div>
      <TradingTable />
    </div>
  );
};

export default MyMarginTradingPage;
