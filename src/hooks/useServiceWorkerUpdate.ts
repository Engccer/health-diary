import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function useServiceWorkerUpdate() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('Service Worker 등록됨:', swUrl);
      // 주기적으로 업데이트 확인 (1시간마다)
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('Service Worker 등록 오류:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdatePrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowUpdatePrompt(false);
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
    setNeedRefresh(false);
  };

  return {
    showUpdatePrompt,
    handleUpdate,
    handleDismiss,
  };
}
