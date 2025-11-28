// 앱 설정 타입 정의

export type FontSize = 'normal' | 'large' | 'xlarge';

export interface AppSettings {
  fontSize: FontSize;
  highContrast: boolean;
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm
  userName: string;
}

export const createDefaultSettings = (): AppSettings => ({
  fontSize: 'large', // 어르신용 기본값
  highContrast: false,
  reminderEnabled: false,
  reminderTime: '09:00',
  userName: '',
});

export const FONT_SIZE_LABELS: Record<FontSize, string> = {
  normal: '보통',
  large: '크게',
  xlarge: '매우 크게',
};
