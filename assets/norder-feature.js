/* ===== N 오더 · 식당 연계 카드 — 게스트(index)·입점(member) 공용 렌더러 (2026-09-27) =====
   WHY 공용: 두 화면의 ①이해·②욕구 문구가 달라지면 안 된다. ③시작 블록만 화면별로 갈린다.
   용어·사실관계 정본 = 센터용 랜딩 enter-norder.html(#more 포함) + N오더 staging(~/norder_app) copy-*.ts.
   09-27 형: 센터 니즈 = «우리 센터 회원만 받는 제휴식당 할인 → 멤버십 가치». «앱을 열 이유» 같은 앱 사용 유도 문구 금지, 할인율 숫자 금지.
   09-27 형 시정: «센터가 얻는 것»엔 확정된 센터 이득만 — ①회원 전용 할인→멤버십 가치 ②재고 없는 부가수익 ③식당 신청·센터 승인 후 식사권만 올림·자동 정산. 식당 이득을 센터 이득처럼 쓰지 말 것.
   ⛔ 쓰지 않는 것: 수수료율·배달비·최소주문금액(확정값 없음), «N오더 미사용 센터 제휴신청»(dev 개발 중). */

const NORDER_FEATURE = {
  key:'norder',
  title:'N 오더 · 식당 연계',
  benefitHtml:'근처 제휴 식당 할인, <em>우리 센터 회원만</em>',
  desc:'근처 제휴 식당을 우리 센터 회원만 할인가로 이용하게 해요. 회원은 식당 계산대의 QR을 자기 폰으로 스캔해 사용하고, 식사권이 쓰일 때마다 판매 수수료가 센터 몫으로 정산돼요.',
  image:'11_norder_restaurant.jpg',
  cta:{none:'N 오더 이용시작하기',pending:'신청 검토중 · 평균 1~2영업일',approved:'N 오더 관리하러 가기'},
  manageUrl:'/admin/norder',
  /* 게스트 → 입점 신청으로 보냄. 실제 경로는 기존 어드민의 입점 신청 화면으로 연결(개발 확인). */
  joinUrl:'/admin/join',
  learnUrl:'https://yjiihwan.github.io/nijim-homepage/enter-norder.html',
};

const NF_ICON = {
  store:'<svg viewBox="0 0 24 24" fill="none" stroke="#D4004E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M9 7h6M9 11h6M9 15h3"/></svg>',
  qr:'<svg viewBox="0 0 24 24" fill="none" stroke="#D4004E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.5v2.5M20.5 14.5v0M14.5 20.5h6v-3"/></svg>',
  calc:'<svg viewBox="0 0 24 24" fill="none" stroke="#D4004E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2.5h9l3.5 3.5v15.5H6z"/><path d="M9 10h6M9 14h6M9 18h3"/></svg>',
};

/* 입점 센터 «바로 시작하기» — 라벨은 N오더 센터 관리자 메뉴 이름 그대로(copy-admin.ts M2.nav) */
const NF_START = [
  {k:'STEP 1',t:'식당 제휴',p:'관리자 «제휴»에서 식당 초대 링크를 만들어 근처 식당에 보내요. 식당이 가입해 심사를 통과하면 제휴 신청이 들어오고, 수락하면 제휴가 맺어져요.',
   btn:'제휴 메뉴 열기',menu:'제휴',url:'/admin/norder/restaurants'},
  {k:'STEP 2',t:'상품 등록',p:'식사권 이름·가격·사용 기간과 판매 수수료를 정해 등록해요. 보충제·음료 같은 일반상품도 같은 곳에서 등록해요.',
   btn:'상품 메뉴 열기',menu:'상품',url:'/admin/norder/products'},
  {k:'STEP 3',t:'판매',p:'식당이 조건을 승인하면 판매가 바로 시작돼 회원 앱에 보여요. 들어온 주문과 사용 내역은 «주문»에서 확인해요.',
   btn:'주문 메뉴 열기',menu:'주문',url:'/admin/norder/orders'},
];

