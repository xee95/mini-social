"use client";

import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { type ReactNode, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { setUser, setLoading } from "./slices/authSlice";

// Helper function to convert Firebase User to serializable user
const serializeUser = (user: any) => {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

export function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Serialize the user object before dispatching
      const serializedUser = serializeUser(user);
      store.dispatch(setUser(serializedUser));
      store.dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
