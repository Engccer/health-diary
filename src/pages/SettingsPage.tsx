import { Card, Button } from '../components/common';
import { useSettings } from '../hooks';
import { FONT_SIZE_LABELS, FontSize } from '../types';
import './SettingsPage.css';

export function SettingsPage() {
  const { settings, setFontSize, setHighContrast, setUserName } = useSettings();

  const fontSizes: FontSize[] = ['normal', 'large', 'xlarge'];

  return (
    <div className="page settings-page">
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
            버전 1.0.0
          </p>
        </Card>
      </section>
    </div>
  );
}
