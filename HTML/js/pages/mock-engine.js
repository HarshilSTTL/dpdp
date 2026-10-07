/* Deterministic in-browser mock of the compliance engines (replaces the ASP.NET backend). */
(function () {
  'use strict';
  const D = window.DPDP;
  const rnd = (n) => Math.floor(Math.pow(10, n - 1) + Math.random() * 9 * Math.pow(10, n - 1));
  const year = () => new Date().getFullYear();

  async function classifyChild(req) {
    await D.delay(250);
    const basis = req.isBenefitUnderLawOrPublicFunds ? 'Sec7bStateService' : req.requestedBasis;
    if (req.applicantAge >= 18) {
      return { legalBasis: basis, childCondition: 'NotChild', vpcRequired: false, exemptionRecordId: null, antiProfilingEnforced: false,
        legalJustification: 'Adult applicant (Age >= 18); Section 9 child conditions do not apply.' };
    }
    if (req.department === 'SYS010_CommunityScholarships' || req.isBenefitUnderLawOrPublicFunds) {
      const id = 'CER-' + year() + '-' + rnd(5);
      return { legalBasis: basis, childCondition: 'ExemptR12B_SubsidyBenefitService', vpcRequired: false, exemptionRecordId: id, antiProfilingEnforced: true,
        legalJustification: 'Exempt from Verifiable Parental Consent (VPC) under Rule 12 Fourth Schedule Part B (Subsidy/Benefit/Service under law or public funds). Anti-profiling strictly enforced. Signed Record: ' + id };
    }
    if (req.department === 'SYS004_BirthDeath' || req.department === 'SYS005_HealthHospital') {
      const id = 'CER-' + year() + '-' + rnd(5);
      return { legalBasis: basis, childCondition: 'ExemptR12A_Clinical', vpcRequired: false, exemptionRecordId: id, antiProfilingEnforced: true,
        legalJustification: 'Exempt from VPC under Rule 12 Fourth Schedule Part A (Clinical/Healthcare care). Signed Record: ' + id };
    }
    return { legalBasis: basis, childCondition: 'VpcRequired', vpcRequired: true, exemptionRecordId: null, antiProfilingEnforced: true,
      legalJustification: 'Standard minor processing requiring Rule 10 Verifiable Parental Consent (VPC) via DigiLocker / OTP.' };
  }

  async function generateErasureRefusal(req) {
    await D.delay(300);
    const n = rnd(5);
    const cite = req.retentionCitation || 'Section 151 of Gujarat Provincial Municipal Corporations (GPMC) Act, 1949 (Permanent Tax Roll Mandate)';
    const body = { noticeId: 'REF-' + year() + '-' + n, requestId: req.requestId || 'RR-REQ-' + n, principalId: req.principalId, serviceName: req.serviceName };
    const checksum = 'SHA256-' + (await D.sha256(JSON.stringify(body) + Date.now())).toUpperCase().slice(0, 32);
    return Object.assign(body, {
      statutoryGround: 'Section 17(4) read with Section 7(b) of the Digital Personal Data Protection Act, 2023',
      municipalRetentionMandate: cite,
      factualReasoning: req.serviceName + ' constitutes an official municipal statutory record under ' + cite + '. Section 17(4) of the DPDP Act, 2023 disapplies the erasure obligation where retention is necessary for compliance with a law in force; the record therefore cannot be erased while the statutory retention mandate applies.',
      appealRoutes: [
        { tier: 1, forum: 'Office of the Data Protection Officer, BEL', filingWindow: '30 days from notice issuance', contactUrlOrEmail: 'dpo@ahmedabadcity.gov.in' },
        { tier: 2, forum: 'Data Protection Board of India (Section 13(3))', filingWindow: 'Upon exhaustion of municipal grievance or non-response within Rule 14(2) period', contactUrlOrEmail: 'https://dpbi.gov.in/complaints' },
        { tier: 3, forum: 'Telecom Disputes Settlement and Appellate Tribunal (TDSAT - Section 29)', filingWindow: 'Within 60 days from an order of the Board', contactUrlOrEmail: 'https://tdsat.gov.in' },
      ],
      reviewingOfficerName: req.officerName || 'Smt. Vaishali Dave',
      reviewingOfficerDesignation: req.officerDesignation || 'Assistant Municipal Commissioner / Legal Custodian',
      issuedAt: new Date().toISOString(),
      sha256Checksum: checksum,
    });
  }

  async function computeBlindIndex(req) {
    await D.delay(200);
    const normalized = String(req.rawValue).trim().toLowerCase();
    const hex = (await D.sha256('govshield-demo-pepper|' + req.identifierType + '|' + normalized)).toUpperCase();
    return { identifierType: req.identifierType, normalized, blindIndexHex: hex, blindIndexBase64: btoa(hex).slice(0, 44) };
  }

  async function declareIncident(req) {
    await D.delay(300);
    const v = window.validateIncidentDrillId(req.incidentId, req.isTabletopDrill);
    const t = new Date();
    return {
      incidentId: v.sanitizedId, isTabletopDrill: req.isTabletopDrill, severity: req.severity, department: req.department,
      detectedAt: t.toISOString(),
      certIn6hDeadline: new Date(t.getTime() + 6 * 3600e3).toISOString(),
      dpbi72hDetailedDeadline: new Date(t.getTime() + 72 * 3600e3).toISOString(),
      statutoryNotices: {
        certIn: 'Category-12 Cyber Incident Report required within 6 hours under IT Act Section 70B',
        boardInitial: "Initial Intimation to Data Protection Board required 'without delay' under Rule 7(2)",
        boardDetailed: 'Detailed Form 1 filing required within 72 hours under Rule 7(3)',
        affectedPrincipals: "Direct intimation to each affected principal required 'without delay' under Rule 7(1) across 6 mandatory content elements",
      },
    };
  }

  window.MockEngine = { classifyChild, generateErasureRefusal, computeBlindIndex, declareIncident };
})();
