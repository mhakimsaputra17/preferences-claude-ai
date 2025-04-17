import { createSlice } from "@reduxjs/toolkit";

let nextToastId = 0;

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: (state, action) => {
      const { type = "info", message, title, duration = 5000 } = action.payload;
      const id = nextToastId++;

      state.toasts.push({
        id,
        type,
        message,
        title,
        duration,
        visible: true,
      });
    },
    removeToast: (state, action) => {
      const index = state.toasts.findIndex(
        (toast) => toast.id === action.payload
      );
      if (index !== -1) {
        // Set visible to false first to trigger animation
        state.toasts[index].visible = false;
      }
    },
    deleteToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
  },
});

export const { addToast, removeToast, deleteToast } = toastSlice.actions;

// Thunk to handle toast lifecycle
export const showToast = (options) => (dispatch) => {
  const { duration = 5000 } = options;

  dispatch(addToast(options));
  const id = nextToastId - 1; // Get the ID that was just used

  // Remove toast after duration
  setTimeout(() => {
    dispatch(removeToast(id));

    // Actually remove from state after animation (300ms)
    setTimeout(() => {
      dispatch(deleteToast(id));
    }, 300);
  }, duration);
};

export default toastSlice.reducer;
