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
      none: '비대면결제 시작하기',
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
      none: '구독멤버십 판매 시작하기',
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
 * 설치·시공한 뒤 사용승인까지 나야 동작한다. 설치·시공 규모는 출입문 형태·전자기기
 * 구성·전력구조에 따라 천차만별이라 비대면 자동 제공이 불가능하고,
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
  { flow: 'CONSULT', label: '현장확인', short: '현장' },
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
    case 'APPLIED': return '접수 완료 · 검토중';
    case 'CONSULT': return '상담·현장 확인 예정';
    case 'QUOTED': return '견적 도착 · 확인해 주세요';
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
  /**
   * 관리자가 보낸 사진 추가 요청. 반려가 아니라 단계를 유지한 채 재촬영만 요청한 상태이므로
   * flow는 그대로 두고 이 필드만 채워 내려준다. 센터가 사진을 다시 올리면 null로 되돌린다.
   */
  photoRequest?: { slots: string[]; memo: string; requestedAt?: string } | null;
  /** 슬롯별 첨부 사진 URL (관리자 콘솔 갤러리·견적 판단 근거) */
  photos?: Record<string, string[]> | null;
  manageUrl?: string | null;
}

/* ── 상담용 신청서 폼 스키마 (2026-07-29 전면 재설계) ────────────────────
 * 설계 원칙: 센터 사장님은 전기·설비 비전문가다.
 *   → 본인이 확실히 아는 것(층·연락처·원하는 기기)만 묻는다.
 *   → 나머지 판단 근거(출입문 형태, 잠금 방식, 전력 구조, 기존 컨트롤러, 배선)는
 *     전부 현장 사진으로 받아 전문가가 보고 결정한다.
 *   → 폼 어디에도 전문용어를 노출하지 않는다. 대상을 가리켜야 하면 눈에 보이는
 *     생김새로 설명한다(예: '차단기 스위치가 여러 개 들어있는 하얀 박스').
 * 폐지된 문항: doors / devices / power / controller / controllerModel / network / doorsLite
 *              area(센터 평수) / 엘리베이터 유무 — 2026-07-29 2차 정리
 * ---------------------------------------------------------------------- */

export type SurveyFieldType =
  | 'text'
  | 'tel'
  | 'radio'
  | 'select'
  | 'checkbox-qty'  // 체크박스 + 수량 (+ '기타' 자유입력)
  | 'photos'        // 슬롯형 현장 사진 업로드
  | 'textarea';

export interface SurveyField {
  name: string;
  label: string;
  type: SurveyFieldType;
  required?: boolean;
  hint?: string;
  options?: string[];
  /** checkbox-qty 전용 — 이 옵션명을 고르면 기기 이름을 직접 입력받는다 */
  other?: string;
  otherPlaceholder?: string;
  /** photos 전용 — 슬롯 정의 */
  slots?: PhotoSlot[];
  placeholder?: string;
}

/* ── 현장 사진 슬롯 ────────────────────────────────────────────────────── */

export interface PhotoSlot {
  /** 업로드 필드 키 (API 멀티파트 파트명 = `photos[<key>][]`) */
  key: string;
  /** 슬롯 제목 */
  title: string;
  /** 촬영 가이드 한 줄 — 도식 일러스트와 함께 노출 */
  guide: string;
  /** 도식 일러스트 id (프론트 인라인 SVG 키) */
  art: string;
  /** 항상 필수 */
  required?: boolean;
  /** 여러 장 첨부 가능 */
  multi?: boolean;
  /**
   * 조건부 필수 — 지정한 체크박스 문항의 i번째 옵션이 선택되면 필수로 승격된다.
   * 예: targetDevices[1]('냉난방기') 선택 → hvac 슬롯 필수
   */
  reqIf?: { cb: string; i: number };
}

/** 슬롯당 최대 장수 (multi가 아니면 1장) */
export const PHOTO_MAX_PER_SLOT = 5;
/** 파일 1장당 최대 용량 (byte) */
export const PHOTO_MAX_BYTES = 15 * 1024 * 1024;
/** 허용 MIME */
export const PHOTO_ACCEPT = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];

