import React, { useState } from "react";
import TradingTable from "../../../Trading/components/Table";

const MyMarginTradingPage = () => {
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
            <h2 className="text-h2 border-b border-dashed border-dark-800">$200</h2>
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
