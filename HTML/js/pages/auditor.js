/* Auditor portal - local mock layer (no network requests). */
(function () {
  'use strict';
  const D = window.DPDP;
  const $ = (id) => document.getElementById(id);

  // ---- Mock data ----
  const DEPTS = [
    ['DEP-001', 'Assessment & Property Tax', 'Tenement ID, Name, Valuation', 'GPMC Act 1949 Sec 151'],
    ['DEP-004', 'Health & Vital Registry', 'Birth/Death Certificates', 'RBD Act 1969'],
    ['DEP-006', 'Smart Water & SCADA Grid', 'Meter Telemetry, Mobile', 'Section 6 Consent (Kantara)'],
    ['DEP-010', 'Urban School Education', 'Minor Scholarships, Bus Telemetry', 'Rule 12 Part B Welfare'],
  ];
  const CONTROLS = [
    ['CTRL-ENC-001', 'AES-256-GCM envelope encryption verified on all PII columns'],
    ['CTRL-AAD-002', 'Aadhaar HMAC-SHA256 blind index: 0 plaintext columns detected'],
    ['CTRL-RLS-003', 'Row-Level Security enforced on 48/48 tenant tables'],
    ['CTRL-WRM-004', 'WORM ledger trigger (SQLSTATE 27000) rejects UPDATE/DELETE'],
    ['CTRL-HSM-005', 'HSM key rotation within 90-day policy window'],
    ['CTRL-MRK-006', 'Merkle chain continuity verified, no gaps in aud_merkle_log'],
    ['CTRL-SLA-007', 'Rule 14(2) grievance SLA: 0 breaches in last 90 days'],
    ['CTRL-BRC-008', 'Breach notification pipeline reachable (CERT-In / DPBI)'],
  ];
  const PROCESSORS = [
    { vendorName: 'Gujarat Informatics Ltd (GIL)', contractRef: 'BEL/IT/DPA/2024/017', nextAuditDue: '2026-12-15', hasAuditRightsClause: true, dpaStatus: 'COMPLIANT' },
    { vendorName: 'Silver Touch Technologies', contractRef: 'BEL/IT/DPA/2025/003', nextAuditDue: '2027-01-20', hasAuditRightsClause: true, dpaStatus: 'COMPLIANT' },
    { vendorName: 'CityPay SMS Gateway Pvt Ltd', contractRef: 'BEL/IT/DPA/2023/044', nextAuditDue: '2026-11-02', hasAuditRightsClause: false, dpaStatus: 'REMEDIATION_PENDING' },
    { vendorName: 'NIC Cloud Hosting (MeghRaj)', contractRef: 'BEL/IT/DPA/2022/009', nextAuditDue: '2027-03-05', hasAuditRightsClause: true, dpaStatus: 'COMPLIANT' },
  ];

  const api = {
    async runProbes() {
      await D.delay(900);
      const results = CONTROLS.map(([controlId, details]) => ({ controlId, status: 'PASS', evidencePayload: { details } }));
      return { results, passed: results.length, totalEvaluated: results.length };
    },
    async verifyMerkle(leafIndex, leafHash) {
      await D.delay(500);
      const computedHash = (await D.sha256(leafIndex + ':' + leafHash.toLowerCase())).toUpperCase();
      const isValid = /^[0-9a-fA-F]{64}$/.test(leafHash) && Number.isInteger(leafIndex) && leafIndex >= 0;
      return {
        isValid, computedHash,
        message: isValid ? 'Leaf hash is consistent with the RFC 6962 Merkle audit path.' : 'Leaf hash is not a well-formed SHA-256 digest or does not match the ledger.',
      };
    },
    async dossier(body) {
      await D.delay(1000);
      const seed = body.dossierType + body.periodStart + body.periodEnd + Date.now();
      const merkleRootHash = (await D.sha256('root:' + seed)).toUpperCase();
      const dpoDigitalSignature = 'RSA-PSS-SHA256:' + (await D.sha256('sig:' + seed)) + (await D.sha256('sig2:' + seed));
      return {
        dossierId: 'DOS-' + (await D.sha256(seed)).slice(0, 12).toUpperCase(),
        dossierType: body.dossierType, complianceScorePct: 100.0,
        periodStart: body.periodStart, periodEnd: body.periodEnd,
        controlsEvaluated: 120, controlsPassed: 120, dailyChecks: 365,
        merkleRootHash, dpoDigitalSignature, generatedAt: new Date().toISOString(),
      };
    },
    async processors() { await D.delay(500); return D.clone(PROCESSORS); },
  };

  // ---- State / helpers ----
  let dossierData = null;
  const busy = {};
  function setBusy(btn, on, busyText) {
    const t = btn.querySelector('.lbl-t');
    if (!btn.dataset.orig) btn.dataset.orig = t.textContent;
    btn.disabled = on;
    t.textContent = on ? (busyText || btn.dataset.orig) : btn.dataset.orig;
    const slot = btn.querySelector('.spin-slot');
    if (slot) {
      if (slot.dataset.o == null) slot.dataset.o = slot.innerHTML;
      slot.innerHTML = on ? '<span class="spinner" style="width:12px;height:12px;border-width:2px"></span>' : slot.dataset.o;
    }
  }
  function showError(msg) { $('global-error-msg').textContent = msg; $('global-error').classList.remove('hidden'); }
  function clearError() { $('global-error').classList.add('hidden'); }

  // ---- Tabs ----
  let activeTab = 'overview';
  let procLoaded = false;
  function setTab(name) {
    activeTab = name;
    document.querySelectorAll('.tabs button').forEach((b) => {
      const on = b.dataset.tab === name;
      b.classList.toggle('active', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    ['overview', 'probes', 'dossier', 'merkle', 'processors'].forEach((n) => $('tab-' + n).classList.toggle('hidden', n !== name));
    if (name === 'processors') loadProcessors();
  }
  document.querySelector('.tabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-tab]'); if (b) setTab(b.dataset.tab);
  });

  // ---- Overview ----
  $('dept-body').innerHTML = DEPTS.map((d) => `
    <tr><td class="mono bold" style="color:var(--c-primary-hover)">${D.esc(d[0])}</td>
    <td class="bold">${D.esc(d[1])}</td><td>${D.esc(d[2])}</td><td>${D.esc(d[3])}</td>
    <td class="bold" style="color:var(--c-success)">0 (Blind Indexed)</td>
    <td><span class="badge badge-green">100% PASS</span></td></tr>`).join('');

  // ---- Probes ----
  $('probe-out').textContent = 'Click "Execute All Probes Now" to test database, HSM, RLS, and WORM ledger controls in real time...';
  async function handleRunProbes() {
    if (busy.probes) return;
    busy.probes = true;
    const btns = [$('btn-probes-top'), $('btn-probes')];
    btns.forEach((b) => setBusy(b, true, 'Executing Probes...'));
    $('probe-out').textContent = 'Executing probes...';
    clearError();
    try {
      const data = await api.runProbes();
      let out = `[CONTINUOUS PROBES COMPLETED AT ${new Date().toLocaleTimeString()} IST]\n${'='.repeat(80)}\n`;
      data.results.forEach((r) => {
        const mark = r.status === 'PASS' ? '✓' : '✗';
        out += `${mark} ${r.controlId}: ${r.evidencePayload.details || r.status} [${r.status}]\n`;
      });
      out += `\n>>> OVERALL SCORECARD: ${data.passed}/${data.totalEvaluated} CONTROLS PASSED (${((data.passed / data.totalEvaluated) * 100).toFixed(2)}% COMPLIANCE INDEX)`;
      $('probe-out').textContent = out;
    } catch (err) {
      showError(err.message || 'Failed to run probes');
      $('probe-out').textContent = `[ERROR] Failed to execute probes: ${err.message}`;
    } finally {
      busy.probes = false;
      btns.forEach((b) => setBusy(b, false));
    }
  }
  $('btn-probes-top').addEventListener('click', handleRunProbes);
  $('btn-probes').addEventListener('click', handleRunProbes);

  // ---- Merkle ----
  $('btn-merkle').addEventListener('click', async () => {
    const idxRaw = $('leaf-index').value.trim();
    const hash = $('leaf-hash').value.trim();
    if (!hash) { $('merkle-out').innerHTML = '<div class="alert alert-warn">Please enter a leaf hash.</div>'; return; }
    if (!/^\d+$/.test(idxRaw)) { $('merkle-out').innerHTML = '<div class="alert alert-warn">Leaf index must be a non-negative integer.</div>'; return; }
    const btn = $('btn-merkle');
    setBusy(btn, true, 'Verifying...');
    $('merkle-out').innerHTML = '';
    clearError();
    try {
      const idx = parseInt(idxRaw, 10);
      const data = await api.verifyMerkle(idx, hash);
      const text = data.isValid
        ? `✅ MATHEMATICALLY VERIFIED (RFC 6962 SHA-256):\n• Leaf Index: #${idx}\n• Leaf Hash: ${hash.substring(0, 32)}...\n• Computed Hash: ${data.computedHash}\n• Status: ${data.message}`
        : `❌ VERIFICATION FAILED:\n• Leaf Index: #${idx}\n• Computed Hash: ${data.computedHash}\n• Message: ${data.message}\n• Tamper Status: CORRUPTION DETECTED`;
      $('merkle-out').innerHTML = data.isValid
        ? `<pre class="code-block" style="white-space:pre-wrap;max-height:none">${D.esc(text)}</pre>`
        : `<pre class="alert alert-error mono" style="white-space:pre-wrap;font-size:12px;margin:0">${D.esc(text)}</pre>`;
    } catch (err) {
      showError(err.message || 'Failed to verify merkle leaf');
    } finally { setBusy(btn, false); }
  });

  // ---- Dossier ----
  const genBtn = $('btn-dossier');
  genBtn.addEventListener('click', async () => {
    setBusy(genBtn, true, 'Generating...');
    dossierData = null; $('btn-download').classList.add('hidden'); $('dossier-out').innerHTML = '';
    clearError();
    try {
      const end = new Date(); const start = new Date(); start.setFullYear(start.getFullYear() - 1);
      dossierData = await api.dossier({ dossierType: 'SEC33_2_DEFENSE', periodStart: start.toISOString(), periodEnd: end.toISOString() });
      const d = dossierData;
      $('dossier-out').innerHTML = `
        <div class="alert alert-ok stack small" style="padding:16px">
          <div class="bold">&#9989; Section 33(2) Evidentiary Defense Dossier Successfully Compiled &amp; Sealed</div>
          <div class="mono" style="line-height:1.8;word-break:break-all">
            <div>&bull; Dossier ID: ${D.esc(d.dossierId)}</div>
            <div>&bull; Compliance Score: ${D.esc(d.complianceScorePct)}%</div>
            <div>&bull; Snapshot Period: ${D.esc(new Date(d.periodStart).toLocaleDateString())} to ${D.esc(new Date(d.periodEnd).toLocaleDateString())}</div>
            <div>&bull; Merkle Root Hash: ${D.esc(d.merkleRootHash.substring(0, 16))}...</div>
            <div>&bull; Statutory DPO Digital Signature: ${D.esc(d.dpoDigitalSignature.substring(0, 40))}...</div>
            <div>&bull; Legal Effect: Admissible under Section 33(2) to prove proactive reasonable security safeguards.</div>
          </div>
        </div>`;
      $('btn-download').classList.remove('hidden');
    } catch (err) { showError(err.message || 'Failed to generate dossier'); }
    finally { setBusy(genBtn, false); }
  });
  $('btn-download').addEventListener('click', () => {
    if (!dossierData) return;
    D.download(`dossier-${dossierData.dossierId}.json`, JSON.stringify(dossierData, null, 2));
  });

  // ---- Processors ----
  async function loadProcessors() {
    if (procLoaded) return;
    $('proc-out').innerHTML = '<div class="text-center" style="padding:32px" role="status"><span class="spinner" style="width:32px;height:32px"></span></div>';
    clearError();
    try {
      const list = await api.processors();
      procLoaded = true;
      $('proc-out').innerHTML = list.length ? '<div class="stack">' + list.map((p) => `
        <div class="row-between" style="padding:16px;background:var(--c-bg);border:1px solid var(--c-border);border-radius:var(--radius);font-size:12px">
          <div>
            <div class="bold" style="font-size:13px">${D.esc(p.vendorName)}</div>
            <div class="muted xsmall">Contract Ref: ${D.esc(p.contractRef)} &middot; Next Audit: ${D.esc(new Date(p.nextAuditDue).toLocaleDateString())}</div>
          </div>
          <div class="row" style="gap:8px">
            ${p.hasAuditRightsClause ? '<span class="badge badge-blue">Audit Rights Clause: YES</span>' : ''}
            <span class="badge ${p.dpaStatus === 'COMPLIANT' ? 'badge-green' : 'badge-amber'}">${D.esc(p.dpaStatus)}</span>
          </div>
        </div>`).join('') + '</div>' : '<div class="text-center muted small" style="padding:16px">No processor audits found.</div>';
    } catch (err) {
      $('proc-out').innerHTML = '';
      showError(err.message || 'Failed to fetch processors');
    }
  }

  $('dismiss-error').addEventListener('click', clearError);
  setTab('overview');
})();
