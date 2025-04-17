import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./preferencesSlice";
import notificationsReducer from "./notificationsSlice";
import toastReducer from "./toastSlice";

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    notifications: notificationsReducer,
    toast: toastReducer,
  },
});
