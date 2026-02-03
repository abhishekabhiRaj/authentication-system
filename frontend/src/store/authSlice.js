import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, accessToken, refreshToken, expiresIn } = action.payload;
      state.user = user;
      state.accessToken = accessToken ?? state.accessToken;
      state.refreshToken = refreshToken ?? state.refreshToken;
      state.expiresIn = expiresIn ?? state.expiresIn;
    },
    setTokens: (state, action) => {
      const { accessToken, refreshToken, expiresIn } = action.payload;
      if (accessToken != null) state.accessToken = accessToken;
      if (refreshToken != null) state.refreshToken = refreshToken;
      if (expiresIn != null) state.expiresIn = expiresIn;
    },
    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresIn = null;
    },
  },
});

export const { setUser, setTokens, clearUser } = authSlice.actions;
export default authSlice.reducer;
