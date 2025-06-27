import { configureStore } from '@reduxjs/toolkit';
import {
  createOrder,
  orderReducer,
  initialState,
  clearOrder,
  clearOrderModal,
  fetchOrdersHistory,
  fetchOrderNumber,
  dataSelector
} from '../ordersSlice';
import * as api from '@api';
import { TOrder } from '@utils-types';
import { rootReducer } from '../rootReducer';
import { TNewOrderResponse } from '@api';
import { RootState } from '../store';

describe('ordersSlice', () => {
  const mockOrder: TOrder = {
    _id: 'order-1',
    status: 'done',
    name: 'Burger',
    createdAt: '2025-06-26',
    updatedAt: '2025-06-26',
    number: 101,
    ingredients: ['ingredient1', 'ingredient2']
  };

  const mockNewOrderResponse: TNewOrderResponse = {
    success: true,
    order: mockOrder,
    name: 'orderCreated'
  };

  const getBaseRootState = (): RootState => ({
    orderReducer: initialState,
    feedReducer: {
      orders: [],
      totalOrders: 0,
      ordersToday: 0,
      isLoading: false,
      error: null
    },
    ingredientsReducer: {
      ingredients: [],
      isLoading: false,
      error: null
    },
    constructorReducer: {
      constructorItems: {
        bun: null,
        ingredients: []
      }
    },
    userReducer: {
      isAuth: false,
      authStatus: false,
      data: null,
      loginUserError: null,
      loginUserRequest: false,
      registerUserError: null,
      registerUserRequest: false,
      updateUserError: null,
      updateUserRequest: false
    }
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('Тест orderSlice: успешно создан заказ и обновлено состояние', async () => {
    jest.spyOn(api, 'orderBurgerApi').mockResolvedValue(mockNewOrderResponse);

    const store = configureStore({ reducer: rootReducer });

    await store.dispatch(createOrder(mockOrder.ingredients));
    const state = store.getState().orderReducer;

    expect(state.orderRequest).toBe(false);
    expect(state.orderError).toBeNull();
    expect(state.orderModalData).toEqual(mockOrder);
  });

  it('Тест orderSlice: корректно обрабатана ошибка создания заказа', async () => {
    jest
      .spyOn(api, 'orderBurgerApi')
      .mockRejectedValue(new Error('Network Error'));

    const store = configureStore({ reducer: rootReducer });

    await store.dispatch(createOrder(mockOrder.ingredients));
    const state = store.getState().orderReducer;

    expect(state.orderRequest).toBe(false);
    expect(state.orderError).toBe('Ошибка создания заказа: Network Error');
  });

  it('Тест orderSlice: createOrder.rejected без message устанавливает дефолтное сообщение', async () => {
    jest.spyOn(api, 'orderBurgerApi').mockRejectedValue({});
    const store = configureStore({ reducer: rootReducer });

    await store.dispatch(createOrder(mockOrder.ingredients));
    const state = store.getState().orderReducer;

    expect(state.orderError).toBe('Ошибка создания заказа. Попробуйте позже.');
  });

  it('Тест orderSlice: fetchOrderNumber.pending устанавливает orderRequest=true и error=null', () => {
    const state = orderReducer(initialState, {
      type: fetchOrderNumber.pending.type
    });
    expect(state.orderRequest).toBe(true);
    expect(state.orderError).toBeNull();
  });

  it('Тест orderSlice: fetchOrderNumber.fulfilled обновляет currentOrder и orderRequest', () => {
    const state = orderReducer(initialState, {
      type: fetchOrderNumber.fulfilled.type,
      payload: mockOrder
    });
    expect(state.orderRequest).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
  });

  it('Тест orderSlice: fetchOrderNumber.rejected без message устанавливает дефолтное сообщение', async () => {
    jest.spyOn(api, 'getOrderByNumberApi').mockRejectedValue({});
    const store = configureStore({ reducer: rootReducer });

    await store.dispatch(fetchOrderNumber(mockOrder.number));
    const state = store.getState().orderReducer;

    expect(state.orderError).toBe(
      `Ошибка загрузки заказа №${mockOrder.number}. Попробуйте позже.`
    );
  });

  it('Тест orderSlice: fetchOrdersHistory.pending устанавливает ordersHistoryRequest=true и error=null', () => {
    const state = orderReducer(initialState, {
      type: fetchOrdersHistory.pending.type
    });
    expect(state.ordersHistoryRequest).toBe(true);
    expect(state.orderError).toBeNull();
  });

  it('Тест orderSlice: createOrder.pending сбрасывает orderError', () => {
    const stateWithError = {
      ...initialState,
      orderError: 'Previous error'
    };
    const state = orderReducer(stateWithError, {
      type: createOrder.pending.type
    });
    expect(state.orderRequest).toBe(true);
    expect(state.orderError).toBeNull();
  });

  it('Тест orderSlice: fetchOrdersHistory.fulfilled обновляет ordersHistory и ordersHistoryRequest', () => {
    const state = orderReducer(initialState, {
      type: fetchOrdersHistory.fulfilled.type,
      payload: [mockOrder]
    });
    expect(state.ordersHistoryRequest).toBe(false);
    expect(state.ordersHistory).toEqual([mockOrder]);
  });

  it('Тест orderSlice: fetchOrdersHistory.rejected с payload', () => {
    const action = {
      type: fetchOrdersHistory.rejected.type,
      payload: 'Ошибка истории заказов'
    };
    const state = orderReducer(initialState, action);
    expect(state.ordersHistoryRequest).toBe(false);
    expect(state.orderError).toBe('Ошибка истории заказов');
  });

  it('Тест orderSlice: fetchOrdersHistory.rejected без message устанавливает дефолтное сообщение', async () => {
    jest.spyOn(api, 'getOrdersApi').mockRejectedValue({});
    const store = configureStore({ reducer: rootReducer });

    await store.dispatch(fetchOrdersHistory());
    const state = store.getState().orderReducer;

    expect(state.orderError).toBe(
      'Ошибка загрузки истории заказов. Попробуйте позже.'
    );
  });

  it('Тест orderSlice: clearOrder очищает currentOrder', () => {
    const state = {
      ...initialState,
      currentOrder: mockOrder
    };
    const newState = orderReducer(state, clearOrder());
    expect(newState.currentOrder).toBeNull();
  });

  it('Тест orderSlice: clearOrderModal очищает orderModalData', () => {
    const state = {
      ...initialState,
      orderModalData: mockOrder
    };
    const newState = orderReducer(state, clearOrderModal());
    expect(newState.orderModalData).toBeNull();
  });

  it('createOrder.rejected с payload устанавливает orderError', () => {
    const action = {
      type: createOrder.rejected.type,
      payload: 'Ошибка из payload'
    };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(false);
    expect(state.orderError).toBe('Ошибка из payload');
  });

  it('Тест orderSlice: createOrder.rejected без payload устанавливает дефолтное сообщение об ошибке', () => {
    const action = {
      type: createOrder.rejected.type,
      payload: undefined
    };
    const state = orderReducer(initialState, action);
    expect(state.orderError).toBe(
      'Произошла неизвестная ошибка при обработке запроса. Пожалуйста, попробуйте снова.'
    );
  });

  it('Тест orderSlice: dataSelector возвращает currentOrder, если он есть', () => {
    const state = {
      ...getBaseRootState(),
      orderReducer: {
        ...initialState,
        currentOrder: mockOrder
      }
    };
    const result = dataSelector(mockOrder.number.toString())(state);
    expect(result).toEqual(mockOrder);
  });

  it('Тест orderSlice: dataSelector возвращает order из ordersHistory, если найден', () => {
    const state = {
      ...getBaseRootState(),
      orderReducer: {
        ...initialState,
        currentOrder: null,
        ordersHistory: [mockOrder]
      }
    };
    const result = dataSelector(mockOrder.number.toString())(state);
    expect(result).toEqual(mockOrder);
  });

  it('Тест orderSlice: dataSelector возвращает order из feedReducer, если найден', () => {
    const state = {
      ...getBaseRootState(),
      orderReducer: {
        ...initialState,
        currentOrder: null,
        ordersHistory: []
      },
      feedReducer: {
        ...getBaseRootState().feedReducer,
        orders: [mockOrder]
      }
    };
    const result = dataSelector(mockOrder.number.toString())(state);
    expect(result).toEqual(mockOrder);
  });

  it('Тест orderSlice: dataSelector возвращает null, если заказ не найден', () => {
    const state = {
      ...getBaseRootState(),
      orderReducer: {
        ...initialState,
        currentOrder: null,
        ordersHistory: []
      },
      feedReducer: {
        ...getBaseRootState().feedReducer,
        orders: []
      }
    };
    const result = dataSelector(mockOrder.number.toString())(state);
    expect(result).toBeNull();
  });
});
