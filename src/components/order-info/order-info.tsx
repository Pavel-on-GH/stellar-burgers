import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { dataSelector, fetchOrderNumber } from '../../services/ordersSlice';

export const OrderInfo: FC = () => {
  const params = useParams<{ number: string }>();
  const number = params.number;

  const dispatch = useDispatch();

  const ingredients = useSelector(
    (state) => state.ingredientsReducer.ingredients
  );
  const orderData = useSelector(dataSelector(number || ''));

  useEffect(() => {
    if (!orderData && number) dispatch(fetchOrderNumber(Number(number)));
  }, [dispatch, orderData, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);
    const ingredientMap = new Map(ingredients.map((item) => [item._id, item]));

    const ingredientsInfo: Record<string, TIngredient & { count: number }> = {};
    orderData.ingredients.forEach((id) => {
      if (!ingredientsInfo[id]) {
        const ing = ingredientMap.get(id);
        if (ing) ingredientsInfo[id] = { ...ing, count: 1 };
      } else {
        ingredientsInfo[id].count++;
      }
    });

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;
  return <OrderInfoUI orderInfo={orderInfo} />;
};
