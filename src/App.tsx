import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { ToastContainer, UpdateBanner, ChangelogModal } from './components/common';
import { useSettings, useToast, useServiceWorkerUpdate } from './hooks';
import { CURRENT_VERSION } from './data/changelog';
import {
  HomePage,
  ConditionPage,
  ActivityPage,
  ReportPage,
  ProfilePage,
  SettingsPage,
} from './pages';
import './styles/global.css';

const LAST_VERSION_KEY = 'health-diary-last-version';

// 전역 토스트 컨텍스트를 위한 컴포넌트
function AppContent() {
  const { toasts, closeToast, showToast } = useToast();
  const { showUpdatePrompt, handleUpdate, handleDismiss } = useServiceWorkerUpdate();
  const [showChangelogModal, setShowChangelogModal] = useState(false);

  // 앱 로드 시 버전 체크
  useEffect(() => {
    const lastVersion = localStorage.getItem(LAST_VERSION_KEY);

    if (lastVersion && lastVersion !== CURRENT_VERSION) {
      // 업데이트가 있었음 - 토스트 표시
      showToast(
        `v${CURRENT_VERSION}으로 업데이트되었습니다!`,
        'success',
        { duration: 5000 }
      );
      setShowChangelogModal(true);
    }

    // 현재 버전 저장
    localStorage.setItem(LAST_VERSION_KEY, CURRENT_VERSION);
  }, [showToast]);

  return (
    <>
      <UpdateBanner
        show={showUpdatePrompt}
        onUpdate={handleUpdate}
        onDismiss={handleDismiss}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="condition" element={<ConditionPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* 업데이트 후 Changelog 표시 */}
      <ChangelogModal
        isOpen={showChangelogModal}
        onClose={() => setShowChangelogModal(false)}
        highlightVersion={CURRENT_VERSION}
      />
    </>
  );
}

function App() {
  // 설정 초기화 (글씨 크기 등 적용)
  useSettings();

  return (
    <BrowserRouter basename="/health-diary">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
