import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}
