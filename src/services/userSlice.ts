import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi
} from '@api';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie';

type TUserState = {
  isAuth: boolean;
  authStatus: boolean;
  data: TUser | null;
  loginUserError: string | null | undefined;
  loginUserRequest: boolean;
  registerUserError: string | null | undefined;
  registerUserRequest: boolean;
  updateUserError: string | null | undefined;
  updateUserRequest: boolean;
};

const initialState: TUserState = {
  isAuth: false,
  authStatus: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false,
  registerUserError: null,
  registerUserRequest: false,
  updateUserError: null,
  updateUserRequest: false
};

const pendingRegister = (state: TUserState) => {
  state.registerUserRequest = true;
  state.registerUserError = null;
};

const fulfilledRegister = (state: TUserState, action: PayloadAction<TUser>) => {
  state.registerUserRequest = false;
  state.registerUserError = null;
  state.data = action.payload;
  state.authStatus = true;
  state.isAuth = true;
};

const rejectedRegister = (
  state: TUserState,
  action: { payload?: string | null | undefined }
) => {
  state.registerUserRequest = false;
  state.registerUserError = action.payload ?? 'Ошибка';
};

const pendingLogin = (state: TUserState) => {
  state.loginUserRequest = true;
  state.loginUserError = null;
};

const fulfilledLogin = (state: TUserState, action: PayloadAction<TUser>) => {
  state.loginUserRequest = false;
  state.loginUserError = null;
  state.data = action.payload;
  state.authStatus = true;
  state.isAuth = true;
};

const rejectedLogin = (
  state: TUserState,
  action: { payload?: string | null | undefined }
) => {
  state.loginUserRequest = false;
  state.loginUserError = action.payload ?? 'Ошибка';
  state.isAuth = true;
};

const pendingUpdate = (state: TUserState) => {
  state.updateUserRequest = true;
  state.updateUserError = null;
};

const fulfilledUpdate = (state: TUserState, action: PayloadAction<TUser>) => {
  state.updateUserRequest = false;
  state.updateUserError = null;
  state.data = action.payload;
};

const rejectedUpdate = (
  state: TUserState,
  action: { payload?: string | null }
) => {
  state.updateUserRequest = false;
  state.updateUserError = action.payload ?? 'Ошибка';
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (userData, { rejectWithValue }) => {
  const response = await registerUserApi(userData);

  if (!response?.success) {
    return rejectWithValue('Ошибка');
  }

  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);

  return response.user;
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/loginUser', async ({ email, password }, { rejectWithValue }) => {
  const data = await loginUserApi({ email, password });

  if (!data?.success) {
    return rejectWithValue('Ошибка');
  }

  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return data.user;
});

export const checkUserAuth = createAsyncThunk<void, void>(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const response = await getUserApi();
        if (response.success) {
          dispatch(setUser(response.user));
        }
      } catch (error) {
        console.error(`Ошибка: ${error}`, error);
      }
    }
    dispatch(authChecked());
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (userData, { rejectWithValue }) => {
  const response = await updateUserApi(userData);

  return response?.success ? response.user : rejectWithValue('Ошибка');
});

export const logOutUser = createAsyncThunk(
  'user/logOutUser',
  async (_, { dispatch }) => {
    try {
      await logoutApi();
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userLogout());
    } catch (error) {
      console.error(`Ошибка выхода: ${error}`, error);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuth = true;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.data = action.payload;
      state.authStatus = true;
    },
    userLogout: (state) => {
      state.data = null;
      state.authStatus = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, pendingRegister)
      .addCase(registerUser.fulfilled, fulfilledRegister)
      .addCase(registerUser.rejected, rejectedRegister)

      .addCase(loginUser.pending, pendingLogin)
      .addCase(loginUser.fulfilled, fulfilledLogin)
      .addCase(loginUser.rejected, rejectedLogin)

      .addCase(updateUser.pending, pendingUpdate)
      .addCase(updateUser.fulfilled, fulfilledUpdate)
      .addCase(updateUser.rejected, rejectedUpdate);
  }
});

export const { authChecked, setUser, userLogout } = userSlice.actions;
export const userReducer = userSlice.reducer;
