// MP3 기반 사운드 효과 시스템

// 사운드 파일 경로
const SOUNDS = {
  success: '/sounds/success.mp3',
  levelup: '/sounds/levelup.mp3',
  badge: '/sounds/badge.mp3',
  tabSwitch: '/sounds/tab-switch.mp3',
  buttonTap: '/sounds/button-tap.mp3',
  scoreSelect: '/sounds/score-select.mp3',
  toggle: '/sounds/toggle.mp3',
  increment: '/sounds/increment.mp3',
  decrement: '/sounds/decrement.mp3',
  navTap: '/sounds/nav-tap.mp3',
  modalOpen: '/sounds/modal-open.mp3',
  expand: '/sounds/expand.mp3',
  toastSuccess: '/sounds/toast-success.mp3',
  toastError: '/sounds/toast-error.mp3',
  toastInfo: '/sounds/toast-info.mp3',
  toastAchievement: '/sounds/toast-achievement.mp3',
  deleteConfirm: '/sounds/delete-confirm.mp3',
  deleteComplete: '/sounds/delete-complete.mp3',
} as const;

type SoundName = keyof typeof SOUNDS;

// 오디오 캐시
const audioCache: Map<SoundName, HTMLAudioElement> = new Map();

// 사운드 활성화 상태
let isSoundEnabled = true;

// 사운드 활성화 상태 설정
export function setSoundEnabled(enabled: boolean): void {
  isSoundEnabled = enabled;
}

// 사운드 활성화 상태 조회
export function getSoundEnabled(): boolean {
  return isSoundEnabled;
}

// 사운드 프리로드
export function preloadSounds(): void {
  Object.entries(SOUNDS).forEach(([name, path]) => {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audioCache.set(name as SoundName, audio);
    } catch (e) {
      console.warn(`Failed to preload sound: ${name}`, e);
    }
  });
}

// 사운드 재생 핵심 함수
function playSound(name: SoundName): void {
  if (!isSoundEnabled) return;

  try {
    // 캐시된 오디오 사용 또는 새로 생성
    let audio = audioCache.get(name);
    if (!audio) {
      audio = new Audio(SOUNDS[name]);
      audioCache.set(name, audio);
    }

    // 처음부터 재생 (빠른 연속 재생 지원)
    audio.currentTime = 0;
    audio.play().catch((e) => {
      // 사용자 인터랙션 없이 재생 시도 시 무시
      if (e.name !== 'NotAllowedError') {
        console.warn('Audio playback failed:', e);
      }
    });
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

// === 기존 사운드 함수 (API 호환성 유지) ===

// 저장 성공 사운드
export function playSuccess(): void {
  playSound('success');
}

// 레벨업 팡파레
export function playLevelUp(): void {
  playSound('levelup');
}

// 배지 획득 차임벨
export function playBadge(): void {
  playSound('badge');
}

// 탭 전환 스와이프
export function playTabSwitch(_direction?: 'left' | 'right'): void {
  playSound('tabSwitch');
}

// === 새로운 UI 인터랙션 사운드 ===

// 일반 버튼 탭
export function playButtonTap(): void {
  playSound('buttonTap');
}

// 점수 선택 (1-5점)
export function playScoreSelect(): void {
  playSound('scoreSelect');
}

// 토글 스위치
export function playToggle(): void {
  playSound('toggle');
}

// 시간 증가 (+)
export function playIncrement(): void {
  playSound('increment');
}

// 시간 감소 (-)
export function playDecrement(): void {
  playSound('decrement');
}

// 네비게이션 탭
export function playNavTap(): void {
  playSound('navTap');
}

// 모달/바텀시트 열기
export function playModalOpen(): void {
  playSound('modalOpen');
}

// 접기/펼치기
export function playExpand(): void {
  playSound('expand');
}

// === 토스트 알림 사운드 ===

// 성공 토스트
export function playToastSuccess(): void {
  playSound('toastSuccess');
}

// 에러 토스트
export function playToastError(): void {
  playSound('toastError');
}

// 정보 토스트
export function playToastInfo(): void {
  playSound('toastInfo');
}

// 업적 토스트
export function playToastAchievement(): void {
  playSound('toastAchievement');
}

// === 삭제 관련 사운드 ===

// 삭제 확인 경고
export function playDeleteConfirm(): void {
  playSound('deleteConfirm');
}

// 삭제 완료
export function playDeleteComplete(): void {
  playSound('deleteComplete');
}
