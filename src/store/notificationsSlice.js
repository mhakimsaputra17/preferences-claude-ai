import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // Store notification with a unique ID, creation timestamp and translation keys
      state.notifications.unshift({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        read: false,
        // Store both the translated text and translation keys
        title: action.payload.title,
        message: action.payload.message,
        titleKey: action.payload.titleKey,
        messageKey: action.payload.messageKey,
        type: action.payload.type,
      });
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, markNotificationRead, clearNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
