import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store/store';

export const AppHeader: FC = () => {
    const { data } = useSelector((state) => state.authReducer);
  
    return <AppHeaderUI userName={data.name} />;
};
