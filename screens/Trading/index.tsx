import Link from "next/link";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { LayoutBox } from "../../components/LayoutContainer/LayoutContainer";
import { ComeBackIcon, ShrinkArrow, TokenArrow } from "./components/TradingIcon";
import { TestNearIcon } from "../MarginTrading/components/Icon";
import TradingTable from "./components/Table";
import TradingOperate from "./components/TradingOperate";

const Trading = () => {
  const dispatch = useAppDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState("USDC");
  const tokenList = ["USDC", "DAI", "USDT", "USDC.e"];
  let timer;

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  const handleTokenSelect = (item) => {
    setSelectedItem(item);
    setShowPopup(false);
  };

  const handleMouseEnter = () => {
    clearTimeout(timer);
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => {
      setShowPopup(false);
    }, 200);
  };
  return (
    <LayoutBox>
      <Link href="/marginTrading">
        <div className="flex items-center text-sm text-gray-300 cursor-pointer mb-8">
          <ComeBackIcon />
          <p className="ml-3.5"> Margin Trading Markets</p>
        </div>
      </Link>
      <div className="grid grid-cols-6 mb-4">
        <div className="col-span-4 bg-gray-800 border border-dark-50 rounded-md mr-4">
          <div className="flex justify-between items-center border-b border-dark-50 py-6 px-5">
            <div className="flex items-center">
              <TestNearIcon />
              <p className="ml-2 mr-3.5 text-lg">NEAR</p>
              <ShrinkArrow />
            </div>
            <div className="text-sm">
              <div className="flex justify-center items-center">
                <p className="text-gray-300 mr-1.5">Price</p>
                <div
                  className="relative hover:bg-gray-300 hover:bg-opacity-20 py-1 px-1.5 rounded-sm cursor-pointer"
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    onMouseEnter={handleMouseEnter}
                    onClick={handlePopupToggle}
                    className="flex justify-center items-center"
                  >
                    <p className="mr-1">{selectedItem}</p>
                    <TokenArrow />
                  </div>
                  {showPopup && (
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="bg-dark-250 border border-dark-500 rounded-sm absolute top-8 left-0 right-0 pt-0.5 text-gray-300 text-xs pb-1.5 w-16"
                    >
                      {tokenList.map((token, index) => (
                        <div
                          key={index}
                          className="py-1 pl-1.5 hover:bg-gray-950"
                          onClick={() => handleTokenSelect(token)}
                        >
                          {token}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span>3.282</span>
            </div>
            <div className="text-sm">
              <p className="text-gray-300  mb-1.5">Total Volume</p>
              <span>$23.25M</span>
            </div>
            <div className="text-sm">
              <p className="text-gray-300 mb-1.5">24H Volume</p>
              <span>$13.25K</span>
            </div>
            <div className="text-sm">
              <p className="text-gray-300 mb-1.5">Long/Short Positions</p>
              <span>$12.89K / $243.36K</span>
            </div>
          </div>
          <div style={{ height: "520px" }} />
        </div>
        <div className="col-span-2 bg-gray-800 border border-dark-50 rounded-md">
          <TradingOperate />
        </div>
      </div>
      <TradingTable />
    </LayoutBox>
  );
};

export default Trading;
