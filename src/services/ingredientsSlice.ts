import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../utils/burger-api';

type IngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | undefined | null;
};

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async () => {
    const ingredientsData = await getIngredientsApi();
    return ingredientsData;
  }
);

const pendingFunc = (state: IngredientsState) => {
  state.isLoading = true;
  state.error = null;
};

const fullfiledFunc = (
  state: IngredientsState,
  action: PayloadAction<TIngredient[]>
) => {
  state.ingredients = action.payload;
  state.isLoading = false;
  state.error = null;
};

const rejectedFunc = (
  state: IngredientsState,
  action: { error: { message?: string | undefined | null } }
) => {
  state.isLoading = false;
  state.error =
    action.error.message !== null && action.error.message !== undefined
      ? action.error.message
      : 'Ошибка в запросе: ingredients';
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, pendingFunc)
      .addCase(fetchIngredients.fulfilled, fullfiledFunc)
      .addCase(fetchIngredients.rejected, rejectedFunc);
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
