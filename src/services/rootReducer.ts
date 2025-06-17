import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './ingredientsSlice';
import { constructorReducer } from './constructorSlice';

export const rootReducer = combineReducers({
  ingredientsReducer,
  constructorReducer
});
