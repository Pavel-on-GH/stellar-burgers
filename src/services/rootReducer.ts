import { combineReducers } from '@reduxjs/toolkit';
import ingredients from './ingredientsSlice';

export const rootReducer = combineReducers({
  ingredients
});
