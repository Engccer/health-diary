import { NavLink, useLocation } from 'react-router-dom';
import { playNavTap } from '../../utils/sound';
import './Navigation.css';

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: '🏠', label: '홈' },
  { to: '/condition', icon: '💪', label: '컨디션' },
  { to: '/activity', icon: '🚶', label: '활동' },
  { to: '/report', icon: '📊', label: '보고서' },
  { to: '/profile', icon: '👤', label: '나' },
];

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navigation" aria-label="메인 메뉴">
      <ul className="navigation__list" role="tablist">
        {navItems.map((item) => (
          <li key={item.to} className="navigation__item" role="presentation">
            <NavLink
              to={item.to}
              className={`navigation__link ${isActive(item.to) ? 'navigation__link--active' : ''}`}
              role="tab"
              aria-selected={isActive(item.to)}
              aria-label={`${item.label} 탭${isActive(item.to) ? ', 현재 페이지' : ''}`}
              tabIndex={isActive(item.to) ? 0 : -1}
              onClick={() => playNavTap()}
            >
              <span className="navigation__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="navigation__label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
