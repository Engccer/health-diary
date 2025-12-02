import { useCallback, useEffect } from 'react';
import { useLocalStorage, STORAGE_KEYS } from './useLocalStorage';
import { AppSettings, createDefaultSettings, FontSize } from '../types';
import { setSoundEnabled as setSoundEnabledUtil, preloadSounds } from '../utils/sound';

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.SETTINGS,
    createDefaultSettings()
  );

  // 설정 적용
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    document.documentElement.setAttribute(
      'data-high-contrast',
      String(settings.highContrast)
    );
  }, [settings.fontSize, settings.highContrast]);

  // 사운드 초기화 및 설정 동기화
  useEffect(() => {
    preloadSounds();
    setSoundEnabledUtil(settings.soundEnabled);
  }, []);

  useEffect(() => {
    setSoundEnabledUtil(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // 글씨 크기 변경
  const setFontSize = useCallback(
    (fontSize: FontSize) => {
      setSettings((prev) => ({ ...prev, fontSize }));
    },
    [setSettings]
  );

  // 고대비 모드 변경
  const setHighContrast = useCallback(
    (highContrast: boolean) => {
      setSettings((prev) => ({ ...prev, highContrast }));
    },
    [setSettings]
  );

  // 사용자 이름 변경
  const setUserName = useCallback(
    (userName: string) => {
      setSettings((prev) => ({ ...prev, userName }));
    },
    [setSettings]
  );

  // 알림 설정 변경
  const setReminder = useCallback(
    (enabled: boolean, time?: string) => {
      setSettings((prev) => ({
        ...prev,
        reminderEnabled: enabled,
        reminderTime: time ?? prev.reminderTime,
      }));
    },
    [setSettings]
  );

  // 효과음 설정 변경
  const setSoundEnabled = useCallback(
    (soundEnabled: boolean) => {
      setSettings((prev) => ({ ...prev, soundEnabled }));
    },
    [setSettings]
  );

  return {
    settings,
    setFontSize,
    setHighContrast,
    setUserName,
    setReminder,
    setSoundEnabled,
  };
}
