# Guest mode 기능 신청 상태 API — 신설 제안 스펙

**작성: 개발봇 | 2026-07-23 | 대상: 니짐내짐 사장님 어드민 (ngym.co.kr)**

## 0. 왜 신설 제안인가 (백엔드 필드 존재 여부 확인 결과)

design봇 요청 ②·⑥에 따라 기존 백엔드 필드/신청 플로우 존재 여부를 확인하려 했으나,
**니짐내짐 어드민의 소스코드·API 문서·DB 스키마가 우리 접근 범위 안에 없습니다.**

확인한 범위 (전부 부재):
- `gh repo list yjiihwan` — 어드민 저장소 없음 (nijim-homepage / franchise_app / blogstudio / sally / grillbox-* 7개뿐)
- 로컬 워크스페이스 전체 grep(`Guest mode`, `비대면결제`, `도입신청하기`) — design봇 산출물 3파일 외 히트 0
- 니짐내짐 관련 우리 자산은 **정적 홈페이지(`brands/nijim/site`)뿐**

따라서 아래는 **"있는지 확인한 결과 없다"가 아니라, "확인 불가 → 이 스펙으로 신설/대조 요청"** 입니다.
어드민을 운영하는 개발사에 아래 표를 그대로 전달해 **① 동일 기능 필드가 이미 있는지 ② 없으면 이 스펙대로 추가 가능한지** 회신받으면 프론트는 즉시 붙일 수 있습니다.

---

## 1. 조회 — 기능별 신청 상태

```
GET /api/admin/centers/{centerId}/guest-features
Authorization: (기존 어드민 세션)
```

```jsonc
{
  "features": [
    {
      "key": "offline_payment",       // enum, 아래 §3
      "status": "PENDING",            // NONE | PENDING | APPROVED | REJECTED
      "appliedAt": "2026-07-20T04:12:00Z",  // nullable
      "approvedAt": null,                    // nullable
      "rejectedReason": null,                // nullable, REJECTED일 때만
      "manageUrl": "/admin/payment"          // nullable. APPROVED CTA 라우팅 목적지
    }
  ]
}
```

- 응답에 없는 key는 프론트가 `NONE`으로 간주합니다(신규 기능 추가 시 백엔드 배포 순서 무관하게 안전).
- `manageUrl`이 null이면 프론트 정적 정의(`guestFeatures.ts`의 `manageUrl`)로 폴백합니다.

### 상태 → UI 매핑 (프론트 확정)

| status | 상태 칩 | CTA |
|---|---|---|
| `NONE` | 미신청(회색) | 추천=채움 `#D4004E` / 일반=아웃라인. 클릭 → 신청 모달 |
| `PENDING` | 신청됨 · 검토중(스카이) | **비활성(`disabled`)** — 중복 신청 차단 |
| `APPROVED` | 승인완료 · 사용중(그린) | tint 버튼. 클릭 → `manageUrl` 라우팅(신청 모달 아님) |
| `REJECTED` | '반려됨' 칩(적색) + 카드에 `rejectedReason` 사유 박스 노출 | '다시 신청하기' CTA로 재신청 가능(모달에 사유 재표시 권장) |

> (2026-07-28 확정) `REJECTED`는 별도 칩 '반려됨' + `rejectedReason` 사유 노출 + 재신청 허용으로 구현 완료. `rejectedReason`이 null이면 프론트 기본 문구(DEFAULT_REJECT_REASON) 폴백.

## 2. 신청 — 도입 신청 접수

```
POST /api/admin/centers/{centerId}/guest-features/{key}/apply
Content-Type: application/json

{ "memo": "…", "contact": "010-0000-0000" }   // 기능별 신청 폼 필드(선택)
```

응답: `201` + §1과 동일한 단건 객체(`status: "PENDING"`).

**서버측 필수 가드 (프론트 비활성만으로는 부족)**
- 이미 `PENDING` 또는 `APPROVED`인 key에 재신청 시 `409 Conflict`
- 응답 바디 `{ "code": "ALREADY_APPLIED", "status": "PENDING" }` → 프론트가 최신 상태로 리렌더

## 3. 기능 key enum (7종)

