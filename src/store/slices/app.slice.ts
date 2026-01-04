import { PLAN_TYPE, ROLES, SUBSCRIPTION_STATUS } from '@/lib/enums';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInfo {
  name: string;
  role: ROLES;
  id: string;
  plan: PLAN_TYPE;
  subscription_status: SUBSCRIPTION_STATUS;
  trial_ends_at?: string;
  subscription_ends_at?: string;
}

interface AppState {
  user: UserInfo | null;
  activeShopId: string | null;
  isAuthenticated: boolean;
  isRestoringSession: boolean;
}
const getPersistedShopId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('activeShopId');
  }
  return null;
};

const initialState: AppState = {
  user: null,
  activeShopId: getPersistedShopId(),
  isAuthenticated: false,
  isRestoringSession: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setActiveShopId: (state, action: PayloadAction<string>) => {
      state.activeShopId = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeShopId', action.payload);
      }
    },
    finishRestoringSession: (state) => {
      state.isRestoringSession = false;
    },
    logout: (state) => {
      state.user = null;
      state.activeShopId = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('activeShopId');
      }
    },
  },
});

export const { setUser, setActiveShopId, logout, finishRestoringSession } = appSlice.actions;
export default appSlice.reducer;
