import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 탭 순서 정의
const TAB_ORDER = ['/', '/condition', '/activity', '/report', '/profile'];

// 스와이프 감도 설정
const SWIPE_THRESHOLD = 50; // 최소 스와이프 거리 (px)
const SWIPE_TIMEOUT = 300;  // 최대 스와이프 시간 (ms)

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
}

export function useTabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const touchRef = useRef<TouchData | null>(null);

  // 현재 탭 인덱스
  const getCurrentIndex = useCallback(() => {
    return TAB_ORDER.indexOf(location.pathname);
  }, [location.pathname]);

  // 이전 탭으로 이동
  const goToPrevTab = useCallback(() => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      navigate(TAB_ORDER[currentIndex - 1]);
    }
  }, [getCurrentIndex, navigate]);

  // 다음 탭으로 이동
  const goToNextTab = useCallback(() => {
    const currentIndex = getCurrentIndex();
    if (currentIndex >= 0 && currentIndex < TAB_ORDER.length - 1) {
      navigate(TAB_ORDER[currentIndex + 1]);
    }
  }, [getCurrentIndex, navigate]);

  // 키보드 이벤트 핸들러 (Alt + 좌우 방향키)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt 키가 눌린 상태에서만 동작
      if (!e.altKey) return;

      // 입력 필드에 포커스가 있으면 무시
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevTab();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextTab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevTab, goToNextTab]);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchRef.current.startX;
    const deltaY = touch.clientY - touchRef.current.startY;
    const deltaTime = Date.now() - touchRef.current.startTime;

    // 스와이프 조건 확인
    // - 가로 이동이 세로 이동보다 커야 함 (수평 스와이프)
    // - 최소 거리 이상 이동해야 함
    // - 일정 시간 내에 완료되어야 함
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > SWIPE_THRESHOLD &&
      deltaTime < SWIPE_TIMEOUT
    ) {
      if (deltaX > 0) {
        // 오른쪽으로 스와이프 → 이전 탭
        goToPrevTab();
      } else {
        // 왼쪽으로 스와이프 → 다음 탭
        goToNextTab();
      }
    }

    touchRef.current = null;
  }, [goToPrevTab, goToNextTab]);

  return {
    handleTouchStart,
    handleTouchEnd,
    goToPrevTab,
    goToNextTab,
    currentIndex: getCurrentIndex(),
    isFirstTab: getCurrentIndex() === 0,
    isLastTab: getCurrentIndex() === TAB_ORDER.length - 1,
  };
}