function nfUnderstand(){
  return `<div class="nf-sec"><h4><span class="nf-n">1</span>이렇게 돌아가요</h4>
    <div class="nf-flow">
      <div class="nf-step"><span class="nf-ic">${NF_ICON.store}</span><b><small>01</small>회원 전용 판매</b>
        <p>제휴 식당의 할인 식사권을 센터 스토어에 올려요. 우리 센터 회원만 살 수 있어요.</p></div>
      <span class="nf-arr" aria-hidden="true">→</span>
      <div class="nf-step"><span class="nf-ic">${NF_ICON.qr}</span><b><small>02</small>회원이 QR로 사용</b>
        <p>식당 계산대에 붙은 QR을 회원이 자기 폰으로 스캔하면 끝. 식당 직원은 조작할 게 없어요.</p></div>
      <span class="nf-arr" aria-hidden="true">→</span>
      <div class="nf-step"><span class="nf-ic">${NF_ICON.calc}</span><b><small>03</small>정산은 자동</b>
        <p>사용된 식사권만 모아 월별 정산 명세가 자동으로 만들어져요.</p></div>
    </div></div>`;
}

function nfGain(){
  return `<div class="nf-sec"><h4><span class="nf-n">2</span>센터가 얻는 것</h4>
    <div class="nf-gain">
      <div class="nf-g"><b>새 매출</b><p>쌓아둘 재고 없이, 식사권이 쓰일 때마다 판매 수수료가 센터 몫으로 들어와요.</p></div>
      <div class="nf-g"><b>멤버십 가치 상승</b><p>다른 곳에선 받을 수 없는 제휴 식당 할인을 우리 센터 회원만 받아요. 회원 전용 혜택이 멤버십의 가치를 높여 줘요.</p></div>
      <div class="nf-g"><b>승인 한 번이면 시작</b><p>식당이 먼저 신청하고, 센터는 승인한 뒤 판매할 식사권만 올리면 돼요. 정산은 자동이에요.</p></div>
    </div></div>`;
}

const nfHead = (chip) => `<div class="gm-chd"><h3>${NORDER_FEATURE.title}</h3>${chip}</div>
  <p class="gm-ben">${NORDER_FEATURE.benefitHtml}</p>
  <p class="gm-desc">${NORDER_FEATURE.desc}</p>
  <div class="gm-thumb"><img src="img/${NORDER_FEATURE.image}" alt="회원이 식당 계산대의 QR을 폰으로 스캔하는 모습"></div>`;

/* 게스트(미입점) — 신청 상태와 무관하게 «입점하면 사용 가능». 버튼은 입점 신청 + 자세히 보기 */
function norderGuestCard(){
  const d = NORDER_FEATURE;
  const chip = '<span class="gm-chip s-member"><span class="gm-dot"></span>입점 후 사용 가능</span>';
  return `<article class="gm-card is-wide is-norder" data-key="${d.key}">
    ${nfHead(chip)}
    ${nfUnderstand()}
    ${nfGain()}
    <div class="nf-sec"><h4><span class="nf-n">3</span>시작하려면</h4>
      <div class="gm-note"><b>입점하면 바로 쓸 수 있어요</b>· N 오더는 니짐내짐에 입점한 센터가 쓰는 기능이에요. 입점을 마치면 입점 센터 홈에서 식당 제휴 → 상품 등록 → 판매 순서로 바로 시작할 수 있어요.</div>
      <div class="nf-cta2">
        <button type="button" class="gm-cta v-fill nf-act" data-act="join">입점 신청하기</button>
        <a class="gm-cta v-line" href="${d.learnUrl}" target="_blank" rel="noopener">N 오더 식당 연계 자세히 보기</a>
      </div>
    </div>
  </article>`;
}

/* 입점 센터 — 기존 3상태(NONE·PENDING·APPROVED·REJECTED) 로직 유지.
   승인 전에는 3단계 버튼을 잠그고, 카드 하단 CTA(신청)는 기존 그대로 둔다. */
