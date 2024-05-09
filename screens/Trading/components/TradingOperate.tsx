import React, { useMemo, useState, useEffect } from "react";
import _ from "lodash";
import { fetchAllPools, getStablePools, init_env } from "@ref-finance/ref-sdk";
import TradingToken from "./tokenbox";
import { RefLogoIcon, SetUp, ShrinkArrow } from "./TradingIcon";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import RangeSlider from "./RangeSlider";
import ConfirmMobile from "./ConfirmMobile";
import { getAccountBalance, getAccountId } from "../../../redux/accountSelectors";
import { getAssets } from "../../../redux/assetsSelectors";
import { useMarginConfigToken } from "../../../hooks/useMarginConfig";
import { getMarginConfig } from "../../../redux/marginConfigSelectors";
import { setCategoryAssets1, setCategoryAssets2 } from "../../../redux/marginTrading";
import { toInternationalCurrencySystem_number } from "../../../utils/uiNumber";
import { useEstimateSwap } from "../../../hooks/useEstimateSwap";
// main components
const TradingOperate = () => {
  const assets = useAppSelector(getAssets);
  const config = useAppSelector(getMarginConfig);
  const { categoryAssets1, categoryAssets2 } = useMarginConfigToken();
  const {
    ReduxcategoryAssets1,
    ReduxcategoryAssets2,
    ReduxcategoryCurrentBalance1,
    ReduxcategoryCurrentBalance2,
  } = useAppSelector((state) => state.category);

  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("long");
  const [showSetUpPopup, setShowSetUpPopup] = useState(false);
  const [selectedSetUpOption, setSelectedSetUpOption] = useState("auto");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [rangeMount, setRangeMount] = useState(1);
  const [isDisabled, setDisabled] = useState(false);

  //
  const [longInput, setLongInput] = useState();
  const [shortInput, setShortInput] = useState();

  // amount
  const [longInputUsd, setLongInputUsd] = useState(0);
  const [longOutputUsd, setLongOutputUsd] = useState(0);
  const [shortInputUsd, setShortInputUsd] = useState(0);
  const [shortOutputUsd, setShortOutputUsd] = useState(0);

  //
  const balance = useAppSelector(getAccountBalance);
  const accountId = useAppSelector(getAccountId);

  // tab click event
  const handleTabClick = (tabString) => {
    setActiveTab(tabString);
  };
  const getTabClassName = (tabName) => {
    return activeTab === tabName
      ? "bg-primary text-dark-200 py-2.5 pl-6 pr-8 rounded-md"
      : "text-gray-300 py-2.5 pl-8 pr-10";
  };

  // mouse leave and enter event
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

  // slippageTolerance change ecent
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const handleSetUpOptionClick = (option) => {
    setSelectedSetUpOption(option);
    if (option == "auto") {
      setSlippageTolerance(0.5);
    }
  };
  const slippageToleranceChange = (e) => {
    setSlippageTolerance(e);
  };

  // open position btn click eve.
  const handleConfirmButtonClick = () => {
    if (isDisabled) return;
    setIsConfirmModalOpen(true);
  };

  // condition btn is disabled
  useEffect(() => {
    const setDisableBasedOnInputs = () => {
      const currentBalance1 = Number(ReduxcategoryCurrentBalance1) || 0;
      const currentBalance2 = Number(ReduxcategoryCurrentBalance2) || 0;

      let inputValue;
      let outputValue;
      if (activeTab === "long") {
        inputValue = longInput;
        outputValue = longOutputUsd;
      } else {
        inputValue = shortInput;
        outputValue = shortOutputUsd;
      }

      const isValidInput = isValidDecimalString(inputValue);
      const isValidOutput = isValidDecimalString(outputValue);

      setDisabled(
        !isValidInput ||
          // !isValidOutput ||
          Number(inputValue) > currentBalance2 ||
          Number(outputValue) > currentBalance1,
      );
    };
    setDisableBasedOnInputs();
  }, [
    activeTab,
    ReduxcategoryCurrentBalance1,
    ReduxcategoryCurrentBalance2,
    longInput,
    longOutputUsd,
    shortInput,
    shortOutputUsd,
  ]);

  const isValidDecimalString = (str) => {
    if (str == 0) return false;
    // const regex = /^(?![0]+$)\d+(\.\d+)?$/;
    const regex = /^\d+(\.\d+)?$/;
    return regex.test(str);
  };

  // get pools detail
  const [simplePools, setSimplePools] = useState<any[]>([]);
  const [stablePools, setStablePools] = useState<any[]>([]);
  const [stablePoolsDetail, setStablePoolsDetail] = useState<any[]>([]);
  useEffect(() => {
    getPoolsData();
  }, []);
  async function getPoolsData() {
    const { ratedPools, unRatedPools, simplePools: simplePoolsFromSdk } = await fetchAllPools();
    const stablePoolsFromSdk = unRatedPools.concat(ratedPools);
    const stablePoolsDetailFromSdk = await getStablePools(stablePools);
    setSimplePools(simplePoolsFromSdk);
    setStablePools(stablePoolsFromSdk);
    setStablePoolsDetail(stablePoolsDetailFromSdk);
  }
  // pools end

  const [tokenInAmount, setTokenInAmount] = useState(0);
  // get cate1 amount
  const estimateData = useEstimateSwap({
    tokenIn_id: ReduxcategoryAssets2.token_id,
    tokenOut_id: ReduxcategoryAssets1.token_id,
    tokenIn_amount: String(tokenInAmount),
    account_id: accountId,
    simplePools,
    stablePools,
    stablePoolsDetail,
    slippageTolerance: slippageTolerance / 100, // test
  });
  //
  // useEffect(() => {
  //   const longInputUsdChar = assets.data[ReduxcategoryAssets2["token_id"]].price?.usd;

  //   let openFeeAmount;
  //   let tknc;
  //   if (activeTab == "long") {
  //     if (longInputUsdChar && longInput) {
  //       setLongInputUsd(longInputUsdChar * Number(longInput));
  //       openFeeAmount = (longInput * config.open_position_fee_rate) / 10000;
  //       tknc = (longInput - openFeeAmount) * longInputUsdChar * rangeMount;
  //     }
  //     setTokenInAmount(tknc);
  //   } else if (longInputUsdChar && shortInput) {
  //     setShortInputUsd(longInputUsdChar * Number(shortInput));
  //     openFeeAmount = (shortInput * config.open_position_fee_rate) / 10000;
  //     tknc = (shortInput - openFeeAmount) * longInputUsdChar * rangeMount;
  //     setTokenInAmount(tknc);
  //   }
  //   //
  // }, [longInput, shortInput]);

  // long & short input change fn.
  const inputPriceChange = (value) => {
    let openFeeAmount;
    let inputAmount;
    const inputUsdChar = assets.data[ReduxcategoryAssets2["token_id"]].price?.usd;

    if (inputUsdChar) {
      if (activeTab == "long") {
        inputAmount = Number(value);
        openFeeAmount = (inputAmount * config.open_position_fee_rate) / 10000;
        setLongInput(inputAmount); // amount
        setLongInputUsd(inputUsdChar * inputAmount); // amount price
        setTokenInAmount((inputAmount - openFeeAmount) * inputUsdChar * rangeMount); // calcaute
        setLongOutputUsd(estimateData?.amount_out); // set cate1 amount

        /* *
         * wait set cate1 price
         * */
      } else {
        inputAmount = Number(value);
        openFeeAmount = (inputAmount * config.open_position_fee_rate) / 10000;
        setShortInput(inputAmount);
        setShortInputUsd(inputUsdChar * inputAmount);
        setTokenInAmount((inputAmount - openFeeAmount) * inputUsdChar * rangeMount);
        setShortOutputUsd(estimateData?.amount_out);
        /* *
         * wait set cate1 price
         * */
      }
    }

    // const obj = {
    //   longInput: setLongInput,
    //   shortInput: setShortInput,
    // };
    // return obj[flag](value);
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
                  <input
                    disabled={selectedSetUpOption === "auto"}
                    type="number"
                    onChange={(e) => slippageToleranceChange(e.target.value)}
                    value={slippageTolerance}
                    style={{ width: "32px" }}
                  />
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
              <input
                onChange={(e) => inputPriceChange(e.target.value)}
                type="number"
                value={longInput}
                placeholder="0"
              />
              <div className="absolute top-2 right-2">
                <TradingToken tokenList={categoryAssets2} type="cate2" />
              </div>
              <p className="text-gray-300 mt-2 text-xs">Usd: ${longInputUsd}</p>
            </div>
            <div className="relative my-2.5 flex justify-end z-0 w-1/2" style={{ zoom: "2" }}>
              <ShrinkArrow />
            </div>
            <div className="relative bg-dark-600 border border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md z-20">
              {/* long out  */}
              <input disabled type="text" value={estimateData?.amount_out} placeholder="0" />
              {/*  */}
              <div className="absolute top-2 right-2">
                <TradingToken tokenList={categoryAssets1} type="cate1" />
              </div>
              <p className="text-gray-300 mt-2 text-xs">Long: ${longOutputUsd}</p>
            </div>
            <RangeSlider defaultValue={rangeMount} action="Long" setRangeMount={setRangeMount} />
            {accountId && (
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
                  className={`flex items-center justify-between  text-dark-200 text-base rounded-md h-12 text-center  ${
                    isDisabled ? "bg-slate-700 cursor-default" : "bg-primary cursor-pointer"
                  }`}
                  onClick={handleConfirmButtonClick}
                >
                  <div className="flex-grow">Long NEAR {rangeMount}x</div>
                </div>
                {isConfirmModalOpen && (
                  <ConfirmMobile
                    open={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    action="Long"
                  />
                )}
              </div>
            )}
          </>
        )}
        {activeTab === "short" && (
          <>
            <div className="relative bg-dark-600 border border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md z-30">
              <input
                onChange={(e) => inputPriceChange(e.target.value)}
                type="number"
                value={shortInput}
                placeholder="0"
              />
              <div className="absolute top-2 right-2">
                <TradingToken tokenList={categoryAssets2} type="cate2" />
              </div>
              <p className="text-gray-300 mt-2 text-xs">Usd: ${shortInputUsd}</p>
            </div>
            <div className="relative my-2.5 flex justify-end z-0 w-1/2" style={{ zoom: "2" }}>
              <ShrinkArrow />
            </div>
            <div className="relative bg-dark-600 border border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md z-20">
              {/* short out */}
              <input disabled type="text" value={estimateData?.amount_out} placeholder="0" />
              {/*  */}
              <div className="absolute top-2 right-2">
                <TradingToken tokenList={categoryAssets1} type="cate1" />
              </div>
              <p className="text-gray-300 mt-2 text-xs">Long: ${shortOutputUsd}</p>
            </div>
            <RangeSlider defaultValue={rangeMount} action="Short" setRangeMount={setRangeMount} />
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
                className={`flex items-center justify-between  text-dark-200 text-base rounded-md h-12 text-center  ${
                  isDisabled ? "bg-slate-700 cursor-default" : "bg-red-50 cursor-pointer"
                }`}
              >
                <div className="flex-grow">Short NEAR {rangeMount}x</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TradingOperate;
