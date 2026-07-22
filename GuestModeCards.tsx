import './guest-mode-cards.css';
import {
  GUEST_FEATURES,
  chipClass,
  chipLabel,
  ctaLabel,
  ctaVariant,
  isWide,
  type GuestFeatureDef,
  type GuestFeatureKey,
  type GuestFeatureStatus,
} from './guestFeatures';

/** API가 내려주는 기능별 신청 상태 (API_SPEC.md) */
export interface GuestFeatureState {
  key: GuestFeatureKey;
  status: GuestFeatureStatus;
  appliedAt?: string | null;
  approvedAt?: string | null;
  /** 승인완료 CTA 라우팅 목적지. 없으면 정적 정의의 manageUrl 사용 */
  manageUrl?: string | null;
}

export interface GuestModeCardsProps {
  /** 서버에서 받은 상태 배열. 미포함 key는 'NONE'으로 간주 */
  states: GuestFeatureState[];
  /** 이미지 베이스 경로 (예: '/assets/guest-mode') */
  imageBase: string;
  /** 미신청 CTA 클릭 → 신청 모달 열기 */
  onApply: (feature: GuestFeatureDef) => void;
  /** 승인완료 CTA 클릭 → 관리 화면 라우팅. 미지정시 location.assign */
  onNavigate?: (url: string, feature: GuestFeatureDef) => void;
}

export function GuestModeCards({ states, imageBase, onApply, onNavigate }: GuestModeCardsProps) {
  const byKey = new Map(states.map((s) => [s.key, s]));
  const total = GUEST_FEATURES.length;

  const navigate = (url: string, def: GuestFeatureDef) => {
    if (onNavigate) onNavigate(url, def);
    else window.location.assign(url);
  };

  return (
    <div className="gm-scope">
      <h1 className="gm-h1">Guest mode</h1>
      <div className="gm-lead">
        <h2>센터 운영을 더 스마트하게 해보세요</h2>
        <p>신청하시면 검토 후 승인해 드려요. 승인되면 바로 사용하실 수 있습니다.</p>
      </div>

      <div className="gm-grid">
        {GUEST_FEATURES.map((def, i) => {
          const raw = byKey.get(def.key)?.status ?? 'NONE';
          // REJECTED는 재신청 가능해야 하므로 미신청과 동일 취급
          const status: GuestFeatureStatus = raw === 'REJECTED' ? 'NONE' : raw;
          const variant = ctaVariant(status, def.recommended);
          const wide = isWide(i, total, def);
          const label = ctaLabel(def, status);
          const manageUrl = byKey.get(def.key)?.manageUrl || def.manageUrl;

          const cardClass = [
            'gm-card',
            def.recommended ? 'is-rec' : '',
            wide ? 'is-wide' : '',
          ].filter(Boolean).join(' ');

          return (
            <article key={def.key} className={cardClass}>
              <div className="gm-chd">
                <h3>
                  {def.isNew && <span className="gm-badge is-new">NEW</span>}
                  {!def.isNew && def.recommended && <span className="gm-badge">추천</span>}
                  {def.title}
                </h3>
                <span className={`gm-chip ${chipClass(status)}`}>
                  <span className="gm-dot" aria-hidden="true" />
                  {chipLabel(status)}
                </span>
              </div>

              <p className="gm-ben" dangerouslySetInnerHTML={{ __html: def.benefitHtml }} />
              <p className="gm-desc">{def.desc}</p>

              <div className="gm-thumb">
                <img src={`${imageBase}/${def.image}`} alt="" loading="lazy" />
              </div>

              <div className="gm-spacer" />

              {/* PENDING = 중복 신청 차단을 위해 실제 disabled 처리 */}
              <button
                type="button"
                className={`gm-cta v-${variant}`}
                disabled={status === 'PENDING'}
                aria-disabled={status === 'PENDING'}
                aria-label={`${def.title} — ${chipLabel(status)} — ${label}`}
                onClick={() => {
                  if (status === 'PENDING') return;
                  if (status === 'APPROVED') navigate(manageUrl, def);
                  else onApply(def);
                }}
              >
                {label}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default GuestModeCards;
