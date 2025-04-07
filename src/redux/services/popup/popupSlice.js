import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lastPopupClosed: null,
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    closePopup: (state) => {
      state.lastPopupClosed = Date.now();
    },
    resetPopup: (state) => {
      state.lastPopupClosed = null;
    },
  },
});

export const { closePopup, resetPopup } = popupSlice.actions;

export default popupSlice.reducer;

export const selectLastPopupClosed = (state) => state.popup.lastPopupClosed;
