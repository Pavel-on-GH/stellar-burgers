import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feedReducer.orders);
  const loading = useSelector((state) => state.feedReducer.isLoading);
  const error = useSelector((state) => state.feedReducer.error);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка в ленте заказов: {error}</div>;
  }

  if (!orders.length) {
    return <div>Заказы отсутствуют</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
