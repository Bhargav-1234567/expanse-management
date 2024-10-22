import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friends: [],
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addFriend: (state, action) => {
      const { userId, friendId } = action.payload;

      state.friends.push({
        userId,
        friendId,
        isOwe: false,
        amount: 0,
      });

      state.friends.push({
        userId: friendId,
        friendId: userId,
        isOwe: false,
        amount: 0,
      });
    },

    removeFriend: (state, action) => {
      const { userId, friendId } = action.payload;

      state.friends = state.friends.filter(
        (friend) =>
          !(friend.userId === userId && friend.friendId === friendId) &&
          !(friend.userId === friendId && friend.friendId === userId)
      );
    },
  },
});

export const { addFriend, removeFriend } = friendsSlice.actions;
export default friendsSlice.reducer;
