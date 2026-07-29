/**
 * Guest mode 기능 카드 정적 정의 (카피 SSOT = COPY_REWRITE.md 2026-07-22 확정본)
 * 상태(status)·관리화면 URL은 API에서 내려받아 병합한다. API_SPEC.md 참조.
 */

export type GuestFeatureKey =
  | 'website'
  | 'offline_payment'
  | 'subscription'
  | 'access_control'
  | 'norder'
  | 'iot_control';

/** 백엔드가 내려주는 신청 상태. REJECTED는 별도 칩('반려됨')+사유 노출+재신청 허용 (2026-07-28 확정). */
export type GuestFeatureStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface GuestFeatureDef {
  key: GuestFeatureKey;
  title: string;
  /** 핵심 베네핏. `<em>`로 감싼 구간만 핑크 강조 */
  benefitHtml: string;
  desc: string;
  image: string;
  /** 추천 카드 = 상단 그라데 스트립 + 추천 배지 + 채움 CTA */
  recommended?: boolean;
  /** 신규 카드 = NEW 배지 */
  isNew?: boolean;
  /** 그리드 마지막 홀수 카드를 풀폭으로 승격 */
  wide?: boolean;
  cta: {
    none: string;
    pending: string;
    approved: string;
  };
  /** 승인완료 CTA가 이동할 어드민 관리 화면 (API의 manageUrl이 오면 그 값이 우선) */
  manageUrl: string;
}

export const PENDING_CTA = '신청 검토중 · 평균 1~2영업일';

export const GUEST_FEATURES: GuestFeatureDef[] = [
  {
    key: 'website',
    title: '온라인 홍보 (웹·앱)',
    benefitHtml: '전용 홈페이지 + 앱 검색노출, <em>웹·앱 양쪽에서 홍보</em>',
    desc: '제작비 0원으로 전용 홈페이지를 만들어 광고·홍보·멤버십 판매에 쓰고, 니짐내짐 앱에도 우리 센터가 검색·노출돼요. 웹과 앱, 양쪽에서 신규 회원을 만나세요.',
    image: '01_website.png',
    cta: {
      none: '온라인 홍보 시작하기',
      pending: PENDING_CTA,
      approved: '온라인 홍보 관리하러 가기',
    },
    manageUrl: '/admin/website',
  },
  {
    key: 'offline_payment',
    title: '비대면결제 (QR·웹·앱)',
    benefitHtml: '키오스크 없이 <em>24시간 무인 결제</em>',
    desc: '고객이 자기 폰으로 알아서 결제하니, 비싼 키오스크를 두지 않아도 24시간 무인 운영이 가능해요.',
    image: '02_payment.png',
    recommended: true,
    cta: {
      none: '비대면결제 도입신청하기',
      pending: PENDING_CTA,
      approved: '비대면결제 관리하러 가기',
    },
    manageUrl: '/admin/payment',
  },
  {
    key: 'subscription',
    title: '월 정기결제 구독멤버십',
    benefitHtml: '넷플릭스처럼, <em>매달 자동으로 들어오는 매출</em>',
    desc: '월 정기결제 상품을 판매해 회원이 더 쉽게 등록하게 만들고, 반복 매출로 역대 최대 매출에 도전해 보세요.',
    image: '04_subscription.png',
    recommended: true,
    cta: {
      none: '구독멤버십 도입신청하기',
      pending: PENDING_CTA,
      approved: '구독멤버십 관리하러 가기',
    },
    manageUrl: '/admin/subscription',
  },
  {
    key: 'access_control',
    title: '무인 출입제어 시스템',
    benefitHtml: '회원이 스스로 여는 출입문, <em>상주 인력 0명</em>',
    desc: '회원이 직접 출입문을 열고 닫아요. 직원은 언제 어디서든 누가 출입했는지 확인하고 원격으로 문을 여닫을 수 있어요.',
    image: '05_access.png',
    cta: {
      none: '무인 출입제어 도입신청하기',
      pending: PENDING_CTA,
      approved: '출입제어 관리하러 가기',
    },
    manageUrl: '/admin/access',
  },
  {
    key: 'norder',
    title: 'N 오더',
    benefitHtml: '센터 안 음료·자물쇠·굿즈를 <em>앱에서 바로 판매</em>',
    desc: '회원이 상품을 확인하고 원터치결제로 클릭 한 번에 주문해요. 무인 판매로 부가 매출이 붙습니다.',
    image: '06_norder.png',
    cta: {
      none: 'N 오더 이용시작하기',
      pending: PENDING_CTA,
      approved: 'N 오더 관리하러 가기',
    },
    manageUrl: '/admin/norder',
  },
  {
    key: 'iot_control',
    title: 'IoT 원격자동제어',
    benefitHtml: '센터에 없어도, <em>조명·냉난방을 앱으로 원격 제어</em>',
    desc: '조명·냉난방·환기 등 센터 설비를 앱에서 원격으로 켜고 끌 수 있어요. 오픈·마감 시간에 맞춰 자동 스케줄을 걸어두면 설비가 알아서 켜지고 꺼져서, 센터에 나가지 않아도 운영 준비가 끝나 있습니다.',
    image: '07_iot.png',
    recommended: true,
    isNew: true,
    wide: true,
    cta: {
      none: 'IoT 원격제어 도입신청하기',
      pending: PENDING_CTA,
      approved: 'IoT 제어판 열기',
    },
    manageUrl: '/admin/iot',
  },
];

