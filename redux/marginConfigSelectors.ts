import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "./store";

export const getMarginConfig = createSelector(
  (state: RootState) => state.marginConfig,
  (marginConfig) => marginConfig,
);
