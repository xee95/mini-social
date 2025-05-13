import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase/config"
import type { User } from "firebase/auth"

// Create a serializable user type
interface SerializableUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

// Helper function to convert Firebase User to serializable user
const serializeUser = (user: User | null): SerializableUser | null => {
  if (!user) return null

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }
}

interface AuthState {
  user: SerializableUser | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: true, // Start with loading true
  error: null,
}

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name,
      })

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName: name,
        createdAt: new Date().toISOString(),
      })

      // Return serialized user
      return serializeUser(userCredential.user)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to sign up")
    }
  },
)

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // Return serialized user
      return serializeUser(userCredential.user)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to login")
    }
  },
)

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await signOut(auth)
    return null
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to logout")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerializableUser | null>) => {
      state.user = action.payload
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.loading = false
      state.error = null
    })
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.loading = false
      state.error = null
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.loading = false
      state.error = null
    })
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { setUser, setLoading, setError } = authSlice.actions
export default authSlice.reducer
