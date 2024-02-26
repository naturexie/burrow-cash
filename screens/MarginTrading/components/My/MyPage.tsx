import React from "react";

const DataItem = ({ title, value }) => (
  <div className="flex flex-1 justify-center">
    <div>
      <p className="text-gray-300 text-sm">{title}</p>
      <h2 className="text-h2">{value}</h2>
    </div>
  </div>
);

const MyMarginTradingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex justify-between items-center w-full h-[100px] border border-dark-50 bg-gray-800 rounded-xl mb-8">
        <DataItem title="Long Open Interest" value="$298.70" />
        <DataItem title="Short Open Interest" value="$100.05" />
        <DataItem title="Collateral" value="$200" />
        <DataItem title="PLN" value="+$0.16" />
      </div>
    </div>
  );
};

export default MyMarginTradingPage;
