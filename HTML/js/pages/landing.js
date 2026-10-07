/* Landing page behaviour: i18n, guardrails, modals, role switcher, backend testbench (mock). */
(function () {
  'use strict';
  const D = window.DPDP;
  const esc = D.esc;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  let lang = D.store.get('lang', 'en');
  if (!window.TRANSLATIONS[lang]) lang = 'en';
  let activeRoleId = D.store.get('roleId', 'ACT-10');

  const SCREENS = [
    ['SCR-LOGIN-001', '🔐', 'Role Selection Login Screen', '15 Actor Roles / OTP / DigiLocker VT', '/portal/?login=true', 'Custom role-based view projections across 6 governance categories.'],
    ['SCR-DASH-001', '🏛️', 'Executive DPO Dashboard', 'Section 33(2) Evidentiary Defense Register', '/portal/?page=dashboard', 'Readiness score (84%), active consents (92%), and SLA tracking.'],
    ['SCR-CNS-001', '📋', 'Consent Management Engine', 'Sections 5, 6, 6(7) & Rule 4 Gateway', '/portal/?page=consent', 'Kantara v1.1.0 receipts, Section 6(4) withdrawal, and CM sandbox testbenches.'],
    ['SCR-RGT-001', '⚖️', 'Data Principal Rights Portal', 'Sections 11–12 & Rule 14 Triage', '/portal/?page=rights', '30-day SLA countdown timers (Access, Correction, Erasure holds).'],
    ['SCR-BRC-001', '🚨', 'Dual-Clock Breach Response', 'CERT-In 6h & DPBI 72h Form 1', '/portal/?page=breach', 'Tabletop Cyber Drill SIM-DRILL-2026-003 and Rule 7(1) 6-element intimation.'],
    ['SCR-INV-001', '🏢', 'Data Inventory & RoPA Register', 'Section 8 & Section 16 Data Residency', '/portal/?page=inventory', '13 municipal systems, SPII classifications, and zero foreign egress.'],
    ['SCR-GRV-001', '💬', 'Grievance Redressal Mechanism', 'Rule 14(2) 90-Day Statutory Ceiling', '/portal/?page=grievance', '4-tier escalation pyramid from Custodian to DPBI Tribunal.'],
    ['SCR-DPIA-001', '🔍', 'DPIA & Algorithmic Due Diligence', 'Section 10(2)(b) AI Profiling Reviews', '/portal/?page=dpia', 'Risk scoring, algorithmic transparency, and mitigating controls.'],
    ['SCR-RET-001', '⏳', 'Data Retention & Erasure Engine', 'Section 8(2) & Statutory Legal Holds', '/portal/?page=retention', 'Automated retention schedules and dry run erasure scans.'],
    ['SCR-INT-001', '🔌', 'Municipal Integration Hub & API', '4-Stage Certification Simulator & SDK', '/portal/?page=integration', 'Interactive API console, HMAC webhooks, and drop-in web components.'],
    ['SCR-ADM-001', '⚙️', 'Platform & User Administration', 'FIPS 140-3 HSM & Immutable Audit Log', '/portal/?page=admin', 'System health metrics, encryption key custody, and access controls.'],
    ['SCR-CTZ-001', '👤', 'Citizen & Guardian Self-Service', 'Trilingual (EN / GU / HI) & GIGW 3.0', '/portal/?role=citizen&page=citizen', '6 self-service tabs, consent preferences, nominee, and Section 14 heir designation.'],
  ];

  const ROLE_PAGES = { 'ACT-01': 'dashboard', 'ACT-02': 'dashboard', 'ACT-03': 'breach', 'ACT-04': 'consent', 'ACT-05': 'dashboard', 'ACT-06': 'rights', 'ACT-07': 'dpia', 'ACT-08': 'inventory', 'ACT-09': 'breach', 'ACT-10': 'citizen', 'ACT-11': 'citizen', 'ACT-12': 'admin', 'ACT-13': 'admin', 'ACT-14': 'admin', 'ACT-15': 'dashboard', 'ACT-16': 'dashboard' };

  const TONE_BADGE = { purple: 'badge-purple', blue: 'badge-blue', indigo: 'badge-blue', cyan: 'badge-blue', sky: 'badge-blue', violet: 'badge-purple', green: 'badge-green', emerald: 'badge-green', teal: 'badge-green', amber: 'badge-amber', yellow: 'badge-amber', orange: 'badge-amber', red: 'badge-red', rose: 'badge-red', slate: 'badge-slate' };
  const badgeFor = (r) => TONE_BADGE[r.tone] || 'badge-slate';

  /* ---------- i18n ---------- */
  function applyLang() {
    const t = window.TRANSLATIONS[lang];
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { if (t[el.dataset.i18n] != null) el.textContent = t[el.dataset.i18n]; });
    const mail = $('#dpoEmail'); mail.textContent = t.dpoEmail; mail.href = 'mailto:' + t.dpoEmail;
    const tel = $('#dpoPhone'); tel.textContent = t.dpoPhone; tel.href = 'tel:' + t.dpoPhone.replace(/[^+\d]/g, '');
    $$('#langSwitch button').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
  }
  $('#langSwitch').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-lang]'); if (!b) return;
    lang = b.dataset.lang; D.store.set('lang', lang); applyLang();
  });

  /* ---------- role pill ---------- */
  function renderRolePill() {
    const r = window.MUNICIPAL_ROLES.find((x) => x.id === activeRoleId) || window.MUNICIPAL_ROLES[9];
    const pill = $('#rolePill');
    pill.className = 'badge hide-md ' + badgeFor(r);
    pill.innerHTML = '🏢 ' + esc(r.id) + ': <strong>' + esc(r.title) + '</strong>';
  }

  /* ---------- guardrails ---------- */
  $('#guardList').innerHTML = window.STATUTORY_INVARIANTS.map((i) =>
    '<div class="guard-item"><div class="t"><span>#' + i.id + '. ' + esc(i.title) + '</span><span class="ok">✔ ' + esc(i.status) + '</span></div><div class="b">' + esc(i.statutoryBasis) + '</div><div class="r">' + esc(i.technicalRule) + '</div></div>').join('');
  $('#guardToggle').addEventListener('click', function () {
    const list = $('#guardList'); const open = list.classList.toggle('hidden') === false;
    this.setAttribute('aria-expanded', String(open));
    this.textContent = open ? 'Hide Statutory Guardrails ▴' : 'Audit 10 Guardrails ▾';
  });

  /* ---------- 12 screens ---------- */
  $('#screenGrid').innerHTML = SCREENS.map((s) =>
    '<a class="tile" href="' + s[4] + '"><div><div class="id"><span>' + s[0] + '</span><span style="font-size:20px">' + s[1] + '</span></div><h3>' + esc(s[2]) + '</h3><p>' + esc(s[5]) + '</p></div><div class="foot"><span class="c">' + esc(s[3]) + '</span><span class="go">Launch →</span></div></a>').join('');

  /* ---------- Kantara receipt / refusal modals ---------- */
  $('#btnReceipt').addEventListener('click', () => {
    const receipt = {
      '@context': 'https://kantara.org/receipt/v1.1.0',
      receiptId: 'REC-KANTARA-2026-90412',
      issuanceDate: new Date().toISOString(),
      dataFiduciary: { legalName: 'Ahmedabad Municipal Corporation', cinOrUlbCode: 'ULB-GJ-AMC-001', dpoContact: 'dpo@ahmedabadcity.gov.in' },
      dataPrincipalBlindIndex: 'HMAC-SHA256:7B8C4...90A2',
      purposes: [{ code: 'WATER_UTILITY_DELIVERY', legalBasis: 'Section 6(1) DPDP Act 2023', description: 'Meter reading, billing, and municipal water line grievance resolution', retentionPeriod: 'Service active duration + 3 fiscal audit years' }],
      withdrawalMechanism: 'DPDP-GovShield Citizen Portal -> Self-Service Privacy Center',
      digitalSignature: { algorithm: 'RS256', keyId: 'amc-dpo-pk-2026', signatureBase64: 'MEQCIDw8452...48a2=' },
    };
    const json = JSON.stringify(receipt, null, 2);
    const m = D.openModal(
      '<div class="modal-head"><div><h3>Kantara v1.1.0 Consent Receipt Specimen</h3><p class="small mono muted" style="margin:2px 0 0">Digital Signature: RS256 2048-bit</p></div><button class="x" data-close aria-label="Close">×</button></div>' +
      '<pre class="code-block">' + esc(json) + '</pre>' +
      '<div class="row" style="margin-top:16px"><button class="btn btn-outline" id="dlReceipt">⬇ Download JSON</button><button class="btn btn-primary" data-close style="flex:1">' + esc(window.TRANSLATIONS[lang].closeText) + '</button></div>');
    $('#dlReceipt', m.root).addEventListener('click', () => D.download('kantara-consent-receipt.json', json));
  });

  function refusalModal(n) {
    const t = window.TRANSLATIONS[lang];
    D.openModal(
      '<div class="modal-head"><div class="row" style="flex-wrap:nowrap"><div class="icon-chip tone-amber" style="margin:0">⚠️</div><div><h3>' + esc(t.refusalNoticeTitle) + '</h3><p class="small mono muted" style="margin:0">Notice ID: ' + esc(n.noticeId) + '</p></div></div><button class="x" data-close aria-label="Close">×</button></div>' +
      '<div class="alert alert-warn" style="border-left:4px solid var(--c-accent)"><strong>Statutory Notice under Section 17(4)</strong><p style="margin:4px 0 0;color:inherit;font-size:12px">' + esc(t.appealNotice) + '</p></div>' +
      '<div class="kv"><strong>Municipal Service / Record:</strong> ' + esc(n.serviceName) + '</div>' +
      '<div class="kv"><strong>Statutory Ground:</strong> ' + esc(n.statutoryGround) + '</div>' +
      '<div class="kv"><strong>Municipal Retention Mandate:</strong> ' + esc(n.municipalRetentionMandate) + '</div>' +
      '<div class="kv"><strong>Factual Reasoning:</strong><p style="margin:4px 0 0;padding:10px;background:var(--c-bg);border:1px solid var(--c-border);border-radius:8px;font-style:italic;color:var(--c-text-muted);font-size:12px">' + esc(n.factualReasoning) + '</p></div>' +
      '<h4 class="small" style="text-transform:uppercase;letter-spacing:.05em;margin:16px 0 0">Three-Tier Statutory Appeal Routes</h4>' +
      n.appealRoutes.map((r) => '<div class="appeal"><strong>Tier ' + r.tier + ': ' + esc(r.forum) + '</strong><div class="xsmall muted">Filing Window: ' + esc(r.filingWindow) + '</div><div class="xsmall mono" style="color:var(--c-primary-hover)">' + esc(r.contactUrlOrEmail) + '</div></div>').join('') +
      '<div class="row-between small mono muted" style="margin-top:16px;padding-top:12px;border-top:1px solid var(--c-border)"><span>Reviewing Officer: <strong>' + esc(n.reviewingOfficerName) + '</strong> (' + esc(n.reviewingOfficerDesignation) + ')</span><span class="xsmall">SHA-256: <code>' + esc(n.sha256Checksum.slice(0, 16)) + '...</code></span></div>' +
      '<button class="btn btn-dark btn-block" data-close style="margin-top:16px">' + esc(t.closeText) + '</button>');
  }
  $('#btnRefusal').addEventListener('click', async function () {
    this.disabled = true; this.textContent = 'Generating...';
    const n = await window.MockEngine.generateErasureRefusal({
      requestId: 'REQ-ERASURE-2026-8819', principalId: '018dc3f0-4a8b-7000-84c2-261543881900', department: 'SYS001_PropertyTax',
      serviceName: 'Assessment Roll of Municipal Property Tax (Danapith Ward)',
      retentionCitation: 'Section 151 of Gujarat Provincial Municipal Corporations (GPMC) Act, 1949 (Statutory Permanent Assessment Mandate)',
      officerName: 'Smt. Vaishali Dave', officerDesignation: 'Assistant Municipal Commissioner / Custodian of Revenue Records',
    });
    this.disabled = false; this.textContent = 'Simulate Sec 17(4) Refusal Notice';
    refusalModal(n);
  });

  /* ---------- Auth modal ---------- */
  function openAuth() {
    let tab = 'roles', cat = 'All';
    const CATS = ['All', 'Leadership', 'Operations', 'Citizen & Oversight'];
    const m = D.openModal(
      '<div class="auth-head"><div class="row" style="flex-wrap:nowrap"><span style="font-size:24px">🛡️</span><div><h2>Municipal Officer &amp; Citizen Authentication</h2><p>Zero Plaintext Aadhaar • DigiLocker VT • 16-Role Perspective Switcher</p></div></div><button class="x" data-close aria-label="Close">×</button></div>' +
      '<div class="modal-tabs" id="authTabs"><button data-t="roles" class="active">👥 16 Municipal Roles</button><button data-t="otp">📱 Mobile OTP Login</button><button data-t="digilocker">🔑 DigiLocker VT</button></div>' +
      '<div class="auth-body" id="authBody"></div>' +
      '<div class="auth-foot"><span>🏢 Ahmedabad Municipal Corporation (AMC)</span><span class="mono xsmall faint">OIDC / OAuth 2.0 PKCE Sovereign Mesh</span></div>');
    m.root.firstElementChild.classList.add('auth');
    const body = $('#authBody', m.root);

    function renderRoles() {
      const roles = window.MUNICIPAL_ROLES.filter((r) => cat === 'All' || r.category === cat);
      body.innerHTML =
        '<div class="row-between" style="margin-bottom:12px"><p class="small muted" style="margin:0">Switch active persona to inspect departmental views, RLS policies, and governance powers:</p><div class="seg">' +
        CATS.map((c) => '<button type="button" data-cat="' + esc(c) + '" class="' + (c === cat ? 'active' : '') + '">' + esc(c) + '</button>').join('') + '</div></div>' +
        '<div class="grid grid-2" style="gap:12px">' + roles.map((r) => {
          const on = r.id === activeRoleId;
          return '<button type="button" class="role-card' + (on ? ' active' : '') + '" data-role="' + r.id + '"><div><div class="row-between"><span class="mono bold small" style="color:var(--c-primary)">' + r.id + '</span><span class="badge ' + badgeFor(r) + '">' + esc(r.authorityLevel) + '</span></div><h4>' + esc(r.title) + (on ? ' ✔' : '') + '</h4><p>' + esc(r.description) + '</p></div><div class="meta"><span>Category: ' + esc(r.category) + '</span><span style="color:var(--c-primary-hover);font-weight:600">' + (on ? 'Active Persona' : 'Select Role →') + '</span></div></button>';
        }).join('') + '</div>';
    }
    function renderOtp(state) {
      state = state || {};
      body.innerHTML = '<div class="auth-narrow stack"><div class="text-center"><div class="icon-chip tone-green" style="margin:0 auto 8px;border-radius:50%;width:48px;height:48px">📱</div><h3 style="margin:0">Mobile OTP Authentication</h3><p class="small muted" style="margin:4px 0 0">Enter citizen or registered municipal officer mobile number</p></div>' +
        (!state.sent
          ? '<form id="otpForm" class="stack" novalidate><div><label class="lbl" for="mob">10-Digit Mobile Number</label><div class="row" style="gap:0;flex-wrap:nowrap"><span class="mono small" style="padding:9px 12px;background:var(--c-bg-alt);border:1px solid var(--c-border-strong);border-right:0;border-radius:8px 0 0 8px">+91</span><input id="mob" class="field mono" style="border-radius:0 8px 8px 0" type="tel" inputmode="numeric" maxlength="10" placeholder="9879012345" autocomplete="tel-national"></div><div class="err" id="mobErr"></div></div><button class="btn btn-primary btn-block" type="submit">Send One-Time Password (OTP)</button></form>'
          : '<form id="otpVerify" class="stack" novalidate><div class="alert alert-ok">OTP sent to +91 ' + esc(state.mobile) + '. (Specimen Test OTP: <strong>849201</strong>)</div><div><label class="lbl" for="otp">Enter 6-Digit OTP</label><input id="otp" class="field mono" style="text-align:center;letter-spacing:.3em;font-size:18px" maxlength="6" inputmode="numeric" value="849201"><div class="err" id="otpErr"></div></div><button class="btn btn-success btn-block" type="submit" id="otpBtn">Verify &amp; Enter Portal</button></form>') +
        '<div class="alert" style="background:var(--c-bg);border-color:var(--c-border);font-size:11px;color:var(--c-text-muted)"><strong style="color:var(--c-dark-3)">🔒 Invariant #3 Zero Plaintext Aadhaar</strong><p style="margin:4px 0 0;color:inherit;font-size:11px">Aadhaar numbers are never captured or queried in cleartext. Lookups occur through HMAC-SHA256 blind indexing against isolated cryptographic salt.</p></div></div>';
      const f = $('#otpForm', body);
      if (f) f.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = $('#mob', body).value.trim();
        if (!/^[6-9][0-9]{9}$/.test(v)) { $('#mobErr', body).textContent = 'Enter a valid 10-digit Indian mobile number starting with 6-9.'; return; }
        renderOtp({ sent: true, mobile: v });
      });
      const v2 = $('#otpVerify', body);
      if (v2) v2.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test($('#otp', body).value.trim())) { $('#otpErr', body).textContent = 'OTP must be 6 digits.'; return; }
        $('#otpBtn', body).textContent = 'Verified! Logging in...'; $('#otpBtn', body).disabled = true;
        setRole('ACT-10'); setTimeout(() => { location.href = '/portal/?role=citizen&page=citizen'; }, 800);
      });
    }
    function renderDl(state) {
      state = state || {};
      body.innerHTML = '<div class="auth-narrow stack"><div class="text-center"><div class="icon-chip tone-amber" style="margin:0 auto 8px;border-radius:50%;width:48px;height:48px">🔑</div><h3 style="margin:0">DigiLocker Virtual Token Gateway</h3><p class="small muted" style="margin:4px 0 0">MeitY DigiLocker Sovereign Virtual ID / Guardian Linkage Token</p></div>' +
        '<form id="dlForm" class="stack" novalidate><div><label class="lbl" for="dlTok">DigiLocker Virtual Token / Consent ID</label><input id="dlTok" class="field mono" placeholder="VPC-DL-2026-098842 or DL-VT-XXXX" value="' + esc(state.token || '') + '"><div class="err" id="dlErr"></div></div><button type="button" class="btn btn-outline btn-sm" id="dlSample">Use Sample Token</button><button class="btn btn-block" style="background:#d97706;color:#fff" type="submit" id="dlBtn">Verify DigiLocker Virtual Token</button></form>' +
        '<div class="alert alert-warn" style="font-size:11px"><strong>🛡️ Rule 10 Verifiable Parental Consent (VPC)</strong><p style="margin:4px 0 0;color:inherit;font-size:11px">Cryptographically proves parent-child relationship via DigiLocker metadata without exposing Aadhaar or student biometrics.</p></div></div>';
      $('#dlSample', body).addEventListener('click', () => { $('#dlTok', body).value = 'VPC-DL-2026-098842'; });
      $('#dlForm', body).addEventListener('submit', (e) => {
        e.preventDefault();
        const tok = $('#dlTok', body).value.trim();
        if (!/^(VPC-DL|DL-VT)-[A-Za-z0-9-]{3,}$/.test(tok)) { $('#dlErr', body).textContent = 'Token must look like VPC-DL-2026-098842 or DL-VT-XXXX.'; return; }
        const b = $('#dlBtn', body); b.disabled = true; b.textContent = 'Cryptographically Attesting...';
        setTimeout(() => { b.textContent = 'Attested! Switching to Verified Guardian...'; setRole('ACT-11'); setTimeout(() => { location.href = '/portal/?role=guardian&page=citizen'; }, 800); }, 800);
      });
    }
    function render() { ({ roles: renderRoles, otp: renderOtp, digilocker: renderDl })[tab](); }
    $('#authTabs', m.root).addEventListener('click', (e) => {
      const b = e.target.closest('button[data-t]'); if (!b) return;
      tab = b.dataset.t; $$('#authTabs button', m.root).forEach((x) => x.classList.toggle('active', x === b)); render();
    });
    body.addEventListener('click', (e) => {
      const c = e.target.closest('[data-cat]'); if (c) { cat = c.dataset.cat; renderRoles(); return; }
      const r = e.target.closest('[data-role]');
      if (r) { setRole(r.dataset.role); location.href = '/portal/?role=' + r.dataset.role + '&page=' + (ROLE_PAGES[r.dataset.role] || 'dashboard'); }
    });
    render();
  }
  function setRole(id) { activeRoleId = id; D.store.set('roleId', id); renderRolePill(); }
  $$('[data-open-auth]').forEach((b) => b.addEventListener('click', openAuth));
  $('#rolePill').addEventListener('click', openAuth);

  /* ---------- Backend testbench (mock engines) ---------- */
  const DEPTS = ['SYS001_PropertyTax', 'SYS002_ProfessionalTax', 'SYS003_VehicleTransport', 'SYS004_BirthDeath', 'SYS005_HealthHospital', 'SYS006_WaterUtility', 'SYS007_BuildingPermissions', 'SYS008_SolidWaste', 'SYS009_FireNoc', 'SYS010_CommunityScholarships', 'SYS011_EngineeringDrainage', 'SYS012_EstateLand', 'SYS013_PublicGrievance'];
  const BASES = ['Sec6Consent', 'Sec7aVoluntary', 'Sec7bStateService', 'Sec7cStateFunction'];
  const opts = (arr, sel) => arr.map((v) => '<option value="' + v + '"' + (v === sel ? ' selected' : '') + '>' + v + '</option>').join('');
  const out = (html) => '<div class="tb-out" id="tbOut" aria-live="polite">' + html + '</div>';
  const idle = '<span class="faint">Run the request to see the response.</span>';

  const TB = {
    child() {
      return '<div class="tb-grid"><form class="tb-form" id="tbForm" novalidate><h4>🛡 Section 9 &amp; Rule 12 Child Classifier</h4>' +
        '<label for="cDept">Municipal Department:</label><select id="cDept" class="field">' + opts(DEPTS, 'SYS010_CommunityScholarships') + '</select>' +
        '<label for="cBasis">Requested Legal Basis:</label><select id="cBasis" class="field">' + opts(BASES, 'Sec7bStateService') + '</select>' +
        '<label for="cAge">Applicant Age: <strong id="cAgeV">14</strong></label><input id="cAge" type="range" min="1" max="30" value="14" style="width:100%">' +
        '<div class="chk"><input id="cBen" type="checkbox" checked><label for="cBen">Benefit under law / public funds</label></div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:16px" type="submit">▶ POST /api/v1/compliance/classify-child</button></form>' + out(idle) + '</div>';
    },
    erasure() {
      return '<div class="tb-grid"><form class="tb-form" id="tbForm" novalidate><h4>📄 Section 17(4) Erasure Refusal</h4>' +
        '<label for="eDept">Municipal Department:</label><select id="eDept" class="field">' + opts(DEPTS, 'SYS001_PropertyTax') + '</select>' +
        '<label for="eSvc">Service / Activity Name:</label><input id="eSvc" class="field" value="Municipal Assessment Roll of Property Taxes">' +
        '<label for="eCit">Statutory Retention Citation:</label><input id="eCit" class="field" value="Section 151 of GPMC Act, 1949">' +
        '<div class="err" id="tbErr"></div><button class="btn btn-primary btn-block" style="margin-top:16px" type="submit">▶ POST /api/v1/rights/erasure-refusal</button></form>' + out(idle) + '</div>';
    },
    crypto() {
      return '<div class="tb-grid"><form class="tb-form" id="tbForm" novalidate><h4>🔑 HMAC-SHA256 Blind Index</h4>' +
        '<label for="kType">Identifier Type:</label><select id="kType" class="field">' + opts(['property_no', 'water_connection_no', 'mobile', 'email', 'digilocker_vt'], 'property_no') + '</select>' +
        '<label for="kVal">Raw Input Value (e.g. Property / Mobile / VT):</label><input id="kVal" class="field mono" value="AMC-PROP-WEST-98214">' +
        '<div class="alert alert-error hidden" id="tbErr" style="margin-top:10px;font-size:12px"></div><button class="btn btn-primary btn-block" style="margin-top:16px" type="submit">▶ POST /api/v1/crypto/blind-index</button>' +
        '<p class="xsmall" style="color:#94a3b8;margin:8px 0 0">Tip: try a 12-digit Aadhaar-like number (e.g. 2345 6789 0123) to see Invariant #3 block it.</p></form>' + out(idle) + '</div>';
    },
    incident() {
      return '<div class="tb-grid"><form class="tb-form" id="tbForm" novalidate><h4>⏱ Dual-Clock Incident Declaration</h4>' +
        '<label for="iId">Incident Code / ID:</label><input id="iId" class="field mono" value="2026-0902-SEC">' +
        '<label for="iSev">Severity Tier:</label><select id="iSev" class="field">' + opts(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], 'HIGH') + '</select>' +
        '<label for="iDept">Municipal Department:</label><select id="iDept" class="field">' + opts(DEPTS, 'SYS004_BirthDeath') + '</select>' +
        '<div class="chk"><input id="iDrill" type="checkbox" checked><label for="iDrill">Tabletop drill (watermark with SIM-DRILL-)</label></div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:16px" type="submit">▶ POST /api/v1/incidents/declare</button></form>' + out(idle) + '</div>';
    },
  };

  const kv = (k, v) => '<div style="margin:4px 0"><span style="color:#94a3b8">' + k + ':</span> ' + v + '</div>';
  const jsonPre = (o) => '<pre>' + esc(JSON.stringify(o, null, 2)) + '</pre>';

  const HANDLERS = {
    async child() {
      const r = await window.MockEngine.classifyChild({ serviceName: 'Municipal Merit Scholarship for Minor Students', department: $('#cDept').value, requestedBasis: $('#cBasis').value, applicantAge: +$('#cAge').value, isBenefitUnderLawOrPublicFunds: $('#cBen').checked });
      return kv('Condition', '<span class="ok">' + esc(r.childCondition) + '</span>') + kv('Legal basis', esc(r.legalBasis)) + kv('Exemption record', esc(r.exemptionRecordId || '—')) +
        '<div class="note"><strong>Statutory Guardrail:</strong> VPC Required: <strong>' + r.vpcRequired + '</strong>. Anti-Profiling Enforced: <strong>' + r.antiProfilingEnforced + '</strong>.<br>' + esc(r.legalJustification) + '</div>' + jsonPre(r);
    },
    async erasure() {
      const svc = $('#eSvc').value.trim(), cit = $('#eCit').value.trim();
      if (!svc) throw new Error('Service / Activity Name is required.');
      const n = await window.MockEngine.generateErasureRefusal({ requestId: 'RR-REQ-' + String(Date.now()).slice(-6), principalId: '018dc3f0-4a8b-7000-84c2-261543881900', department: $('#eDept').value, serviceName: svc, retentionCitation: cit, officerName: 'Smt. Vaishali Dave', officerDesignation: 'Assistant Municipal Commissioner / Revenue Custodian' });
      window.__lastNotice = n;
      return '<div class="ok">Notice ' + esc(n.noticeId) + ' signed under Section 17(4) with ' + n.appealRoutes.length + ' appeal routes.</div>' + kv('Ground', esc(n.statutoryGround)) + kv('Mandate', esc(n.municipalRetentionMandate)) +
        '<button type="button" class="btn btn-accent btn-sm" id="viewNotice" style="margin-top:10px">View full notice</button>' + jsonPre(n);
    },
    async crypto() {
      const raw = $('#kVal').value;
      if (!raw.trim()) throw new Error('A raw input value is required.');
      const s = window.validateAadhaarSafety(raw);
      if (!s.isSafe) throw new Error(s.reason);
      const r = await window.MockEngine.computeBlindIndex({ identifierType: $('#kType').value, rawValue: raw });
      return '<div class="ok">Blind index computed (raw value never stored).</div>' + kv('Normalized', esc(r.normalized)) + kv('Index Hex', '<span style="color:#fbbf24" class="mono">' + esc(r.blindIndexHex.slice(0, 24)) + '...</span>') + jsonPre(r);
    },
    async incident() {
      const id = $('#iId').value.trim();
      if (!id) throw new Error('Incident code is required.');
      const r = await window.MockEngine.declareIncident({ incidentId: id, isTabletopDrill: $('#iDrill').checked, severity: $('#iSev').value, department: $('#iDept').value, estimatedPrincipalsAffected: 2400 });
      return kv('Watermarked ID', '<strong style="color:#fbbf24">' + esc(r.incidentId) + '</strong>') + kv('CERT-In 6h deadline', esc(D.fmtDate(r.certIn6hDeadline))) + kv('DPBI 72h deadline', esc(D.fmtDate(r.dpbi72hDetailedDeadline))) +
        '<div class="note">' + Object.values(r.statutoryNotices).map((x) => '• ' + esc(x)).join('<br>') + '</div>';
    },
  };

  let tbTab = 'child';
  function renderTb() {
    $$('#tbTabs button').forEach((b) => { const on = b.dataset.tab === tbTab; b.classList.toggle('btn-primary', on); b.classList.toggle('btn-dark', !on); });
    $('#tbBody').innerHTML = TB[tbTab]();
    const age = $('#cAge'); if (age) age.addEventListener('input', () => { $('#cAgeV').textContent = age.value; });
    $('#tbForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const o = $('#tbOut'), err = $('#tbErr'), btn = $('#tbForm button[type=submit]');
      if (err) { err.textContent = ''; err.classList.add('hidden'); }
      btn.disabled = true; o.innerHTML = '<span class="spinner"></span> Evaluating...';
      try {
        o.innerHTML = await HANDLERS[tbTab]();
        const vn = $('#viewNotice'); if (vn) vn.addEventListener('click', () => refusalModal(window.__lastNotice));
      } catch (ex) {
        o.innerHTML = '<span class="bad">⚠ ' + esc(ex.message) + '</span>';
        if (err) { err.textContent = ex.message; err.classList.remove('hidden'); }
      } finally { btn.disabled = false; }
    });
  }
  $('#tbTabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-tab]'); if (b) { tbTab = b.dataset.tab; renderTb(); } });

  applyLang(); renderRolePill(); renderTb();
})();