export type CtaVariant = 'fill' | 'line' | 'wait' | 'done';

/** 상태 + 추천여부 2축으로 CTA 위계 결정 (SPEC §6) */
export function ctaVariant(status: GuestFeatureStatus, recommended?: boolean): CtaVariant {
  if (status === 'APPROVED') return 'done';
  if (status === 'PENDING') return 'wait';
  if (status === 'REJECTED') return 'fill'; // 재신청 유도 — 항상 강조 CTA
  return recommended ? 'fill' : 'line';
}

export function chipLabel(status: GuestFeatureStatus): string {
  if (status === 'APPROVED') return '승인완료 · 사용중';
  if (status === 'PENDING') return '신청됨 · 검토중';
  if (status === 'REJECTED') return '반려됨';
  return '미신청';
}

export function chipClass(status: GuestFeatureStatus): string {
  if (status === 'APPROVED') return 's-approved';
  if (status === 'PENDING') return 's-pending';
  if (status === 'REJECTED') return 's-rejected';
  return 's-none';
}

export function ctaLabel(def: GuestFeatureDef, status: GuestFeatureStatus): string {
  if (status === 'APPROVED') return def.cta.approved;
  if (status === 'PENDING') return def.cta.pending;
  if (status === 'REJECTED') return '다시 신청하기';
  return def.cta.none;
}

/** 홀수 장일 때만 마지막 카드를 풀폭으로. 8장이 되면 자동으로 2열 복귀 */
export function isWide(index: number, total: number, def: GuestFeatureDef): boolean {
  return Boolean(def.wide) && total % 2 === 1 && index === total - 1;
}

/** 반려 사유 기본 문구 — 백엔드 rejectedReason이 null일 때 폴백 */
export const DEFAULT_REJECT_REASON =
  '제출하신 사업자 정보와 센터 정보가 일치하지 않아 반려되었어요. 정보를 확인해 수정하신 뒤 다시 신청해 주세요.';

/* ============================================================================
 * 설치형 서비스 다단계 파이프라인 (2026-07-29 신설)
 *
 * WHY: `access_control`(무인 출입제어)·`iot_control`(IoT 원격자동제어)은 최고관리자
 * 승인만으로 즉시 쓸 수 있는 서비스가 아니다. SaaS와 호환되는 기기를 센터에
 * 설치·시공한 뒤 사용승인까지 나야 동작한다. 설치·시공 규모는 센터 평수·출입문
 * 형태·전자기기 구성·전력구조에 따라 천차만별이라 비대면 자동 제공이 불가능하고,
 * 담당자 확인 → 현장 상담 → 견적 협의 → 시공 → 사용승인의 실물 절차를 탄다.
 *
 * 그래서 이 2종만 기존 `status`(GuestFeatureStatus)와 **분리된 `flow` 상태**를 쓴다.
 * 나머지 4종(website/offline_payment/subscription/norder)은 기존 3상태 로직 그대로.
 * ========================================================================== */

