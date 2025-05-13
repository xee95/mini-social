import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage" // defaults to localStorage for web

// Configure persistence for auth reducer
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], // only persist user
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
