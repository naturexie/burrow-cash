import React, { useState } from "react";
import TradingToken from "./tokenbox";
import { SetUp } from "./TradingIcon";

const TradingOperate = () => {
  const [activeTab, setActiveTab] = useState("long");

  const handleTabClick = (tabString) => {
    setActiveTab(tabString);
  };

  const getTabClassName = (tabName) => {
    return activeTab === tabName
      ? "bg-primary text-dark-200 py-2.5 pl-6 pr-8 rounded-md"
      : "text-gray-300 py-2.5 pl-8 pr-10";
  };

  return (
    <div className="w-full pt-4 px-4 pb-9">
      <div className="flex justify-between items-center">
        <div className="flex bg-dark-200 px-0.5 py-0.5 rounded-md cursor-pointer mr-3">
          <div className={getTabClassName("long")} onClick={() => handleTabClick("long")}>
            Long NEAR
          </div>
          <div className={getTabClassName("short")} onClick={() => handleTabClick("short")}>
            Short NEAR
          </div>
        </div>
        <div>
          <SetUp />
        </div>
      </div>
      <div className="mt-5">
        {activeTab === "long" && (
          <div className="relative bg-dark-600 border  border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md">
            <input type="text" value={0} />
            <div className="absolute top-2 right-2">
              <TradingToken />
            </div>
            <p className="text-gray-300 mt-2 text-xs">Use: $0.00</p>
          </div>
        )}
        {activeTab === "short" && <p>Content for Short NEAR</p>}
      </div>
    </div>
  );
};

export default TradingOperate;
