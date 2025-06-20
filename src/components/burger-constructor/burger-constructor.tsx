import { FC, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';

import { createOrder, clearOrderModal } from '../../services/ordersSlice';
import { removeAllIngredients } from '../../services/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.userReducer.authStatus);

  const { bun, ingredients } = useSelector(
    (state) => state.constructorReducer.constructorItems
  );

  const orderRequest = useSelector((state) => state.orderReducer.orderRequest);
  const orderModalData = useSelector(
    (state) => state.orderReducer.orderModalData
  );

  const onOrderClick = async () => {
    if (!authStatus) return navigate('/login');
    if (!bun || orderRequest) return;

    const ingredientId = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const action = await dispatch(createOrder(ingredientId));

    createOrder.fulfilled.match(action)
      ? dispatch(removeAllIngredients())
      : console.error('Ошибка:', action.error);
  };

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrderModal());
  }, [dispatch]);

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      constructorItems={{ bun, ingredients }}
      price={price}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
