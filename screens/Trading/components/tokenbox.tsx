import React, { useState } from "react";
import { TestNearIcon } from "../../MarginTrading/components/Icon";
import { TokenThinArrow } from "./TradingIcon";

const TradingToken = () => {
  const [showModal, setShowModal] = useState(false);

  const handleTokenClick = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="relative cursor-pointer p-1.5 rounded-md hover:bg-gray-1050 w-fit">
      <div className="flex items-center justify-center " onClick={handleTokenClick}>
        <TestNearIcon />
        <div className="mx-1.5">NEAR</div>
        <TokenThinArrow />
      </div>
      {showModal && (
        <div className="absolute top-12 left-0 bg-dark-250 border border-dark-500 flex items-center justify-center rounded-md">
          <div className="rounded-md">
            <p className="py-1  pl-1.5 hover:bg-gray-950">USDC</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingToken;
