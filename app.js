/* ===== ChildLife App Logic ===== */

// ---------- Data ----------
const transactions = [
  { name:"R. Karthik", disease:"Congenital Heart Disease", amount:1000, date:"15 Jul 2025", hosp:"Apollo Hospital", status:"success", color:"#e53935" },
  { name:"M. Sneha", disease:"Kidney Disease", amount:500, date:"14 Jul 2025", hosp:"Fortis Hospital", status:"success", color:"#e53935" },
  { name:"V. Arjun", disease:"Thalassemia Major", amount:750, date:"13 Jul 2025", hosp:"AIIMS Delhi", status:"pending", color:"#f57c00" },
  { name:"P. Nandhini", disease:"Liver Disorder", amount:2000, date:"12 Jul 2025", hosp:"Medanta Hospital", status:"success", color:"#e53935" },
  { name:"K. Harish", disease:"Blood Cancer", amount:1500, date:"11 Jul 2025", hosp:"Tata Memorial", status:"success", color:"#e53935" },
  { name:"A. Divya", disease:"Brain Tumor", amount:1200, date:"10 Jul 2025", hosp:"NIMHANS", status:"pending", color:"#f57c00" },
  { name:"S. Rahul", disease:"Lung Disease", amount:800, date:"09 Jul 2025", hosp:"KIMS Hospital", status:"success", color:"#e53935" },
  { name:"R. Meena", disease:"Eye Disorder", amount:600, date:"08 Jul 2025", hosp:"Sankara Nethralaya", status:"success", color:"#e53935" },
];

const cases = [
  { name:"R. Karthik", disease:"Congenital Heart Disease", hosp:"Apollo Hospital", raised:250000, goal:500000, days:12, emoji:"👦" },
  { name:"M. Sneha", disease:"Kidney Disease", hosp:"Fortis Hospital", raised:180000, goal:300000, days:8, emoji:"👧" },
  { name:"V. Arjun", disease:"Thalassemia Major", hosp:"AIIMS Delhi", raised:120000, goal:250000, days:15, emoji:"👦" },
  { name:"P. Nandhini", disease:"Liver Disorder", hosp:"Medanta Hospital", raised:200000, goal:400000, days:10, emoji:"👧" },
  { name:"K. Harish", disease:"Blood Cancer", hosp:"Tata Memorial", raised:350000, goal:800000, days:20, emoji:"👦" },
  { name:"A. Divya", disease:"Brain Tumor", hosp:"NIMHANS", raised:90000, goal:600000, days:18, emoji:"👧" },
];

const diseases = [
  { name:"Congenital Heart Disease", icon:"❤️", color:"#e53935" },
  { name:"Thalassemia", icon:"🩸", color:"#c62828" },
  { name:"Leukemia", icon:"🎗️", color:"#ef5350" },
  { name:"Kidney Disease", icon:"🫘", color:"#ab47bc" },
  { name:"Liver Disease", icon:"🫀", color:"#ff7043" },
  { name:"Brain Tumor", icon:"🧠", color:"#5c6bc0" },
  { name:"Lung Disease", icon:"🫁", color:"#26a69a" },
  { name:"Blood Disorders", icon:"💧", color:"#ec407a" },
  { name:"Eye Disorders", icon:"👁️", color:"#ffa726" },
];

const history = [
  { name:"R. Karthik", disease:"Congenital Heart Disease", date:"12 Jul 2025", amount:250000, status:"approved", age:"8 Years", gender:"Male", treatment:"Heart Surgery", dept:"Cardiology" },
  { name:"M. Sneha", disease:"Kidney Disease", date:"10 Jul 2025", amount:180000, status:"pending", age:"6 Years", gender:"Female", treatment:"Kidney Transplant", dept:"Nephrology" },
  { name:"V. Sharma", disease:"Thalassemia Major", date:"08 Jul 2025", amount:120000, status:"approved", age:"10 Years", gender:"Male", treatment:"Blood Transfusion", dept:"Hematology" },
  { name:"P. Nandhini", disease:"Liver Disease", date:"05 Jul 2025", amount:200000, status:"rejected", age:"5 Years", gender:"Female", treatment:"Liver Transplant", dept:"Hepatology" },
];

