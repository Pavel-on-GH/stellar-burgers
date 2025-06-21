import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const constructorItems = useSelector(
    (state) => state.constructorReducer.constructorItems
  );

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    for (const ingredient of constructorItems.ingredients) {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    }

    if (constructorItems.bun) {
      counters[constructorItems.bun?._id] = 2;
    }

    return counters;
  }, [constructorItems]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
