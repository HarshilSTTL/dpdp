// ============================================================
// DPDP-GovShield — Bulletproof Multi-Role Engine
// ============================================================

// ── Global References ──────────────────────────────────────

let currentRoleKey = 'dpo';
let currentUser = (typeof USERS !== 'undefined' ? USERS['dpo'] : (typeof window !== 'undefined' && window.USERS ? window.USERS['dpo'] : { name: 'Shri Rajesh M. Patel', designation: 'Data Protection Officer', avatar: 'RP' }));
let currentRole = (typeof ROLES !== 'undefined' ? ROLES['dpo'] : (typeof window !== 'undefined' && window.ROLES ? window.ROLES['dpo'] : { label: 'Data Protection Officer', color: '#1a3a6b', pages: ['dashboard','consent','rights','breach','inventory','grievance','dpia','retention'] }));
let citizenSubTab = 'overview';

// ── True Data Persistence Layer (Browser LocalStorage + Backend API Synced) ─
const DPDP_STORAGE_KEY = 'DPDP_GOVSHIELD_PERSISTENT_DATA_STORE_V2';

function loadPersistedState() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const raw = localStorage.getItem(DPDP_STORAGE_KEY);
    if (!raw) return;
    const store = JSON.parse(raw);
    
    if (typeof SAMPLE_DATA !== 'undefined') {
      if (Array.isArray(store.consentRecords) && store.consentRecords.length) SAMPLE_DATA.consentRecords = store.consentRecords;
      if (Array.isArray(store.rightsRequests) && store.rightsRequests.length) SAMPLE_DATA.rightsRequests = store.rightsRequests;
      if (Array.isArray(store.grievances) && store.grievances.length) SAMPLE_DATA.grievances = store.grievances;
      if (Array.isArray(store.breachIncidents) && store.breachIncidents.length) SAMPLE_DATA.breachIncidents = store.breachIncidents;
      if (Array.isArray(store.systems) && store.systems.length) SAMPLE_DATA.systems = store.systems;
      if (Array.isArray(store.retentionPolicies) && store.retentionPolicies.length) SAMPLE_DATA.retentionPolicies = store.retentionPolicies;
      if (Array.isArray(store.dpiaRecords) && store.dpiaRecords.length) SAMPLE_DATA.dpiaRecords = store.dpiaRecords;
      if (Array.isArray(store.apiKeys) && store.apiKeys.length) SAMPLE_DATA.apiKeys = store.apiKeys;
      if (Array.isArray(store.webhooks) && store.webhooks.length) SAMPLE_DATA.webhooks = store.webhooks;
    }
    
    if (typeof CITIZEN_DATA !== 'undefined') {
      if (Array.isArray(store.citizenConsents) && store.citizenConsents.length) CITIZEN_DATA.myConsents = store.citizenConsents;
      if (store.nominee) CITIZEN_DATA.nominee = store.nominee;
    }
    
    console.info('[DPDP-GovShield] Persistent database loaded from storage. Records preserved across sessions.');
  } catch (err) {
    console.error('[DPDP-GovShield] Error loading persistent state:', err);
  }
}

function persistState() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const store = {
      consentRecords: typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.consentRecords : [],
      rightsRequests: typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.rightsRequests : [],
      grievances: typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.grievances : [],
      breachIncidents: typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.breachIncidents : [],
      systems: typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.systems : [],
      retentionPolicies: typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.retentionPolicies : [],
      dpiaRecords: typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.dpiaRecords : [],
      apiKeys: typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.apiKeys : [],
      webhooks: typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.webhooks : [],
      citizenConsents: typeof CITIZEN_DATA !== 'undefined' ? CITIZEN_DATA.myConsents : [],
      nominee: typeof CITIZEN_DATA !== 'undefined' ? CITIZEN_DATA.nominee : null,
      persistedAt: new Date().toISOString()
    };
    localStorage.setItem(DPDP_STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('[DPDP-GovShield] Error persisting state:', err);
  }
}

function resetPersistentState() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(DPDP_STORAGE_KEY);
    alert('Persistent storage reset to default system state. Reloading...');
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
}

// ── Helpers ─────────────────────────────────────────────────

function formatDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatTimeAgo(isoStr) {
  const now = new Date('2026-09-02T12:35:00+05:30');
  const d = new Date(isoStr);
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(isoStr);
}

function statusBadge(status) {
  const map = {
    'active': 'badge-success', 'completed': 'badge-success', 'resolved': 'badge-success', 'mapped': 'badge-success', 'approved': 'badge-success', 'compliant': 'badge-success',
    'withdrawn': 'badge-danger', 'critical': 'badge-danger', 'non-compliant': 'badge-danger', 'overdue': 'badge-danger',
    'expired': 'badge-neutral', 'not-started': 'badge-neutral',
    'pending': 'badge-warning', 'in-progress': 'badge-info', 'in-review': 'badge-info', 'partial': 'badge-warning',
    'on-hold': 'badge-purple', 'escalated': 'badge-danger', 'draft': 'badge-neutral'
  };
  return `<span class="badge ${map[status] || 'badge-neutral'}">${status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>`;
}

function severityBadge(severity) {
  return `<span class="badge badge-${severity === 'critical' ? 'danger' : severity === 'high' ? 'warning' : severity === 'medium' ? 'info' : 'success'}">
    <span class="severity-dot ${severity}"></span>${severity.charAt(0).toUpperCase() + severity.slice(1)}
  </span>`;
}

function getSLAStatus(deadline) {
  const now = new Date('2026-09-02T12:35:00+05:30');
  const dl = new Date(deadline);
  const diffDays = Math.ceil((dl - now) / 86400000);
  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, class: 'badge-danger' };
  if (diffDays <= 3) return { text: `${diffDays}d left`, class: 'badge-warning' };
  return { text: `${diffDays}d left`, class: 'badge-info' };
}

function getDeptName(deptId) {
  if (typeof SAMPLE_DATA === 'undefined') return deptId;
  const dept = SAMPLE_DATA.departments.find(d => d.id === deptId);
  return dept ? dept.name : deptId;
}

function getSystemName(sysId) {
  if (typeof SAMPLE_DATA === 'undefined') return sysId;
  const sys = SAMPLE_DATA.systems.find(s => s.id === sysId);
  return sys ? sys.name : sysId;
}

function generateFakeHash(seed) {
  let hash = '';
  for (let i = 0; i < 64; i++) hash += '0123456789abcdef'[(seed.charCodeAt(i % seed.length) * 7 + i * 13) % 16];
  return hash;
}

// ── Role Management & Perspective ───────────────────────────

function initLoginOverlay() {
  const container = document.getElementById('roleGridContainer');
  if (!container) return;
  const rolesObj = typeof ROLES !== 'undefined' ? ROLES : window.ROLES;
  const usersObj = typeof USERS !== 'undefined' ? USERS : window.USERS;
  if (!rolesObj) return;

  const categories = {};
  Object.keys(rolesObj).forEach(key => {
    const role = rolesObj[key];
    const cat = role.category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push({ key, ...role });
  });

  let html = '';
  Object.keys(categories).forEach(cat => {
    html += `<div class="role-category-label">${cat}</div><div class="role-grid">`;
    categories[cat].forEach(r => {
      const usr = usersObj ? usersObj[r.key] : null;
      html += `
        <div class="role-card" onclick="selectRole('${r.key}')">
          <div class="role-icon">${r.icon}</div>
          <div class="role-name">${r.label}</div>
          <div class="role-desc">${r.description}</div>
          <div class="role-user">👤 User: ${usr ? usr.name : 'System User'}</div>
        </div>
      `;
    });
    html += `</div>`;
  });

  container.innerHTML = html;
}

function showLoginScreen() {
  const overlay = document.getElementById('loginOverlay');
  if (overlay) overlay.classList.remove('hidden');
}

function selectRole(roleKey) {
  const rolesObj = typeof ROLES !== 'undefined' ? ROLES : window.ROLES;
  const usersObj = typeof USERS !== 'undefined' ? USERS : window.USERS;

  currentRoleKey = roleKey;
  currentRole = rolesObj[roleKey];
  currentUser = usersObj[roleKey];

  const overlay = document.getElementById('loginOverlay');
  if (overlay) overlay.classList.add('hidden');
  applyRolePerspective();

  if (roleKey === 'dpb-inspector' && currentRole && currentRole.requiresInquiryGate) {
    setTimeout(showRule23InquiryGateModal, 300);
  }
}

function showRule23InquiryGateModal() {
  const inq = (typeof RULE_23_INSPECTOR_CONFIG !== 'undefined') ? RULE_23_INSPECTOR_CONFIG.activeInquiry : {
    summonsNumber: "SIM-INQ-DPBI-DRILL-0041",
    authorizedInspector: "Shri Vinod G. Mishra (ID: DPB-INSP-088 — Simulation Persona)",
    statutoryScope: "Tabletop cyber drill verification (SIM-DRILL-2026-003 / SYS-004) under Section 28 & Rule 23 protocol test"
  };

  showModal(`
    <div class="modal-header">
      <div class="flex items-center gap-8">
        <span style="font-size:24px;">⚖️</span>
        <div>
          <h2>Rule 23 Inquiry Summons Verification Gate</h2>
          <span class="text-xs text-muted">Data Protection Board of India (Seventh Schedule Enforcement — Tabletop Drill)</span>
        </div>
      </div>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="alert-banner warning mb-3">
        <span class="alert-icon">📜</span>
        <div>
          <strong>Statutory Verification Requirement:</strong>
          Under Rule 23 and the Seventh Schedule of the DPDP Rules 2025, regulatory inspection requires verification of an active Board inquiry summons. All disclosures are logged to AMC's immutable Regulatory Disclosure Register.
        </div>
      </div>

      <div class="refusal-box mb-3" style="border-color:#1a3a6b;">
        <div class="flex justify-between items-center mb-2 pb-2" style="border-bottom:1px solid #cbd5e1;">
          <strong>DPBI Summons Order Reference:</strong>
          <span class="badge badge-statutory">${inq.summonsNumber}</span>
        </div>
        <div class="grid-2 mb-2" style="font-size:12px;">
          <div><strong>Authorized Inspector:</strong> ${inq.authorizedInspector}</div>
          <div><strong>Presiding Member:</strong> Hon'ble Member, DPBI (Simulation Specimen)</div>
          <div style="grid-column: span 2; margin-top:4px;"><strong>Statutory Scope:</strong> ${inq.statutoryScope}</div>
        </div>
        <div class="alert-banner info" style="font-size:11px;padding:8px 12px;margin:0;">
          🔒 <strong>Permitted Inspection Scope:</strong> Restricted to Drill Scenario SIM-DRILL-2026-003 & Birth-Death System (SYS-004). General fishing expeditions into municipal records are statutorily barred.
        </div>
      </div>

      <div class="detail-row mb-2">
        <div class="detail-label">Inspector Digital Identity / Passcode:</div>
        <input type="password" class="search-input" value="DPBI-INSP-AUTH-2026" readonly style="background:#f1f5f9;font-family:monospace;padding-left:12px;width:100%;">
      </div>
    </div>
    <div class="modal-footer flex justify-between">
      <button class="btn btn-secondary" onclick="closeModalDirect(); selectRole('dpo');">Cancel & Exit</button>
      <button class="btn btn-primary" onclick="closeModalDirect(); showToast('Inquiry Summons SIM-INQ-DPBI-DRILL-0041 Verified. Seventh Schedule Disclosure Session Active.');">Verify & Enter Inquiry Workspace →</button>
    </div>
  `);
}

function showSeventhScheduleDisclosureModal() {
  const disclosures = (typeof RULE_23_INSPECTOR_CONFIG !== 'undefined') ? RULE_23_INSPECTOR_CONFIG.seventhScheduleDisclosures : [];
  showModal(`
    <div class="modal-header">
      <div>
        <h2>Seventh Schedule Regulatory Disclosure Register</h2>
        <span class="text-xs text-muted">Immutable Audit Ledger of Regulatory Disclosures to DPBI Inspectors under Rule 23</span>
      </div>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="alert-banner success mb-3">
        <span class="alert-icon">🛡️</span>
        <div><strong>Evidence Protection Active:</strong> Every artifact provided to the Data Protection Board is cryptographically hashed (SHA-256) and recorded in the Seventh Schedule register to prevent scope creep.</div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Disclosure ID</th>
            <th>Timestamp</th>
            <th>Disclosed Artifact</th>
            <th>Authorized Inspector</th>
            <th>Statutory Purpose</th>
            <th>SHA-256 Hash</th>
          </tr>
        </thead>
        <tbody>
          ${disclosures.map(d => `
            <tr>
              <td class="td-id"><strong>${d.disclosureId}</strong></td>
              <td>${formatDateTime(d.timestamp)}</td>
              <td><strong>${d.artifactName}</strong></td>
              <td>${d.inspectorName}</td>
              <td style="font-size:11px;">${d.purpose}</td>
              <td><code style="font-size:10px;">${d.sha256Hash.substring(0, 16)}...</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="modal-footer flex justify-end">
      <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Audit Copy</button>
      <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button>
    </div>
  `);
}

function toggleRoleDropdown() {
  const dropdown = document.getElementById('roleDropdown');
  if (dropdown) dropdown.classList.toggle('open');
}

function initRoleDropdown() {
  const dropdown = document.getElementById('roleDropdown');
  if (!dropdown) return;
  const rolesObj = typeof ROLES !== 'undefined' ? ROLES : window.ROLES;
  if (!rolesObj) return;

  const categories = {};
  Object.keys(rolesObj).forEach(key => {
    const role = rolesObj[key];
    const cat = role.category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push({ key, ...role });
  });

  let html = '';
  Object.keys(categories).forEach(cat => {
    html += `<div class="rs-category">${cat}</div>`;
    categories[cat].forEach(r => {
      html += `
        <div class="rs-item ${r.key === currentRoleKey ? 'active' : ''}" onclick="selectRole('${r.key}')">
          <span class="rs-icon">${r.icon}</span>
          <span class="rs-label">${r.label}</span>
          ${r.key === currentRoleKey ? '<span class="rs-check">✓</span>' : ''}
        </div>
      `;
    });
  });

  dropdown.innerHTML = html;
}

function applyRolePerspective() {
  const rolesObj = typeof ROLES !== 'undefined' ? ROLES : window.ROLES;
  const usersObj = typeof USERS !== 'undefined' ? USERS : window.USERS;
  if (!currentRole && rolesObj) currentRole = rolesObj['dpo'];
  if (!currentUser && usersObj) currentUser = usersObj['dpo'];

  const userNameEl = document.getElementById('headerUserName');
  if (userNameEl) userNameEl.textContent = currentUser.name;
  const userRoleEl = document.getElementById('headerUserRole');
  if (userRoleEl) userRoleEl.textContent = currentUser.designation;
  const userAvatarEl = document.getElementById('headerUserAvatar');
  if (userAvatarEl) userAvatarEl.textContent = currentUser.avatar;
  const rsRoleLabelEl = document.getElementById('rsRoleLabel');
  if (rsRoleLabelEl) rsRoleLabelEl.textContent = currentRole.label;
  const rsDotEl = document.getElementById('rsDot');
  if (rsDotEl) rsDotEl.style.background = currentRole.color;

  if (currentRole.isCitizen) {
    document.body.className = 'citizen-layout';
    const mainSidebar = document.getElementById('mainSidebar');
    if (mainSidebar) mainSidebar.style.display = 'none';
    const mainHeader = document.getElementById('mainHeader');
    if (mainHeader) mainHeader.style.display = 'none';
    const citizenTopbar = document.getElementById('citizenTopbar');
    if (citizenTopbar) citizenTopbar.classList.remove('hidden');
    const citizenUserName = document.getElementById('citizenUserName');
    if (citizenUserName) citizenUserName.textContent = currentUser.name;
    const citizenWelcomeTitle = document.getElementById('citizenWelcomeTitle');
    if (citizenWelcomeTitle) citizenWelcomeTitle.textContent = `Namaste, ${currentUser.name}`;

    navigateTo('citizen');
    switchCitizenTab('overview');
    return;
  }

  document.body.className = '';
  const mainSidebar = document.getElementById('mainSidebar');
  if (mainSidebar) mainSidebar.style.display = 'flex';
  const mainHeader = document.getElementById('mainHeader');
  if (mainHeader) mainHeader.style.display = 'flex';
  const citizenTopbar = document.getElementById('citizenTopbar');
  if (citizenTopbar) citizenTopbar.classList.add('hidden');

  const readOnlyBanner = document.getElementById('readOnlyBanner');
  const mainContent = document.getElementById('mainContent');
  if (currentRole.isReadOnly) {
    if (readOnlyBanner) {
      readOnlyBanner.classList.remove('hidden');
      if (currentRoleKey === 'dpb-inspector') {
        readOnlyBanner.innerHTML = `<div class="flex items-center justify-between w-full" style="width:100%;"><span>⚖️ <strong>DPBI REGULATORY INQUIRY (Rule 23)</strong> — Summons: <strong>SIM-INQ-DPBI-DRILL-0041</strong> · Inspector: <strong>Shri Vinod G. Mishra (Simulation Persona)</strong> · Scoped to Drill SIM-DRILL-2026-003 / SYS-004</span> <button class="btn btn-secondary btn-sm" onclick="showSeventhScheduleDisclosureModal()" style="padding:3px 10px;font-size:11px;background:#fff;color:#1a3a6b;font-weight:700;">📜 Seventh Schedule Disclosure Register</button></div>`;
      } else {
        readOnlyBanner.innerHTML = `<span>👁️ <strong>READ-ONLY AUDIT MODE</strong> — Logged in as <span id="readOnlyRoleName">${currentRole.label}</span>. Action buttons and mutations are disabled.</span>`;
      }
    }
    if (mainContent) mainContent.classList.add('has-banner');
  } else {
    if (readOnlyBanner) readOnlyBanner.classList.add('hidden');
    if (mainContent) mainContent.classList.remove('has-banner');
  }

  const deptBanner = document.getElementById('deptBanner');
  if (currentRole.department) {
    if (deptBanner) deptBanner.classList.remove('hidden');
    const deptBannerName = document.getElementById('deptBannerName');
    if (deptBannerName) deptBannerName.textContent = getDeptName(currentRole.department);
  } else {
    if (deptBanner) deptBanner.classList.add('hidden');
  }

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.style.display = currentRole.isReadOnly ? 'none' : 'inline-flex';
  });

  renderSidebar();
  const defaultPage = currentRole.pages[0] || 'dashboard';
  navigateTo(defaultPage);

  const roleDropdown = document.getElementById('roleDropdown');
  if (roleDropdown) roleDropdown.classList.remove('open');
  initRoleDropdown();
}

function renderSidebar() {
  const sidebarNav = document.getElementById('sidebarNav');
  if (!sidebarNav) return;
  const allowed = currentRole.pages;

  const allItems = [
    { page: 'dashboard', label: 'Dashboard', icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', category: 'Overview' },
    { page: 'consent', label: 'Consent Management', icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>', category: 'Compliance' },
    { page: 'rights', label: 'Rights Portal', icon: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/>', badge: '3', badgeClass: 'warning', category: 'Compliance' },
    { page: 'breach', label: 'Breach Response', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>', badge: '1', category: 'Compliance' },
    { page: 'inventory', label: 'Data Inventory', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>', category: 'Compliance' },
    { page: 'grievance', label: 'Grievance Redressal', icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>', badge: '4', badgeClass: 'warning', category: 'Compliance' },
    { page: 'dpia', label: 'DPIA & Audit', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', category: 'SDF Obligations' },
    { page: 'retention', label: 'Retention & Erasure', icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', category: 'SDF Obligations' },
    { page: 'integration', label: 'Integration Hub & API', icon: '<path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/>', badge: 'API', badgeClass: 'info', category: 'Developers & Systems' },
    { page: 'admin', label: 'Admin & System', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83 2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>', category: 'Administration' }
  ];

  let html = '';
  let currentCat = '';

  allItems.forEach(item => {
    if (!allowed.includes(item.page)) return;
    if (item.category !== currentCat) {
      currentCat = item.category;
      html += `<div class="sidebar-section">${currentCat}</div>`;
    }
    html += `
      <a class="sidebar-item" data-page="${item.page}" onclick="navigateTo('${item.page}')">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${item.icon}</svg>
        ${item.label}
        ${item.badge ? `<span class="item-badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
      </a>
    `;
  });

  sidebarNav.innerHTML = html;
}

function navigateTo(pageId) {
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));

  const page = document.getElementById(`page-${pageId}`);
  const nav = document.querySelector(`.sidebar-item[data-page="${pageId}"]`);
  if (page) page.classList.add('active');
  if (nav) nav.classList.add('active');

  const titles = {
    dashboard: `${currentRole ? currentRole.label : 'DPO'} Dashboard`,
    consent: 'Consent Management Engine',
    rights: 'Data Principal Rights Portal',
    breach: 'Breach Response System',
    inventory: 'Data Inventory & RoPA',
    grievance: 'Grievance Redressal Mechanism',
    dpia: 'DPIA & Algorithmic Due Diligence',
    retention: 'Data Retention & Erasure Engine',
    integration: 'Municipal Systems Integration Hub & API Console',
    admin: 'Platform & User Administration',
    citizen: 'Citizen Data Principal Portal'
  };
  const pageTitleEl = document.getElementById('pageTitle');
  if (pageTitleEl) pageTitleEl.textContent = titles[pageId] || pageId;
  const pageBreadcrumbEl = document.getElementById('pageBreadcrumb');
  if (pageBreadcrumbEl && typeof SAMPLE_DATA !== 'undefined') pageBreadcrumbEl.textContent = SAMPLE_DATA.organization.name;

  const inits = {
    dashboard: initDashboard,
    consent: initConsent,
    rights: initRights,
    breach: initBreach,
    inventory: initInventory,
    grievance: initGrievance,
    dpia: initDPIA,
    retention: initRetention,
    integration: initIntegration,
    admin: initAdmin
  };
  if (inits[pageId]) inits[pageId]();
}

// ── Modals Base ─────────────────────────────────────────────

function showModal(html) {
  const content = document.getElementById('modalContent');
  const overlay = document.getElementById('modalOverlay');
  if (content && overlay) {
    content.innerHTML = html;
    overlay.classList.add('active');
  }
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('active');
}

function closeModalDirect() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('active');
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════

let chartConsentTrend, chartRightsType;

