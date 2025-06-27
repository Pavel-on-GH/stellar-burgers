import {
  ingredientsReducer,
  fetchIngredients,
  initialState
} from '../ingredientsSlice';

describe('ingredientsSlice', () => {
  it('Тест ingredientsSlice: fetchIngredients.pending устанавливает isLoading в true', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Тест ingredientsSlice: fetchIngredients.fulfilled обновляет ingredients и сбрасывает isLoading', () => {
    const mockIngredients = [{ _id: '1', name: 'Ingredient 1' }]; // можно подставить минимальный объект

    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Тест ingredientsSlice: fetchIngredients.rejected устанавливает ошибку', () => {
    const errorMsg = 'Ошибка загрузки';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMsg }
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
});
