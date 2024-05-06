import { createSlice } from "@reduxjs/toolkit";

const marginCategory = createSlice({
  name: "marginCategories",
  initialState: {
    ReduxcategoryAssets1: null,
    ReduxcategoryAssets2: null,
  },
  reducers: {
    setCategoryAssets1(state, action) {
      state.ReduxcategoryAssets1 = action.payload;
    },
    setCategoryAssets2(state, action) {
      state.ReduxcategoryAssets2 = action.payload;
    },
  },
});

const { setCategoryAssets1, setCategoryAssets2 } = marginCategory.actions;
const marginCategoryReducer = marginCategory.reducer;
export { setCategoryAssets1, setCategoryAssets2 };
export default marginCategoryReducer;
