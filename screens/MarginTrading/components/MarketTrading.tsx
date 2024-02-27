import React from "react";
import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon, TestNearIcon } from "./Icon";

const MarketMarginTrading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex justify-between items-center w-full h-[100px] border border-dark-50 bg-gray-800 rounded-md mb-8">
        <DataItem title="Total Volume" value="$16.96M" />
        <DataItem title="24H Volume" value="$3.85K" />
        <DataItem title="Long Open Interest" value="$12.91M" />
        <DataItem title="Short Open Interest" value="$4.05M" />
      </div>
      <TableHead />
      <TableBody />
    </div>
  );
};

const DataItem = ({ title, value }) => (
  <div className="flex flex-1 justify-center">
    <div>
      <p className="text-gray-300 text-sm">{title}</p>
      <h2 className="text-h2">{value}</h2>
    </div>
  </div>
);

function SortButton({ sort, color }: { sort?: "asc" | "desc"; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 ml-1.5">
      <ArrowUpIcon
        fill={color}
        className={`text-black ${sort === "asc" ? "" : "text-opacity-30"}`}
      />
      <ArrowDownIcon
        fill={color}
        className={`text-black ${sort === "desc" ? "" : "text-opacity-30"}`}
      />
    </div>
  );
}

function TableHead() {
  return (
    <div className="w-full grid grid-cols-5 h-12">
      <div className="grid grid-cols-3 col-span-3 border border-dark-50 bg-gray-800 rounded-t-2xl items-center text-sm text-gray-300">
        <div className="col-span-1 flex items-center cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
          Market
        </div>
        <div className="col-span-1 flex items-center cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
          Total Volume <SortButton color="#C0C4E9" />
        </div>
        <div className="col-span-1 flex items-center cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
          24H Volume
          <SortButton color="#C0C4E9" />
        </div>
      </div>
      <div className="grid grid-cols-1 col-span-1 bg-primary rounded-t-2xl items-center text-sm text-black">
        <div className="col-span-1 flex items-center cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
          Long Position
          <SortButton color="#000000" />
        </div>
      </div>
      <div className="grid grid-cols-1 col-span-1 bg-red-50 rounded-t-2xl items-center text-sm text-black">
        <div className="col-span-1 flex items-center cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
          Short Position
          <SortButton color="#000000" />
        </div>
      </div>
    </div>
  );
}

function TableBody() {
  return (
    <>
      <Link href="https://burrow.finance/">
        <div className="w-full grid grid-cols-5 bg-gray-800 hover:bg-dark-100 cursor-pointer mt-0.5 h-[60px]">
          <div className="relative col-span-1 flex items-center justify-self-start pl-14">
            <TestNearIcon />
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">USDC</div>
              <span className="text-xs text-gray-300">$3.742</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">1.10M</div>
              <span className="text-xs text-gray-300">$4.11M</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">357.63K</div>
              <span className="text-xs text-gray-300">$1.34M</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">561.25K</div>
              <span className="text-xs text-gray-300">$785.76K</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">561.25K</div>
              <span className="text-xs text-gray-300">$785.76K</span>
            </div>
          </div>
        </div>
      </Link>
      <Link href="https://burrow.finance/">
        <div className="w-full grid grid-cols-5 bg-gray-800 hover:bg-dark-100 cursor-pointer mt-0.5 h-[60px]">
          <div className="relative col-span-1 flex items-center justify-self-start pl-14">
            <TestNearIcon />
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">
                USDC
                <span
                  style={{ zoom: 0.85 }}
                  className="text-gray-300 italic text-xs transform -translate-y-0.5 ml-0.5"
                >
                  Native
                </span>
              </div>
              <span className="text-xs text-gray-300">$3.742</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">1.10M</div>
              <span className="text-xs text-gray-300">$4.11M</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">357.63K</div>
              <span className="text-xs text-gray-300">$1.34M</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">561.25K</div>
              <span className="text-xs text-gray-300">$785.76K</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-end">561.25K</div>
              <span className="text-xs text-gray-300">$785.76K</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default MarketMarginTrading;
