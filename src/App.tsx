import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { ToastContainer } from './components/common';
import { useSettings, useToast } from './hooks';
import {
  HomePage,
  ConditionPage,
  ActivityPage,
  ReportPage,
  ProfilePage,
  SettingsPage,
} from './pages';
import './styles/global.css';

// 전역 토스트 컨텍스트를 위한 컴포넌트
function AppContent() {
  const { toasts, closeToast } = useToast();

  return (
    <>
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
