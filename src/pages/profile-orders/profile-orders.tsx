import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useSelector, useDispatch } from '../../services/store';
import { fetchOrdersHistory } from '../../services/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orderReducer);

  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  return orders.ordersHistoryRequest ? (
    <Preloader />
  ) : (
    <ProfileOrdersUI orders={orders.ordersHistory} />
  );
};
