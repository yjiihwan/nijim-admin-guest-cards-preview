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
| `REJECTED` | 미신청으로 접어 표시 | 재신청 가능(= `NONE`과 동일) |

> `REJECTED`를 별도 칩으로 노출할지는 **형/기획 판단 필요**. 현재 디자인 SPEC은 칩 3종만 정의했고, 프론트는 `NONE`으로 접어 재신청을 허용하도록 구현해 뒀습니다.

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
