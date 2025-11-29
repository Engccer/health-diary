import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title, showBack = false }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const titleRef = useRef<HTMLHeadingElement>(null);

  // 탭 전환 시 헤딩으로 포커스 이동 (스크린 리더 접근성)
  useEffect(() => {
    // 라우트가 변경될 때마다 헤딩으로 포커스 이동
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [location.pathname]);

  const handleBack = () => {
    navigate(-1);
  };

  // 홈이 아닐 때 타이틀이 없으면 경로에서 유추
  const getTitle = () => {
    if (title) return title;
    switch (location.pathname) {
      case '/':
        return '건강일기';
      case '/condition':
        return '컨디션 기록';
      case '/activity':
        return '활동 기록';
      case '/info':
        return '건강 정보';
      case '/profile':
        return '내 정보';
      case '/settings':
        return '설정';
      default:
        return '건강일기';
    }
  };

  return (
    <header className="header">
      <div className="header__content">
        {showBack && (
          <button
            className="header__back"
            onClick={handleBack}
            aria-label="뒤로 가기"
          >
            ←
          </button>
        )}
        <h1 ref={titleRef} className="header__title" tabIndex={-1}>{getTitle()}</h1>
      </div>
    </header>
  );
}