// ---------- Navigation ----------
function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  window.scrollTo(0,0);
  el.querySelector('.page-body, .home-content, .hosp-content, .detail-body, .login-body')?.scrollTo(0,0);
  renderNav(id);
}

// ---------- Bottom Nav configs ----------
const navConfigs = {
  'donor-home':       { items:[{i:'🏠',l:'Home',a:true},{i:'🧒',l:'Cases',go:'donor-cases'},{i:'💸',l:'Transactions',go:'donor-dashboard',center:true},{i:'🔍',l:'Search',go:'donor-search'},{i:'👤',l:'Profile',go:'donor-profile'}] },
  'donor-dashboard':  { items:[{i:'🏠',l:'Home',go:'donor-home'},{i:'🧒',l:'Cases',go:'donor-cases'},{i:'💸',l:'Transactions',go:'donor-dashboard',center:true,a:true},{i:'🔍',l:'Search',go:'donor-search'},{i:'👤',l:'Profile',go:'donor-profile'}] },
  'donor-profile':    { items:[{i:'🏠',l:'Home',go:'donor-home'},{i:'🧒',l:'Cases',go:'donor-cases'},{i:'💸',l:'Transactions',go:'donor-dashboard',center:true},{i:'🔍',l:'Search',go:'donor-search'},{i:'👤',l:'Profile',go:'donor-profile',a:true}] },
  'donor-cases':      { items:[{i:'🏠',l:'Home',go:'donor-home'},{i:'🧒',l:'Cases',go:'donor-cases',a:true},{i:'💸',l:'Transactions',go:'donor-dashboard',center:true},{i:'🔍',l:'Search',go:'donor-search'},{i:'👤',l:'Profile',go:'donor-profile'}] },
  'donor-search':     { items:[{i:'🏠',l:'Home',go:'donor-home'},{i:'🧒',l:'Cases',go:'donor-cases'},{i:'💸',l:'Transactions',go:'donor-dashboard',center:true},{i:'🔍',l:'Search',go:'donor-search',a:true},{i:'👤',l:'Profile',go:'donor-profile'}] },
  'hosp-home':        { items:[{i:'🏠',l:'Home',a:true},{i:'📝',l:'Register',go:'hosp-register',center:true},{i:'🏥',l:'Profile',go:'hosp-profile'}] },
  'hosp-register':    { items:[{i:'🏠',l:'Home',go:'hosp-home'},{i:'📝',l:'Register',go:'hosp-register',center:true,a:true},{i:'🏥',l:'Profile',go:'hosp-profile'}] },
  'hosp-profile':     { items:[{i:'🏠',l:'Home',go:'hosp-home'},{i:'📝',l:'Register',go:'hosp-register',center:true},{i:'🏥',l:'Profile',go:'hosp-profile',a:true}] },
  'hosp-case-detail': { items:[{i:'🏠',l:'Home',go:'hosp-home'},{i:'📝',l:'Register',go:'hosp-register',center:true},{i:'🏥',l:'Profile',go:'hosp-profile',a:true}] },
};

function renderNav(screenId){
  const cfg = navConfigs[screenId];
  const holderId = {
    'donor-home':'nav-donor-home','donor-dashboard':'nav-donor-dashboard','donor-profile':'nav-donor-profile',
    'donor-cases':'nav-donor-cases','donor-search':'nav-donor-search',
    'hosp-home':'nav-hosp-home','hosp-register':'nav-hosp-register','hosp-profile':'nav-hosp-profile','hosp-case-detail':'nav-hosp-detail'
  }[screenId];
  const holder = document.getElementById(holderId);
  if(!holder) return;
  if(!cfg){ holder.innerHTML=''; return; }
  let html='<div class="bottom-nav">';
  cfg.items.forEach((it,idx)=>{
    const isCenter = idx===Math.floor(cfg.items.length/2) && cfg.items.length===5;
    const cls = 'nav-item'+(it.a?' active':'')+(it.center?' center':'');
    const click = it.go ? `onclick="go('${it.go}')"` : '';
    html += `<div class="${cls}" ${click}><span class="nav-icon">${it.i}</span><span>${it.l}</span></div>`;
  });
  html += '</div>';
  holder.innerHTML = html;
}