| key | 카드 | 신청 플로우 기존 존재 추정 |
|---|---|---|
| `website` | 전용 웹사이트 | 기존 화면에 신청 버튼 있었음 |
| `offline_payment` | 비대면결제 (QR·웹·앱) | 〃 |
| `online_ads` | 온라인광고 | 〃 |
| `subscription` | 월 정기결제 구독멤버십 | 〃 |
| `access_control` | 무인 출입제어 시스템 | 〃 |
| `norder` | N 오더 | 〃 |
| `iot_control` | **IoT 원격자동제어 (신규)** | **❓ 백엔드 처리 플로우 존재 여부 확인 필요 (요청 ⑥)** |

### ⑥ IoT 카드 관련 — 백엔드에 확인해야 할 항목

1. `iot_control` 신청을 접수할 엔드포인트/관리자 승인 화면이 있는가?
2. 없다면 **v1은 카드만 노출하고 CTA를 "도입 문의하기"(상담 접수 폼/채널톡)로 연결**하는 대안을 권장합니다 — 승인 파이프라인 없이 신청만 받으면 `PENDING`에서 영원히 멈춥니다.
3. 승인 후 `manageUrl`이 가리킬 IoT 제어판 화면의 존재 여부·경로.

**형 판단 대기 항목**: 위 2번(신청 접수 vs 문의 연결) 중 어느 쪽으로 갈지.

## 4. 프론트가 이미 대응해 둔 것

- 상태 미확보(API 미구현) 상황에서도 **전 카드 `NONE`으로 정상 렌더** — API 없이도 배포 가능
- `PENDING` CTA는 `disabled` + `aria-disabled` 이중 처리
- `APPROVED` CTA는 `onNavigate(manageUrl)` 경로로만 분기 (신청 모달 호출 불가)

---

# 5. 설치형 서비스 다단계 파이프라인 (2026-07-29 신설)

**대상 2종만**: `access_control`(무인 출입제어) · `iot_control`(IoT 원격자동제어)
**나머지 5종**(`website`/`offline_payment`/`online_ads`/`subscription`/`norder`)은 §1~§4의 3상태 로직을 그대로 씁니다. 변경 없음.

## 5.0 왜 분리했나

이 2종은 최고관리자 승인만으로 즉시 쓸 수 있는 구조가 아닙니다.
SaaS와 호환되는 기기를 센터에 **설치·시공 완료한 뒤 사용승인**까지 나야 동작합니다.
설치·시공 범위는 센터 평수 / 출입문 형태·개수 / 사용 중인 전자기기 종류·개수 / 전력구조 등
현장 상황에 따라 천차만별이라 **규격화·자동 비대면 제공이 불가능**합니다.

실제 제공 순서:
`담당자가 신청 내용 확인 → 센터에 직접 연락해 현장 파악 → 견적 협의 → 기기 설치·시공 → 최고관리자 사용승인`

그래서 기존 `status` 필드와 **분리된 `flow` 필드**로 모델링합니다.
(`status`는 기존 화면·집계 호환을 위해 유지하고, `flow`에서 파생시킵니다 — §5.2)

## 5.1 flow enum (9종)

| flow | 의미 | 센터 화면 칩 | 센터 CTA |
|---|---|---|---|
| `NONE` | 미신청 | 미신청(회색) | **도입 상담신청하기** (채움) → 상담신청서 모달 |
| `APPLIED` | 신청서 접수 · 검토중 | 신청접수 · 검토중(스카이) | 비활성 |
| `CONSULT` | 상담 · 현장실사 대기 (접수승인 직후) | 상담·현장실사 대기(스카이) | 비활성 (담당자·방문예정일 안내) |
| `QUOTED` | 견적 확정, 센터 확인 대기 | 견적 도착 · 확인 필요(핑크) | **견적서 확인하기** → 견적 모달(수락/보류) |
| `INSTALLING` | 설치 · 시공 진행중 | 설치·시공 진행중(스카이) | 비활성 (진행상태·완료예정일 안내) |
| `INSTALLED` | 시공완료 · 최종 사용승인 대기 | 시공완료 · 승인 대기(스카이) | 비활성 |
| `ACTIVE` | 최종승인 완료 · 사용중 | 승인완료 · 사용중(그린) | 기존 approved 문구 → `manageUrl` 라우팅 |
| `REJECTED` | 2단계(접수 검토) 반려 | 반려됨(적색) + `rejectedReason` 박스 | 다시 신청하기 |
| `CANCELED` | 상담완료 후 신청건 취소 | 신청 취소됨(회색) + `canceledReason` 박스 | 다시 상담신청하기 |

