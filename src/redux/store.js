import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import usersReducer from "./slices/usersSlice";
import friendsReducer from "./slices/friendsSlice";
import expensesReducer from "./slices/expensesSlice";
import activitiesReducer from "./slices/activitiesSlice";
import groupsReducer from "./slices/groupsSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  users: usersReducer,
  friends: friendsReducer,
  expenses: expensesReducer,
  activities: activitiesReducer,
  groups: groupsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
