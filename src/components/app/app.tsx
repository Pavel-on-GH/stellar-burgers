import '../../index.css';
import styles from './app.module.css';
import { Route, Routes, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  NotFound404,
  ProfileOrders,
  Profile
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

const App = () => {
  const closeModalFunc = useNavigate();

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        {/* Роуты страниц */}
        <Route path='/' element={<ConstructorPage />}>
          ConstructorPage - страница конструктора
        </Route>

        <Route path='/feed' element={<Feed />}>
          Feed - страница ленты заказов
        </Route>

        <Route path='/login' element={<Login />}>
          Login - страница авторизации
        </Route>

        <Route path='/register' element={<Register />}>
          Register - страница регистрации
        </Route>

        <Route path='/forgot-password' element={<ForgotPassword />}>
          ForgotPassword - страница восстановления пароля
        </Route>

        <Route path='/reset-password' element={<ResetPassword />}>
          ResetPassword - страница сброса пароля
        </Route>

        <Route path='/profile' element={<Profile />}>
          Profile - страница профиля
        </Route>

        <Route path='/profile/orders' element={<ProfileOrders />}>
          ProfileOrders - страница сделанных заказов в профиле
        </Route>

        <Route path='/*' element={<NotFound404 />}>
          NotFound404 - страница заглушки с ошибкой
        </Route>

        {/* Роуты модальных окон */}
        <Route
          path='Модальное окно: заказ'
          element={
            <Modal title='feed/:number' onClose={() => closeModalFunc(-1)}>
              <OrderInfo />
            </Modal>
          }
        >
          Модальное окно - заказ
        </Route>

        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title='Модальное окно: ингредиент'
              onClose={() => closeModalFunc(-1)}
            >
              <IngredientDetails />
            </Modal>
          }
        >
          Модальное окно - ингредиент
        </Route>

        <Route
          path='/profile/orders/:number'
          element={
            <Modal
              title='Модальное окно: заказы в профиле'
              onClose={() => closeModalFunc(-1)}
            >
              <OrderInfo />
            </Modal>
          }
        >
          Модальное окно - заказы в профиле
        </Route>
      </Routes>
    </div>
  );
};
export default App;
