import '../../index.css';
import styles from './app.module.css';
import { Route, Routes } from 'react-router-dom';

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

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Routes>
      {/* Роуты страниц */}
      <Route path='/' element={<ConstructorPage />}>
        ConstructorPage
      </Route>

      <Route path='/feed' element={<Feed />}>
        Feed
      </Route>

      <Route path='/login' element={<Login />}>
        Login
      </Route>

      <Route path='/register' element={<Register />}>
        Register
      </Route>

      <Route path='/forgot-password' element={<ForgotPassword />}>
        ForgotPassword
      </Route>

      <Route path='/reset-password' element={<ResetPassword />}>
        ResetPassword
      </Route>

      <Route path='/profile' element={<Profile />}>
        Profile
      </Route>

      <Route path='/profile/orders' element={<ProfileOrders />}>
        ProfileOrders
      </Route>

      <Route path='/*' element={<NotFound404 />}>
        NotFound404
      </Route>

      {/* Роуты модальных окон */}
      <Route
        path='Модальное окно: заказ'
        element={
          <Modal title='feed/:number' onClose={() => {}}>
            <OrderInfo />
          </Modal>
        }
      >
        Модальное окно: заказ
      </Route>

      <Route
        path='/ingredients/:id'
        element={
          <Modal title='Модальное окно: ингредиент' onClose={() => {}}>
            <IngredientDetails />
          </Modal>
        }
      >
        Модальное окно: ингредиент
      </Route>

      <Route
        path='/profile/orders/:number'
        element={
          <Modal title='Модальное окно: заказы в профиле' onClose={() => {}}>
            <OrderInfo />
          </Modal>
        }
      >
        Модальное окно: заказы в профиле
      </Route>
    </Routes>
  </div>
);

export default App;