function norderMemberCard(st, rejectReason){
  const d = NORDER_FEATURE;
  const ok = st==='APPROVED';
  const chip = `<span class="gm-chip ${chipClass(st)}"><span class="gm-dot"></span>${chipLabel(st)}</span>`;
  const steps = NF_START.map((s,i)=>`<div class="nf-s"><span class="nf-k">${s.k}</span><b>${s.t}</b><p>${s.p}</p>
      <button type="button" class="nf-go nf-act" data-act="menu" data-i="${i}" ${ok?'':'disabled aria-disabled="true"'}>${s.btn}</button></div>`).join('');
  const note = ok ? ''
    : st==='REJECTED' ? `<div class="gm-reject"><b>반려 사유</b>· ${rejectReason}</div>`
    : st==='PENDING' ? '<div class="gm-note"><b>검토중</b>· 사용 승인이 나면 아래 3단계 버튼이 열려요. 지금은 따로 하실 일이 없어요.</div>'
    : '<div class="gm-note is-muted"><b>먼저 이용 신청</b>· 아래 버튼으로 N 오더 이용을 신청하고 승인되면, 3단계 버튼으로 바로 시작할 수 있어요.</div>';
  const v = ok ? 'done' : st==='PENDING' ? 'wait' : 'fill';
  const label = ok ? d.cta.approved : st==='PENDING' ? d.cta.pending : st==='REJECTED' ? '다시 신청하기' : d.cta.none;
  return `<article class="gm-card is-wide is-norder" data-key="${d.key}">
    ${nfHead(chip)}
    ${nfUnderstand()}
    ${nfGain()}
    <div class="nf-sec"><h4><span class="nf-n">3</span>바로 시작하기 — 3단계</h4>
      ${note}
      <div class="nf-start"${note?' style="margin-top:10px"':''}>${steps}</div>
    </div>
    <div class="gm-spacer"></div>
    <button type="button" class="gm-cta v-${v} nf-act" data-act="main" data-status="${st}"
      ${st==='PENDING'?'disabled aria-disabled="true"':''}>${label}</button>
  </article>`;
}

/* 이동 안내 — 목업이라 실제 이동 대신 목적지를 토스트 + 로그로 보여준다 */
let nfTimer;
function nfToast(main, sub){
  let t = document.getElementById('nfToast');
  if(!t){ t = document.createElement('div'); t.id='nfToast'; t.className='nf-toast'; t.setAttribute('role','status'); document.body.appendChild(t); }
  t.innerHTML = `${main}${sub?`<small>${sub}</small>`:''}`;
  t.classList.add('show');
  clearTimeout(nfTimer); nfTimer = setTimeout(()=>t.classList.remove('show'), 2600);
  const log = document.getElementById('log'); if(log) log.textContent = `${main}${sub?' — '+sub:''}`;
}

function bindNorderCard(){
  document.querySelectorAll('.gm-card.is-norder .nf-act').forEach(b=>{
    b.addEventListener('click',()=>{
      const act = b.dataset.act;
      if(act==='join') return nfToast('[라우팅] 입점 신청 화면으로 이동', NORDER_FEATURE.joinUrl);
      if(act==='menu'){ const s = NF_START[+b.dataset.i];
        return nfToast(`[라우팅] N 오더 관리자 «${s.menu}» 메뉴로 이동`, s.url); }
      const st = b.dataset.status;
      if(st==='PENDING') return nfToast('검토중 — 클릭 무시됨(중복 신청 차단)');
      if(st==='APPROVED') return nfToast('[라우팅] N 오더 관리자 대시보드로 이동', NORDER_FEATURE.manageUrl);
      nfToast(st==='REJECTED' ? '[신청 모달] N 오더 재신청 폼 열기 (반려 사유 안내 포함)' : '[신청 모달] N 오더 이용 신청 폼 열기');
    });
  });
}