export const INSTALL_FEATURE_KEYS = ['access_control', 'iot_control'] as const;
export type InstallFeatureKey = (typeof INSTALL_FEATURE_KEYS)[number];

export function isInstallFeature(key: GuestFeatureKey): key is InstallFeatureKey {
  return (INSTALL_FEATURE_KEYS as readonly string[]).includes(key);
}

/** 설치형 전용 상태. 곁가지 REJECTED(2단계 반려)·CANCELED(상담완료 후 취소) */
export type InstallFlow =
  | 'NONE'        // 미신청
  | 'APPLIED'     // 신청서 접수 · 검토중
  | 'CONSULT'     // 상담 · 현장실사 대기 (접수승인 직후)
  | 'QUOTED'      // 상담완료 · 견적 확정, 센터 확인 대기
  | 'INSTALLING'  // 설치 · 시공 진행중 (센터가 견적 수락)
  | 'INSTALLED'   // 시공완료 · 최종 사용승인 대기
  | 'ACTIVE'      // 최종승인 완료 · 사용중
  | 'REJECTED'    // 2단계(검토) 반려
  | 'CANCELED';   // 상담완료 후 신청건 취소

/** 카드 내부 6단계 스텝퍼. NONE·REJECTED·CANCELED는 진행 단계가 아니라 제외 */
export const INSTALL_FLOW_STEPS: { flow: InstallFlow; label: string; short: string }[] = [
  { flow: 'APPLIED', label: '신청접수', short: '신청' },
  { flow: 'CONSULT', label: '상담·실사', short: '상담' },
  { flow: 'QUOTED', label: '견적확인', short: '견적' },
  { flow: 'INSTALLING', label: '설치·시공', short: '시공' },
  { flow: 'INSTALLED', label: '시공완료', short: '완료' },
  { flow: 'ACTIVE', label: '사용중', short: '사용' },
];

/** 현재 단계 인덱스. NONE/CANCELED = -1(전 단계 흐림), REJECTED = 0(1단계 실패) */
export function flowStepIndex(flow: InstallFlow): number {
  if (flow === 'REJECTED') return 0;
  return INSTALL_FLOW_STEPS.findIndex((s) => s.flow === flow);
}

export function flowChipLabel(flow: InstallFlow): string {
  switch (flow) {
    case 'APPLIED': return '신청접수 · 검토중';
    case 'CONSULT': return '상담·현장실사 대기';
    case 'QUOTED': return '견적 도착 · 확인 필요';
    case 'INSTALLING': return '설치·시공 진행중';
    case 'INSTALLED': return '시공완료 · 승인 대기';
    case 'ACTIVE': return '승인완료 · 사용중';
    case 'REJECTED': return '반려됨';
    case 'CANCELED': return '신청 취소됨';
    default: return '미신청';
  }
}

/** 기존 chipClass 계열(s-none/s-pending/s-approved/s-rejected) 재사용 + 부족한 2종만 추가 */
export function flowChipClass(flow: InstallFlow): string {
  switch (flow) {
    case 'APPLIED':
    case 'CONSULT':
    case 'INSTALLING':
    case 'INSTALLED': return 's-pending';
    case 'QUOTED': return 's-quoted';
    case 'ACTIVE': return 's-approved';
    case 'REJECTED': return 's-rejected';
    case 'CANCELED': return 's-canceled';
    default: return 's-none';
  }
}

export function flowCtaLabel(def: GuestFeatureDef, flow: InstallFlow): string {
  switch (flow) {
    case 'APPLIED': return '신청서 접수됨 · 검토중';
    case 'CONSULT': return '담당자 배정중 · 연락 예정';
    case 'QUOTED': return '견적서 확인하기';
    case 'INSTALLING': return '설치·시공 진행중';
    case 'INSTALLED': return '최종 사용승인 대기중';
    case 'ACTIVE': return def.cta.approved;   // 기존 approved 문구 재사용
    case 'REJECTED': return '다시 신청하기';
    case 'CANCELED': return '다시 상담신청하기';
    default: return '도입 상담신청하기';
  }
}

/** 센터의 행동이 필요한 단계(NONE·QUOTED·REJECTED·CANCELED)만 채움 CTA */
export function flowCtaVariant(flow: InstallFlow): CtaVariant {
  if (flow === 'ACTIVE') return 'done';
  if (flow === 'QUOTED' || flow === 'REJECTED' || flow === 'CANCELED' || flow === 'NONE') return 'fill';
  return 'wait';
}

