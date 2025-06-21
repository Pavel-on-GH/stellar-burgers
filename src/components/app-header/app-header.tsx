import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector((state) => state.userReducer.data);
  const userName = user !== null ? user.name : '';

  return <AppHeaderUI userName={userName} />;
};
