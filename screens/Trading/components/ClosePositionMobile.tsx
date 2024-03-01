import { useState, createContext } from "react";
import { Modal as MUIModal, Box, useTheme } from "@mui/material";
import { useAppDispatch } from "../../../redux/hooks";
import { Wrapper } from "../../../components/Modal/style";
import { DEFAULT_POSITION } from "../../../utils/config";
import { CloseIcon } from "../../../components/Modal/svg";
import { RefLogoIcon, RightArrow, RightShoulder } from "./TradingIcon";

export const ModalContext = createContext(null) as any;
const ClosePositionMobile = ({ open, onClose, action }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [selectedCollateralType, setSelectedCollateralType] = useState(DEFAULT_POSITION);
  const actionShowRedColor = action === "Long";
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
                <p className="text-lg mr-2">Close Position</p>
                <div
                  className={`bg-opacity-10  text-xs py-0.5 pl-2.5 pr-1.5 rounded ${
                    actionShowRedColor ? "bg-primary text-primary" : "bg-red-50 text-red-50"
                  }`}
                >
                  Long NEAR 1.5X
                </div>
              </div>
              <div className="cursor-pointer">
                <CloseIcon onClick={onClose} />
              </div>
            </div>
            <div className="pt-10 pb-8 flex items-center justify-around  border-b border-dark-700 -mx-5 px-5 mb-5">
              <div className="text-center leading-3">
                <p className="text-lg">45.2435 NEAR</p>
                <span className="text-xs text-gray-300">Close amount</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="text-gray-300">Entry & Index Price</div>
              <div>$3.24 / $3.23</div>
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="text-gray-300">Market Price</div>
              <div>$3.23</div>
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="text-gray-300">Leverage</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-300 mr-2 line-through">1.2X</span>
                <RightArrow />
                <p className="ml-2"> 0.0X</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="text-gray-300">Liq. Price</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-300 mr-2 line-through">$1.23</span>
                <RightArrow />
                <p className="ml-2"> $0.00</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="text-gray-300">Collateral</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-300 mr-2 line-through">$99.99</span>
                <RightArrow />
                <p className="ml-2"> $0.00</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="text-gray-300">Current Total PNL</div>
              <div className="flex items-center justify-center">
                <span className="text-red-50">-$0.0689</span>
                <span className="text-xs text-gray-300 ml-1.5">(-2.01%)</span>
              </div>
            </div>
            <div
              className={`flex items-center justify-between text-dark-200 text-base rounded-md h-12 text-center cursor-pointer ${
                actionShowRedColor ? "bg-primary" : "bg-red-50"
              }`}
            >
              <div className="flex-grow">Close</div>
            </div>
          </Box>
        </ModalContext.Provider>
      </Wrapper>
    </MUIModal>
  );
};

export default ClosePositionMobile;
