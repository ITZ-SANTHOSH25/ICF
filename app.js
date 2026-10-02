/* ============================================================
   LIFELINK — Application engine
   Donor · Hospital · Health Authority dashboards + workflow
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     UTILITIES
     ============================================================ */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const money = n => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pct = (a, b) => Math.min(100, Math.round((a / (b || 1)) * 100));
  const today = () => new Date().toISOString().slice(0, 10);
  const initials = n => String(n || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const uid = p => p + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  const daysBetween = d => Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 864e5));

  const STATUS = {
    pending:   { label: 'Pending Verification', cls: 'pending' },
    approved:  { label: 'Verified / Approved',  cls: 'approved' },
    declined:  { label: 'Declined',             cls: 'declined' },
    active:    { label: 'Active Treatment',     cls: 'active' },
    completed: { label: 'Completed',            cls: 'completed' }
  };
  const EMERG = { High: 'emergency-high', Medium: 'emergency-medium', Low: 'emergency-low' };

  /* ============================================================
     ICONS
     ============================================================ */
  const sv = (p) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ICON = {
    dashboard: sv('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    cases: sv('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>'),
    heart: sv('<path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 12 6.5 5.5 5.5 0 0 0 2 8.5C2 12 6 15 12 20c6-5 7-6 7-6z"/>'),
    saved: sv('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'),
    user: sv('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
    gear: sv('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a1.7 1.7 0 0 0-1.6-1H1a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 3 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 3a1.7 1.7 0 0 0 1-1.6V1a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15 3a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 9v.1a1.7 1.7 0 0 0 1.6 1H23a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    clock: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    check: sv('<path d="M20 6L9 17l-5-5"/>'),
    x: sv('<path d="M18 6L6 18M6 6l12 12"/>'),
    plus: sv('<path d="M12 5v14M5 12h14"/>'),
    search: sv('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
    bell: sv('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'),
    menu: sv('<path d="M3 6h18M3 12h18M3 18h18"/>'),
    shield: sv('<path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z"/><path d="M12 9v4M10 11h4"/>'),
    hospital: sv('<path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-6h6v6"/><path d="M12 7v4M10 9h4"/>'),
    logout: sv('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>'),
    doc: sv('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'),
    money: sv('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>'),
    users: sv('<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/><path d="M17 5.5a3.5 3.5 0 0 1 0 7M22 20c0-2.5-1.5-4.2-4-5"/>'),
    activity: sv('<path d="M3 12h4l3 8 4-16 3 8h4"/>'),
    history: sv('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 8v4l3 2"/>')
  };

  /* ============================================================
     STATE
     No sample patient, hospital, donor, authority, funding or
     verification records are bundled in this frontend.
     ============================================================ */
  const KEY = 'lifelink_state_v4';
  const API_BASE = 'https://icf-backend-ca9x.onrender.com/api';

  const defaultState = () => ({
    role: null, page: null,
    cases: [],
    donor: { name:'', email:'', phone:'', location:'', donations:[], saved:[], notifications:[] },
    hospital: { name:'', id:'', email:'', doctor:'', address:'', contact:'' },
    authority: { name:'', id:'', officer:'', email:'' },
    filters: { q:'', condition:'', type:'', amount:'', duration:'', location:'', sort:'' },
    wizard: null,
    history: [],
    dashboard: null,
    notifications: [],
    settings: { notifications:'Enabled', privacy:'Show my name publicly' },
    meta: { conditions:[], types:[], locations:[] }
  });

  function loadUiState(){
    try {
      const raw = localStorage.getItem(KEY);
      const saved = raw ? JSON.parse(raw) : {};
      const base = defaultState();
      base.role = saved.role || null;
      base.page = saved.page || null;
      base.filters = Object.assign(base.filters, saved.filters || {});
      return base;
    } catch (_) {
      return defaultState();
    }
  }

  let state = loadUiState();

  function save(){
    try {
      localStorage.setItem(KEY, JSON.stringify({
        role: state.role,
        page: state.page,
        filters: state.filters
      }));
    } catch (_) {}
  }

  function token(){ return localStorage.getItem('lifelink_token') || ''; }

  async function api(path, options = {}){
    const headers = new Headers(options.headers || {});
    const isForm = options.body instanceof FormData;
    if (!isForm && options.body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    const t = token();
    if (t) headers.set('Authorization', 'Bearer ' + t);

    const response = await fetch(API_BASE + path, { ...options, headers });
    let body = null;
    try { body = await response.json(); } catch (_) {}
    if (!response.ok || body?.success === false) {
      const message = body?.error?.message || body?.message || `Request failed (${response.status})`;
      const err = new Error(message);
      err.status = response.status;
      throw err;
    }
    return body || {};
  }

  async function refreshUser(){
    const result = await api('/auth/me');
    const u = result.data.user;
    state.role = u.role;
    state.page = state.page || 'dashboard';

    if (u.role === 'donor') {
      state.donor = {
        ...state.donor,
        name:u.name || '', email:u.email || '', phone:u.phone || '', location:u.location || ''
      };
    } else if (u.role === 'hospital') {
      const h = u.hospital || {};
      state.hospital = {
        ...state.hospital,
        name:h.name || u.name || '', id:h.id || '', email:h.email || u.email || '',
        doctor:h.doctor || '', address:h.address || '', contact:h.contact || u.phone || ''
      };
    } else if (u.role === 'authority') {
      const a = u.authority || {};
      state.authority = {
        ...state.authority,
        name:a.name || u.name || '', id:a.id || '', officer:a.officer || u.name || '', email:a.email || u.email || ''
      };
    }
    save();
    return u;
  }

  async function loadRoleData(){
    if (!token() || !state.role) return;
    try {
      const [profile, settingsRes] = await Promise.all([
        api('/profile'),
        api('/profile/settings')
      ]);
      const u = profile.data.user;
      state.settings = settingsRes.data.settings || state.settings;
      if (u.role !== state.role) throw new Error('Account role mismatch.');

      if (state.role === 'donor') {
        const [casesRes, donationsRes, savedRes, notifRes, metaRes, dashRes] = await Promise.all([
          api('/cases'),
          api('/donations'),
          api('/saved'),
          api('/notifications'),
          api('/cases/meta'),
          api('/dashboard/donor')
        ]);
        state.cases = casesRes.data.cases || [];
        state.donor.donations = donationsRes.data.donations || [];
        state.donor.saved = savedRes.data.ids || [];
        state.notifications = notifRes.data.notifications || []; state.donor.notifications = state.notifications;
        state.meta = metaRes.data || state.meta;
        state.dashboard = dashRes.data || null;
      } else if (state.role === 'hospital') {
        const [casesRes, dashRes, notifRes] = await Promise.all([
          api('/cases'),
          api('/dashboard/hospital'),
          api('/notifications')
        ]);
        state.cases = casesRes.data.cases || [];
        state.dashboard = dashRes.data || null;
        state.notifications = notifRes.data.notifications || [];
      } else if (state.role === 'authority') {
        const [casesRes, historyRes, notifRes, dashRes] = await Promise.all([
          api('/cases?scope=all'),
          api('/history'),
          api('/notifications'),
          api('/dashboard/authority')
        ]);
        state.cases = casesRes.data.cases || [];
        state.history = historyRes.data.history || [];
        state.notifications = notifRes.data.notifications || []; state.donor.notifications = state.notifications;
        state.dashboard = dashRes.data || null;
      }

      save();
      render();
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('lifelink_token');
        state = defaultState();
        localStorage.removeItem(KEY);
        exit(false);
        toast('Session expired', 'Please log in again.', 'bad');
      } else {
        toast('Backend connection error', err.message, 'bad');
      }
    }
  }

  function getCase(id){ return state.cases.find(c => c.id === id); }
  const verifiedCases = () => state.cases.filter(c => ['approved','active','completed'].includes(c.status));

  // Expose a small API client for pages/components that need direct access.
  window.LifeLinkAPI = { base: API_BASE, request: api };

  /* ============================================================
     TOASTS + MODAL
     ============================================================ */
  function toast(title, msg, kind) {
    kind = kind || 'ok';
    const wrap = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast ' + kind;
    const sym = kind === 'ok' ? '✓' : kind === 'bad' ? '✕' : 'i';
    el.innerHTML = `<span class="ti">${sym}</span><span class="tt"><b>${esc(title)}</b>${esc(msg)}</span>`;
    wrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 450); }, 4200);
  }

  let modalEl = null;
  function openModal(html, opts) {
    closeModal();
    opts = opts || {};
    modalEl = document.createElement('div');
    modalEl.className = 'modal-wrap';
    modalEl.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(modalEl);
    requestAnimationFrame(() => modalEl.classList.add('open'));
    modalEl.addEventListener('click', e => { if (e.target === modalEl && !opts.locked) closeModal(); });
    return modalEl;
  }
  function closeModal(){ if (modalEl) { modalEl.remove(); modalEl = null; } }

  /* ============================================================
     NAV CONFIG
     ============================================================ */
  const NAV = {
    donor: [
      { id:'dashboard', label:'Dashboard', ic:'dashboard' },
      { id:'cases', label:'Treatment Cases', ic:'cases' },
      { id:'donations', label:'My Donations', ic:'heart' },
      { id:'saved', label:'Saved Cases', ic:'saved' },
      { id:'profile', label:'Profile', ic:'user' },
      { id:'settings', label:'Settings', ic:'gear' }
    ],
    hospital: [
      { id:'dashboard', label:'Dashboard', ic:'dashboard' },
      { id:'cases', label:'My Cases', ic:'cases' },
      { id:'register', label:'Register Case', ic:'plus' },
      { id:'settings', label:'Settings', ic:'gear' }
    ],
    authority: [
      { id:'dashboard', label:'Dashboard', ic:'dashboard' },
      { id:'pending', label:'Pending Cases', ic:'clock', count:() => state.cases.filter(c=>c.status==='pending').length },
      { id:'approved', label:'Approved Cases', ic:'check' },
      { id:'declined', label:'Declined Cases', ic:'x' },
      { id:'history', label:'Verification History', ic:'history' },
      { id:'settings', label:'Settings', ic:'gear' }
    ]
  };
  const ROLE_LABEL = { donor:'DONOR PORTAL', hospital:'HOSPITAL PORTAL', authority:'HEALTH AUTHORITY' };
  const ROLE_USER = {
    donor: () => ({ name: state.donor.name, sub: state.donor.email }),
    hospital: () => ({ name: state.hospital.name, sub: state.hospital.id }),
    authority: () => ({ name: state.authority.officer, sub: state.authority.id })
  };

  /* ============================================================
     SHELL
     ============================================================ */
  function shell(contentHTML, title, sub) {
    const role = state.role;
    const nav = NAV[role].map(n => {
      const count = n.count ? n.count() : 0;
      return `<button data-nav="${n.id}" class="${state.page===n.id?'active':''}">${ICON[n.ic]}<span>${n.label}</span>${count?`<span class="badge-count">${count}</span>`:''}</button>`;
    }).join('');
    const u = ROLE_USER[role]();
    return `
    <div class="app-shell">
      <aside class="app-side" id="appSide">
        <div class="app-brand"><span class="hud-cross"><span></span><span></span></span><b>LIFE<em>LINK</em></b></div>
        <span class="app-role">${ROLE_LABEL[role]}</span>
        <nav class="app-nav">${nav}</nav>
        <div class="app-side-foot">
          <div class="app-user">
            <span class="av">${initials(u.name)}</span>
            <span class="meta"><b>${esc(u.name)}</b><span>${esc(u.sub)}</span></span>
          </div>
          <button class="abtn ghost sm block" data-action="logout">${ICON.logout}<span>Exit to Home</span></button>
        </div>
      </aside>
      <div class="app-scrim" id="appScrim"></div>
      <div class="app-main">
        <header class="app-top">
          <button class="icon-btn menu-toggle" data-action="menu">${ICON.menu}</button>
          <div>
            <div class="page-title">${esc(title)}</div>
            <div class="page-sub">${esc(sub || '')}</div>
          </div>
          <div class="spacer"></div>
          <button class="icon-btn" data-nav="notifications" title="Notifications">${ICON.bell}${(state.notifications||[]).some(n=>!n.read)?'<span class="dot"></span>':''}</button>
        </header>
        <div class="app-content">${contentHTML}</div>
      </div>
    </div>`;
  }

  /* ============================================================
     SHARED COMPONENTS
     ============================================================ */
  function badge(status){ const s = STATUS[status] || { label:status, cls:'' }; return `<span class="badge ${s.cls}">${s.label}</span>`; }
  function emergBadge(e){ return `<span class="badge ${EMERG[e]||''}">${esc(e)} Emergency</span>`; }
  function progress(c){
    const p = pct(c.raisedAmount, c.estimatedCost);
    return `<div class="progress"><span style="width:${p}%"></span></div>
      <div class="progress-meta"><span>${money(c.raisedAmount)} raised</span><b>${p}%</b></div>`;
  }
  function caseCard(c, mode){
    const remaining = Math.max(0, c.estimatedCost - c.raisedAmount);
    let actions = '';
    if (mode === 'donor') {
      actions = `<button class="abtn ghost sm" data-action="view" data-id="${c.id}">View Details</button>
                 <button class="abtn primary sm" data-action="donate" data-id="${c.id}">${ICON.heart}<span>Donate Now</span></button>`;
    } else if (mode === 'hospital') {
      actions = `<button class="abtn ghost sm" data-action="view" data-id="${c.id}">View Case</button>
                 ${c.status==='declined'?`<button class="abtn primary sm" data-action="resubmit" data-id="${c.id}">Resubmit</button>`:''}
                 ${c.status==='approved'?`<button class="abtn ok sm" data-action="mark-active" data-id="${c.id}">Start Treatment</button>`:''}
                 ${c.status==='active'?`<button class="abtn ok sm" data-action="mark-complete" data-id="${c.id}">Mark Completed</button>`:''}`;
    } else {
      actions = `<button class="abtn ghost sm" data-action="view" data-id="${c.id}">View Case</button>`;
    }
    return `<article class="case-card">
      <div class="case-top">
        <div class="case-avatar">${initials(c.patientName)}</div>
        <div style="min-width:0">
          <div class="case-id">${esc(c.id)}</div>
          <div class="case-name">${esc(c.patientName)} <span>· ${c.age}y · ${esc(c.gender)}</span></div>
          <div class="case-diag">${esc(c.diagnosis)}</div>
        </div>
      </div>
      <div class="case-body">
        <div style="display:flex;gap:8px;flex-wrap:wrap">${badge(c.status)}${emergBadge(c.emergency)}</div>
        <div class="case-rows">
          <div class="case-row"><span class="lbl">Hospital</span><span class="val">${esc(c.hospitalName)}</span></div>
          <div class="case-row"><span class="lbl">Treatment</span><span class="val">${esc(c.treatment)}</span></div>
          <div class="case-row"><span class="lbl">Duration</span><span class="val">${c.durationDays} days</span></div>
          <div class="case-row"><span class="lbl">Est. Cost</span><span class="val">${money(c.estimatedCost)}</span></div>
          <div class="case-row"><span class="lbl">Remaining</span><span class="val">${money(remaining)}</span></div>
        </div>
        ${progress(c)}
      </div>
      <div class="case-foot">${actions}</div>
    </article>`;
  }

  /* ============================================================
     DONOR VIEWS
     ============================================================ */
  function donorDashboard(){
    const v = verifiedCases();
    const totalRaised = v.reduce((s,c)=>s+c.raisedAmount,0);
    const active = v.filter(c=>c.status==='active'||c.status==='approved');
    const completed = v.filter(c=>c.status==='completed');
    const recent = [...v].sort((a,b)=> new Date(b.submittedDate)-new Date(a.submittedDate)).slice(0,3);
    const myTotal = state.donor.donations.reduce((s,d)=>s+d.amount,0);
    return `
    <div class="stat-grid">
      <div class="stat accent"><div class="k">Total Verified Cases</div><div class="v">${v.length}</div><div class="d">Cleared by health authority</div></div>
      <div class="stat"><div class="k">Total Amount Raised</div><div class="v">${money(totalRaised)}</div><div class="d">Across all verified cases</div></div>
      <div class="stat"><div class="k">Active Campaigns</div><div class="v">${active.length}</div><div class="d">Currently accepting support</div></div>
      <div class="stat"><div class="k">Your Total Donations</div><div class="v">${money(myTotal)}</div><div class="d">${state.donor.donations.length} contributions</div></div>
    </div>

    <div class="two-col">
      <div class="panel-card">
        <div class="panel-head"><div><h3>Recently Added Cases</h3><div class="sub">Latest verified treatment cases</div></div><div class="spacer"></div><button class="abtn ghost sm" data-nav="cases">View all</button></div>
        <div class="panel-body"><div class="case-grid">${recent.map(c=>caseCard(c,'donor')).join('') || emptyBox('No verified cases yet')}</div></div>
      </div>
      <div class="panel-card">
        <div class="panel-head"><div><h3>Completed Campaigns</h3><div class="sub">Fully funded treatments</div></div></div>
        <div class="panel-body">
          ${completed.length ? completed.map(c=>`
            <div class="list-row">
              <span class="case-avatar" style="width:40px;height:40px;border-radius:12px;font-size:14px">${initials(c.patientName)}</span>
              <div class="lr-main"><b>${esc(c.patientName)}</b><span>${esc(c.treatment)} · ${money(c.estimatedCost)}</span></div>
              ${badge('completed')}
            </div>`).join('') : emptyBox('No completed campaigns yet')}
        </div>
      </div>
    </div>`;
  }

  function filterControls(){
    const f = state.filters;
    const conditions = [...new Set(state.cases.map(c=>c.diagnosis))].sort();
    const types = [...new Set(state.cases.map(c=>c.treatment))].sort();
    const locations = [...new Set(state.cases.map(c=>c.location))].sort();
    return `
    <div class="toolbar">
      <div class="search-box">${ICON.search}<input id="caseSearch" type="text" placeholder="Search patients, treatment, hospital or case ID…" value="${esc(f.q)}" /></div>
      <div class="filter-row">
        <select data-filter="condition"><option value="">Medical condition</option>${conditions.map(c=>`<option ${f.condition===c?'selected':''}>${esc(c)}</option>`).join('')}</select>
        <select data-filter="type"><option value="">Treatment type</option>${types.map(c=>`<option ${f.type===c?'selected':''}>${esc(c)}</option>`).join('')}</select>
        <select data-filter="amount"><option value="">Amount required</option><option value="low" ${f.amount==='low'?'selected':''}>Under ₹5,00,000</option><option value="mid" ${f.amount==='mid'?'selected':''}>₹5,00,000 – ₹15,00,000</option><option value="high" ${f.amount==='high'?'selected':''}>Above ₹15,00,000</option></select>
        <select data-filter="duration"><option value="">Treatment duration</option><option value="short" ${f.duration==='short'?'selected':''}>Under 60 days</option><option value="medium" ${f.duration==='medium'?'selected':''}>60 – 150 days</option><option value="long" ${f.duration==='long'?'selected':''}>Above 150 days</option></select>
        <select data-filter="location"><option value="">Location</option>${locations.map(c=>`<option ${f.location===c?'selected':''}>${esc(c)}</option>`).join('')}</select>
        <select data-filter="sort"><option value="">Sort</option><option value="recent" ${f.sort==='recent'?'selected':''}>Recently added</option><option value="funded" ${f.sort==='funded'?'selected':''}>Most funded</option></select>
        <button class="chip" data-action="clear-filters">Clear</button>
      </div>
    </div>`;
  }

  function applyFilters(list){
    const f = state.filters;
    let out = list.slice();
    if (f.q){ const q = f.q.toLowerCase(); out = out.filter(c => [c.patientName,c.diagnosis,c.treatment,c.hospitalName,c.id].join(' ').toLowerCase().includes(q)); }
    if (f.condition) out = out.filter(c=>c.diagnosis===f.condition);
    if (f.type) out = out.filter(c=>c.treatment===f.type);
    if (f.location) out = out.filter(c=>c.location===f.location);
    if (f.amount) out = out.filter(c => f.amount==='low'?c.estimatedCost<500000 : f.amount==='mid'?c.estimatedCost>=500000&&c.estimatedCost<=1500000 : c.estimatedCost>1500000);
    if (f.duration) out = out.filter(c => f.duration==='short'?c.durationDays<60 : f.duration==='medium'?c.durationDays>=60&&c.durationDays<=150 : c.durationDays>150);
    if (f.sort==='recent') out.sort((a,b)=> new Date(b.submittedDate)-new Date(a.submittedDate));
    if (f.sort==='funded') out.sort((a,b)=> (b.raisedAmount/b.estimatedCost)-(a.raisedAmount/a.estimatedCost));
    return out;
  }

  function donorCases(){
    const list = applyFilters(verifiedCases());
    return `
    <div class="panel-card"><div class="panel-body">${filterControls()}</div></div>
    <div class="notice info">${ICON.shield}<span>Only <b>verified treatment cases</b> approved by the health authority are shown here. Unverified information is never displayed to donors.</span></div>
    <div class="case-grid">${list.map(c=>caseCard(c,'donor')).join('') || emptyBox('No cases match your search')}</div>`;
  }

  function donorDonations(){
    const d = state.donor.donations;
    const active = d.filter(x=>x.status==='Active');
    const done = d.filter(x=>x.status==='Completed');
    const row = x => `<div class="list-row">
        <span class="case-avatar" style="width:40px;height:40px;border-radius:12px;font-size:13px">${initials(x.patient)}</span>
        <div class="lr-main"><b>${esc(x.patient)}</b><span>${esc(x.caseId)} · ${x.date}</span></div>
        <div style="text-align:right"><b class="mono">${money(x.amount)}</b><div><span class="badge ${x.status==='Active'?'active':'completed'}">${x.status}</span></div></div>
      </div>`;
    return `
    <div class="stat-grid">
      <div class="stat accent"><div class="k">Total Donated</div><div class="v">${money(d.reduce((s,x)=>s+x.amount,0))}</div></div>
      <div class="stat"><div class="k">Active Donations</div><div class="v">${active.length}</div></div>
      <div class="stat"><div class="k">Completed Donations</div><div class="v">${done.length}</div></div>
    </div>
    <div class="two-col">
      <div class="panel-card"><div class="panel-head"><h3>Donation History</h3></div><div class="panel-body">${d.map(row).join('') || emptyBox('No donations yet')}</div></div>
      <div class="panel-card"><div class="panel-head"><h3>Payment History</h3></div><div class="panel-body">${d.map(x=>`<div class="list-row"><div class="lr-main"><b>${esc(x.id)}</b><span>${x.date} · ${esc(x.caseId)}</span></div><span class="badge completed">Paid</span></div>`).join('') || emptyBox('No payments yet')}</div></div>
    </div>`;
  }

  function donorSaved(){
    const list = state.donor.saved.map(getCase).filter(Boolean);
    return `<div class="case-grid">${list.map(c=>caseCard(c,'donor')).join('') || emptyBox('No saved cases yet')}</div>`;
  }

  function donorProfile(){
    const d = state.donor;
    const total = d.donations.reduce((s,x)=>s+x.amount,0);
    const cases = new Set(d.donations.map(x=>x.caseId)).size;
    return `
    <div class="panel-card"><div class="panel-body">
      <div class="profile-head">
        <div class="profile-av">${initials(d.name)}</div>
        <div class="pi">
          <h2>${esc(d.name)}</h2>
          <p>${esc(d.email)} · ${esc(d.phone)}</p>
          <p>${esc(d.location)}</p>
          <div class="tags"><span class="badge verified">Verified Donor</span><span class="badge active">Privacy Protected</span></div>
        </div>
        <div class="spacer" style="flex:1"></div>
        <div class="stat-grid" style="grid-template-columns:repeat(3,minmax(120px,1fr));flex:2;min-width:280px">
          <div class="stat"><div class="k">Total Donated</div><div class="v" style="font-size:20px">${money(total)}</div></div>
          <div class="stat"><div class="k">Cases Supported</div><div class="v" style="font-size:20px">${cases}</div></div>
          <div class="stat"><div class="k">Saved Cases</div><div class="v" style="font-size:20px">${d.saved.length}</div></div>
        </div>
      </div>
    </div></div>
    <div class="panel-card">
      <div class="panel-body">
        <div class="tabs-row" data-tabs="profile">
          <button class="active" data-ptab="history">Donation History</button>
          <button data-ptab="active">Active Donations</button>
          <button data-ptab="completed">Completed</button>
          <button data-ptab="saved">Saved Cases</button>
          <button data-ptab="notif">Notifications</button>
        </div>
        <div id="profileTabBody" style="margin-top:18px">${profileTab('history')}</div>
      </div>
    </div>`;
  }

  function profileTab(tab){
    const d = state.donor;
    if (tab==='history') return d.donations.map(x=>`<div class="list-row"><div class="lr-main"><b>${esc(x.patient)}</b><span>${x.date} · ${esc(x.caseId)}</span></div><b class="mono">${money(x.amount)}</b></div>`).join('') || emptyBox('No donations');
    if (tab==='active') return d.donations.filter(x=>x.status==='Active').map(x=>`<div class="list-row"><div class="lr-main"><b>${esc(x.patient)}</b><span>${esc(x.caseId)}</span></div><span class="badge active">Active</span></div>`).join('') || emptyBox('No active donations');
    if (tab==='completed') return d.donations.filter(x=>x.status==='Completed').map(x=>`<div class="list-row"><div class="lr-main"><b>${esc(x.patient)}</b><span>${esc(x.caseId)}</span></div><span class="badge completed">Completed</span></div>`).join('') || emptyBox('No completed donations');
    if (tab==='saved') return d.saved.map(getCase).filter(Boolean).map(c=>`<div class="list-row"><div class="lr-main"><b>${esc(c.patientName)}</b><span>${esc(c.treatment)} · ${esc(c.hospitalName)}</span></div><button class="abtn ghost sm" data-action="view" data-id="${c.id}">View</button></div>`).join('') || emptyBox('No saved cases');
    if (tab==='notif') return d.notifications.map(n=>`<div class="list-row"><div class="lr-main"><b>${esc(n.t)}</b><span>${esc(n.d)}</span></div><span style="font-size:11px;color:var(--gray-dim)">${esc(n.when)}</span></div>`).join('') || emptyBox('No notifications');
    return '';
  }

  function donorNotifications(){
    return `<div class="panel-card"><div class="panel-head"><h3>Notifications</h3></div><div class="panel-body">${state.donor.notifications.map(n=>`<div class="list-row"><div class="lr-main"><b>${esc(n.t)}</b><span>${esc(n.d)}</span></div><span style="font-size:11px;color:var(--gray-dim)">${esc(n.when)}</span></div>`).join('')}</div></div>`;
  }

  function notificationsView(){
    const list = state.notifications || [];
    return `<div class="panel-card">
      <div class="panel-head">
        <div><h3>Notifications</h3><div class="sub">${list.length} notification(s)</div></div>
        <div class="spacer"></div>
        <button class="abtn ghost sm" data-action="mark-all-read">Mark all read</button>
      </div>
      <div class="panel-body">
        ${list.map(n=>`<div class="list-row" data-notification-id="${n.id}" style="${n.read?'opacity:.65':''}">
          <div class="lr-main"><b>${esc(n.t)}</b><span>${esc(n.d)}</span></div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;color:var(--gray-dim)">${esc(n.when)}</span>
            ${n.read?'':'<button class="abtn ghost sm" data-action="mark-read" data-id="'+n.id+'">Read</button>'}
          </div>
        </div>`).join('') || emptyBox('No notifications')}
      </div>
    </div>`;
  }

  /* ============================================================
     HOSPITAL VIEWS
     ============================================================ */
  function myHospitalCases(){ return state.cases.filter(c => c.hospitalId === state.hospital.id); }

  function hospitalDashboard(){
    const mine = myHospitalCases();
    const by = s => mine.filter(c=>c.status===s).length;
    const totalEst = mine.reduce((s,c)=>s+c.estimatedCost,0);
    return `
    <div class="stat-grid">
      <div class="stat"><div class="k">Registered Cases</div><div class="v">${mine.length}</div><div class="d">All submitted cases</div></div>
      <div class="stat"><div class="k">Pending Verification</div><div class="v" style="color:var(--warn)">${by('pending')}</div><div class="d">Awaiting authority review</div></div>
      <div class="stat"><div class="k">Approved Cases</div><div class="v" style="color:var(--ok)">${by('approved')+by('active')}</div><div class="d">Verified &amp; fundable</div></div>
      <div class="stat"><div class="k">Declined Cases</div><div class="v" style="color:var(--bad)">${by('declined')}</div><div class="d">Needs correction</div></div>
      <div class="stat"><div class="k">Active Campaigns</div><div class="v" style="color:var(--info)">${by('active')}</div><div class="d">In treatment</div></div>
      <div class="stat accent"><div class="k">Total Est. Amount</div><div class="v" style="font-size:22px">${money(totalEst)}</div><div class="d">Across all cases</div></div>
    </div>
    <div class="panel-card">
      <div class="panel-head"><div><h3>Recent Cases</h3><div class="sub">${esc(state.hospital.name)} · ${esc(state.hospital.id)}</div></div><div class="spacer"></div>
        <button class="abtn primary sm" data-nav="register">${ICON.plus}<span>Register New Treatment Case</span></button></div>
      <div class="panel-body"><div class="case-grid">${mine.slice(0,3).map(c=>caseCard(c,'hospital')).join('') || emptyBox('No cases registered yet')}</div></div>
    </div>`;
  }

  function hospitalCases(){
    const mine = myHospitalCases();
    const groups = [
      { t:'Pending Verification', list: mine.filter(c=>c.status==='pending') },
      { t:'Approved / Active', list: mine.filter(c=>['approved','active'].includes(c.status)) },
      { t:'Declined', list: mine.filter(c=>c.status==='declined') },
      { t:'Completed', list: mine.filter(c=>c.status==='completed') }
    ];
    return `<div class="panel-card"><div class="panel-head"><div><h3>My Cases</h3><div class="sub">Track every case through the pipeline</div></div><div class="spacer"></div>
      <button class="abtn primary sm" data-nav="register">${ICON.plus}<span>Register New Case</span></button></div></div>
      ${groups.map(g=> g.list.length ? `<div><div class="section-label">${g.t} (${g.list.length})</div><div class="case-grid">${g.list.map(c=>caseCard(c,'hospital')).join('')}</div></div>` : '').join('')}
      ${!mine.length ? emptyBox('No cases yet — register your first treatment case') : ''}`;
  }

  /* ---------- 3-STAGE REGISTER WIZARD ---------- */
  function startWizard(){
    state.wizard = { step:1, data:{
      patientName:'', age:'', diagnosis:'', treatment:'', estimatedCost:'', durationDays:'', emergency:'Medium',
      hospitalName: state.hospital.name, hospitalId: state.hospital.id, hospitalAddress:'', hospitalContact:'', hospitalEmail:'',
      doctorName: state.hospital.doctor, doctorRegNo:''
    }, docs:[] };
    state.page = 'register';
    render();
  }

  const DOC_TYPES = [
    { k:'medical', t:'Medical Report', h:'Full clinical / medical report' },
    { k:'diagnosis', t:'Diagnosis Report', h:'Confirmed diagnosis document' },
    { k:'recommendation', t:'Doctor\u2019s Recommendation', h:'Signed recommendation letter' },
    { k:'plan', t:'Treatment Plan', h:'Proposed treatment plan' },
    { k:'cost', t:'Cost Estimate Document', h:'Itemised cost estimate' },
    { k:'consent', t:'Patient Identity / Consent', h:'ID proof & consent form' }
  ];

  function wizardView(){
    const w = state.wizard;
    const steps = ['Treatment & Hospital Details','Medical Documents','Review & Submit'];
    const stepBar = steps.map((s,i)=>`<div class="wstep ${w.step===i+1?'active':''} ${w.step>i+1?'done':''}"><span class="n">${w.step>i+1?'✓':i+1}</span><span class="t">${s}</span></div>`).join('');
    let body = '';
    if (w.step===1) body = wizardStep1(w.data);
    if (w.step===2) body = wizardStep2(w.docs);
    if (w.step===3) body = wizardStep3(w);
    return `<div class="wizard-steps">${stepBar}</div>
      <div class="panel-card"><div class="panel-body">${body}</div></div>`;
  }

  function wizardStep1(d){
    return `
    <div class="section-label">Treatment Information</div>
    <div class="form-grid">
      <div class="fld"><label>Patient Name</label><input data-w="patientName" value="${esc(d.patientName)}" placeholder="Full name" /></div>
      <div class="fld"><label>Patient Age</label><input data-w="age" type="number" value="${esc(d.age)}" placeholder="Years" /></div>
      <div class="fld full"><label>Diagnosis / Medical Condition</label><input data-w="diagnosis" value="${esc(d.diagnosis)}" placeholder="e.g. Acute Myeloid Leukemia" /></div>
      <div class="fld"><label>Treatment Required</label><input data-w="treatment" value="${esc(d.treatment)}" placeholder="e.g. Bone Marrow Transplant" /></div>
      <div class="fld"><label>Estimated Treatment Amount (₹)</label><input data-w="estimatedCost" type="number" value="${esc(d.estimatedCost)}" placeholder="e.g. 1500000" /></div>
      <div class="fld"><label>Treatment Duration (days)</label><input data-w="durationDays" type="number" value="${esc(d.durationDays)}" placeholder="e.g. 120" /></div>
      <div class="fld"><label>Emergency Level</label><select data-w="emergency">
        <option ${d.emergency==='High'?'selected':''}>High</option><option ${d.emergency==='Medium'?'selected':''}>Medium</option><option ${d.emergency==='Low'?'selected':''}>Low</option></select></div>
    </div>
    <div class="section-label" style="margin-top:20px">Hospital Profile</div>
    <div class="form-grid">
      <div class="fld"><label>Hospital Name</label><input data-w="hospitalName" value="${esc(d.hospitalName)}" /></div>
      <div class="fld"><label>Hospital Registration ID</label><input data-w="hospitalId" value="${esc(d.hospitalId)}" /></div>
      <div class="fld full"><label>Hospital Address</label><input data-w="hospitalAddress" value="${esc(d.hospitalAddress)}" placeholder="Street, city, state" /></div>
      <div class="fld"><label>Contact Number</label><input data-w="hospitalContact" value="${esc(d.hospitalContact)}" placeholder="+91 …" /></div>
      <div class="fld"><label>Hospital Email</label><input data-w="hospitalEmail" value="${esc(d.hospitalEmail)}" placeholder="hospital@example.com" /></div>
      <div class="fld"><label>Authorized Doctor Name</label><input data-w="doctorName" value="${esc(d.doctorName)}" /></div>
      <div class="fld"><label>Doctor Registration Number</label><input data-w="doctorRegNo" value="${esc(d.doctorRegNo)}" placeholder="MCI-0000" /></div>
    </div>
    <div class="modal-actions" style="justify-content:flex-end">
      <button class="abtn ghost" data-action="wizard-cancel">Cancel</button>
      <button class="abtn primary" data-action="wizard-next">Save &amp; Continue</button>
    </div>`;
  }

  function wizardStep2(docs){
    const cards = DOC_TYPES.map(t => {
      const f = docs.find(d=>d.key===t.k);
      return `<div class="upload">
        <div><div class="u-title">${t.t}</div><div class="u-hint">${t.h}</div></div>
        ${f ? `<div class="doc-file"><span class="nm">${esc(f.name)}</span><span class="st">${esc(f.status)}</span>
                 <button class="abtn ghost sm" data-action="doc-remove" data-key="${t.k}">Remove</button></div>`
            : `<div class="u-actions">
                 <label class="abtn ghost sm" style="cursor:pointer">Choose File<input type="file" data-doc="${t.k}" style="display:none" /></label>
               </div>`}
      </div>`;
    }).join('');
    return `
    <div class="section-label">Upload Verification Documents</div>
    <div class="notice warn">${ICON.doc}<span>Attach all relevant documents. The health authority reviews these before a case is verified and shown to donors.</span></div>
    <div class="upload-grid" style="margin-top:16px">${cards}</div>
    <div class="modal-actions" style="justify-content:space-between">
      <button class="abtn ghost" data-action="wizard-back">Back</button>
      <button class="abtn primary" data-action="wizard-next">Continue</button>
    </div>`;
  }

  function wizardStep3(w){
    const d = w.data;
    const docList = w.docs.length ? w.docs.map(x=>`<div class="doc-file" style="margin-bottom:8px"><span class="nm">${esc(x.name)}</span><span class="st">${esc(x.status)}</span></div>`).join('') : '<div class="u-hint">No documents uploaded</div>';
    return `
    <div class="section-label">Review &amp; Submit</div>
    <div class="review-grid">
      <div class="review-block"><h4>Patient Information</h4><dl>
        <div class="rr"><dt>Name</dt><dd>${esc(d.patientName)||'—'}</dd></div>
        <div class="rr"><dt>Age</dt><dd>${esc(d.age)||'—'}</dd></div>
        <div class="rr"><dt>Diagnosis</dt><dd>${esc(d.diagnosis)||'—'}</dd></div>
      </dl></div>
      <div class="review-block"><h4>Treatment Information</h4><dl>
        <div class="rr"><dt>Treatment</dt><dd>${esc(d.treatment)||'—'}</dd></div>
        <div class="rr"><dt>Duration</dt><dd>${esc(d.durationDays)||'—'} days</dd></div>
        <div class="rr"><dt>Emergency</dt><dd>${esc(d.emergency)}</dd></div>
        <div class="rr"><dt>Est. Amount</dt><dd>${d.estimatedCost?money(d.estimatedCost):'—'}</dd></div>
      </dl></div>
      <div class="review-block"><h4>Hospital Information</h4><dl>
        <div class="rr"><dt>Hospital</dt><dd>${esc(d.hospitalName)||'—'}</dd></div>
        <div class="rr"><dt>Reg. ID</dt><dd>${esc(d.hospitalId)||'—'}</dd></div>
        <div class="rr"><dt>Doctor</dt><dd>${esc(d.doctorName)||'—'}</dd></div>
        <div class="rr"><dt>Doctor Reg.</dt><dd>${esc(d.doctorRegNo)||'—'}</dd></div>
      </dl></div>
      <div class="review-block"><h4>Uploaded Documents</h4>${docList}</div>
    </div>
    <div class="notice info" style="margin-top:16px">${ICON.shield}<span>On submission this case will be sent to the <b>Health Authority</b> for verification. Status will become <b>Pending Health Authority Verification</b>.</span></div>
    <div class="modal-actions" style="justify-content:space-between">
      <button class="abtn ghost" data-action="wizard-back">Back</button>
      <button class="abtn primary" data-action="wizard-submit">Submit for Authority Verification</button>
    </div>`;
  }

  async function submitWizard(){
    const w = state.wizard; if (!w) return;
    const d = w.data;
    const req = ['patientName','age','diagnosis','treatment','estimatedCost','durationDays'];
    const missing = req.filter(k => !String(d[k]).trim());
    if (missing.length){ toast('Missing fields', 'Please complete: ' + missing.join(', '), 'bad'); return; }
    if (!w.docs.length){ toast('Documents required', 'Upload at least one verification document.', 'bad'); return; }

    try {
      const created = await api('/cases', {
        method:'POST',
        body:JSON.stringify({
          patientName:d.patientName,
          age:d.age,
          diagnosis:d.diagnosis,
          treatment:d.treatment,
          estimatedCost:d.estimatedCost,
          durationDays:d.durationDays,
          emergency:d.emergency,
          hospitalName:d.hospitalName,
          hospitalId:d.hospitalId,
          hospitalAddress:d.hospitalAddress,
          hospitalContact:d.hospitalContact,
          hospitalEmail:d.hospitalEmail,
          doctorName:d.doctorName,
          doctorRegNo:d.doctorRegNo
        })
      });

      const createdCase = created.data.case;
      for (const doc of w.docs) {
        if (!doc.file) continue;
        const form = new FormData();
        form.append('file', doc.file, doc.name);
        form.append('docType', doc.key);
        await api(`/cases/${encodeURIComponent(createdCase.id)}/documents`, {
          method:'POST',
          body:form
        });
      }

      state.wizard = null;
      state.page = 'cases';
      await loadRoleData();
      toast('Case submitted', `${createdCase.id} is now pending health authority verification.`, 'ok');
    } catch (err) {
      toast('Submission failed', err.message, 'bad');
    }
  }


  /* ============================================================
     AUTHORITY VIEWS
     ============================================================ */
  function authorityDashboard(){
    const all = state.cases;
    const by = s => all.filter(c=>c.status===s).length;
    const pending = all.filter(c=>c.status==='pending');
    return `
    <div class="stat-grid">
      <div class="stat accent"><div class="k">Pending Cases</div><div class="v">${by('pending')}</div><div class="d">Awaiting your review</div></div>
      <div class="stat"><div class="k">Approved Cases</div><div class="v" style="color:var(--ok)">${by('approved')+by('active')+by('completed')}</div><div class="d">Verified &amp; fundable</div></div>
      <div class="stat"><div class="k">Declined Cases</div><div class="v" style="color:var(--bad)">${by('declined')}</div><div class="d">Returned to hospital</div></div>
      <div class="stat"><div class="k">Active Cases</div><div class="v" style="color:var(--info)">${by('active')}</div><div class="d">In treatment</div></div>
      <div class="stat"><div class="k">Completed Cases</div><div class="v">${by('completed')}</div><div class="d">Treatment finished</div></div>
    </div>
    <div class="panel-card">
      <div class="panel-head"><div><h3>Pending Treatment Cases</h3><div class="sub">Review documents, then accept or decline</div></div><div class="spacer"></div>
        <button class="abtn ghost sm" data-nav="pending">Open queue</button></div>
      <div class="panel-body"><div class="case-grid">${pending.slice(0,3).map(c=>caseCard(c,'authority')).join('') || emptyBox('No pending cases — all caught up')}</div></div>
    </div>`;
  }

  function authorityList(status){
    const list = state.cases.filter(c => status==='approved' ? ['approved','active','completed'].includes(c.status) : c.status===status);
    const titles = { pending:'Pending Cases', approved:'Approved Cases', declined:'Declined Cases' };
    return `<div class="panel-card"><div class="panel-head"><div><h3>${titles[status]||'Cases'}</h3><div class="sub">${list.length} case(s)</div></div></div>
      <div class="panel-body"><div class="case-grid">${list.map(c=>caseCard(c,'authority')).join('') || emptyBox('No cases in this category')}</div></div></div>`;
  }

  function authorityHistory(){
    const rows = state.history;
    return `<div class="panel-card"><div class="panel-head"><h3>Verification History</h3></div>
      <div class="panel-body tbl-wrap"><table class="tbl">
        <thead><tr><th>Case ID</th><th>Action</th><th>Officer</th><th>Date</th></tr></thead>
        <tbody>${rows.map(r=>`<tr><td class="mono">${esc(r.id)}</td><td>${esc(r.action)}</td><td>${esc(r.by)}</td><td>${esc(r.date)}</td></tr>`).join('')}</tbody>
      </table></div></div>`;
  }

  /* ============================================================
     CASE DETAILS MODAL
     ============================================================ */
  function viewCase(id){
    const c = getCase(id); if (!c) return;
    const remaining = Math.max(0, c.estimatedCost - c.raisedAmount);
    const docs = c.documents.map(d=>`<div class="doc-file" style="margin-bottom:8px"><span class="nm">${esc(d.name)}</span><span class="st">${esc(d.status)}</span></div>`).join('') || '<div class="u-hint">No documents</div>';
    const donors = c.donors.length ? c.donors.map(d=>`<div class="list-row"><div class="lr-main"><b>${esc(d.name)}</b><span>${d.date}</span></div><b class="mono">${money(d.amount)}</b></div>`).join('') : '<div class="u-hint">No donations yet</div>';
    let foot = '';
    if (state.role==='donor' && ['approved','active','completed'].includes(c.status)) {
      foot = `<button class="abtn ghost" data-action="toggle-save" data-id="${c.id}">${state.donor.saved.includes(c.id)?'Remove from Saved':'Save Case'}</button>
              <button class="abtn primary" data-action="donate" data-id="${c.id}">${ICON.heart}<span>Donate Now</span></button>`;
    }
    if (state.role==='authority' && c.status==='pending') {
      foot = `<button class="abtn danger" data-action="decline" data-id="${c.id}">Decline</button>
              <button class="abtn ok" data-action="accept" data-id="${c.id}">Accept &amp; Verify</button>`;
    }
    openModal(`
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:16px">
        <span class="case-avatar">${initials(c.patientName)}</span>
        <div><div class="case-id">${esc(c.id)}</div><h3 style="margin:2px 0">${esc(c.patientName)}</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">${badge(c.status)}${emergBadge(c.emergency)}</div></div>
      </div>
      ${c.status==='declined'&&c.declineReason?`<div class="notice bad" style="margin-bottom:14px">${ICON.x}<span><b>Decline reason:</b> ${esc(c.declineReason)}</span></div>`:''}
      <div class="review-grid">
        <div class="review-block"><h4>Patient &amp; Treatment</h4><dl>
          <div class="rr"><dt>Age</dt><dd>${c.age} yrs</dd></div>
          <div class="rr"><dt>Diagnosis</dt><dd>${esc(c.diagnosis)}</dd></div>
          <div class="rr"><dt>Treatment</dt><dd>${esc(c.treatment)}</dd></div>
          <div class="rr"><dt>Duration</dt><dd>${c.durationDays} days</dd></div>
        </dl></div>
        <div class="review-block"><h4>Hospital</h4><dl>
          <div class="rr"><dt>Name</dt><dd>${esc(c.hospitalName)}</dd></div>
          <div class="rr"><dt>ID</dt><dd>${esc(c.hospitalId)}</dd></div>
          <div class="rr"><dt>Doctor</dt><dd>${esc(c.doctorName)}</dd></div>
          <div class="rr"><dt>Doctor Reg.</dt><dd>${esc(c.doctorRegNo)}</dd></div>
        </dl></div>
        <div class="review-block"><h4>Funding</h4><dl>
          <div class="rr"><dt>Estimated</dt><dd>${money(c.estimatedCost)}</dd></div>
          <div class="rr"><dt>Raised</dt><dd>${money(c.raisedAmount)}</dd></div>
          <div class="rr"><dt>Remaining</dt><dd>${money(remaining)}</dd></div>
          <div class="rr"><dt>Submitted</dt><dd>${esc(c.submittedDate)}</dd></div>
        </dl></div>
        <div class="review-block"><h4>Documents</h4>${docs}</div>
      </div>
      <div class="review-block" style="margin-top:14px"><h4>Donation Tracking</h4>${donors}</div>
      <div class="modal-actions">${foot}<button class="abtn ghost" data-action="close-modal">Close</button></div>
    `);
  }

  function donateFlow(id){
    const c = getCase(id); if (!c) return;
    openModal(`
      <h3>Support ${esc(c.patientName)}</h3>
      <div class="m-sub">${esc(c.treatment)} · ${esc(c.hospitalName)} · ${esc(c.id)}</div>
      ${progress(c)}
      <div class="fld" style="margin-top:16px"><label>Donation Amount (₹)</label><input id="donateAmt" type="number" placeholder="e.g. 5000" /></div>
      <div class="filter-row" style="margin-top:12px">
        ${[1000,5000,10000,25000].map(a=>`<button class="chip" data-action="donate-quick" data-amt="${a}">₹${a.toLocaleString('en-IN')}</button>`).join('')}
      </div>
      <div class="notice info" style="margin-top:16px">${ICON.shield}<span>Your donation is securely recorded by the LifeLink backend.</span></div>
      <div class="modal-actions"><button class="abtn ghost" data-action="close-modal">Cancel</button>
        <button class="abtn primary" data-action="confirm-donate" data-id="${c.id}">Confirm Donation</button></div>
    `);
  }

  async function confirmDonate(id){
    const c = getCase(id); if (!c) return;
    const amt = Number(($('#donateAmt')||{}).value || 0);
    if (!amt || amt < 100){ toast('Invalid amount', 'Please enter at least ₹100.', 'bad'); return; }

    try {
      await api('/donations', {
        method:'POST',
        body:JSON.stringify({ caseId:id, amount:amt })
      });
      closeModal();
      await loadRoleData();
      toast('Thank you!', `${money(amt)} contributed to ${c.patientName}.`, 'ok');
    } catch (err) {
      toast('Donation failed', err.message, 'bad');
    }
  }

  function acceptFlow(id){
    const c = getCase(id); if (!c) return;
    openModal(`
      <h3>Confirm Verification</h3>
      <div class="m-sub">You are about to verify and approve this treatment case.</div>
      <div class="notice ok">${ICON.check}<span><b>${esc(c.id)}</b> — ${esc(c.patientName)}, ${c.age}y, ${esc(c.diagnosis)} at ${esc(c.hospitalName)}. Estimated ${money(c.estimatedCost)}.</span></div>
      <div class="notice info" style="margin-top:12px">${ICON.shield}<span>Once approved, this case becomes visible to donors and donation tracking activates.</span></div>
      <div class="modal-actions"><button class="abtn ghost" data-action="close-modal">Cancel</button>
        <button class="abtn ok" data-action="confirm-accept" data-id="${c.id}">Confirm Verification</button></div>
    `);
  }

  async function confirmAccept(id){
    try {
      await api(`/cases/${encodeURIComponent(id)}/verify`, { method:'POST' });
      closeModal();
      await loadRoleData();
      toast('Case approved', `${id} is now verified and visible to donors.`, 'ok');
    } catch (err) {
      toast('Verification failed', err.message, 'bad');
    }
  }

  async function confirmDecline(id){
    const reason = ($('#declineReason')||{}).value || '';
    if (!reason.trim()){ toast('Reason required', 'Please enter a reason for declining.', 'bad'); return; }
    try {
      await api(`/cases/${encodeURIComponent(id)}/decline`, {
        method:'POST',
        body:JSON.stringify({ reason:reason.trim() })
      });
      closeModal();
      await loadRoleData();
      toast('Case declined', `${id} returned to the hospital with your reason.`, 'bad');
    } catch (err) {
      toast('Decline failed', err.message, 'bad');
    }
  }

  async function resubmit(id){
    try {
      await api(`/cases/${encodeURIComponent(id)}/resubmit`, { method:'POST' });
      await loadRoleData();
      toast('Resubmitted', `${id} is back in the authority queue.`, 'ok');
    } catch (err) {
      toast('Resubmission failed', err.message, 'bad');
    }
  }

  async function changeCaseStatus(id, action, successTitle, successMessage){
    try {
      await api(`/cases/${encodeURIComponent(id)}/${action}`, { method:'POST' });
      await loadRoleData();
      toast(successTitle, successMessage, 'ok');
    } catch (err) {
      toast('Update failed', err.message, 'bad');
    }
  }


  /* ============================================================
     SETTINGS
     ============================================================ */
  function settingsView(){
    const s = state.settings || { notifications:'Enabled', privacy:'Show my name publicly' };
    const u = ROLE_USER[state.role]();
    return `<div class="panel-card"><div class="panel-head"><h3>Account Settings</h3></div><div class="panel-body">
      <div class="form-grid">
        <div class="fld"><label>Display Name</label><input value="${esc(u.name)}" /></div>
        <div class="fld"><label>Email</label><input value="${esc(u.sub)}" readonly /></div>
        <div class="fld"><label>Notifications</label><select>
          <option ${s.notifications==='Enabled'?'selected':''}>Enabled</option>
          <option ${s.notifications==='Muted'?'selected':''}>Muted</option>
        </select></div>
        <div class="fld"><label>Privacy</label><select>
          <option ${s.privacy==='Show my name publicly'?'selected':''}>Show my name publicly</option>
          <option ${s.privacy==='Donate anonymously'?'selected':''}>Donate anonymously</option>
        </select></div>
      </div>
      <div class="modal-actions" style="justify-content:flex-end">
        <button class="abtn primary" data-action="save-settings">Save Settings</button>
      </div>
    </div></div>`;
  }

  function emptyBox(msg){ return `<div class="empty" style="grid-column:1/-1"><div class="ic">◌</div>${esc(msg)}</div>`; }

  /* ============================================================
     RENDER DISPATCH
     ============================================================ */
  function render(){
    const app = $('#app');
    if (!state.role){ app.innerHTML = ''; app.setAttribute('aria-hidden','true'); return; }
    app.setAttribute('aria-hidden','false');
    const role = state.role;
    let content = '', title = '', sub = '';

    if (role === 'donor') {
      if (state.page==='dashboard'){ title='Donor Dashboard'; sub='Verified cases & your impact'; content=donorDashboard(); }
      else if (state.page==='cases'){ title='Treatment Cases'; sub='Search & support verified patients'; content=donorCases(); }
      else if (state.page==='donations'){ title='My Donations'; sub='Your contribution history'; content=donorDonations(); }
      else if (state.page==='saved'){ title='Saved Cases'; sub='Cases you are following'; content=donorSaved(); }
      else if (state.page==='profile'){ title='Profile'; sub='Your donor account'; content=donorProfile(); }
      else if (state.page==='notifications'){ title='Notifications'; sub='Recent updates'; content=notificationsView(); }
      else if (state.page==='settings'){ title='Settings'; sub='Preferences & privacy'; content=settingsView(); }
      else { state.page='dashboard'; title='Donor Dashboard'; sub='Verified cases & your impact'; content=donorDashboard(); }
    } else if (role === 'hospital') {
      if (state.page==='dashboard'){ title='Hospital Dashboard'; sub=state.hospital.name+' · '+state.hospital.id; content=hospitalDashboard(); }
      else if (state.page==='cases'){ title='My Cases'; sub='Track every case through the pipeline'; content=hospitalCases(); }
      else if (state.page==='register'){ title='Register New Treatment Case'; sub='3-stage registration'; content=wizardView(); }
      else if (state.page==='notifications'){ title='Notifications'; sub='Recent updates'; content=notificationsView(); }
      else if (state.page==='settings'){ title='Settings'; sub='Preferences'; content=settingsView(); }
      else { state.page='dashboard'; title='Hospital Dashboard'; sub=state.hospital.name+' · '+state.hospital.id; content=hospitalDashboard(); }
    } else {
      if (state.page==='dashboard'){ title='Authority Dashboard'; sub='Review & verify treatment cases'; content=authorityDashboard(); }
      else if (state.page==='pending'){ title='Pending Cases'; sub='Awaiting verification'; content=authorityList('pending'); }
      else if (state.page==='approved'){ title='Approved Cases'; sub='Verified & fundable'; content=authorityList('approved'); }
      else if (state.page==='declined'){ title='Declined Cases'; sub='Returned to hospitals'; content=authorityList('declined'); }
      else if (state.page==='history'){ title='Verification History'; sub='Audit trail'; content=authorityHistory(); }
      else if (state.page==='notifications'){ title='Notifications'; sub='Recent updates'; content=notificationsView(); }
      else if (state.page==='settings'){ title='Settings'; sub='Preferences'; content=settingsView(); }
      else { state.page='dashboard'; title='Authority Dashboard'; sub='Review & verify treatment cases'; content=authorityDashboard(); }
    }

    const sc = window.scrollY;
    app.innerHTML = shell(content, title, sub);
    window.scrollTo(0, Math.min(sc, 0));
  }

  /* ============================================================
     ENTER / EXIT APP
     ============================================================ */
  function enter(role){
    state.role = role;
    state.page = 'dashboard';
    window.__lifelinkPaused = true;
    document.body.classList.remove('mode-landing');
    document.body.classList.add('mode-app');
    window.scrollTo(0,0);
    render();
    loadRoleData();
  }
  async function exit(callBackend = true){
    if (callBackend && token()) {
      try { await api('/auth/logout', { method:'POST' }); } catch (_) {}
    }
    localStorage.removeItem('lifelink_token');
    state = defaultState();
    localStorage.removeItem(KEY);
    window.__lifelinkPaused = false;
    document.body.classList.remove('mode-app');
    document.body.classList.add('mode-landing');
    $('#app').innerHTML = '';
    window.scrollTo(0,0);
  }

  /* ============================================================
     EVENT WIRING
     ============================================================ */
  // landing login buttons + forgot links + tabs
  document.addEventListener('click', function(e){
    const forgot = e.target.closest('[data-forgot]');
    if (forgot){
      e.preventDefault();
      const role = forgot.dataset.forgot || 'account';
      const form = forgot.closest('.auth-form');
      const input = form?.querySelector('input[name="email"]') || form?.querySelector('input[type="email"]') || form?.querySelector('input[type="text"]');
      const email = input?.value.trim();
      if (!email){ toast('Email required', 'Enter your registered email first.', 'bad'); return; }
      api('/auth/forgot-password', { method:'POST', body:JSON.stringify({email}) })
        .then(r => toast('Password reset', r.data.message, 'info'))
        .catch(err => toast('Reset request failed', err.message, 'bad'));
      return;
    }
    const tab = e.target.closest('.tab');
    if (tab){
      const name = tab.dataset.tab;
      tab.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t===tab));
      const form = tab.closest('.donor-card');
      form.querySelectorAll('[data-form]').forEach(f=>f.classList.toggle('hidden', f.dataset.form!==name));
      return;
    }
  });

  // Real authentication against the deployed LifeLink backend.
  document.addEventListener('submit', async function(e){
    const form = e.target.closest('.auth-form');
    if (!form) return;
    e.preventDefault();

    const role = form.dataset.role || 'account';
    const isRegister = form.dataset.form === 'register';

    try {
      if (isRegister) {
        const inputs = form.querySelectorAll('input');
        const name = inputs[0]?.value.trim();
        const email = inputs[1]?.value.trim();
        const password = inputs[2]?.value || '';
        if (!name || !email || !password) {
          toast('Missing fields', 'Please enter your name, email and password.', 'bad');
          return;
        }

        const result = await api('/auth/register', {
          method:'POST',
          body:JSON.stringify({ role:'donor', name, email, password })
        });
        localStorage.setItem('lifelink_token', result.data.token);
        state = defaultState();
        state.role = 'donor';
        state.page = 'dashboard';
        const u = result.data.user;
        state.donor = {
          ...state.donor, name:u.name || name, email:u.email || email,
          phone:u.phone || '', location:u.location || ''
        };
        save();
        document.body.classList.remove('mode-landing');
        document.body.classList.add('mode-app');
        window.__lifelinkPaused = true;
        render();
        await loadRoleData();
        toast('Account created', 'Welcome to LifeLink.', 'ok');
        return;
      }

      const emailInput = form.querySelector('input[name="email"]') || form.querySelector('input[type="text"]') || form.querySelector('input[type="email"]');
      const passwordInput = form.querySelector('input[name="password"]') || form.querySelector('input[type="password"]');
      const email = emailInput?.value.trim();
      const password = passwordInput?.value || '';

      if (!email || !password) {
        toast('Missing credentials', 'Please enter your ID/email and password.', 'bad');
        return;
      }

      const result = await api('/auth/login', {
        method:'POST',
        body:JSON.stringify({ email, password, role })
      });

      localStorage.setItem('lifelink_token', result.data.token);
      state = defaultState();
      state.role = result.data.user.role;
      state.page = 'dashboard';

      const u = result.data.user;
      if (u.role === 'donor') {
        state.donor = { ...state.donor, name:u.name||'', email:u.email||'', phone:u.phone||'', location:u.location||'' };
      } else if (u.role === 'hospital') {
        const h=u.hospital||{};
        state.hospital={...state.hospital,name:h.name||u.name||'',id:h.id||'',email:h.email||u.email||'',doctor:h.doctor||'',address:h.address||'',contact:h.contact||u.phone||''};
      } else if (u.role === 'authority') {
        const a=u.authority||{};
        state.authority={...state.authority,name:a.name||u.name||'',id:a.id||'',officer:a.officer||u.name||'',email:a.email||u.email||''};
      }

      save();
      document.body.classList.remove('mode-landing');
      document.body.classList.add('mode-app');
      window.__lifelinkPaused = true;
      render();
      await loadRoleData();
      toast('Login successful', `Welcome, ${u.name || email}.`, 'ok');
    } catch (err) {
      toast('Authentication failed', err.message, 'bad');
    }
  });

  // app interactions (delegated)
  document.addEventListener('click', function(e){
    const app = $('#app');
    if (!app.contains(e.target) && !e.target.closest('.modal-wrap')) return;

    const nav = e.target.closest('[data-nav]');
    if (nav){
      if (nav.dataset.nav === 'register'){ startWizard(); return; }
      state.page = nav.dataset.nav; save(); render(); return;
    }
    const act = e.target.closest('[data-action]');
    if (act){
      const a = act.dataset.action, id = act.dataset.id;
      if (a==='logout'){ exit(); return; }
      if (a==='menu'){ $('#appSide').classList.toggle('open'); $('#appScrim').classList.toggle('open'); return; }
      if (a==='close-modal'){ closeModal(); return; }
      if (a==='view'){ viewCase(id); return; }
      if (a==='donate'){ donateFlow(id); return; }
      if (a==='donate-quick'){ const inp=$('#donateAmt'); if(inp) inp.value=act.dataset.amt; return; }
      if (a==='confirm-donate'){ confirmDonate(id); return; }
      if (a==='toggle-save'){
        (async () => {
          try {
            const isSaved = state.donor.saved.includes(id);
            await api(`/saved/${encodeURIComponent(id)}`, { method:isSaved ? 'DELETE' : 'POST' });
            await loadRoleData();
            toast(isSaved ? 'Removed' : 'Saved', isSaved ? 'Removed from saved cases.' : 'Case saved.', 'info');
            if (modalEl) viewCase(id);
          } catch (err) {
            toast('Save failed', err.message, 'bad');
          }
        })();
        return;
      }
      if (a==='accept'){ acceptFlow(id); return; }
      if (a==='confirm-accept'){ confirmAccept(id); return; }
      if (a==='decline'){ declineFlow(id); return; }
      if (a==='confirm-decline'){ confirmDecline(id); return; }
      if (a==='resubmit'){ resubmit(id); return; }
      if (a==='mark-active'){
        changeCaseStatus(id, 'start', 'Treatment started', `${id} is now active.`);
        return;
      }
      if (a==='mark-complete'){
        changeCaseStatus(id, 'complete', 'Completed', `${id} marked as completed.`);
        return;
      }
      if (a==='clear-filters'){ state.filters={q:'',condition:'',type:'',amount:'',duration:'',location:'',sort:''}; save(); render(); return; }
      if (a==='wizard-cancel'){ state.wizard=null; state.page='cases'; render(); return; }
      if (a==='wizard-next'){ collectWizard(); if(validateStep()){ state.wizard.step++; render(); } return; }
      if (a==='wizard-back'){ collectWizard(); state.wizard.step--; render(); return; }
      if (a==='wizard-submit'){ collectWizard(); submitWizard(); return; }
      if (a==='doc-remove'){ state.wizard.docs = state.wizard.docs.filter(d=>d.key!==act.dataset.key); render(); return; }
      if (a==='mark-read'){
        (async () => {
          try {
            await api(`/notifications/${encodeURIComponent(id)}/read`, { method:'PUT' });
            await loadRoleData();
          } catch (err) { toast('Notification update failed', err.message, 'bad'); }
        })();
        return;
      }
      if (a==='mark-all-read'){
        (async () => {
          try {
            await api('/notifications/read-all', { method:'PUT' });
            await loadRoleData();
          } catch (err) { toast('Notification update failed', err.message, 'bad'); }
        })();
        return;
      }
      if (a==='save-settings'){
        const content = e.target.closest('.app-content');
        const fields = content ? content.querySelectorAll('.fld input, .fld select') : [];
        const name = fields[0]?.value;
        const email = fields[1]?.value;
        const notifications = fields[2]?.value;
        const privacy = fields[3]?.value;
        (async () => {
          try {
            if (name !== undefined || email !== undefined) {
              const body = {};
              if (name !== undefined) body.name = name;
              // Email is intentionally not editable by the backend profile API.
              await api('/profile', { method:'PUT', body:JSON.stringify(body) });
            }
            await api('/profile/settings', {
              method:'PUT',
              body:JSON.stringify({ notifications, privacy })
            });
            await refreshUser();
            await loadRoleData();
            toast('Saved','Your account settings were updated.', 'ok');
          } catch (err) {
            toast('Save failed', err.message, 'bad');
          }
        })();
        return;
      }
    }
    const ptab = e.target.closest('[data-ptab]');
    if (ptab){
      ptab.parentElement.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b===ptab));
      const body = $('#profileTabBody'); if (body) body.innerHTML = profileTab(ptab.dataset.ptab);
      return;
    }
  });

  // search + filters
  document.addEventListener('input', function(e){
    if (e.target.id === 'caseSearch'){
      state.filters.q = e.target.value;
      const list = applyFilters(verifiedCases());
      const grid = e.target.closest('.app-content');
      if (grid){ const g = grid.querySelector('.case-grid'); if (g) g.innerHTML = list.map(c=>caseCard(c,'donor')).join('') || emptyBox('No cases match your search'); }
      save();
    }
  });
  document.addEventListener('change', function(e){
    if (e.target.dataset && e.target.dataset.filter){
      state.filters[e.target.dataset.filter] = e.target.value; save(); render(); return;
    }
    if (e.target.dataset && e.target.dataset.doc){
      const file = e.target.files && e.target.files[0];
      if (file){ state.wizard.docs = state.wizard.docs.filter(d=>d.key!==e.target.dataset.doc);
        state.wizard.docs.push({key:e.target.dataset.doc, name:file.name, status:'Uploaded'}); render(); }
      return;
    }
  });

  function collectWizard(){
    if (!state.wizard || state.wizard.step!==1) return;
    $$('[data-w]').forEach(inp => { state.wizard.data[inp.dataset.w] = inp.value; });
  }
  function validateStep(){
    if (state.wizard.step===1){
      const d = state.wizard.data;
      const req = ['patientName','age','diagnosis','treatment','estimatedCost','durationDays'];
      const miss = req.filter(k=>!String(d[k]).trim());
      if (miss.length){ toast('Missing fields','Please complete: '+miss.join(', '),'bad'); return false; }
    }
    if (state.wizard.step===2){
      if (!state.wizard.docs.length){ toast('Documents required','Upload at least one document.','bad'); return false; }
    }
    return true;
  }

  // expose for landing script
  window.LifeLink = { enter, exit };

  // Resume an authenticated session after a page refresh.
  if (token()) {
    (async () => {
      try {
        await refreshUser();
        enter(state.role);
        state.page = state.page || 'dashboard';
        render();
      } catch (_) {
        localStorage.removeItem('lifelink_token');
        state = defaultState();
        save();
      }
    })();
  }
})();
