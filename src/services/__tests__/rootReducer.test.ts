import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  it('Тест rootReducer: возвращение корректного начального состояния хранилища при вызове с состоянием undefined и экшеном, который не обрабатывается ни одним редьюсером', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const expectedInitialState = rootReducer(undefined, { type: '@@INIT' });

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual(expectedInitialState);
  });
});
