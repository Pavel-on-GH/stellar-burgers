import { FC } from 'react';
import styles from './app-header.module.css';
import { useLocation, NavLink } from 'react-router-dom';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

function classNames(base: string, condition: boolean, activeClass: string) {
  return condition ? `${base} ${activeClass}` : base;
}

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const constructorLink =
    location.pathname === '/' || location.pathname.startsWith('/ingredients');
  const feedLink = location.pathname.startsWith('/feed');
  const profileLink =
    location.pathname.startsWith('/profile') || location.pathname === '/login';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={classNames(
              styles.link,
              constructorLink,
              styles.link_active
            )}
          >
            <BurgerIcon type={constructorLink ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${
                constructorLink ? 'text_color_primary' : 'text_color_inactive'
              }`}
            >
              Конструктор
            </p>
          </NavLink>

          <NavLink
            to='/feed'
            className={classNames(styles.link, feedLink, styles.link_active)}
          >
            <ListIcon type={feedLink ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                feedLink ? 'text_color_primary' : 'text_color_inactive'
              }`}
            >
              Лента заказов
            </p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={classNames(styles.link, profileLink, styles.link_active)}
          >
            <ProfileIcon type={profileLink ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                profileLink ? 'text_color_primary' : 'text_color_inactive'
              }`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
