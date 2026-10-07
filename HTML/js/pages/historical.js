/* Historical Data Governance - local mock layer (no network requests). */
(function () {
  'use strict';
  const D = window.DPDP;
  const $ = (id) => document.getElementById(id);

  // ---- Mock data ----
  const SEED = {
    sources: [
      { sourceId: 1, sourceName: 'BEL Legacy Tax Mainframe', engineType: 'Oracle 11g', environment: 'PRODUCTION' },
      { sourceId: 2, sourceName: 'Vital Records Archive', engineType: 'MS SQL Server 2008', environment: 'ARCHIVE' },
      { sourceId: 3, sourceName: 'Water Billing Legacy DB', engineType: 'MySQL 5.5', environment: 'STAGING' },
    ],
    catalog: [
      { catalogId: 1, sourceName: 'BEL Legacy Tax Mainframe', tableName: 'tax_assessment_2014', columnName: 'owner_aadhaar_no', piiCategory: 'AADHAAR', confidenceScore: 99, classificationStatus: 'SENSITIVE', legalBasisName: 'Section 7(b) State Service' },
      { catalogId: 2, sourceName: 'BEL Legacy Tax Mainframe', tableName: 'tax_assessment_2014', columnName: 'owner_mobile', piiCategory: 'MOBILE', confidenceScore: 96, classificationStatus: 'PERSONAL', legalBasisName: 'Section 6 Consent' },
      { catalogId: 3, sourceName: 'Vital Records Archive', tableName: 'birth_register', columnName: 'father_name', piiCategory: 'NAME', confidenceScore: 92, classificationStatus: 'PERSONAL', legalBasisName: 'RBD Act 1969' },
      { catalogId: 4, sourceName: 'Water Billing Legacy DB', tableName: 'consumer_master', columnName: 'email_id', piiCategory: 'EMAIL', confidenceScore: 97, classificationStatus: 'PERSONAL', legalBasisName: null },
    ],
    campaigns: [
      { campaignId: 1, campaignCode: 'CMP-5-2-2026-001', campaignTitle: 'Property Tax Legacy Records Reaffirmation', status: 'ACTIVE', dispatchChannels: 'SMS, Email, WhatsApp', totalPrincipalsTargeted: 184500, consentsReaffirmed: 96320, consentsWithdrawn: 4210, statutoryGraceDeadline: '2026-12-31' },
      { campaignId: 2, campaignCode: 'CMP-5-2-2026-002', campaignTitle: 'Smart Water Meter Voluntary Alerts Reaffirmation', status: 'ACTIVE', dispatchChannels: 'SMS, Citizen Portal', totalPrincipalsTargeted: 72300, consentsReaffirmed: 41870, consentsWithdrawn: 1985, statutoryGraceDeadline: '2027-01-31' },
    ],
    lineage: [
      { lineageId: 1, processName: 'ETL_TAX_TO_DWH', processType: 'ETL', sourceTables: 'tax_assessment_2014', destinationTarget: 'BEL Data Warehouse', piiElementsProcessed: 'Name, Tenement ID, Aadhaar (blind index)', auditVerdict: 'COMPLIANT', hasPurposeCreepRisk: false },
      { lineageId: 2, processName: 'SMS_PROMO_EXPORT', processType: 'BATCH EXPORT', sourceTables: 'consumer_master', destinationTarget: 'Third-party SMS vendor', piiElementsProcessed: 'Mobile, Email', auditVerdict: 'NON_COMPLIANT', hasPurposeCreepRisk: true },
      { lineageId: 3, processName: 'VITAL_CERT_PRINT', processType: 'REPORT', sourceTables: 'birth_register', destinationTarget: 'Certificate print service', piiElementsProcessed: 'Name, Date of Birth', auditVerdict: 'COMPLIANT', hasPurposeCreepRisk: false },
    ],
  };
  const state = D.store.get('historical.state', null) || D.clone(SEED);
  const save = () => D.store.set('historical.state', state);

  const SCAN_COLUMNS = [
    { columnName: 'tenement_no', dataType: 'VARCHAR(32)' },
    { columnName: 'owner_pan_card', dataType: 'VARCHAR(10)' },
    { columnName: 'beneficiary_mobile', dataType: 'VARCHAR(16)' },
    { columnName: 'minor_child_dob', dataType: 'DATE' },
    { columnName: 'bank_account_no', dataType: 'VARCHAR(24)' },
    { columnName: 'temp_notes_dump', dataType: 'TEXT' },
  ];
  const RULES = [
    { re: /pan/, cat: 'PAN', pat: 'Regex [A-Z]{5}[0-9]{4}[A-Z] on 98% of sampled rows', conf: 98, cls: 'SENSITIVE' },
    { re: /mobile|phone/, cat: 'MOBILE', pat: 'Regex [6-9][0-9]{9} on 96% of sampled rows', conf: 96, cls: 'PERSONAL' },
    { re: /dob|birth/, cat: 'DATE_OF_BIRTH (MINOR)', pat: 'Date column named *_dob linked to minor-child entity', conf: 94, cls: 'CHILD_DATA (Sec 9)' },
    { re: /bank|account/, cat: 'FINANCIAL', pat: 'Numeric 9-18 digit string with IFSC adjacency', conf: 91, cls: 'SENSITIVE' },
    { re: /tenement/, cat: 'TENEMENT_ID', pat: 'Dictionary match: tenement/property identifier', conf: 88, cls: 'PERSONAL' },
    { re: /notes/, cat: 'FREE_TEXT_PII', pat: 'NER hits (names, phones) in 14% of free-text rows', conf: 72, cls: 'REVIEW_REQUIRED' },
  ];

  const api = {
    async load() { await D.delay(450); return D.clone(state); },
    async scan(sourceId, tableName, columns) {
      await D.delay(1200);
      const src = state.sources.find((s) => s.sourceId === sourceId) || state.sources[0];
      const findings = [];
      columns.forEach((c) => {
        const r = RULES.find((x) => x.re.test(c.columnName));
        if (!r) return;
        findings.push({ columnName: c.columnName, piiCategory: r.cat, patternMatched: r.pat, confidenceScore: r.conf, classificationStatus: r.cls });
        state.catalog = state.catalog.filter((x) => !(x.sourceName === src.sourceName && x.tableName === tableName && x.columnName === c.columnName));
        state.catalog.push({
          catalogId: Date.now() + state.catalog.length, sourceName: src.sourceName, tableName, columnName: c.columnName,
          piiCategory: r.cat, confidenceScore: r.conf, classificationStatus: r.cls, legalBasisName: r.cls.indexOf('CHILD') === 0 ? 'Section 9 Verifiable Parental Consent' : null,
        });
      });
      save();
      return { scanId: 'SCN-' + Date.now().toString(36).toUpperCase(), columnsScanned: columns.length, piiColumnsDetected: findings.length, findings };
    },
    async reaffirm(body) {
      await D.delay(500);
      const sha256Hash = await D.sha256(JSON.stringify(body) + Date.now());
      const campaign = state.campaigns[0]; if (campaign) { campaign.consentsReaffirmed += 1; }
      save();
      return { kantaraReceiptId: 'KNT-' + sha256Hash.slice(0, 12).toUpperCase(), sha256Hash };
    },
    async withdraw(body) {
      await D.delay(500);
      const campaign = state.campaigns[0]; if (campaign) { campaign.consentsWithdrawn += 1; }
      save();
      return { message: 'Voluntary services withdrawn for notice ' + body.noticeToken + ' (Section 6(4) comparable-ease). State-function records retained under Section 7(b).' };
    },
  };

  // ---- Render ----
  function renderSources() {
    $('source-sel').innerHTML = state.sources.map((s) => `<option value="${D.esc(s.sourceId)}">${D.esc(s.sourceName)} (${D.esc(s.engineType)} - ${D.esc(s.environment)})</option>`).join('');
  }
  function renderCatalog() {
    $('catalog-body').innerHTML = state.catalog.map((c) => `
      <tr>
        <td class="bold" style="color:#e2e8f0">${D.esc(c.sourceName)}</td>
        <td class="mono" style="color:#cbd5e1">${D.esc(c.tableName)}.<span class="bold" style="color:var(--c-accent-hover)">${D.esc(c.columnName)}</span></td>
        <td><span class="dk-chip">${D.esc(c.piiCategory)}</span></td>
        <td class="bold" style="color:#34d399">${D.esc(c.confidenceScore)}%</td>
        <td class="bold" style="color:#cbd5e1">${D.esc(c.classificationStatus)}</td>
        <td style="color:var(--c-text-faint)">${D.esc(c.legalBasisName || 'Section 7(b) State Service')}</td>
      </tr>`).join('');
  }
  function renderCampaigns() {
    $('campaigns').innerHTML = state.campaigns.map((c) => `
      <div class="dk-card">
        <div class="dk-row" style="margin-bottom:12px">
          <span class="mono bold small" style="color:var(--c-accent-hover)">${D.esc(c.campaignCode)}</span>
          <span class="dk-pill-ok">${D.esc(c.status)}</span>
        </div>
        <h3 style="font-size:14px;color:#f1f5f9;margin-bottom:8px">${D.esc(c.campaignTitle)}</h3>
        <p class="small" style="color:var(--c-text-faint);margin:0 0 16px">Channels: <span style="color:#e2e8f0">${D.esc(c.dispatchChannels)}</span> &middot; Grace Period: 60 Days</p>
        <div class="dk-stats" style="margin-bottom:16px">
          <div><div class="n" style="color:#e2e8f0">${D.esc(c.totalPrincipalsTargeted.toLocaleString())}</div><div class="l" style="color:var(--c-text-faint)">Targeted</div></div>
          <div><div class="n" style="color:#34d399">${D.esc(c.consentsReaffirmed.toLocaleString())}</div><div class="l" style="color:var(--c-text-faint)">Reaffirmed (Sec 5(2))</div></div>
          <div><div class="n" style="color:#fb7185">${D.esc(c.consentsWithdrawn.toLocaleString())}</div><div class="l" style="color:var(--c-text-faint)">Withdrawn (Sec 6(4))</div></div>
        </div>
        <div class="small" style="color:var(--c-text-faint)">Statutory Grace Deadline: <span class="bold" style="color:#e2e8f0">${D.esc(new Date(c.statutoryGraceDeadline).toLocaleDateString())}</span></div>
      </div>`).join('');
  }
  function renderLineage() {
    $('lineage').innerHTML = state.lineage.map((l) => `
      <div class="dk-sub dk-row" style="padding:16px">
        <div style="min-width:0">
          <div class="row" style="gap:8px">
            <span class="mono bold small" style="color:#e2e8f0">${D.esc(l.processName)}</span>
            <span class="xsmall" style="background:var(--c-dark-2);color:var(--c-text-faint);padding:2px 8px;border-radius:4px;border:1px solid var(--c-dark-3)">${D.esc(l.processType)}</span>
          </div>
          <div class="small" style="color:var(--c-text-faint);margin-top:4px">Source: <span style="color:#cbd5e1">${D.esc(l.sourceTables)}</span> &rarr; Dest: <span style="color:#cbd5e1">${D.esc(l.destinationTarget)}</span></div>
          <div class="xsmall" style="color:var(--c-text-faint)">PII: ${D.esc(l.piiElementsProcessed)}</div>
        </div>
        <div style="text-align:right">
          <span class="dk-verdict ${l.auditVerdict === 'COMPLIANT' ? 'ok' : 'bad'}">${D.esc(l.auditVerdict)}</span>
          ${l.hasPurposeCreepRisk ? '<div class="xsmall bold" style="color:#fb7185;margin-top:4px">&#9888;&#65039; Flagged for Rule 8(2) 48h Purge</div>' : ''}
        </div>
      </div>`).join('');
  }
  function renderAll() { renderSources(); renderCatalog(); renderCampaigns(); renderLineage(); }

  // ---- Tabs ----
  document.querySelector('.dk-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-tab]'); if (!b) return;
    document.querySelectorAll('.dk-tabs button').forEach((x) => {
      const on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    ['discovery', 'campaigns', 'citizen_review', 'lineage'].forEach((n) => $('tab-' + n).classList.toggle('hidden', n !== b.dataset.tab));
  });
  $('tab-discovery').querySelectorAll(':scope > .dk-card').forEach((c, i) => { if (i) c.style.marginTop = '24px'; });

  // ---- Scan ----
  let scanning = false;
  $('btn-scan').addEventListener('click', async () => {
    if (scanning) return;
    scanning = true;
    const btn = $('btn-scan'); btn.disabled = true;
    btn.querySelector('.ico').innerHTML = '<span class="spinner" style="width:12px;height:12px;border-width:2px"></span>';
    btn.querySelector('.lbl-t').textContent = 'Scanning Legacy Schema...';
    $('scan-out').innerHTML = '';
    try {
      const sid = Number($('source-sel').value);
      const r = await api.scan(sid, $('table-name').value, SCAN_COLUMNS);
      $('scan-out').innerHTML = `
        <div class="dk-ok" style="margin-top:16px;background:rgba(2,44,34,.4)">
          <div class="bold" style="margin-bottom:8px">&#9989; Scan Completed: ${D.esc(r.piiColumnsDetected)} of ${D.esc(r.columnsScanned)} columns contain sensitive PII</div>
          <div class="grid grid-3" style="gap:8px;color:#cbd5e1">
            ${r.findings.map((f) => `
              <div class="dk-sub">
                <span class="bold" style="color:#fcd34d">${D.esc(f.piiCategory)}</span>
                <div class="xsmall" style="color:var(--c-text-faint)">${D.esc(f.patternMatched)}</div>
                <div class="xsmall" style="color:#34d399;margin-top:4px">Confidence: ${D.esc(f.confidenceScore)}% &middot; ${D.esc(f.classificationStatus)}</div>
              </div>`).join('')}
          </div>
        </div>`;
      renderCatalog(); renderCampaigns();
    } catch (err) {
      $('scan-out').innerHTML = `<div class="alert alert-error" style="margin-top:16px">${D.esc(err.message || 'Scan failed')}</div>`;
    } finally {
      scanning = false; btn.disabled = false;
      btn.querySelector('.ico').innerHTML = '&#9654;';
      btn.querySelector('.lbl-t').textContent = 'Start Deep PII Discovery';
    }
  });

  // ---- Reaffirm / withdraw ----
  const NOTICE = { noticeToken: 'TOK-SEC5-2026-9812', principalId: '018d0002-7000-7000-8000-000000000001' };
  function showStatus(text) {
    const el = $('reaffirm-status'); el.textContent = '✓ ' + text; el.classList.remove('hidden');
    $('reaffirm-actions').classList.add('hidden');
  }
  $('btn-reaffirm').addEventListener('click', async () => {
    $('btn-reaffirm').disabled = $('btn-withdraw').disabled = true;
    try {
      const d = await api.reaffirm({ ...NOTICE, ipAddress: '10.20.30.45' });
      showStatus(`REAFFIRMED: ${d.kantaraReceiptId} (${d.sha256Hash.substring(0, 16)}...)`);
    } catch (e) { $('btn-reaffirm').disabled = $('btn-withdraw').disabled = false; }
  });
  $('btn-withdraw').addEventListener('click', async () => {
    $('btn-reaffirm').disabled = $('btn-withdraw').disabled = true;
    try {
      const d = await api.withdraw({ ...NOTICE, reason: 'Citizen exercised Section 6(4) comparable-ease withdrawal' });
      showStatus(`WITHDRAWN: ${d.message}`);
    } catch (e) { $('btn-reaffirm').disabled = $('btn-withdraw').disabled = false; }
  });

  // ---- Init ----
  api.load().then((d) => { Object.assign(state, d); renderAll(); });
})();
