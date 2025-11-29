import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { playTabSwitch } from '../utils/sound';

// 탭 순서 정의
const TAB_ORDER = ['/', '/condition', '/activity', '/report', '/profile'];

// 스와이프 감도 설정
const SWIPE_THRESHOLD = 30; // 최소 스와이프 거리 (px) - iOS에서 더 잘 감지되도록 낮춤
const SWIPE_TIMEOUT = 500;  // 최대 스와이프 시간 (ms) - 여유있게 조정
const SWIPE_ANGLE_THRESHOLD = 30; // 수평 스와이프 판정 각도 (도)

// VoiceOver 스크롤 제스처 설정
const SCROLL_THRESHOLD = 50; // 스크롤 감지 임계값
const SCROLL_DEBOUNCE = 300; // 디바운스 시간 (ms)

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
}

export function useTabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const touchRef = useRef<TouchData | null>(null);
  const lastScrollTime = useRef<number>(0);
  const scrollAccumulator = useRef<number>(0);

  // 현재 탭 인덱스
  const getCurrentIndex = useCallback(() => {
    return TAB_ORDER.indexOf(location.pathname);
  }, [location.pathname]);

  // 이전 탭으로 이동
  const goToPrevTab = useCallback(() => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      playTabSwitch('left');
      navigate(TAB_ORDER[currentIndex - 1]);
    }
  }, [getCurrentIndex, navigate]);

  // 다음 탭으로 이동
  const goToNextTab = useCallback(() => {
    const currentIndex = getCurrentIndex();
    if (currentIndex >= 0 && currentIndex < TAB_ORDER.length - 1) {
      playTabSwitch('right');
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

  // VoiceOver 3손가락 스와이프 감지 (wheel 이벤트)
  // iOS VoiceOver에서 3손가락 좌우 스와이프는 수평 스크롤 이벤트로 전달됨
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();

      // 수평 스크롤만 처리 (VoiceOver 3손가락 스와이프)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 0) {
        // 디바운스: 너무 빠른 연속 이동 방지
        if (now - lastScrollTime.current < SCROLL_DEBOUNCE) {
          scrollAccumulator.current += e.deltaX;
        } else {
          scrollAccumulator.current = e.deltaX;
        }

        // 임계값 이상 누적되면 탭 전환
        if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
          if (scrollAccumulator.current > 0) {
            // 오른쪽으로 스크롤 → 다음 탭
            goToNextTab();
          } else {
            // 왼쪽으로 스크롤 → 이전 탭
            goToPrevTab();
          }
          scrollAccumulator.current = 0;
          lastScrollTime.current = now;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
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

    // 스와이프 조건 확인 (각도 기반)
    // - 수평 방향 스와이프인지 각도로 판별
    // - 최소 거리 이상 이동해야 함
    // - 일정 시간 내에 완료되어야 함
    const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
    const isHorizontalSwipe = angle < SWIPE_ANGLE_THRESHOLD || angle > (180 - SWIPE_ANGLE_THRESHOLD);

    if (
      isHorizontalSwipe &&
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
