import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { reducer as ingredientsReducer } from '../slices/ingredientsSlice/ingredientsSlice';
import { reducer as orderReducer } from '../slices/orderSlice/orderSlice';
import { reducer as constructorReducer } from '../slices/constructorSlice/constructorSlice';
import { reducer as feedReducer } from '../slices/feedSlice/feedSlice';
import { reducer as authReducer } from '../slices/authSlice/authSlice';
import { middleware as ordersMiddleware } from '../middlewares/ordersMiddleware';

const rootReducer = combineReducers({
  ingredientsReducer,
  orderReducer,
  constructorReducer,
  feedReducer,
  authReducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
