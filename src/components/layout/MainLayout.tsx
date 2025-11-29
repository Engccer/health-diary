import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { useTabNavigation } from '../../hooks';

// 경로에서 페이지 이름 가져오기
const getPageName = (pathname: string): string => {
  switch (pathname) {
    case '/': return '홈';
    case '/condition': return '컨디션 기록';
    case '/activity': return '활동 기록';
    case '/report': return '보고서';
    case '/profile': return '내 정보';
    case '/settings': return '설정';
    default: return '건강일기';
  }
};

export function MainLayout() {
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { handleTouchStart, handleTouchEnd, goToPrevTab, goToNextTab } = useTabNavigation();
  const [announcement, setAnnouncement] = useState('');

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

  // 페이지 변경 시 스크린 리더 알림
  useEffect(() => {
    const pageName = getPageName(location.pathname);
    setAnnouncement(`${pageName} 페이지`);
  }, [location.pathname]);

  return (
    <div className="main-layout">
      {/* 스크린 리더 알림 영역 */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      <Header />
      <main id="main-content" className="main-content" ref={mainRef} role="main">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}
