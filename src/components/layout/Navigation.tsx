import { NavLink } from 'react-router-dom';
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
  return (
    <nav className="navigation" aria-label="메인 메뉴">
      <ul className="navigation__list">
        {navItems.map((item) => (
          <li key={item.to} className="navigation__item">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `navigation__link ${isActive ? 'navigation__link--active' : ''}`
              }
              aria-label={item.label}
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