/** CTA 비활성(중복 클릭 차단) — 센터가 할 수 있는 행동이 없는 대기 단계 */
export function isFlowCtaDisabled(flow: InstallFlow): boolean {
  return flow === 'APPLIED' || flow === 'CONSULT' || flow === 'INSTALLING' || flow === 'INSTALLED';
}

/* ── 견적 ─────────────────────────────────────────────────────────────── */

export interface QuoteLine {
  name: string;
  qty: number;
  unitPrice: number;
}

export interface InstallQuote {
  lines: QuoteLine[];
  /** 공급가 합계 */
  subtotal: number;
  /** 부가세 10% (원 단위 절사) */
  vat: number;
  total: number;
  /** 예상 시공기간 (예: '2~3일') */
  leadTime: string;
  /** 견적 유효기한 ISO date */
  validUntil: string;
  issuedAt?: string;
}

export const VAT_RATE = 0.1;

/** 합계·VAT·총액은 항상 이 함수 하나로만 계산한다(화면·서버 표기 불일치 방지) */
export function quoteTotals(lines: QuoteLine[]): Pick<InstallQuote, 'subtotal' | 'vat' | 'total'> {
  const subtotal = lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0);
  const vat = Math.floor(subtotal * VAT_RATE);
  return { subtotal, vat, total: subtotal + vat };
}

/* ── 상담·시공 기록 ───────────────────────────────────────────────────── */

export interface ConsultRecord {
  /** 배정 담당자 */
  manager: string;
  /** 현장실사 방문일자 (YYYY-MM-DD) */
  visitDate: string;
  /** 통화 메모 */
  callMemo: string;
  /** 현장실사 결과 */
  surveyResult: string;
  recordedAt?: string;
}

export interface InstallProgress {
  /** 시공 진행상태 문구 (예: '배선 작업 완료, 컨트롤러 설치중') */
  note: string;
  /** 시공 완료 예정일 */
  dueDate: string;
  updatedAt?: string;
}

/** API 응답 — 설치형 2종 전용 확장 (API_SPEC.md §5) */
export interface InstallFeatureState {
  key: InstallFeatureKey;
  flow: InstallFlow;
  /** 단계 진입 시각 — 관리자 콘솔 SLA 계산용 */
  stageSince?: string | null;
  appliedAt?: string | null;
  /** CONSULT 단계에서 상담기록이 저장되면 true → 견적 입력·발송 가능 */
  consultDone?: boolean;
  consult?: ConsultRecord | null;
  quote?: InstallQuote | null;
  progress?: InstallProgress | null;
  rejectedReason?: string | null;
  canceledReason?: string | null;
  manageUrl?: string | null;
}

/* ── 상담용 신청서 폼 스키마 ──────────────────────────────────────────────
 * 두 기능의 현장 변수가 서로 달라 문항을 각각 맞춘다.
 * - access_control: 출입문 형태·개수가 핵심(도어락/전기정 사양이 여기서 갈림)
 * - iot_control: 제어 대상 기기·기존 컨트롤러 유무가 핵심(출입문 문항은 비중↓)
 * ---------------------------------------------------------------------- */

export type SurveyFieldType =
  | 'number-unit'  // 숫자 + 단위 select
  | 'text'
  | 'tel'
  | 'radio'
  | 'select'
  | 'checkbox-qty'  // 체크박스 + 수량
  | 'device-qty'    // 체크박스 + 수량 + 제어방식 select (IoT 전용)
  | 'floor'         // 층수 + 엘리베이터 유무
  | 'power'         // 단상/삼상 + 계약전력 kW
  | 'textarea';

export interface SurveyField {
  name: string;
  label: string;
  type: SurveyFieldType;
  required?: boolean;
  hint?: string;
  units?: string[];
  options?: string[];
  /** device-qty 전용 — 기기별 제어방식 선택지 */
  methods?: string[];
  placeholder?: string;
}

