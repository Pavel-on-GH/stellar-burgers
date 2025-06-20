import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { useSelector, useDispatch } from '../../services/store';
import { updateUser } from '../../services/userSlice';

type FormValue = {
  name: string;
  email: string;
  password: string;
};

export const Profile: FC = () => {
  const user = useSelector((state) => state.userReducer.data);
  const dispatch = useDispatch();

  if (!user) {
    return <div>Загрузка...</div>;
  }

  const [formValue, setFormValue] = useState<FormValue>({
    name: user.name || '',
    email: user.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user.name || '',
      email: user.email || '',
      password: ''
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    formValue.password !== '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      })
    ).then(() => {
      setFormValue({
        name: formValue.name,
        email: formValue.email,
        password: ''
      });
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    setFormValue((prevState) => {
      const updated = { ...prevState };
      updated[targetName as keyof FormValue] = targetValue;
      return updated;
    });
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
