import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  users: [], // Array of user objects: { userID, username, email, password, friends }
  currentUser: null, // Currently logged-in user
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    register: (state, action) => {
      const { username, email, password } = action.payload;
      const newUser = {
        userId: uuidv4(),
        username,
        email,
        password,
        friends: [],
      };
      state.users.push(newUser);
    },
    login: (state, action) => {
      const { email, password } = action.payload;
      const user = state.users.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        state.currentUser = user;
      } else {
        alert("Invalid credentials");
      }
    },
    logout: (state) => {
      state.currentUser = null;
    },
    addFriend: (state, action) => {
      const { currentUserId, friendId } = action.payload;
      const currentUser = state.users.find(
        (user) => user.userId === currentUserId
      );
      const friendUser = state.users.find((user) => user.userId === friendId);

      if (currentUser && friendUser) {
        const currentUserFriend = {
          userId: friendUser.userId,
          name: friendUser.username,
          email: friendUser.email,
          isOwe: false,
          amount: 0,
        };

        const friendUserFriend = {
          userId: currentUser.userId,
          name: currentUser.username,
          email: currentUser.email,
          isOwe: false,
          amount: 0,
        };

        if (!currentUser.friends.some((friend) => friend.userId === friendId)) {
          currentUser.friends.push(currentUserFriend);
        }

        if (
          !friendUser.friends.some((friend) => friend.userId === currentUserId)
        ) {
          friendUser.friends.push(friendUserFriend);
        }
        state.currentUser = { ...currentUser, friends: currentUser.friends };
      }
    },
    removeFriend: (state, action) => {
      const { currentUserId, friendId } = action.payload;

      const currentUser = state.users.find(
        (user) => user.userId === currentUserId
      );
      const friendUser = state.users.find((user) => user.userId === friendId);

      if (currentUser && friendUser) {
        currentUser.friends = currentUser.friends.filter(
          (friend) => friend.userId !== friendId
        );

        friendUser.friends = friendUser.friends.filter(
          (friend) => friend.userId !== currentUserId
        );
      }
      state.currentUser = { ...currentUser, friends: currentUser.friends };
    },
    updateCurrentUserFriends: (state, action) => {
      if (state.currentUser) {
        state.currentUser.friends = action.payload;
      }
    },
    updateUserFriends: (state, action) => {
      const { userId, friends } = action.payload;
      const user = state.users.find((user) => user.userID === userId);
      if (user) {
        user.friends = friends;
      }
    },
  },
});

export const {
  register,
  login,
  logout,
  addFriend,
  removeFriend,
  updateCurrentUserFriends,
  updateUserFriends,
} = usersSlice.actions;
export default usersSlice.reducer;
