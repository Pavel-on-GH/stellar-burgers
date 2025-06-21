import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';

import { loginUser } from '../../services/userSlice';
import { RootState } from '../../services/store';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.userReducer);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={userData.loginUserError || '' || undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
