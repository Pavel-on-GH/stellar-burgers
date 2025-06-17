import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const { bun, ingredients = [] } = useSelector(
    (state) => state.constructorReducer.constructorItems
  );

  // (!) Не забыть исправить, когда сделаю order
  const orderRequest = false;
  const orderData = null;

  const constructorItems = { bun, ingredients };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
  };

  const closeOrderModal = () => {};

  return (
    <BurgerConstructorUI
      constructorItems={constructorItems}
      price={price}
      orderRequest={orderRequest}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
