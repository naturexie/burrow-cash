import { useState, createContext } from "react";
import { Modal as MUIModal, Box, useTheme } from "@mui/material";
import { useAppDispatch } from "../../../redux/hooks";
import { Wrapper } from "../../../components/Modal/style";
import { DEFAULT_POSITION } from "../../../utils/config";
import { CloseIcon } from "../../../components/Modal/svg";
import { RefLogoIcon, RightArrow, RightShoulder } from "./TradingIcon";
import { NearIcon } from "../../MarginTrading/components/Icon";
import { useMarginAccount } from "../../../hooks/useMarginAccount";
import { toInternationalCurrencySystem_number } from "../../../utils/uiNumber";

export const ModalContext = createContext(null) as any;
const ChangeCollateralMobile = ({ open, onClose, rowData }) => {
  const { getAssetDetails } = useMarginAccount();
  const {
    positionType,
    leverage,
    assetC,
    assetD,
    assetP,
    collateral,
    entryPrice,
    sizeValue,
    netValue,
  } = rowData;
  const {
    price: priceC,
    symbol: symbolC,
    decimals: decimalsC,
    icon: iconC,
  } = getAssetDetails(assetC);
  console.log(rowData);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [selectedCollateralType, setSelectedCollateralType] = useState(DEFAULT_POSITION);
  const [ChangeCollateralTab, setChangeCollateralTab] = useState("Add");
  const handleChangeCollateralTabClick = (tab) => {
    setChangeCollateralTab(tab);
  };
  const [selectedLever, setSelectedLever] = useState(null);
  const handleLeverClick = (value) => {
    setSelectedLever(value);
  };
  const leverData = [
    { label: "25%", value: "25" },
    { label: "50%", value: "50" },
    { label: "75%", value: "75" },
    { label: "Max", value: "Max" },
  ];
  const handleChange = (e) => {
    console.log(e);
  };
  return (
    <MUIModal open={open} onClose={onClose}>
      <Wrapper
        sx={{
          "& *::-webkit-scrollbar": {
            backgroundColor: theme.custom.scrollbarBg,
          },
        }}
      >
        <ModalContext.Provider
          value={{
            position: selectedCollateralType,
          }}
        >
          <Box sx={{ p: ["20px", "20px"] }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center">
                <p className="text-lg mr-2">Change Collateral</p>
                <div
                  className={`bg-opacity-10  text-xs py-0.5 pl-2.5 pr-1.5 rounded text-primary ${
                    positionType.class
                  } ${positionType.label === "Long" ? "bg-primary" : "bg-red-50"}`}
                >
                  {positionType.label}
                  <span className="ml-1.5">
                    {positionType.label === "Long"
                      ? assetP.metadata?.symbol === "wNEAR"
                        ? "NEAR"
                        : assetP.metadata?.symbol
                      : assetD.metadata?.symbol === "wNEAR"
                      ? "NEAR"
                      : assetD.metadata?.symbol}
                  </span>
                </div>
              </div>
              <div className="cursor-pointer">
                <CloseIcon onClick={onClose} />
              </div>
            </div>
            <div className="flex justify-center items-center border-b border-dark-700 -mx-5 -px-5 mt-6 px-5">
              <div
                className={`py-2 w-1/2 text-center cursor-pointer text-gray-300 text-lg ${
                  ChangeCollateralTab === "Add" ? "text-primary border-b border-primary" : ""
                }`}
                onClick={() => handleChangeCollateralTabClick("Add")}
              >
                Add
              </div>
              <div
                className={`pb-3.5 w-1/2 text-center cursor-pointer text-gray-300 text-lg ${
                  ChangeCollateralTab === "Remove" ? "text-red-50 border-b border-red-50" : ""
                }`}
                onClick={() => handleChangeCollateralTabClick("Remove")}
              >
                Remove
              </div>
            </div>
            <div className="mt-4">
              {ChangeCollateralTab === "Add" && (
                <div className="py-2">
                  <div className=" bg-dark-600 border border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md flex items-center justify-between mb-1.5">
                    <div>
                      <input type="text" value={0} onChange={handleChange} />
                      <p className="text-gray-300 text-xs mt-1.5">Add: $-</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-end">
                        <img src={iconC} alt="" className="w-4 h-4" />
                        <p className="text-base ml-1">{symbolC}</p>
                      </div>
                      <p className="text-xs text-gray-300 mt-1.5">
                        Max Available: <span className="text-white">-</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mb-7">
                    {leverData.map((item, index) => (
                      <div
                        key={index}
                        className={`bg-dark-600 border border-dark-500 py-1 px-2 rounded-md text-xs text-gray-300 mr-2 cursor-pointer hover:bg-gray-700 ${
                          selectedLever === item.value ? "bg-gray-700" : ""
                        }`}
                        onClick={() => handleLeverClick(item.value)}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Position Size</div>
                    <div>
                      -
                      <span className="text-xs text-gray-300 ml-1.5">
                        (${toInternationalCurrencySystem_number(sizeValue)})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Collateral ({symbolC})</div>
                    <div>${toInternationalCurrencySystem_number(netValue)}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Leverage</div>
                    <div>{toInternationalCurrencySystem_number(leverage)}X</div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Entry Price</div>
                    <div>${toInternationalCurrencySystem_number(entryPrice)}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Liq. Price</div>
                    <div>$-</div>
                  </div>
                  <div className="flex items-center bg-primary justify-between text-dark-200 text-base rounded-md h-12 text-center cursor-pointer">
                    <div className="flex-grow">Add Collateral</div>
                  </div>
                </div>
              )}
              {ChangeCollateralTab === "Remove" && (
                <div className="py-2">
                  <div className=" bg-dark-600 border border-dark-500 pt-3 pb-2.5 pr-3 pl-2.5 rounded-md flex items-center justify-between mb-1.5">
                    <div>
                      <input type="text" value={0} onChange={handleChange} />
                      <p className="text-gray-300 text-xs mt-1.5">Add: $-</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-end">
                        <img src={iconC} alt="" className="w-4 h-4" />
                        <p className="text-base ml-1">{symbolC}</p>
                      </div>
                      <p className="text-xs text-gray-300 mt-1.5">
                        Max Available: <span className="text-white">-</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mb-7">
                    {leverData.map((item, index) => (
                      <div
                        key={index}
                        className={`bg-dark-600 border border-dark-500 py-1 px-2 rounded-md text-xs text-gray-300 mr-2 cursor-pointer hover:bg-gray-700 ${
                          selectedLever === item.value ? "bg-gray-700" : ""
                        }`}
                        onClick={() => handleLeverClick(item.value)}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Position Size</div>
                    <div>
                      -
                      <span className="text-xs text-gray-300 ml-1.5">
                        (${toInternationalCurrencySystem_number(sizeValue)})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Collateral ({symbolC})</div>
                    <div className="flex items-center justify-center">
                      {/* <span className="text-gray-300 mr-2 line-through">$101.23</span> */}
                      {/* <RightArrow /> */}
                      <p className="ml-2">${toInternationalCurrencySystem_number(netValue)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Leverage</div>
                    <div className="flex items-center justify-center">
                      {/* <span className="text-gray-300 mr-2 line-through">1.1X</span>
                      <RightArrow /> */}
                      <p className="ml-2">{toInternationalCurrencySystem_number(leverage)}X</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Entry Price</div>
                    <div>${toInternationalCurrencySystem_number(entryPrice)}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">Liq. Price</div>
                    <div className="flex items-center justify-center">
                      {/* <span className="text-gray-300 mr-2 line-through">$-</span>
                      <RightArrow /> */}
                      <p className="ml-2">$-</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-red-50 justify-between text-dark-200 text-base rounded-md h-12 text-center cursor-pointer">
                    <div className="flex-grow">Remove Collateral</div>
                  </div>
                </div>
              )}
            </div>
          </Box>
        </ModalContext.Provider>
      </Wrapper>
    </MUIModal>
  );
};

export default ChangeCollateralMobile;