// ---------- Render Transactions ----------
function fmt(n){ return '₹ '+n.toLocaleString('en-IN'); }
function initials(n){ return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }

function renderTxn(list){
  const c = document.getElementById('txn-list');
  if(!list.length){ c.innerHTML='<div class="empty-state"><div class="es-icon">🔍</div>No transactions found</div>'; return; }
  c.innerHTML = list.map(t=>`
    <div class="txn-card">
      <div class="txn-avatar" style="background:${t.color}">${initials(t.name)}</div>
      <div class="txn-info">
        <div class="name">${t.name}</div>
        <div class="disease">${t.disease}</div>
        <div class="meta">${t.hosp} · ${t.date}</div>
      </div>
      <div class="txn-right">
        <div class="amount">${fmt(t.amount)}</div>
        <span class="badge ${t.status}">${t.status==='success'?'Successful':'Pending'}</span>
      </div>
    </div>`).join('');
}

function filterTxn(){
  const q = document.getElementById('txn-search').value.toLowerCase();
  const f = transactions.filter(t=> t.name.toLowerCase().includes(q) || t.disease.toLowerCase().includes(q) || t.hosp.toLowerCase().includes(q));
  renderTxn(f);
}

// ---------- Render Cases ----------
let currentDisease = 'All';
function renderCases(list){
  const c = document.getElementById('cases-list');
  if(!list.length){ c.innerHTML='<div class="empty-state"><div class="es-icon">🧒</div>No cases found</div>'; return; }
  c.innerHTML = list.map(c=>{
    const pct = Math.round(c.raised/c.goal*100);
    return `
    <div class="case-card">
      <div class="case-card-top">
        <div class="case-photo">${c.emoji}</div>
        <div class="case-details">
          <div class="cname">${c.name}</div>
          <div class="cdisease">${c.disease}</div>
          <div class="chosp">🏥 ${c.hosp}</div>
        </div>
      </div>
      <div class="case-progress">
        <div class="amt-row"><span class="raised">${fmt(c.raised)}</span><span class="goal">of ${fmt(c.goal)}</span></div>
        <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
      </div>
      <div class="case-card-bottom">
        <div class="days">⏳ <b>${c.days} Days</b> Left</div>
        <button class="btn-donate" onclick="donate('${c.name}')">❤️ Donate Now</button>
      </div>
    </div>`;
  }).join('');
}

