import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './ingredientsSlice';
import { constructorReducer } from './constructorSlice';
import { userReducer } from './userSlice';
import { orderReducer } from './ordersSlice';
import { feedReducer } from './feedSlice';

export const rootReducer = combineReducers({
  ingredientsReducer,
  constructorReducer,
  userReducer,
  orderReducer,
  feedReducer
});
