import React, { useState } from "react";
import { TestNearIcon } from "../../MarginTrading/components/Icon";
import { TokenThinArrow, TokenSelected } from "./TradingIcon";

const TradingToken = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const tokenList = [
    { name: "USDC", price: "123.23" },
    { name: "BTC", price: "105.89" },
  ];
  let timer;

  const handleTokenClick = (item) => {
    if (selectedItem === item) {
      setSelectedItem(null);
      setShowModal(false);
    } else {
      setSelectedItem(item);
      setShowModal(false);
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(timer);
    setShowModal(true);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setShowModal(false);
    }, 200);
  };

  return (
    <div className="relative cursor-pointer w-fit " onMouseLeave={handleMouseLeave}>
      <div
        className="flex items-center justify-center hover:bg-gray-1050  p-1.5 rounded-md "
        onMouseEnter={handleMouseEnter}
      >
        <div className="w-6 h-6">
          <TestNearIcon />
        </div>
        <div className="mx-1.5 text-base">{selectedItem || "NEAR"}</div>
        <TokenThinArrow />
      </div>
      <div className="text-xs text-gray-300">
        Balance: <span className="text-white border-b border-dashed border-dark-800">123.23</span>
      </div>
      {showModal && (
        <div
          className="absolute top-10 right-0 py-1.5 bg-dark-250 border border-dark-500 rounded-md z-80 w-52"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {tokenList.map((token, index) => (
            <div
              key={index}
              className="py-2 px-3.5 hover:bg-gray-950 flex items-center w-full rounded-md"
              onClick={() => handleTokenClick(token.name)}
            >
              <TestNearIcon />
              <p className="ml-1.5 mr-2 text-sm">{token.name}</p>
              {selectedItem === token.name && <TokenSelected />}
              <p className="ml-auto text-sm">{token.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradingToken;
