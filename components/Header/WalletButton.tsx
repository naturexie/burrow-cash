import { useState, useEffect, useRef } from "react";
import { Button, Box, IconButton, useTheme, useMediaQuery, Typography } from "@mui/material";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";
import type { WalletSelector } from "@near-wallet-selector/core";

import { BeatLoader } from "react-spinners";
import Decimal from "decimal.js";
import { fetchAssets, fetchRefPrices } from "../../redux/assetsSlice";
import { logoutAccount, fetchAccount, setAccountId } from "../../redux/accountSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getBurrow, accountTrim } from "../../utils";

import { hideModal as _hideModal } from "../../redux/appSlice";

import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { getAccountRewards, IAccountRewards } from "../../redux/selectors/getAccountRewards";
import { trackConnectWallet, trackLogout } from "../../utils/telemetry";
import { useDegenMode } from "../../hooks/hooks";
import { HamburgerMenu } from "./Menu";
import Disclaimer from "../Disclaimer";
import { useDisclaimer } from "../../hooks/useDisclaimer";
import { NearSolidIcon, ArrowDownIcon } from "./svg";
import NearIcon from "../../public/near-icon.svg";
import ClaimAllRewards from "../ClaimAllRewards";
import { formatWithCommas_usd } from "../../utils/uiNumber";

