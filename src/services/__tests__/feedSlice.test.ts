import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../rootReducer';
import * as api from '@api';
import { feedReducer, fetchFeeds } from '../feedSlice';

describe('feedSlice', () => {
  const mockApiResponse = {
    success: true,
    orders: [
      {
        _id: '1',
        status: 'done',
        name: 'Burger',
        createdAt: '2025-06-26',
        updatedAt: '2025-06-26',
        number: 101,
        ingredients: ['ingredient1', 'ingredient2']
      }
    ],
    total: 1,
    totalToday: 1
  } as unknown as api.TFeedsResponse;

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('Тест feedSlice: устанавливен isLoading в true при pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(undefined, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Тест feedSlice: корректно обрабатана ошибка при rejected с payload', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      payload:
        'Ошибка загрузки данных с сервера. Попробуйте обновить страницу.',
      error: { message: 'Ошибка сети' }
    };
    const state = feedReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(
      'Ошибка загрузки данных с сервера. Попробуйте обновить страницу.'
    );
  });

  it('Тест feedSlice: корректно обрабатана ошибка при rejected с error.message и без payload', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      payload: null,
      error: { message: 'NetworkError' }
    };
    const state = feedReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети: NetworkError');
  });

  it('Тест feedSlice: корректно обрабатана ошибка при rejected без payload и error.message', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      payload: null,
      error: { message: null }
    };
    const state = feedReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(
      'Произошла неизвестная ошибка при загрузке заказов.'
    );
  });

  it('Тест feedSlice: успешно загружены заказы', async () => {
    jest.spyOn(api, 'getFeedsApi').mockResolvedValue(mockApiResponse);

    const store = configureStore({ reducer: rootReducer });
    await store.dispatch(fetchFeeds());

    const state = store.getState().feedReducer;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(mockApiResponse.orders);
    expect(state.totalOrders).toBe(mockApiResponse.total);
    expect(state.ordersToday).toBe(mockApiResponse.totalToday);
  });

  it('Тест feedSlice: пустой список заказов', async () => {
    const emptyResponse = {
      success: true,
      orders: [],
      total: 0,
      totalToday: 0
    } as unknown as api.TFeedsResponse;

    jest.spyOn(api, 'getFeedsApi').mockResolvedValue(emptyResponse);

    const store = configureStore({ reducer: rootReducer });
    await store.dispatch(fetchFeeds());

    const state = store.getState().feedReducer;
    expect(state.orders).toEqual([]);
    expect(state.totalOrders).toBe(0);
    expect(state.ordersToday).toBe(0);
    expect(state.error).toBeNull();
  });
});
