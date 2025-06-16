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
import { AppHeader } from '@components';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Routes>
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
    </Routes>
  </div>
);

export default App;
