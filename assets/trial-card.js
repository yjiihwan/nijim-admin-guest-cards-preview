/* ===== 체험권 이벤트 카드 — Guest mode(index)·센터 홈(member) 공용 렌더러 (2026-10-20) =====
   목적: 앱 홈 «지금 체험권 이벤트 중인 센터» 칸에 내 센터가 노출된다는 걸 혜택으로 보여 주고, 센터 상태에 맞는 다음 행동 1개로 보낸다.
   10-20 형 시정: 화면 파일이 아니라 «센터 상태»로 카드가 갈린다. «입점» 표현 금지 → 실서버 용어 «온라인광고».
     실서버 Guest mode 카드 이름 «온라인광고», 버튼 «온라인광고 신청하기», 설명 «…신청한 뒤 승인되면 바로 앱에 내센터 정보가 노출됩니다»(07-22 형 캡처).
     앱 노출은 온라인광고 진행 센터만. 센터 관리 기능만 쓰는 센터가 «이미 앱에 뜬다»고 오해하지 않게 A 상태 문구에 그대로 적는다.
   상태(TRIAL_STATE)
     AD_OFF        (A) 온라인광고 미진행(관리 기능만·게스트 포함)      → [온라인광고 신청하기]  = 실서버 온라인광고 신청 흐름
     AD_ON_NONE    (B) 온라인광고 진행 중 + 운영 중인 체험권 없음      → [체험권 열기]          = 체험권 이벤트 등록 화면
     AD_ON_ACTIVE  (C) 온라인광고 진행 중 + 체험권 운영 중(앱 노출 중) → 현황 + [체험권 관리하러 가기]
     AD_ON_SOLDOUT (C 예외) 체험권은 있으나 남은 수량 0 → 앱 칸에서 빠짐(앱 규칙 T4) — 현황 + [체험권 관리하러 가기]
   앱 노출 조건·문구 정본: 홈 추천 꾸러미 v6.1 RULES.md T1·T4 / 관리자 입력칸 = 체험권 이벤트 폼(혜택 문구 15자·이벤트 기간·대표 사진).
   ⛔ 쓰지 않는 것: «입점», 지어낸 효과 수치(«신규 회원 n배» 등), 할인율. 현황 숫자는 목업 예시값. */

const TRIAL_CARD = {
  key:'trial_event',
  title:'체험권 이벤트',
  section:'지금 체험권 이벤트 중인 센터',   // 앱 홈 칸 제목 그대로(SPEC.md)
  image:'12_trial_event_section.jpg',
  url:{
    adApply:'(실서버 «온라인광고 신청하기»와 같은 신청 흐름)',
    trialNew:'/admin/trial-event/new',      // 가칭 — 실제 체험권 이벤트 등록 화면 경로는 개발 확인
    trialManage:'/admin/trial-event',       // 가칭
  },
  /* 목업 현황 — 실제로는 센터의 운영 중 체험권 1건(앱에 나가는 것과 같은 1장, 규칙 T2) 값 */
  demo:{benefit:'1일 무료 체험', start:'10.13', end:'10.23', dday:3, applied:23, total:30, left:7},   // 썸네일 앱 캡처(1일 무료 체험·D-3)와 맞춤
};

const TC_ICON = {
  ad:'<svg viewBox="0 0 24 24" fill="none" stroke="#D4004E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h3l6 4V6L7 10z"/><path d="M16.5 9.5a3.5 3.5 0 010 5M19 7a7 7 0 010 10"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="none" stroke="#D4004E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M9.5 12l2 2 3.5-4"/></svg>',
  ticket:'<svg viewBox="0 0 24 24" fill="none" stroke="#D4004E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5V6.5h17v2a2.5 2.5 0 000 5v2h-17v-2a2.5 2.5 0 000-5z"/><path d="M14 7v10" stroke-dasharray="2 2"/></svg>',
};

/* 썸네일 아래 캡처 설명 — 상태마다 뜻이 달라 이미지에 글자를 넣지 않고 여기서 바꾼다.
   A·B에서 «내 센터가 보여요»라고 쓰면 아직 앱에 안 뜨는 센터가 오해한다(10-20 형 시정 ③) */
