/* DPO dashboard - local mock layer (no network requests). */
(function () {
  'use strict';
  const D = window.DPDP;
  const api = {
    async stats() {
      await D.delay(400);
      return { complianceScore: 98.5, activeConsents: 12450, openGrievances: 3, pendingDSAR: 12 };
    },
  };
  const cards = [
    ['&#128200;', 'Compliance Score', (s) => s.complianceScore + '%'],
    ['&#128101;', 'Active Consents', (s) => s.activeConsents.toLocaleString()],
    ['&#9888;&#65039;', 'Open Grievances', (s) => String(s.openGrievances)],
    ['&#128196;', 'Pending DSAR', (s) => String(s.pendingDSAR)],
  ];
  (async function () {
    try {
      const s = await api.stats();
      document.getElementById('stats').innerHTML = cards.map((c) => `
        <div class="stat">
          <div class="l bold" style="text-transform:uppercase;letter-spacing:.04em"><span aria-hidden="true">${c[0]}</span> ${D.esc(c[1])}</div>
          <div class="n">${D.esc(c[2](s))}</div>
        </div>`).join('');
      document.getElementById('stats').classList.remove('hidden');
    } catch (err) {
      const el = document.getElementById('error'); el.textContent = err.message || 'Error fetching data'; el.classList.remove('hidden');
    } finally {
      document.getElementById('loading').classList.add('hidden');
    }
  })();
})();
