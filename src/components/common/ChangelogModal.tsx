import { BottomSheet } from './BottomSheet';
import { CHANGELOG, CURRENT_VERSION } from '../../data/changelog';
import './ChangelogModal.css';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 특정 버전만 표시할 경우 */
  highlightVersion?: string;
}

export function ChangelogModal({ isOpen, onClose, highlightVersion }: ChangelogModalProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="업데이트 기록">
      <div className="changelog">
        <p className="changelog__current">현재 버전: v{CURRENT_VERSION}</p>
        <div className="changelog__list">
          {CHANGELOG.map((entry) => (
            <div
              key={entry.version}
              className={`changelog__entry ${highlightVersion === entry.version ? 'changelog__entry--highlight' : ''}`}
            >
              <div className="changelog__header">
                <span className="changelog__version">v{entry.version}</span>
                <span className="changelog__date">{entry.date}</span>
              </div>
              <h3 className="changelog__title">{entry.title}</h3>
              <ul className="changelog__changes">
                {entry.changes.map((change, index) => (
                  <li key={index}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