const TC_CAP = {
  AD_OFF:'앱 홈 체험권 칸 — 온라인광고를 진행하는 센터만 이 테두리 자리에 보여요',
  AD_ON_NONE:'앱 홈 체험권 칸 — 체험권을 열면 우리 센터가 이 테두리 자리에 보여요',
  AD_ON_ACTIVE:'앱 홈 체험권 칸 — 지금 우리 센터가 보이는 자리예요(예시 화면)',
  AD_ON_SOLDOUT:'앱 홈 체험권 칸 — 수량을 채우면 우리 센터가 다시 이 자리에 보여요',
};
const tcHead = (chip, ben, desc, state) => `<div class="gm-chd"><h3>${TRIAL_CARD.title}</h3>${chip}</div>
  <p class="gm-ben">${ben}</p>
  <p class="gm-desc">${desc}</p>
  <div class="gm-thumb"><img src="img/${TRIAL_CARD.image}" alt="니짐내짐 앱 홈 «${TRIAL_CARD.section}» 칸 예시 화면"></div>
  <p class="tc-cap">${TC_CAP[state]}</p>`;

const tcSec = (n, h, body) => `<div class="nf-sec"><h4><span class="nf-n">${n}</span>${h}</h4>${body}</div>`;

/* 앱에 보이는 조건 3가지 — B·C에서 «무엇이 채워졌고 무엇이 남았는지» 체크로 보여준다 */
function tcConditions(done){
  const items = [
    {t:'온라인광고 진행 중', p:'앱에 센터가 보이는 건 온라인광고를 진행 중인 센터뿐이에요.'},
    {t:'체험권 이벤트 등록', p:'혜택 문구(15자까지)와 이벤트 기간을 넣어요. 대표 사진은 선택이에요.'},
    {t:'기간 안 · 남은 수량 있음', p:'종료일이 지나거나 남은 수량이 0이 되면 앱 칸에서 자동으로 빠져요.'},
  ];
  return `<ul class="tc-cond">${items.map((it,i)=>`<li class="${done[i]?'is-done':''}">
      <i aria-hidden="true">${done[i]?'✓':i+1}</i><div><b>${it.t}</b><p>${it.p}</p></div>
      <span class="tc-st">${done[i]?'완료':'필요'}</span></li>`).join('')}</ul>`;
}

