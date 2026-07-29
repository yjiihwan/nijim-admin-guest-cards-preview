import './guest-mode-cards.css';
import {
  DEFAULT_CANCEL_REASON,
  DEFAULT_REJECT_REASON,
  GUEST_FEATURES,
  INSTALL_FLOW_STEPS,
  chipClass,
  chipLabel,
  ctaLabel,
  ctaVariant,
  flowChipClass,
  flowChipLabel,
  flowCtaLabel,
  flowCtaVariant,
  flowStepIndex,
  isFlowCtaDisabled,
  isInstallFeature,
  isWide,
  quoteTotals,
  type GuestFeatureDef,
  type GuestFeatureKey,
  type GuestFeatureStatus,
  type InstallFeatureKey,
  type InstallFeatureState,
  type InstallFlow,
} from './guestFeatures';

const won = (n: number) => n.toLocaleString('ko-KR');

/** API가 내려주는 기능별 신청 상태 (API_SPEC.md) */
export interface GuestFeatureState {
  key: GuestFeatureKey;
  status: GuestFeatureStatus;
  appliedAt?: string | null;
  approvedAt?: string | null;
  /** 승인완료 CTA 라우팅 목적지. 없으면 정적 정의의 manageUrl 사용 */
  manageUrl?: string | null;
  /** REJECTED일 때 최고관리자가 남긴 반려 사유 (API_SPEC.md rejectedReason) */
  rejectedReason?: string | null;
}

export interface GuestModeCardsProps {
  /** 서버에서 받은 상태 배열. 미포함 key는 'NONE'으로 간주 */
  states: GuestFeatureState[];
  /**
   * 설치형 2종(access_control·iot_control) 전용 다단계 상태.
   * 미포함이면 flow='NONE'으로 간주 → 기존 화면과 동일하게 안전하게 렌더된다.
   */
  installStates?: InstallFeatureState[];
  /** 이미지 베이스 경로 (예: '/assets/guest-mode') */
  imageBase: string;
  /** 미신청 CTA 클릭 → 신청 모달 열기 */
  onApply: (feature: GuestFeatureDef) => void;
  /** 설치형 상담신청서 모달 (INSTALL_SURVEY_FORMS 스키마로 렌더). 미지정시 onApply 폴백 */
  onApplySurvey?: (feature: GuestFeatureDef, state: InstallFeatureState) => void;
  /** 설치형 QUOTED 상태에서 견적서 확인 모달 열기 */
  onOpenQuote?: (feature: GuestFeatureDef, state: InstallFeatureState) => void;
  /** 승인완료 CTA 클릭 → 관리 화면 라우팅. 미지정시 location.assign */
  onNavigate?: (url: string, feature: GuestFeatureDef) => void;
}

/** 카드 내부 6단계 진행 스텝퍼 — 지난 단계 체크, 현재 단계 강조, 남은 단계 흐림 */
function FlowStepper({ flow }: { flow: InstallFlow }) {
  const idx = flowStepIndex(flow);
  const failed = flow === 'REJECTED';
  const idle = flow === 'NONE' || flow === 'CANCELED';

  return (
    <div className={`gm-steps${idle ? ' is-idle' : ''}`} role="list" aria-label="도입 진행 단계">
      {INSTALL_FLOW_STEPS.map((s, i) => {
        const state = failed
          ? (i === 0 ? 'is-fail' : '')
          : idle ? '' : i < idx ? 'is-done' : i === idx ? 'is-cur' : '';
        const mark = state === 'is-done' ? '✓' : state === 'is-fail' ? '!' : i + 1;
        return (
          <div key={s.flow} className={`gm-step ${state}`} role="listitem">
            <i aria-hidden="true">{mark}</i>
            <b>{s.label}</b>
            <u>{s.short}</u>
          </div>
        );
      })}
    </div>
  );
}