**카드 내부 6단계 스텝퍼**: `APPLIED → CONSULT → QUOTED → INSTALLING → INSTALLED → ACTIVE`
(지난 단계 = 체크, 현재 단계 = 핑크 강조, 남은 단계 = 흐림. `NONE`/`CANCELED`는 전체 흐림, `REJECTED`는 1단계만 적색)

## 5.2 status ↔ flow 파생 규칙 (기존 집계 호환)

```
flow=ACTIVE            → status=APPROVED
flow=REJECTED          → status=REJECTED
flow=APPLIED           → status=PENDING
flow=CONSULT|QUOTED|INSTALLING|INSTALLED → status=PENDING  (관리자 콘솔에서는 'INSTALL' 버킷으로 분리 표시)
flow=CANCELED          → status=REJECTED  (또는 별도 CANCELED 버킷)
flow=NONE              → status=NONE
```

> 프론트는 `flow`가 없으면(`null`/미구현) 기존 `status` 3상태 렌더로 **안전하게 폴백**합니다. 백엔드 배포 순서 무관.

## 5.3 조회 — §1 응답 확장

```jsonc
{
  "features": [ /* §1 그대로 — 5종 */ ],
  "installFeatures": [
    {
      "key": "access_control",              // access_control | iot_control
      "flow": "QUOTED",
      "stageSince": "2026-07-26T02:00:00Z", // 현재 단계 진입 시각. 관리자 SLA 계산용
      "appliedAt": "2026-07-18T04:12:00Z",
      "consultDone": true,                  // CONSULT 단계에서 실사 결과까지 저장됐는가
      "consult": {
        "manager": "설치기술팀 박준호",
        "visitDate": "2026-07-24",
        "callMemo": "…",
        "surveyResult": "…"
      },
      "quote": {
        "lines": [ { "name": "스마트 도어락 컨트롤러", "qty": 2, "unitPrice": 280000 } ],
        "subtotal": 1630000,                // Σ qty*unitPrice
        "vat": 163000,                      // floor(subtotal * 0.1)
        "total": 1793000,
        "leadTime": "2~3일",
        "validUntil": "2026-08-12",
        "issuedAt": "2026-07-26T02:00:00Z"
      },
      "progress": { "note": "배선 작업 완료 · 도어 컨트롤러 설치중", "dueDate": "2026-07-31" },
      "rejectedReason": null,
      "canceledReason": null,
      "manageUrl": "/admin/access"
    }
  ]
}
```

- `subtotal`/`vat`/`total`은 **서버가 계산해 내려주는 값이 정본**입니다. 프론트는 `quoteTotals()`로 동일 계산해 표기 불일치를 검증합니다(VAT = `floor(subtotal * 0.1)`, 원 단위 절사).
- 단계별 객체는 해당 단계 이전이면 `null`로 내려도 됩니다.

## 5.4 신청 — 상담신청서 접수

```
POST /api/admin/centers/{centerId}/guest-features/{key}/install-apply
Content-Type: application/json
```

두 기능의 문항이 서로 다릅니다. 스키마 정본 = `guestFeatures.ts`의 `INSTALL_SURVEY_FORMS`.

**공통 필수**: `area`(평수+단위 ㎡/평) · `floor`(층수 + 엘리베이터 유무) · `power`(단상/삼상/모름 + 계약전력 kW) ·
`preferredPeriod`(희망 시공 시기) · `managerName` · `managerPhone` / **선택**: `etc`(추가 요청사항)

| key | 기능별 문항 |
|---|---|
| `access_control` | `doors` **필수** — 출입문 형태(자동문·여닫이·유리문·스피드게이트·기타) 다중선택 + 형태별 개수<br>`devices` **필수** — 사용 중인 전자기기(조명·냉난방·환기·급탕·CCTV·기존 출입통제) 다중선택 + 개수 |
| `iot_control` | `targetDevices` **필수** — 제어 대상 기기 다중선택 + **기기별 수량 + 제어방식**(스마트플러그/릴레이 결선/적외선(IR)/기존 컨트롤러 연동/모름)<br>`controller` **필수** — 기존 통합 컨트롤러 유무(있음/없음/모름) · `controllerModel` 선택<br>`network` **필수** — 인터넷·Wi-Fi 환경<br>`doorsLite` **선택** — 출입문 형태(참고용 단일선택, 비중 낮음) |