export const INSTALL_PHOTO_SLOTS: Record<InstallFeatureKey, PhotoSlot[]> = {
  access_control: [
    { key: 'doorFront', art: 'doorFront', title: '출입문 정면', required: true,
      guide: '문 전체가 다 나오게, 2~3걸음 뒤에서 찍어주세요.' },
    { key: 'doorLock', art: 'doorHandle', title: '문손잡이·잠금장치 근접', required: true,
      guide: '지금 문을 어떻게 잠그는지 보이게 가까이 찍어주세요.' },
    { key: 'doorSurround', art: 'doorWall', title: '문 주변 벽·천장', required: true,
      guide: '문 옆 벽과 위쪽 천장이 보이게. 콘센트나 기존 카드 찍는 기계가 있으면 같이 나오게 찍어주세요.' },
    { key: 'counterView', art: 'counterView', title: '카운터에서 출입문 쪽', required: true,
      guide: '데스크에 서서 문을 바라보고 한 장 찍어주세요.' },
    { key: 'otherDoors', art: 'otherDoor', title: '그 외 잠그고 싶은 문', required: false, multi: true,
      guide: '샤워실·탈의실처럼 따로 통제하고 싶은 문이 있으면 찍어주세요. 여러 장 올려도 돼요.' },
  ],
  iot_control: [
    { key: 'roomWide', art: 'roomWide', title: '실내 전경', required: true,
      guide: '제어하고 싶은 기기들이 한눈에 보이게 넓게 찍어주세요.' },
    { key: 'hvac', art: 'aircon', title: '에어컨·히터', required: false, reqIf: { cb: 'targetDevices', i: 1 },
      guide: '실내기 본체와 리모컨을 같이 찍어주세요. 냉난방을 고르시면 꼭 필요해요.' },
    { key: 'lightSwitch', art: 'lightSwitch', title: '조명 스위치 벽면', required: true,
      guide: '스위치 판 전체가 나오게 정면에서 찍어주세요.' },
    { key: 'breaker', art: 'breaker', title: '차단기 박스', required: true,
      guide: '차단기 스위치가 여러 개 들어있는 하얀 박스예요. 문을 열고 안이 보이게 한 장. 보통 출입구나 창고 벽 위쪽에 있어요.' },
    { key: 'existingPanel', art: 'panel', title: '이미 쓰고 있는 제어기·조작 패널', required: false, multi: true,
      guide: '벽에 붙은 온도조절기나 통합 리모컨 같은 게 있으면 찍어주세요.' },
  ],
};

/** 제출 시점의 필수 슬롯 계산 (reqIf 승격 포함) */
export function requiredPhotoSlots(
  key: InstallFeatureKey,
  checked: Record<string, number[]> = {},
): PhotoSlot[] {
  return INSTALL_PHOTO_SLOTS[key].filter(
    (s) => s.required || (s.reqIf ? (checked[s.reqIf.cb] ?? []).includes(s.reqIf.i) : false),
  );
}

const CONTACT_FIELDS: SurveyField[] = [
  { name: 'preferredPeriod', label: '희망 시공 시기', type: 'select', required: true,
    options: ['1개월 이내', '1~3개월 이내', '3개월 이후', '아직 미정 (상담 후 결정)'] },
  { name: 'managerName', label: '현장 담당자 이름', type: 'text', required: true, placeholder: '예) 김민수' },
  { name: 'managerPhone', label: '현장 담당자 연락처', type: 'tel', required: true, placeholder: '010-0000-0000' },
  { name: 'etc', label: '추가 요청사항', type: 'textarea', required: false,
    placeholder: '현장 상황 중 미리 알려주실 내용이 있으면 적어주세요. (선택)' },
];

const FLOOR_FIELD: SurveyField = {
  name: 'floor', label: '층수', type: 'text', required: true, placeholder: '예) 지상 3층',
};

/** 사진 문항 — 두 기능 모두 폼 최상단. 이 신청서의 주인공이다. */
const photoField = (key: InstallFeatureKey): SurveyField => ({
  name: 'photos', label: '현장 사진', type: 'photos', required: true,
  slots: INSTALL_PHOTO_SLOTS[key],
  hint: '사진을 보고 전문가가 필요한 장비와 시공 방법을 정해드려요. 스마트폰으로 찍은 사진이면 충분해요.',
});

export const INSTALL_SURVEY_FORMS: Record<InstallFeatureKey, SurveyField[]> = {
  access_control: [
    photoField('access_control'),
    FLOOR_FIELD,
    ...CONTACT_FIELDS,
  ],
  iot_control: [
    photoField('iot_control'),
    // 제어 방식(스마트플러그/릴레이/IR)은 사장님이 판단할 수 없다 → 사진 보고 전문가가 정한다
    // '기타'는 반드시 배열 맨 뒤 — hvac 슬롯 reqIf가 인덱스 1(냉난방기)을 참조한다
    { name: 'targetDevices', label: '원격으로 켜고 끄고 싶은 기기', type: 'checkbox-qty', required: true,
      options: ['조명', '냉난방기(에어컨·히터)', '환기설비', '급탕·온수', '제습·가습기', '음향설비', '간판·사인', '기타'],
      other: '기타', otherPlaceholder: '어떤 기기인지 적어주세요 (예: 제빙기)',
      hint: '제어하고 싶은 기기를 고르고 개수만 적어주세요. 어떤 방식으로 연결할지는 사진을 보고 전문가가 정해드려요.' },
    FLOOR_FIELD,
    ...CONTACT_FIELDS,
  ],
};

/** 상담신청 기본 CTA — 설치형은 '신청'이 아니라 '상담신청'임을 문구로 분명히 한다 */
export const INSTALL_APPLY_CTA = '도입 상담신청하기';

export const DEFAULT_CANCEL_REASON =
  '현장 실사 결과 기존 설비 구조상 표준 시공이 어려워 신청건이 취소되었어요. 자세한 내용은 담당자에게 문의해 주세요.';
