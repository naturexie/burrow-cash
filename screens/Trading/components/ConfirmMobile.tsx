import { useEffect, useState, createContext } from "react";
import { Modal as MUIModal, Typography, Box, Stack, useTheme } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { hideModal, updateAmount, updatePosition } from "../../../redux/appSlice";
import { getModalStatus, getAssetData, getSelectedValues } from "../../../redux/appSelectors";
import { Wrapper } from "../../../components/Modal/style";
import { DEFAULT_POSITION, lpTokenPrefix } from "../../../utils/config";

export const ModalContext = createContext(null) as any;
const ConfirmMobile = () => {
  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(hideModal());
  const theme = useTheme();
  const [selectedCollateralType, setSelectedCollateralType] = useState(DEFAULT_POSITION);

  return (
    <MUIModal open onClose={handleClose}>
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
          <Box sx={{ p: ["20px", "20px"] }}>弹窗内容</Box>
        </ModalContext.Provider>
      </Wrapper>
    </MUIModal>
  );
};

export default ConfirmMobile;
