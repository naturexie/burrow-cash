import React, { useState, useContext, useEffect } from "react";
import { NearIcon } from "../../MarginTrading/components/Icon";
import { TokenThinArrow, TokenSelected } from "./TradingIcon";

const TradingToken = ({ tokenList }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIcon, setSelectedItemIcon] = useState("");

  let timer;
  //
  useEffect(() => {
    if (tokenList.length > 0) {
      setSelectedItem(tokenList[0].metadata.symbol);
      setSelectedItemIcon(tokenList[0].metadata.icon);
    }
  }, [tokenList]);
  //
  const handleTokenClick = (item) => {
    if (selectedItem === item.metadata.symbol) {
      setSelectedItem(null);
      setSelectedItemIcon("");
      setShowModal(false);
    } else {
      setSelectedItem(item.metadata.symbol);
      setSelectedItemIcon(item.metadata.icon);
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
          {selectedItem == "wNEAR" ? (
            <NearIcon />
          ) : (
            <img alt="" src={selectedItemIcon} style={{ width: "26px", height: "26px" }} />
          )}
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
              onClick={() => handleTokenClick(token)}
            >
              {token?.metadata?.symbol === "wNEAR" ? (
                <NearIcon />
              ) : (
                <img alt="" src={token?.metadata?.icon} style={{ width: "26px", height: "26px" }} />
              )}
              <p className="ml-1.5 mr-2 text-sm">{token.metadata.symbol}</p>
              {selectedItem === token.metadata.symbol && <TokenSelected />}
              <p className="ml-auto text-sm">${token.price?.usd}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradingToken;