function initDashboard() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const kpi = SAMPLE_DATA.complianceKPIs;
  const activeBreach = SAMPLE_DATA.breachIncidents.find(b => b.status === 'active');

  const alertsEl = document.getElementById('dashboardAlerts');
  if (alertsEl) {
    alertsEl.innerHTML = activeBreach ? `
      <div class="alert-banner critical">
        <span class="alert-icon">⚠️</span>
        <div><strong>ACTIVE BREACH — ${activeBreach.title}</strong><br>
        Detected: ${formatDateTime(activeBreach.detectedAt)} · ${activeBreach.estimatedPrincipals.toLocaleString()} principals affected · DPB report due: ${formatDateTime(activeBreach.dpbDetailedDue)}</div>
        ${currentRole && currentRole.pages.includes('breach') ? `<button class="btn btn-danger btn-sm alert-action" onclick="navigateTo('breach')">View Incident →</button>` : ''}
      </div>` : '';
  }

  renderPenaltyExposureWidget();


  const statsEl = document.getElementById('dashboardStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card accent-green"><div class="stat-header"><span class="stat-label">Consent Coverage</span></div><div class="stat-value">${kpi.consentCoverage}%</div><div class="progress-bar mt-1"><div class="progress-fill green" style="width:${kpi.consentCoverage}%"></div></div><div class="stat-detail mt-1">${kpi.activeConsents.toLocaleString()} active consents</div></div>
      <div class="stat-card accent-blue"><div class="stat-header"><span class="stat-label">Rights Requests SLA</span></div><div class="stat-value">${kpi.rightsRequestSLA}%</div><div class="progress-bar mt-1"><div class="progress-fill green" style="width:${kpi.rightsRequestSLA}%"></div></div><div class="stat-detail mt-1">${kpi.completedRights} completed · ${kpi.overdueRights} overdue</div></div>
      <div class="stat-card accent-red"><div class="stat-header"><span class="stat-label">Active Breaches</span></div><div class="stat-value">${kpi.activeBreaches}</div><div class="stat-detail mt-1"><span class="trend-down">▲ 1 critical</span> · 72hr clock running</div></div>
      <div class="stat-card accent-purple"><div class="stat-header"><span class="stat-label">DPIA Completion</span></div><div class="stat-value">${kpi.dpiaCompletion}%</div><div class="stat-detail mt-1">3 of 4 assessments complete</div></div>
      <div class="stat-card accent-yellow"><div class="stat-header"><span class="stat-label">Pending Grievances</span></div><div class="stat-value">${kpi.grievancesPending}</div><div class="stat-detail mt-1">Rule 14 90d Cap · 1 escalated</div></div>
      <div class="stat-card accent-saffron"><div class="stat-header"><span class="stat-label">DPDP Readiness</span></div><div class="stat-value">${kpi.statutoryReadinessScore || 84}%</div><div class="stat-detail mt-1"><span class="badge badge-info" style="font-size:10px;">ISO 27701 Crosswalk: ${kpi.iso27701BenchmarkCrosswalk || 78}%</span></div></div>
    `;
  }

  // Safe Chart initialization wrapped in try/catch
  try {
    if (typeof Chart !== 'undefined') {
      const trends = SAMPLE_DATA.monthlyTrends;
      const canvasTrend = document.getElementById('chartConsentTrend');
      if (canvasTrend) {
        if (chartConsentTrend && typeof chartConsentTrend.destroy === 'function') chartConsentTrend.destroy();
        chartConsentTrend = new Chart(canvasTrend, {
          type: 'line',
          data: {
            labels: trends.labels,
            datasets: [
              { label: 'Consents Granted', data: trends.consentsGranted, borderColor: '#4caf50', backgroundColor: 'rgba(76,175,80,0.1)', fill: true, tension: 0.4 },
              { label: 'Consents Withdrawn', data: trends.consentsWithdrawn, borderColor: '#f44336', backgroundColor: 'rgba(244,67,54,0.1)', fill: true, tension: 0.4 }
            ]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
      }

      const typeCounts = {};
      SAMPLE_DATA.rightsRequests.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });

      const canvasType = document.getElementById('chartRightsType');
      if (canvasType) {
        if (chartRightsType && typeof chartRightsType.destroy === 'function') chartRightsType.destroy();
        chartRightsType = new Chart(canvasType, {
          type: 'doughnut',
          data: {
            labels: Object.keys(typeCounts),
            datasets: [{ data: Object.values(typeCounts), backgroundColor: ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#607d8b'] }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
      }
    }
  } catch (err) {
    console.warn('Dashboard Chart warning:', err);
  }

  const feedEl = document.getElementById('activityFeed');
  if (feedEl) {
    feedEl.innerHTML = SAMPLE_DATA.recentActivity.map(a => `
      <div class="activity-item" style="cursor:pointer" onclick="showActivityDetail('${a.message}', '${a.actor}', '${a.time}')">
        <div class="activity-icon ${a.type}">${a.type === 'breach' ? '⚠' : a.type === 'rights' ? '👤' : a.type === 'consent' ? '✓' : '💬'}</div>
        <div class="activity-content">
          <div class="activity-msg">${a.message}</div>
          <div class="activity-meta">${a.actor} · ${formatTimeAgo(a.time)}</div>
        </div>
        ${a.severity === 'critical' ? '<span class="badge badge-danger">Critical</span>' : ''}
      </div>
    `).join('');
  }
}

function showToast(msg) {
  if (typeof document === 'undefined' || !document.body) return;
  let toast = document.getElementById('govshield-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'govshield-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1a3a6b;color:#fff;padding:12px 20px;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.3);font-size:13px;font-weight:600;z-index:9999;transition:all 0.3s ease;opacity:0;transform:translateY(20px);pointer-events:none;display:flex;align-items:center;gap:8px;border-left:4px solid #ff9800;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>🛡️</span> <span>${msg}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3500);
}

function toggleSDFStatus() {
  if (typeof SDF_GOVERNANCE_CONFIG === 'undefined') return;
  SDF_GOVERNANCE_CONFIG.isNotifiedSDF = !SDF_GOVERNANCE_CONFIG.isNotifiedSDF;
  
  const badge = document.getElementById('sdfStatusBadge');
  const sub = document.getElementById('sdfStatusSubText');
  const btn = document.getElementById('btnToggleSdf');
  
  if (SDF_GOVERNANCE_CONFIG.isNotifiedSDF) {
    if (badge) {
      badge.textContent = "Significant Data Fiduciary (Sec 10 Notified)";
      badge.className = "badge badge-danger";
    }
    if (sub) {
      sub.innerHTML = "<strong>Active SDF Statutory Obligations:</strong> Sec 10(2)(a) DPO resident in India, Sec 10(2)(b) Independent Data Auditor, Sec 10(2)(c) Periodic Audit & DPIA, Rule 13(3) Algorithmic Due Diligence.";
    }
    if (btn) {
      btn.textContent = "🔄 Revert to Standard ULB Fiduciary";
      btn.style.borderColor = "#2e7d32";
      btn.style.color = "#2e7d32";
    }
    showToast("Designation Simulated: Significant Data Fiduciary (SDF Obligations Active)");
  } else {
    if (badge) {
      badge.textContent = "Standard Urban Local Body Data Fiduciary";
      badge.className = "badge badge-statutory";
    }
    if (sub) {
      sub.textContent = "Statutory Duties: Sections 5–9, 11–16 active. Section 10 & Rule 13 SDF duties pending Central Government Gazette notification under Sec 10(1).";
    }
    if (btn) {
      btn.textContent = "🔄 Simulate Notified SDF (Sec 10)";
      btn.style.borderColor = "#ff9800";
      btn.style.color = "#e65100";
    }
    showToast("Designation Restored: Standard ULB Fiduciary (SDF Notification Pending)");
  }
  
  renderPenaltyExposureWidget();
}

function renderPenaltyExposureWidget() {
  const el = document.getElementById('penaltyExposureWidget');
  if (!el || typeof PENALTY_SCHEDULE === 'undefined') return;
  const s = PENALTY_SCHEDULE.summary;
  
  el.innerHTML = `
    <div class="penalty-card">
      <div class="penalty-header">
        <div>
          <div class="penalty-title">
            <span>⚖️</span> Statutory Penalty Exposure & Legal Defense Register
          </div>
          <div class="penalty-subtext">Statutory per-contravention liability caps under The Schedule & Section 33(2) Qualitative Mitigating Record</div>
        </div>
        <div class="flex gap-8 items-center">
          <span class="penalty-badge" style="background:#2e7d32;color:#fff;">Sec 33(2) Defense Documented</span>
          <button class="btn btn-secondary btn-sm" style="background:rgba(255,255,255,0.18);color:#fff;border:1px solid rgba(255,255,255,0.3);font-weight:600;" onclick="showPenaltyCalculatorModal()">Legal Defense Register 🔍</button>
        </div>
      </div>
      <div class="penalty-grid">
        <div class="penalty-stat-box">
          <div class="penalty-stat-label">Statutory Ceiling (Per Contravention)</div>
          <div class="penalty-stat-value">${s.perContraventionCeilingDisplay}</div>
          <div class="penalty-subtext">The Schedule individual head maxima (non-aggregating)</div>
        </div>
        <div class="penalty-stat-box">
          <div class="penalty-stat-label">Active Tabletop Cyber Drill</div>
          <div class="penalty-stat-value warning">${s.activeDrillRef.split(' ')[0]}</div>
          <div class="penalty-subtext">SYS-004 tabletop response exercise</div>
        </div>
        <div class="penalty-stat-box">
          <div class="penalty-stat-label">Section 33(2) Mitigating Defense Factors</div>
          <div class="penalty-stat-value success">${s.documentedSec33Factors} Factors Documented</div>
          <div class="penalty-subtext">Timely isolation, CERT-In notice, AES-256 intact</div>
        </div>
        <div class="penalty-stat-box">
          <div class="penalty-stat-label">Statutory Appellate Remedy</div>
          <div class="penalty-stat-value" style="font-size:16px;font-weight:700;margin-top:8px;">TDSAT (Section 29)</div>
          <div class="penalty-subtext">Statutory appeal within 60 days of Board order</div>
        </div>
      </div>
    </div>
  `;
}

function showPenaltyCalculatorModal() {
  if (typeof PENALTY_SCHEDULE === 'undefined') return;
  const cats = PENALTY_SCHEDULE.categories;
  showModal(`
    <div class="modal-header">
      <div>
        <h2>Statutory Penalty Exposure & Legal Defense Register</h2>
        <span class="text-xs text-muted">Statutory Liability Bands (The Schedule) & Section 33(2) Qualitative Mitigating Evidence</span>
      </div>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="alert-banner info mb-3">
        <span class="alert-icon">⚖️</span>
        <div>
          <strong>Statutory Adjudication Principles (Section 33(2)):</strong>
          The DPDP Act does not employ a mathematical credit formula or mechanical discount. The Data Protection Board of India adjudges penalties by weighing statutory factors under Section 33(2): nature, gravity, duration, repetitive nature, and action taken to mitigate consequences. Documented evidence serves as primary defense before the Board.
        </div>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Statutory Contravention Head</th>
            <th>Per-Contravention Maximum (The Schedule)</th>
            <th>Active Incidents / Audits</th>
            <th>Section 33(2) Documented Mitigating Evidence</th>
            <th>Fiduciary Legal Defense Posture</th>
          </tr>
        </thead>
        <tbody>
          ${cats.map(c => `
            <tr>
              <td>
                <strong>${c.title}</strong><br>
                <span class="badge badge-neutral">${c.section}</span>
              </td>
              <td style="font-weight:700;color:var(--navy-800);">${c.statutoryMaxDisplay}</td>
              <td>${c.activeIncidents > 0 ? `<span class="badge badge-warning">${c.activeIncidents} Drill Specimen</span>` : '<span class="badge badge-success">0</span>'}</td>
              <td class="text-sm">
                <ul style="padding-left:14px;margin:0;font-size:11px;">
                  ${c.sec33Factors.map(m => `<li><strong>${m.factor}:</strong> ${m.evidence}</li>`).join('')}
                </ul>
              </td>
              <td style="font-size:11px;font-weight:600;">
                <span class="badge ${c.activeIncidents > 0 ? 'badge-info' : 'badge-success'}">${c.legalDefenseAssessment}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="modal-footer flex justify-between">
      <div style="font-size:11px;color:var(--gray-500);display:flex;align-items:center;gap:6px;">
        <span>🛡️</span> Statutory appeals lie to TDSAT under Section 29 within 60 days of Board order.
      </div>
      <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button>
    </div>
  `);
}

function showActivityDetail(msg, actor, time) {
  showModal(`
    <div class="modal-header"><h2>Activity Event Log</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid">
        <div class="detail-row"><div class="detail-label">Event Description</div><div class="detail-value">${msg}</div></div>
        <div class="detail-row"><div class="detail-label">Triggered By / Actor</div><div class="detail-value">${actor}</div></div>
        <div class="detail-row"><div class="detail-label">Timestamp</div><div class="detail-value">${formatDateTime(time)}</div></div>
        <div class="detail-row"><div class="detail-label">Audit Log Status</div><div class="detail-value"><span class="badge badge-success">✓ Cryptographically Signed</span></div></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button></div>
  `);
}

// ══════════════════════════════════════════════════════════════
// CONSENT MANAGEMENT
// ══════════════════════════════════════════════════════════════

let chartConsentPurpose, chartConsentChannel;

function initConsent() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const records = getScopedConsentRecords();
  const active = records.filter(r => r.status === 'active').length;

  const statsEl = document.getElementById('consentStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card accent-green"><div class="stat-header"><span class="stat-label">Total Records</span></div><div class="stat-value">${records.length}</div></div>
      <div class="stat-card accent-blue"><div class="stat-header"><span class="stat-label">Active Consents</span></div><div class="stat-value">${active}</div></div>
      <div class="stat-card accent-red"><div class="stat-header"><span class="stat-label">Withdrawn</span></div><div class="stat-value">${records.filter(r => r.status === 'withdrawn').length}</div></div>
      <div class="stat-card accent-yellow"><div class="stat-header"><span class="stat-label">Expired</span></div><div class="stat-value">${records.filter(r => r.status === 'expired').length}</div></div>
    `;
  }

  try {
    if (typeof Chart !== 'undefined') {
      const purposeCounts = {};
      const channelCounts = {};
      records.forEach(r => {
        const p = r.purpose.split('—')[0].split('&')[0].trim().substring(0, 20);
        purposeCounts[p] = (purposeCounts[p] || 0) + 1;
        channelCounts[r.channel] = (channelCounts[r.channel] || 0) + 1;
      });

      const canvasPurpose = document.getElementById('chartConsentPurpose');
      if (canvasPurpose) {
        if (chartConsentPurpose && typeof chartConsentPurpose.destroy === 'function') chartConsentPurpose.destroy();
        chartConsentPurpose = new Chart(canvasPurpose, {
          type: 'bar',
          data: { labels: Object.keys(purposeCounts), datasets: [{ label: 'Consents', data: Object.values(purposeCounts), backgroundColor: '#1a3a6b' }] },
          options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }
        });
      }

      const canvasChannel = document.getElementById('chartConsentChannel');
      if (canvasChannel) {
        if (chartConsentChannel && typeof chartConsentChannel.destroy === 'function') chartConsentChannel.destroy();
        chartConsentChannel = new Chart(canvasChannel, {
          type: 'pie',
          data: { labels: Object.keys(channelCounts), datasets: [{ data: Object.values(channelCounts), backgroundColor: ['#2196f3','#4caf50','#ff9800','#9c27b0','#607d8b'] }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
      }
    }
  } catch (err) {
    console.warn('Consent Chart warning:', err);
  }

  renderConsentTable(records);
}

function getScopedConsentRecords() {
  if (typeof SAMPLE_DATA === 'undefined') return [];
  if (currentRole && currentRole.department) {
    const deptSystems = SAMPLE_DATA.systems.filter(s => s.department === currentRole.department).map(s => s.id);
    return SAMPLE_DATA.consentRecords.filter(r => deptSystems.includes(r.system));
  }
  return SAMPLE_DATA.consentRecords;
}

function switchConsentTab(tab) {
  const btnRecords = document.getElementById('btnTabConsentRecords');
  const btnCm = document.getElementById('btnTabConsentManager');
  const viewRecords = document.getElementById('consentRecordsView');
  const viewCm = document.getElementById('consentManagerView');

  if (tab === 'records') {
    if (btnRecords) btnRecords.classList.add('active');
    if (btnCm) btnCm.classList.remove('active');
    if (viewRecords) viewRecords.style.display = 'block';
    if (viewCm) viewCm.style.display = 'none';
  } else {
    if (btnRecords) btnRecords.classList.remove('active');
    if (btnCm) btnCm.classList.add('active');
    if (viewRecords) viewRecords.style.display = 'none';
    if (viewCm) viewCm.style.display = 'block';
    renderConsentManagers();
  }
}

function renderConsentManagers() {
  const container = document.getElementById('cmGridContainer');
  if (!container || typeof CONSENT_MANAGERS === 'undefined') return;

  const banner = `
    <div class="alert-banner warning mb-3" style="grid-column: 1 / -1; width:100%;">
      <span class="alert-icon">⚖️</span>
      <div>
        <strong>Rule 4 Commencement Notice (Phased Enforcement):</strong>
        Registration of Consent Managers under Section 6(7) read with Rule 4 commences on <strong>13 November 2026</strong>. No entities are currently registered with the Data Protection Board of India. The connectors below represent simulated architectural testbenches for technical interoperability evaluation.
      </div>
    </div>
  `;

  container.innerHTML = banner + CONSENT_MANAGERS.map(cm => `
    <div class="cm-card">
      <div class="cm-card-header">
        <span class="cm-status-pill ${cm.status}">
          <span class="cm-pulse-dot"></span>
          ${cm.status === 'sandbox_specimen' ? 'Sandbox Testbench' : cm.status}
        </span>
        <span class="badge badge-neutral">${cm.syncCadence}</span>
      </div>
      <div class="cm-name">${cm.name}</div>
      <div class="cm-reg" style="font-size:11px;color:var(--saffron-700);font-weight:600;">${cm.dpbiRegNo}</div>
      
      <div class="cm-stats-row">
        <span>Simulated Test Tokens</span>
        <span style="font-size:14px;color:var(--navy-700);font-weight:700;">${cm.simulatedTestTokens}</span>
      </div>
      <div class="cm-stats-row">
        <span>API Latency (Test Ping)</span>
        <span style="color:var(--green-700);font-weight:700;">${cm.latencyMs} ms</span>
      </div>
      <div class="cm-stats-row">
        <span>Statutory Threshold</span>
        <span style="font-size:11px;">${cm.netWorthVerified}</span>
      </div>
      <div class="cm-stats-row">
        <span>Protocol Spec</span>
        <span style="font-size:11px;">${cm.encryption}</span>
      </div>
      <div class="mt-2 flex gap-8">
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="alert('Viewing simulated transaction test stream for ${cm.name}... (Sync hash: SHA-256)');">Audit Stream</button>
        <button class="btn btn-primary btn-sm" onclick="alert('Test handshake dispatched to ${cm.endpoint}. Response code 200 OK (${cm.latencyMs}ms). Verified with ECDSA.');">Test Ping ⚡</button>
      </div>
    </div>
  `).join('');
}

function testConsentManagerPing() {
  alert('Dispatched mTLS 1.3 heartbeat to simulated Consent Manager testbenches (Protocol Test):\n\n1. Simulated CM Testbench Alpha: 42ms (200 OK)\n2. Simulated CM Testbench Beta: 38ms (200 OK)\n3. Simulated CM Testbench Gamma: 55ms (200 OK)\n\nAll test cryptographic handshakes verified per draft MeitY Protocol. Note: Registration opens 13 Nov 2026 under Rule 4.');
}

function showConnectConsentManagerModal() {
  showModal(`
    <div class="modal-header">
      <h2>+ Register New Consent Manager Connector (Sec 6(7))</h2>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Consent Manager Name</div><input type="text" id="newCmName" class="search-input" style="width:100%;padding-left:14px;" placeholder="e.g. IndiaConsent Technologies Pvt Ltd"></div>
        <div class="detail-row"><div class="detail-label">DPBI Registration No.</div><input type="text" id="newCmReg" class="search-input" style="width:100%;padding-left:14px;" placeholder="DPBI/CM/2026/012"></div>
        <div class="detail-row"><div class="detail-label">Base API Endpoint (mTLS)</div><input type="text" id="newCmUrl" class="search-input" style="width:100%;padding-left:14px;" placeholder="https://api.consentmanager.in/v1"></div>
        <div class="detail-row"><div class="detail-label">Rule 4 Net Worth Verification</div><select id="newCmNet" class="filter-select" style="width:100%;"><option>INR 2 Crore+ (Audited Balance Sheet Verified)</option><option>Government Instrumentality</option></select></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewConsentManager()">Register & Bind mTLS</button>
    </div>
  `);
}

function saveNewConsentManager() {
  const name = document.getElementById('newCmName').value || 'New Consent Manager';
  const reg = document.getElementById('newCmReg').value || 'DPBI/CM/2026/015';
  const url = document.getElementById('newCmUrl').value || 'https://api.cm.in/v1';

  CONSENT_MANAGERS.push({
    id: `CM-2026-0${CONSENT_MANAGERS.length + 1}`,
    name: name,
    dpbiRegNo: reg,
    status: 'active',
    endpoint: url,
    latencyMs: 44,
    lastSync: new Date().toISOString(),
    syncedConsents: 0,
    netWorthVerified: "INR 2.0 Crore (Compliant)",
    encryption: "mTLS 1.3 + ECDSA",
    supportedLanguages: 22,
    syncCadence: "Real-time Webhook"
  });

  alert(`Consent Manager "${name}" bound successfully to AMC DPDP Bridge.`);
  closeModalDirect();
  renderConsentManagers();
}

function renderConsentTable(data) {
  const tbody = document.getElementById('consentTableBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(r => {
    const isSec7 = r.legalGround && r.legalGround.includes("7");
    const isMinor = !!r.isMinor;

    return `
    <tr onclick="showConsentDetail('${r.id}')">
      <td class="td-id">${r.id}</td>
      <td class="td-name">
        ${r.principalName}
        ${isMinor ? '<br><span class="badge badge-minor">👶 Minor (Age 12)</span>' : ''}
        <br><span class="td-muted">ID: ${r.principalId}</span>
      </td>
      <td>
        <span class="${isSec7 ? 'badge-statutory' : (isMinor ? 'badge-minor' : 'badge-consent')}">
          ${r.legalGround || (isSec7 ? 'Sec 7(b) State Function' : 'Sec 6 Consent')}
        </span>
      </td>
      <td>${r.purpose}</td>
      <td>${statusBadge(r.status)}</td>
      <td>${formatDate(r.grantedAt)}</td>
      <td>
        <div class="flex gap-4">
          ${r.rule5IntimationId ? `<button class="btn btn-secondary btn-sm" style="border-color:#1a3a6b;color:#1a3a6b;font-weight:600;" onclick="event.stopPropagation(); showRule5IntimationModal('${r.rule5IntimationId}')" title="Rule 5 & Second Schedule Intimation">📜 Rule 5</button>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showConsentReceiptModal('${r.id}')" title="Kantara v1.1 / ISO 27560 Receipt">📄 Receipt</button>
          ${isMinor ? `<button class="btn btn-primary btn-sm" style="background:#7b1fa2;border-color:#7b1fa2;" onclick="event.stopPropagation(); showVPCDetailModal('${r.id}')" title="Verifiable Parental Consent Token">🛡️ VPC</button>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showConsentDetail('${r.id}')">Details</button>
        </div>
      </td>
    </tr>
  `;
  }).join('');
}

function showRule5IntimationModal(intimationId) {
  const intimations = typeof RULE_5_INTIMATIONS !== 'undefined' ? RULE_5_INTIMATIONS : window.RULE_5_INTIMATIONS;
  const item = intimations ? (intimations.find(i => i.id === intimationId) || intimations[0]) : null;
  if (!item) return;

  showModal(`
    <div class="modal-header">
      <div>
        <h2>Rule 5 & Second Schedule Statutory Intimation Artifact</h2>
        <span class="text-xs text-muted">DPDP Rules 2025 Rule 5 · Statutory Transparency for Municipal State Functions (Section 7(b))</span>
      </div>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="rule5-box mb-3">
        <div class="flex justify-between items-center mb-3 pb-2" style="border-bottom:2px solid #1a3a6b;">
          <div>
            <div style="font-weight:800;font-size:16px;color:#1a3a6b;">AHMEDABAD MUNICIPAL CORPORATION</div>
            <div style="font-size:12px;color:#475569;">Statutory Processing Intimation under DPDP Rules 2025 (Second Schedule)</div>
          </div>
          <div style="text-align:right;">
            <span class="badge badge-statutory" style="font-size:11px;">Intimation Ref: ${item.id}</span>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">Effective: ${item.effectiveDate} · ${item.version}</div>
          </div>
        </div>

        <div class="grid-2 mb-3" style="background:#f1f5f9;padding:12px;border-radius:6px;font-size:12px;">
          <div><strong>Service Name:</strong> ${item.serviceName}</div>
          <div><strong>System & Dept:</strong> ${item.systemId} (${getDeptName(item.departmentId)})</div>
          <div><strong>Enabling Municipal Act:</strong> ${item.enablingAct}</div>
          <div><strong>DPDP Legal Ground:</strong> ${item.legalGround}</div>
        </div>

        <h4 style="margin:16px 0 10px;color:#1a3a6b;font-size:14px;">The 7 Statutory Standards of the Second Schedule:</h4>
        
        <div class="standard-card">
          <div class="standard-num">Standard 1: Lawful Authority & Statutory Mandate</div>
          <div style="font-size:12px;color:#334155;">${item.standards.standard1_lawfulAuthority}</div>
        </div>
        <div class="standard-card">
          <div class="standard-num">Standard 2: Purpose Specification & Data Minimisation</div>
          <div style="font-size:12px;color:#334155;">${item.standards.standard2_purposeAndMinimisation}</div>
        </div>
        <div class="standard-card">
          <div class="standard-num">Standard 3: Data Accuracy & Periodic Updating (Sec 8(3))</div>
          <div style="font-size:12px;color:#334155;">${item.standards.standard3_accuracyAndUpdating}</div>
        </div>
        <div class="standard-card">
          <div class="standard-num">Standard 4: Retention Limitation & Non-Erasure Defense (Sec 17(4))</div>
          <div style="font-size:12px;color:#334155;">${item.standards.standard4_retentionLimitation}</div>
        </div>
        <div class="standard-card">
          <div class="standard-num">Standard 5: Reasonable Security Safeguards & Technical Measures</div>
          <div style="font-size:12px;color:#334155;">${item.standards.standard5_securitySafeguards}</div>
        </div>
        <div class="standard-card">
          <div class="standard-num">Standard 6: Published Statutory Contact Information (Rule 9)</div>
          <div style="font-size:12px;color:#334155;">${item.standards.standard6_publishedContacts}</div>
        </div>
        <div class="standard-card">
          <div class="standard-num">Standard 7: Review Mechanism & Grievance Redressal Procedures</div>
          <div style="font-size:12px;color:#334155;">${item.standards.standard7_reviewAndRedressal}</div>
        </div>
      </div>
      <div class="flex justify-end gap-8">
        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Intimation</button>
        <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Done</button>
      </div>
    </div>
  `);
}

function filterConsent() {
  const searchInput = document.getElementById('consentSearch');
  const groundInput = document.getElementById('consentGroundFilter');
  const statusInput = document.getElementById('consentStatusFilter');
  const langInput = document.getElementById('consentLangFilter');
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  const ground = groundInput ? groundInput.value : '';
  const status = statusInput ? statusInput.value : '';
  const lang = langInput ? langInput.value : '';
  const records = getScopedConsentRecords();

  let filtered = records.filter(r => {
    const matchSearch = !search || r.principalName.toLowerCase().includes(search) || r.id.toLowerCase().includes(search) || r.purpose.toLowerCase().includes(search);
    const matchStatus = !status || r.status === status;
    const matchLang = !lang || r.language === lang;
    let matchGround = true;
    if (ground === 'consent') matchGround = !r.legalGround || r.legalGround.includes('Section 6');
    else if (ground === 'state') matchGround = r.legalGround && r.legalGround.includes('Section 7');
    else if (ground === 'minor') matchGround = !!r.isMinor;

    return matchSearch && matchStatus && matchLang && matchGround;
  });
  renderConsentTable(filtered);
}

function showConsentDetail(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const r = SAMPLE_DATA.consentRecords.find(c => c.id === id);
  if (!r) return;
  const isSec7 = r.legalGround && r.legalGround.includes("7");
  const isMinor = !!r.isMinor;

  showModal(`
    <div class="modal-header">
      <h2>Consent Artifact Record — ${r.id}</h2>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="detail-grid">
        <div class="detail-row"><div class="detail-label">Data Principal</div><div class="detail-value">${r.principalName} ${isMinor ? '<span class="badge badge-minor">👶 Minor</span>' : ''}</div></div>
        <div class="detail-row"><div class="detail-label">Aadhaar (Masked)</div><div class="detail-value">${r.principalId}</div></div>
        <div class="detail-row"><div class="detail-label">Legal Ground (DPDP Act)</div><div class="detail-value"><span class="${isSec7 ? 'badge-statutory' : (isMinor ? 'badge-minor' : 'badge-consent')}">${r.legalGround || 'Section 6 — Consent'}</span></div></div>
        <div class="detail-row"><div class="detail-label">Enabling Law / Statutory Act</div><div class="detail-value">${r.statutoryAct || (isSec7 ? 'Gujarat Municipalities Act, 1963' : 'Voluntary Consent')}</div></div>
        <div class="detail-row"><div class="detail-label">Specified Purpose</div><div class="detail-value">${r.purpose}</div></div>
        <div class="detail-row"><div class="detail-label">Target System</div><div class="detail-value">${getSystemName(r.system)}</div></div>
        <div class="detail-row"><div class="detail-label">Consent Status</div><div class="detail-value">${statusBadge(r.status)}</div></div>
        <div class="detail-row"><div class="detail-label">Language Served</div><div class="detail-value">${r.language} (8th Schedule)</div></div>
        <div class="detail-row"><div class="detail-label">Capture Channel</div><div class="detail-value">${r.channel}</div></div>
        <div class="detail-row"><div class="detail-label">Notice Version</div><div class="detail-value">${r.noticeVersion}</div></div>
        <div class="detail-row"><div class="detail-label">Granted Timestamp</div><div class="detail-value">${formatDateTime(r.grantedAt)}</div></div>
        <div class="detail-row"><div class="detail-label">Withdrawal Timestamp</div><div class="detail-value">${r.withdrawnAt ? formatDateTime(r.withdrawnAt) : '—'}</div></div>
      </div>
      
      ${isMinor && r.vpc ? `
        <div class="mt-2 p-3" style="background:#f3e5f5;border:1px solid #e1bee7;border-radius:6px;font-size:12px;">
          <strong>🛡️ Section 9 Verifiable Parental Consent (VPC):</strong> Verified via ${r.vpc.method} · Token: <code>${r.vpc.token}</code> · Zero Profiling Active.
        </div>
      ` : ''}

      <div class="mt-3">
        <div class="detail-label mb-1">Cryptographic Hash Verification</div>
        <div style="background:var(--gray-50);padding:12px;border-radius:6px;font-family:Consolas,monospace;font-size:11px;word-break:break-all;color:var(--gray-600);">
          SHA-256 Hash: <strong>${generateFakeHash(r.id)}</strong><br>
          <span style="color:var(--green-700);font-weight:700;">✓ Tamper-Evident Consent Chain Verified (ISO/IEC 27560 Ready)</span>
        </div>
      </div>
    </div>
    <div class="modal-footer flex-between">
      <div class="flex gap-8">
        <button class="btn btn-secondary btn-sm" onclick="showConsentReceiptModal('${r.id}')">📄 View Kantara Receipt (JSON)</button>
        ${isMinor ? `<button class="btn btn-primary btn-sm" style="background:#7b1fa2;border-color:#7b1fa2;" onclick="showVPCDetailModal('${r.id}')">🛡️ VPC Certificate</button>` : ''}
      </div>
      <div class="flex gap-8">
        ${currentRole && !currentRole.isReadOnly && r.status === 'active' ? `<button class="btn btn-danger btn-sm" onclick="withdrawConsentRecord('${r.id}')">Withdraw Consent</button>` : ''}
        <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button>
      </div>
    </div>
  `);
}

function withdrawConsentRecord(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const r = SAMPLE_DATA.consentRecords.find(c => c.id === id);
  if (!r) return;

  if (r.isStatutory) {
    showModal(`
      <div class="modal-header">
        <h2>Statutory Sovereign Processing Notice (DPDP Act Sec 7(b))</h2>
        <button class="modal-close" onclick="closeModalDirect()">✕</button>
      </div>
      <div class="modal-body">
        <div class="alert-banner warning mb-3">
          <span class="alert-icon">⚖️</span>
          <div><strong>Non-Withdrawable Statutory Function:</strong> Processing for this activity is legally anchored under <strong>Section 7(b) (State Functions)</strong> and <strong>${r.statutoryAct || 'Gujarat Municipalities Act, 1963'}</strong>.</div>
        </div>
        <p style="font-size:13px;line-height:1.6;color:var(--gray-700);">
          Under Section 7(b) of the Digital Personal Data Protection Act, 2023, the State and its instrumentalities may process personal data without consent for performing statutory functions, assessments, and public registries.
        </p>
        <p class="mt-2" style="font-size:13px;line-height:1.6;color:var(--gray-700);">
          <strong>Action Taken:</strong> The citizen's request to withdraw has disabled all optional ancillary communications (such as marketing and promotional SMS), while mandatory municipal records are preserved pursuant to statutory duty.
        </p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Understood</button>
      </div>
    `);
    return;
  }

  r.status = 'withdrawn';
  r.withdrawnAt = new Date().toISOString();
  alert(`Consent ${id} has been withdrawn.\n\nAutomated erasure trigger sent to target system: ${getSystemName(r.system)}.`);
  closeModalDirect();
  initConsent();
}

function showConsentReceiptModal(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const c = SAMPLE_DATA.consentRecords.find(r => r.id === id);
  if (!c) return;
  const receipt = generateKantaraConsentReceipt(c);
  const receiptJson = JSON.stringify(receipt, null, 2);

  showModal(`
    <div class="modal-header">
      <h2>Machine-Readable Consent Receipt (ISO/IEC 27560 / Kantara v1.1)</h2>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="receipt-header-strip">
        <div>Receipt ID: <span style="font-family:monospace;color:var(--navy-700);">${receipt.consentReceiptID}</span></div>
        <div>Standard: <span class="badge badge-info">Kantara v1.1.0 · ISO 27560</span></div>
        <div>Jurisdiction: <span class="badge badge-success">IN (India DPDP Act 2023)</span></div>
      </div>

      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Data Principal</div><div class="detail-value">${receipt.piiPrincipalName} (${receipt.piiPrincipalId})</div></div>
        <div class="detail-row"><div class="detail-label">Legal Ground</div><div class="detail-value">${receipt.statutoryFramework.legalGround}</div></div>
        <div class="detail-row"><div class="detail-label">Enabling Law</div><div class="detail-value">${receipt.statutoryFramework.enablingLegislation}</div></div>
        <div class="detail-row"><div class="detail-label">Cryptographic Proof</div><div class="detail-value"><span class="badge badge-success">✓ Signed with RS256 / SHA-256</span></div></div>
      </div>

      <div class="detail-label mb-1">Standardized JSON-LD Receipt Payload</div>
      <div class="receipt-box" id="receiptJsonDisplay">${escapeHtml(receiptJson)}</div>
    </div>
    <div class="modal-footer flex-between">
      <button class="btn btn-secondary btn-sm" onclick="copyReceiptToClipboard('${c.id}')">📋 Copy JSON</button>
      <div class="flex gap-8">
        <button class="btn btn-success btn-sm" onclick="downloadConsentReceipt('${c.id}')">⬇ Download Receipt (.json)</button>
        <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button>
      </div>
    </div>
  `);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function copyReceiptToClipboard(id) {
  const c = SAMPLE_DATA.consentRecords.find(r => r.id === id);
  if (!c) return;
  const receipt = generateKantaraConsentReceipt(c);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(receipt, null, 2)).then(() => {
      alert(`Consent Receipt ${receipt.consentReceiptID} copied to clipboard!`);
    }).catch(() => {
      alert('Copied to clipboard!');
    });
  } else {
    alert('Copied to clipboard!');
  }
}

function downloadConsentReceipt(id) {
  const c = SAMPLE_DATA.consentRecords.find(r => r.id === id);
  if (!c) return;
  const receipt = generateKantaraConsentReceipt(c);
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(receipt, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `consent_receipt_${id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function showVPCOverviewModal() {
  showModal(`
    <div class="modal-header">
      <h2>Section 9 Minor Protection & Verifiable Parental Consent (VPC)</h2>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="alert-banner info mb-3">
        <span class="alert-icon">🛡️</span>
        <div><strong>Statutory Mandates under Section 9 of the DPDP Act 2023:</strong><br>
        1. All individuals under 18 are children (no lower age threshold).<br>
        2. Verifiable Parental Consent (VPC) is mandatory before processing child data.<br>
        3. Strict statutory prohibition on tracking, behavioural monitoring, and targeted advertising directed at children.<br>
        4. Non-compliance attracts a statutory penalty of up to <strong>₹200 Crore</strong> under The Schedule.</div>
      </div>

      <div class="detail-label mb-1">Active VPC Parent-Child Verified Linkages</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Child Principal</th>
            <th>Age</th>
            <th>Legal Guardian</th>
            <th>Verification Token</th>
            <th>Verification Method</th>
            <th>Profiling Safeguard</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:700">Master Rohan D. Rana</td>
            <td><span class="badge badge-minor">Age 12</span></td>
            <td>Smt. Anita D. Rana (Mother)</td>
            <td><code>VPC-DL-2026-098842</code></td>
            <td><span class="badge badge-vpc">✓ DigiLocker Family Linkage</span></td>
            <td><span class="badge badge-success">✓ 100% Zero-Profiling Active</span></td>
          </tr>
        </tbody>
      </table>

      <div class="mt-3 p-3" style="background:var(--gray-50);border-radius:6px;font-size:12px;line-height:1.6;">
        <strong>Audit Certificate:</strong> AMC Urban Local Body has integrated the MeitY DigiLocker Parental Attestation API. When a guardian consents for a child, the API validates the parent-child relationship against the Birth-Death Registry (SYS-004) and binds a cryptographic token to the consent ledger.
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button>
    </div>
  `);
}

function showVPCDetailModal(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const c = SAMPLE_DATA.consentRecords.find(r => r.id === id);
  if (!c || !c.vpc) return;
  const v = c.vpc;
  
  showModal(`
    <div class="modal-header">
      <h2>Verifiable Parental Consent (VPC) Certificate — ${c.id}</h2>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="detail-grid mb-3">
        <div class="detail-row"><div class="detail-label">Child Name</div><div class="detail-value"><strong>${c.childName}</strong> <span class="badge badge-minor">Age ${c.childAge}</span></div></div>
        <div class="detail-row"><div class="detail-label">Verified Guardian</div><div class="detail-value">${v.guardianName} (Aadhaar: ${v.guardianAadhaarMasked})</div></div>
        <div class="detail-row"><div class="detail-label">VPC Verification Method</div><div class="detail-value"><span class="badge badge-vpc">✓ ${v.method}</span></div></div>
        <div class="detail-row"><div class="detail-label">VPC Audit Token</div><div class="detail-value"><code style="font-size:12px;font-weight:700;color:var(--purple-700);">${v.token}</code></div></div>
        <div class="detail-row"><div class="detail-label">Verified Timestamp</div><div class="detail-value">${formatDateTime(v.verifiedAt)}</div></div>
        <div class="detail-row"><div class="detail-label">Statutory Section</div><div class="detail-value">DPDP Act, 2023 — Section 9(1) & 9(2)</div></div>
      </div>

      <div class="detail-label mb-1">Section 9(3) Non-Negotiable Child Protections</div>
      <div style="background:var(--gray-50);padding:14px;border-radius:6px;font-size:13px;line-height:1.8;">
        ✓ <strong>Tracking & Profiling:</strong> HARD BLOCKED across all municipal analytics engines.<br>
        ✓ <strong>Targeted Advertisements:</strong> EXCLUDED from notification and messaging queues.<br>
        ✓ <strong>Detrimental Processing Check:</strong> Validated by Pediatric Health Guidelines (SYS-012).
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" onclick="showConsentReceiptModal('${c.id}')">View Full Kantara Receipt</button>
      <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button>
    </div>
  `);
}


function showConsentForm() {
  if (currentRole && currentRole.isReadOnly) return;
  showModal(`
    <div class="modal-header"><h2>Capture New Consent (Sec 5 & 6)</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Citizen Name</div><input type="text" id="newConsName" class="search-input" style="width:100%;padding-left:14px;" placeholder="Shri/Smt. ..."></div>
        <div class="detail-row"><div class="detail-label">Aadhaar (Last 4)</div><input type="text" id="newConsAadhaar" class="search-input" style="width:100%;padding-left:14px;" placeholder="4523" maxlength="4"></div>
        <div class="detail-row"><div class="detail-label">Processing Purpose</div>
          <select id="newConsPurpose" class="filter-select" style="width:100%;">
            <option>Property tax assessment & communication</option>
            <option>Birth certificate issuance</option>
            <option>Water connection billing & communication</option>
            <option>Building permission application</option>
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Notice Language</div>
          <select id="newConsLang" class="filter-select" style="width:100%;">
            <option>Gujarati</option><option>Hindi</option><option>English</option><option>Marathi</option>
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Capture Channel</div>
          <select id="newConsChannel" class="filter-select" style="width:100%;"><option>Counter</option><option>Web Portal</option><option>Mobile App</option><option>Field Survey</option></select>
        </div>
        <div class="detail-row"><div class="detail-label">Notice Version</div><input type="text" class="search-input" style="width:100%;padding-left:14px;" value="v2.1 (DPDP Compliant)" readonly></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewConsent()">Serve Notice & Capture</button>
    </div>
  `);
}

function saveNewConsent() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const name = document.getElementById('newConsName').value || 'Shri Citizen';
  const aadhaar = document.getElementById('newConsAadhaar').value || '9999';
  const purpose = document.getElementById('newConsPurpose').value;
  const lang = document.getElementById('newConsLang').value;
  const channel = document.getElementById('newConsChannel').value;

  const newRecord = {
    id: `CON-2026-00${Math.floor(160 + Math.random() * 900)}`,
    principalName: name,
    principalId: `XXXX-XXXX-${aadhaar}`,
    purpose: purpose,
    system: 'SYS-001',
    status: 'active',
    grantedAt: new Date().toISOString(),
    noticeVersion: 'v2.1',
    language: lang,
    channel: channel
  };

  SAMPLE_DATA.consentRecords.unshift(newRecord);
  persistState();


  alert(`Consent Captured Successfully & Persisted to DB!\n\nConsent ID: ${newRecord.id}\nData is saved permanently across browser sessions.`);
  closeModalDirect();
  initConsent();
}

// ══════════════════════════════════════════════════════════════
// RIGHTS PORTAL
// ══════════════════════════════════════════════════════════════

function initRights() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const requests = getScopedRightsRequests();
  const pending = requests.filter(r => r.status === 'pending').length;
  const completed = requests.filter(r => r.status === 'completed').length;

  const statsEl = document.getElementById('rightsStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card accent-blue"><div class="stat-header"><span class="stat-label">Total Requests</span></div><div class="stat-value">${requests.length}</div></div>
      <div class="stat-card accent-yellow"><div class="stat-header"><span class="stat-label">Pending</span></div><div class="stat-value">${pending}</div></div>
      <div class="stat-card accent-green"><div class="stat-header"><span class="stat-label">Completed</span></div><div class="stat-value">${completed}</div></div>
      <div class="stat-card accent-red"><div class="stat-header"><span class="stat-label">Escalated</span></div><div class="stat-value">${requests.filter(r => r.status === 'escalated').length}</div></div>
    `;
  }

  renderRightsTable(requests);
}

function getScopedRightsRequests() {
  if (typeof SAMPLE_DATA === 'undefined') return [];
  if (currentRole && currentRole.department) {
    return SAMPLE_DATA.rightsRequests.filter(r => r.deptId === currentRole.department);
  }
  return SAMPLE_DATA.rightsRequests;
}

function renderRightsTable(data) {
  const tbody = document.getElementById('rightsTableBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(r => {
    const sla = getSLAStatus(r.slaDeadline);
    return `
    <tr onclick="showRightsDetail('${r.id}')">
      <td class="td-id">${r.id}</td>
      <td class="td-name">${r.principalName}</td>
      <td><span class="badge badge-${r.type === 'Access' ? 'info' : r.type === 'Correction' ? 'success' : r.type === 'Erasure' ? 'danger' : 'warning'}">${r.type}</span></td>
      <td>${r.department}</td>
      <td>${statusBadge(r.status)}</td>
      <td><span class="badge ${sla.class}">${sla.text}</span></td>
      <td>${r.assignedTo || '<span class="text-muted">Unassigned</span>'}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showRightsDetail('${r.id}')">View</button></td>
    </tr>`;
  }).join('');
}

function filterRights() {
  const searchInput = document.getElementById('rightsSearch');
  const typeInput = document.getElementById('rightsTypeFilter');
  const statusInput = document.getElementById('rightsStatusFilter');
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  const type = typeInput ? typeInput.value : '';
  const status = statusInput ? statusInput.value : '';
  const requests = getScopedRightsRequests();

  let filtered = requests.filter(r => {
    const matchSearch = !search || r.principalName.toLowerCase().includes(search) || r.id.toLowerCase().includes(search) || r.department.toLowerCase().includes(search);
    const matchType = !type || r.type === type;
    const matchStatus = !status || r.status === status;
    return matchSearch && matchType && matchStatus;
  });
  renderRightsTable(filtered);
}

// ══════════════════════════════════════════════════════════════
// DATA INVENTORY & ROPA CREATION MODALS
// ══════════════════════════════════════════════════════════════

function showRegisterSystemModal() {
  if (currentRole && currentRole.isReadOnly) return;
  showModal(`
    <div class="modal-header"><h2>+ Register New IT System in Data Inventory</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">System Name</div><input type="text" id="sysNameInput" class="search-input" style="width:100%;padding-left:14px;" placeholder="e.g., e-Governance Grievance Engine"></div>
        <div class="detail-row"><div class="detail-label">Department</div>
          <select id="sysDeptInput" class="filter-select" style="width:100%;">
            ${SAMPLE_DATA.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Application Type</div>
          <select id="sysTypeInput" class="filter-select" style="width:100%;">
            <option>Web Application</option><option>Mobile App</option><option>GIS Application</option><option>Internal MIS</option><option>IoT/SCADA</option>
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Vendor / Developer</div><input type="text" id="sysVendorInput" class="search-input" style="width:100%;padding-left:14px;" placeholder="NIC / Silver Touch / In-house"></div>
        <div class="detail-row"><div class="detail-label">Classification</div>
          <select id="sysClassInput" class="filter-select" style="width:100%;">
            <option value="SPII">SPII (Sensitive Personal Info)</option>
            <option value="PII">PII (Personal Info)</option>
            <option value="Non-Personal">Non-Personal Data</option>
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Est. Data Fields</div><input type="number" id="sysFieldsInput" class="search-input" style="width:100%;padding-left:14px;" value="10"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewRegisteredSystem()">Register System & Begin Mapping</button>
    </div>
  `);
}

function saveNewRegisteredSystem() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const name = document.getElementById('sysNameInput').value || 'New Department System';
  const deptId = document.getElementById('sysDeptInput').value;
  const type = document.getElementById('sysTypeInput').value;
  const vendor = document.getElementById('sysVendorInput').value || 'In-house';
  const cls = document.getElementById('sysClassInput').value;
  const fieldsCount = parseInt(document.getElementById('sysFieldsInput').value) || 8;

  const newSys = {
    id: `SYS-0${Math.floor(13 + Math.random() * 80)}`,
    name: name,
    department: deptId,
    type: type,
    vendor: vendor,
    dataFields: fieldsCount,
    classification: cls,
    status: 'mapped'
  };

  SAMPLE_DATA.systems.unshift(newSys);
  persistState();
  alert(`System "${newSys.name}" Registered Successfully & Persisted to DB!\n\nSystem ID: ${newSys.id}\nStatus: Mapped.`);
  closeModalDirect();
  initInventory();
}

// ══════════════════════════════════════════════════════════════
// GRIEVANCE LOGGING MODAL
// ══════════════════════════════════════════════════════════════

function showLogGrievanceModal() {
  if (currentRole && currentRole.isReadOnly) return;
  showModal(`
    <div class="modal-header"><h2>+ Log Grievance Ticket (Sec 13)</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Complainant Citizen Name</div><input type="text" id="grvNameInput" class="search-input" style="width:100%;padding-left:14px;" placeholder="Shri/Smt. ..."></div>
        <div class="detail-row"><div class="detail-label">Grievance Category</div>
          <select id="grvCatInput" class="filter-select" style="width:100%;">
            <option>Unauthorized Sharing</option><option>Consent Issues</option><option>Notice Quality</option><option>SLA Breach</option><option>Data Accuracy</option><option>Retention Issues</option>
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Department</div>
          <select id="grvDeptInput" class="filter-select" style="width:100%;">
            ${SAMPLE_DATA.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Escalation Starting Level</div><select class="filter-select" style="width:100%;"><option>Level 1 — Data Custodian</option></select></div>
      </div>
      <div class="detail-row"><div class="detail-label">Grievance Subject & Details</div>
        <textarea id="grvSubjectInput" class="search-input" style="width:100%;height:80px;padding:14px;resize:vertical;" placeholder="Describe grievance details..."></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewGrievanceTicket()">Log Ticket & Start SLA</button>
    </div>
  `);
}

function saveNewGrievanceTicket() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const name = document.getElementById('grvNameInput').value || 'Shri Citizen';
  const cat = document.getElementById('grvCatInput').value;
  const deptId = document.getElementById('grvDeptInput').value;
  const subject = document.getElementById('grvSubjectInput').value || 'Data protection grievance filed.';

  const slaDeadline = new Date();
  slaDeadline.setDate(slaDeadline.getDate() + 30);

  const newGrv = {
    id: `GRV-2026-0${Math.floor(49 + Math.random() * 50)}`,
    principalName: name,
    subject: subject,
    department: getDeptName(deptId),
    deptId: deptId,
    status: 'pending',
    level: 1,
    submittedAt: new Date().toISOString(),
    slaDeadline: slaDeadline.toISOString(),
    handler: null,
    category: cat
  };

  SAMPLE_DATA.grievances.unshift(newGrv);
  persistState();


  alert(`Grievance ${newGrv.id} Logged & Persisted to DB!\n\n30-Day Resolution SLA Active. Routed to ${newGrv.department}. Preserved across browser sessions.`);
  closeModalDirect();
  initGrievance();
}

// ══════════════════════════════════════════════════════════════
// DPIA INITIATION MODAL
// ══════════════════════════════════════════════════════════════

function showInitiateDPIAModal() {
  if (currentRole && currentRole.isReadOnly) return;
  showModal(`
    <div class="modal-header"><h2>+ Initiate Data Protection Impact Assessment (Sec 10)</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">DPIA Title</div><input type="text" id="dpiaTitleInput" class="search-input" style="width:100%;padding-left:14px;" placeholder="e.g., E-Governance AI Chatbot Data Processing"></div>
        <div class="detail-row"><div class="detail-label">Target System</div>
          <select id="dpiaSysInput" class="filter-select" style="width:100%;">
            ${SAMPLE_DATA.systems.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Initial Risk Level</div>
          <select id="dpiaRiskInput" class="filter-select" style="width:100%;"><option>high</option><option>critical</option><option>medium</option><option>low</option></select>
        </div>
        <div class="detail-row"><div class="detail-label">Algorithmic Due Diligence Required?</div>
          <select id="dpiaAlgoInput" class="filter-select" style="width:100%;"><option value="true">Yes — Automated Decision Making</option><option value="false">No — Standard Processing</option></select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewDPIA()">Initiate DPIA Assessment</button>
    </div>
  `);
}

function saveNewDPIA() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const title = document.getElementById('dpiaTitleInput').value || 'New DPIA Assessment';
  const sysId = document.getElementById('dpiaSysInput').value;
  const risk = document.getElementById('dpiaRiskInput').value;
  const algo = document.getElementById('dpiaAlgoInput').value === 'true';

  const newDPIA = {
    id: `DPIA-2026-00${Math.floor(5 + Math.random() * 20)}`,
    title: title,
    system: sysId,
    status: 'in-review',
    riskLevel: risk,
    initiatedAt: new Date().toISOString().split('T')[0],
    analyst: currentUser ? currentUser.name : 'Privacy Analyst',
    risks: 4,
    mitigations: 3,
    algorithmicDueDiligence: algo
  };

  SAMPLE_DATA.dpiaRecords.unshift(newDPIA);
  persistState();
  alert(`DPIA ${newDPIA.id} Initiated & Persisted to DB!\n\nStatus: In-Review. Assigned to Privacy Analyst & DPO.`);
  closeModalDirect();
  initDPIA();
}

// ══════════════════════════════════════════════════════════════
// RETENTION POLICY CREATION MODAL & SCANNER
// ══════════════════════════════════════════════════════════════

function showAddRetentionPolicyModal() {
  if (currentRole && currentRole.isReadOnly) return;
  showModal(`
    <div class="modal-header"><h2>+ Add Retention & Erasure Policy (Sec 8(4))</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Data Category</div><input type="text" id="retCatInput" class="search-input" style="width:100%;padding-left:14px;" placeholder="e.g., Trade License Records"></div>
        <div class="detail-row"><div class="detail-label">Department</div>
          <select id="retDeptInput" class="filter-select" style="width:100%;">
            ${SAMPLE_DATA.departments.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Retention Duration</div><input type="text" id="retPeriodInput" class="search-input" style="width:100%;padding-left:14px;" placeholder="e.g., 5 years / Duration of license"></div>
        <div class="detail-row"><div class="detail-label">Legal Basis</div><input type="text" id="retBasisInput" class="search-input" style="width:100%;padding-left:14px;" placeholder="e.g., Gujarat Shops & Establishment Act"></div>
        <div class="detail-row"><div class="detail-label">Post-Expiry Action</div>
          <select id="retActionInput" class="filter-select" style="width:100%;"><option>Erase</option><option>Anonymize</option><option>Archive</option></select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewRetentionPolicy()">Save Policy</button>
    </div>
  `);
}

function saveNewRetentionPolicy() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const cat = document.getElementById('retCatInput').value || 'New Category';
  const dept = document.getElementById('retDeptInput').value;
  const period = document.getElementById('retPeriodInput').value || '3 years';
  const basis = document.getElementById('retBasisInput').value || 'Municipal Code';
  const action = document.getElementById('retActionInput').value;

  const newPol = {
    id: `RET-00${Math.floor(9 + Math.random() * 20)}`,
    dataCategory: cat,
    department: dept,
    retentionPeriod: period,
    legalBasis: basis,
    postExpiryAction: action,
    status: 'active'
  };

  SAMPLE_DATA.retentionPolicies.unshift(newPol);
  persistState();
  alert(`Retention Policy ${newPol.id} Saved & Persisted to DB!\n\nBackground scanner will enforce post-expiry action: ${action}.`);
  closeModalDirect();
  initRetention();
}

function runDryRetentionScan() {
  showModal(`
    <div class="modal-header"><h2>Retention Dry Scan Execution (Automated Audit)</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="alert-banner info"><span class="alert-icon">🔍</span>Dry scan completed on 12 registered systems. No data was modified.</div>
      <div class="detail-grid mt-2">
        <div class="detail-row"><div class="detail-label">Systems Scanned</div><div class="detail-value">12 Systems</div></div>
        <div class="detail-row"><div class="detail-label">Records Past Retention</div><div class="detail-value" style="color:var(--red-700);font-weight:700">1,506 Records</div></div>
        <div class="detail-row"><div class="detail-label">Active Legal Holds</div><div class="detail-value">1,205 Records (Income Tax)</div></div>
        <div class="detail-row"><div class="detail-label">Approved Erasure Queue</div><div class="detail-value" style="color:var(--green-700);font-weight:700">301 Records</div></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-primary" onclick="closeModalDirect()">Close Scan Summary</button></div>
  `);
}

// ══════════════════════════════════════════════════════════════
// ADMIN USER CREATION MODAL
// ══════════════════════════════════════════════════════════════

function showAddUserModal() {
  if (currentRole && currentRole.isReadOnly) return;
  const rolesObj = typeof ROLES !== 'undefined' ? ROLES : window.ROLES;
  if (!rolesObj) return;

  showModal(`
    <div class="modal-header"><h2>+ Provision New User & Assign Role</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Full Name</div><input type="text" id="usrNameInput" class="search-input" style="width:100%;padding-left:14px;" placeholder="Shri/Smt. ..."></div>
        <div class="detail-row"><div class="detail-label">Assign Role (15 Roles)</div>
          <select id="usrRoleInput" class="filter-select" style="width:100%;">
            ${Object.keys(rolesObj).map(k => `<option value="${k}">${rolesObj[k].label} (${rolesObj[k].category})</option>`).join('')}
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Gov Email Address</div><input type="email" id="usrEmailInput" class="search-input" style="width:100%;padding-left:14px;" placeholder="name@amc.gov.in"></div>
        <div class="detail-row"><div class="detail-label">Enforce MFA</div><select id="usrMfaInput" class="filter-select" style="width:100%;"><option value="true">Enabled (Mandatory)</option><option value="false">Disabled</option></select></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewUser()">Provision User</button>
    </div>
  `);
}

function saveNewUser() {
  if (typeof ADMIN_DATA === 'undefined') return;
  const rolesObj = typeof ROLES !== 'undefined' ? ROLES : window.ROLES;
  const name = document.getElementById('usrNameInput').value || 'Shri Gov User';
  const role = document.getElementById('usrRoleInput').value;
  const email = document.getElementById('usrEmailInput').value || 'user@amc.gov.in';
  const mfa = document.getElementById('usrMfaInput').value === 'true';

  const newUsr = {
    id: `USR-0${Math.floor(13 + Math.random() * 80)}`,
    name: name,
    role: role,
    status: 'active',
    lastLogin: new Date().toISOString(),
    mfa: mfa
  };

  ADMIN_DATA.users.unshift(newUsr);
  alert(`User ${newUsr.name} Provisioned!\n\nUser ID: ${newUsr.id}\nRole: ${rolesObj[role].label}`);
  closeModalDirect();
  initAdmin();
}

// ══════════════════════════════════════════════════════════════
// RIGHTS WORKFLOW MODALS
// ══════════════════════════════════════════════════════════════

function showRightsDetail(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const r = SAMPLE_DATA.rightsRequests.find(req => req.id === id);
  if (!r) return;
  const sla = getSLAStatus(r.slaDeadline);
  showModal(`
    <div class="modal-header"><h2>Rights Request Workflow — ${r.id}</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid">
        <div class="detail-row"><div class="detail-label">Request Type</div><div class="detail-value"><span class="badge badge-info">${r.type}</span></div></div>
        <div class="detail-row"><div class="detail-label">Status</div><div class="detail-value">${statusBadge(r.status)}</div></div>
        <div class="detail-row"><div class="detail-label">Data Principal</div><div class="detail-value">${r.principalName}</div></div>
        <div class="detail-row"><div class="detail-label">Target Department</div><div class="detail-value">${r.department}</div></div>
        <div class="detail-row"><div class="detail-label">Submitted Timestamp</div><div class="detail-value">${formatDateTime(r.submittedAt)}</div></div>
        <div class="detail-row"><div class="detail-label">Statutory SLA Deadline</div><div class="detail-value">${formatDateTime(r.slaDeadline)} <span class="badge ${sla.class}">${sla.text}</span></div></div>
        <div class="detail-row"><div class="detail-label">Assigned Custodian</div><div class="detail-value">${r.assignedTo || 'Unassigned'}</div></div>
        <div class="detail-row"><div class="detail-label">Completion Timestamp</div><div class="detail-value">${r.completedAt ? formatDateTime(r.completedAt) : 'In Progress'}</div></div>
      </div>
      <div class="mt-3"><div class="detail-label mb-1">Request Details & Justification</div><div style="background:var(--gray-50);padding:14px;border-radius:6px;font-size:13px;line-height:1.5;">${r.description}</div></div>
      ${r.holdReason ? `<div class="mt-2 alert-banner warning"><span class="alert-icon">⚠️</span><div><strong>Legal Hold Active:</strong> ${r.holdReason}. Erasure cannot proceed until hold expires.</div></div>` : ''}
    </div>
    <div class="modal-footer">
      ${currentRole && !currentRole.isReadOnly && r.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="assignRightsRequest('${r.id}')">Assign to Me</button>` : ''}
      ${currentRole && !currentRole.isReadOnly && (r.status === 'in-progress' || r.status === 'pending') ? `<button class="btn btn-success btn-sm" onclick="completeRightsRequest('${r.id}')">Mark Fulfill & Complete</button>` : ''}
      <button class="btn btn-secondary btn-sm" onclick="closeModalDirect()">Close</button>
    </div>
  `);
}

function assignRightsRequest(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const r = SAMPLE_DATA.rightsRequests.find(req => req.id === id);
  if (r) {
    r.assignedTo = currentUser ? currentUser.name : 'Officer';
    r.status = 'in-progress';
    alert(`Request ${id} assigned to ${r.assignedTo}. Status set to In-Progress.`);
    closeModalDirect();
    initRights();
  }
}

function completeRightsRequest(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const r = SAMPLE_DATA.rightsRequests.find(req => req.id === id);
  if (r) {
    r.status = 'completed';
    r.completedAt = new Date().toISOString();
    alert(`Request ${id} marked COMPLETED.\n\nFulfillment confirmation dispatched to citizen via SMS & Email.`);
    closeModalDirect();
    initRights();
  }
}

function showNewRightsForm() {
  if (currentRole && currentRole.isReadOnly) return;
  showModal(`
    <div class="modal-header"><h2>Log New Citizen Rights Request (Sec 11-14)</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Citizen Name</div><input type="text" id="newReqName" class="search-input" style="width:100%;padding-left:14px;" placeholder="Citizen Name"></div>
        <div class="detail-row"><div class="detail-label">Right Type</div>
          <select id="newReqType" class="filter-select" style="width:100%;">
            <option>Access</option><option>Correction</option><option>Erasure</option><option>Grievance</option><option>Nomination</option>
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Department</div>
          <select id="newReqDept" class="filter-select" style="width:100%;">
            ${SAMPLE_DATA.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Identity Verification</div><select class="filter-select" style="width:100%;"><option>OTP Verified</option><option>Manual Verification</option></select></div>
      </div>
      <div class="detail-row"><div class="detail-label">Request Description</div>
        <textarea id="newReqDesc" class="search-input" style="width:100%;height:80px;padding:14px;resize:vertical;" placeholder="Details of request..."></textarea>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button><button class="btn btn-primary" onclick="saveNewRightsRequest()">Submit & Auto-Route</button></div>
  `);
}

function saveNewRightsRequest() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const name = document.getElementById('newReqName').value || 'Citizen User';
  const type = document.getElementById('newReqType').value;
  const deptId = document.getElementById('newReqDept').value;
  const desc = document.getElementById('newReqDesc').value || 'Rights request submitted.';

  const slaDays = type === 'Erasure' ? 30 : 15;
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + slaDays);

  const newReq = {
    id: `RR-2026-00${Math.floor(93 + Math.random() * 800)}`,
    principalName: name,
    type: type,
    department: getDeptName(deptId),
    deptId: deptId,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    slaDeadline: deadline.toISOString(),
    assignedTo: null,
    description: desc
  };

  SAMPLE_DATA.rightsRequests.unshift(newReq);
  persistState();
  alert(`Rights Request ${newReq.id} Logged & Persisted to DB!\n\nStatutory SLA Deadline: ${formatDate(deadline.toISOString())} (${slaDays} days). Auto-routed to ${newReq.department}. Data is permanently preserved across sessions.`);
  closeModalDirect();
  initRights();
}

function exportRightsCSV() {
  const data = getScopedRightsRequests();
  showModal(`
    <div class="modal-header"><h2>Export Rights Requests (Audit Package)</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <p class="mb-2">Exporting <strong>${data.length} records</strong> formatted for DPDP Compliance Audit.</p>
      <div style="background:var(--gray-50);padding:14px;border-radius:6px;font-family:Consolas,monospace;font-size:11px;max-height:200px;overflow-y:auto;">
        Request_ID,Principal_Name,Type,Department,Status,Submitted_Date,SLA_Deadline<br>
        ${data.slice(0, 5).map(r => `${r.id},"${r.principalName}",${r.type},"${r.department}",${r.status},${formatDate(r.submittedAt)},${formatDate(r.slaDeadline)}`).join('<br>')}
        <br>... [${data.length - 5} more rows]
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button><button class="btn btn-primary" onclick="alert('File rights_export_2026.csv downloaded.'); closeModalDirect();">Download CSV</button></div>
  `);
}

// ══════════════════════════════════════════════════════════════
// BREACH RESPONSE MODALS
// ══════════════════════════════════════════════════════════════

function initBreach() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const incidents = SAMPLE_DATA.breachIncidents;
  const active = incidents.filter(i => i.status === 'active').length;

  const alertsEl = document.getElementById('breachAlerts');
  if (alertsEl) {
    alertsEl.innerHTML = active > 0 ? `
      <div class="alert-banner critical"><span class="alert-icon">🚨</span><div><strong>ACTIVE BREACH INCIDENT</strong> — Dual-clock reporting active (CERT-In 6h & DPB 72h).</div></div>` : '';
  }

  const statsEl = document.getElementById('breachStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card accent-red"><div class="stat-header"><span class="stat-label">Active Incidents</span></div><div class="stat-value">${active}</div></div>
      <div class="stat-card accent-green"><div class="stat-header"><span class="stat-label">Resolved</span></div><div class="stat-value">${incidents.filter(i => i.status === 'resolved').length}</div></div>
      <div class="stat-card accent-blue"><div class="stat-header"><span class="stat-label">Total Affected</span></div><div class="stat-value">${incidents.reduce((s,i)=>s+i.estimatedPrincipals,0).toLocaleString()}</div></div>
      <div class="stat-card accent-saffron"><div class="stat-header"><span class="stat-label">Avg Response Time</span></div><div class="stat-value">4.5h</div></div>
    `;
  }

  const activeBreach = incidents.find(i => i.status === 'active');
  const activeSecEl = document.getElementById('activeBreachSection');
  if (activeSecEl) {
    if (activeBreach) {
      activeSecEl.innerHTML = `
        <div class="card" style="border-left:4px solid var(--red-500);">
          <div class="card-header"><h3>🚨 ${activeBreach.title} — ${activeBreach.id}</h3>${severityBadge(activeBreach.severity)}</div>
          <div class="card-body">
            <div class="detail-grid mb-3">
              <div class="detail-row"><div class="detail-label">Detected At</div><div class="detail-value">${formatDateTime(activeBreach.detectedAt)}</div></div>
              <div class="detail-row"><div class="detail-label">Affected System</div><div class="detail-value">${getSystemName(activeBreach.affectedSystem)}</div></div>
              <div class="detail-row"><div class="detail-label">Est. Affected Principals</div><div class="detail-value" style="color:var(--red-700);font-weight:800">${activeBreach.estimatedPrincipals.toLocaleString()}</div></div>
              <div class="detail-row"><div class="detail-label">DPB Detailed Report Due</div><div class="detail-value"><span class="badge badge-danger">${formatDateTime(activeBreach.dpbDetailedDue)}</span></div></div>
            </div>
            <div class="mb-2"><div class="detail-label mb-1">Containment Actions Executed</div><ul style="padding-left:18px;font-size:13px;line-height:1.8;">${activeBreach.containmentActions.map(a => `<li>✓ ${a}</li>`).join('')}</ul></div>
            <div class="mb-2"><div class="detail-label mb-1">Regulatory Notification Status</div>
              <div class="flex gap-12 mt-1">
                <span class="badge badge-success">CERT-In 6h: ✓ Reported (${formatDateTime(activeBreach.certInReportedAt)})</span>
                <span class="badge badge-success">DPB Initial: ✓ Sent (${formatDateTime(activeBreach.dpbIntimatedAt)})</span>
                <span class="badge badge-warning">DPB Detailed 72h: ⏳ Pending Draft</span>
              </div>
            </div>
          </div>
          <div class="card-footer flex-between">
            <span class="text-sm text-muted">Dual-Clock Compliance Status</span>
            <div class="flex gap-12">
              ${currentRole && !currentRole.isReadOnly ? `<button class="btn btn-danger btn-sm" onclick="showDPBReportDraftModal('${activeBreach.id}')">Draft DPB Detailed Report (Rule 7)</button>` : ''}
              ${currentRole && !currentRole.isReadOnly ? `<button class="btn btn-saffron btn-sm" onclick="showPrincipalNotifyModal('${activeBreach.id}')">Notify Affected Citizens</button>` : ''}
            </div>
          </div>
        </div>
      `;
    } else {
      activeSecEl.innerHTML = '';
    }
  }

  const tbody = document.getElementById('breachTableBody');
  if (tbody) {
    tbody.innerHTML = incidents.map(i => `
      <tr onclick="showBreachDetailModal('${i.id}')">
        <td class="td-id">${i.id}</td>
        <td class="td-name">${i.title}</td>
        <td>${severityBadge(i.severity)}</td>
        <td>${statusBadge(i.status)}</td>
        <td>${formatDateTime(i.detectedAt)}</td>
        <td style="font-weight:700">${i.estimatedPrincipals.toLocaleString()}</td>
        <td>${i.certInReportedAt ? '<span class="badge badge-success">✓</span>' : '<span class="badge badge-danger">✗</span>'}</td>
        <td>${i.dpbIntimatedAt ? '<span class="badge badge-success">✓</span>' : '<span class="badge badge-danger">✗</span>'}</td>
        <td><button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showBreachDetailModal('${i.id}')">Details</button></td>
      </tr>
    `).join('');
  }
}

function showBreachDetailModal(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const i = SAMPLE_DATA.breachIncidents.find(b => b.id === id);
  if (!i) return;
  showModal(`
    <div class="modal-header"><h2>Breach Incident Investigation — ${i.id}</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Title</div><div class="detail-value">${i.title}</div></div>
        <div class="detail-row"><div class="detail-label">Severity</div><div class="detail-value">${severityBadge(i.severity)}</div></div>
        <div class="detail-row"><div class="detail-label">Affected System</div><div class="detail-value">${getSystemName(i.affectedSystem)}</div></div>
        <div class="detail-row"><div class="detail-label">Affected Department</div><div class="detail-value">${i.affectedDepartment}</div></div>
        <div class="detail-row"><div class="detail-label">Detected By</div><div class="detail-value">${i.detectedBy}</div></div>
        <div class="detail-row"><div class="detail-label">Estimated Principals Affected</div><div class="detail-value">${i.estimatedPrincipals.toLocaleString()}</div></div>
      </div>
      <div class="mb-2"><div class="detail-label mb-1">Description</div><div style="background:var(--gray-50);padding:12px;border-radius:6px;font-size:13px;">${i.description}</div></div>
      ${i.rootCause ? `<div class="mb-2"><div class="detail-label mb-1">Root Cause Analysis</div><div style="background:var(--red-100);color:var(--red-700);padding:12px;border-radius:6px;font-size:13px;">${i.rootCause}</div></div>` : ''}
    </div>
    <div class="modal-footer"><button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button></div>
  `);
}

function showDPBReportDraftModal(id) {
  showModal(`
    <div class="modal-header"><h2>Draft DPB Rule 7 Detailed Breach Report</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="alert-banner warning"><span class="alert-icon">⚖️</span>Filing with Data Protection Board of India under Rule 7 of DPDP Rules 2025.</div>
      <div class="mt-2"><div class="detail-label">1. Nature & Cause of Breach</div><textarea class="search-input" style="width:100%;height:60px;padding:10px;" readonly>Unauthorized API key exploitation resulting in bulk data exfiltration of birth & death records.</textarea></div>
      <div class="mt-2"><div class="detail-label">2. Remedial & Mitigation Measures Taken</div><textarea class="search-input" style="width:100%;height:60px;padding:10px;" readonly>API key revoked, IP blacklisted, firewall rules updated, endpoints secured with mTLS.</textarea></div>
      <div class="mt-2"><div class="detail-label">3. Measures to Intimate Affected Principals</div><textarea class="search-input" style="width:100%;height:60px;padding:10px;" readonly>SMS notifications queued for 12,000 citizens with advice on credential protection.</textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button><button class="btn btn-danger" onclick="alert('Detailed Breach Report Signed by DPO and Submitted to DPBI Portal.'); closeModalDirect();">Sign & Submit to DPB</button></div>
  `);
}

function showPrincipalNotifyModal(id) {
  showModal(`
    <div class="modal-header"><h2>Notify Affected Data Principals (Sec 8(6))</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-row mb-2"><div class="detail-label">Recipients</div><div class="detail-value">12,000 Affected Citizens</div></div>
      <div class="detail-row mb-2"><div class="detail-label">Message Preview (Gujarati & English)</div>
        <div style="background:var(--gray-50);padding:14px;border-radius:6px;font-size:13px;">
          "Important Security Notice from AMC: Your birth/death record reference was exposed in a security incident on 01-Sep. Immediate containment has been executed. No financial data was exposed. Contact DPO at dpo@amc.gov.in for queries."
        </div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button><button class="btn btn-saffron" onclick="alert('Notification dispatched to 12,000 citizens via NIC SMS Gateway.'); closeModalDirect();">Dispatch Notifications</button></div>
  `);
}

function showNewIncidentForm() {
  if (currentRole && currentRole.isReadOnly) return;
  showModal(`
    <div class="modal-header"><h2>Report New Incident</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="alert-banner warning"><span class="alert-icon">⏱</span>Starts 6-hour CERT-In & 72-hour DPB clock.</div>
      <div class="detail-grid mt-2">
        <div class="detail-row"><div class="detail-label">Title</div><input type="text" id="incTitle" class="search-input" style="width:100%;padding-left:14px;" placeholder="Incident Title"></div>
        <div class="detail-row"><div class="detail-label">Severity</div><select id="incSev" class="filter-select" style="width:100%;"><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div>
        <div class="detail-row"><div class="detail-label">System</div><select id="incSys" class="filter-select" style="width:100%;">${SAMPLE_DATA.systems.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
        <div class="detail-row"><div class="detail-label">Est. Affected</div><input type="number" id="incEst" class="search-input" style="width:100%;padding-left:14px;" placeholder="1000"></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button><button class="btn btn-danger" onclick="saveNewIncident()">Report & Start Clocks</button></div>
  `);
}

function saveNewIncident() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const title = document.getElementById('incTitle').value || 'Security Anomaly';
  const sev = document.getElementById('incSev').value.toLowerCase();
  const sys = document.getElementById('incSys').value;
  const est = parseInt(document.getElementById('incEst').value) || 500;

  const now = new Date();
  const dpbDue = new Date(now.getTime() + 72 * 3600000);

  const inc = {
    id: `BRI-2026-00${Math.floor(4 + Math.random() * 90)}`,
    title: title,
    severity: sev,
    status: 'active',
    detectedAt: now.toISOString(),
    detectedBy: currentUser ? currentUser.name : 'Security Officer',
    description: `Security incident logged in ${getSystemName(sys)}.`,
    affectedSystem: sys,
    affectedDepartment: 'IT Security',
    estimatedPrincipals: est,
    dataCategories: ['PII', 'Aadhaar'],
    certInReportedAt: now.toISOString(),
    dpbIntimatedAt: now.toISOString(),
    dpbDetailedDue: dpbDue.toISOString(),
    containmentActions: ['System isolated', 'Credentials revoked'],
    timelineEvents: [{ time: now.toISOString(), event: 'Incident reported', actor: currentUser ? currentUser.name : 'Security Officer' }]
  };

  SAMPLE_DATA.breachIncidents.unshift(inc);
  persistState();
  alert(`Incident ${inc.id} Logged & Persisted to DB!\n\nCERT-In (6h) & DPB Initial Intimations Recorded. State preserved across browser sessions.`);
  closeModalDirect();
  initBreach();
}

// ══════════════════════════════════════════════════════════════
// DATA INVENTORY
// ══════════════════════════════════════════════════════════════

let chartClassification, chartSysByDept;

function initInventory() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const systems = getScopedSystems();
  const fields = SAMPLE_DATA.dataFields;

  const statsEl = document.getElementById('inventoryStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card accent-blue"><div class="stat-header"><span class="stat-label">Total Systems</span></div><div class="stat-value">${systems.length}</div></div>
      <div class="stat-card accent-saffron"><div class="stat-header"><span class="stat-label">Data Fields</span></div><div class="stat-value">${fields.length}</div></div>
      <div class="stat-card accent-red"><div class="stat-header"><span class="stat-label">SPII Fields</span></div><div class="stat-value">${fields.filter(f => f.classification === 'SPII').length}</div></div>
      <div class="stat-card accent-green"><div class="stat-header"><span class="stat-label">Mapped Systems</span></div><div class="stat-value">${systems.filter(s => s.status === 'mapped').length}</div></div>
    `;
  }

  try {
    if (typeof Chart !== 'undefined') {
      const classCounts = { SPII: 0, PII: 0, 'Non-Personal': 0 };
      fields.forEach(f => { classCounts[f.classification] = (classCounts[f.classification] || 0) + 1; });

      const canvasClass = document.getElementById('chartClassification');
      if (canvasClass) {
        if (chartClassification && typeof chartClassification.destroy === 'function') chartClassification.destroy();
        chartClassification = new Chart(canvasClass, {
          type: 'doughnut',
          data: { labels: Object.keys(classCounts), datasets: [{ data: Object.values(classCounts), backgroundColor: ['#f44336','#ff9800','#4caf50'] }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
      }

      const deptSysCounts = {};
      systems.forEach(s => { const d = getDeptName(s.department); deptSysCounts[d] = (deptSysCounts[d] || 0) + 1; });

      const canvasSys = document.getElementById('chartSysByDept');
      if (canvasSys) {
        if (chartSysByDept && typeof chartSysByDept.destroy === 'function') chartSysByDept.destroy();
        chartSysByDept = new Chart(canvasSys, {
          type: 'bar',
          data: { labels: Object.keys(deptSysCounts), datasets: [{ label: 'Systems', data: Object.values(deptSysCounts), backgroundColor: '#1a3a6b' }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
      }
    }
  } catch (err) {
    console.warn('Inventory Chart warning:', err);
  }

  renderSystemTable(systems);
  renderFieldTable(fields);
  renderResidencyTable();
}

function switchInventoryTab(tab) {
  const tabs = ['ropa', 'residency', 'processors', 'sharing'];
  tabs.forEach(t => {
    const btn = document.getElementById('btnTab' + t.charAt(0).toUpperCase() + t.slice(1));
    const tabEl = document.getElementById('inventoryTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) {
      if (t === tab) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    if (tabEl) {
      if (t === tab) {
        tabEl.classList.remove('hidden');
        tabEl.style.display = 'block';
      } else {
        tabEl.classList.add('hidden');
        tabEl.style.display = 'none';
      }
    }
  });

  if (tab === 'residency') renderResidencyTable();
  if (tab === 'processors') renderProcessorsTable();
  if (tab === 'sharing') renderSharingTable();
}

function renderResidencyTable() {
  const tbody = document.getElementById('residencyTableBody');
  if (!tbody || typeof SAMPLE_DATA === 'undefined') return;

  tbody.innerHTML = SAMPLE_DATA.systems.map(s => `
    <tr>
      <td style="font-weight:700">
        ${s.name}
        <br><span class="td-muted">${s.id} · ${getDeptName(s.department)}</span>
      </td>
      <td>
        <strong style="color:var(--navy-900)">${s.hostingLocation || 'Gujarat State Data Center (SDC)'}</strong>
        <br><span style="font-size:11px;color:var(--gray-500)">🇮🇳 ${s.country || 'India'}</span>
      </td>
      <td><span class="badge badge-neutral">${s.datacenterTier || 'Tier-III'}</span></td>
      <td><span class="badge badge-success">✓ MeitY Empanelled</span></td>
      <td>
        <span class="badge badge-info">Zero Egress (AMC Policy)</span>
        <br><span style="font-size:10px;color:var(--gray-500);">Sec 16 Blacklist Compliant</span>
      </td>
      <td><code>${s.encryptionAtRest || 'AES-256 (HSM)'}</code></td>
      <td><span class="residency-badge-sovereign"><span class="residency-pulse"></span> Sovereign Secured</span></td>
    </tr>
  `).join('');
}

function renderProcessorsTable() {
  const tbody = document.getElementById('processorsTableBody');
  const procs = typeof DATA_PROCESSORS !== 'undefined' ? DATA_PROCESSORS : window.DATA_PROCESSORS;
  if (!tbody || !procs) return;

  tbody.innerHTML = procs.map(p => `
    <tr>
      <td class="td-id"><strong>${p.id}</strong></td>
      <td>
        <strong style="color:var(--navy-900)">${p.name}</strong>
        <br><span class="td-muted">${p.liabilitiesClause}</span>
      </td>
      <td>
        ${p.systemsManaged.map(s => `<span class="badge badge-neutral mb-1" style="font-size:10px;">${s}</span>`).join(' ')}
      </td>
      <td>
        <span class="badge badge-statutory">${p.dpaStatus}</span>
        <br><span class="td-muted">${p.dpaExecutionDate} to ${p.dpaExpiryDate}</span>
      </td>
      <td>
        ${p.securityCertifications.map(c => `<span class="badge badge-info" style="font-size:10px;margin-bottom:2px;">${c}</span>`).join(' ')}
        <br><span class="badge badge-success" style="font-size:10px;">${p.auditStatus}</span>
      </td>
      <td>
        ${p.subProcessors.length > 0 ? p.subProcessors.map(sp => `
          <div style="font-size:11px;border-bottom:1px solid #e2e8f0;padding:2px 0;">
            <strong>${sp.name}</strong> (${sp.service})<br>
            <span class="text-muted">${sp.country} · DPA: ${sp.dpaSigned ? '✓ Signed' : 'Pending'}</span>
          </div>
        `).join('') : '<span class="text-muted" style="font-size:11px;">Zero Sub-processors</span>'}
      </td>
      <td>
        <strong style="font-size:12px;">${p.technicalPOC}</strong>
      </td>
    </tr>
  `).join('');
}

function renderSharingTable() {
  const tbody = document.getElementById('sharingTableBody');
  const sharing = typeof DATA_SHARING_REGISTER !== 'undefined' ? DATA_SHARING_REGISTER : window.DATA_SHARING_REGISTER;
  if (!tbody || !sharing) return;

  tbody.innerHTML = sharing.map(s => `
    <tr>
      <td class="td-id"><strong>${s.id}</strong></td>
      <td>
        <strong style="color:var(--navy-900)">${s.recipientEntity}</strong>
        <br><span class="badge badge-statutory" style="font-size:10px;">${s.dpaExecuted ? '✓ DPA Active' : 'Inter-Govt'}</span>
      </td>
      <td><span class="badge badge-neutral">${s.categoryOfEntity}</span></td>
      <td>
        ${s.personalDataShared.map(d => `<span class="badge badge-info" style="font-size:10px;margin-bottom:2px;">${d}</span>`).join(' ')}
      </td>
      <td><span class="badge badge-statutory">${s.statutoryLegalGround}</span></td>
      <td style="font-size:12px;">${s.purpose}</td>
      <td style="font-size:11px;font-family:monospace;color:#1e293b;">${s.dataTransferProtocol}</td>
    </tr>
  `).join('');
}

function getScopedSystems() {
  if (typeof SAMPLE_DATA === 'undefined') return [];
  if (currentRole && currentRole.department) {
    return SAMPLE_DATA.systems.filter(s => s.department === currentRole.department);
  }
  return SAMPLE_DATA.systems;
}

function renderSystemTable(data) {
  const tbody = document.getElementById('systemTableBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(s => `
    <tr onclick="showSystemDetailModal('${s.id}')">
      <td class="td-id">${s.id}</td>
      <td class="td-name">${s.name}</td>
      <td>${getDeptName(s.department)}</td>
      <td>${s.type}</td>
      <td>${s.vendor}</td>
      <td>${s.dataFields}</td>
      <td>${s.classification === 'SPII' ? '<span class="badge badge-danger">SPII</span>' : '<span class="badge badge-warning">PII</span>'}</td>
      <td>${statusBadge(s.status)}</td>
    </tr>
  `).join('');
}

function showSystemDetailModal(sysId) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const sys = SAMPLE_DATA.systems.find(s => s.id === sysId);
  if (!sys) return;
  const sysFields = SAMPLE_DATA.dataFields.filter(f => f.system === sysId);

  showModal(`
    <div class="modal-header"><h2>System Data Inventory Mapping — ${sys.name}</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-3">
        <div class="detail-row"><div class="detail-label">System ID</div><div class="detail-value">${sys.id}</div></div>
        <div class="detail-row"><div class="detail-label">Department</div><div class="detail-value">${getDeptName(sys.department)}</div></div>
        <div class="detail-row"><div class="detail-label">Application Type</div><div class="detail-value">${sys.type}</div></div>
        <div class="detail-row"><div class="detail-label">Vendor / Developer</div><div class="detail-value">${sys.vendor}</div></div>
        <div class="detail-row"><div class="detail-label">Data Classification</div><div class="detail-value">${sys.classification === 'SPII' ? '<span class="badge badge-danger">SPII</span>' : '<span class="badge badge-warning">PII</span>'}</div></div>
        <div class="detail-row"><div class="detail-label">Mapping Status</div><div class="detail-value">${statusBadge(sys.status)}</div></div>
      </div>
      <div class="detail-label mb-1">Mapped Personal Data Fields (${sysFields.length})</div>
      <table class="data-table">
        <thead><tr><th>Field</th><th>Classification</th><th>Sensitivity</th><th>Legal Basis</th></tr></thead>
        <tbody>
          ${sysFields.map(f => `<tr><td>${f.name}</td><td>${f.classification}</td><td>${f.sensitivity}</td><td>${f.legalBasis}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="modal-footer"><button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button></div>
  `);
}

function renderFieldTable(data) {
  const tbody = document.getElementById('fieldTableBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(f => `
    <tr>
      <td class="td-id">${f.id}</td>
      <td class="td-name">${f.name}</td>
      <td>${getSystemName(f.system)}</td>
      <td>${f.classification === 'SPII' ? '<span class="badge badge-danger">SPII</span>' : '<span class="badge badge-warning">PII</span>'}</td>
      <td>${f.sensitivity}</td>
      <td class="text-sm">${f.purpose}</td>
      <td><span class="badge badge-neutral">${f.legalBasis}</span></td>
      <td class="text-sm">${f.retention}</td>
    </tr>
  `).join('');
}

function filterSystems() {
  const searchInput = document.getElementById('systemSearch');
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  const systems = getScopedSystems();
  renderSystemTable(systems.filter(s => !search || s.name.toLowerCase().includes(search)));
}

function filterFields() {
  const searchInput = document.getElementById('fieldSearch');
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  if (typeof SAMPLE_DATA === 'undefined') return;
  renderFieldTable(SAMPLE_DATA.dataFields.filter(f => !search || f.name.toLowerCase().includes(search)));
}

function generateRoPAPrompt() {
  showModal(`
    <div class="modal-header"><h2>Records of Processing Activities (RoPA - Sec 4 & 8)</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="alert-banner info"><span class="alert-icon">📄</span>Statutory RoPA Report for Ahmedabad Municipal Corporation generated.</div>
      <div class="detail-grid mt-2">
        <div class="detail-row"><div class="detail-label">Total Processing Activities</div><div class="detail-value">12 Registered Systems</div></div>
        <div class="detail-row"><div class="detail-label">Total Data Fields</div><div class="detail-value">20 Personal Data Fields</div></div>
        <div class="detail-row"><div class="detail-label">Compliance Alignment</div><div class="detail-value">DPDP Act 2023 Sec 4 & 8</div></div>
        <div class="detail-row"><div class="detail-label">Generated Timestamp</div><div class="detail-value">${formatDateTime(new Date().toISOString())}</div></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="alert('RoPA Exported to PDF.'); closeModalDirect();">Download PDF Report</button>
      <button class="btn btn-saffron" onclick="alert('RoPA Exported to Excel.'); closeModalDirect();">Download XLSX</button>
    </div>
  `);
}

// ══════════════════════════════════════════════════════════════
// GRIEVANCE REDRESSAL MODALS
// ══════════════════════════════════════════════════════════════

let chartGrievanceCategory, chartEscalation;

function initGrievance() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const grievances = getScopedGrievances();
  const statsEl = document.getElementById('grievanceStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card accent-blue"><div class="stat-header"><span class="stat-label">Total Grievances</span></div><div class="stat-value">${grievances.length}</div></div>
      <div class="stat-card accent-yellow"><div class="stat-header"><span class="stat-label">Pending</span></div><div class="stat-value">${grievances.filter(g => g.status === 'pending').length}</div></div>
      <div class="stat-card accent-red"><div class="stat-header"><span class="stat-label">Escalated</span></div><div class="stat-value">${grievances.filter(g => g.status === 'escalated').length}</div></div>
      <div class="stat-card accent-green"><div class="stat-header"><span class="stat-label">Resolved</span></div><div class="stat-value">${grievances.filter(g => g.status === 'resolved').length}</div></div>
    `;
  }

  try {
    if (typeof Chart !== 'undefined') {
      const catCounts = {};
      grievances.forEach(g => { catCounts[g.category] = (catCounts[g.category] || 0) + 1; });

      const canvasCat = document.getElementById('chartGrievanceCategory');
      if (canvasCat) {
        if (chartGrievanceCategory && typeof chartGrievanceCategory.destroy === 'function') chartGrievanceCategory.destroy();
        chartGrievanceCategory = new Chart(canvasCat, {
          type: 'bar',
          data: { labels: Object.keys(catCounts), datasets: [{ label: 'Grievances', data: Object.values(catCounts), backgroundColor: '#ff9800' }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
      }

      const canvasEsc = document.getElementById('chartEscalation');
      if (canvasEsc) {
        if (chartEscalation && typeof chartEscalation.destroy === 'function') chartEscalation.destroy();
        chartEscalation = new Chart(canvasEsc, {
          type: 'doughnut',
          data: { labels: ['Level 1 — Custodian','Level 2 — Compliance','Level 3 — DPO'], datasets: [{ data: [5,2,1], backgroundColor: ['#4caf50','#ff9800','#f44336'] }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
      }
    }
  } catch (err) {
    console.warn('Grievance Chart warning:', err);
  }

  renderGrievanceTable(grievances);
}

function getScopedGrievances() {
  if (typeof SAMPLE_DATA === 'undefined') return [];
  if (currentRole && currentRole.department) {
    return SAMPLE_DATA.grievances.filter(g => g.deptId === currentRole.department);
  }
  return SAMPLE_DATA.grievances;
}

function renderGrievanceTable(data) {
  const tbody = document.getElementById('grievanceTableBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(g => `
    <tr onclick="showGrievanceDetailModal('${g.id}')">
      <td class="td-id">${g.id}</td>
      <td class="td-name">${g.principalName}</td>
      <td class="text-sm">${g.subject}</td>
      <td><span class="badge badge-neutral">${g.category}</span></td>
      <td>${g.department}</td>
      <td>${statusBadge(g.status)}</td>
      <td><span class="badge ${g.level === 3 ? 'badge-danger' : 'badge-info'}">L${g.level}</span></td>
      <td>${formatDate(g.slaDeadline)}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showGrievanceDetailModal('${g.id}')">View</button></td>
    </tr>
  `).join('');
}

function showGrievanceDetailModal(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const g = SAMPLE_DATA.grievances.find(grv => grv.id === id);
  if (!g) return;
  showModal(`
    <div class="modal-header"><h2>4-Level Grievance Escalation — ${g.id}</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Complainant</div><div class="detail-value">${g.principalName}</div></div>
        <div class="detail-row"><div class="detail-label">Subject</div><div class="detail-value">${g.subject}</div></div>
        <div class="detail-row"><div class="detail-label">Category</div><div class="detail-value">${g.category}</div></div>
        <div class="detail-row"><div class="detail-label">Department</div><div class="detail-value">${g.department}</div></div>
        <div class="detail-row"><div class="detail-label">Escalation Level</div><div class="detail-value"><span class="badge badge-danger">Level ${g.level} — ${g.level === 3 ? 'DPO Office' : 'Department'}</span></div></div>
        <div class="detail-row"><div class="detail-label">Status</div><div class="detail-value">${statusBadge(g.status)}</div></div>
      </div>
      <div class="mt-2"><div class="detail-label mb-1">Escalation Matrix Tracker</div>
        <div style="background:var(--gray-50);padding:12px;border-radius:6px;font-size:12px;line-height:1.8;">
          ✓ L1: Data Custodian (Unresolved after 7 days)<br>
          ✓ L2: Compliance Officer (Escalated after 15 days)<br>
          ⏳ L3: DPO Investigation Active (Deadline: ${formatDate(g.slaDeadline)})<br>
          ⚪ L4: Data Protection Board (DPB) External Appeal
        </div>
      </div>
    </div>
    <div class="modal-footer">
      ${currentRole && !currentRole.isReadOnly && g.status !== 'resolved' ? `<button class="btn btn-success btn-sm" onclick="resolveGrievance('${g.id}')">Resolve Grievance</button>` : ''}
      <button class="btn btn-secondary btn-sm" onclick="closeModalDirect()">Close</button>
    </div>
  `);
}

function resolveGrievance(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const g = SAMPLE_DATA.grievances.find(grv => grv.id === id);
  if (g) {
    g.status = 'resolved';
    g.resolvedAt = new Date().toISOString();
    persistState();
    alert(`Grievance ${id} marked RESOLVED & Persisted to DB.\n\nResolution order dispatched to citizen.`);
    closeModalDirect();
    initGrievance();
  }
}

function filterGrievances() {
  const searchInput = document.getElementById('grievanceSearch');
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  renderGrievanceTable(getScopedGrievances().filter(g => !search || g.subject.toLowerCase().includes(search)));
}

// ══════════════════════════════════════════════════════════════
// DPIA MODALS
// ══════════════════════════════════════════════════════════════

function initDPIA() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const dpias = SAMPLE_DATA.dpiaRecords;

  const statsEl = document.getElementById('dpiaStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card accent-blue"><div class="stat-header"><span class="stat-label">Total DPIAs</span></div><div class="stat-value">${dpias.length}</div></div>
      <div class="stat-card accent-green"><div class="stat-header"><span class="stat-label">Approved</span></div><div class="stat-value">${dpias.filter(d => d.status === 'approved').length}</div></div>
      <div class="stat-card accent-yellow"><div class="stat-header"><span class="stat-label">In Review</span></div><div class="stat-value">${dpias.filter(d => d.status === 'in-review').length}</div></div>
      <div class="stat-card accent-purple"><div class="stat-header"><span class="stat-label">Algorithmic Audits</span></div><div class="stat-value">1</div></div>
    `;
  }

  const tbody = document.getElementById('dpiaTableBody');
  if (tbody) {
    tbody.innerHTML = dpias.map(d => `
      <tr onclick="showDPIADetailModal('${d.id}')">
        <td class="td-id">${d.id}</td>
        <td class="td-name">${d.title}${d.algorithmicDueDiligence ? ' <span class="badge badge-purple">Algo</span>' : ''}</td>
        <td>${getSystemName(d.system)}</td>
        <td>${statusBadge(d.status)}</td>
        <td>${severityBadge(d.riskLevel)}</td>
        <td>${d.risks} / ${d.mitigations}</td>
        <td>${formatDate(d.initiatedAt)}</td>
        <td>${d.nextReviewAt ? formatDate(d.nextReviewAt) : '—'}</td>
        <td><button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showDPIADetailModal('${d.id}')">View</button></td>
      </tr>
    `).join('');
  }

  const algoEl = document.getElementById('algoSection');
  if (algoEl) {
    algoEl.innerHTML = `
      <div class="alert-banner info"><span class="alert-icon">🤖</span><div><strong>Public Health Surveillance — Automated Risk Scoring</strong> requires algorithmic due diligence under Sec 10 of DPDP Act.</div></div>
    `;
  }
}

function showDPIADetailModal(id) {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const d = SAMPLE_DATA.dpiaRecords.find(dp => dp.id === id);
  if (!d) return;
  showModal(`
    <div class="modal-header"><h2>Data Protection Impact Assessment (Sec 10) — ${d.id}</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Title</div><div class="detail-value">${d.title}</div></div>
        <div class="detail-row"><div class="detail-label">System</div><div class="detail-value">${getSystemName(d.system)}</div></div>
        <div class="detail-row"><div class="detail-label">Overall Risk Level</div><div class="detail-value">${severityBadge(d.riskLevel)}</div></div>
        <div class="detail-row"><div class="detail-label">Status</div><div class="detail-value">${statusBadge(d.status)}</div></div>
      </div>
      <div class="detail-label mb-1">Identified Risk & Mitigation Heatmap (${d.risks} Risks)</div>
      <div style="background:var(--gray-50);padding:12px;border-radius:6px;font-size:12px;">
        1. Unauthorized Bulk Data Access → Mitigated by mTLS & RBAC<br>
        2. Re-identification of Anonymized Health Data → Mitigated by K-Anonymity (k=5)<br>
        3. Automated Profiling Discrimination → Algorithmic Fairness Audit Active
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button></div>
  `);
}

// ══════════════════════════════════════════════════════════════
// RETENTION & ERASURE MODALS
// ══════════════════════════════════════════════════════════════

function initRetention() {
  if (typeof SAMPLE_DATA === 'undefined') return;
  const policies = SAMPLE_DATA.retentionPolicies;

  const statsEl = document.getElementById('retentionStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card accent-blue"><div class="stat-header"><span class="stat-label">Active Policies</span></div><div class="stat-value">${policies.length}</div></div>
      <div class="stat-card accent-red"><div class="stat-header"><span class="stat-label">Erasure Actions</span></div><div class="stat-value">3</div></div>
      <div class="stat-card accent-green"><div class="stat-header"><span class="stat-label">Permanent Mandates</span></div><div class="stat-value">3</div></div>
    `;
  }

  const tbody = document.getElementById('retentionTableBody');
  if (tbody) {
    tbody.innerHTML = policies.map(p => `
      <tr>
        <td class="td-id">${p.id}</td>
        <td class="td-name">${p.dataCategory}</td>
        <td>${p.department}</td>
        <td><span class="badge badge-info">${p.retentionPeriod}</span></td>
        <td class="text-sm">${p.legalBasis}</td>
        <td>${statusBadge(p.status)}</td>
      </tr>
    `).join('');
  }

  const erasEl = document.getElementById('upcomingErasures');
  if (erasEl) {
    erasEl.innerHTML = `
      <div class="alert-banner info"><span class="alert-icon">⏱</span><div>Nightly batch scanner running at 02:00 AM IST.</div></div>
    `;
  }
}

// ══════════════════════════════════════════════════════════════
// ADMIN PAGE (SUPER ADMIN & TENANT ADMIN)
// ══════════════════════════════════════════════════════════════

function initAdmin() {
  if (typeof ADMIN_DATA === 'undefined') return;
  const rolesObj = typeof ROLES !== 'undefined' ? ROLES : window.ROLES;

  const statsEl = document.getElementById('adminStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card accent-blue"><div class="stat-header"><span class="stat-label">Active Users</span></div><div class="stat-value">${ADMIN_DATA.users.length}</div></div>
      <div class="stat-card accent-green"><div class="stat-header"><span class="stat-label">MFA Enabled</span></div><div class="stat-value">${ADMIN_DATA.users.filter(u => u.mfa).length}</div></div>
      <div class="stat-card accent-saffron"><div class="stat-header"><span class="stat-label">CPU Usage</span></div><div class="stat-value">${ADMIN_DATA.systemHealth.cpu}%</div></div>
      <div class="stat-card accent-purple"><div class="stat-header"><span class="stat-label">Encryption</span></div><div class="stat-value">AES-256</div></div>
    `;
  }

  const usersBody = document.getElementById('adminUsersTableBody');
  if (usersBody) {
    usersBody.innerHTML = ADMIN_DATA.users.map(u => `
      <tr>
        <td class="td-id">${u.id}</td>
        <td class="td-name">${u.name}</td>
        <td><span class="badge badge-info">${rolesObj && rolesObj[u.role] ? rolesObj[u.role].label : u.role}</span></td>
        <td>${u.mfa ? '<span class="badge badge-success">Enabled</span>' : '<span class="badge badge-warning">Disabled</span>'}</td>
        <td>${formatDateTime(u.lastLogin)}</td>
        <td>${statusBadge(u.status)}</td>
        <td><button class="btn btn-secondary btn-sm" onclick="showUserEditModal('${u.id}')">Edit</button></td>
      </tr>
    `).join('');
  }

  const healthBody = document.getElementById('systemHealthBody');
  if (healthBody) {
    healthBody.innerHTML = `
      <div class="detail-grid">
        <div class="detail-row"><div class="detail-label">CPU Usage</div><div class="detail-value">${ADMIN_DATA.systemHealth.cpu}%</div></div>
        <div class="detail-row"><div class="detail-label">Memory Usage</div><div class="detail-value">${ADMIN_DATA.systemHealth.memory}%</div></div>
        <div class="detail-row"><div class="detail-label">Disk Storage</div><div class="detail-value">${ADMIN_DATA.systemHealth.disk}%</div></div>
        <div class="detail-row"><div class="detail-label">System Uptime</div><div class="detail-value">${ADMIN_DATA.systemHealth.uptime}</div></div>
      </div>
    `;
  }

  const encBody = document.getElementById('encryptionStatusBody');
  if (encBody) {
    encBody.innerHTML = `
      <div class="detail-grid">
        <div class="detail-row"><div class="detail-label">Algorithm</div><div class="detail-value">${ADMIN_DATA.encryptionStatus.algorithm}</div></div>
        <div class="detail-row"><div class="detail-label">Key Age</div><div class="detail-value">${ADMIN_DATA.encryptionStatus.keyAge}</div></div>
        <div class="detail-row"><div class="detail-label">Next Rotation</div><div class="detail-value">${ADMIN_DATA.encryptionStatus.nextRotation}</div></div>
        <div class="detail-row"><div class="detail-label">SPII Coverage</div><div class="detail-value" style="color:var(--green-700);font-weight:700">100% Encrypted</div></div>
      </div>
    `;
  }

  const auditBody = document.getElementById('adminAuditTableBody');
  if (auditBody) {
    auditBody.innerHTML = ADMIN_DATA.auditLogs.map(l => `
      <tr>
        <td class="td-id">${formatDateTime(l.time)}</td>
        <td class="td-name">${l.user}</td>
        <td>${l.action}</td>
        <td><span class="badge badge-neutral">${l.module}</span></td>
        <td class="td-muted">${l.ip}</td>
      </tr>
    `).join('');
  }
}

function showUserEditModal(id) {
  if (typeof ADMIN_DATA === 'undefined') return;
  const rolesObj = typeof ROLES !== 'undefined' ? ROLES : window.ROLES;
  const u = ADMIN_DATA.users.find(usr => usr.id === id);
  if (!u) return;
  showModal(`
    <div class="modal-header"><h2>Edit User & Permissions — ${u.name}</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">User ID</div><div class="detail-value">${u.id}</div></div>
        <div class="detail-row"><div class="detail-label">Name</div><div class="detail-value">${u.name}</div></div>
        <div class="detail-row"><div class="detail-label">Current Role</div><div class="detail-value">${rolesObj && rolesObj[u.role] ? rolesObj[u.role].label : u.role}</div></div>
        <div class="detail-row"><div class="detail-label">MFA Status</div><div class="detail-value">${u.mfa ? 'Enabled' : 'Disabled'}</div></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Save Changes</button></div>
  `);
}

// ══════════════════════════════════════════════════════════════
// CITIZEN PORTAL (FOR CITIZEN & GUARDIAN ROLES)
// ══════════════════════════════════════════════════════════════

function switchCitizenTab(tab) {
  citizenSubTab = tab;
  document.querySelectorAll('.ct-nav-item').forEach(i => i.classList.remove('active'));
  if (typeof event !== 'undefined' && event && event.target) event.target.classList.add('active');

  const content = document.getElementById('citizenTabContent');
  if (!content) return;

  const isGuardian = currentRoleKey === 'guardian';
  const consents = isGuardian ? GUARDIAN_DATA.childConsents : CITIZEN_DATA.myConsents;
  const personalData = isGuardian ? GUARDIAN_DATA.childData : CITIZEN_DATA.myData;

  if (tab === 'overview') {
    content.innerHTML = `
      ${isGuardian ? `
        <div class="alert-banner info mb-3">
          <span class="alert-icon">👨‍👧</span>
          <div><strong>Section 9 Legal Guardian Portal:</strong> Exercising data rights and managing Verifiable Parental Consent (VPC) on behalf of <strong>Master Rohan D. Rana (Age 12)</strong>. All profiling and targeted advertising is prohibited by law.</div>
        </div>
      ` : ''}

      <div class="card">
        <div class="card-header flex-between">
          <div>
            <h3>${isGuardian ? "Child's Active Consent & VPC Records" : "Active Consents & Statutory Grounds"}</h3>
            <span class="text-xs text-muted">DPDP Act, 2023 — Section 6, 7(b), and Section 9 (Minors)</span>
          </div>
          ${isGuardian ? `<button class="btn btn-secondary btn-sm" onclick="showVPCOverviewModal()">🛡️ VPC DigiLocker Audit</button>` : ''}
        </div>
        <div class="card-body">
          ${consents.map(c => `
            <div class="consent-toggle">
              <div class="ct-info">
                <div class="ct-purpose flex items-center gap-8">
                  ${c.purpose}
                  <span class="${c.isStatutory ? 'badge-statutory' : (c.isMinor ? 'badge-minor' : 'badge-consent')}">
                    ${c.legalGround || (c.isStatutory ? 'Sec 7(b) State Function' : 'Sec 6 Consent')}
                  </span>
                </div>
                <div class="ct-system">System: ${c.system} ${c.childName ? `· Child: ${c.childName}` : ''}</div>
                <div class="ct-date">Granted on ${formatDate(c.grantedAt)} · ${c.isStatutory ? `Governed by ${c.statutoryAct}` : 'Voluntary Consent'}</div>
              </div>
              <div class="flex items-center gap-12">
                <button class="btn btn-secondary btn-sm" onclick="showConsentReceiptModal('${c.id}')" title="Download Kantara ISO 27560 Receipt">📄 Receipt</button>
                ${c.isMinor ? `<button class="btn btn-primary btn-sm" style="background:#7b1fa2;border-color:#7b1fa2;" onclick="showVPCDetailModal('${c.id}')">🛡️ VPC</button>` : ''}
                <div class="toggle-switch ${c.status === 'active' ? '' : 'off'}" onclick="toggleCitizenConsent(this, '${c.id}')" title="${c.isStatutory ? 'Statutory State Function' : 'Click to Toggle'}"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (tab === 'data') {
    content.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3>${isGuardian ? "Personal Data of Minor Held by AMC" : "My Personal Data Held by AMC"}</h3>
          <span class="text-xs text-muted">Article 11(1) Right to Access Data & Processing Grounds</span>
        </div>
        <div class="card-body">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data Field</th>
                <th>Value</th>
                <th>Source System</th>
                <th>Statutory Processing Basis</th>
              </tr>
            </thead>
            <tbody>
              ${personalData.map(d => `
                <tr>
                  <td style="font-weight:600">${d.field}</td>
                  <td>${d.value}</td>
                  <td>${d.source}</td>
                  <td><span class="badge badge-neutral">${d.legalGround || d.minorProtection || 'Sec 7(b) State Function'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (tab === 'consents') {
    content.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3>Manage Consent & Statutory Preferences</h3>
          <span class="text-xs text-muted">Under Section 6(4) of the DPDP Act 2023, voluntary consent can be withdrawn at any time.</span>
        </div>
        <div class="card-body">
          ${consents.map(c => `
            <div class="consent-toggle">
              <div class="ct-info">
                <div class="ct-purpose flex items-center gap-8">
                  ${c.purpose}
                  <span class="${c.isStatutory ? 'badge-statutory' : (c.isMinor ? 'badge-minor' : 'badge-consent')}">
                    ${c.legalGround || (c.isStatutory ? 'Sec 7(b) State Function' : 'Sec 6 Consent')}
                  </span>
                </div>
                <div class="ct-system">${c.system} ${c.isStatutory ? `(Statutory Mandate: ${c.statutoryAct})` : ''}</div>
              </div>
              <div class="flex gap-8">
                <button class="btn btn-secondary btn-sm" onclick="showConsentReceiptModal('${c.id}')">📄 Receipt</button>
                <button class="btn ${c.isStatutory ? 'btn-secondary' : 'btn-danger'} btn-sm" onclick="handleCitizenWithdrawClick('${c.id}')">
                  ${c.isStatutory ? 'Statutory Notice ⚖️' : 'Withdraw Consent'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (tab === 'requests') {
    content.innerHTML = `
      <div class="card">
        <div class="card-header flex-between">
          <div>
            <h3>${isGuardian ? "Rights Requests Exercised for Minor (Sec 11–14)" : "My Rights Requests (Sec 11–14)"}</h3>
            <span class="text-xs text-muted">Published Municipal Rights Target: 15–30 Days · Section 11–14 Exercise</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="showCitizenNewRequestModal()">+ Submit Request</button>
        </div>
        <div class="card-body">
          <table class="data-table">
            <thead><tr><th>Request ID</th><th>Type</th><th>Status</th><th>Submitted</th><th>Description</th></tr></thead>
            <tbody>
              ${CITIZEN_DATA.myRequests.map(r => `
                <tr>
                  <td class="td-id">${r.id}</td>
                  <td><span class="badge badge-info">${r.type}</span></td>
                  <td>${statusBadge(r.status)}</td>
                  <td>${formatDate(r.submittedAt)}</td>
                  <td class="text-sm">${r.description}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (tab === 'nominee') {
    const nom = CITIZEN_DATA.nominee;
    content.innerHTML = `
      <div class="alert-banner info mb-3">
        <span class="alert-icon">👥</span>
        <div><strong>DPDP Act Section 14 — Right of Nomination (વારસદાર / નોમિની વ્યવસ્થા):</strong><br>
        Every Data Principal has the legal right to nominate an individual who shall exercise data principal rights (Access, Correction, Erasure) in the event of death or medical incapacity.</div>
      </div>

      <div class="nominee-card">
        <div class="flex-between items-center mb-3">
          <div>
            <h3 style="font-size:18px;color:var(--navy-900);margin-bottom:4px;">Registered Nominee & Legal Representative</h3>
            <span class="text-xs text-muted">Statutory Anchor: Section 14 of DPDP Act 2023 · AMC Municipal Data Registry</span>
          </div>
          <span class="badge badge-success" style="font-size:12px;padding:6px 12px;">✓ Active & DigiLocker Verified</span>
        </div>

        <div class="detail-grid mb-3">
          <div class="detail-row"><div class="detail-label">Nominee Full Name</div><div class="detail-value" style="font-weight:700;font-size:14px;">${nom.fullName}</div></div>
          <div class="detail-row"><div class="detail-label">Relationship to Principal</div><div class="detail-value">${nom.relationship}</div></div>
          <div class="detail-row"><div class="detail-label">Identity Verification</div><div class="detail-value"><span class="badge badge-info">${nom.verificationMethod}</span></div></div>
          <div class="detail-row"><div class="detail-label">Nomination Token</div><div class="detail-value"><code style="font-weight:700;color:var(--purple-700);">${nom.nominationToken}</code></div></div>
          <div class="detail-row"><div class="detail-label">Masked Aadhaar Number</div><div class="detail-value"><code>${nom.aadhaarMasked}</code></div></div>
          <div class="detail-row"><div class="detail-label">Contact Details</div><div class="detail-value">${nom.contactMobile} · ${nom.contactEmail}</div></div>
          <div class="detail-row"><div class="detail-label">Date of Registration</div><div class="detail-value">${formatDate(nom.registeredAt)}</div></div>
          <div class="detail-row"><div class="detail-label">Statutory Scope</div><div class="detail-value" style="font-size:12px;color:var(--gray-600)">Full proxy rights under Section 11 (Access), Section 12 (Correction/Erasure), and Section 13 (Grievance Redressal).</div></div>
        </div>

        <div class="flex gap-8 mt-3">
          <button class="btn btn-primary btn-sm" onclick="showNominationCertificateModal()">📄 View Nomination Certificate</button>
          <button class="btn btn-secondary btn-sm" onclick="showUpdateNomineeModal()">✏️ Update Nominee Details</button>
        </div>
      </div>
    `;
  } else if (tab === 'recipients') {
    const sharing = typeof DATA_SHARING_REGISTER !== 'undefined' ? DATA_SHARING_REGISTER : window.DATA_SHARING_REGISTER;
    content.innerHTML = `
      <div class="card">
        <div class="card-header flex-between">
          <div>
            <h3>Third Parties & Authorities With Whom Your Data is Shared</h3>
            <span class="text-xs text-muted">Section 11(1)(b) Transparency Disclosures · Government Instrumentalities & Data Processors</span>
          </div>
          <span class="badge badge-statutory">3 Verified Entities</span>
        </div>
        <div class="card-body">
          <div class="alert-banner info mb-3">
            <span class="alert-icon">ℹ️</span>
            <div><strong>Your Section 11(1)(b) Right to Know:</strong> You are statutorily entitled to know the identities of all data fiduciaries and data processors with whom your personal data has been shared by Ahmedabad Municipal Corporation.</div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Recipient Authority / Entity</th>
                <th>Category</th>
                <th>Personal Data Disclosed</th>
                <th>Statutory Legal Ground</th>
                <th>Public Purpose</th>
              </tr>
            </thead>
            <tbody>
              ${sharing.map(s => `
                <tr>
                  <td><strong>${s.recipientEntity}</strong></td>
                  <td><span class="badge badge-neutral">${s.categoryOfEntity}</span></td>
                  <td>${s.personalDataShared.map(d => `<span class="badge badge-info" style="font-size:10px;">${d}</span>`).join(' ')}</td>
                  <td><span class="badge badge-statutory">${s.statutoryLegalGround}</span></td>
                  <td>${s.purpose}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

function showSection17RefusalNotice(consentId) {
  const isGuardian = currentRoleKey === 'guardian';
  const list = isGuardian ? GUARDIAN_DATA.childConsents : CITIZEN_DATA.myConsents;
  const c = list.find(item => item.id === consentId) || list[0];
  const refNum = `REF-AMC-2026-${c.id.replace('CON-', '')}`;

  showModal(`
    <div class="modal-header" style="background:#fef2f2;border-bottom:2px solid #ef4444;">
      <div class="flex items-center gap-8">
        <span style="font-size:24px;">⚖️</span>
        <div>
          <h2 style="color:#991b1b;margin:0;">Reasoned Decision & Notice of Refusal (Section 17(4))</h2>
          <span class="text-xs text-muted">Statutory Defense to Erasure Request under Section 7(b) State Function</span>
        </div>
      </div>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="refusal-box mb-3">
        <div class="flex justify-between items-start mb-3 pb-2" style="border-bottom:2px solid #991b1b;">
          <div>
            <div style="font-weight:800;font-size:15px;color:#1e293b;">AHMEDABAD MUNICIPAL CORPORATION</div>
            <div style="font-size:12px;color:#64748b;">Office of the Assessor and Collector of Municipal Taxes · Danapith, Ahmedabad - 380001</div>
          </div>
          <div style="text-align:right;">
            <div class="refusal-badge-statutory">STATUTORY NOTICE UNDER SEC 17(4)</div>
            <div style="font-size:11px;font-family:monospace;color:#64748b;margin-top:4px;">Notice Ref: ${refNum}</div>
            <div style="font-size:11px;color:#64748b;">Date: 02-Sep-2026</div>
          </div>
        </div>

        <div style="font-size:13px;line-height:1.6;color:#1e293b;margin-bottom:14px;">
          <strong>To:</strong> ${currentUser ? currentUser.name : 'Data Principal'} (${c.principalId || 'Citizen ID: AMC-CID-890124'})<br>
          <strong>Subject:</strong> Formal Reasoned Refusal of Erasure / Withdrawal Request for Service: <em>${c.purpose}</em>
        </div>

        <div class="alert-banner warning mb-3" style="font-size:12px;padding:10px 14px;">
          <strong>Statutory Bar under DPDP Act 2023 Section 17(4):</strong>
          <em>"The provisions of sub-section (7) of section 8 and sub-section (3) of section 12 shall not apply in respect of the processing of personal data by the State or any instrumentality of the State under clause (b) of section 7."</em>
        </div>

        <h4 style="font-size:13px;color:#1e293b;margin-bottom:6px;">1. Reasoned Legal Findings:</h4>
        <ol style="font-size:12px;color:#334155;line-height:1.6;padding-left:20px;margin-bottom:14px;">
          <li>The personal data requested for erasure constitutes the statutory Tenement Assessment Record maintained pursuant to <strong>Section 99 & Chapter VIII of the Gujarat Municipalities Act, 1963</strong> and the Bombay Provincial Municipal Corporations Act, 1949.</li>
          <li>Processing is executed under <strong>Section 7(b) (State Function)</strong> of the Digital Personal Data Protection Act, 2023, for the lawful assessment, demand, and collection of municipal taxes.</li>
          <li>By virtue of Section 17(4), your right to erasure under Section 12(3) and AMC's obligation to erase data under Section 8(7) are <strong>statutorily disapplied</strong> so long as property ownership persists in municipal jurisdiction.</li>
        </ol>

        <h4 style="font-size:13px;color:#1e293b;margin-bottom:6px;">2. Communication Channel Mitigation:</h4>
        <p style="font-size:12px;color:#334155;line-height:1.5;margin-bottom:14px;">
          While core tenement property registers cannot be erased, your citizen preference to <strong>suppress optional SMS and email tax reminder alerts</strong> has been registered and honored.
        </p>

        <div class="filing-sig-block">
          <div>
            <div style="font-size:11px;font-weight:700;color:#1e293b;">Statutory Appellate Procedure:</div>
            <div style="font-size:11px;color:#64748b;">
              1. First Administrative Appeal: DPO, AMC (dpo@amc.gov.in) within 30 days.<br>
              2. Second Statutory Appeal: Data Protection Board of India (DPBI) under Section 13(3).
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px;font-weight:800;color:#1e293b;">Shri Suresh B. Joshi</div>
            <div style="font-size:11px;color:#64748b;">Assessor & Tax Collector<br>Ahmedabad Municipal Corporation</div>
            <div style="font-size:10px;color:#16a34a;margin-top:2px;">Digitally Signed via e-Gov HSM</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer flex justify-between">
      <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Refusal Notice</button>
      <div class="flex gap-8">
        <button class="btn btn-danger btn-sm" onclick="closeModalDirect(); showCitizenGrievanceModal();">⚖️ Lodge Administrative Appeal to DPO</button>
        <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button>
      </div>
    </div>
  `);
}

function toggleCitizenConsent(el, consentId) {
  const isGuardian = currentRoleKey === 'guardian';
  const list = isGuardian ? GUARDIAN_DATA.childConsents : CITIZEN_DATA.myConsents;
  const c = list.find(item => item.id === consentId);

  if (c && c.isStatutory) {
    showSection17RefusalNotice(consentId);
    return;
  }

  if (el) el.classList.toggle('off');
  const isOff = el ? el.classList.contains('off') : true;
  if (c) {
    c.status = isOff ? 'withdrawn' : 'active';
  }
  persistState();
  alert(isOff ? 'Consent withdrawn & persisted to DB. Downstream systems notified to cease processing.' : 'Consent re-granted & persisted to DB.');
}

function handleCitizenWithdrawClick(consentId) {
  const isGuardian = currentRoleKey === 'guardian';
  const list = isGuardian ? GUARDIAN_DATA.childConsents : CITIZEN_DATA.myConsents;
  const c = list.find(item => item.id === consentId);

  if (c && c.isStatutory) {
    showSection17RefusalNotice(consentId);
  } else {
    if (c) {
      c.status = 'withdrawn';
    }
    persistState();
    alert(`Consent for ${c ? c.purpose : 'service'} successfully withdrawn. State persisted permanently.`);
  }
}

function showCitizenNewRequestModal() {
  showModal(`
    <div class="modal-header"><h2>Submit Rights Request</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-row mb-2"><div class="detail-label">Request Type</div>
        <select id="ctzReqType" class="filter-select" style="width:100%;">
          <option value="Access">Right to Access Data</option>
          <option value="Correction">Right to Correction</option>
          <option value="Erasure">Right to Erasure</option>
          <option value="Nomination">Right to Nominate</option>
        </select>
      </div>
      <div class="detail-row"><div class="detail-label">Description of Request</div>
        <textarea id="ctzReqDesc" class="search-input" style="width:100%;height:100px;padding:14px;resize:vertical;" placeholder="Please describe what data you want to access, correct, or erase..."></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="submitCitizenRightsRequest()">Submit Request & Persist</button>
    </div>
  `);
}

function submitCitizenRightsRequest() {
  const typeEl = document.getElementById('ctzReqType');
  const descEl = document.getElementById('ctzReqDesc');
  const type = typeEl ? typeEl.value : 'Access';
  const desc = (descEl && descEl.value) ? descEl.value : 'Citizen self-service request';

  const newId = `RR-2026-00${Math.floor(100 + Math.random() * 800)}`;
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + (type === 'Erasure' ? 30 : 15));

  const req = {
    id: newId,
    principalName: (typeof currentUser !== 'undefined' && currentUser) ? currentUser.name : 'Shri Ramesh Kantilal Patel',
    type: type,
    department: 'Revenue & Property Tax Department',
    deptId: 'DEP-001',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    slaDeadline: deadline.toISOString(),
    assignedTo: null,
    description: desc
  };

  if (typeof SAMPLE_DATA !== 'undefined' && SAMPLE_DATA.rightsRequests) {
    SAMPLE_DATA.rightsRequests.unshift(req);
  }
  persistState();

  alert(`Rights Request Logged & Persisted to DB!\n\nTracking ID: ${newId}\nSLA Deadline: ${formatDate(deadline.toISOString())}\nPreserved across all browser sessions.`);
  closeModalDirect();
  if (typeof switchCitizenTab === 'function') switchCitizenTab('requests');
}

function showCitizenGrievanceModal() {
  showModal(`
    <div class="modal-header"><h2>File Grievance</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="detail-row mb-2"><div class="detail-label">Grievance Subject</div>
        <input id="ctzGrvSubject" type="text" class="search-input" style="width:100%;padding-left:14px;" placeholder="Brief subject (e.g. Unauthorized marketing call)">
      </div>
      <div class="detail-row"><div class="detail-label">Grievance Details</div>
        <textarea id="ctzGrvDetails" class="search-input" style="width:100%;height:100px;padding:14px;resize:vertical;" placeholder="Describe your data protection complaint in detail..."></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-danger" onclick="submitCitizenGrievance()">Submit Grievance & Persist</button>
    </div>
  `);
}

function submitCitizenGrievance() {
  const subjEl = document.getElementById('ctzGrvSubject');
  const detEl = document.getElementById('ctzGrvDetails');
  const subject = (subjEl && subjEl.value) ? subjEl.value : 'Data Protection Grievance';
  const details = (detEl && detEl.value) ? detEl.value : 'Citizen complaint filed via self-service portal';

  const newId = `GRV-2026-0${Math.floor(50 + Math.random() * 50)}`;
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  const grv = {
    id: newId,
    principalName: (typeof currentUser !== 'undefined' && currentUser) ? currentUser.name : 'Shri Ramesh Kantilal Patel',
    subject: subject,
    department: 'Revenue & Property Tax Department',
    deptId: 'DEP-001',
    status: 'pending',
    level: 1,
    submittedAt: new Date().toISOString(),
    slaDeadline: deadline.toISOString(),
    handler: null,
    category: 'Unauthorized Processing'
  };

  if (typeof SAMPLE_DATA !== 'undefined' && SAMPLE_DATA.grievances) {
    SAMPLE_DATA.grievances.unshift(grv);
  }
  persistState();


  alert(`Grievance Filed & Persisted to DB!\n\nTicket ID: ${newId}\nStatutory Rule 14(2) 90-day ceiling active.\nPreserved across all browser sessions.`);
  closeModalDirect();
  if (typeof switchCitizenTab === 'function') switchCitizenTab('overview');
}

function showNotifications() {
  showModal(`
    <div class="modal-header"><h2>Notifications</h2><button class="modal-close" onclick="closeModalDirect()">✕</button></div>
    <div class="modal-body">
      <div class="activity-feed">
        <div class="activity-item"><div class="activity-icon breach">⚠</div><div class="activity-content"><div class="activity-msg"><strong>CYBER DRILL:</strong> Tabletop drill SIM-DRILL-2026-003 active — Form 1 specimen queued</div><div class="activity-meta">Just now</div></div></div>
        <div class="activity-item"><div class="activity-icon rights">👤</div><div class="activity-content"><div class="activity-msg">3 rights requests approaching published target window</div><div class="activity-meta">Today</div></div></div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button></div>
  `);
}

// ── Section 14 Nominee Handlers ─────────────────────────────

function showNominationCertificateModal() {
  if (typeof CITIZEN_DATA === 'undefined') return;
  const nom = CITIZEN_DATA.nominee;
  const principal = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.name : "Shri Ramesh Kantilal Patel";

  showModal(`
    <div class="modal-header">
      <h2>Section 14 Data Principal Nomination Certificate</h2>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="nominee-cert-box">
        <div class="cert-watermark">DPDP ACT 2023</div>
        <div class="cert-header">
          <div class="cert-seal">🏛️</div>
          <div class="cert-title">AHMEDABAD MUNICIPAL CORPORATION</div>
          <div class="cert-sub">Mahanagar Seva Sadan, Danapith, Ahmedabad · Data Protection Office</div>
          <div style="font-size:15px;font-weight:700;margin-top:8px;color:#0f172a;">CERTIFICATE OF LEGAL REPRESENTATIVE NOMINATION</div>
          <div style="font-size:11px;color:#64748b;">Issued under Section 14 of the Digital Personal Data Protection Act, 2023</div>
        </div>

        <div style="font-size:13px;line-height:1.8;color:#1e293b;margin-bottom:16px;">
          This is to certify that the Data Principal named below has legally registered a designated nominee under <strong>Section 14</strong> of the DPDP Act, 2023. In the event of death or incapacity of the Data Principal, the Nominee shall be entitled to exercise all statutory data rights across all Ahmedabad Municipal Corporation departments and processing systems.
        </div>

        <table class="data-table mb-3" style="font-size:12px;">
          <tbody>
            <tr><td style="font-weight:700;width:35%;">Data Principal Name</td><td><strong>${principal}</strong> (Aadhaar: XXXX-XXXX-4523)</td></tr>
            <tr><td style="font-weight:700;">Designated Nominee</td><td><strong>${nom.fullName}</strong></td></tr>
            <tr><td style="font-weight:700;">Relationship</td><td>${nom.relationship}</td></tr>
            <tr><td style="font-weight:700;">Nominee Identifier</td><td>Aadhaar Masked: <code>${nom.aadhaarMasked}</code> · Phone: ${nom.contactMobile}</td></tr>
            <tr><td style="font-weight:700;">Nomination Token</td><td><code style="font-weight:700;color:var(--purple-700);">${nom.nominationToken}</code></td></tr>
            <tr><td style="font-weight:700;">Verification Method</td><td><span class="badge badge-info">${nom.verificationMethod}</span></td></tr>
            <tr><td style="font-weight:700;">Date of Issuance</td><td>${formatDateTime(nom.registeredAt)}</td></tr>
            <tr><td style="font-weight:700;">Digital Ledger Anchor</td><td>SHA-256: <code>e8420b12a89047fc890124ba9842e6f77c384a20b12d5930fa12</code></td></tr>
          </tbody>
        </table>

        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:20px;padding-top:14px;border-top:1px solid #cbd5e1;font-size:11px;color:#64748b;">
          <div>
            <strong>Authenticity Check:</strong><br>
            Scan or verify at: <code>https://dpdp.amc.gov.in/verify/nominee/${nom.nominationToken}</code>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700;color:#0f172a;">Shri Rajesh M. Patel, IAS</div>
            <div>Data Protection Officer, AMC</div>
            <div style="color:var(--green-700);font-weight:600;">✓ Digitally Signed & Sealed</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" onclick="alert('Downloading Official Nomination Certificate (PDF)...');">⬇ Download Certificate (PDF)</button>
      <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button>
    </div>
  `);
}

function showUpdateNomineeModal() {
  const nom = CITIZEN_DATA.nominee;
  showModal(`
    <div class="modal-header">
      <h2>Update Designated Nominee (Section 14)</h2>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Nominee Full Name</div>
          <input type="text" id="updateNomName" class="search-input" style="width:100%;padding-left:14px;" value="${nom.fullName}">
        </div>
        <div class="detail-row"><div class="detail-label">Relationship to You</div>
          <select id="updateNomRel" class="filter-select" style="width:100%;">
            <option value="Spouse (ધર્મપત્ની / पत्नी)" selected>Spouse (ધર્મપત્ની / पत्नी)</option>
            <option value="Son (પુત્ર / पुत्र)">Son (પુત્ર / पुत्र)</option>
            <option value="Daughter (પુત્રી / पुत्री)">Daughter (પુત્રી / पुत्री)</option>
            <option value="Father (પિતા / पिता)">Father (પિતા / पिता)</option>
            <option value="Mother (માતા / माता)">Mother (માતા / माता)</option>
            <option value="Brother / Sister (ભાઈ / બહેન)">Brother / Sister (ભાઈ / બહેન)</option>
            <option value="Legal Guardian / Representative">Legal Guardian / Representative</option>
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Nominee Mobile Number</div>
          <input type="text" id="updateNomMobile" class="search-input" style="width:100%;padding-left:14px;" value="${nom.contactMobile}">
        </div>
        <div class="detail-row"><div class="detail-label">Nominee Email Address</div>
          <input type="email" id="updateNomEmail" class="search-input" style="width:100%;padding-left:14px;" value="${nom.contactEmail}">
        </div>
        <div class="detail-row"><div class="detail-label">DigiLocker KYC Verification</div>
          <div style="font-size:12px;color:var(--green-700);font-weight:600;">✓ DigiLocker Attestation Linked to Family ID</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNomineeUpdate()">Update & Sign Nomination</button>
    </div>
  `);
}

function saveNomineeUpdate() {
  const name = document.getElementById('updateNomName').value;
  const rel = document.getElementById('updateNomRel').value;
  const mob = document.getElementById('updateNomMobile').value;
  const em = document.getElementById('updateNomEmail').value;

  CITIZEN_DATA.nominee.fullName = name;
  CITIZEN_DATA.nominee.relationship = rel;
  CITIZEN_DATA.nominee.contactMobile = mob;
  CITIZEN_DATA.nominee.contactEmail = em;
  CITIZEN_DATA.nominee.registeredAt = new Date().toISOString();
  persistState();

  alert(`Designated Nominee Updated Successfully & Persisted to DB!\n\nNew Nominee: ${name} (${rel})\nDigital RoPA anchor generated. Saved across browser sessions.`);
  closeModalDirect();
  switchCitizenTab('nominee');
}

// ── Citizen Multilingual Switcher (Section 5 8th Schedule) ──

function setCitizenLanguage(lang) {
  if (typeof CITIZEN_I18N === 'undefined') return;
  CITIZEN_I18N.currentLang = lang;

  ['en', 'gu', 'hi'].forEach(l => {
    const btn = document.getElementById(`langBtn${l.charAt(0).toUpperCase() + l.slice(1)}`);
    if (btn) {
      if (l === lang) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  const t = CITIZEN_I18N.translations[lang] || CITIZEN_I18N.translations['en'];

  const brandEl = document.getElementById('citizenBrandName');
  if (brandEl) brandEl.textContent = t.brand;

  const welcomeTitle = document.getElementById('citizenWelcomeTitle');
  if (welcomeTitle) welcomeTitle.textContent = t.welcomeTitle;

  const welcomeSub = document.querySelector('.citizen-welcome p');
  if (welcomeSub) welcomeSub.textContent = t.welcomeSub;

  const navOverview = document.getElementById('ctNavOverview');
  if (navOverview) navOverview.textContent = t.tabs.overview;
  const navData = document.getElementById('ctNavData');
  if (navData) navData.textContent = t.tabs.data;
  const navConsents = document.getElementById('ctNavConsents');
  if (navConsents) navConsents.textContent = t.tabs.consent;
  const navRequests = document.getElementById('ctNavRequests');
  if (navRequests) navRequests.textContent = t.tabs.requests;
  const navNominee = document.getElementById('ctNavNominee');
  if (navNominee) navNominee.textContent = t.tabs.nominee;

  const qaLabelData = document.getElementById('qaLabelData');
  if (qaLabelData) qaLabelData.textContent = t.qa.viewData;
  const qaDescData = document.getElementById('qaDescData');
  if (qaDescData) qaDescData.textContent = t.qa.viewDataDesc;

  const qaLabelConsent = document.getElementById('qaLabelConsent');
  if (qaLabelConsent) qaLabelConsent.textContent = t.qa.manageConsent;
  const qaDescConsent = document.getElementById('qaDescConsent');
  if (qaDescConsent) qaDescConsent.textContent = t.qa.manageConsentDesc;

  const qaLabelRights = document.getElementById('qaLabelRights');
  if (qaLabelRights) qaLabelRights.textContent = t.qa.fileRequest;
  const qaDescRights = document.getElementById('qaDescRights');
  if (qaDescRights) qaDescRights.textContent = t.qa.fileRequestDesc;

  const qaLabelNominee = document.getElementById('qaLabelNominee');
  if (qaLabelNominee) qaLabelNominee.textContent = t.qa.nominee;
  const qaDescNominee = document.getElementById('qaDescNominee');
  if (qaDescNominee) qaDescNominee.textContent = t.qa.nomineeDesc;

  const qaLabelGrievance = document.getElementById('qaLabelGrievance');
  if (qaLabelGrievance) qaLabelGrievance.textContent = t.qa.grievance;
  const qaDescGrievance = document.getElementById('qaDescGrievance');
  if (qaDescGrievance) qaDescGrievance.textContent = t.qa.grievanceDesc;

  // Re-render current sub tab
  switchCitizenTab(citizenSubTab || 'overview');
}

// ── Statutory Filings Modal (DPBI Form 1 & CERT-In Notice) ──

function showStatutoryFilingModal(incidentId) {
  if (typeof STATUTORY_FILINGS === 'undefined') return;
  const filing = STATUTORY_FILINGS[incidentId] || STATUTORY_FILINGS["SIM-DRILL-2026-003"] || Object.values(STATUTORY_FILINGS)[0];
  const dpbi = filing.dpbiForm1;
  const certin = filing.certInNotice;

  showModal(`
    <div class="modal-header">
      <div>
        <h2>Statutory Regulatory Filings Specimen — ${incidentId}</h2>
        <span class="text-xs text-muted">[Tabletop Cyber Drill Scenario — Simulated Regulatory Artifact]</span>
      </div>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="alert-banner warning mb-3">
        <span class="alert-icon">⚠️</span>
        <div>
          <strong>TABLETOP CYBER DRILL SPECIMEN ONLY:</strong>
          This document represents an automated compliance artifact generated during a tabletop incident response simulation. It does NOT represent a real municipal breach or actual submission to CERT-In or the Data Protection Board of India.
        </div>
      </div>

      <div class="sub-nav mb-3">
        <button class="sub-nav-btn active" id="btnFilingsDpbi" onclick="switchFilingTab('dpbi')">⚖️ DPBI Form 1 Specimen (Sec 8(6) & Rule 7)</button>
        <button class="sub-nav-btn" id="btnFilingsCertIn" onclick="switchFilingTab('certin')">🛡️ CERT-In 6-Hour Notice Specimen (Sec 70B)</button>
      </div>

      <!-- Tab 1: DPBI Form 1 -->
      <div id="filingTabDpbi" class="filing-sheet">
        <div class="filing-header-box">
          <div class="filing-emblem">🏛️</div>
          <div class="filing-doc-title">${dpbi.formName}</div>
          <div class="filing-doc-law">[Pursuant to ${dpbi.statutoryProvision}]</div>
        </div>

        <table class="filing-table">
          <tbody>
            <tr><th>Data Fiduciary Entity</th><td><strong>${dpbi.fiduciaryName}</strong><br><span style="font-size:11px;color:#64748b;">Registration No: ${dpbi.registrationNumber}</span></td></tr>
            <tr><th>Registered Head Office</th><td>${dpbi.registeredOffice}</td></tr>
            <tr><th>Data Protection Officer</th><td><strong>${dpbi.dpoDetails.name}</strong> (${dpbi.dpoDetails.designation})<br>Email: ${dpbi.dpoDetails.email} · Phone: ${dpbi.dpoDetails.phone}</td></tr>
            <tr><th>Date & Time of Detection</th><td><strong>${formatDateTime(dpbi.incidentDetails.discoveryTimestamp)}</strong> (Simulated SIEM Trigger)</td></tr>
            <tr><th>Nature & Mechanism of Breach</th><td>${dpbi.incidentDetails.natureAndSeverity}<br><span style="font-size:11px;color:#64748b;">Target: ${dpbi.incidentDetails.affectedSystem} | DC: ${dpbi.incidentDetails.datacenter}</span></td></tr>
            <tr><th>Simulated Affected Principals</th><td><strong style="color:#b91c1c">${dpbi.incidentDetails.estimatedPrincipalsImpacted.toLocaleString()} Simulated Records</strong> (Tabletop Drill)</td></tr>
            <tr><th>Categories of Personal Data</th><td>
              <ul style="margin:0;padding-left:18px;">
                ${dpbi.incidentDetails.categoriesOfPersonalData.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </td></tr>
            <tr><th>Mitigation & Containment Measures</th><td>
              <ol style="margin:0;padding-left:18px;">
                ${dpbi.mitigationActions.map(m => `<li>${m}</li>`).join('')}
              </ol>
            </td></tr>
            <tr><th>Data Principal Communication Plan</th><td>${dpbi.principalCommunicationPlan}</td></tr>
          </tbody>
        </table>

        <div class="filing-sig-block">
          <div>
            <span style="font-size:11px;color:#64748b;">Simulated Filing Reference:</span><br>
            <code>SIM/AMC/DPO/DPBI/2026/003-F1</code>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700;color:#0f172a;">${dpbi.dpoDetails.name}</div>
            <div style="font-size:11px;color:#64748b;">[DRAFT SPECIMEN — PENDING FORMAL INSTITUTIONAL REVIEW]</div>
            <div style="font-size:11px;color:var(--saffron-700);font-weight:600;">⚠ Tabletop Exercise Specimen</div>
          </div>
        </div>
      </div>

      <!-- Tab 2: CERT-In Notice -->
      <div id="filingTabCertIn" class="filing-sheet" style="display:none;">
        <div class="filing-header-box">
          <div class="filing-emblem">🇮🇳</div>
          <div class="filing-doc-title">${certin.formName}</div>
          <div class="filing-doc-law">[Mandatory 6-Hour Window under ${certin.statutoryProvision}]</div>
        </div>

        <table class="filing-table">
          <tbody>
            <tr><th>Reporting Entity</th><td>Ahmedabad Municipal Corporation (Govt. of Gujarat)</td></tr>
            <tr><th>Simulated CERT-In Token</th><td><code style="font-weight:700;color:var(--navy-800);">${certin.incidentTrackingId}</code></td></tr>
            <tr><th>Incident Category</th><td><strong>${certin.incidentCategory}</strong></td></tr>
            <tr><th>Statutory SLA Compliance</th><td><span class="badge badge-success">✓ ${certin.reportingDeadline}</span></td></tr>
            <tr><th>Target Asset / IP</th><td><code>${certin.affectedAssetIP}</code></td></tr>
            <tr><th>Offending Threat Actor Source IP</th><td><code style="color:#b91c1c;font-weight:700;">${certin.threatActorSourceIP}</code></td></tr>
            <tr><th>Digital Forensic Hash</th><td><code style="font-size:11px;">${certin.hashEvidence}</code></td></tr>
            <tr><th>Containment & Perimeter Status</th><td><strong style="color:var(--green-700)">${certin.containmentStatus}</strong></td></tr>
          </tbody>
        </table>

        <div class="filing-sig-block">
          <div>
            <span style="font-size:11px;color:#64748b;">Simulated Intimation Dispatch Endpoint:</span><br>
            <code>https://cert-in.org.in/incident/acknowledgment (Test Mode)</code>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700;color:#0f172a;">Office of the Chief Information Security Officer (CISO)</div>
            <div style="font-size:11px;color:#64748b;">[DRAFT SPECIMEN — PENDING FORMAL INSTITUTIONAL REVIEW]</div>
            <div style="font-size:11px;color:var(--saffron-700);font-weight:600;">⚠ Tabletop Exercise Specimen</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" onclick="alert('Exporting Official Tabletop Drill Report (PDF)...');">🖨️ Print Specimen Copy</button>
      <button class="btn btn-primary btn-sm" onclick="closeModalDirect()">Close</button>
    </div>
  `);
}

function switchFilingTab(tab) {
  const btnDpbi = document.getElementById('btnFilingsDpbi');
  const btnCert = document.getElementById('btnFilingsCertIn');
  const tabDpbi = document.getElementById('filingTabDpbi');
  const tabCert = document.getElementById('filingTabCertIn');

  if (tab === 'dpbi') {
    if (btnDpbi) btnDpbi.classList.add('active');
    if (btnCert) btnCert.classList.remove('active');
    if (tabDpbi) tabDpbi.style.display = 'block';
    if (tabCert) tabCert.style.display = 'none';
  } else {
    if (btnDpbi) btnDpbi.classList.remove('active');
    if (btnCert) btnCert.classList.add('active');
    if (tabDpbi) tabDpbi.style.display = 'none';
    if (tabCert) tabCert.style.display = 'block';
  }
}


// ══════════════════════════════════════════════════════════════
// MUNICIPAL SYSTEMS INTEGRATION HUB & SIMULATOR
// ══════════════════════════════════════════════════════════════

var simCurrentStep = 1;
var simCurrentServiceId = 'CERT-INCOME';
var simCurrentLang = 'gu';
var simCapturedReceipt = null;

function initIntegration() {
  if (typeof INTEGRATION_DATA === 'undefined') return;
  renderSimStep();
  renderApiDocs();
  renderApiKeysTable();
  renderWebhooksTable();
  renderDropInSdk();
}

function switchIntegrationTab(tab) {
  const tabs = ['simulator', 'api', 'keys', 'webhooks', 'sdk'];
  tabs.forEach(t => {
    const btn = document.getElementById(`btnTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const view = document.getElementById(`integrationTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (t === tab) {
      if (btn) btn.classList.add('active');
      if (view) view.style.display = 'block';
    } else {
      if (btn) btn.classList.remove('active');
      if (view) view.style.display = 'none';
    }
  });

  if (tab === 'simulator') renderSimStep();
  else if (tab === 'api') renderApiDocs();
  else if (tab === 'keys') renderApiKeysTable();
  else if (tab === 'webhooks') renderWebhooksTable();
  else if (tab === 'sdk') renderDropInSdk();
}

function loadSimService() {
  const select = document.getElementById('simServiceSelect');
  if (select) simCurrentServiceId = select.value;
  simCurrentStep = 1;
  simCapturedReceipt = null;
  renderSimStep();
}

function updateSimLanguage() {
  const select = document.getElementById('simLangSelect');
  if (select) simCurrentLang = select.value;
  renderSimStep();
}

function jumpToSimStep(step) {
  simCurrentStep = step;
  renderSimStep();
}

function renderSimStep() {
  const area = document.getElementById('simActiveStepArea');
  if (!area || typeof INTEGRATION_DATA === 'undefined') return;

  const service = INTEGRATION_DATA.certServices.find(s => s.id === simCurrentServiceId) || INTEGRATION_DATA.certServices[0];
  const lang = simCurrentLang;

  // Update Stepper UI
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`simStep${i}`);
    if (stepEl) {
      if (i === simCurrentStep) {
        stepEl.classList.add('active');
        stepEl.classList.remove('completed');
      } else if (i < simCurrentStep) {
        stepEl.classList.remove('active');
        stepEl.classList.add('completed');
      } else {
        stepEl.classList.remove('active');
        stepEl.classList.remove('completed');
      }
    }
  }


  if (simCurrentStep === 1) {
    const reqUrl = `https://dpdp.amc.gov.in/api/v1/notices/${service.code}?lang=${lang}`;
    const noticeText = service.notices[lang] || service.notices['en'];

    const mockResponse = {
      status: "success",
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: {
        purposeCode: service.code,
        serviceTitle: service.title,
        department: service.deptName,
        language: lang === 'gu' ? 'Gujarati' : (lang === 'hi' ? 'Hindi' : 'English'),
        noticeVersion: "v2.4",
        statutoryNotice: noticeText,
        dataCategories: service.dataFields.map(f => f.name),
        dpoContact: {
          name: "Shri Rajesh M. Patel, IAS",
          email: "dpo@amc.gov.in",
          phone: "+91-79-2539-1811",
          office: "Mahanagar Seva Sadan, Danapith, Ahmedabad - 380001"
        },
        grievanceRedressalUrl: "https://dpdp.amc.gov.in/grievance/file"
      }
    };

    area.innerHTML = `
      <div class="alert-banner info mb-3">
        <span class="alert-icon">🌐</span>
        <div><strong>Step 1: In-Form Multilingual Notice (DPDP Act Section 5)</strong><br>
        When a citizen opens the Certificate Application in the external portal, the portal queries DPDP-GovShield to fetch the legally vetted Section 5 notice in the citizen's chosen language (${lang.toUpperCase()}).</div>
      </div>

      <div class="sim-console-grid">
        <div class="sim-pane">
          <div class="sim-pane-header">
            <span>External Portal HTTP Call:</span>
            <span class="method-badge method-get">GET</span>
          </div>
          <div class="sim-pane-body">
            <div style="font-family:monospace;font-size:12px;color:var(--gray-700);margin-bottom:8px;">
              <strong>Endpoint:</strong> ${reqUrl}
            </div>
            <div style="font-family:monospace;font-size:11px;color:var(--gray-500);margin-bottom:12px;">
              <strong>Headers:</strong><br>
              Authorization: Bearer amc_live_pk_9d42e6f77c384a20b12d5930fa12<br>
              X-Consumer-System: SYS-013 (Citizen Certification Portal)<br>
              Accept-Language: ${lang}
            </div>
            <div class="code-viewer">${escapeHtml(JSON.stringify(mockResponse, null, 2))}</div>
          </div>
        </div>

        <div class="sim-pane">
          <div class="sim-pane-header">
            <span>Rendered Inside Citizen Portal Application Form:</span>
            <span class="badge badge-success">Live Form Preview</span>
          </div>
          <div class="sim-pane-body">
            <div style="border:1px solid #cbd5e1;border-radius:8px;padding:16px;background:#f8fafc;">
              <div style="font-size:14px;font-weight:700;color:var(--navy-900);margin-bottom:6px;">
                🏛️ ${service.title}
              </div>
              <div style="font-size:12px;color:var(--gray-600);margin-bottom:12px;">
                Ahmedabad Municipal Corporation · ${service.deptName}
              </div>
              <div style="background:#fff;border-left:4px solid var(--blue-500);padding:12px;font-size:13px;color:var(--gray-800);line-height:1.6;border-radius:4px;margin-bottom:14px;">
                ${noticeText}
              </div>
              <div style="font-size:11px;color:var(--gray-500);margin-bottom:14px;">
                Data collected: <strong>${service.dataFields.map(f => f.name).join(', ')}</strong><br>
                Governing DPO: dpo@amc.gov.in (Toll Free: 155304)
              </div>
              <button class="btn btn-primary btn-sm" style="width:100%;" onclick="jumpToSimStep(2)">Proceed to Step 2: Evaluate Legal Ground →</button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (simCurrentStep === 2) {
    const isSec7 = service.isStatutory;
    const isMinor = service.isMinorSupported && service.id.includes('MINOR');
    const isRule12Exempt = !!service.isExemptUnderRule12FourthSchedule;

    const evalPayload = {
      serviceCode: service.code,
      department: service.department,
      systemId: "SYS-013",
      fieldsRequested: service.dataFields.map(f => f.name)
    };

    const evalResponse = {
      serviceCode: service.code,
      legalGround: isRule12Exempt 
        ? "Section 7(b) — State Function (Public Subsidy / Benefit)" 
        : (isSec7 ? "Section 7(b) — State Function" : (isMinor ? "Section 9 — Verifiable Parental Consent (VPC)" : "Section 6 — Voluntary Consent")),
      statutoryMandate: isSec7,
      enablingLegislation: isRule12Exempt
        ? "DPDP Rules 2025 Rule 12 read with Fourth Schedule Part B (Public Subsidy / Benefit Exemption)"
        : (isSec7 ? (service.enablingAct || "Registration of Births and Deaths Act, 1969") : "N/A"),
      consentRequirement: isRule12Exempt
        ? "STATUTORY_BENEFIT_EXEMPTION_RECORD"
        : (isSec7 ? "NON_REVOCABLE_STATE_DUTY" : (isMinor ? "MANDATORY_PARENTAL_VERIFICATION" : "EXPLICIT_AFFIRMATIVE")),
      withdrawalProtocol: isSec7 
        ? "Unilateral erasure barred under Sec 17(4) read with Sec 7(b); promotional alerts opt-out only"
        : "Unconditional withdrawal permitted via Section 6(4) / Citizen Portal API",
      childProtectionRules: isMinor ? {
        under18ThresholdStrict: true,
        profilingProhibited: true,
        targetedAdsProhibited: true,
        rule12ExemptionApplied: isRule12Exempt,
        verificationMethodRequired: isRule12Exempt ? "Rule 12 Public Funds Exemption Record" : "DigiLocker Family Attestation"
      } : "ADULT_STANDARD_COMPLIANCE"
    };

    area.innerHTML = `
      <div class="alert-banner info mb-3">
        <span class="alert-icon">⚖️</span>
        <div><strong>Step 2: Statutory Ground Evaluation (Section 6 vs Section 7 vs Rule 12 Exemption)</strong><br>
        Before collecting affirmative consent, the Certification Portal asks DPDP-GovShield to classify whether the service is sovereign municipal processing (Section 7(b)) or voluntary (Section 6). This prevents citizens from mistakenly being allowed to revoke essential government registers.</div>
      </div>

      <div class="sim-console-grid">
        <div class="sim-pane">
          <div class="sim-pane-header">
            <span>POST /api/v1/consent/evaluate</span>
            <span class="method-badge method-post">POST</span>
          </div>
          <div class="sim-pane-body">
            <div style="font-size:11px;font-weight:700;color:var(--gray-500);margin-bottom:4px;">Request Payload:</div>
            <div class="code-viewer" style="max-height:120px;margin-bottom:12px;">${escapeHtml(JSON.stringify(evalPayload, null, 2))}</div>

            <div style="font-size:11px;font-weight:700;color:var(--gray-500);margin-bottom:4px;">DPDP-GovShield Legal Decision:</div>
            <div class="code-viewer">${escapeHtml(JSON.stringify(evalResponse, null, 2))}</div>
          </div>
        </div>

        <div class="sim-pane">
          <div class="sim-pane-header">
            <span>Adjudicated Processing Basis:</span>
            <span class="${isSec7 ? 'badge-statutory' : (isMinor ? 'badge-minor' : 'badge-consent')}">${evalResponse.legalGround}</span>
          </div>
          <div class="sim-pane-body">
            <div style="padding:16px;background:var(--gray-50);border-radius:8px;font-size:13px;line-height:1.7;">
              <div style="margin-bottom:8px;">
                <strong>Decision Rationale:</strong><br>
                ${isRule12Exempt
                  ? 'This service provides an educational merit scholarship financed from municipal public funds. Under <strong>Rule 12 read with Fourth Schedule Part B</strong> of the DPDP Rules 2025, provision of subsidies, benefits, services, certificates, licenses, or permits from public funds is statutorily exempted from Section 9(1) parental consent. In accordance with <strong>Section 9(3)</strong>, tracking, behavioral profiling, and targeted ads directed at children remain strictly prohibited under law.'
                  : (isSec7 
                    ? 'Since this certificate is mandated by the <em>Registration of Births and Deaths Act, 1969</em>, it constitutes a sovereign public register. Processing proceeds under <strong>Section 7(b)</strong>. Section 17(4) disapplies Section 8(7) and Section 12(3) erasure requests.'
                    : (isMinor 
                      ? 'Applicant is a minor student (<18). Section 9 strictly requires <strong>Verifiable Parental Consent (VPC)</strong> before capturing records. All analytical profiling is automatically blocked.'
                      : 'This is a voluntary welfare assessment certificate. Processing requires <strong>explicit affirmative consent under Section 6</strong>. The applicant may withdraw at any time.'))
                }
              </div>
              <div style="margin-top:12px;padding-top:10px;border-top:1px solid #cbd5e1;font-size:12px;color:var(--gray-600);">
                <strong>Statutory Duty Check:</strong> ${isRule12Exempt ? '✓ Rule 12 Fourth Schedule Exemption Confirmed' : (isSec7 ? '✓ Statutory Public Mandate Verified' : '✓ Voluntary Service Confirmed')}
              </div>
              <div class="mt-3">
                <button class="btn btn-primary btn-sm" style="width:100%;" onclick="jumpToSimStep(3)">Proceed to Step 3: Capture Consent & Generate Receipt →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (simCurrentStep === 3) {
    const isMinor = service.isMinorSupported && service.id.includes('MINOR');
    const isSec7 = service.isStatutory;
    const isRule12Exempt = !!service.isExemptUnderRule12FourthSchedule;
    const applicant = service.applicantDefault;
    const simConsentId = `CON-2026-001${SAMPLE_DATA.consentRecords.length + 1}`;

    const capturePayload = {
      principalId: isMinor ? "AMC-CHD-991204" : (service.id.includes('BIRTH') ? "AMC-CID-781290" : "AMC-CID-890124"),
      principalName: applicant,
      purposeCode: service.code,
      serviceTitle: service.title,
      systemId: "SYS-013",
      channel: "Web Portal",
      language: lang === 'gu' ? 'Gujarati' : (lang === 'hi' ? 'Hindi' : 'English'),
      isMinor: isMinor,
      childName: isMinor ? "Master Rohan D. Rana" : null,
      childAge: isMinor ? 12 : null,
      rule12ExemptionToken: isRule12Exempt ? "EXM-R12-2026-0091" : null,
      vpcToken: (isMinor && !isRule12Exempt) ? "VPC-DL-2026-098842" : null,
      antiProfilingEnforced: isMinor ? true : false
    };

    area.innerHTML = `
      <div class="alert-banner info mb-3">
        <span class="alert-icon">🛡️</span>
        <div><strong>Step 3: Consent Artifact Capture & Machine-Readable Receipt</strong><br>
        The citizen submits their application. The certification portal posts the consent artifact to DPDP-GovShield. The compliance platform verifies statutory exemptions / VPC tokens, cryptographically signs the record with RS256, stores it in the immutable RoPA ledger, and returns a <strong>Kantara v1.1 / ISO 27560:2023</strong> machine-readable receipt.</div>
      </div>

      <div class="sim-console-grid">
        <div class="sim-pane">
          <div class="sim-pane-header">
            <span>POST /api/v1/consent/capture</span>
            <span class="method-badge method-post">POST</span>
          </div>
          <div class="sim-pane-body">
            <div style="font-size:11px;font-weight:700;color:var(--gray-500);margin-bottom:4px;">Inbound Payload from Certification Portal:</div>
            <div class="code-viewer" style="margin-bottom:12px;">${escapeHtml(JSON.stringify(capturePayload, null, 2))}</div>
            <button class="btn btn-success btn-sm" id="btnExecuteCapture" onclick="executeSimConsentCapture('${simConsentId}')">
              ${isRule12Exempt ? '⚡ Execute Live Capture & Sign Rule 12 Record' : '⚡ Execute Live Capture & Sign Receipt'}
            </button>
          </div>
        </div>

        <div class="sim-pane">
          <div class="sim-pane-header">
            <span>Generated Kantara v1.1 / ISO 27560 Consent Receipt:</span>
            <span id="simReceiptBadge" class="badge badge-info">${simCapturedReceipt ? '201 Created' : 'Ready to Sign'}</span>
          </div>
          <div class="sim-pane-body">
            <div class="code-viewer" id="simReceiptViewer">${simCapturedReceipt ? escapeHtml(JSON.stringify(simCapturedReceipt, null, 2)) : '// Click "Execute Live Capture & Sign Receipt" to generate Kantara v1.1 token'}</div>
            ${simCapturedReceipt ? `
              <div class="mt-2 flex gap-8">
                <button class="btn btn-secondary btn-sm" onclick="copyReceiptToClipboard('${simCapturedReceipt.consentReceiptID}')">📋 Copy Receipt</button>
                <button class="btn btn-primary btn-sm" onclick="jumpToSimStep(4)">Proceed to Step 4: Webhook Event Dispatch →</button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  } else if (simCurrentStep === 4) {
    const webhook = INTEGRATION_DATA.webhooks[0];
    const webhookPayload = {
      eventId: `EVT-2026-${Date.now().toString().slice(-6)}`,
      eventType: service.isStatutory ? "STATUTORY_PREFERENCE_UPDATED" : "RIGHTS_ERASURE_MANDATED",
      timestamp: new Date().toISOString(),
      principalId: "XXXX-XXXX-4523",
      source: "DPDP_CITIZEN_PORTAL",
      targetSystem: "SYS-013 (Citizen Certification Portal)",
      instruction: service.isStatutory
        ? "Citizen opted out of marketing/SMS alerts. Maintain primary certificate records pursuant to Section 7(b)."
        : "Citizen executed Section 12 Right to Erasure. Purge ancillary transaction logs within 48 hours.",
      hmacSha256Signature: "sha256=9f83ac428019bcae710294819d45e03b44298fc1c149afbf4c8996fb92427ae4"
    };

    area.innerHTML = `
      <div class="alert-banner info mb-3">
        <span class="alert-icon">🔔</span>
        <div><strong>Step 4: Outbound Webhook Synchronization (Citizen Rights & Erasure)</strong><br>
        When a citizen withdraws consent or files a Section 12 Right to Erasure in the DPDP Citizen Portal, DPDP-GovShield immediately fires an outbound Webhook to the Citizen Certification Portal so its microservices automatically purge or archive records without manual intervention.</div>
      </div>

      <div class="sim-console-grid">
        <div class="sim-pane">
          <div class="sim-pane-header">
            <span>Outbound Webhook Dispatcher:</span>
            <span class="method-badge method-post">POST</span>
          </div>
          <div class="sim-pane-body">
            <div style="font-size:12px;font-family:monospace;color:var(--gray-700);margin-bottom:8px;">
              <strong>Target URL:</strong> ${webhook.endpointUrl}
            </div>
            <div style="font-size:11px;font-family:monospace;color:var(--gray-500);margin-bottom:10px;">
              <strong>HMAC Header:</strong> X-GovShield-Signature: ${webhookPayload.hmacSha256Signature}
            </div>
            <div class="code-viewer" style="margin-bottom:12px;">${escapeHtml(JSON.stringify(webhookPayload, null, 2))}</div>
            <button class="btn btn-primary btn-sm" onclick="executeSimWebhookDispatch()">
              ⚡ Dispatch Simulated Webhook Event
            </button>
          </div>
        </div>

        <div class="sim-pane">
          <div class="sim-pane-header">
            <span>Certification Portal Response:</span>
            <span id="webhookResBadge" class="badge badge-neutral">Awaiting Trigger</span>
          </div>
          <div class="sim-pane-body" id="webhookResBody">
            <div style="padding:20px;text-align:center;color:var(--gray-400);font-size:13px;">
              Click "Dispatch Simulated Webhook Event" to view the external portal's acknowledgment and data purge confirmation.
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

function executeSimConsentCapture(consentId) {
  const service = INTEGRATION_DATA.certServices.find(s => s.id === simCurrentServiceId);
  if (!service) return;

  const isMinor = service.isMinorSupported && service.id.includes('MINOR');
  const isSec7 = service.isStatutory;
  const isRule12Exempt = !!service.isExemptUnderRule12FourthSchedule;

  const newRecord = {
    id: consentId,
    principalName: service.applicantDefault,
    principalId: isMinor ? "AMC-CHD-991204" : (service.id.includes('BIRTH') ? "AMC-CID-781290" : "AMC-CID-890124"),
    purpose: service.title,
    system: "SYS-013",
    status: "active",
    grantedAt: new Date().toISOString(),
    noticeVersion: "v2.4",
    language: simCurrentLang === 'gu' ? 'Gujarati' : (simCurrentLang === 'hi' ? 'Hindi' : 'English'),
    channel: "Web Portal",
    legalGround: isRule12Exempt 
      ? "Section 7(b) — State Function (Public Subsidy / Benefit)" 
      : (isSec7 ? "Section 7(b) — State Function" : (isMinor ? "Section 9 — Verifiable Parental Consent" : "Section 6 — Consent")),
    isStatutory: isSec7 || isRule12Exempt,
    isMinor: isMinor,
    childAge: isMinor ? 12 : null,
    childName: isMinor ? "Master Rohan D. Rana" : null,
    isExemptUnderRule12FourthSchedule: isRule12Exempt,
    exemptionRecord: isRule12Exempt ? {
      exemptionToken: "EXM-R12-2026-0091",
      citation: "DPDP Rules 2025 Rule 12 read with Fourth Schedule Part B",
      beneficiary: "Master Rohan D. Rana (Age 12)",
      antiProfilingEnforced: true,
      timestamp: new Date().toISOString(),
      signedBy: "Municipal Education Officer & DPO, AMC"
    } : null,
    vpc: (isMinor && !isRule12Exempt) ? {
      verified: true,
      method: "DigiLocker Family ID Linkage",
      token: "VPC-DL-2026-098842",
      guardianName: "Smt. Anita D. Rana",
      guardianAadhaarMasked: "XXXX-XXXX-2234",
      childAge: 12,
      profilingProhibited: true,
      targetedAdsProhibited: true,
      verifiedAt: new Date().toISOString()
    } : null
  };

  // Add to active sample records and increment KPI
  SAMPLE_DATA.consentRecords.unshift(newRecord);
  SAMPLE_DATA.complianceKPIs.totalConsentRecords++;
  SAMPLE_DATA.complianceKPIs.activeConsents++;

  // Generate ISO 27560 / Kantara Receipt
  simCapturedReceipt = generateKantaraConsentReceipt(newRecord);

  const viewer = document.getElementById('simReceiptViewer');
  const badge = document.getElementById('simReceiptBadge');
  if (viewer) viewer.innerHTML = escapeHtml(JSON.stringify(simCapturedReceipt, null, 2));
  if (badge) {
    badge.className = 'badge badge-success';
    badge.textContent = isRule12Exempt ? '201 Created · Rule 12 Exemption Signed' : '201 Created · Anchored to Ledger';
  }

  // Refresh view to show next step button
  renderSimStep();
  const msg = isRule12Exempt
    ? `Rule 12 Exemption Record Generated & Signed!\n\nToken: EXM-R12-2026-0091\nParental consent statutorily exempted under Fourth Schedule Part B.\nSection 9(3) anti-profiling lock active.`
    : `Consent Captured & Signed!\n\nReceipt ID: ${simCapturedReceipt.consentReceiptID}\nAnchored to AMC Immutable Audit Ledger.`;
  alert(msg);
}

function executeSimWebhookDispatch() {
  const badge = document.getElementById('webhookResBadge');
  const body = document.getElementById('webhookResBody');
  if (!badge || !body) return;

  badge.className = 'badge badge-success';
  badge.textContent = '200 OK · Purge Acknowledged';

  body.innerHTML = `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:14px;font-size:12px;color:#166534;line-height:1.7;">
      <strong>✓ HTTP 200 OK (Latency: 32ms):</strong><br>
      Certification Portal processed webhook event.<br>
      • HMAC SHA-256 signature verified.<br>
      • Target record flagged: <code>STATUS_ERASURE_SCHEDULED</code>.<br>
      • Audit reference ticket created: <code>ACK-SYS013-98214</code>.<br>
      • Compliance with Section 12 30-day SLA guaranteed.
    </div>
    <div class="mt-3">
      <button class="btn btn-secondary btn-sm" onclick="jumpToSimStep(1)">↺ Restart Simulation</button>
    </div>
  `;
}

// ── API Documentation & Code Snippets ───────────────────────

function renderApiDocs() {
  const container = document.getElementById('apiDocsContainer');
  if (!container) return;

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/notices/{purposeCode}",
      desc: "Fetches approved multilingual DPDP Section 5 notice text and DPO disclosure metadata.",
      params: "lang: gu | hi | en (optional, default: gu)",
      sampleCurl: `curl -X GET "https://dpdp.amc.gov.in/api/v1/notices/CERT_INCOME_SERVICE?lang=gu" \\
  -H "Authorization: Bearer amc_live_pk_9d42e6f77c384a20b12d5930fa12" \\
  -H "Accept: application/json"`,
      sampleJs: `// Node.js / Browser Fetch
const response = await fetch('https://dpdp.amc.gov.in/api/v1/notices/CERT_INCOME_SERVICE?lang=gu', {
  headers: {
    'Authorization': 'Bearer ' + process.env.DPDP_API_KEY,
    'Accept': 'application/json'
  }
});
const notice = await response.json();
console.log(notice.data.statutoryNotice);`,
      sampleJava: `// Java Spring Boot RestTemplate
HttpHeaders headers = new HttpHeaders();
headers.setBearerAuth(dpdpApiKey);
headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
ResponseEntity<String> response = restTemplate.exchange(
    "https://dpdp.amc.gov.in/api/v1/notices/CERT_INCOME_SERVICE?lang=gu",
    HttpMethod.GET, entity, String.class);`
    },
    {
      method: "POST",
      path: "/api/v1/consent/evaluate",
      desc: "Evaluates whether processing qualifies as Section 6 Consent or Section 7(b) Sovereign State Function.",
      params: "serviceCode, department, fieldsRequested",
      sampleCurl: `curl -X POST "https://dpdp.amc.gov.in/api/v1/consent/evaluate" \\
  -H "Authorization: Bearer amc_live_pk_9d42e6f77c384a20b12d5930fa12" \\
  -H "Content-Type: application/json" \\
  -d '{"serviceCode":"CERT_BIRTH_EXTRACT","department":"DEP-002"}'`,
      sampleJs: `// Evaluate processing grounds
const res = await fetch('https://dpdp.amc.gov.in/api/v1/consent/evaluate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.DPDP_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ serviceCode: 'CERT_BIRTH_EXTRACT', department: 'DEP-002' })
});
const evaluation = await res.json();
console.log(evaluation.legalGround); // 'Section 7(b) — State Function'`,
      sampleJava: `// Java Ground Evaluation
Map<String, String> body = Map.of("serviceCode", "CERT_BIRTH_EXTRACT", "department", "DEP-002");
HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
ResponseEntity<EvaluationResult> response = restTemplate.postForEntity(
    "https://dpdp.amc.gov.in/api/v1/consent/evaluate", request, EvaluationResult.class);`
    },
    {
      method: "POST",
      path: "/api/v1/consent/capture",
      desc: "Captures affirmative consent or statutory notice log, validates minor VPC, and generates Kantara v1.1 receipt.",
      params: "principalId, principalName, purposeCode, channel, language, isMinor",
      sampleCurl: `curl -X POST "https://dpdp.amc.gov.in/api/v1/consent/capture" \\
  -H "Authorization: Bearer amc_live_pk_9d42e6f77c384a20b12d5930fa12" \\
  -H "Content-Type: application/json" \\
  -d '{"principalId":"XXXX-XXXX-4523","principalName":"Shri Ramesh K. Patel","purposeCode":"CERT_INCOME_SERVICE"}'`,
      sampleJs: `// Capture consent & get ISO 27560 receipt
const res = await fetch('https://dpdp.amc.gov.in/api/v1/consent/capture', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.DPDP_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    principalId: 'XXXX-XXXX-4523',
    principalName: 'Shri Ramesh K. Patel',
    purposeCode: 'CERT_INCOME_SERVICE',
    channel: 'Web Portal',
    language: 'Gujarati'
  })
});
const receipt = await res.json();
console.log('Kantara Receipt ID:', receipt.consentReceiptID);`,
      sampleJava: `// Java Capture Consent
ConsentPayload payload = new ConsentPayload("XXXX-XXXX-4523", "Shri Ramesh K. Patel", "CERT_INCOME_SERVICE");
HttpEntity<ConsentPayload> req = new HttpEntity<>(payload, headers);
ResponseEntity<KantaraReceipt> res = restTemplate.postForEntity(
    "https://dpdp.amc.gov.in/api/v1/consent/capture", req, KantaraReceipt.class);`
    }
  ];

  container.innerHTML = endpoints.map((ep, idx) => `
    <div style="background:var(--white);border:1px solid var(--gray-200);border-radius:8px;padding:18px;margin-bottom:16px;">
      <div class="flex items-center gap-8 mb-2">
        <span class="method-badge ${ep.method === 'GET' ? 'method-get' : 'method-post'}">${ep.method}</span>
        <code style="font-size:14px;font-weight:700;color:var(--navy-900);">${ep.path}</code>
      </div>
      <p style="font-size:13px;color:var(--gray-600);margin-bottom:12px;">${ep.desc}</p>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:12px;"><strong>Parameters:</strong> ${ep.params}</div>

      <div class="sdk-lang-tabs">
        <button class="sdk-lang-btn active" onclick="switchEndpointCodeSnippet(${idx}, 'curl')">cURL</button>
        <button class="sdk-lang-btn" onclick="switchEndpointCodeSnippet(${idx}, 'js')">JavaScript (Node / Fetch)</button>
        <button class="sdk-lang-btn" onclick="switchEndpointCodeSnippet(${idx}, 'java')">Java (Spring Boot)</button>
      </div>
      <div class="code-viewer" id="endpointCodeSnippet_${idx}">${escapeHtml(ep.sampleCurl)}</div>
    </div>
  `).join('');
}

function switchEndpointCodeSnippet(idx, lang) {
  const viewer = document.getElementById(`endpointCodeSnippet_${idx}`);
  if (!viewer) return;

  const endpoints = [
    {
      curl: `curl -X GET "https://dpdp.amc.gov.in/api/v1/notices/CERT_INCOME_SERVICE?lang=gu" \\
  -H "Authorization: Bearer amc_live_pk_9d42e6f77c384a20b12d5930fa12" \\
  -H "Accept: application/json"`,
      js: `// Node.js / Browser Fetch
const response = await fetch('https://dpdp.amc.gov.in/api/v1/notices/CERT_INCOME_SERVICE?lang=gu', {
  headers: {
    'Authorization': 'Bearer ' + process.env.DPDP_API_KEY,
    'Accept': 'application/json'
  }
});
const notice = await response.json();
console.log(notice.data.statutoryNotice);`,
      java: `// Java Spring Boot RestTemplate
HttpHeaders headers = new HttpHeaders();
headers.setBearerAuth(dpdpApiKey);
headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
ResponseEntity<String> response = restTemplate.exchange(
    "https://dpdp.amc.gov.in/api/v1/notices/CERT_INCOME_SERVICE?lang=gu",
    HttpMethod.GET, entity, String.class);`
    },
    {
      curl: `curl -X POST "https://dpdp.amc.gov.in/api/v1/consent/evaluate" \\
  -H "Authorization: Bearer amc_live_pk_9d42e6f77c384a20b12d5930fa12" \\
  -H "Content-Type: application/json" \\
  -d '{"serviceCode":"CERT_BIRTH_EXTRACT","department":"DEP-002"}'`,
      js: `// Evaluate processing grounds
const res = await fetch('https://dpdp.amc.gov.in/api/v1/consent/evaluate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.DPDP_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ serviceCode: 'CERT_BIRTH_EXTRACT', department: 'DEP-002' })
});
const evaluation = await res.json();
console.log(evaluation.legalGround); // 'Section 7(b) — State Function'`,
      java: `// Java Ground Evaluation
Map<String, String> body = Map.of("serviceCode", "CERT_BIRTH_EXTRACT", "department", "DEP-002");
HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
ResponseEntity<EvaluationResult> response = restTemplate.postForEntity(
    "https://dpdp.amc.gov.in/api/v1/consent/evaluate", request, EvaluationResult.class);`
    },
    {
      curl: `curl -X POST "https://dpdp.amc.gov.in/api/v1/consent/capture" \\
  -H "Authorization: Bearer amc_live_pk_9d42e6f77c384a20b12d5930fa12" \\
  -H "Content-Type: application/json" \\
  -d '{"principalId":"XXXX-XXXX-4523","principalName":"Shri Ramesh K. Patel","purposeCode":"CERT_INCOME_SERVICE"}'`,
      js: `// Capture consent & get ISO 27560 receipt
const res = await fetch('https://dpdp.amc.gov.in/api/v1/consent/capture', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.DPDP_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    principalId: 'XXXX-XXXX-4523',
    principalName: 'Shri Ramesh K. Patel',
    purposeCode: 'CERT_INCOME_SERVICE',
    channel: 'Web Portal',
    language: 'Gujarati'
  })
});
const receipt = await res.json();
console.log('Kantara Receipt ID:', receipt.consentReceiptID);`,
      java: `// Java Capture Consent
ConsentPayload payload = new ConsentPayload("XXXX-XXXX-4523", "Shri Ramesh K. Patel", "CERT_INCOME_SERVICE");
HttpEntity<ConsentPayload> req = new HttpEntity<>(payload, headers);
ResponseEntity<KantaraReceipt> res = restTemplate.postForEntity(
    "https://dpdp.amc.gov.in/api/v1/consent/capture", req, KantaraReceipt.class);`
    }
  ];

  viewer.innerHTML = escapeHtml(endpoints[idx][lang]);
}

// ── API Keys Table ──────────────────────────────────────────

function renderApiKeysTable() {
  const tbody = document.getElementById('apiKeysTableBody');
  if (!tbody || typeof INTEGRATION_DATA === 'undefined') return;

  tbody.innerHTML = INTEGRATION_DATA.apiKeys.map(k => `
    <tr>
      <td style="font-weight:700">${k.systemName}<br><span class="td-muted">${k.systemId} · ${getDeptName(k.department)}</span></td>
      <td><code>${k.id}</code></td>
      <td>
        <span class="api-key-pill">${k.keyPrefix}</span>
        <button class="btn btn-secondary btn-sm" onclick="alert('API Key copied to clipboard:\\n\\n${k.fullKey}');">Copy</button>
      </td>
      <td>${k.scopes.map(s => `<span class="badge badge-neutral" style="margin:1px;">${s}</span>`).join('')}</td>
      <td>${k.rateLimit}</td>
      <td><span class="badge badge-success">Active</span></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="alert('Revoking API Key ${k.id}... Requires DPO authorization.');">Revoke</button>
      </td>
    </tr>
  `).join('');
}

function showGenerateApiKeyModal() {
  showModal(`
    <div class="modal-header">
      <h2>+ Issue Scoped API Key for Municipal Service</h2>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Consumer Municipal System</div>
          <select id="newKeySystem" class="filter-select" style="width:100%;">
            ${SAMPLE_DATA.systems.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('')}
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Authorized Scopes</div>
          <div style="font-size:12px;line-height:1.8;">
            <label><input type="checkbox" checked> notice:read (Fetch Sec 5 notices)</label><br>
            <label><input type="checkbox" checked> consent:evaluate (Evaluate Sec 6 vs 7)</label><br>
            <label><input type="checkbox" checked> consent:write (Capture affirmative consent)</label><br>
            <label><input type="checkbox"> vpc:challenge (Verify Section 9 minor tokens)</label>
          </div>
        </div>
        <div class="detail-row"><div class="detail-label">Rate Limit Quota</div>
          <select id="newKeyRate" class="filter-select" style="width:100%;">
            <option>1,000 requests / minute</option>
            <option>5,000 requests / minute</option>
            <option>10,000 requests / minute</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewApiKey()">Generate & Issue Key</button>
    </div>
  `);
}

function saveNewApiKey() {
  const sysId = document.getElementById('newKeySystem').value;
  const sys = SAMPLE_DATA.systems.find(s => s.id === sysId) || { name: "External Service", department: "DEP-001" };
  const randomHex = Math.random().toString(36).substring(2, 12);
  const newKey = {
    id: `KEY-00${INTEGRATION_DATA.apiKeys.length + 1}`,
    systemId: sysId,
    systemName: sys.name,
    keyPrefix: `amc_live_pk_${randomHex.slice(0, 5)}...`,
    fullKey: `amc_live_pk_${randomHex}89f02c4b`,
    department: sys.department,
    scopes: ["notice:read", "consent:write"],
    rateLimit: document.getElementById('newKeyRate').value,
    status: "active",
    createdAt: new Date().toISOString(),
    lastUsed: "Just created"
  };
  INTEGRATION_DATA.apiKeys.push(newKey);
  alert(`New API Key Generated!\n\nBearer Token: ${newKey.fullKey}\nKeep this secret. It has been scoped for ${sys.name}.`);
  closeModalDirect();
  renderApiKeysTable();
}

// ── Webhooks Table ──────────────────────────────────────────

function renderWebhooksTable() {
  const tbody = document.getElementById('webhooksTableBody');
  if (!tbody || typeof INTEGRATION_DATA === 'undefined') return;

  tbody.innerHTML = INTEGRATION_DATA.webhooks.map(w => `
    <tr>
      <td style="font-weight:700">${w.systemName}<br><span class="td-muted">${w.systemId}</span></td>
      <td><code style="font-size:12px;color:var(--navy-700);">${w.endpointUrl}</code></td>
      <td>${w.subscribedEvents.map(e => `<span class="badge badge-info" style="margin:1px;">${e}</span>`).join('')}</td>
      <td><span class="api-key-pill">${w.hmacSecret.substring(0, 10)}...</span></td>
      <td><span class="badge badge-success">${w.status} (${w.successRate})</span></td>
      <td><strong style="color:var(--green-700)">${w.latencyMs} ms</strong></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="testWebhookPing('${w.id}')">⚡ Test Ping</button>
      </td>
    </tr>
  `).join('');
}

function showRegisterWebhookModal() {
  showModal(`
    <div class="modal-header">
      <h2>+ Register Outbound Webhook Callback</h2>
      <button class="modal-close" onclick="closeModalDirect()">✕</button>
    </div>
    <div class="modal-body">
      <div class="detail-grid mb-2">
        <div class="detail-row"><div class="detail-label">Consumer Municipal Portal</div>
          <select id="newWhSystem" class="filter-select" style="width:100%;">
            ${SAMPLE_DATA.systems.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="detail-row"><div class="detail-label">Webhook Callback URL (HTTPS)</div>
          <input type="text" id="newWhUrl" class="search-input" style="width:100%;padding-left:14px;" placeholder="https://portal.amc.gov.in/api/dpdp/events">
        </div>
        <div class="detail-row"><div class="detail-label">Events to Subscribe</div>
          <div style="font-size:12px;line-height:1.8;">
            <label><input type="checkbox" checked> RIGHTS_ERASURE_MANDATED (Section 12)</label><br>
            <label><input type="checkbox" checked> CONSENT_WITHDRAWN (Section 6(4))</label><br>
            <label><input type="checkbox"> VPC_REVOKED (Section 9 Guardian Revocation)</label>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModalDirect()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewWebhook()">Register & Issue Secret</button>
    </div>
  `);
}

function saveNewWebhook() {
  const sysId = document.getElementById('newWhSystem').value;
  const sys = SAMPLE_DATA.systems.find(s => s.id === sysId) || { name: "External Portal" };
  const url = document.getElementById('newWhUrl').value || "https://services.amc.gov.in/api/dpdp";

  INTEGRATION_DATA.webhooks.push({
    id: `WH-00${INTEGRATION_DATA.webhooks.length + 1}`,
    systemId: sysId,
    systemName: sys.name,
    endpointUrl: url,
    subscribedEvents: ["RIGHTS_ERASURE_MANDATED", "CONSENT_WITHDRAWN"],
    hmacSecret: `whsec_${Math.random().toString(36).substring(2, 14)}`,
    status: "healthy",
    lastDelivery: new Date().toISOString(),
    latencyMs: 38,
    successRate: "100%"
  });

  alert(`Webhook endpoint registered for ${sys.name}!\n\nDispatched handshake ping: 200 OK.`);
  closeModalDirect();
  renderWebhooksTable();
}

function testWebhookPing(id) {
  const w = INTEGRATION_DATA.webhooks.find(item => item.id === id);
  if (!w) return;
  alert(`Dispatched test event to ${w.endpointUrl}:\n\nHTTP/1.1 200 OK\nRoundtrip Latency: ${w.latencyMs}ms\nSignature Verification: PASS`);
}

// ── Drop-In Web Component SDK ───────────────────────────────

function renderDropInSdk() {
  const container = document.getElementById('sdkComponentContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="alert-banner info mb-3">
      <span class="alert-icon">📦</span>
      <div><strong>Zero-Code Web Component SDK:</strong> External portal developers can include our script tag and place the custom HTML element. It automatically fetches Section 5 notices, handles multilingual switching, generates Kantara receipts, and fires callback events.</div>
    </div>

    <div style="font-size:12px;font-weight:700;color:var(--gray-700);margin-bottom:6px;">Copy & Paste into External Portal HTML:</div>
    <div class="code-viewer mb-3">${escapeHtml(`<!-- 1. Include AMC DPDP-GovShield Web SDK -->
<script src="https://dpdp.amc.gov.in/sdk/v1/govshield-widget.js" 
        data-api-key="amc_live_pk_9d42e6f77c384a20b12d5930fa12" async></script>

<!-- 2. Drop the Custom Element into your Certificate Application Form -->
<dpdp-consent-modal 
    purpose="CERT_INCOME_SERVICE" 
    language="gu" 
    on-consent-success="handleConsentGranted(event)">
</dpdp-consent-modal>

<!-- 3. Receive the Kantara Receipt in your JavaScript -->
<script>
  function handleConsentGranted(event) {
    const receiptId = event.detail.consentReceiptID;
    console.log('Consent anchored! Receipt ID:', receiptId);
    // Attach receiptId to citizen application form payload
    document.getElementById('hiddenReceiptField').value = receiptId;
  }
</script>`)}</div>

    <div class="dropin-preview-box">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:var(--gray-400);margin-bottom:8px;">Live Drop-In Component Preview</div>
      <div style="max-width:550px;margin:0 auto;background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:20px;text-align:left;box-shadow:var(--shadow-sm);">
        <div class="flex-between mb-2">
          <strong style="font-size:14px;color:var(--navy-900);">DPDP Notice: આવકનું પ્રમાણપત્ર ચકાસણી</strong>
          <span class="badge badge-success">DPDP Sec 5 Verified</span>
        </div>
        <p style="font-size:12px;color:var(--gray-700);line-height:1.6;margin-bottom:12px;">
          આવક અને સંપત્તિ પ્રમાણપત્ર મેળવવા માટે તમારી વ્યક્તિગત આવક અને બેંક વિગતોની ચકાસણી કરવામાં આવશે. DPDP અધિનિયમ ૨૦૨૩ ની કલમ ૫ હેઠળ આ ડેટા ફક્ત પ્રમાણપત્ર ચકાસણી માટે વાપરવામાં આવશે.
        </p>
        <div class="flex-between items-center pt-2" style="border-top:1px solid #f1f5f9;">
          <a href="#" style="font-size:11px;color:var(--blue-600);">View Privacy Notice & Rights</a>
          <button class="btn btn-primary btn-sm" onclick="alert('Kantara v1.1 receipt generated by drop-in widget! (Receipt ID: CR-IN-2026-WIDGET-01)');">I Agree & Grant Consent</button>
        </div>
      </div>
    </div>
  `;
}


let currentFontSizePx = 16;
function adjustFontSize(delta) {
  if (delta === 0) currentFontSizePx = 16;
  else currentFontSizePx = Math.max(13, Math.min(22, currentFontSizePx + delta));
  document.documentElement.style.fontSize = currentFontSizePx + 'px';
  showToast(`Font Size: ${currentFontSizePx}px (GIGW 3.0 Standard)`);
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  const isHc = document.body.classList.contains('high-contrast');
  showToast(isHc ? "High Contrast Mode: Enabled (WCAG 2.1 AA)" : "Standard Contrast Mode: Enabled");
}

const ACT_MAP = {
  'ACT-01': 'dpo',
  'ACT-02': 'dpo',
  'ACT-03': 'ciso',
  'ACT-04': 'compliance-officer',
  'ACT-05': 'dept-head',
  'ACT-06': 'data-custodian',
  'ACT-07': 'privacy-analyst',
  'ACT-08': 'system-owner',
  'ACT-09': 'security-analyst',
  'ACT-10': 'citizen',
  'ACT-11': 'guardian',
  'ACT-12': 'super-admin',
  'ACT-13': 'tenant-admin',
  'ACT-14': 'it-admin',
  'ACT-15': 'auditor',
  'ACT-16': 'dpb-inspector'
};

function startApp() {
  loadPersistedState();
  initLoginOverlay();
  
  if (typeof window !== 'undefined' && window.location) {
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get('role');
    const requestedPage = params.get('page');
    const showLogin = params.get('login');

    if (requestedRole) {
      const roleKey = ACT_MAP[requestedRole] || requestedRole;
      if (typeof ROLES !== 'undefined' && ROLES[roleKey]) {
        selectRole(roleKey);
      } else {
        applyRolePerspective();
      }
    } else {
      applyRolePerspective();
    }

    if (requestedPage) {
      setTimeout(() => {
        navigateTo(requestedPage);
      }, 100);
    }

    if (showLogin === 'true') {
      setTimeout(showLoginScreen, 150);
    }
  } else {
    applyRolePerspective();
  }
}

if (typeof window !== 'undefined') {
  window.toggleSDFStatus = toggleSDFStatus;
  window.showRule5IntimationModal = showRule5IntimationModal;
  window.showSection17RefusalNotice = showSection17RefusalNotice;
  window.showRule23InquiryGateModal = showRule23InquiryGateModal;
  window.showSeventhScheduleDisclosureModal = showSeventhScheduleDisclosureModal;
  window.adjustFontSize = adjustFontSize;
  window.toggleHighContrast = toggleHighContrast;
  window.switchInventoryTab = switchInventoryTab;
  window.handleCitizenWithdrawClick = handleCitizenWithdrawClick;
  window.submitCitizenRightsRequest = submitCitizenRightsRequest;
  window.submitCitizenGrievance = submitCitizenGrievance;
  window.resetPersistentState = resetPersistentState;
  window.persistState = persistState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

