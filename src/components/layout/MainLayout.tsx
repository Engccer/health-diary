import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="main-layout">
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>
      <Header />
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}
