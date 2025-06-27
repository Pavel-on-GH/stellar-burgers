import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  removeAllIngredients,
  moveUpIngredient,
  moveDownIngredient
} from '../constructorSlice';

jest.mock('uuid', () => ({
  v4: jest.fn(() => `mock-uuid-${Math.random()}`)
}));

describe('constructorSlice', () => {
  it('Тест constructorSlice: добавление булки в constructorItems.bun и генерация уникального ID', () => {
    const state = {
      constructorItems: {
        bun: null,
        ingredients: []
      }
    };

    const action = addIngredient({
      type: 'bun',
      name: 'Тест: булка',
      _id: '1',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 300,
      price: 50,
      image: 'url',
      image_large: 'url-large',
      image_mobile: 'url-mobile'
    });

    const newState = constructorReducer(state, action);

    expect(newState.constructorItems.bun).toEqual({
      type: 'bun',
      name: 'Тест: булка',
      id: expect.any(String),
      _id: '1',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 300,
      price: 50,
      image: 'url',
      image_large: 'url-large',
      image_mobile: 'url-mobile'
    });
  });

  it('Тест constructorSlice: добавление ингредиента в constructorItems.ingredients и генерация уникального ID', () => {
    const state = {
      constructorItems: {
        bun: null,
        ingredients: []
      }
    };

    const action = addIngredient({
      type: 'ingredient',
      name: 'Тест 2',
      _id: '2',
      proteins: 2,
      fat: 0.1,
      carbohydrates: 5,
      calories: 20,
      price: 10,
      image: 'url',
      image_large: 'url-large',
      image_mobile: 'url-mobile'
    });

    const newState = constructorReducer(state, action);

    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0]).toEqual({
      type: 'ingredient',
      name: 'Тест 2',
      id: expect.any(String),
      _id: '2',
      proteins: 2,
      fat: 0.1,
      carbohydrates: 5,
      calories: 20,
      price: 10,
      image: 'url',
      image_large: 'url-large',
      image_mobile: 'url-mobile'
    });
  });

  it('Тест constructorSlice: удаление ингредиента из constructorItems.ingredients', () => {
    const state = {
      constructorItems: {
        bun: null,
        ingredients: [
          {
            type: 'ingredient',
            name: 'Ingredient 1',
            id: '2',
            _id: '2',
            proteins: 2,
            fat: 0.1,
            carbohydrates: 5,
            calories: 20,
            price: 10,
            image: 'url',
            image_large: 'url-large',
            image_mobile: 'url-mobile'
          },
          {
            type: 'ingredient',
            name: 'Ingredient 2',
            id: '3',
            _id: '3',
            proteins: 1,
            fat: 0.2,
            carbohydrates: 4,
            calories: 15,
            price: 15,
            image: 'url',
            image_large: 'url-large',
            image_mobile: 'url-mobile'
          }
        ]
      }
    };

    const action = removeIngredient('2');
    const newState = constructorReducer(state, action);

    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0].id).toBe('3');
  });

  it('Тест constructorSlice: удаление всех ингредиентов', () => {
    const state = {
      constructorItems: {
        bun: {
          type: 'bun',
          name: 'Тест: булка',
          id: '1',
          _id: '1',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 300,
          price: 50,
          image: 'url',
          image_large: 'url-large',
          image_mobile: 'url-mobile'
        },
        ingredients: [
          {
            type: 'ingredient',
            name: 'Ingredient 1',
            id: '2',
            _id: '2',
            proteins: 2,
            fat: 0.1,
            carbohydrates: 5,
            calories: 20,
            price: 10,
            image: 'url',
            image_large: 'url-large',
            image_mobile: 'url-mobile'
          },
          {
            type: 'ingredient',
            name: 'Ingredient 2',
            id: '3',
            _id: '3',
            proteins: 1,
            fat: 0.2,
            carbohydrates: 4,
            calories: 15,
            price: 15,
            image: 'url',
            image_large: 'url-large',
            image_mobile: 'url-mobile'
          }
        ]
      }
    };

    const action = removeAllIngredients();
    const newState = constructorReducer(state, action);

    expect(newState.constructorItems.bun).toBeNull();
    expect(newState.constructorItems.ingredients).toHaveLength(0);
  });

  it('Тест constructorSlice: перемещение элемента вверх', () => {
    const state = {
      constructorItems: {
        bun: null,
        ingredients: [
          {
            type: 'ingredient',
            name: 'Ingredient 1',
            id: '2',
            _id: '2',
            proteins: 2,
            fat: 0.1,
            carbohydrates: 5,
            calories: 20,
            price: 10,
            image: 'url',
            image_large: 'url-large',
            image_mobile: 'url-mobile'
          },
          {
            type: 'ingredient',
            name: 'Ingredient 2',
            id: '3',
            _id: '3',
            proteins: 1,
            fat: 0.2,
            carbohydrates: 4,
            calories: 15,
            price: 15,
            image: 'url',
            image_large: 'url-large',
            image_mobile: 'url-mobile'
          }
        ]
      }
    };

    const action = moveUpIngredient(1);
    const newState = constructorReducer(state, action);

    expect(newState.constructorItems.ingredients[0].name).toBe('Ingredient 2');
    expect(newState.constructorItems.ingredients[1].name).toBe('Ingredient 1');
  });

  it('Тест constructorSlice: перемещение элемента вниз', () => {
    const state = {
      constructorItems: {
        bun: null,
        ingredients: [
          {
            type: 'ingredient',
            name: 'Ingredient 1',
            id: '2',
            _id: '2',
            proteins: 2,
            fat: 0.1,
            carbohydrates: 5,
            calories: 20,
            price: 10,
            image: 'url',
            image_large: 'url-large',
            image_mobile: 'url-mobile'
          },
          {
            type: 'ingredient',
            name: 'Ingredient 2',
            id: '3',
            _id: '3',
            proteins: 1,
            fat: 0.2,
            carbohydrates: 4,
            calories: 15,
            price: 15,
            image: 'url',
            image_large: 'url-large',
            image_mobile: 'url-mobile'
          }
        ]
      }
    };

    const action = moveDownIngredient(0);
    const newState = constructorReducer(state, action);

    expect(newState.constructorItems.ingredients[0].name).toBe('Ingredient 2');
    expect(newState.constructorItems.ingredients[1].name).toBe('Ingredient 1');
  });
});
