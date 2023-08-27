import React, { useState } from "react";
import { Stack, Typography, Box, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import { BrrrLogo, StakingPill, StakingCard, LiveUnclaimedAmount } from "./components";
import { useAppSelector } from "../../redux/hooks";
import { getTotalBRRR } from "../../redux/selectors/getTotalBRRR";
import { TOKEN_FORMAT } from "../../store";
import { useStaking } from "../../hooks/useStaking";
import { useClaimAllRewards } from "../../hooks/useClaimAllRewards";
import { trackUnstake } from "../../utils/telemetry";
import { unstake } from "../../store/actions/unstake";
import { StakingModal } from "./modal";
import { useAccountId } from "../../hooks/hooks";
import { ContentBox } from "../../components/ContentBox/ContentBox";
import CustomButton from "../../components/CustomButton/CustomButton";
import LayoutContainer from "../../components/LayoutContainer/LayoutContainer";
import ModalStaking from "./modalStaking";
import { modalProps } from "../../interfaces/common";

const Staking = () => {
  const [total] = useAppSelector(getTotalBRRR);
  const { BRRR, stakingTimestamp } = useStaking();
  const { handleClaimAll, isLoading } = useClaimAllRewards("staking");
  const [loadingUnstake, setLoadingUnstake] = useState(false);
  const [isModalOpen, openModal] = useState(false);
  const [modal, setModal] = useState<modalProps>();
  const accountId = useAccountId();
  const theme = useTheme();

  const unstakeDate = DateTime.fromMillis(stakingTimestamp / 1e6);
  const disabledUnstake = DateTime.now() < unstakeDate;

  const handleUnstake = async () => {
    try {
      trackUnstake();
      await unstake();
      setLoadingUnstake(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <LayoutContainer>
      <div>
        <div className="flex justify-center">
          <div className="mb-10">
            <div className="flex justify-center">{Mascot}</div>
            <div className="h2 flex gap-4">
              <BrrrLogo color="#D2FF3A" /> <LiveUnclaimedAmount addAmount={total} /> BRRR
            </div>
          </div>
        </div>
        <div className="md:flex justify-center gap-4">
          <StakingBox text1="💰 Available" value1={total.toLocaleString(undefined, TOKEN_FORMAT)}>
            <CustomButton onClick={() => setModal({ name: "staking" })} className="w-full">
              Stake
            </CustomButton>
          </StakingBox>

          <StakingBox
            text1="🔒 Staking"
            value1={BRRR.toLocaleString(undefined, TOKEN_FORMAT)}
            text2="Due to"
            value2={unstakeDate.toFormat("yyyy-MM-dd / HH:mm")}
          >
            <CustomButton onClick={handleUnstake} className="w-full">
              Unstake
            </CustomButton>
          </StakingBox>

          <StakingBox text1="🎁 Unclaimed Reward" value1={<LiveUnclaimedAmount />}>
            <CustomButton onClick={handleClaimAll} className="w-full" isLoading={isLoading}>
              Claim
            </CustomButton>
          </StakingBox>
        </div>
      </div>

      <ModalStaking
        isOpen={modal?.name === "staking"}
        onClose={() => setModal({ name: "", data: null })}
      />

      <Stack
        alignItems="center"
        mt="2rem"
        spacing="2rem"
        sx={{ px: ["0rem", "2rem"], mx: "auto", mb: "2rem" }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <BrrrLogo />
          <Typography
            fontWeight="semibold"
            fontSize={{ xs: "1.5rem", sm: "2rem" }}
            color={theme.custom.textStaking}
          >
            <LiveUnclaimedAmount addAmount={total} /> BRRR
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <StakingPill>Staked</StakingPill>
          <StakingPill sx={{ background: "#594a42" }}>Available</StakingPill>
          <StakingPill sx={{ background: "#47c285" }}>Unclaimed</StakingPill>
        </Stack>
        <Stack
          spacing={2}
          direction={{ xs: "column-reverse", sm: "row" }}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <StakingCard
            value={BRRR.toLocaleString(undefined, TOKEN_FORMAT)}
            label={`Staked until ${unstakeDate.toFormat("yyyy-MM-dd / HH:mm")}`}
            buttonLabel="Unstake"
            isDisabled={disabledUnstake}
            isLoading={loadingUnstake}
            onClick={handleUnstake}
          />
          <StakingCard
            value={total.toLocaleString(undefined, TOKEN_FORMAT)}
            label="Available to stake"
            color="#594a42"
            buttonLabel="Stake"
            onClick={openModal}
          />
          <StakingCard
            value={<LiveUnclaimedAmount />}
            label="Unclaimed rewards"
            color="#47c285"
            buttonLabel="Claim"
            onClick={handleClaimAll}
            isLoading={isLoading}
          />
        </Stack>
        {/* <StakingModal open={isModalOpen} onClose={() => openModal(false)} /> */}
      </Stack>
    </LayoutContainer>
  );

  // return accountId ? (
  //   <Stack
  //     alignItems="center"
  //     mt="2rem"
  //     spacing="2rem"
  //     sx={{ px: ["0rem", "2rem"], mx: "auto", mb: "2rem" }}
  //   >
  //     <Stack direction="row" alignItems="center" spacing={2}>
  //       <BrrrLogo />
  //       <Typography
  //         fontWeight="semibold"
  //         fontSize={{ xs: "1.5rem", sm: "2rem" }}
  //         color={theme.custom.textStaking}
  //       >
  //         <LiveUnclaimedAmount addAmount={total} /> BRRR
  //       </Typography>
  //     </Stack>
  //     <Stack direction="row" alignItems="center" spacing={2}>
  //       <StakingPill>Staked</StakingPill>
  //       <StakingPill sx={{ background: "#594a42" }}>Available</StakingPill>
  //       <StakingPill sx={{ background: "#47c285" }}>Unclaimed</StakingPill>
  //     </Stack>
  //     <Stack
  //       spacing={2}
  //       direction={{ xs: "column-reverse", sm: "row" }}
  //       sx={{
  //         justifyContent: "center",
  //         alignItems: "center",
  //         width: "100%",
  //       }}
  //     >
  //       <StakingCard
  //         value={BRRR.toLocaleString(undefined, TOKEN_FORMAT)}
  //         label={`Staked until ${unstakeDate.toFormat("yyyy-MM-dd / HH:mm")}`}
  //         buttonLabel="Unstake"
  //         isDisabled={disabledUnstake}
  //         isLoading={loadingUnstake}
  //         onClick={handleUnstake}
  //       />
  //       <StakingCard
  //         value={total.toLocaleString(undefined, TOKEN_FORMAT)}
  //         label="Available to stake"
  //         color="#594a42"
  //         buttonLabel="Stake"
  //         onClick={openModal}
  //       />
  //       <StakingCard
  //         value={<LiveUnclaimedAmount />}
  //         label="Unclaimed rewards"
  //         color="#47c285"
  //         buttonLabel="Claim"
  //         onClick={handleClaimAll}
  //         isLoading={isLoading}
  //       />
  //     </Stack>
  //     <StakingModal open={isModalOpen} onClose={() => openModal(false)} />
  //   </Stack>
  // ) : (
  //   <Box
  //     sx={{
  //       display: "grid",
  //       placeItems: "center",
  //       minHeight: "200px",
  //     }}
  //   >
  //     <Typography color={theme.custom.text}>Please connect your wallet.</Typography>
  //   </Box>
  // );
};

type StakingBoxProps = {
  text1?: string | React.ReactNode;
  value1?: string | React.ReactNode;
  text2?: string;
  value2?: string;
  children?: string | React.ReactNode;
};
const StakingBox = ({ text1, value1, text2, value2, children }: StakingBoxProps) => {
  return (
    <ContentBox className="flex-1" padding="26px">
      <div className="flex justify-between flex-col h-full">
        <div className="flex justify-end lg:justify-between mb-2">
          <div className="hidden lg:block">
            <BrrrLogo color="#D2FF3A" />
          </div>
          <div className="text-right">
            <div>{text1}</div>
            <div className="h2">{value1}</div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-gray-380 h5 mb-2" style={{ minHeight: 20 }}>
            <div>{text2}</div>
            <div>{value2}</div>
          </div>
          {children}
        </div>
      </div>
    </ContentBox>
  );
};

const Mascot = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="159"
    height="148"
    viewBox="0 0 159 148"
    fill="none"
  >
    <ellipse cx="71" cy="120.076" rx="71" ry="8.5" fill="#626486" />
    <path
      d="M19.589 125.673C20.2233 115.1 23.0575 97.905 28.9456 77.7576C45.5594 60.4583 66.8484 55.5223 85.17 58.4933C103.549 61.4738 118.851 72.3872 123.525 86.6554C123.962 87.9909 124.261 90.8122 124.461 94.4433C124.66 98.0481 124.76 102.379 124.825 106.685C124.857 108.809 124.88 110.934 124.902 112.961C124.924 115.03 124.946 116.997 124.974 118.753C125.024 121.82 125.095 124.315 125.236 125.676C125.095 125.703 124.923 125.736 124.719 125.774C124.077 125.895 123.122 126.067 121.873 126.274C119.377 126.687 115.708 127.239 111.024 127.791C101.655 128.895 88.2276 130 72 130C55.7725 130 42.5589 128.895 33.4048 127.791C28.8279 127.239 25.2661 126.688 22.8501 126.274C21.6421 126.067 20.7206 125.895 20.1019 125.775C19.8978 125.735 19.7266 125.701 19.589 125.673Z"
      fill="#D2FF3A"
      stroke="black"
    />
    <circle cx="68.5" cy="120.5" r="18" fill="url(#paint0_linear_419_13466)" stroke="black" />
    <circle cx="68.5" cy="120.5" r="14" fill="url(#paint1_linear_419_13466)" stroke="black" />
    <path
      d="M88.7262 117.491C94.3211 116.248 97.7921 114.383 98.8281 113.605C98.8281 113.605 107 111.5 113.5 115C120 118.5 120 123 120 123C116.5 133.032 101.936 133.032 91.0574 133.032C80.1784 133.032 73.9619 140.026 72.4078 133.032C70.8536 126.039 81.7326 119.045 88.7262 117.491Z"
      fill="#D2FF3A"
    />
    <path
      d="M55.7039 118.918C48.8133 115.542 41.2884 105.813 39.2786 103C39.2786 103 33.7364 103 28.7485 109.517C23.7605 116.034 27.0858 123.093 27.0858 123.093C35.9533 130.153 54.8426 134.11 61.7333 134.954C68.6239 135.798 67.5508 124.723 55.7039 118.918Z"
      fill="#D2FF3A"
    />
    <path
      d="M98.8281 113.605C97.7921 114.383 94.3211 116.248 88.7262 117.491C81.7326 119.045 70.8536 126.039 72.4078 133.032C73.9619 140.026 80.1784 133.032 91.0574 133.032C101.936 133.032 117 133.032 120.5 122.5"
      stroke="black"
    />
    <path
      d="M39.2197 103C41.2339 105.813 48.7754 115.542 55.6812 118.918C67.5542 124.723 68.6297 135.798 61.7239 134.954C54.818 134.11 35.887 130.153 27 123.093"
      stroke="black"
    />
    <path
      d="M73.1338 131.128C72.4671 131.628 70.6338 133.628 70.1338 134.628"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M63.4429 130.742C64.2126 131.062 66.4838 132.546 67.2157 133.391"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M74.1338 132.128C73.4671 132.628 71.6338 134.628 71.1338 135.628"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M62.7215 131.959C63.4911 132.279 65.7624 133.763 66.4943 134.608"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M75.1338 133.128C74.4671 133.628 72.6338 135.628 72.1338 136.628"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M62 133.175C62.7697 133.494 65.0409 134.979 65.7728 135.824"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M51.3268 53.7697C49.0412 52.8252 47.5372 51.2241 47.0038 49.6287C46.731 48.8128 46.7118 48.0031 46.9565 47.2678C47.2005 46.5346 47.7182 45.8405 48.5791 45.272C50.2854 44.1451 52.0173 44.3322 53.29 45.5121C54.5542 46.684 55.4366 48.908 55.2622 52.0289L51.3268 53.7697Z"
      fill="#D2FF3A"
      stroke="black"
    />
    <path
      d="M110.301 67.3317C112.773 67.4164 114.804 66.5801 115.949 65.3478C116.535 64.7177 116.887 63.9883 116.968 63.2176C117.049 62.4491 116.864 61.6031 116.315 60.7295C115.227 58.9982 113.573 58.4527 111.926 59.0011C110.291 59.5457 108.568 61.206 107.437 64.12L110.301 67.3317Z"
      fill="#D2FF3A"
      stroke="black"
    />
    <mask id="path-17-inside-1_419_13466" fill="white">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M109.491 61.5127C110.55 64.7658 112.696 67.6092 115.404 69.6993C122.996 75.5581 126.742 85.6059 124.105 95.4471C120.603 108.517 107.168 116.273 94.0986 112.771C89.5848 111.562 85.7048 109.168 82.7034 106.013C80.277 103.463 77.1179 101.584 73.6554 100.949C72.779 100.788 71.9018 100.591 71.0256 100.356C70.5366 100.225 70.0533 100.084 69.5757 99.9327C66.4653 98.9475 63.0824 99.0393 59.9504 99.9532C55.7917 101.167 51.2584 101.292 46.7682 100.089C33.6983 96.5871 25.942 83.1528 29.4441 70.0829C31.9183 60.8489 39.3502 54.2673 48.1086 52.4343C51.1969 51.788 54.1271 50.3499 56.403 48.1646C64.1444 40.7315 75.6856 37.4387 87.0672 40.4884C98.0952 43.4434 106.276 51.63 109.491 61.5127Z"
      />
    </mask>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M109.491 61.5127C110.55 64.7658 112.696 67.6092 115.404 69.6993C122.996 75.5581 126.742 85.6059 124.105 95.4471C120.603 108.517 107.168 116.273 94.0986 112.771C89.5848 111.562 85.7048 109.168 82.7034 106.013C80.277 103.463 77.1179 101.584 73.6554 100.949C72.779 100.788 71.9018 100.591 71.0256 100.356C70.5366 100.225 70.0533 100.084 69.5757 99.9327C66.4653 98.9475 63.0824 99.0393 59.9504 99.9532C55.7917 101.167 51.2584 101.292 46.7682 100.089C33.6983 96.5871 25.942 83.1528 29.4441 70.0829C31.9183 60.8489 39.3502 54.2673 48.1086 52.4343C51.1969 51.788 54.1271 50.3499 56.403 48.1646C64.1444 40.7315 75.6856 37.4387 87.0672 40.4884C98.0952 43.4434 106.276 51.63 109.491 61.5127Z"
      fill="#D2FF3A"
    />
    <path
      d="M69.5757 99.9327L69.2737 100.886L69.5757 99.9327ZM59.9504 99.9532L59.6703 98.9932L59.9504 99.9532ZM48.1086 52.4343L47.9038 51.4555L48.1086 52.4343ZM56.403 48.1646L55.7104 47.4433L56.403 48.1646ZM82.7034 106.013L83.4279 105.324L82.7034 106.013ZM73.6554 100.949L73.8356 99.9653L73.6554 100.949ZM115.404 69.6993L114.793 70.491L115.404 69.6993ZM109.491 61.5127L110.442 61.2033L109.491 61.5127ZM125.071 95.706C127.816 85.4615 123.915 75.0043 116.015 68.9077L114.793 70.491C122.077 76.1119 125.668 85.7503 123.139 95.1883L125.071 95.706ZM93.8398 113.737C107.443 117.382 121.426 109.309 125.071 95.706L123.139 95.1883C119.78 107.725 106.894 115.164 94.3574 111.805L93.8398 113.737ZM81.9789 106.702C85.1035 109.987 89.1433 112.479 93.8398 113.737L94.3574 111.805C90.0263 110.645 86.3061 108.349 83.4279 105.324L81.9789 106.702ZM73.8356 99.9653C72.9857 99.8095 72.1347 99.6182 71.2844 99.3904L70.7668 101.322C71.669 101.564 72.5724 101.767 73.4751 101.933L73.8356 99.9653ZM71.2844 99.3904C70.8099 99.2633 70.341 99.1262 69.8776 98.9794L69.2737 100.886C69.7656 101.042 70.2633 101.187 70.7668 101.322L71.2844 99.3904ZM46.5094 101.055C51.1813 102.307 55.901 102.176 60.2305 100.913L59.6703 98.9932C55.6823 100.157 51.3355 100.278 47.027 99.1232L46.5094 101.055ZM28.4782 69.8241C24.8331 83.4274 32.906 97.41 46.5094 101.055L47.027 99.1232C34.4906 95.7641 27.0509 82.8782 30.41 70.3417L28.4782 69.8241ZM47.9038 51.4555C38.7906 53.3627 31.0538 60.2118 28.4782 69.8241L30.41 70.3417C32.7829 61.486 39.9098 55.1718 48.3135 53.4131L47.9038 51.4555ZM57.0956 48.886C64.5875 41.6924 75.7687 38.4963 86.8083 41.4543L87.326 39.5225C75.6024 36.3812 63.7014 39.7705 55.7104 47.4433L57.0956 48.886ZM86.8083 41.4543C97.5049 44.3205 105.428 52.2568 108.54 61.8221L110.442 61.2033C107.123 51.0032 98.6855 42.5663 87.326 39.5225L86.8083 41.4543ZM69.8776 98.9794C66.5524 97.9261 62.965 98.0319 59.6703 98.9932L60.2305 100.913C63.1999 100.047 66.3782 99.9688 69.2737 100.886L69.8776 98.9794ZM48.3135 53.4131C51.564 52.7328 54.6696 51.2154 57.0956 48.886L55.7104 47.4433C53.5846 49.4845 50.8299 50.8431 47.9038 51.4555L48.3135 53.4131ZM83.4279 105.324C80.8771 102.643 77.5346 100.643 73.8356 99.9653L73.4751 101.933C76.7011 102.524 79.6769 104.283 81.9789 106.702L83.4279 105.324ZM116.015 68.9077C113.447 66.9256 111.431 64.2431 110.442 61.2033L108.54 61.8221C109.668 65.2884 111.945 68.2929 114.793 70.491L116.015 68.9077Z"
      fill="black"
      mask="url(#path-17-inside-1_419_13466)"
    />
    <ellipse
      cx="63.9298"
      cy="65.3346"
      rx="3.08187"
      ry="3.9883"
      transform="rotate(15 63.9298 65.3346)"
      fill="black"
    />
    <ellipse
      cx="95.8055"
      cy="73.8756"
      rx="3.08187"
      ry="3.9883"
      transform="rotate(15 95.8055 73.8756)"
      fill="black"
    />
    <path
      d="M107.073 47.5014C107.073 48.6547 106.401 49.541 105.099 50.2036C103.783 50.8738 101.895 51.2685 99.6752 51.4172C95.2463 51.714 89.6842 51.0208 85.2308 49.8275C80.7915 48.638 76.2011 46.4399 72.9303 44.0503C71.2929 42.854 70.0129 41.629 69.2428 40.4819C68.4672 39.3268 68.2657 38.3438 68.5775 37.5561C69.1448 36.1227 70.0172 35.3864 71.1246 35.0674C72.2713 34.737 73.7252 34.8384 75.4588 35.2277C77.1851 35.6153 79.12 36.2711 81.2094 36.9903C81.3167 37.0273 81.4245 37.0644 81.5326 37.1016C83.5187 37.7858 85.6301 38.5132 87.7809 39.0895C89.9933 39.6823 92.3036 40.1257 94.5138 40.5499L94.6813 40.582C96.9512 41.0178 99.1041 41.4357 100.973 41.9796C102.848 42.5251 104.383 43.1829 105.444 44.069C106.482 44.9361 107.073 46.0247 107.073 47.5014Z"
      fill="#535566"
      stroke="black"
    />
    <path
      d="M97.2667 46.1907C97.2553 46.2025 97.2188 46.2368 97.1265 46.2857C96.9702 46.3686 96.7267 46.4538 96.3901 46.5296C95.7215 46.6802 94.7803 46.7735 93.6674 46.7895C91.4449 46.8215 88.6198 46.5441 86.0829 45.8643C83.5572 45.1876 80.9762 43.9102 79.066 42.6625C78.1104 42.0384 77.3395 41.4325 76.833 40.9266C76.5781 40.6721 76.4061 40.4586 76.3088 40.2941C76.2431 40.1833 76.2306 40.1277 76.2276 40.1139C76.2449 40.0378 76.2586 39.9276 76.2704 39.8272C76.2857 39.696 76.3037 39.5221 76.3238 39.3135C76.3641 38.8956 76.4138 38.3289 76.4695 37.6656C76.5808 36.3386 76.7161 34.6185 76.847 32.9157C76.978 31.2126 77.1046 29.5258 77.1985 28.2648C77.2443 27.6499 77.2823 27.1362 77.3092 26.7712L77.3307 26.777L77.3553 26.7836L77.3804 26.7903L77.406 26.7972L77.432 26.8041L77.4585 26.8112L77.4854 26.8184L77.5128 26.8258L77.5406 26.8332L77.5689 26.8408L77.5976 26.8485L77.6267 26.8563L77.6563 26.8642L77.6863 26.8723L77.7167 26.8804L77.7476 26.8887L77.7789 26.8971L77.8106 26.9056L77.8428 26.9142L77.8754 26.9229L77.9084 26.9318L77.9418 26.9407L77.9756 26.9498L78.0099 26.959L78.0445 26.9682L78.0796 26.9776L78.1151 26.9872L78.151 26.9968L78.1873 27.0065L78.224 27.0163L78.261 27.0263L78.2985 27.0363L78.3364 27.0465L78.3747 27.0567L78.4134 27.0671L78.4524 27.0775L78.4919 27.0881L78.5317 27.0988L78.5719 27.1096L78.6125 27.1204L78.6535 27.1314L78.6949 27.1425L78.7366 27.1537L78.7787 27.165L78.8212 27.1763L78.864 27.1878L78.9072 27.1994L78.9508 27.2111L78.9947 27.2229L79.039 27.2347L79.0837 27.2467L79.1287 27.2587L79.1741 27.2709L79.2198 27.2832L79.2659 27.2955L79.3123 27.3079L79.3591 27.3205L79.4062 27.3331L79.4536 27.3458L79.5014 27.3586L79.5496 27.3715L79.598 27.3845L79.6468 27.3976L79.696 27.4107L79.7454 27.424L79.7952 27.4373L79.8454 27.4508L79.8958 27.4643L79.9466 27.4779L79.9977 27.4916L80.0491 27.5054L80.1008 27.5192L80.1528 27.5332L80.2052 27.5472L80.2578 27.5613L80.3108 27.5755L80.364 27.5898L80.4176 27.6041L80.4715 27.6185L80.5257 27.6331L80.5801 27.6477L80.6349 27.6623L80.69 27.6771L80.7453 27.6919L80.8009 27.7068L80.8569 27.7218L80.9131 27.7369L80.9696 27.752L81.0263 27.7672L81.0834 27.7825L81.1407 27.7979L81.1983 27.8133L81.2562 27.8288L81.3143 27.8444L81.3728 27.86L81.4314 27.8758L81.4904 27.8916L81.5496 27.9074L81.6091 27.9234L81.6688 27.9394L81.7288 27.9554L81.789 27.9716L81.8495 27.9878L81.9102 28.0041L81.9712 28.0204L82.0324 28.0368L82.0939 28.0533L82.1556 28.0698L82.2176 28.0864L82.2798 28.1031L82.3422 28.1198L82.4049 28.1366L82.4678 28.1534L82.5309 28.1704L82.5942 28.1873L82.6578 28.2044L82.7216 28.2215L82.7856 28.2386L82.8499 28.2558L82.9143 28.2731L82.979 28.2904L83.0439 28.3078L83.109 28.3253L83.1743 28.3428L83.2398 28.3603L83.3055 28.3779L83.3714 28.3956L83.4376 28.4133L83.5039 28.4311L83.5704 28.4489L83.6371 28.4668L83.704 28.4847L83.7711 28.5027L83.8384 28.5207L83.9058 28.5388L83.9735 28.5569L84.0413 28.5751L84.1093 28.5933L84.1775 28.6116L84.2459 28.6299L84.3144 28.6483L84.3831 28.6667L84.452 28.6851L84.5211 28.7036L84.5903 28.7222L84.6597 28.7408L84.7292 28.7594L84.7989 28.7781L84.8688 28.7968L84.9388 28.8156L85.0089 28.8344L85.0793 28.8532L85.1497 28.8721L85.2203 28.891L85.2911 28.91L85.362 28.929L85.4331 28.948L85.5042 28.9671L85.5756 28.9862L85.647 29.0053L85.7186 29.0245L85.7903 29.0437L85.8622 29.063L85.9341 29.0823L86.0062 29.1016L86.0784 29.1209L86.1508 29.1403L86.2232 29.1597L86.2958 29.1792L86.3685 29.1986L86.4413 29.2182L86.5142 29.2377L86.5872 29.2573L86.6604 29.2769L86.7336 29.2965L86.8069 29.3161L86.8804 29.3358L86.9539 29.3555L87.0275 29.3752L87.1012 29.395L87.175 29.4148L87.2489 29.4346L87.3229 29.4544L87.397 29.4742L87.4712 29.4941L87.5454 29.514L87.6197 29.5339L87.6941 29.5538L87.7686 29.5738L87.8431 29.5938L87.9177 29.6138L87.9924 29.6338L88.0672 29.6538L88.142 29.6739L88.2169 29.6939L88.2918 29.714L88.3668 29.7341L88.4419 29.7542L88.517 29.7743L88.5921 29.7945L88.6673 29.8146L88.8179 29.855L88.8933 29.8752L88.9687 29.8954L89.0441 29.9156L89.1196 29.9358L89.1951 29.956L89.2706 29.9763L89.4218 30.0168L89.4974 30.037L89.5731 30.0573L89.6488 30.0776L89.7245 30.0979L89.8002 30.1182L89.8759 30.1385L90.0275 30.1791L90.1033 30.1994L90.179 30.2197L90.2548 30.24L90.3307 30.2603L90.4065 30.2806L90.4823 30.3009L90.5581 30.3212L90.6339 30.3416L90.7097 30.3619L90.7855 30.3822L90.8613 30.4025L90.937 30.4228L91.0128 30.4431L91.0885 30.4634L91.1643 30.4837L91.24 30.504L91.3157 30.5242L91.3913 30.5445L91.467 30.5648L91.5426 30.585L91.6182 30.6053L91.6937 30.6255L91.7692 30.6458L91.8447 30.666L91.9202 30.6862L91.9956 30.7064L92.0709 30.7266L92.1462 30.7468L92.2215 30.767L92.2967 30.7871L92.3719 30.8073L92.447 30.8274L92.5221 30.8475L92.5971 30.8676L92.6721 30.8877L92.7469 30.9077L92.8218 30.9278L92.8965 30.9478L92.9712 30.9678L93.0459 30.9878L93.1204 31.0078L93.1949 31.0278L93.2693 31.0477L93.3437 31.0676L93.4179 31.0875L93.4921 31.1074L93.5662 31.1273L93.6402 31.1471L93.7141 31.1669L93.7879 31.1867L93.8617 31.2064L93.9353 31.2262L94.0089 31.2459L94.0823 31.2656L94.1557 31.2852L94.2289 31.3048L94.3021 31.3244L94.3751 31.344L94.448 31.3636L94.5209 31.3831L94.5936 31.4025L94.6662 31.422L94.7387 31.4414L94.811 31.4608L94.8833 31.4802L94.9554 31.4995L95.0274 31.5188L95.0993 31.538L95.171 31.5573L95.2426 31.5765L95.3141 31.5956L95.3855 31.6147L95.4567 31.6338L95.5277 31.6529L95.5987 31.6719L95.6695 31.6908L95.7401 31.7098L95.8106 31.7286L95.8809 31.7475L95.9511 31.7663L96.0212 31.7851L96.0911 31.8038L96.1608 31.8225L96.2304 31.8411L96.2998 31.8597L96.3691 31.8783L96.4381 31.8968L96.5071 31.9153L96.5758 31.9337L96.6444 31.9521L96.7128 31.9704L96.781 31.9887L96.8491 32.0069L96.9169 32.0251L96.9846 32.0432L97.0521 32.0613L97.1194 32.0794L97.1866 32.0973L97.2535 32.1153L97.3203 32.1332L97.3868 32.151L97.4532 32.1688L97.5193 32.1865L97.5853 32.2042L97.6511 32.2218L97.7166 32.2394L97.782 32.2569L97.8471 32.2743L97.912 32.2917L97.9768 32.3091L98.0413 32.3264L98.1055 32.3436L98.1696 32.3607L98.2335 32.3779L98.2971 32.3949L98.3605 32.4119L98.4236 32.4288L98.4866 32.4457L98.5493 32.4625L98.6118 32.4792L98.674 32.4959L98.736 32.5125L98.7978 32.5291L98.8593 32.5456L98.9206 32.562L98.9816 32.5783L99.0424 32.5946L99.103 32.6108L99.1633 32.627L99.2233 32.6431L99.2831 32.6591L99.3426 32.675L99.4019 32.6909L99.4609 32.7067L99.5196 32.7225L99.5781 32.7381L99.6363 32.7537L99.6942 32.7693L99.7519 32.7847L99.8092 32.8001L99.8664 32.8154L99.9232 32.8306L99.9797 32.8458L100.036 32.8608L100.092 32.8758L100.148 32.8908L100.203 32.9056L100.258 32.9204L100.313 32.9351L100.368 32.9497L100.422 32.9642L100.476 32.9787L100.529 32.993L100.583 33.0073L100.636 33.0215L100.688 33.0357L100.741 33.0497L100.793 33.0637L100.845 33.0775L100.896 33.0913L100.947 33.105L100.998 33.1187L101.049 33.1322L101.099 33.1456L101.149 33.159L101.198 33.1723L101.248 33.1855L101.296 33.1986L101.345 33.2116L101.393 33.2245L101.441 33.2373L101.489 33.25L101.536 33.2627L101.583 33.2752L101.629 33.2877L101.675 33.3001L101.721 33.3123L101.766 33.3245L101.812 33.3366L101.856 33.3486L101.901 33.3605L101.945 33.3723L101.988 33.384L102.032 33.3956L102.075 33.4071L102.117 33.4185L102.159 33.4298L102.201 33.441L102.242 33.4521L102.284 33.4631L102.324 33.474L102.365 33.4848L102.404 33.4955L102.444 33.5061L102.483 33.5165L102.522 33.5269L102.56 33.5372L102.598 33.5474L102.636 33.5574L102.673 33.5674L102.71 33.5773L102.746 33.587L102.782 33.5966L102.818 33.6062L102.853 33.6156L102.888 33.6249L102.922 33.6341L102.956 33.6432L102.989 33.6522L103.022 33.661L103.055 33.6698L103.087 33.6784L103.119 33.687L103.15 33.6954L103.181 33.7037L103.212 33.7118L103.242 33.7199L103.272 33.7279L103.301 33.7357L103.328 33.7428C103.159 34.0827 102.92 34.5649 102.633 35.1437C102.053 36.3157 101.277 37.8839 100.498 39.4683C99.718 41.0525 98.9335 42.6538 98.3351 43.8917C98.036 44.5105 97.7826 45.0399 97.5994 45.4317C97.5079 45.6273 97.4329 45.7907 97.378 45.9147C97.3367 46.0082 97.291 46.1134 97.2667 46.1907Z"
      fill="black"
      stroke="black"
    />
    <ellipse
      cx="90.6902"
      cy="29.6844"
      rx="14.0446"
      ry="5.14969"
      transform="rotate(15 90.6902 29.6844)"
      fill="#535566"
    />
    <path
      d="M105.842 83.5762C105.833 103.134 104.175 123.266 110.005 120.507C113.649 118.783 114.61 112.84 114.88 109.35"
      stroke="black"
      strokeDasharray="2 2"
    />
    <path
      d="M54.683 80.262C56.9783 71.6959 69.049 63.0119 80.2635 66.0168C91.478 69.0217 97.5895 82.5777 95.2943 91.1437C92.999 99.7098 82.0471 102.325 70.8326 99.32C59.6181 96.3151 52.3877 88.828 54.683 80.262Z"
      fill="#EBFFA9"
    />
    <path
      d="M106.614 78.4428C105.027 84.3655 98.9396 87.8803 93.0169 86.2933C87.0942 84.7063 83.5793 78.6185 85.1663 72.6958C86.7533 66.7731 92.8411 63.2583 98.7639 64.8452C104.687 66.4322 108.201 72.5201 106.614 78.4428Z"
      fill="white"
      fillOpacity="0.2"
      stroke="black"
    />
    <path
      d="M103.169 71.5762C103.669 72.2428 104.469 74.2762 103.669 77.0762"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M102.669 79.5762L102.169 80.5762"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M70 101L68.4663 100.489C67.6027 100.201 67.0424 99.3661 67.1033 98.4578L67.5915 91.1664C70.1672 91.4679 72.6767 90.8946 73.8219 89.0619C73.8219 91.6977 74.9619 93.6283 76.9906 94.8169L74.2339 100.49C73.8095 101.363 72.8192 101.805 71.8856 101.539L70 101Z"
      fill="white"
    />
    <path
      d="M73.8219 89.0619L70 101M73.8219 89.0619L74.322 87.5615M73.8219 89.0619C72.6767 90.8946 70.1672 91.4679 67.5915 91.1664M73.8219 89.0619C73.8219 91.6977 74.9619 93.6283 76.9906 94.8169M70 101L68.4663 100.489C67.6027 100.201 67.0424 99.3661 67.1033 98.4578L67.5915 91.1664M70 101L71.8856 101.539C72.8192 101.805 73.8095 101.363 74.2339 100.49L76.9906 94.8169M60.3218 87.0618C61.4056 89.2294 64.5449 90.8098 67.5915 91.1664M86.3216 94.5604C86.3216 94.5604 84.3218 96.5599 80.8218 96.0613C79.3297 95.8488 78.041 95.4323 76.9906 94.8169"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M90.2675 79.7069C88.8035 85.1707 81.1045 90.7096 73.9515 88.793C66.7986 86.8764 62.9005 78.23 64.3645 72.7662C65.8285 67.3025 72.8139 65.6345 79.9668 67.5511C87.1198 69.4678 91.7315 74.2432 90.2675 79.7069Z"
      fill="#282B3F"
    />
    <path
      d="M80.2422 72.7119C81.0724 72.6405 83.2211 73.0377 85.1735 75.1982"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M86.7656 77.3697L87.3495 78.3231"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_419_13466"
        x1="68"
        y1="102"
        x2="81"
        y2="133"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFDFA0" />
        <stop offset="0.395833" stopColor="white" />
        <stop offset="1" stopColor="#88754F" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_419_13466"
        x1="68.1081"
        y1="106"
        x2="78.2973"
        y2="130.297"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9C8048" />
        <stop offset="0.541667" stopColor="white" />
        <stop offset="1" stopColor="#FFDFA0" />
      </linearGradient>
    </defs>
  </svg>
);

export default Staking;
