import {
  registerUser,
  loginUser,
  updateUser,
  logOutUser,
  userReducer,
  initialState,
  authChecked,
  setUser,
  userLogout
} from '../userSlice';
import * as api from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

jest.mock('@api');
jest.mock('../../utils/cookie');

const mockUser = { email: 'test@example.com', name: 'Test User' };

describe('userSlice', () => {
  beforeEach(() => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    jest.clearAllMocks();
  });

  it('Тест userSlice: registerUser thunk выполнен успешно', async () => {
    (api.registerUserApi as jest.Mock).mockResolvedValue({
      success: true,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: mockUser
    });
    (setCookie as jest.Mock).mockImplementation(() => {});

    const dispatch = jest.fn();
    const thunk = registerUser({
      email: 'test@example.com',
      password: '123456',
      name: 'Test User'
    });
    const action = await thunk(dispatch, () => initialState, undefined);

    expect(api.registerUserApi).toHaveBeenCalledTimes(1);
    expect(setCookie).toHaveBeenCalledWith('accessToken', 'access-token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'refresh-token'
    );

    expect(action.type).toBe(registerUser.fulfilled.type);
    expect(action.payload).toEqual(mockUser);

    const state = userReducer(initialState, action);
    expect(state.data).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.authStatus).toBe(true);
  });

  it('Тест userSlice: registerUser thunk отклонён', async () => {
    (api.registerUserApi as jest.Mock).mockResolvedValue({ success: false });

    const dispatch = jest.fn();
    const thunk = registerUser({
      email: 'test@example.com',
      password: '123456',
      name: 'Test User'
    });
    const action = await thunk(dispatch, () => initialState, undefined);

    expect(action.type).toBe(registerUser.rejected.type);
    expect(action.payload).toBe('Ошибка');
  });

  it('Тест userSlice: loginUser thunk выполнен успешно', async () => {
    (api.loginUserApi as jest.Mock).mockResolvedValue({
      success: true,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: mockUser
    });
    (setCookie as jest.Mock).mockImplementation(() => {});

    const dispatch = jest.fn();
    const thunk = loginUser({
      email: 'test@example.com',
      password: '123456'
    });
    const action = await thunk(dispatch, () => initialState, undefined);

    expect(api.loginUserApi).toHaveBeenCalledTimes(1);
    expect(setCookie).toHaveBeenCalledWith('accessToken', 'access-token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'refresh-token'
    );

    expect(action.type).toBe(loginUser.fulfilled.type);
    expect(action.payload).toEqual(mockUser);

    const state = userReducer(initialState, action);
    expect(state.data).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.authStatus).toBe(true);
  });

  it('Тест userSlice: loginUser thunk отклонён', async () => {
    (api.loginUserApi as jest.Mock).mockResolvedValue({ success: false });

    const dispatch = jest.fn();
    const thunk = loginUser({
      email: 'test@example.com',
      password: '123456'
    });
    const action = await thunk(dispatch, () => initialState, undefined);

    expect(action.type).toBe(loginUser.rejected.type);
    expect(action.payload).toBe('Ошибка');
  });

  it('Тест userSlice: updateUser thunk выполнен успешно', async () => {
    (api.updateUserApi as jest.Mock).mockResolvedValue({
      success: true,
      user: mockUser
    });

    const dispatch = jest.fn();
    const thunk = updateUser({ name: 'Test User' });
    const action = await thunk(dispatch, () => initialState, undefined);

    expect(api.updateUserApi).toHaveBeenCalledTimes(1);

    expect(action.type).toBe(updateUser.fulfilled.type);
    expect(action.payload).toEqual(mockUser);

    const state = userReducer(initialState, action);
    expect(state.data).toEqual(mockUser);
  });

  it('Тест userSlice: updateUser thunk отклонён', async () => {
    (api.updateUserApi as jest.Mock).mockResolvedValue({ success: false });

    const dispatch = jest.fn();
    const thunk = updateUser({ name: 'Test User' });
    const action = await thunk(dispatch, () => initialState, undefined);

    expect(action.type).toBe(updateUser.rejected.type);
    expect(action.payload).toBe('Ошибка');
  });

  it('Тест userSlice: logOutUser thunk очищает хранилище, куки и диспатчит userLogout', async () => {
    (api.logoutApi as jest.Mock).mockResolvedValue(undefined);
    (deleteCookie as jest.Mock).mockImplementation(() => {});

    const dispatch = jest.fn();
    const thunk = logOutUser();
    await thunk(dispatch, () => initialState, undefined);

    expect(window.localStorage.clear).toHaveBeenCalled();
    expect(deleteCookie).toHaveBeenCalledWith('accessToken');
    expect(dispatch).toHaveBeenCalledWith(userLogout());
  });

  it('Тест userSlice: registerUser.pending устанавливает запрос true и очищает ошибку', () => {
    const state = userReducer(initialState, {
      type: registerUser.pending.type
    });
    expect(state.registerUserRequest).toBe(true);
    expect(state.registerUserError).toBeNull();
  });

  it('Тест userSlice: registerUser.rejected устанавливает ошибку и запрос false', () => {
    const errMsg = 'Ошибка при регистрации';
    const state = userReducer(initialState, {
      type: registerUser.rejected.type,
      payload: errMsg
    });
    expect(state.registerUserRequest).toBe(false);
    expect(state.registerUserError).toBe(errMsg);
  });

  it('Тест userSlice: loginUser.pending устанавливает запрос true и очищает ошибку', () => {
    const state = userReducer(initialState, { type: loginUser.pending.type });
    expect(state.loginUserRequest).toBe(true);
    expect(state.loginUserError).toBeNull();
  });

  it('Тест userSlice: loginUser.rejected устанавливает ошибку и запрос false', () => {
    const errMsg = 'Ошибка при входе';
    const state = userReducer(initialState, {
      type: loginUser.rejected.type,
      payload: errMsg
    });
    expect(state.loginUserRequest).toBe(false);
    expect(state.loginUserError).toBe(errMsg);
  });

  it('Тест userSlice: updateUser.pending устанавливает запрос true и очищает ошибку', () => {
    const state = userReducer(initialState, {
      type: updateUser.pending.type
    });
    expect(state.updateUserRequest).toBe(true);
    expect(state.updateUserError).toBeNull();
  });

  it('Тест userSlice: updateUser.rejected устанавливает ошибку и запрос false', () => {
    const errMsg = 'Ошибка при обновлении';
    const state = userReducer(initialState, {
      type: updateUser.rejected.type,
      payload: errMsg
    });
    expect(state.updateUserRequest).toBe(false);
    expect(state.updateUserError).toBe(errMsg);
  });

  it('Тест userSlice: authChecked устанавливает isAuth в true', () => {
    const state = userReducer(initialState, authChecked());
    expect(state.isAuth).toBe(true);
  });

  it('Тест userSlice: setUser устанавливает данные и authStatus', () => {
    const state = userReducer(initialState, setUser(mockUser));
    expect(state.data).toEqual(mockUser);
    expect(state.authStatus).toBe(true);
  });

  it('Тест userSlice: userLogout очищает данные и authStatus', () => {
    const prevState = { ...initialState, data: mockUser, authStatus: true };
    const state = userReducer(prevState, userLogout());
    expect(state.data).toBeNull();
    expect(state.authStatus).toBe(false);
  });
});
