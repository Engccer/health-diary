// 보고서 공유 유틸리티 함수
import html2canvas from 'html2canvas';

/**
 * Web Share API 지원 여부 확인
 */
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * 파일 공유 지원 여부 확인
 */
export function canShareFiles(): boolean {
  return canShare() && 'canShare' in navigator;
}

/**
 * HTML 요소를 이미지(Blob)로 캡처
 */
export async function captureElement(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2, // 고해상도
    logging: false,
    useCORS: true,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('이미지 생성에 실패했습니다.'));
      }
    }, 'image/png');
  });
}

/**
 * 보고서 공유 (Web Share API)
 */
export async function shareReport(
  image: Blob,
  text: string,
  title: string
): Promise<boolean> {
  // 파일 공유 지원 확인
  const file = new File([image], 'health-report.png', { type: 'image/png' });
  const shareData: ShareData = {
    title,
    text,
    files: [file],
  };

  // canShare로 파일 공유 가능 여부 확인
  if (navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // 사용자가 취소한 경우
      if ((error as Error).name === 'AbortError') {
        return false;
      }
      throw error;
    }
  }

  // 파일 공유가 안 되면 텍스트만 공유 시도
  const textOnlyData: ShareData = {
    title,
    text,
  };

  if (navigator.canShare && navigator.canShare(textOnlyData)) {
    try {
      await navigator.share(textOnlyData);
      // 텍스트 공유 후 이미지 다운로드 제공
      downloadImage(image, 'health-report.png');
      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return false;
      }
      throw error;
    }
  }

  // 공유 API 사용 불가 - fallback
  return false;
}

/**
 * 이미지 다운로드 (fallback)
 */
export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 텍스트를 클립보드에 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * 날짜 포맷팅 (예: 11월 28일)
 */
export function formatDateForShare(date: string): string {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[d.getDay()];
  return `${month}월 ${day}일 (${dayName})`;
}

/**
 * 날짜 범위 포맷팅 (예: 11/22 ~ 11/28)
 */
export function formatDateRangeForShare(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.getMonth() + 1}/${start.getDate()} ~ ${end.getMonth() + 1}/${end.getDate()}`;
}
