import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: [], // { groupId, groupName, members: [{ userId }], expenses: [{ expenseId }] }
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
  },
});

export const { addGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
