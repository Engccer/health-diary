import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, ConfirmDialog, ChangelogModal } from '../components/common';
import { useSettings, useCondition, useActivity, useGamification } from '../hooks';
import { FONT_SIZE_LABELS, FontSize } from '../types';
import { CURRENT_VERSION } from '../data/changelog';
import './SettingsPage.css';

export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, setFontSize, setHighContrast, setUserName, setSoundEnabled } = useSettings();
  const { clearAllRecords: clearConditions } = useCondition();
  const { clearAllRecords: clearActivities } = useActivity();
  const { resetProgress } = useGamification();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  const handleDeleteAllData = () => {
    clearConditions();
    clearActivities();
    resetProgress();
    setShowDeleteConfirm(false);
    setDeleteSuccess(true);
    setTimeout(() => setDeleteSuccess(false), 3000);
  };

  const fontSizes: FontSize[] = ['normal', 'large', 'xlarge'];

  return (
    <div className="page settings-page">
      {/* 닫기 버튼 */}
      <button
        className="settings-close-btn"
        onClick={() => navigate(-1)}
        aria-label="설정 닫기"
      >
        ← 돌아가기
      </button>

      {/* 사용자 이름 */}
      <section className="settings-section">
        <h2 className="settings-section__title">사용자 이름</h2>
        <input
          type="text"
          className="settings-input"
          value={settings.userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="이름을 입력하세요"
          aria-label="사용자 이름"
        />
      </section>

      {/* 글씨 크기 */}
      <section className="settings-section">
        <h2 className="settings-section__title">글씨 크기</h2>
        <div className="font-size-options" role="radiogroup" aria-label="글씨 크기 선택">
          {fontSizes.map((size) => (
            <button
              key={size}
              className={`font-size-btn ${settings.fontSize === size ? 'font-size-btn--active' : ''}`}
              onClick={() => setFontSize(size)}
              role="radio"
              aria-checked={settings.fontSize === size}
            >
              <span className={`font-size-preview font-size-preview--${size}`}>가</span>
              <span className="font-size-label">{FONT_SIZE_LABELS[size]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 고대비 모드 */}
      <section className="settings-section">
        <Card className="settings-toggle">
          <div className="settings-toggle__info">
            <h2 className="settings-toggle__title">고대비 모드</h2>
            <p className="settings-toggle__desc">글씨와 배경의 대비를 높여요</p>
          </div>
          <button
            className={`toggle-switch ${settings.highContrast ? 'toggle-switch--on' : ''}`}
            onClick={() => setHighContrast(!settings.highContrast)}
            role="switch"
            aria-checked={settings.highContrast}
            aria-label="고대비 모드"
          >
            <span className="toggle-switch__thumb" />
          </button>
        </Card>
      </section>

      {/* 효과음 */}
      <section className="settings-section">
        <Card className="settings-toggle">
          <div className="settings-toggle__info">
            <h2 className="settings-toggle__title">효과음</h2>
            <p className="settings-toggle__desc">버튼 클릭, 저장 등의 소리를 재생해요</p>
          </div>
          <button
            className={`toggle-switch ${settings.soundEnabled ? 'toggle-switch--on' : ''}`}
            onClick={() => setSoundEnabled(!settings.soundEnabled)}
            role="switch"
            aria-checked={settings.soundEnabled}
            aria-label="효과음"
          >
            <span className="toggle-switch__thumb" />
          </button>
        </Card>
      </section>

      {/* 데이터 관리 */}
      <section className="settings-section">
        <h2 className="settings-section__title">데이터 관리</h2>
        <Card className="settings-info">
          <p className="settings-info__text">
            모든 데이터는 이 기기에만 저장됩니다.
            <br />
            브라우저 데이터를 삭제하면 기록도 함께 삭제됩니다.
          </p>
        </Card>
        <Button
          variant="outline"
          fullWidth
          className="settings-delete-btn"
          onClick={() => setShowDeleteConfirm(true)}
        >
          모든 데이터 삭제
        </Button>
        {deleteSuccess && (
          <p className="settings-delete-success">모든 데이터가 삭제되었습니다.</p>
        )}
      </section>

      {/* 앱 정보 */}
      <section className="settings-section">
        <h2 className="settings-section__title">앱 정보</h2>
        <Card className="settings-info">
          <p className="settings-info__text">
            <strong>건강일기</strong>
            <br />
            위암 회복기 건강 관리 앱
            <br />
            버전 {CURRENT_VERSION}
          </p>
        </Card>
        <Button
          variant="outline"
          fullWidth
          onClick={() => setShowChangelog(true)}
        >
          업데이트 기록 보기
        </Button>
      </section>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="모든 데이터 삭제"
        message="모든 건강 기록과 진행 상황이 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠어요?"
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
        onConfirm={handleDeleteAllData}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* 업데이트 기록 모달 */}
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
      />
    </div>
  );
}
