import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "../redux/calenderSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
  },
});
