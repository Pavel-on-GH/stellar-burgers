import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

import { RootState } from './store';

type TOrderState = {
  currentOrder: TOrder | null;
  orderModalData: TOrder | null;
  ordersHistory: TOrder[];
  orderRequest: boolean;
  ordersHistoryRequest: boolean;
  orderError: string | null | undefined;
};

export const initialState: TOrderState = {
  currentOrder: null,
  orderModalData: null,
  ordersHistory: [],
  orderRequest: false,
  ordersHistoryRequest: false,
  orderError: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredients, { rejectWithValue }) => {
  try {
    const orderData = await orderBurgerApi(ingredients);
    return orderData.order;
  } catch (error: any) {
    if (error?.message) {
      return rejectWithValue(`Ошибка создания заказа: ${error.message}`);
    }
    return rejectWithValue('Ошибка создания заказа. Попробуйте позже.');
  }
});

export const fetchOrderNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const orderData = await getOrderByNumberApi(orderNumber);
    return orderData.orders[0];
  } catch (error: any) {
    if (error?.message) {
      return rejectWithValue(
        `Ошибка загрузки заказа №${orderNumber}: ${error.message}`
      );
    }
    return rejectWithValue(
      `Ошибка загрузки заказа №${orderNumber}. Попробуйте позже.`
    );
  }
});

export const fetchOrdersHistory = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchOrdersHistory', async (_, { rejectWithValue }) => {
  try {
    const orderData = await getOrdersApi();
    return orderData;
  } catch (error: any) {
    if (error?.message) {
      return rejectWithValue(
        `Ошибка загрузки истории заказов: ${error.message}`
      );
    }
    return rejectWithValue(
      'Ошибка загрузки истории заказов. Попробуйте позже.'
    );
  }
});

export const setPending = (
  state: TOrderState,
  key: 'orderRequest' | 'ordersHistoryRequest'
) => {
  state[key] = true;
  state.orderError = null;
};

export const setRejected = (
  state: TOrderState,
  action: PayloadAction<string | undefined>,
  key: 'orderRequest' | 'ordersHistoryRequest'
) => {
  state[key] = false;
  state.orderError =
    action.payload ??
    'Произошла неизвестная ошибка при обработке запроса. Пожалуйста, попробуйте снова.';
};

export const createOrderFulfilled = (
  state: TOrderState,
  action: PayloadAction<TOrder>
) => {
  state.orderRequest = false;
  state.orderModalData = action.payload;
};

export const fetchOrderNumberFulfilled = (
  state: TOrderState,
  action: PayloadAction<TOrder>
) => {
  state.orderRequest = false;
  state.currentOrder = action.payload;
};

const fetchOrdersHistoryFulfilled = (
  state: TOrderState,
  action: PayloadAction<TOrder[]>
) => {
  state.ordersHistoryRequest = false;
  state.ordersHistory = action.payload;
};

const ordersSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) =>
        setPending(state, 'orderRequest')
      )
      .addCase(createOrder.fulfilled, createOrderFulfilled)
      .addCase(createOrder.rejected, (state, action) =>
        setRejected(state, action, 'orderRequest')
      )

      .addCase(fetchOrderNumber.pending, (state) =>
        setPending(state, 'orderRequest')
      )
      .addCase(fetchOrderNumber.fulfilled, fetchOrderNumberFulfilled)
      .addCase(fetchOrderNumber.rejected, (state, action) =>
        setRejected(state, action, 'orderRequest')
      )

      .addCase(fetchOrdersHistory.pending, (state) =>
        setPending(state, 'ordersHistoryRequest')
      )
      .addCase(fetchOrdersHistory.fulfilled, fetchOrdersHistoryFulfilled)
      .addCase(fetchOrdersHistory.rejected, (state, action) =>
        setRejected(state, action, 'ordersHistoryRequest')
      );
  }
});

export const { clearOrder, clearOrderModal } = ordersSlice.actions;

export const dataSelector = (number: string) => (state: RootState) => {
  const num = Number(number);
  return (
    state.orderReducer.ordersHistory.find((order) => order.number === num) ||
    state.feedReducer.orders.find((order) => order.number === num) ||
    state.orderReducer.currentOrder ||
    null
  );
};

export const orderReducer = ordersSlice.reducer;
