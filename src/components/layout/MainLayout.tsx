import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { useTabNavigation } from '../../hooks';

export function MainLayout() {
  const mainRef = useRef<HTMLElement>(null);
  const { handleTouchStart, handleTouchEnd } = useTabNavigation();

  // 터치 이벤트 바인딩
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    mainElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      mainElement.removeEventListener('touchstart', handleTouchStart);
      mainElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return (
    <div className="main-layout">
      <Header />
      <main id="main-content" className="main-content" ref={mainRef}>
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}