/** 단계별 안내 박스 — 지금 무슨 일이 진행 중이고 다음에 뭘 하면 되는지 한 문단으로 */
function FlowNote({ state }: { state: InstallFeatureState }) {
  const { flow } = state;

  if (flow === 'NONE') {
    return (
      <div className="gm-note is-muted">
        <b>도입 절차</b>· 이 서비스는 센터에 기기를 설치·시공해야 사용할 수 있어요. 신청서를 넣으시면 담당자가
        연락드려 현장을 확인하고 견적을 안내해 드립니다.
      </div>
    );
  }
  if (flow === 'APPLIED') {
    return (
      <div className="gm-note">
        <b>접수 완료</b>· 신청서가 접수됐어요. 담당자가 내용을 확인한 뒤 1~2영업일 안에 접수 결과를 알려드려요.
      </div>
    );
  }
  if (flow === 'CONSULT') {
    return (
      <div className="gm-note">
        <b>상담 대기</b>· 접수가 승인됐어요. 담당자가 등록하신 연락처로 연락드려 현장 상황(평수·출입문·전력)을
        확인하고 방문 실사 일정을 잡습니다.
        {state.consult && (
          <dl>
            <dt>배정 담당자</dt><dd>{state.consult.manager}</dd>
            <dt>방문 실사 예정</dt><dd>{state.consult.visitDate}</dd>
          </dl>
        )}
      </div>
    );
  }
  if (flow === 'QUOTED' && state.quote) {
    const t = quoteTotals(state.quote.lines);
    return (
      <div className="gm-note is-quote">
        <b>견적 도착</b>· 상담·현장실사 결과를 반영한 견적이 확정됐어요. 내용을 확인하고 수락하시면 시공 일정을
        잡아드립니다.
        <dl>
          <dt>총액 (VAT 포함)</dt><dd>{won(t.total)}원</dd>
          <dt>예상 시공기간</dt><dd>{state.quote.leadTime}</dd>
          <dt>견적 유효기한</dt><dd>{state.quote.validUntil}</dd>
        </dl>
      </div>
    );
  }
  if (flow === 'INSTALLING') {
    return (
      <div className="gm-note">
        <b>시공 진행중</b>· 시공 당일에는 담당자가 현장에 방문해요. 영업시간과 겹치지 않게 일정 조정이 필요하면
        담당자에게 알려주세요.
        {state.progress && (
          <dl>
            <dt>진행 상태</dt><dd>{state.progress.note}</dd>
            <dt>완료 예정일</dt><dd>{state.progress.dueDate}</dd>
          </dl>
        )}
      </div>
    );
  }
  if (flow === 'INSTALLED') {
    return (
      <div className="gm-note">
        <b>시공 완료</b>· 설치·시공이 끝났어요. 최고관리자 최종 사용승인이 나면 바로 사용하실 수 있습니다(보통
        1영업일 이내). 승인되면 앱으로 알려드려요.
      </div>
    );
  }
  if (flow === 'REJECTED') {
    return <div className="gm-reject"><b>반려 사유</b>· {state.rejectedReason || DEFAULT_REJECT_REASON}</div>;
  }
  if (flow === 'CANCELED') {
    return <div className="gm-note is-muted"><b>취소 사유</b>· {state.canceledReason || DEFAULT_CANCEL_REASON}</div>;
  }
  return null;
}

export function GuestModeCards({
  states,
  installStates = [],
  imageBase,
  onApply,
  onApplySurvey,
  onOpenQuote,
  onNavigate,
}: GuestModeCardsProps) {
  const byKey = new Map(states.map((s) => [s.key, s]));
  const installByKey = new Map(installStates.map((s) => [s.key, s]));
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
          const wideCard = isWide(i, total, def);
          const badge = def.isNew
            ? <span className="gm-badge is-new">NEW</span>
            : def.recommended ? <span className="gm-badge">추천</span> : null;
          const baseClass = [
            'gm-card',
            def.recommended ? 'is-rec' : '',
            wideCard ? 'is-wide' : '',
          ].filter(Boolean).join(' ');

          /* ── 설치형 2종 — 기기 설치·시공이 선행돼야 해서 별도 flow 파이프라인을 탄다 ── */
          if (isInstallFeature(def.key)) {
            const ist: InstallFeatureState =
              installByKey.get(def.key as InstallFeatureKey) ?? { key: def.key as InstallFeatureKey, flow: 'NONE' };
            const flow = ist.flow;
            const disabled = isFlowCtaDisabled(flow);
            const label = flowCtaLabel(def, flow);

            return (
              <article key={def.key} className={baseClass}>
                <div className="gm-chd">
                  <h3>{badge}{def.title}</h3>
                  <span className={`gm-chip ${flowChipClass(flow)}`}>
                    <span className="gm-dot" aria-hidden="true" />
                    {flowChipLabel(flow)}
                  </span>
                </div>

                <p className="gm-ben" dangerouslySetInnerHTML={{ __html: def.benefitHtml }} />
                <p className="gm-desc">{def.desc}</p>

                <FlowStepper flow={flow} />
                <FlowNote state={ist} />

                <div className="gm-thumb">
                  <img src={`${imageBase}/${def.image}`} alt="" loading="lazy" />
                </div>

                <div className="gm-spacer" />

                <button
                  type="button"
                  className={`gm-cta v-${flowCtaVariant(flow)}`}
                  disabled={disabled}
                  aria-disabled={disabled}
                  aria-label={`${def.title} — ${flowChipLabel(flow)} — ${label}`}
                  onClick={() => {
                    if (disabled) return;
                    if (flow === 'ACTIVE') return navigate(ist.manageUrl || def.manageUrl, def);
                    if (flow === 'QUOTED') return onOpenQuote?.(def, ist);
                    // NONE · REJECTED · CANCELED — 상담신청서(재신청 포함)
                    return onApplySurvey ? onApplySurvey(def, ist) : onApply(def);
                  }}
                >
                  {label}
                </button>
              </article>
            );
          }

          /* ── 나머지 4종 — 기존 3상태 로직 그대로 ── */
          const state = byKey.get(def.key);
          // REJECTED는 별도 칩+사유 노출+재신청 허용 (2026-07-28 확정)
          const status: GuestFeatureStatus = state?.status ?? 'NONE';
          const rejectReason = state?.rejectedReason || DEFAULT_REJECT_REASON;
          const variant = ctaVariant(status, def.recommended);
          const wide = isWide(i, total, def);
          const label = ctaLabel(def, status);
          const manageUrl = state?.manageUrl || def.manageUrl;

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

              {status === 'REJECTED' && (
                <div className="gm-reject"><b>반려 사유</b>· {rejectReason}</div>
              )}

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
                  else onApply(def); // NONE·REJECTED 모두 신청/재신청 모달 (REJECTED는 모달에 사유 표시 권장)
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
