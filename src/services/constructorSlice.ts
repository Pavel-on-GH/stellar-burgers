import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TBurgerConstructorSlice = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 15)}`;

const initialState: TBurgerConstructorSlice = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const moveIngredient = <T>(arr: T[], i: number, j: number): void => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.constructorItems.bun = payload;
        } else {
          state.constructorItems.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: newId() }
      })
    },

    removeIngredient: (state, { payload }: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== payload
        );
    },

    removeAllIngredients: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },

    moveUpIngredient: (state, { payload }: PayloadAction<number>) => {
      if (payload > 0) {
        moveIngredient(
          state.constructorItems.ingredients,
          payload,
          payload - 1
        );
      }
    },

    moveDownIngredient: (state, { payload }: PayloadAction<number>) => {
      const ingredients = state.constructorItems.ingredients;
      if (ingredients.length - 1 > payload) {
        moveIngredient(ingredients, payload, payload + 1);
      }
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  removeAllIngredients,
  moveUpIngredient,
  moveDownIngredient
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
