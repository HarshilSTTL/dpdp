window.STATUTORY_INVARIANTS = [
  {
    id: 1,
    title: 'Phased Commencement Date-Gating',
    statutoryBasis: 'DPDP Rules 2025 (Notified 13 Nov 2025; Rule 4 on 13 Nov 2026; General Rules 13 May 2027)',
    technicalRule: 'Evaluations prior to statutory commencement date MUST return NOT_YET_IN_FORCE, NEVER FAIL.',
    status: 'ENFORCED',
  },
  {
    id: 2,
    title: 'No Ad-Hoc Fine Formulas (Zero Fake 82% Credit)',
    statutoryBasis: 'Section 33(2) & First Schedule per-contravention statutory maxima',
    technicalRule: 'Formulaic reductions (e.g. "82% Mitigation Credit") and ₹850 Cr aggregate ceilings are strictly forbidden. Replaced by Section 33(2) Qualitative Legal Defense Register.',
    status: 'ENFORCED',
  },
  {
    id: 3,
    title: 'Zero Plaintext Aadhaar',
    statutoryBasis: 'Section 8(5) & Constitutional Privacy Mandate',
    technicalRule: 'Never store, index, or display raw 12-digit Aadhaar. Use opaque UUIDv7 keys and HMAC-SHA256 blind indexes with AES-256-GCM ciphertexts.',
    status: 'ENFORCED',
  },
  {
    id: 4,
    title: 'Tabletop Drill Data Watermarking',
    statutoryBasis: 'CERT-In IT Act 70B & DPBI Rule 7 Safeguards',
    technicalRule: 'All drill/simulation data must carry mandatory prefix SIM-DRILL- and token SIM-CERTIN-DRILL- to prevent false breach panic.',
    status: 'ENFORCED',
  },
  {
    id: 5,
    title: 'Orthogonal Minor Protection',
    statutoryBasis: 'Section 9 read with Rule 12 Fourth Schedule Part A/B',
    technicalRule: 'Section 9 is an orthogonal child condition, not a legal ground. Rule 12 Part B exempts municipal scholarships from 403 VPC blocks.',
    status: 'ENFORCED',
  },
  {
    id: 6,
    title: 'Triple-Clock Incident State Flow',
    statutoryBasis: 'IT Act 70B (6h CERT-In), Rule 7(1) Affected Principals, and Rule 7(3) DPBI 72h Form 1',
    technicalRule: 'Incidents maintain 3 parallel synchronous clocks with delivery receipts for all 6 mandatory citizen elements.',
    status: 'ENFORCED',
  },
  {
    id: 7,
    title: 'Reasoned Refusal Notices under Section 17(4)',
    statutoryBasis: 'Section 17(4) read with Section 7(b) Municipal Retention',
    technicalRule: 'Erasure requests for municipal statutory functions cannot be dismissed with a raw 400 modal. Must emit a signed, appealable Refusal Notice.',
    status: 'ENFORCED',
  },
  {
    id: 8,
    title: 'Rule 14(2) 90-Day Statutory Grievance Ceiling',
    statutoryBasis: 'Rule 14(2) of DPDP Rules 2025',
    technicalRule: 'Rights request targets (15d/30d) are non-statutory internal targets; the grievance redressal engine strictly enforces the statutory 90-day ceiling.',
    status: 'ENFORCED',
  },
  {
    id: 9,
    title: 'Section 16 Zero Foreign Egress',
    statutoryBasis: 'Section 16 & MeitY Sovereign Cloud Mandates',
    technicalRule: 'Workloads and network egress are strictly locked to sovereign Indian subnets (NIC Meghraj, GSWAN). No third-party foreign CDN tracking.',
    status: 'ENFORCED',
  },
  {
    id: 10,
    title: 'M3 Data Processor Governance',
    statutoryBasis: 'Section 8(2) & Rule 6(g) DPA Requirements',
    technicalRule: 'Engaging external processors without executed DPA incorporating mandatory DPDP clauses is an immediate automated violation.',
    status: 'ENFORCED',
  },
];

// Invariant Validation Helpers
function validateNoFakeFineCredit(input) {
  const prohibited = [
    /82%\s*(mitigation|credit)/i,
    /mitigation\s*credit/i,
    /850\s*cr(ore)?\s*(ceiling|aggregate)/i,
    /formulaic\s*reduction/i
  ];
  for (const regex of prohibited) {
    if (regex.test(input)) {
      return {
        valid: false,
        error: `Violation of Invariant #2: Ad-hoc formulas like '${input.match(regex)?.[0]}' are legally unfounded. Section 33(2) mandates qualitative mitigating defense.`,
      };
    }
  }
  return { valid: true };
}

function validateAadhaarSafety(identifier) {
  const rawAadhaarRegex = /^[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}$/;
  if (rawAadhaarRegex.test(identifier.trim())) {
    return {
      isSafe: false,
      reason: 'Violation of Invariant #3: Raw 12-digit Aadhaar cannot be stored or used as an identifier. Must use HMAC-SHA256 blind index.',
    };
  }
  return { isSafe: true };
}

function validateIncidentDrillId(incidentId, isDrill) {
  if (isDrill) {
    const prefix = 'SIM-DRILL-';
    const sanitizedId = incidentId.startsWith(prefix) ? incidentId : `${prefix}${incidentId}`;
    return { valid: true, sanitizedId };
  }
  return { valid: true, sanitizedId: incidentId };
}

window.validateAadhaarSafety = validateAadhaarSafety;
window.validateNoFakeFineCredit = validateNoFakeFineCredit;
window.validateIncidentDrillId = validateIncidentDrillId;
