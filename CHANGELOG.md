# 변경 이력 (외부 개발자용)

## 2026-09-27 — N 오더: 운영팀 승인 없이 바로 사용

**무엇을**: N 오더(`norder`)를 «신청 → 운영팀 검토 → 승인» 기능에서 «누르면 바로 사용» 기능으로 바꿨습니다.
상태가 3개(신청·검토중·승인, +반려)에서 **2개(미사용·사용중)** 로 줄었고, 최고관리자 승인 목록에 N 오더가 들어가지 않습니다.

**왜**: N 오더 운영 규칙이 바뀌었습니다(N 오더 테스트서버 `6ebca53` 기준).
- 센터가 N 오더를 누르면 바로 사용중 — 운영팀 검토·승인 없음
- 제휴는 받는 쪽(센터 또는 식당)이 수락하면 바로 시작 — 운영팀 승인 없음
- **식당 입점 심사는 그대로**입니다. 없앤 것은 제휴·사용에 대한 운영팀 승인뿐입니다

**그대로인 것**: 온라인 홍보·비대면결제·구독멤버십·1일권의 신청→승인 흐름, 무인 출입제어·IoT 원격제어의 설치형 단계(신청접수→상담→견적→시공→사용승인).

### 파일별 변경

| 파일 | 변경 |
|---|---|
| `guestFeatures.ts` | 즉시형 정의 추가 — `INSTANT_FEATURE_KEYS=['norder']`, `InstantFeatureStatus='NONE'\|'ACTIVE'`, `toInstantStatus`(옛 값 호환), `instantChipLabel`(미사용/사용중)·`instantChipClass`·`instantCtaLabel`·`instantCtaVariant`. `norder.cta.pending` 삭제(`cta.pending`은 선택 항목으로), `norder.cta.none` «N 오더 이용시작하기» → «N 오더 바로 시작하기» |
| `GuestModeCards.tsx` | N 오더 전용 분기 — 칩 미사용/사용중, «누르면 바로 시작» 안내, 비활성 버튼·반려 사유 없음. `onActivate` prop 추가(미지정 시 `onApply` 폴백). 상단 안내에 «(N 오더는 검토 없이 바로 시작)» |
| `API_SPEC.md` | §6 신설 — `POST …/guest-features/norder/activate`(멱등, 승인 목록에 행 만들지 않음). §1·§2·§3·§5의 N 오더 표기 정리(`apply`로 들어오면 400) |
| `admin.html`(최고관리자 미리보기) | 승인 목록 대상(`SIMPLE_FEATS`)과 기능 필터(`FEATS`)에서 N 오더 삭제 → 목데이터에도 N 오더 신청 건이 생기지 않음 |
| `member.html` + `assets/norder-feature.js`(입점 센터 미리보기) | «N 오더 바로 시작하기» 한 버튼, 누르면 즉시 사용중. 검토중·영업일·승인 전 잠금·반려 블록 삭제(09-27 앞선 커밋 `4b455dd`) |

### 원본 보존
- 07-30 인계본 원본: git 태그 **`handover-0730-original`** (`4a130f8`) — `git checkout handover-0730-original`
- 이번 정리 직전 N 오더 미리보기: 태그 `norder-preview-before-noapproval-spec` (`4b455dd`)

### 옮길 때 확인할 것
- 서버에 옛 N 오더 `PENDING`(검토중) 건이 있으면 `ACTIVE`로 바꿀지 `NONE`으로 되돌릴지 정해서 한 번 정리해야 합니다
- 최고관리자 콘솔 서버 쿼리(승인 대기 목록)에서 `norder`를 빼 주세요