function filterByDisease(el, d){
  document.querySelectorAll('#donor-cases .pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  currentDisease = d;
  applyCaseFilter();
}
function filterCases(v){
  applyCaseFilter(v);
}
function applyCaseFilter(nameQ=''){
  const nq = nameQ.toLowerCase();
  let f = cases;
  if(currentDisease!=='All'){
    f = f.filter(c=> c.disease.toLowerCase().includes(currentDisease.toLowerCase()));
  }
  if(nq) f = f.filter(c=> c.name.toLowerCase().includes(nq));
  renderCases(f);
}
function donate(name){ alert('❤️ Donation flow for '+name+' would open here'); }

// ---------- Render Disease Grid + Search ----------
function renderDiseaseGrid(){
  document.getElementById('disease-grid').innerHTML = diseases.map(d=>`
    <div class="disease-cell" onclick="pickDisease('${d.name}')">
      <div class="d-icon" style="background:${d.color}">${d.icon}</div>
      <div class="d-name">${d.name}</div>
    </div>`).join('');
}

function renderRecentSearches(){
  const recents = ['Congenital Heart Disease','Apollo Hospital','Kidney Disease'];
  document.getElementById('recent-searches').innerHTML = recents.map(r=>`
    <div class="search-result" onclick="pickDisease('${r}')">
      <div class="sr-photo">🕐</div>
      <div class="sr-info"><div class="sr-name">${r}</div><div class="sr-meta">Searched recently</div></div>
      <span style="color:var(--red);font-size:18px;">›</span>
    </div>`).join('');
}

function pickDisease(name){
  document.getElementById('disease-search').value = name;
  runSearch();
}

function runSearch(){
  const q = document.getElementById('disease-search').value.toLowerCase().trim();
  const def = document.getElementById('search-default');
  const res = document.getElementById('search-results');
  if(!q){ def.style.display='block'; res.style.display='none'; return; }
  def.style.display='none'; res.style.display='block';
  const f = cases.filter(c=> c.disease.toLowerCase().includes(q) || c.hosp.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  const list = document.getElementById('search-results-list');
  if(!f.length){ list.innerHTML='<div class="empty-state"><div class="es-icon">🔍</div>No matching cases found</div>'; return; }
  list.innerHTML = f.map(c=>`
    <div class="search-result">
      <div class="sr-photo">${c.emoji}</div>
      <div class="sr-info"><div class="sr-name">${c.name}</div><div class="sr-meta">${c.disease} · ${c.hosp}</div></div>
      <button class="btn-donate sm" onclick="donate('${c.name}')">Donate</button>
    </div>`).join('');
}

// ---------- Render Hospital History ----------
function renderHistory(){
  const c = document.getElementById('history-list');
  c.innerHTML = history.map((h,i)=>`
    <div class="history-card" onclick="openCaseDetail(${i})">
      <div class="hc-top">
        <div><div class="hc-name">${h.name}</div><div class="hc-disease">${h.disease}</div></div>
        <span class="badge ${h.status}">${h.status==='approved'?'Approved':h.status==='pending'?'Pending':'Rejected'}</span>
      </div>
      <div class="hc-bottom">
        <div class="hc-date">📅 Reg. Date: ${h.date}</div>
        <div class="hc-amount">${fmt(h.amount)}</div>
      </div>
    </div>`).join('');
}

function openCaseDetail(i){
  const h = history[i];
  document.getElementById('cd-name').textContent = h.name;
  document.getElementById('cd-pname').textContent = h.name;
  document.getElementById('cd-disease').textContent = h.disease;
  document.getElementById('cd-cost').textContent = fmt(h.amount);
  document.getElementById('cd-date').textContent = 'Reg. Date: '+h.date;
  document.getElementById('cd-agegender').textContent = h.age+' / '+h.gender;
  document.getElementById('cd-treatment').textContent = h.treatment;
  document.getElementById('cd-dept').textContent = h.dept;
  const st = h.status==='approved'?'Approved':h.status==='pending'?'Pending':'Rejected';
  document.getElementById('cd-status').textContent = st;
  document.getElementById('cd-status2').textContent = st;
  go('hosp-case-detail');
}

// ---------- Wizard ----------
function goStep(n){
  for(let i=1;i<=3;i++){ document.getElementById('wizard-'+i).style.display='none'; }
  document.getElementById('wizard-'+n).style.display='block';
  for(let i=1;i<=3;i++){
    const s=document.getElementById('ws'+i);
    s.classList.remove('active','done');
    if(i<n) s.classList.add('done');
    if(i===n) s.classList.add('active');
  }
  const names = {1:'Patient Details',2:'Treatment Details',3:'Review & Submit'};
  document.getElementById('step-num').textContent = n;
  document.getElementById('step-name').textContent = names[n];
  if(n===3) fillReview();
}

function fillReview(){
  const name = document.getElementById('p-name').value || 'R. Karthik';
  const age = document.getElementById('p-age').value || '8';
  const gender = document.getElementById('p-gender').value;
  const cond = document.getElementById('p-condition').value || '-';
  const treat = document.getElementById('p-treatment').value || '-';
  const cost = document.getElementById('p-cost').value || '0';
  const dept = document.getElementById('p-dept').value;
  const rem = document.getElementById('p-remarks').value || '-';
  document.getElementById('r-name').textContent = name;
  document.getElementById('r-agegender').textContent = age+' Years / '+gender;
  document.getElementById('r-disease').textContent = cond;
  document.getElementById('r-treatment').textContent = treat;
  document.getElementById('r-cost').textContent = '₹ '+Number(cost).toLocaleString('en-IN');
  document.getElementById('r-dept').textContent = dept;
  document.getElementById('r-remarks').textContent = rem;
}

function submitCase(){
  alert('✓ Case submitted successfully! It is now pending approval.');
  go('hosp-profile');
}

function toggleFilters(){ alert('Filter & sort options'); }

// ---------- Init ----------
function init(){
  renderTxn(transactions);
  renderCases(cases);
  renderDiseaseGrid();
  renderRecentSearches();
  renderHistory();
  renderNav('login-screen');
}
document.addEventListener('DOMContentLoaded', init);
