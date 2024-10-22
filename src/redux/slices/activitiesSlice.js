import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activities: [], // { id, userId, activityType, timestamp, details }
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    addActivity: (state, action) => {
      state.activities.push(action.payload);
    },
    resetActivity: (state, action) => {
      state.activities = [];
    },
  },
});

export const { addActivity, resetActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;
