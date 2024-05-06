import React, { useState, useContext, useEffect } from "react";
import { NearIcon } from "../../MarginTrading/components/Icon";
import { TokenThinArrow, TokenSelected } from "./TradingIcon";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  setCategoryAssets1,
  setCategoryAssets2,
  setReduxcategoryCurrentBalance1,
  setReduxcategoryCurrentBalance2,
} from "../../../redux/marginTrading";
import { shrinkToken } from "../../../store";
import { toInternationalCurrencySystem_number } from "../../../utils/uiNumber";

const TradingToken = ({ tokenList, type }) => {
  const dispatch = useAppDispatch();
  const account = useAppSelector((state) => state.account);
  const { ReduxcategoryAssets1, ReduxcategoryAssets2 } = useAppSelector((state) => state.category);
  const [ownBalance, setOwnBalance] = useState("0");
  const [showModal, setShowModal] = useState(false);
  /*
    @type cate1: category.value == 1 
    @type cate2: category.value == 2 
  */
  const [selectedItem, setSelectedItem] = useState(
    type == "cate1" ? ReduxcategoryAssets1 || tokenList[0] : ReduxcategoryAssets2 || tokenList[0],
  );

  let timer;
  //
  useEffect(() => {
    if (type == "cate1") {
      //
      const waitUseKey = shrinkToken(
        (account.balances as any)[ReduxcategoryAssets1.metadata["token_id"]],
        ReduxcategoryAssets1.metadata.decimals + ReduxcategoryAssets1.config.extra_decimals,
      );
      setSelectedItem(ReduxcategoryAssets1);
      console.log(waitUseKey);
      //
      if (ReduxcategoryAssets1) setOwnBalance(toInternationalCurrencySystem_number(waitUseKey));
      dispatch(setReduxcategoryCurrentBalance1(waitUseKey));
    } else if (type == "cate2") {
      //
      const waitUseKey = shrinkToken(
        (account.balances as any)[ReduxcategoryAssets2.metadata["token_id"]],
        ReduxcategoryAssets2.metadata.decimals + ReduxcategoryAssets2.config.extra_decimals,
      );
      setSelectedItem(ReduxcategoryAssets2);
      console.log(waitUseKey);
      //
      if (ReduxcategoryAssets2) setOwnBalance(toInternationalCurrencySystem_number(waitUseKey));
      dispatch(setReduxcategoryCurrentBalance2(waitUseKey));
    }
  }, [ReduxcategoryAssets1, ReduxcategoryAssets2]);

  //
  const handleTokenClick = (item) => {
    if (!item) return;
    setSelectedItem(item);
    //
    if (type == "cate1") {
      dispatch(setCategoryAssets1(item));
    } else if (type == "cate2") {
      dispatch(setCategoryAssets2(item));
    }
    setShowModal(false);
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
        className="flex items-center justify-end hover:bg-gray-1050  p-1.5 rounded-md "
        onMouseEnter={handleMouseEnter}
      >
        <div className="w-6 h-6">
          {selectedItem?.metadata?.symbol == "wNEAR" ? (
            <NearIcon />
          ) : (
            <img
              alt=""
              src={selectedItem?.metadata?.icon}
              style={{ width: "26px", height: "26px" }}
            />
          )}
        </div>
        <div className="mx-1.5 text-base">
          {selectedItem?.metadata?.symbol == "wNEAR" ? "NEAR" : selectedItem?.metadata?.symbol}
        </div>
        <TokenThinArrow />
      </div>
      <div className="text-xs flex justify-end text-gray-300">
        Balance:&nbsp;
        <span className="text-white border-b border-dashed border-dark-800">{ownBalance}</span>
      </div>
      {/*  */}
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
              {token?.metadata?.symbol == "wNEAR" ? (
                <NearIcon />
              ) : (
                <img alt="" src={token?.metadata?.icon} style={{ width: "26px", height: "26px" }} />
              )}
              <p className="ml-1.5 mr-2 text-sm">
                {token?.metadata?.symbol === "wNEAR" ? "NEAR" : token?.metadata?.symbol}
              </p>
              {selectedItem?.metadata?.symbol === token.metadata.symbol && <TokenSelected />}
              <p className="ml-auto text-sm">${token.price?.usd}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradingToken;
