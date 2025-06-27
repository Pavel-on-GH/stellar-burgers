const selectors = {
  burgerIngredient: '[data-cy=burger-ingredient]',
  burgerConstructor: '[data-cy=burger-constructor]',
  modal: '[data-cy=modal]',
  modalOverlay: '[data-cy=modal-overlay]'
};

const ingredients = {
  bun: 'Флюоресцентная булка R2-D3',
  firstIngredient: 'Говяжий метеорит (отбивная)',
  secondIngredient: 'Соус с шипами Антарианского плоскоходца'
};

function addIngredient(name: string) {
  cy.get(selectors.burgerIngredient)
    .contains(name)
    .parent()
    .find('button')
    .click();
}

function addIngredients(...names: string[]) {
  names.forEach((name) => addIngredient(name));
}

function verifyConstructorContains(...names: string[]) {
  names.forEach((name) => {
    cy.get(selectors.burgerConstructor).should('contain.text', name);
  });
}

function initializeTestState() {
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');

  localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');

  cy.viewport(1400, 1200);
  cy.visit('/');

  cy.wait(['@getIngredients', '@getUser']);
}

function resetTestState() {
  localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
}

function openIngredientModal(name: string) {
  cy.contains(name).click();
  cy.get(selectors.modal).should('exist');
}

function closeModal(method: 'button' | 'overlay' = 'button') {
  if (method === 'button') {
    cy.get(selectors.modal).find('button').click();
  } else {
    cy.get(selectors.modalOverlay).click({ force: true });
  }
  cy.get(selectors.modal).should('not.exist');
}

function verifyConstructorEmpty() {
  cy.get(selectors.burgerConstructor)
    .children()
    .first()
    .should('contain.text', 'Выберите булки');

  cy.get(selectors.burgerConstructor)
    .children()
    .eq(1)
    .should('contain.text', 'Выберите начинку');
}

describe('Cypress-тестирование', () => {
  beforeEach(initializeTestState);
  afterEach(resetTestState);

  it('Тест cypress: добавление булки и нескольких начинок', () => {
    addIngredient(ingredients.bun);
    verifyConstructorContains(ingredients.bun);

    addIngredients(ingredients.firstIngredient, ingredients.secondIngredient);
    verifyConstructorContains(
      ingredients.firstIngredient,
      ingredients.secondIngredient
    );
  });

  it('Тест cypress: открытие и закрытие модального окна', () => {
    openIngredientModal(ingredients.bun);
    closeModal('button');

    openIngredientModal(ingredients.bun);
    closeModal('overlay');
  });

  it('Тест cypress: отображение правильного ингредиента в модальном окне', () => {
    openIngredientModal(ingredients.bun);
    cy.get(selectors.modal).should('contain.text', ingredients.bun);
  });

  it('Тест cypress: добавление нескольких ингредиентов и оформление заказа', () => {
    addIngredients(
      ingredients.bun,
      ingredients.firstIngredient,
      ingredients.secondIngredient
    );

    verifyConstructorContains(
      ingredients.bun,
      ingredients.firstIngredient,
      ingredients.secondIngredient
    );

    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('order');

    cy.contains('Оформить заказ').click();
    cy.wait('@order').its('response.statusCode').should('eq', 200);

    cy.get(selectors.modal).should('exist').and('contain.text', '123456');

    closeModal();
    verifyConstructorEmpty();
  });
});
