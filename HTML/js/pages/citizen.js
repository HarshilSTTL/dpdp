/* Citizen Privacy Portal - local mock layer (no network requests). */
(function () {
  'use strict';
  const D = window.DPDP;
  const $ = (id) => document.getElementById(id);

  // ---- Mock API ----
  const SEED = {
    consents: [
      { id: 'CON-0001', serviceName: 'Property Tax e-Payment', status: 'ACTIVE', grantedAt: '2025-04-12T09:30:00Z', purpose: 'Assessment and collection of property tax', legalBasis: 'Section 7(b) State Function' },
      { id: 'CON-0002', serviceName: 'Smart Water Meter Alerts (SMS)', status: 'ACTIVE', grantedAt: '2025-08-03T11:05:00Z', purpose: 'Consumption and leakage alerts', legalBasis: 'Section 6 Consent' },
      { id: 'CON-0003', serviceName: 'Birth & Death Registry Notifications', status: 'ACTIVE', grantedAt: '2024-11-21T14:20:00Z', purpose: 'Certificate status updates', legalBasis: 'RBD Act 1969' },
    ],
    grievances: [
      { id: 'GRV-2026-0142', subject: 'Incorrect tenement name on property tax bill', status: 'IN_PROGRESS' },
      { id: 'GRV-2026-0098', subject: 'Duplicate SMS alerts from water meter service', status: 'RESOLVED' },
    ],
  };
  const state = D.store.get('citizen.state', null) || D.clone(SEED);
  const save = () => D.store.set('citizen.state', state);

  const api = {
    async list() { await D.delay(450); return { consents: D.clone(state.consents), grievances: D.clone(state.grievances) }; },
    async fileGrievance(subject) {
      await D.delay(350);
      const g = { id: 'GRV-2026-' + String(Math.floor(Math.random() * 9000) + 1000), subject, status: 'OPEN' };
      state.grievances.unshift(g); save(); return g;
    },
    async erasure(reason) {
      await D.delay(400);
      state.erasure = { ref: 'ERS-' + Date.now().toString(36).toUpperCase(), reason, at: new Date().toISOString() };
      save(); return state.erasure;
    },
  };

  // ---- Rendering ----
  function renderConsents() {
    const el = $('consents');
    if (!state.consents.length) { el.innerHTML = '<p class="muted" style="font-size:14px">No active consents found.</p>'; return; }
    el.innerHTML = state.consents.map((c, i) => `
      <div class="row-between" style="padding:16px;border:1px solid #f1f5f9;border-radius:var(--radius);background:var(--c-bg)">
        <div>
          <div style="font-weight:600">${D.esc(c.serviceName || c.id || 'Unknown Service')}</div>
          <div class="muted small">Status: ${D.esc(c.status)} | Granted: ${D.esc(new Date(c.grantedAt || c.createdAt || Date.now()).toLocaleDateString())}</div>
        </div>
        <button class="btn btn-outline btn-sm" type="button" data-detail="${i}">View Details</button>
      </div>`).join('');
  }
  function statusBadge(s) { return `<span class="badge ${s === 'RESOLVED' ? 'badge-green' : 'badge-blue'}">${D.esc(s)}</span>`; }
  function renderGrievances() {
    const el = $('grievances');
    if (!state.grievances.length) { el.innerHTML = '<p class="muted" style="font-size:14px">No active grievances.</p>'; return; }
    el.innerHTML = state.grievances.map((g) => `
      <div class="row-between" style="padding:16px;border:1px solid #f1f5f9;border-radius:var(--radius);background:var(--c-bg)">
        <div>
          <div style="font-weight:600">${D.esc(g.subject || 'Data Request')}</div>
          <div class="muted small">ID: ${D.esc(g.id)} | Status: ${D.esc(g.status)}</div>
        </div>
        ${statusBadge(g.status)}
      </div>`).join('');
  }
  function renderErasure() {
    $('erasure-status').textContent = state.erasure ? `Request ${state.erasure.ref} submitted on ${new Date(state.erasure.at).toLocaleDateString()}.` : '';
    $('btn-erasure').disabled = !!state.erasure;
  }

  // ---- Modals ----
  function showDetail(i) {
    const c = state.consents[i]; if (!c) return;
    D.openModal(`
      <div class="modal-head"><h3>${D.esc(c.serviceName)}</h3><button class="x" data-close aria-label="Close">&times;</button></div>
      <table class="tbl" style="min-width:0"><tbody>
        <tr><td class="bold">Consent ID</td><td class="mono">${D.esc(c.id)}</td></tr>
        <tr><td class="bold">Status</td><td>${D.esc(c.status)}</td></tr>
        <tr><td class="bold">Granted</td><td>${D.esc(D.fmtDate(c.grantedAt))}</td></tr>
        <tr><td class="bold">Purpose</td><td>${D.esc(c.purpose || '-')}</td></tr>
        <tr><td class="bold">Legal Basis</td><td>${D.esc(c.legalBasis || '-')}</td></tr>
      </tbody></table>
      <div style="margin-top:16px;text-align:right"><button class="btn btn-outline" data-close type="button">Close</button></div>`);
  }
  function showGrievanceForm() {
    const m = D.openModal(`
      <div class="modal-head"><h3>File New Grievance</h3><button class="x" data-close aria-label="Close">&times;</button></div>
      <form id="gform" novalidate>
        <label class="lbl" for="gsub">Subject</label>
        <input class="field" id="gsub" maxlength="150" placeholder="Describe your concern briefly">
        <div id="gerr" class="err"></div>
        <div class="row" style="margin-top:16px;justify-content:flex-end">
          <button class="btn btn-outline" data-close type="button">Cancel</button>
          <button class="btn btn-accent" type="submit">Submit Grievance</button>
        </div>
      </form>`);
    m.root.querySelector('#gform').addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = m.root.querySelector('#gsub').value.trim();
      if (v.length < 5) { m.root.querySelector('#gerr').textContent = 'Please enter a subject of at least 5 characters.'; return; }
      e.target.querySelector('[type=submit]').disabled = true;
      await api.fileGrievance(v);
      m.close(); renderGrievances();
    });
  }
  function showErasureForm() {
    const m = D.openModal(`
      <div class="modal-head"><h3>Submit Erasure Request</h3><button class="x" data-close aria-label="Close">&times;</button></div>
      <p class="muted" style="font-size:13px;margin-bottom:12px">Data held under a statutory State function (Section 7(b)) may be retained as required by law.</p>
      <form id="eform" novalidate>
        <label class="lbl" for="ereason">Reason (optional)</label>
        <textarea class="field" id="ereason" rows="3" maxlength="300"></textarea>
        <label style="display:flex;gap:8px;margin-top:12px;font-size:13px"><input type="checkbox" id="econf"> I confirm I want my personal data erased where legally permitted.</label>
        <div id="eerr" class="err"></div>
        <div class="row" style="margin-top:16px;justify-content:flex-end">
          <button class="btn btn-outline" data-close type="button">Cancel</button>
          <button class="btn btn-danger" type="submit">Submit Erasure Request</button>
        </div>
      </form>`);
    m.root.querySelector('#eform').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!m.root.querySelector('#econf').checked) { m.root.querySelector('#eerr').textContent = 'Please confirm to continue.'; return; }
      e.target.querySelector('[type=submit]').disabled = true;
      await api.erasure(m.root.querySelector('#ereason').value.trim());
      m.close(); renderErasure();
    });
  }

  // ---- Init ----
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-detail]');
    if (b) showDetail(Number(b.getAttribute('data-detail')));
  });
  $('btn-grievance').addEventListener('click', showGrievanceForm);
  $('btn-erasure').addEventListener('click', showErasureForm);

  (async function init() {
    try {
      const data = await api.list();
      state.consents = data.consents; state.grievances = data.grievances;
      renderConsents(); renderGrievances(); renderErasure();
    } catch (err) {
      const el = $('error'); el.textContent = err.message || 'Error fetching citizen data'; el.classList.remove('hidden');
    } finally {
      $('loading').classList.add('hidden'); $('content').classList.remove('hidden');
    }
  })();
})();
