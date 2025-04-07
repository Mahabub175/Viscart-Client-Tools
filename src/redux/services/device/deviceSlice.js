import { createSlice } from "@reduxjs/toolkit";

const generateRandomCode = (length = 16) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const initialState = {
  deviceId: generateRandomCode(),
  lastPopupClosed: null,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    resetDeviceId: (state) => {
      state.deviceId = generateRandomCode();
    },
    closePopup: (state) => {
      state.lastPopupClosed = Date.now();
    },
    resetPopup: (state) => {
      state.lastPopupClosed = null;
    },
  },
});

export const { resetDeviceId, closePopup, resetPopup } = deviceSlice.actions;

export default deviceSlice.reducer;

export const useDeviceId = (state) => state?.device?.deviceId;
export const selectLastPopupClosed = (state) => state?.device?.lastPopupClosed;
