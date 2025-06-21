import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(
    (state) => state.ingredientsReducer.ingredients
  );
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  return ingredientData ? (
    <IngredientDetailsUI ingredientData={ingredientData} />
  ) : (
    <Preloader />
  );
};