const CONTACT_FIELDS: SurveyField[] = [
  { name: 'preferredPeriod', label: '희망 시공 시기', type: 'select', required: true,
    options: ['1개월 이내', '1~3개월 이내', '3개월 이후', '아직 미정 (상담 후 결정)'] },
  { name: 'managerName', label: '현장 담당자 이름', type: 'text', required: true, placeholder: '예) 김민수' },
  { name: 'managerPhone', label: '현장 담당자 연락처', type: 'tel', required: true, placeholder: '010-0000-0000' },
  { name: 'etc', label: '추가 요청사항', type: 'textarea', required: false,
    placeholder: '현장 상황 중 미리 알려주실 내용이 있으면 적어주세요. (선택)' },
];

const AREA_FIELD: SurveyField = {
  name: 'area', label: '센터 평수', type: 'number-unit', required: true, units: ['㎡', '평'],
  hint: '전용 면적 기준으로 적어주세요.',
};

const FLOOR_FIELD: SurveyField = {
  name: 'floor', label: '층수 및 엘리베이터 유무', type: 'floor', required: true,
  placeholder: '예) 지상 3층', options: ['있음', '없음'],
};

const POWER_FIELD: SurveyField = {
  name: 'power', label: '전력구조', type: 'power', required: true,
  options: ['단상(220V)', '삼상(380V)', '모름'], hint: '계약전력은 전기요금 고지서에서 확인할 수 있어요.',
};

export const INSTALL_SURVEY_FORMS: Record<InstallFeatureKey, SurveyField[]> = {
  access_control: [
    AREA_FIELD,
    FLOOR_FIELD,
    { name: 'doors', label: '출입문 형태와 개수', type: 'checkbox-qty', required: true,
      options: ['자동문(슬라이딩)', '여닫이문', '유리문(강화도어)', '스피드게이트·턴게이트', '기타'],
      hint: '해당하는 형태를 모두 고르고 개수를 적어주세요. 도어락·전기정 사양이 여기서 갈립니다.' },
    { name: 'devices', label: '현재 사용 중인 전자기기 종류·개수', type: 'checkbox-qty', required: true,
      options: ['조명', '냉난방기', '환기설비', '급탕·온수', 'CCTV', '기존 출입통제 장비'] },
    POWER_FIELD,
    ...CONTACT_FIELDS,
  ],
  iot_control: [
    AREA_FIELD,
    FLOOR_FIELD,
    { name: 'targetDevices', label: '원격제어할 대상 기기', type: 'device-qty', required: true,
      options: ['조명', '냉난방기(에어컨·히터)', '환기설비', '급탕·온수', '제습·가습기', '음향설비', '간판·사인'],
      methods: ['스마트플러그', '릴레이 결선', '적외선(IR) 리모컨', '기존 컨트롤러 연동', '모름 (상담 필요)'],
      hint: '기기별로 수량과 원하는 제어 방식을 골라주세요.' },
    { name: 'controller', label: '기존 통합 컨트롤러 유무', type: 'radio', required: true,
      options: ['있음 (제조사·모델 아래 기재)', '없음', '모름'],
      hint: '기존 컨트롤러가 있으면 연동으로 시공비가 크게 줄어듭니다.' },
    { name: 'controllerModel', label: '기존 컨트롤러 제조사·모델', type: 'text', required: false,
      placeholder: '예) LG 시스템에어컨 AC Ez / 없으면 비워두세요' },
    { name: 'network', label: '센터 인터넷·Wi-Fi 환경', type: 'select', required: true,
      options: ['공유기 Wi-Fi 사용중', '유선 인터넷만 있음', '인터넷 없음', '모름'] },
    { name: 'doorsLite', label: '출입문 형태 (참고)', type: 'select', required: false,
      options: ['자동문(슬라이딩)', '여닫이문', '유리문(강화도어)', '기타'],
      hint: '출입제어는 별도 서비스라 참고용으로만 받습니다. (선택)' },
    POWER_FIELD,
    ...CONTACT_FIELDS,
  ],
};

/** 상담신청 기본 CTA — 설치형은 '신청'이 아니라 '상담신청'임을 문구로 분명히 한다 */
export const INSTALL_APPLY_CTA = '도입 상담신청하기';

export const DEFAULT_CANCEL_REASON =
  '현장 실사 결과 기존 설비 구조상 표준 시공이 어려워 신청건이 취소되었어요. 자세한 내용은 담당자에게 문의해 주세요.';