응답: `201` + §5.3 단건 객체 (`flow: "APPLIED"`).
**서버 가드**: 이미 `APPLIED`~`ACTIVE` 사이인 key에 재신청 시 `409 { "code":"ALREADY_APPLIED", "flow":"…" }`.
`REJECTED`·`CANCELED`에서는 재신청 허용.

## 5.5 단계 전이 엔드포인트

### 센터(사장님)가 호출

| 전이 | 엔드포인트 | 바디 | 결과 |
|---|---|---|---|
| 견적 수락 | `POST …/{key}/quote/accept` | — | `QUOTED → INSTALLING` |
| 견적 보류·문의 | `POST …/{key}/quote/hold` | `{ "memo": "…" }` | 단계 유지(`QUOTED`), 담당자에게 알림 |

### 최고관리자가 호출 (관리자 권한 필수)

| # | 전이 | 엔드포인트 | 바디 | 결과 |
|---|---|---|---|---|
| ① | 접수승인 | `POST /api/superadmin/install-apps/{appId}/intake` | — | `APPLIED → CONSULT` |
| ① | 반려 | `POST /api/superadmin/install-apps/{appId}/reject` | `{ "reason": "…" }` **필수** | `APPLIED → REJECTED` |
| ② | 담당자 배정·상담기록 | `POST …/{appId}/consult` | `{ "manager", "visitDate", "callMemo", "surveyResult"? }`<br>앞 3개 필수 | `CONSULT` 유지. `surveyResult`가 있으면 `consultDone=true` |
| ③ | 견적 입력·발송 | `POST …/{appId}/quote` | `{ "lines":[{name,qty,unitPrice}], "leadTime", "validUntil" }` | `CONSULT(consultDone) → QUOTED`. 재발송 시 `QUOTED → QUOTED` |
| ③ | 신청건 취소 | `POST …/{appId}/cancel` | `{ "reason": "…" }` **필수** | `CONSULT|QUOTED → CANCELED` |
| ④ | 진행상태 업데이트 | `PATCH …/{appId}/progress` | `{ "note", "dueDate" }` | `INSTALLING` 유지 |
| ④ | 시공완료 처리 | `POST …/{appId}/install-complete` | — | `INSTALLING → INSTALLED` |
| ⑤ | 최종 사용승인 | `POST …/{appId}/activate` | — | `INSTALLED → ACTIVE` (+ `manageUrl` 개방) |

**서버측 가드**: 각 전이는 **출발 단계가 정확히 일치할 때만** 허용. 불일치 시 `409 { "code":"INVALID_TRANSITION", "flow":"<현재>" }`.
전이 시 `stageSince`를 갱신합니다.

## 5.6 관리자 콘솔 SLA

`stageSince` 기준 경과일이 아래를 넘으면 목록에서 강조합니다.

| 단계 | SLA | 라벨 |
|---|---|---|
| `APPLIED` | 3일 | 접수 검토 |
| `CONSULT` | 3일 | 상담 대기 |
| `QUOTED` | 7일 | 견적 발송 후 무응답 |
| `INSTALLING` | 14일 | 시공 진행 |
| `INSTALLED` | 3일 | 최종 승인 대기 |

**일괄 처리 제외**: 설치형 2종은 단계별 판단이 필요해 일괄 승인·반려 대상에서 제외합니다. 선택에 섞여 있으면 제외 건수를 안내하고 나머지만 처리합니다.

## 5.7 프론트 대응 현황

- `guestFeatures.ts` — `InstallFlow` / `INSTALL_FLOW_STEPS` / `flowChipLabel`·`flowChipClass`·`flowCtaLabel`·`flowCtaVariant` / `quoteTotals` / `INSTALL_SURVEY_FORMS` 정의 완료
- `GuestModeCards.tsx` — `installStates` prop + 6단계 스텝퍼 + 단계별 안내 박스 + `onApplySurvey`/`onOpenQuote` 콜백 구현 완료
- `guest-mode-cards.css` — `.gm-steps`/`.gm-step`/`.gm-note`/`.gm-chip.s-quoted`/`.gm-chip.s-canceled` 추가 (기존 팔레트 내)
- **`installStates` 미전달 시 전 카드 `flow: 'NONE'`으로 정상 렌더** → API 미구현 상태에서도 배포 가능
