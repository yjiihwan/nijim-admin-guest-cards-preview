# 니짐내짐 어드민 — Guest mode 기능 신청 카드 (미리보기 / STAGING)

⚠️ 이 저장소는 **UI 미리보기 전용**입니다. 실서비스 어드민(ngym.co.kr)이 아닙니다.

- 공개 미리보기(main): https://yjiihwan.github.io/nijim-admin-guest-cards-preview/ — 09-27부터 아래 N 오더 반영본과 같은 내용. **07-30 인계본 원본은 태그 `handover-0730-original`**
- N 오더 식당 연계 개선본(09-27, 브랜치 `norder-restaurant-link`): https://yjiihwan.github.io/nijim-admin-norder-preview/ — 추가 파일 `assets/norder-feature.css·js`, `img/11_norder_restaurant.jpg`
- 구현 소스(드롭인 패키지): `GuestModeCards.tsx` / `guestFeatures.ts` / `guest-mode-cards.css`
- API 규격 제안: `API_SPEC.md`

상단 버튼으로 카드 상태(미신청 / 검토중 / 승인완료)를 토글해 볼 수 있습니다. 단 **N 오더는 미사용 / 사용중 2개뿐**입니다.

## 2026-09-27 변경 — N 오더 운영팀 승인 폐지
- 센터가 «N 오더 바로 시작하기»를 누르면 **바로 사용중**. 검토중·반려 없음, **최고관리자 승인 목록에 들어가지 않음**
- 식당 입점 심사는 그대로. 다른 기능(홍보·결제·구독·1일권·출입제어·IoT)의 승인 흐름은 변경 없음
- 무엇을·왜·파일별 변경 → `CHANGELOG.md` · API → `API_SPEC.md` §6
- 07-30 인계본 원본은 git 태그 `handover-0730-original` 로 보존
