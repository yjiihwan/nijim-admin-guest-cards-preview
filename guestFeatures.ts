/**
 * Guest mode 기능 카드 정적 정의 (카피 SSOT = COPY_REWRITE.md 2026-07-22 확정본)
 * 상태(status)·관리화면 URL은 API에서 내려받아 병합한다. API_SPEC.md 참조.
 */

export type GuestFeatureKey =
  | 'website'
  | 'offline_payment'
  | 'online_ads'
  | 'subscription'
  | 'access_control'
  | 'norder'
  | 'iot_control';

/** 백엔드가 내려주는 신청 상태. REJECTED는 UI상 NONE(재신청 가능)으로 접는다. */
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
    title: '전용 웹사이트',
    benefitHtml: '우리 센터 홈페이지를 <em>제작비 0원</em>으로',
    desc: '페이지를 자유롭게 만들어 광고·홍보에 바로 쓰고, 온라인 쇼핑몰처럼 멤버십 상품까지 판매할 수 있어요.',
    image: '01_website.png',
    cta: {
      none: '전용 웹사이트 개설신청하기',
      pending: PENDING_CTA,
      approved: '웹사이트 관리하러 가기',
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
    key: 'online_ads',
    title: '온라인광고',
    benefitHtml: '니짐내짐 앱에서 <em>우리 센터가 검색</em>되게',
    desc: '센터 소개 정보를 입력해 신청하고 승인되면, 바로 앱에 우리 센터 정보가 노출돼요.',
    image: '03_ads.png',
    cta: {
      none: '온라인광고 신청하기',
      pending: PENDING_CTA,
      approved: '광고 관리하러 가기',
    },
    manageUrl: '/admin/ads',
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
    benefitHtml: '조명·냉난방을 앱에서 끄고, <em>전기요금을 줄입니다</em>',
    desc: '조명·냉난방·환기 등 설비를 앱에서 원격으로 켜고 끌 수 있어요. 시간대별 자동 스케줄을 걸어두면 사람이 없는 시간에 알아서 꺼져, 무인 운영과 전기요금 절감이 동시에 가능합니다.',
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
  return recommended ? 'fill' : 'line';
}

export function chipLabel(status: GuestFeatureStatus): string {
  if (status === 'APPROVED') return '승인완료 · 사용중';
  if (status === 'PENDING') return '신청됨 · 검토중';
  return '미신청';
}

export function chipClass(status: GuestFeatureStatus): string {
  if (status === 'APPROVED') return 's-approved';
  if (status === 'PENDING') return 's-pending';
  return 's-none';
}

export function ctaLabel(def: GuestFeatureDef, status: GuestFeatureStatus): string {
  if (status === 'APPROVED') return def.cta.approved;
  if (status === 'PENDING') return def.cta.pending;
  return def.cta.none;
}

/** 홀수 장일 때만 마지막 카드를 풀폭으로. 8장이 되면 자동으로 2열 복귀 */
export function isWide(index: number, total: number, def: GuestFeatureDef): boolean {
  return Boolean(def.wide) && total % 2 === 1 && index === total - 1;
}