function trialCard(state){
  const d = TRIAL_CARD, x = d.demo;
  const sec = `«${d.section}»`;
  if(state==='AD_OFF'){
    const chip = '<span class="gm-chip s-none"><span class="gm-dot"></span>온라인광고 미진행 · 앱 미노출</span>';
    return `<article class="gm-card is-wide is-norder is-trial" data-key="${d.key}" data-state="${state}">
      ${tcHead(chip,
        `온라인광고를 진행하면 앱 ${sec} 칸에 <em>내 센터가 노출돼요</em>`,
        '니짐내짐 앱에 센터가 보이는 건 온라인광고를 진행 중인 센터뿐이에요. 지금은 온라인광고를 진행하지 않아 체험권을 열어도 앱에는 우리 센터가 보이지 않아요.', state)}
      ${tcSec(1,'앱 체험권 칸에 오르기까지',`<div class="nf-flow">
        <div class="nf-step"><span class="nf-ic">${TC_ICON.ad}</span><b><small>01</small>온라인광고 신청</b>
          <p>센터 소개 정보를 입력하고 온라인광고를 신청해요.</p></div>
        <span class="nf-arr" aria-hidden="true">→</span>
        <div class="nf-step"><span class="nf-ic">${TC_ICON.ok}</span><b><small>02</small>승인되면 앱에 노출</b>
          <p>승인되면 바로 앱에 우리 센터 정보가 노출돼요.</p></div>
        <span class="nf-arr" aria-hidden="true">→</span>
        <div class="nf-step"><span class="nf-ic">${TC_ICON.ticket}</span><b><small>03</small>체험권 열기</b>
          <p>체험권을 열면 앱 홈 체험권 칸에 가까운 순으로 보여요.</p></div>
      </div>
      <div class="gm-note is-muted" style="margin-top:12px"><b>센터 관리 기능은 그대로</b>· 온라인광고를 하지 않아도 회원 관리 같은 센터 관리 기능은 지금처럼 쓰실 수 있어요.</div>`)}
      <div class="gm-spacer"></div>
      <button type="button" class="gm-cta v-fill tc-act" data-act="adApply">온라인광고 신청하기</button>
    </article>`;
  }
  if(state==='AD_ON_NONE'){
    const chip = '<span class="gm-chip s-none"><span class="gm-dot"></span>체험권 미운영</span>';
    return `<article class="gm-card is-wide is-norder is-trial" data-key="${d.key}" data-state="${state}">
      ${tcHead(chip,
        `체험권을 열면 앱 ${sec} 칸에 <em>내 센터가 노출돼요</em>`,
        '온라인광고를 진행 중이라 체험권만 열면 바로 앱 홈 첫 추천 칸에 올라가요. 가까운 순으로 보여서, 근처에서 운동할 곳을 찾는 고객이 우리 센터를 먼저 만나요.', state)}
      ${tcSec(1,'앱에 보이는 조건', tcConditions([true,false,false]))}
      <div class="gm-spacer"></div>
      <button type="button" class="gm-cta v-fill tc-act" data-act="trialNew">체험권 열기</button>
    </article>`;
  }
  const sold = state==='AD_ON_SOLDOUT';
  const left = sold ? 0 : x.left, applied = sold ? x.total : x.applied;
  const chip = sold
    ? '<span class="gm-chip s-rejected"><span class="gm-dot"></span>매진 · 앱 노출 멈춤</span>'
    : '<span class="gm-chip s-approved"><span class="gm-dot"></span>앱 노출 중</span>';
  const ben = sold ? `남은 수량이 0이라 앱 ${sec} 칸에서 <em>잠시 빠졌어요</em>`
    : `앱 ${sec} 칸에 <em>우리 센터가 노출 중이에요</em>`;
  const desc = sold ? '수량을 늘리거나 새 체험권 이벤트를 열면 다시 칸에 올라가요.'
    : '체험권이 다 나가거나 종료일이 지나면 앱 칸에서 자동으로 빠져요.';
  return `<article class="gm-card is-wide is-norder is-trial" data-key="${d.key}" data-state="${state}">
    ${tcHead(chip, ben, desc, state)}
    ${tcSec(1,'지금 운영 중인 체험권',`<div class="tc-now"><b>${x.benefit}</b><span>${x.start} ~ ${x.end}</span>${sold?'':`<span class="tc-dd">D-${x.dday}</span>`}</div>
      <div class="tc-kpi">
        <div><span>신청</span><b>${applied}<small>건</small></b></div>
        <div class="${sold?'is-zero':''}"><span>남은 수량</span><b>${left}<small>장</small></b><em>총 ${x.total}장</em></div>
        <div><span>마감</span><b>${x.end}<small>까지</small></b>${sold?'':`<em>${x.dday}일 남음</em>`}</div>
      </div>`)}
    <div class="gm-spacer"></div>
    <button type="button" class="gm-cta ${sold?'v-fill':'v-done'} tc-act" data-act="trialManage">체험권 관리하러 가기</button>
  </article>`;
}

/* 이동 안내 — 목업이라 실제 이동 대신 토스트(norder-feature.js의 nfToast 재사용) */
function bindTrialCard(){
  document.querySelectorAll('.gm-card.is-trial .tc-act').forEach(b=>{
    b.addEventListener('click',()=>{
      const u = TRIAL_CARD.url;
      if(b.dataset.act==='adApply') return nfToast('[라우팅] 온라인광고 신청으로 이동', u.adApply);
      if(b.dataset.act==='trialNew') return nfToast('[라우팅] 체험권 이벤트 등록 화면으로 이동', u.trialNew);
      nfToast('[라우팅] 체험권 이벤트 관리 화면으로 이동', u.trialManage);
    });
  });
}

/* 미리보기 상태 전환 줄 — ?trial=A|B|C|C0 로도 바로 열 수 있다 */
const TRIAL_STATES = [['AD_OFF','A 온라인광고 미진행','A'],['AD_ON_NONE','B 광고 중 · 체험권 없음','B'],
  ['AD_ON_ACTIVE','C 광고 중 · 체험권 운영 중','C'],['AD_ON_SOLDOUT','C 예외 · 매진','C0']];
function trialInitState(def){
  const q = new URLSearchParams(location.search).get('trial');
  const hit = TRIAL_STATES.find(s=>s[2]===q);
  return hit ? hit[0] : def;
}
function trialSwitchHtml(cur){
  return `<span class="cap">체험권 카드 · 센터 상태</span>${TRIAL_STATES.map(([k,l])=>
    `<button type="button" data-trial="${k}" class="${k===cur?'on':''}">${l}</button>`).join('')}`;
}
