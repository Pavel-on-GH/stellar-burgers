import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, TFeedsResponse } from '@api';
import { TOrder } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  isLoading: boolean;
  error: string | null | undefined;
};

export const initialState: TFeedState = {
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('feeds/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch {
    return rejectWithValue(
      'Ошибка загрузки данных с сервера. Попробуйте обновить страницу.'
    );
  }
});

const pendingFeeds = (state: TFeedState) => {
  state.isLoading = true;
  state.error = null;
};

const fulfilledFeeds = (
  state: TFeedState,
  action: PayloadAction<TFeedsResponse>
) => {
  state.isLoading = false;
  state.orders = action.payload.orders;
  state.totalOrders = action.payload.total;
  state.ordersToday = action.payload.totalToday;
  state.error = null;
};

const rejectedFeeds = (
  state: TFeedState,
  action: {
    payload?: string | null | undefined;
    error: { message?: string | null | undefined };
  }
) => {
  state.isLoading = false;

  if (action.payload) {
    state.error = action.payload;
  } else if (action.error.message) {
    state.error = `Ошибка сети: ${action.error.message}`;
  } else {
    state.error = 'Произошла неизвестная ошибка при загрузке заказов.';
  }
};

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, pendingFeeds)
      .addCase(fetchFeeds.fulfilled, fulfilledFeeds)
      .addCase(fetchFeeds.rejected, rejectedFeeds);
  }
});

export const feedReducer = feedSlice.reducer;