const WalletButton = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const balance = useAppSelector(getAccountBalance);
  const accountId = useAppSelector(getAccountId);
  const { degenMode } = useDegenMode();
  const [isDisclaimerOpen, setDisclaimer] = useState(false);
  const { getDisclaimer: hasAgreedDisclaimer } = useDisclaimer();
  const [show_account_detail, set_show_account_detail] = useState(false);

  const selectorRef = useRef<WalletSelector>();
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const rewards = useAppSelector(getAccountRewards);

  const hideModal = () => {
    dispatch(_hideModal());
  };

  const fetchData = (id?: string) => {
    dispatch(setAccountId(id));
    dispatch(fetchAccount());
    dispatch(fetchAssets()).then(() => dispatch(fetchRefPrices()));
  };

  const signOut = () => {
    dispatch(logoutAccount());
  };

  const onMount = async () => {
    if (selector) return;
    const { selector: s } = await getBurrow({ fetchData, hideModal, signOut });

    selectorRef.current = s;
    setSelector(s);
    window.selector = s;
  };

  useEffect(() => {
    onMount();
  }, []);

  const onWalletButtonClick = async () => {
    if (!hasAgreedDisclaimer) {
      setDisclaimer(true);
      return;
    }
    if (accountId) return;
    trackConnectWallet();
    window.modal.show();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSignOut = async () => {
    const { signOut: signOutBurrow } = await getBurrow();
    signOutBurrow();
    trackLogout();
    setAnchorEl(null);
    setDisclaimer(false);
  };
  const handleSwitchWallet = async () => {
    await handleSignOut();
    window.modal.show();
  };

  const getUnClaimRewards = () => {
    const sumRewards = rewards.sumRewards || {};
    const sumRewards$ = Object.values(sumRewards).reduce((_sum, cur) => {
      return new Decimal(cur.unclaimedAmount || 0).mul(cur.price || 0).toFixed();
    }, "0");
    return formatWithCommas_usd(sumRewards$);
  };
  return (
    <Box
      sx={{
        gridArea: "wallet",
        marginLeft: "1rem",
        marginRight: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      {accountId ? (
        // <Box
        //   sx={{
        //     fontSize: "0.8rem",
        //     display: "flex",
        //     flexFlow: isMobile ? "column" : "row",
        //     alignItems: ["flex-end", "center"],
        //   }}
        // >
        //   <Typography sx={{ fontWeight: "semibold", fontSize: "0.85rem" }}>
        //     {accountTrim(accountId)}
        //   </Typography>
        //   <Box
        //     sx={{
        //       display: "flex",
        //       justifyContent: "flex-end",
        //       marginLeft: 1,
        //       alignItems: "center",
        //       mt: ["-0.3rem", 0],
        //     }}
        //   >
        //     <Typography sx={{ lineHeight: 0, fontSize: "0.85rem" }}>
        //       {Number.parseFloat(balance).toFixed(2)}
        //     </Typography>
        //     <NearIcon style={{ width: "1.5rem", height: "1.5rem", fill: "white" }} />
        //     {degenMode.enabled && (
        //       <Box
        //         sx={{
        //           marginRight: "-6px",
        //           backgroundColor: theme.palette.primary.light,
        //           color: theme.palette.secondary.main,
        //           borderRadius: "0.3rem",
        //           fontSize: "0.65rem",
        //           px: "0.3rem",
        //           py: "0.1rem",
        //         }}
        //       >
        //         degen
        //       </Box>
        //     )}
        //   </Box>
        // </Box>
        <div className="flex items-center gap-4">
          {/* near balance */}
          <div className="flex items-center gap-2 border border-dark-50 bg-gray-800 px-2.5 py-2 rounded-md">
            <NearSolidIcon />
            <span className="text-base text-white font-bold">
              {balance === "..." ? "..." : Number.parseFloat(balance).toFixed(2)}
            </span>
          </div>
          {/* account */}
          <div
            className="flex flex-col items-end"
            onMouseEnter={() => {
              set_show_account_detail(true);
            }}
            onMouseLeave={() => {
              set_show_account_detail(false);
            }}
          >
            <div
              style={{ minWidth: "150px" }}
              className={`flex items-center justify-between border border-primary rounded-md px-3 py-2 text-base font-bold text-white cursor-pointer ${
                show_account_detail ? " bg-primary bg-opacity-20" : ""
              }`}
            >
              <span className="mr-4">{accountTrim(accountId)}</span>
              <span className={`${show_account_detail ? "transform rotate-180" : ""}`}>
                <ArrowDownIcon />
              </span>
            </div>
            <div className={`absolute z-50 top-12 pt-4 ${show_account_detail ? "" : "hidden"}`}>
              <div className={`flex flex-col border border-dark-300 bg-dark-100 rounded-md p-4 `}>
                <span className=" text-white text-lg">{accountTrim(accountId)}</span>
                <div className="flex items-center text-xs text-gray-300 -ml-1">
                  <NearIcon style={{ width: "1.5rem", height: "1.5rem", fill: "white" }} />
                  Near Wallet
                </div>
                <div className="flex items-center justify-between w-full gap-2 my-3.5">
                  <div
                    style={{ width: "104px" }}
                    onClick={handleSwitchWallet}
                    className="flex items-center justify-center border border-primary border-opacity-60 cursor-pointer rounded-md text-sm text-primary font-bold bg-primary hover:opacity-80 bg-opacity-5 py-1"
                  >
                    Change
                  </div>
                  <div
                    role="button"
                    style={{ width: "104px" }}
                    onClick={handleSignOut}
                    className="flex items-center justify-center border border-red-50 border-opacity-60 cursor-pointer rounded-md text-sm text-red-50 font-bold bg-red-50 bg-opacity-5 hover:opacity-80 py-1"
                  >
                    Disconnect
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-300">Rewards</span>
                    <span className="text-base text-white font-bold">{getUnClaimRewards()}</span>
                  </div>
                  <ClaimAllRewards Button={ClaimButtonInAccount} location="menu" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Button
          size="small"
          sx={{
            justifySelf: "end",
            alignItems: "center",
            cursor: accountId ? "default" : "pointer",
            color: "#000",
            textTransform: "none",
            fontSize: "16px",
            padding: "0 20px",
            height: "40px",
            borderRadius: "6px",
            ":hover": {
              backgroundColor: "#D2FF3A",
            },
          }}
          variant={accountId ? "outlined" : "contained"}
          onClick={onWalletButtonClick}
          disableRipple={!!accountId}
        >
          Connect Wallet
        </Button>
      )}
      {/* <Box>
        <IconButton onClick={handleOpenMenu} sx={{ ml: "0.5rem", mr: "-0.5rem" }}>
          <GiHamburgerMenu size={32} color="white" />
        </IconButton>
      </Box>
      <HamburgerMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} /> */}
      <Disclaimer isOpen={isDisclaimerOpen} onClose={() => setDisclaimer(false)} />
    </Box>
  );
};
const ClaimButtonInAccount = (props) => {
  const { loading, disabled } = props;
  return (
    <div
      {...props}
      className="flex items-center justify-center bg-primary rounded-md cursor-pointer text-sm font-bold text-dark-200 hover:opacity-80 w-20 h-8"
    >
      {loading ? <BeatLoader size={5} color="#14162B" /> : <>Claim all</>}
    </div>
  );
};

export default WalletButton;
