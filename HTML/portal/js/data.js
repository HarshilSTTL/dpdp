// ============================================================
// DPDP-GovShield — Sovereign Privacy Governance Platform
// Statutory Basis: Digital Personal Data Protection Act, 2023
// Subordinate Rules: DPDP Rules, 2025 (Notified 13 Nov 2025)
// Phase 1: 13 Nov 2026 (Rule 4 CMs) | Phase 2: 13 May 2027 (Rules 3, 5-16, 22-23)
// ============================================================

// ── Statutory SDF Designation Config (Section 10(1) Agnostic) ─

var SDF_GOVERNANCE_CONFIG = {
  isNotifiedSDF: false, // Default: Standard Urban Local Body Data Fiduciary (Sec 10 not yet notified)
  notifiedAt: null,
  gazetteNotificationRef: "N/A (Pending Central Government Gazette Notification under Sec 10(1))",
  statutoryCeilingStandardInr: 5000000000, // ₹500 Cr (Heads 1, 2, 5 of The Schedule)
  statutoryCeilingSDFInr: 8500000000,      // ₹850 Cr (All 5 heads including Head 4 Sec 10)
  activeCeilingDisplay: "₹500 Crore (Standard ULB Data Fiduciary)",
  dpoStatus: "Appointed (Municipal Data Protection & Compliance Officer)",
  auditorStatus: "Engaged for Annual Privacy Readiness (Voluntary Governance)",
  dpiaStatus: "Proactive Internal Privacy Impact Assessment"
};

// ── Role Definitions & Permissions ──────────────────────────

var ROLES = {
  'super-admin':       { label: 'Super Admin',          category: 'Platform Administration', icon: '⚙️', color: '#6b7a94', pages: ['dashboard','admin','integration'],                                              canEdit: true,  description: 'Platform installation, tenant provisioning, system config' },
  'tenant-admin':      { label: 'Tenant Admin',         category: 'Platform Administration', icon: '🏛️', color: '#6b7a94', pages: ['dashboard','admin','integration'],                                              canEdit: true,  description: 'User management, org settings, SSO configuration' },
  'dpo':               { label: 'Data Protection Officer', category: 'Compliance & DPO Office', icon: '🛡️', color: '#1a3a6b', pages: ['dashboard','consent','rights','breach','inventory','grievance','dpia','retention','integration'], canEdit: true, description: 'Full compliance oversight, board reporting, DPB communications' },
  'compliance-officer':{ label: 'Compliance Officer',   category: 'Compliance & DPO Office', icon: '📋', color: '#234b85', pages: ['dashboard','consent','rights','inventory','grievance','retention','integration'], canEdit: true,  description: 'Consent templates, rights processing, RoPA generation' },
  'privacy-analyst':   { label: 'Privacy Analyst',      category: 'Compliance & DPO Office', icon: '🔍', color: '#2d5fa0', pages: ['dashboard','inventory','dpia'],                                    canEdit: true,  description: 'DPIA authoring, risk assessment, data flow mapping' },
  'dept-head':         { label: 'Department Head',      category: 'Departmental',            icon: '🏢', color: '#ff9800', pages: ['dashboard','consent','rights','inventory','grievance'],             canEdit: false, description: 'Department compliance dashboard, approve escalated requests', department: 'DEP-001' },
  'data-custodian':    { label: 'Data Custodian',       category: 'Departmental',            icon: '📝', color: '#f57c00', pages: ['dashboard','rights'],                                              canEdit: true,  description: 'Process assigned rights requests, update citizen records', department: 'DEP-001' },
  'system-owner':      { label: 'System Owner',         category: 'Departmental',            icon: '💻', color: '#e65100', pages: ['inventory','integration'],                                         canEdit: true,  description: 'Register systems, configure integrations, manage data flows' },
  'ciso':              { label: 'CISO',                 category: 'Security & IT',           icon: '🔒', color: '#d32f2f', pages: ['dashboard','breach'],                                              canEdit: true,  description: 'Security posture, breach severity classification, pen test scheduling' },
  'security-analyst':  { label: 'Security Analyst',     category: 'Security & IT',           icon: '🔎', color: '#f44336', pages: ['breach'],                                                          canEdit: true,  description: 'Incident triage, CERT-In reporting, evidence collection' },
  'it-admin':          { label: 'IT Administrator',     category: 'Security & IT',           icon: '🖥️', color: '#b71c1c', pages: ['admin','integration'],                                             canEdit: true,  description: 'Encryption key management, access control, infrastructure' },
  'citizen':           { label: 'Data Principal',       category: 'External — Citizens',     icon: '👤', color: '#4caf50', pages: ['citizen'],                                                         canEdit: false, description: 'View my data, manage consent, submit rights requests, file grievances', isCitizen: true },
  'guardian':          { label: 'Legal Guardian',       category: 'External — Citizens',     icon: '👨‍👧', color: '#388e3c', pages: ['citizen'],                                                        canEdit: false, description: 'Manage child\'s consent, exercise rights on behalf of minor', isCitizen: true },
  'auditor':           { label: 'Independent Auditor',  category: 'Regulatory & Audit',      icon: '📊', color: '#9c27b0', pages: ['dashboard','consent','rights','breach','inventory','grievance','dpia','retention','integration'], canEdit: false, description: 'Read-only evidence access, audit findings submission', isReadOnly: true },
  'dpb-inspector':     { label: 'DPB Inspector',        category: 'Regulatory & Audit',      icon: '⚖️', color: '#7b1fa2', pages: ['dashboard','consent','rights','breach','inventory','grievance','dpia','retention'], canEdit: false, description: 'Rule 23 & Seventh Schedule scoped inquiry inspection under DPBI order', isReadOnly: true, requiresInquiryGate: true }
};

// ── User Profiles ───────────────────────────────────────────

var USERS = {
  'super-admin':       { name: 'Silver Touch Admin',         designation: 'Platform Administrator',     email: 'admin@silvertouch.com',    avatar: 'SA' },
  'tenant-admin':      { name: 'Shri Amit J. Desai',         designation: 'IT Head / Tenant Admin',     email: 'amit.desai@amc.gov.in',    avatar: 'AD' },
  'dpo':               { name: 'Shri Rajesh M. Patel, IAS',  designation: 'Data Protection Officer',    email: 'dpo@amc.gov.in',           avatar: 'RP' },
  'compliance-officer':{ name: 'Smt. Ritu P. Sharma',        designation: 'Compliance Officer',         email: 'ritu.sharma@amc.gov.in',   avatar: 'RS' },
  'privacy-analyst':   { name: 'Shri Devang K. Nair',        designation: 'Privacy Analyst',            email: 'devang.nair@amc.gov.in',   avatar: 'DN' },
  'dept-head':         { name: 'Shri Suresh B. Joshi',       designation: 'Head — Property Tax Dept',   email: 'suresh.joshi@amc.gov.in',  avatar: 'SJ' },
  'data-custodian':    { name: 'Shri Anil K. Vyas',          designation: 'Data Custodian — Property Tax', email: 'anil.vyas@amc.gov.in',  avatar: 'AV' },
  'system-owner':      { name: 'Shri Hitesh M. Patel',       designation: 'System Owner — e-Nagarpralika', email: 'hitesh.patel@amc.gov.in',avatar: 'HP' },
  'ciso':              { name: 'Smt. Kavita R. Shah',        designation: 'Chief Information Security Officer', email: 'ciso@amc.gov.in',   avatar: 'KS' },
  'security-analyst':  { name: 'Shri Hiren D. Jadeja',       designation: 'Security Analyst',           email: 'hiren.jadeja@amc.gov.in',  avatar: 'HJ' },
  'it-admin':          { name: 'Shri Nikhil S. Raval',       designation: 'IT Administrator',           email: 'nikhil.raval@amc.gov.in',  avatar: 'NR' },
  'citizen':           { name: 'Shri Ramesh K. Patel',       designation: 'Citizen / Data Principal',   email: 'ramesh.patel@gmail.com',   avatar: 'RK', citizenId: 'AMC-CID-890124', tenementNo: 'TEN-NW-2024-89012', waterIndexNo: 'WTR-041289', aadhaarMasked: 'XXXX-XXXX-4523' },
  'guardian':          { name: 'Smt. Anita D. Rana',         designation: 'Legal Guardian',             email: 'anita.rana@gmail.com',     avatar: 'AR', citizenId: 'AMC-CID-224890', aadhaarMasked: 'XXXX-XXXX-2234', childName: 'Master Rohan D. Rana (age 12)', childId: 'AMC-CHD-991204' },
  'auditor':           { name: 'CA Mahesh T. Agarwal',       designation: 'Independent Data Auditor',   email: 'mahesh@agarwalaudit.in',   avatar: 'MA' },
  'dpb-inspector':     { name: 'Shri Vinod G. Mishra',       designation: 'DPB Inspector',              email: 'vinod.mishra@dpb.gov.in',  avatar: 'VM', inquiryOrder: 'INQ-DPBI-2026-0041' }
};

// ── Admin Module Data ───────────────────────────────────────

var ADMIN_DATA = {
  users: [
    { id: 'USR-001', name: 'Shri Rajesh M. Patel, IAS', role: 'dpo', status: 'active', lastLogin: '2026-09-02T08:30:00', mfa: true },
    { id: 'USR-002', name: 'Smt. Ritu P. Sharma', role: 'compliance-officer', status: 'active', lastLogin: '2026-09-02T09:15:00', mfa: true },
    { id: 'USR-003', name: 'Shri Devang K. Nair', role: 'privacy-analyst', status: 'active', lastLogin: '2026-09-01T16:00:00', mfa: true },
    { id: 'USR-004', name: 'Shri Suresh B. Joshi', role: 'dept-head', status: 'active', lastLogin: '2026-09-02T10:00:00', mfa: false },
    { id: 'USR-005', name: 'Shri Anil K. Vyas', role: 'data-custodian', status: 'active', lastLogin: '2026-09-02T07:45:00', mfa: false },
    { id: 'USR-006', name: 'Smt. Kavita R. Shah', role: 'ciso', status: 'active', lastLogin: '2026-09-02T03:00:00', mfa: true },
    { id: 'USR-007', name: 'Shri Hiren D. Jadeja', role: 'security-analyst', status: 'active', lastLogin: '2026-09-02T01:30:00', mfa: true },
    { id: 'USR-008', name: 'Shri Nikhil S. Raval', role: 'it-admin', status: 'active', lastLogin: '2026-09-01T18:00:00', mfa: true },
    { id: 'USR-009', name: 'Shri Hitesh M. Patel', role: 'system-owner', status: 'active', lastLogin: '2026-08-30T14:00:00', mfa: false },
    { id: 'USR-010', name: 'Smt. Meena K. Trivedi', role: 'dept-head', status: 'active', lastLogin: '2026-08-29T11:00:00', mfa: false },
    { id: 'USR-011', name: 'Dr. Alka M. Pandya', role: 'dept-head', status: 'active', lastLogin: '2026-08-28T09:00:00', mfa: false },
    { id: 'USR-012', name: 'CA Mahesh T. Agarwal', role: 'auditor', status: 'active', lastLogin: '2026-08-15T10:00:00', mfa: true },
  ],
  auditLogs: [
    { time: '2026-09-02T12:30:00', user: 'Shri Rajesh M. Patel', action: 'Approved DPB intimation for SIM-DRILL-2026-003 [Drill Specimen]', module: 'Breach', ip: '10.20.30.45' },
    { time: '2026-09-02T11:00:00', user: 'Smt. Ritu P. Sharma', action: 'Generated RoPA report (PDF)', module: 'Inventory', ip: '10.20.30.52' },
    { time: '2026-09-02T09:15:00', user: 'Shri Anil K. Vyas', action: 'Completed correction request RR-2026-0083', module: 'Rights', ip: '10.20.30.67' },
    { time: '2026-09-02T08:30:00', user: 'Smt. Kavita R. Shah', action: 'Classified SIM-DRILL-2026-003 as CRITICAL [Tabletop Drill]', module: 'Breach', ip: '10.20.30.12' },
    { time: '2026-09-01T16:00:00', user: 'Shri Devang K. Nair', action: 'Updated DPIA-2026-003 risk assessment', module: 'DPIA', ip: '10.20.30.55' },
    { time: '2026-09-01T14:00:00', user: 'System', action: 'Consent withdrawal processed for CON-2026-00156', module: 'Consent', ip: 'system' },
    { time: '2026-09-01T10:00:00', user: 'System', action: 'Consent captured CON-2026-00159 via Counter', module: 'Consent', ip: 'system' },
    { time: '2026-08-30T15:10:00', user: 'System', action: 'Consent captured CON-2026-00158 via Web Portal', module: 'Consent', ip: 'system' },
  ],
  systemHealth: { cpu: 34, memory: 62, disk: 45, dbConnections: 28, uptime: '47d 14h 22m' },
  encryptionStatus: { algorithm: 'AES-256-CBC', keyAge: '45 days', nextRotation: '2026-10-15', spiiFieldsEncrypted: 42, totalSpiiFields: 42 }
};

// ── Citizen-Specific Data (for Shri Ramesh K. Patel) ────────

var CITIZEN_DATA = {
  citizenId: "AMC-CID-890124",
  tenementNo: "TEN-NW-2024-89012",
  waterIndexNo: "WTR-041289",
  myConsents: [
    { 
      id: "CON-2026-00145",
      purpose: 'Property tax assessment & municipal record maintenance', 
      system: 'e-Nagarpralika Property Tax Portal (SYS-001)', 
      status: 'active', 
      grantedAt: '2026-07-15T10:30:00', 
      language: 'Gujarati',
      legalGround: 'Section 7(b) — State Function',
      isStatutory: true,
      statutoryAct: 'Gujarat Municipalities Act, 1963 (Section 99)',
      rule5IntimationId: "INT-2026-001",
      standardsCompliant: "Second Schedule Standards 1–7 Compliant"
    },
    { 
      id: "CON-2026-00155",
      purpose: 'GIS property tenement boundary survey', 
      system: 'GIS-based Property Survey System (SYS-002)', 
      status: 'active', 
      grantedAt: '2026-08-25T10:45:00', 
      language: 'Gujarati',
      legalGround: 'Section 7(b) — State Function',
      isStatutory: true,
      statutoryAct: 'Gujarat Town Planning and Urban Development Act',
      rule5IntimationId: "INT-2026-002",
      standardsCompliant: "Second Schedule Standards 1–7 Compliant"
    },
    { 
      id: "CON-2026-00157",
      purpose: 'Property tax online refund processing & voluntary SMS alerts', 
      system: 'Online Payment Gateway (SYS-003)', 
      status: 'active', 
      grantedAt: '2026-08-28T13:20:00', 
      language: 'Gujarati',
      legalGround: 'Section 6 — Consent',
      isStatutory: false
    }
  ],
  myRequests: [
    { id: 'RR-2026-0090', type: 'Access (Sec 11)', status: 'completed', submittedAt: '2026-08-01T09:00:00', completedAt: '2026-08-10T10:00:00', description: 'Complete data access & recipient disclosure request under Section 11(1)' }
  ],
  myData: [
    { field: 'Citizen Municipal ID', value: 'AMC-CID-890124', source: 'Ahmedabad Citizen Registry', legalGround: 'Sec 7(b) State Function' },
    { field: 'Property Tenement No', value: 'TEN-NW-2024-89012', source: 'Property Tax Portal (SYS-001)', legalGround: 'Sec 7(b) State Function' },
    { field: 'Full Legal Name', value: 'Shri Ramesh Kantilal Patel', source: 'Property Tax Portal (SYS-001)', legalGround: 'Sec 7(b) State Function' },
    { field: 'Water Consumer Index', value: 'WTR-041289', source: 'Water Connection Portal (SYS-006)', legalGround: 'Sec 7(b) State Function' },
    { field: 'Mobile Number', value: '+91-98XXX-XX890', source: 'Property Tax Portal', legalGround: 'Sec 6 Consent' },
    { field: 'Email Address', value: 'ramesh.patel@gmail.com', source: 'Property Tax Portal', legalGround: 'Sec 6 Consent' },
    { field: 'Municipal Property Address', value: '12, Shanti Nagar Society, Navrangpura, Ahmedabad - 380009', source: 'Property Tax Portal', legalGround: 'Sec 7(b) State Function' },
    { field: 'PAN Number (Masked)', value: 'XXXXX1234X', source: 'Payment Gateway', legalGround: 'Sec 7(c) Legal Obligation' },
    { field: 'Verified Aadhaar e-KYC Token', value: 'UIDAI-VKYC-2024-8941 (Aadhaar number NOT stored)', source: 'UIDAI Gateway', legalGround: 'Sec 6 Minimised Token' }
  ],
  disclosedRecipients: [
    { recipient: "Gujarat State Election Commission", purpose: "Electoral Roll Tenement Verification", legalBasis: "Section 7(b) State Duty", sharedAt: "2026-01-10" },
    { recipient: "Commercial Tax Department, Govt of Gujarat", purpose: "GST / Commercial Property Alignment", legalBasis: "Section 7(c) Statutory Law", sharedAt: "2026-04-15" },
    { recipient: "State Bank of India (SBI ePay)", purpose: "Online Property Tax Payment Settlement", legalBasis: "Section 6 Consent", sharedAt: "2026-08-28" }
  ],
  nominee: {
    registered: true,
    fullName: "Smt. Savita Ramesh Patel",
    relationship: "Spouse (ધર્મપત્ની / पत्नी)",
    contactMobile: "+91-98XXX-XX891",
    contactEmail: "savita.patel@gmail.com",
    aadhaarMasked: "XXXX-XXXX-9102",
    registeredAt: "2026-08-15T11:30:00Z",
    verificationMethod: "DigiLocker Family ID Attestation",
    nominationToken: "NOM-AMC-2026-00412",
    status: "active",
    statutoryNotice: "Pursuant to Section 14 of the Digital Personal Data Protection Act, 2023, the nominee registered herein shall have the legal authority to exercise all rights under the Act on behalf of the Data Principal in the event of death or medical incapacity."
  }
};

// ── Guardian-Specific Data (for Smt. Anita D. Rana) ─────────

var GUARDIAN_DATA = {
  guardianCitizenId: "AMC-CID-224890",
  childName: "Master Rohan D. Rana",
  childId: "AMC-CHD-991204",
  childConsents: [
    { 
      id: "CON-2026-00150",
      purpose: 'Pediatric vaccination drive participation', 
      system: 'Vaccination Drive Management (SYS-012)', 
      status: 'active', 
      grantedAt: '2026-08-05T08:30:00', 
      childName: 'Master Rohan D. Rana',
      childAge: 12,
      isMinor: true,
      legalGround: 'Section 7(b) — State Function',
      childProtectionLayer: 'Section 9 Child Safeguards (VPC Verified)',
      isStatutory: true,
      statutoryAct: 'National Health Mission & Pediatric Health Directives',
      vpc: {
        verified: true,
        method: "DigiLocker Family ID Linkage",
        token: "VPC-DL-2026-098842",
        guardianName: "Smt. Anita D. Rana",
        guardianCitizenId: "AMC-CID-224890",
        guardianAadhaarMasked: "XXXX-XXXX-2234",
        childAge: 12,
        profilingProhibited: true,
        targetedAdsProhibited: true,
        verifiedAt: "2026-08-05T08:28:10Z",
        sha256Signature: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      }
    }
  ],
  childData: [
    { field: 'Child Municipal ID', value: 'AMC-CHD-991204', source: 'Birth-Death Registry (SYS-004)', minorProtection: 'Protected under Sec 9' },
    { field: 'Child Full Name', value: 'Rohan Dinesh Rana', source: 'Vaccination Drive', minorProtection: 'Protected under Sec 9' },
    { field: 'Date of Birth', value: '15 Mar 2014 (Age 12)', source: 'Birth-Death Registry', minorProtection: 'Protected under Sec 9' },
    { field: 'Vaccination History', value: 'Up to date (MR, DPT Booster, Polio OPV)', source: 'Vaccination Drive (SYS-012)', minorProtection: 'Protected under Sec 9' },
    { field: 'Verified Legal Guardian', value: 'Smt. Anita D. Rana (Mother)', source: 'DigiLocker Family Attestation', minorProtection: 'VPC Verified' }
  ]
};


// ── (Original SAMPLE_DATA below — unchanged from v1) ────────

var SAMPLE_DATA = {

  organization: {
    name: "Ahmedabad Municipal Corporation", code: "AMC-GJ-001", type: "Urban Local Body", state: "Gujarat",
    dpoName: "Shri Rajesh M. Patel, IAS", dpoDesignation: "Data Protection Officer", dpoEmail: "dpo@amc.gov.in", dpoPhone: "+91-79-2539-XXXX",
    ciso: "Smt. Kavita R. Shah", tenantAdmin: "Shri Amit J. Desai"
  },
  departments: [
    { id: "DEP-001", name: "Property Tax", head: "Shri Suresh B. Joshi", systems: 3, dataFields: 28, status: "compliant" },
    { id: "DEP-002", name: "Birth & Death Registration", head: "Smt. Meena K. Trivedi", systems: 2, dataFields: 35, status: "compliant" },
    { id: "DEP-003", name: "Water Supply & Drainage", head: "Shri Dinesh P. Rana", systems: 2, dataFields: 18, status: "partial" },
    { id: "DEP-004", name: "Town Planning & Development", head: "Smt. Neha S. Bhatt", systems: 2, dataFields: 22, status: "partial" },
    { id: "DEP-005", name: "Solid Waste Management", head: "Shri Manoj V. Parmar", systems: 1, dataFields: 12, status: "non-compliant" },
    { id: "DEP-006", name: "Public Health & Sanitation", head: "Dr. Alka M. Pandya", systems: 2, dataFields: 30, status: "compliant" }
  ],
  systems: [
    { id: "SYS-001", name: "e-Nagarpralika Property Tax Portal", department: "DEP-001", type: "Web Application", vendor: "Silver Touch Technologies", dataFields: 15, classification: "SPII", status: "mapped", hostingLocation: "Gujarat State Data Center (SDC), Gandhinagar", datacenterTier: "Tier-III", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256 (HSM)" },
    { id: "SYS-002", name: "GIS-based Property Survey System", department: "DEP-001", type: "GIS Application", vendor: "BISAG-N", dataFields: 8, classification: "PII", status: "mapped", hostingLocation: "BISAG-N High-Security Cluster, Gandhinagar", datacenterTier: "Tier-III", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256" },
    { id: "SYS-003", name: "Online Payment Gateway", department: "DEP-001", type: "Payment System", vendor: "SBI ePay", dataFields: 5, classification: "SPII", status: "mapped", hostingLocation: "SBI Secure Data Center, Navi Mumbai", datacenterTier: "Tier-IV", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256 (FIPS 140-2)" },
    { id: "SYS-004", name: "Birth-Death Registration System", department: "DEP-002", type: "Web Application", vendor: "NIC", dataFields: 22, classification: "SPII", status: "mapped", hostingLocation: "NIC National Data Center, Shastri Park, New Delhi", datacenterTier: "Tier-III", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256 (HSM)" },
    { id: "SYS-005", name: "Hospital MIS", department: "DEP-002", type: "Internal Application", vendor: "In-house", dataFields: 13, classification: "SPII", status: "pending", hostingLocation: "AMC On-Premises Secure Server Room, Danapith", datacenterTier: "Tier-II", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256" },
    { id: "SYS-006", name: "Water Connection Management", department: "DEP-003", type: "Web Application", vendor: "Silver Touch Technologies", dataFields: 10, classification: "PII", status: "mapped", hostingLocation: "Gujarat State Data Center (SDC), Gandhinagar", datacenterTier: "Tier-III", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256" },
    { id: "SYS-007", name: "SCADA Water Distribution", department: "DEP-003", type: "IoT/SCADA", vendor: "L&T", dataFields: 8, classification: "Non-Personal", status: "mapped", hostingLocation: "Kotarpur Water Works Control Center, Ahmedabad", datacenterTier: "Air-Gapped SCADA", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "Proprietary PLC" },
    { id: "SYS-008", name: "Building Permission System (DBPS)", department: "DEP-004", type: "Web Application", vendor: "NIC", dataFields: 14, classification: "PII", status: "pending", hostingLocation: "NIC Meghraj Cloud, Pune", datacenterTier: "Tier-III", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256" },
    { id: "SYS-009", name: "Town Planning GIS", department: "DEP-004", type: "GIS Application", vendor: "BISAG-N", dataFields: 8, classification: "PII", status: "mapped", hostingLocation: "BISAG-N Cloud, Gandhinagar", datacenterTier: "Tier-III", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256" },
    { id: "SYS-010", name: "Swachh Ahmedabad App", department: "DEP-005", type: "Mobile App", vendor: "In-house", dataFields: 12, classification: "PII", status: "not-started", hostingLocation: "Gujarat State Data Center (SDC), Gandhinagar", datacenterTier: "Tier-III", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256" },
    { id: "SYS-011", name: "Public Health Surveillance", department: "DEP-006", type: "Web Application", vendor: "NIC", dataFields: 18, classification: "SPII", status: "mapped", hostingLocation: "NIC Meghraj Cloud, New Delhi", datacenterTier: "Tier-III", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256 (HSM)" },
    { id: "SYS-012", name: "Vaccination Drive Management", department: "DEP-006", type: "Web Application", vendor: "CoWIN-local", dataFields: 12, classification: "SPII", status: "pending", hostingLocation: "NIC CoWIN Cloud Infrastructure, New Delhi", datacenterTier: "Tier-IV", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256 (FIPS 140-2)" },
    { id: "SYS-013", name: "Citizen Services & Certification Portal (e-Services)", department: "DEP-001", type: "Web Application", vendor: "Silver Touch Technologies", dataFields: 16, classification: "SPII", status: "mapped", hostingLocation: "Gujarat State Data Center (SDC), Gandhinagar", datacenterTier: "Tier-III", country: "India", meityEmpanelled: true, crossBorderTransfer: "PROHIBITED", encryptionAtRest: "AES-256 (HSM)" }
  ],
  dataFields: [
    { id: "DF-001", name: "Property Owner Name", system: "SYS-001", classification: "PII", sensitivity: "Medium", purpose: "Property tax assessment", retention: "Permanent", legalBasis: "Legal Obligation" },
    { id: "DF-002", name: "Aadhaar Number", system: "SYS-001", classification: "SPII", sensitivity: "High", purpose: "Identity verification", retention: "Duration of ownership", legalBasis: "Consent" },
    { id: "DF-003", name: "Mobile Number", system: "SYS-001", classification: "PII", sensitivity: "Medium", purpose: "Communication, OTP verification", retention: "Duration of ownership", legalBasis: "Consent" },
    { id: "DF-004", name: "Email Address", system: "SYS-001", classification: "PII", sensitivity: "Medium", purpose: "Tax receipts, notices", retention: "Duration of ownership", legalBasis: "Consent" },
    { id: "DF-005", name: "PAN Number", system: "SYS-001", classification: "SPII", sensitivity: "High", purpose: "High-value transactions", retention: "7 years", legalBasis: "Legal Obligation" },
    { id: "DF-006", name: "Bank Account Number", system: "SYS-003", classification: "SPII", sensitivity: "Critical", purpose: "Refund processing", retention: "7 years", legalBasis: "Consent" },
    { id: "DF-007", name: "Property Address", system: "SYS-001", classification: "PII", sensitivity: "Low", purpose: "Tax assessment", retention: "Permanent", legalBasis: "Legal Obligation" },
    { id: "DF-008", name: "Child's Name", system: "SYS-004", classification: "PII", sensitivity: "High", purpose: "Birth certificate issuance", retention: "Permanent", legalBasis: "Legal Obligation" },
    { id: "DF-009", name: "Mother's Name", system: "SYS-004", classification: "PII", sensitivity: "Medium", purpose: "Birth certificate issuance", retention: "Permanent", legalBasis: "Legal Obligation" },
    { id: "DF-010", name: "Father's Name", system: "SYS-004", classification: "PII", sensitivity: "Medium", purpose: "Birth certificate issuance", retention: "Permanent", legalBasis: "Legal Obligation" },
    { id: "DF-011", name: "Cause of Death", system: "SYS-004", classification: "SPII", sensitivity: "High", purpose: "Death certificate, public health", retention: "Permanent", legalBasis: "Legal Obligation" },
    { id: "DF-012", name: "Patient Health Records", system: "SYS-011", classification: "SPII", sensitivity: "Critical", purpose: "Public health surveillance", retention: "10 years", legalBasis: "State Function" },
    { id: "DF-013", name: "Vaccination Status", system: "SYS-012", classification: "SPII", sensitivity: "High", purpose: "Vaccination tracking", retention: "Lifetime", legalBasis: "State Function" },
    { id: "DF-014", name: "GPS Location", system: "SYS-010", classification: "PII", sensitivity: "Medium", purpose: "Waste management", retention: "1 year", legalBasis: "Consent" },
    { id: "DF-015", name: "Building Applicant Name", system: "SYS-008", classification: "PII", sensitivity: "Medium", purpose: "Building permission", retention: "Life of building", legalBasis: "Legal Obligation" }
  ],
  consentRecords: [
    { id: "CON-2026-00145", principalName: "Shri Ramesh K. Patel", principalId: "AMC-CID-890124", purpose: "Property tax assessment & municipal record maintenance", system: "SYS-001", status: "active", grantedAt: "2026-07-15T10:30:00", noticeVersion: "v2.5", language: "Gujarati", channel: "Web Portal", legalGround: "Section 7(b) — State Function", isStatutory: true, statutoryAct: "Gujarat Municipalities Act, 1963 (Section 99)", rule5IntimationId: "INT-2026-001", standardsCompliant: "Second Schedule Standards 1–7" },
    { id: "CON-2026-00146", principalName: "Smt. Bhavna R. Shah", principalId: "AMC-CID-781290", purpose: "Birth certificate registration & extract issuance", system: "SYS-004", status: "active", grantedAt: "2026-07-16T09:15:00", noticeVersion: "v1.4", language: "Hindi", channel: "Counter", legalGround: "Section 7(b) — State Function", isStatutory: true, statutoryAct: "Registration of Births & Deaths Act, 1969", rule5IntimationId: "INT-2026-002", standardsCompliant: "Second Schedule Standards 1–7" },
    { id: "CON-2026-00147", principalName: "Shri Vikram S. Mehta", principalId: "AMC-CID-336712", purpose: "Online property tax payment convenience & voluntary SMS", system: "SYS-003", status: "withdrawn", grantedAt: "2026-06-01T14:00:00", withdrawnAt: "2026-08-20T11:45:00", noticeVersion: "v2.0", language: "English", channel: "Web Portal", legalGround: "Section 6 — Consent", isStatutory: false },
    { id: "CON-2026-00148", principalName: "Smt. Priya N. Joshi", principalId: "AMC-CID-554201", purpose: "Water connection metering & utility billing", system: "SYS-006", status: "active", grantedAt: "2026-07-20T16:30:00", noticeVersion: "v1.2", language: "Gujarati", channel: "Web Portal", legalGround: "Section 7(b) — State Function", isStatutory: true, statutoryAct: "Bombay Provincial Municipal Corporations Act", rule5IntimationId: "INT-2026-003", standardsCompliant: "Second Schedule Standards 1–7" },
    { id: "CON-2026-00149", principalName: "Shri Kiran B. Trivedi", principalId: "AMC-CID-789123", purpose: "Building scrutiny permit application (GDCR)", system: "SYS-008", status: "active", grantedAt: "2026-08-01T10:00:00", noticeVersion: "v1.0", language: "English", channel: "Web Portal", legalGround: "Section 7(b) — State Function", isStatutory: true, statutoryAct: "General Development Control Regulations (GDCR)" },
    { id: "CON-2026-00150", principalName: "Smt. Anita D. Rana (Legal Guardian)", principalId: "AMC-CID-224890", childId: "AMC-CHD-991204", purpose: "Vaccination drive (Child Immunization)", system: "SYS-012", status: "active", grantedAt: "2026-08-05T08:30:00", noticeVersion: "v1.2", language: "Hindi", channel: "Mobile App", legalGround: "Section 7(b) — State Function", childProtectionLayer: "Section 9 Child Safeguards (VPC Verified)", isStatutory: true, isMinor: true, childAge: 12, childName: "Master Rohan D. Rana", vpc: { verified: true, method: "DigiLocker Family Linkage", token: "VPC-DL-2026-098842", guardianName: "Smt. Anita D. Rana", guardianCitizenId: "AMC-CID-224890", guardianAadhaarMasked: "XXXX-XXXX-2234", childAge: 12, profilingProhibited: true, targetedAdsProhibited: true, verifiedAt: "2026-08-05T08:28:10Z" } },
    { id: "CON-2026-00151", principalName: "Shri Deepak M. Parmar", principalId: "AMC-CID-667812", purpose: "Sanitation complaint tracking & app feedback", system: "SYS-010", status: "active", grantedAt: "2026-08-10T12:15:00", noticeVersion: "v1.0", language: "Gujarati", channel: "Mobile App", legalGround: "Section 6 — Consent", isStatutory: false },
    { id: "CON-2026-00152", principalName: "Smt. Rekha V. Pandya", principalId: "AMC-CID-119045", purpose: "Annual property tax assessment verification", system: "SYS-001", status: "expired", grantedAt: "2025-08-12T09:00:00", noticeVersion: "v1.8", language: "Gujarati", channel: "Counter", legalGround: "Section 7(b) — State Function", isStatutory: true, statutoryAct: "Gujarat Municipalities Act, 1963" },
    { id: "CON-2026-00153", principalName: "Shri Nilesh H. Bhatt", principalId: "AMC-CID-445690", purpose: "Death certificate legal extract registration", system: "SYS-004", status: "active", grantedAt: "2026-08-18T14:30:00", noticeVersion: "v1.3", language: "Hindi", channel: "Counter", legalGround: "Section 7(b) — State Function", isStatutory: true, statutoryAct: "Registration of Births & Deaths Act, 1969" },
    { id: "CON-2026-00154", principalName: "Smt. Jaya P. Desai", principalId: "AMC-CID-992314", purpose: "Public health urban epidemic cluster surveillance", system: "SYS-011", status: "active", grantedAt: "2026-08-22T11:00:00", noticeVersion: "v1.0", language: "English", channel: "Hospital Visit", legalGround: "Section 7(e) — Public Health Threat", isStatutory: true, statutoryAct: "Epidemic Diseases Act, 1897" },
    { id: "CON-2026-00155", principalName: "Shri Arun G. Solanki", principalId: "AMC-CID-771234", purpose: "GIS municipal property boundary survey", system: "SYS-002", status: "active", grantedAt: "2026-08-25T10:45:00", noticeVersion: "v1.1", language: "Gujarati", channel: "Field Visit", legalGround: "Section 7(b) — State Function", isStatutory: true, statutoryAct: "Gujarat Town Planning Act" },
    { id: "CON-2026-00156", principalName: "Smt. Usha T. Modi", principalId: "AMC-CID-338812", purpose: "Water billing SMS & voluntary alerts", system: "SYS-006", status: "withdrawn", grantedAt: "2026-05-10T09:30:00", withdrawnAt: "2026-08-28T16:00:00", noticeVersion: "v1.0", language: "Hindi", channel: "Web Portal", legalGround: "Section 6 — Consent", isStatutory: false },
    { id: "CON-2026-00157", principalName: "Shri Prakash J. Vaghela", principalId: "AMC-CID-550189", purpose: "Property tax direct refund electronic credit", system: "SYS-003", status: "active", grantedAt: "2026-08-28T13:20:00", noticeVersion: "v2.1", language: "Gujarati", channel: "Web Portal", legalGround: "Section 6 — Consent", isStatutory: false },
    { id: "CON-2026-00158", principalName: "Smt. Hetal K. Raval", principalId: "AMC-CID-884512", purpose: "Building permission scrutiny SMS alerts", system: "SYS-008", status: "active", grantedAt: "2026-08-30T15:10:00", noticeVersion: "v1.0", language: "English", channel: "Web Portal", legalGround: "Section 6 — Consent", isStatutory: false },
    { id: "CON-2026-00159", principalName: "Shri Jayesh R. Chauhan", principalId: "AMC-CID-226745", purpose: "Birth certificate registration extract", system: "SYS-004", status: "active", grantedAt: "2026-09-01T10:00:00", noticeVersion: "v1.3", language: "Gujarati", channel: "Counter", legalGround: "Section 7(b) — State Function", isStatutory: true, statutoryAct: "Registration of Births & Deaths Act, 1969" }
  ],
  rightsRequests: [
    { id: "RR-2026-0081", principalName: "Smt. Bhavna R. Shah", type: "Access (Sec 11)", department: "Birth & Death Registration", deptId: "DEP-002", status: "completed", submittedAt: "2026-07-20T09:00:00", slaPublishedTargetDays: 21, slaDeadline: "2026-08-10T09:00:00", completedAt: "2026-07-28T14:30:00", assignedTo: "Shri Anil K. Vyas", description: "Request to access all personal data & recipient disclosures held in Birth-Death System" },
    { id: "RR-2026-0082", principalName: "Shri Vikram S. Mehta", type: "Erasure (Sec 12)", department: "Property Tax", deptId: "DEP-001", status: "on-hold", submittedAt: "2026-08-01T10:30:00", slaPublishedTargetDays: 30, slaDeadline: "2026-08-31T10:30:00", assignedTo: "Smt. Ritu P. Sharma", description: "Erase payment history — property sold", holdReason: "Section 17(4) / Income Tax Act — 7-year statutory retention" },
    { id: "RR-2026-0083", principalName: "Smt. Priya N. Joshi", type: "Correction (Sec 12)", department: "Water Supply & Drainage", deptId: "DEP-003", status: "in-progress", submittedAt: "2026-08-10T11:00:00", slaPublishedTargetDays: 15, slaDeadline: "2026-08-25T11:00:00", assignedTo: "Shri Dinesh P. Rana", description: "Incorrect name spelling — 'Priyanka' should be 'Priya'" },
    { id: "RR-2026-0084", principalName: "Shri Deepak M. Parmar", type: "Access (Sec 11)", department: "Solid Waste Management", deptId: "DEP-005", status: "pending", submittedAt: "2026-08-22T14:00:00", slaPublishedTargetDays: 21, slaDeadline: "2026-09-12T14:00:00", assignedTo: null, description: "Access all complaint data from Swachh Ahmedabad App" },
    { id: "RR-2026-0085", principalName: "Smt. Rekha V. Pandya", type: "Erasure (Sec 12)", department: "Property Tax", deptId: "DEP-001", status: "completed", submittedAt: "2026-07-05T09:30:00", slaPublishedTargetDays: 30, slaDeadline: "2026-08-04T09:30:00", completedAt: "2026-07-30T16:00:00", assignedTo: "Smt. Ritu P. Sharma", description: "Erasure after voluntary SMS consent withdrawal — no legal hold" },
    { id: "RR-2026-0086", principalName: "Shri Arun G. Solanki", type: "Correction (Sec 12)", department: "Property Tax", deptId: "DEP-001", status: "completed", submittedAt: "2026-08-05T10:00:00", slaPublishedTargetDays: 15, slaDeadline: "2026-08-20T10:00:00", completedAt: "2026-08-12T11:30:00", assignedTo: "Shri Anil K. Vyas", description: "Father's name incorrectly recorded in GIS survey data" },
    { id: "RR-2026-0087", principalName: "Smt. Anita D. Rana", type: "Access (Sec 11)", department: "Public Health & Sanitation", deptId: "DEP-006", status: "in-progress", submittedAt: "2026-08-25T08:00:00", slaPublishedTargetDays: 21, slaDeadline: "2026-09-15T08:00:00", assignedTo: "Dr. Sanjay R. Patel", description: "Access pediatric vaccination records" },
    { id: "RR-2026-0088", principalName: "Shri Nilesh H. Bhatt", type: "Grievance (Sec 13)", department: "Birth & Death Registration", deptId: "DEP-002", status: "escalated", submittedAt: "2026-08-15T13:00:00", slaPublishedTargetDays: 30, slaDeadline: "2026-09-14T13:00:00", assignedTo: "DPO Office", description: "Death certificate data shared with insurance company without consent", escalationLevel: 3 },
    { id: "RR-2026-0089", principalName: "Smt. Jaya P. Desai", type: "Correction (Sec 12)", department: "Public Health & Sanitation", deptId: "DEP-006", status: "pending", submittedAt: "2026-08-28T15:00:00", slaPublishedTargetDays: 15, slaDeadline: "2026-09-12T15:00:00", assignedTo: null, description: "Incorrect blood group recorded in hospital file" },
    { id: "RR-2026-0090", principalName: "Shri Ramesh K. Patel", type: "Access (Sec 11)", department: "Property Tax", deptId: "DEP-001", status: "completed", submittedAt: "2026-08-01T09:00:00", slaPublishedTargetDays: 21, slaDeadline: "2026-08-22T09:00:00", completedAt: "2026-08-10T10:00:00", assignedTo: "Smt. Ritu P. Sharma", description: "Complete data access & third-party sharing disclosures" },
    { id: "RR-2026-0091", principalName: "Smt. Hetal K. Raval", type: "Nomination (Sec 14)", department: "Town Planning & Development", deptId: "DEP-004", status: "pending", submittedAt: "2026-09-01T10:00:00", slaPublishedTargetDays: 15, slaDeadline: "2026-09-16T10:00:00", assignedTo: null, description: "Nominate spouse for municipal property rights proxy" },
    { id: "RR-2026-0092", principalName: "Shri Jayesh R. Chauhan", type: "Consent Withdrawal", department: "Birth & Death Registration", deptId: "DEP-002", status: "in-progress", submittedAt: "2026-09-01T14:00:00", slaPublishedTargetDays: 1, slaDeadline: "2026-09-02T14:00:00", assignedTo: "System (Automated)", description: "Withdrawal of voluntary consent for SMS notifications" }
  ],
  breachIncidents: [
    { id: "SIM-DRILL-2026-003", title: "[CYBER DRILL SIMULATION] Tabletop Exercise: Birth-Death Registry API Access Simulation", severity: "critical", status: "active", isTabletopDrill: true, detectedAt: "2026-09-01T22:15:00", detectedBy: "SIEM Alert (Simulated)", description: "⚠️ TABLETOP CYBER DRILL SPECIMEN — NOT A REAL INCIDENT. Synthetic exercise testing CERT-In 6-hour reporting and DPBI Form 1 dual-clock workflows.", affectedSystem: "SYS-004", affectedDepartment: "Birth & Death Registration", estimatedPrincipals: 12000, dataCategories: ["Name","Date of Birth","Parent Names","Masked Municipal CID"], certInReportedAt: "2026-09-02T03:45:00", dpbIntimatedAt: "2026-09-02T04:00:00", dpbDetailedDue: "2026-09-03T22:15:00", principalsNotified: false,
      containmentActions: ["API key revoked","IP blocked at firewall","Affected endpoints disabled","Forensic image captured"],
      timelineEvents: [
        { time: "2026-09-01T22:15:00", event: "[DRILL] SIEM alert triggered — simulated bulk export anomaly", actor: "System" },
        { time: "2026-09-01T22:30:00", event: "[DRILL] Security Analyst acknowledges alert", actor: "Shri Hiren Jadeja" },
        { time: "2026-09-01T23:00:00", event: "[DRILL] Severity classified as CRITICAL", actor: "Shri Hiren Jadeja" },
        { time: "2026-09-01T23:15:00", event: "[DRILL] API key revoked, IP blocked", actor: "IT Admin" },
        { time: "2026-09-02T02:00:00", event: "[DRILL] CISO briefed on tabletop simulation", actor: "Smt. Kavita R. Shah" },
        { time: "2026-09-02T03:45:00", event: "[DRILL] CERT-In report draft submitted (under 6h statutory window)", actor: "Security Team" },
        { time: "2026-09-02T04:00:00", event: "[DRILL] DPB initial intimation sent without delay", actor: "DPO Office" },
        { time: "2026-09-02T08:00:00", event: "[DRILL] Impact assessment commenced", actor: "Privacy Analyst" }
      ] },
    { id: "BRI-2026-002", title: "IDOR Vulnerability — Property Tax Portal", severity: "high", status: "resolved", detectedAt: "2026-08-10T14:30:00", detectedBy: "Citizen complaint", description: "Receipts visible via URL manipulation. PAN numbers exposed.", affectedSystem: "SYS-001", affectedDepartment: "Property Tax", estimatedPrincipals: 340, dataCategories: ["Name","PAN","Payment Amount"], certInReportedAt: "2026-08-10T18:00:00", dpbIntimatedAt: "2026-08-10T18:30:00", dpbDetailedAt: "2026-08-12T10:00:00", principalsNotified: true, resolvedAt: "2026-08-15T16:00:00", rootCause: "IDOR — API lacked authorization check", remediation: "Auth middleware added, all endpoints audited", timelineEvents: [] },
    { id: "BRI-2026-001", title: "Laptop Theft — Health Dept Field Worker", severity: "medium", status: "resolved", detectedAt: "2026-06-22T09:00:00", detectedBy: "Field worker report", description: "Laptop with vaccination data stolen. FDE enabled.", affectedSystem: "SYS-012", affectedDepartment: "Public Health & Sanitation", estimatedPrincipals: 850, dataCategories: ["Name","Vaccination Status","Mobile"], certInReportedAt: "2026-06-22T14:00:00", dpbIntimatedAt: "2026-06-22T15:00:00", dpbDetailedAt: "2026-06-24T08:00:00", principalsNotified: true, resolvedAt: "2026-07-05T12:00:00", rootCause: "Physical security lapse", remediation: "Remote wipe deployed, field worker training", timelineEvents: [] }
  ],
  grievances: [
    { id: "GRV-2026-041", principalName: "Shri Nilesh H. Bhatt", subject: "Unauthorized sharing of death certificate data with insurance company", department: "Birth & Death Registration", deptId: "DEP-002", status: "escalated", level: 3, submittedAt: "2026-08-15T13:00:00", rule14CeilingDays: 90, publishedSlaDays: 30, slaDeadline: "2026-09-14T13:00:00", handler: "DPO Office", category: "Unauthorized Sharing" },
    { id: "GRV-2026-042", principalName: "Smt. Usha T. Modi", subject: "Unable to withdraw consent on Water Supply portal", department: "Water Supply & Drainage", deptId: "DEP-003", status: "in-progress", level: 1, submittedAt: "2026-08-25T10:00:00", rule14CeilingDays: 90, publishedSlaDays: 30, slaDeadline: "2026-09-24T10:00:00", handler: "Shri Dinesh P. Rana", category: "Consent Issues" },
    { id: "GRV-2026-043", principalName: "Shri Prakash J. Vaghela", subject: "Notice in wrong language dialect", department: "Property Tax", deptId: "DEP-001", status: "resolved", level: 1, submittedAt: "2026-08-10T09:00:00", rule14CeilingDays: 90, publishedSlaDays: 30, slaDeadline: "2026-09-09T09:00:00", resolvedAt: "2026-08-18T11:00:00", handler: "Smt. Ritu P. Sharma", category: "Notice Quality" },
    { id: "GRV-2026-044", principalName: "Smt. Anita D. Rana", subject: "Health data accessed by unauthorized personnel", department: "Public Health & Sanitation", deptId: "DEP-006", status: "in-progress", level: 2, submittedAt: "2026-08-20T14:00:00", rule14CeilingDays: 90, publishedSlaDays: 30, slaDeadline: "2026-09-19T14:00:00", handler: "Compliance Officer", category: "Unauthorized Access" },
    { id: "GRV-2026-045", principalName: "Shri Ramesh K. Patel", subject: "Delay in access request response", department: "Property Tax", deptId: "DEP-001", status: "resolved", level: 1, submittedAt: "2026-08-05T11:00:00", rule14CeilingDays: 90, publishedSlaDays: 30, slaDeadline: "2026-09-04T11:00:00", resolvedAt: "2026-08-12T16:00:00", handler: "Smt. Ritu P. Sharma", category: "SLA Breach" },
    { id: "GRV-2026-046", principalName: "Smt. Hetal K. Raval", subject: "Building scrutiny consent taken without notice in Gujarati", department: "Town Planning & Development", deptId: "DEP-004", status: "pending", level: 1, submittedAt: "2026-08-30T10:00:00", rule14CeilingDays: 90, publishedSlaDays: 30, slaDeadline: "2026-09-29T10:00:00", handler: null, category: "Notice Quality" },
    { id: "GRV-2026-047", principalName: "Shri Kiran B. Trivedi", subject: "Data not erased after building permission was denied", department: "Town Planning & Development", deptId: "DEP-004", status: "pending", level: 1, submittedAt: "2026-09-01T09:00:00", rule14CeilingDays: 90, publishedSlaDays: 30, slaDeadline: "2026-10-01T09:00:00", handler: null, category: "Retention Issues" },
    { id: "GRV-2026-048", principalName: "Smt. Jaya P. Desai", subject: "Wrong vaccination record linked to health identifier", department: "Public Health & Sanitation", deptId: "DEP-006", status: "in-progress", level: 1, submittedAt: "2026-08-28T08:30:00", rule14CeilingDays: 90, publishedSlaDays: 30, slaDeadline: "2026-09-27T08:30:00", handler: "Dr. Sanjay R. Patel", category: "Data Accuracy" }
  ],
  dpiaRecords: [
    { id: "DPIA-2026-001", title: "Property Tax — Aadhaar Tokenization Verification", system: "SYS-001", status: "approved", riskLevel: "high", initiatedAt: "2026-06-01", approvedAt: "2026-07-15", nextReviewAt: "2027-07-15", analyst: "Privacy Analyst", statutoryBasis: "Section 10(2)(c) Periodic Review", independentAuditor: "CA Mahesh T. Agarwal (Sec 10(2)(b))", risks: 4, mitigations: 4 },
    { id: "DPIA-2026-002", title: "Birth-Death — High-Volume Registration Core", system: "SYS-004", status: "approved", riskLevel: "high", initiatedAt: "2026-06-15", approvedAt: "2026-08-01", nextReviewAt: "2027-08-01", analyst: "Privacy Analyst", statutoryBasis: "Section 10(2)(c) Periodic Review", independentAuditor: "CA Mahesh T. Agarwal (Sec 10(2)(b))", risks: 5, mitigations: 5 },
    { id: "DPIA-2026-003", title: "Health Surveillance — Automated Risk Scoring & Containment AI", system: "SYS-011", status: "in-review", riskLevel: "critical", initiatedAt: "2026-08-01", analyst: "Privacy Analyst", statutoryBasis: "Rule 13(3) Algorithmic Due Diligence", algorithmicDueDiligence: true, risks: 7, mitigations: 5 },
    { id: "DPIA-2026-004", title: "Swachh App — Fleet GPS Ward Tracking", system: "SYS-010", status: "draft", riskLevel: "medium", initiatedAt: "2026-08-20", analyst: "Privacy Analyst", statutoryBasis: "Proactive Risk Assessment", risks: 3, mitigations: 1 }
  ],
  retentionPolicies: [
    { id: "RET-001", dataCategory: "Property Tax Records", department: "Property Tax", retentionPeriod: "Permanent", legalBasis: "Gujarat Municipalities Act", postExpiryAction: "Immutable Preservation", status: "active" },
    { id: "RET-002", dataCategory: "Payment / Financial Data", department: "All", retentionPeriod: "7 years", legalBasis: "Income Tax Act", postExpiryAction: "Anonymize", status: "active" },
    { id: "RET-003", dataCategory: "Birth & Death Certificates", department: "Birth & Death Registration", retentionPeriod: "Permanent", legalBasis: "RBD Act", postExpiryAction: "Immutable Preservation", status: "active" },
    { id: "RET-004", dataCategory: "Water Connection Data", department: "Water Supply & Drainage", retentionPeriod: "Duration + 3 years", legalBasis: "Municipal Act", postExpiryAction: "Erase", status: "active" },
    { id: "RET-005", dataCategory: "Complaint Data", department: "Solid Waste Management", retentionPeriod: "1 year", legalBasis: "Consent", postExpiryAction: "Erase", status: "active" },
    { id: "RET-006", dataCategory: "Health Surveillance Data", department: "Public Health", retentionPeriod: "10 years", legalBasis: "Epidemic Diseases Act", postExpiryAction: "Anonymize", status: "active" },
    { id: "RET-007", dataCategory: "Building Permission Data", department: "Town Planning", retentionPeriod: "Life of building + 5y", legalBasis: "GDCR", postExpiryAction: "Archive", status: "active" },
    { id: "RET-008", dataCategory: "Vaccination Records", department: "Public Health", retentionPeriod: "Lifetime", legalBasis: "State Function", postExpiryAction: "Immutable Preservation", status: "active" }
  ],
  complianceKPIs: {
    statutoryReadinessScore: 84, // Scored directly against DPDP Act obligations
    iso27701BenchmarkCrosswalk: 78, // Separate voluntary PIMS cross-walk
    consentCoverage: 87,
    rightsRequestSLA: 92,
    activeBreaches: 1,
    dpiaCompletion: 75,
    grievancesPending: 4,
    auditReadiness: 72,
    dataInventoryCompletion: 83,
    noticesCurrent: 10,
    noticesTotal: 12,
    totalConsentRecords: 24567,
    activeConsents: 21340,
    withdrawnConsents: 1892,
    expiredConsents: 1335,
    totalRightsRequests: 92,
    completedRights: 71,
    pendingRights: 12,
    overdueRights: 3
  },
  monthlyTrends: { labels: ["Apr","May","Jun","Jul","Aug","Sep"], consentsGranted: [3200,3800,4100,4500,5200,3700], consentsWithdrawn: [180,210,290,320,410,482], rightsRequests: [8,12,15,18,24,15], grievances: [3,5,4,6,8,4] },
  recentActivity: [
    { time: "2026-09-02T08:00:00", type: "breach", message: "[DRILL] Rule 13(3) algorithmic impact simulation commenced for SIM-DRILL-2026-003", actor: "Privacy Analyst", severity: "critical" },
    { time: "2026-09-02T04:00:00", type: "breach", message: "[DRILL] DPB initial intimation dispatched for SIM-DRILL-2026-003", actor: "DPO Office", severity: "critical" },
    { time: "2026-09-02T03:45:00", type: "breach", message: "[DRILL] CERT-In report draft prepared for SIM-DRILL-2026-003 (5h 45m from discovery)", actor: "Security Team", severity: "critical" },
    { time: "2026-09-01T22:15:00", type: "breach", message: "[DRILL] Simulation alarm triggered — Birth-Death Registry API leak drill", actor: "System (SIEM)", severity: "critical" },
    { time: "2026-09-01T14:00:00", type: "rights", message: "Consent withdrawal request by Shri Jayesh R. Chauhan", actor: "Citizen", severity: "normal" },
    { time: "2026-09-01T10:00:00", type: "consent", message: "New consent captured — CON-2026-00159", actor: "System", severity: "normal" },
    { time: "2026-09-01T09:00:00", type: "grievance", message: "New grievance logged under Rule 14(2) — Retention dispute", actor: "Shri Kiran B. Trivedi", severity: "normal" },
    { time: "2026-08-30T15:10:00", type: "consent", message: "Consent captured CON-2026-00158", actor: "System", severity: "normal" },
    { time: "2026-08-28T16:00:00", type: "consent", message: "Consent withdrawn by Smt. Usha T. Modi", actor: "Citizen", severity: "warning" }
  ]
};

// ── Pre-Commencement Consent Manager Sandbox Testbenches (Section 6(7) & Rule 4) ──
// STATUTORY NOTICE: Registration of Consent Managers under Rule 4 commences on 13 November 2026.
// As of current date, no entities are registered with the Data Protection Board of India.
// The entries below represent simulated technical testbenches for interoperability testing only.

var CONSENT_MANAGERS = [
  {
    id: "TB-CM-SPECIMEN-01",
    name: "Simulated CM Testbench Alpha (Open Protocol Specimen)",
    dpbiRegNo: "REGISTRATION_NOT_COMMENCED (Rule 4 commences 13 Nov 2026)",
    status: "sandbox_specimen",
    endpoint: "https://sandbox-cm-alpha.amc.gov.in/v1/consent-bridge",
    latencyMs: 42,
    lastSync: "2026-09-02T13:20:00Z",
    syncedConsents: 0,
    simulatedTestTokens: 489,
    netWorthVerified: "Pending Rule 4 Commencement (₹2 Cr threshold)",
    encryption: "mTLS 1.3 + AES-256 + ECDSA Signatures (Draft MeitY Spec)",
    supportedLanguages: 22,
    syncCadence: "Simulated Webhook / Hourly Batch"
  },
  {
    id: "TB-CM-SPECIMEN-02",
    name: "Simulated CM Testbench Beta (Interoperability Pilot Specimen)",
    dpbiRegNo: "REGISTRATION_NOT_COMMENCED (Rule 4 commences 13 Nov 2026)",
    status: "sandbox_specimen",
    endpoint: "https://sandbox-cm-beta.amc.gov.in/dpdp/v2",
    latencyMs: 38,
    lastSync: "2026-09-02T13:35:00Z",
    syncedConsents: 0,
    simulatedTestTokens: 612,
    netWorthVerified: "Pending Rule 4 Commencement (₹2 Cr threshold)",
    encryption: "mTLS 1.3 + RSA-4096 + SHA-256",
    supportedLanguages: 22,
    syncCadence: "Simulated Event Stream"
  },
  {
    id: "TB-CM-SPECIMEN-03",
    name: "Simulated CM Testbench Gamma (Gov-Stack Specimen)",
    dpbiRegNo: "REGISTRATION_NOT_COMMENCED (Rule 4 commences 13 Nov 2026)",
    status: "sandbox_specimen",
    endpoint: "https://sandbox-cm-gamma.amc.gov.in/api/v1",
    latencyMs: 55,
    lastSync: "2026-09-02T12:00:00Z",
    syncedConsents: 0,
    simulatedTestTokens: 147,
    netWorthVerified: "Pending Rule 4 Commencement (Public Entity Specimen)",
    encryption: "mTLS 1.3 + National PKI",
    supportedLanguages: 22,
    syncCadence: "Nightly Batch Test"
  }
];

// ── Statutory Penalty Exposure & Legal Defense Register (Section 33 & The Schedule) ─

var PENALTY_SCHEDULE = {
  summary: {
    statutoryTitle: "Statutory Penalty Exposure & Legal Defense Register",
    statutoryBasis: "The Schedule to the DPDP Act, 2023 read with Section 33(2) Factors",
    perContraventionCeilingDisplay: "Up to ₹250 Crore / contravention (The Schedule)",
    get sdfLiabilityStatus() {
      return (typeof SDF_GOVERNANCE_CONFIG !== 'undefined' && SDF_GOVERNANCE_CONFIG.isNotifiedSDF) 
        ? "SDF Designated (Section 10 Penalties Active)" 
        : "Standard ULB Fiduciary (Section 10 Penalties Inactive pending Sec 10(1) notification)";
    },
    activeDrillScenarios: 1,
    activeDrillRef: "SIM-DRILL-2026-003 (Tabletop Incident Simulation)",
    documentedSec33Factors: 4,
    defensePosture: "DOCUMENTED STATUTORY DEFENSE: Comprehensive mitigating record under Section 33(2) compiled for tabletop simulation SIM-DRILL-2026-003.",
    appealsTribunal: "Telecom Disputes Settlement and Appellate Tribunal (TDSAT) per Section 29"
  },
  categories: [
    {
      key: "safeguard_failure",
      section: "The Schedule, Head 1 (Section 8(4))",
      title: "Breach in observing obligation of reasonable security safeguards",
      statutoryMaxDisplay: "Up to ₹250 Crore per contravention",
      activeIncidents: 1,
      incidentRef: "SIM-DRILL-2026-003 [Tabletop Simulation Drill — SYS-004]",
      affectedPrincipals: 12000,
      sec33Factors: [
        { factor: "Sec 33(2)(e) — Mitigating Action Taken", evidence: "Compromised API token revoked within 45 mins; perimeter IP blocklist applied; forensic capture executed." },
        { factor: "Sec 33(2)(b) — Type & Nature of Data", evidence: "Core database at-rest encryption verified intact (AES-256 HSM); zero modification of primary civil records." },
        { factor: "Sec 33(2)(c) — Repetitive Nature", evidence: "First recorded security event on SYS-004; no history of repetitive non-compliance before the Board." },
        { factor: "Sec 33(2)(d) — Gain / Loss Realised", evidence: "Zero commercial advantage obtained by Fiduciary; no direct financial loss suffered by data principals." }
      ],
      legalDefenseAssessment: "Strong Qualitative Mitigation Record compiled pursuant to Section 33(2); evidence refutes grounds for upper-band penalty.",
      status: "drill_scenario"
    },
    {
      key: "breach_notification",
      section: "The Schedule, Head 2 (Section 8(6))",
      title: "Failure to intimate Board and affected principals of personal data breach",
      statutoryMaxDisplay: "Up to ₹200 Crore per contravention",
      activeIncidents: 0,
      incidentRef: "SIM-DRILL-2026-003 Dual-Clock Intimation Verification",
      affectedPrincipals: 0,
      sec33Factors: [
        { factor: "Sec 33(2)(a) — Timeliness & Notice", evidence: "Initial intimation to DPBI dispatched without delay per Section 8(6); CERT-In reported in 5h 45m (within 6h window)." },
        { factor: "Sec 33(2)(e) — Principal Communication", evidence: "Multilingual SMS / portal notification templates queued in Gujarati, Hindi, and English." }
      ],
      legalDefenseAssessment: "Statutory notifications dispatched within prescribed windows; full compliance with Section 8(6).",
      status: "compliant"
    },
    {
      key: "children_obligations",
      section: "The Schedule, Head 3 (Section 9)",
      title: "Breach in observing additional obligations in relation to children",
      statutoryMaxDisplay: "Up to ₹200 Crore per contravention",
      activeIncidents: 0,
      incidentRef: "Child Protection Shield & Rule 12 Registry",
      affectedPrincipals: 0,
      sec33Factors: [
        { factor: "Sec 33(2)(a) — Statutory Scope", evidence: "Rule 12 read with Fourth Schedule Part B public subsidy exemptions strictly verified with signed applicability records." },
        { factor: "Sec 33(2)(e) — Harm Prevention", evidence: "Zero behavioural tracking, profiling, or targeted advertising algorithms enabled across all municipal services." }
      ],
      legalDefenseAssessment: "Systemic compliance enforced via code-level architecture controls under Section 9.",
      status: "compliant"
    },
    {
      key: "sdf_obligations",
      section: "The Schedule, Head 4 (Section 10)",
      title: "Breach in observing additional obligations of Significant Data Fiduciary",
      statutoryMaxDisplay: "Up to ₹150 Crore per contravention",
      activeIncidents: 0,
      incidentRef: "SDF Governance Framework (Voluntary Readiness)",
      affectedPrincipals: 0,
      sec33Factors: [
        { factor: "Statutory Applicability", evidence: "No Urban Local Bodies have been notified by Central Government under Section 10(1). Duties currently non-binding." },
        { factor: "Voluntary Due Diligence", evidence: "Municipal DPO appointed proactively; independent data auditor engaged; periodic DPIAs executed voluntarily." }
      ],
      legalDefenseAssessment: "Section 10 duties remain legally unnotified for ULBs; voluntary governance framework active.",
      status: "unnotified_readiness"
    },
    {
      key: "residual_provisions",
      section: "The Schedule, Head 5 & 6 (Section 33(1))",
      title: "Breach of any other provision of Act or Rules / Principal duties",
      statutoryMaxDisplay: "Up to ₹50 Crore (Fiduciary) / ₹10,000 (Principal)",
      activeIncidents: 0,
      incidentRef: "General Compliance & Grievance Governance",
      affectedPrincipals: 0,
      sec33Factors: [
        { factor: "Sec 33(2)(c) — Grievance Redressal", evidence: "Grievances triaged against Rule 14(2) 90-day statutory cap; published 30-day internal target met across standard requests." },
        { factor: "Sec 33(2)(e) — Section 17(4) Defenses", evidence: "Reasoned refusal notices issued for non-erasure of sovereign records, preventing unlawful data destruction." }
      ],
      legalDefenseAssessment: "Comprehensive procedural compliance across municipal departments.",
      status: "low_risk"
    }
  ]
};

// ── Kantara v1.1 & ISO/IEC 27560:2023 Consent Receipt Generator ─

function generateKantaraConsentReceipt(c) {
  const isSec7 = c.legalGround && c.legalGround.includes("7");
  const isMinor = !!c.isMinor;
  
  return {
    "version": "KI-CR-v1.1.0",
    "standard": "ISO/IEC 27560:2023 Privacy Technologies — Consent Record Information Structure",
    "jurisdiction": "IN",
    "consentReceiptID": `CR-IN-2026-${c.id}`,
    "consentTimestamp": c.grantedAt || new Date().toISOString(),
    "collectionMethod": c.channel === "Web Portal" ? "web_form" : (c.channel === "Mobile App" ? "mobile_sdk" : (c.channel === "Counter" ? "counter_signature" : "field_survey")),
    "language": c.language === "Gujarati" ? "gu" : (c.language === "Hindi" ? "hi" : "en"),
    "piiPrincipalId": c.principalId,
    "piiPrincipalName": c.principalName,
    "isMinor": isMinor,
    "childAge": isMinor ? (c.childAge || 12) : null,
    "verifiableParentalConsent": isMinor ? (c.vpc || {
      verified: true,
      method: "DigiLocker Family ID Linkage",
      token: "VPC-DL-2026-098842",
      guardianName: "Smt. Anita D. Rana",
      profilingProhibited: true,
      targetedAdsProhibited: true
    }) : null,
    "piiControllers": [
      {
        "piiController": "Ahmedabad Municipal Corporation",
        "entityType": "Urban Local Body (State Instrumentality)",
        "onBehalf": false,
        "contact": "Data Protection Officer (IAS)",
        "address": {
          "streetAddress": "Mahanagar Seva Sadan, Sardar Patel Bhavan, Danapith",
          "locality": "Ahmedabad",
          "region": "Gujarat",
          "postalCode": "380001",
          "country": "IN"
        },
        "email": "dpo@amc.gov.in",
        "phone": "+91-79-2539-1811",
        "piiControllerUrl": "https://ahmedabadcity.gov.in"
      }
    ],
    "policyUrl": "https://ahmedabadcity.gov.in/dpdp/privacy-notice",
    "statutoryFramework": {
      "act": "Digital Personal Data Protection Act, 2023",
      "rules": "DPDP Rules, 2025",
      "legalGround": c.legalGround || (isSec7 ? "Section 7(b) — State Function" : "Section 6 — Consent"),
      "isStatutoryMandate": isSec7,
      "enablingLegislation": c.statutoryAct || (isSec7 ? "Gujarat Municipalities Act, 1963" : "N/A (Voluntary Consent)")
    },
    "services": [
      {
        "service": typeof getSystemName === 'function' ? getSystemName(c.system) : c.system,
        "purposes": [
          {
            "purpose": c.purpose,
            "purposeCategory": [isSec7 ? "STATUTORY_STATE_FUNCTION" : "MUNICIPAL_SERVICES"],
            "consentType": isSec7 ? "statutory_mandate" : "explicit_affirmative",
            "piiCategory": ["IDENTITY_DATA", "CONTACT_DATA", "MUNICIPAL_PROPERTY_RECORD"],
            "primaryPurpose": true,
            "termination": isSec7 
              ? "Non-withdrawable pursuant to DPDP Act Sec 7(b) (Statutory State Function) while municipal service or ownership is active"
              : "Withdraw at any time via AMC Citizen Portal as easily as giving consent (Section 6(4))",
            "thirdPartyDisclosure": false
          }
        ]
      }
    ],
    "sensitive": c.system === "SYS-001" || c.system === "SYS-004" || c.system === "SYS-011",
    "spiCategories": ["AADHAAR_MASKED", "GOVERNMENT_IDENTIFIER", "MUNICIPAL_TAX_IDENTIFIER"],
    "tamperEvidence": {
      "hashAlgorithm": "SHA-256",
      "recordHash": typeof generateFakeHash === 'function' ? generateFakeHash(c.id) : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "ledgerSyncStatus": "Anchored to Immutable Local Compliance Ledger",
      "jwtSignature": `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(c.id + ':' + c.principalId)}.${(typeof generateFakeHash === 'function' ? generateFakeHash(c.id) : 'sig').substring(0, 43)}`,
      "verificationEndpoint": `https://ahmedabadcity.gov.in/api/v1/consent/verify/${c.id}`
    }
  };
}

// ── Municipal System Integration Hub & API Console Data ─────

var INTEGRATION_DATA = {
  apiKeys: [
    {
      id: "KEY-001",
      systemId: "SYS-013",
      systemName: "Citizen Services & Certification Portal (e-Services)",
      keyPrefix: "amc_live_pk_9d42e...",
      fullKey: "amc_live_pk_9d42e6f77c384a20b12d5930fa12",
      department: "DEP-001",
      scopes: ["notice:read", "consent:evaluate", "consent:write", "vpc:challenge"],
      rateLimit: "1,000 req/min",
      status: "active",
      createdAt: "2026-07-01T10:00:00Z",
      lastUsed: "2026-09-02T14:20:10Z"
    },
    {
      id: "KEY-002",
      systemId: "SYS-001",
      systemName: "e-Nagarpralika Property Tax Portal",
      keyPrefix: "amc_live_pk_8f93a...",
      fullKey: "amc_live_pk_8f93a7c14e0b4d99e53a201c1092",
      department: "DEP-001",
      scopes: ["notice:read", "consent:write", "consent:read"],
      rateLimit: "2,500 req/min",
      status: "active",
      createdAt: "2026-06-15T09:30:00Z",
      lastUsed: "2026-09-02T14:25:30Z"
    },
    {
      id: "KEY-003",
      systemId: "SYS-004",
      systemName: "Birth-Death Registration System",
      keyPrefix: "amc_live_pk_2b71c...",
      fullKey: "amc_live_pk_2b71c89012f45ea138f29910d44b",
      department: "DEP-002",
      scopes: ["statutory:evaluate", "notice:read", "vpc:read"],
      rateLimit: "1,500 req/min",
      status: "active",
      createdAt: "2026-06-10T11:00:00Z",
      lastUsed: "2026-09-02T13:45:00Z"
    },
    {
      id: "KEY-004",
      systemId: "SYS-008",
      systemName: "Building Permission System (DBPS)",
      keyPrefix: "amc_live_pk_5c11d...",
      fullKey: "amc_live_pk_5c11d3328e190ff49aa3b2184102",
      department: "DEP-004",
      scopes: ["notice:read", "consent:write"],
      rateLimit: "500 req/min",
      status: "active",
      createdAt: "2026-08-01T14:15:00Z",
      lastUsed: "2026-09-01T16:20:00Z"
    }
  ],
  webhooks: [
    {
      id: "WH-001",
      systemId: "SYS-013",
      systemName: "Citizen Certification Portal",
      endpointUrl: "https://eservices.ahmedabadcity.gov.in/api/v1/dpdp/webhooks",
      subscribedEvents: ["RIGHTS_ERASURE_MANDATED", "CONSENT_WITHDRAWN", "VPC_REVOKED"],
      hmacSecret: "whsec_9942a0b4e28019acbf5e913a",
      status: "healthy",
      lastDelivery: "2026-09-02T13:40:12Z",
      latencyMs: 34,
      successRate: "99.8%"
    },
    {
      id: "WH-002",
      systemId: "SYS-001",
      systemName: "e-Nagarpralika Property Tax Portal",
      endpointUrl: "https://enagarpalika.gujarat.gov.in/amc/webhook/dpdp-sync",
      subscribedEvents: ["STATUTORY_PREFERENCE_UPDATED", "CONSENT_WITHDRAWN"],
      hmacSecret: "whsec_1104e7c39d1082be45fc1192",
      status: "healthy",
      lastDelivery: "2026-09-02T12:15:00Z",
      latencyMs: 48,
      successRate: "100.0%"
    }
  ],
  certServices: [
    {
      id: "CERT-INCOME",
      code: "CERT_INCOME_SERVICE",
      title: "Income & Assets Certificate (આવકનો દાખલો / आय प्रमाण पत्र)",
      department: "DEP-001",
      deptName: "Revenue & Estate Department",
      legalGround: "Section 6 — Consent",
      isStatutory: false,
      isMinorSupported: false,
      applicantDefault: "Shri Ramesh K. Patel (AMC-CID-890124)",
      dataFields: [
        { name: "Applicant Name", type: "PII" },
        { name: "Citizen Municipal ID", type: "PII" },
        { name: "Annual Family Income", type: "Financial PII" },
        { name: "Bank Statement / ITR", type: "SPII" },
        { name: "Mobile & Email", type: "PII" }
      ],
      notices: {
        gu: "આવક અને સંપત્તિ પ્રમાણપત્ર મેળવવા માટે તમારી વ્યક્તિગત આવક અને બેંક વિગતોની ચકાસણી કરવામાં આવશે. DPDP અધિનિયમ ૨૦૨૩ ની કલમ ૫ હેઠળ આ ડેટા ફક્ત પ્રમાણપત્ર ચકાસણી માટે વાપરવામાં આવશે. તમે કોઈપણ સમયે dpo@amc.gov.in પર સંમતિ પાછી ખેંચી શકો છો.",
        hi: "आय और संपत्ति प्रमाण पत्र जारी करने हेतु आपके आय प्रमाण व बैंक विवरण का सत्यापन किया जाएगा। डीपी़डीपी अधिनियम 2023 की धारा 5 के अंतर्गत यह डेटा केवल प्रमाण पत्र पात्रता सत्यापन हेतु प्रयुक्त होगा। आप किसी भी समय सहमति वापस ले सकते हैं।",
        en: "Personal income proofs, PAN, and bank details collected solely for verifying eligibility for municipal income certificate under Section 5 & 6 of DPDP Act 2023. You may withdraw consent at any time via AMC Citizen Portal."
      }
    },
    {
      id: "CERT-BIRTH",
      code: "CERT_BIRTH_EXTRACT",
      title: "Birth Certificate Extract (જન્મ પ્રમાણપત્ર / जन्म प्रमाण पत्र)",
      department: "DEP-002",
      deptName: "Health & Vital Statistics Department",
      legalGround: "Section 7(b) — State Function",
      enablingAct: "Registration of Births and Deaths Act, 1969",
      isStatutory: true,
      isMinorSupported: true,
      applicantDefault: "Smt. Bhavna R. Shah (AMC-CID-781290)",
      dataFields: [
        { name: "Child Full Name", type: "PII" },
        { name: "Date & Time of Birth", type: "PII" },
        { name: "Place of Birth / Hospital ID", type: "PII" },
        { name: "Mother & Father Verified KYC", type: "SPII" },
        { name: "Permanent Residential Address", type: "PII" }
      ],
      notices: {
        gu: "જન્મ પ્રમાણપત્ર નોંધણી એ જન્મ અને મરણ નોંધણી અધિનિયમ, ૧૯૬૯ હેઠળ રાજ્યનું સાર્વભૌમ કાર્ય છે. DPDP અધિનિયમ ૨૦૨૩ ની કલમ ૭(ખ) હેઠળ આ ડેટા વૈધાનિક રીતે સાચવવામાં આવે છે અને તે રદબાતલ પાત્ર નથી.",
        hi: "जन्म प्रमाण पत्र जारी करना जन्म-मृत्यु पंजीकरण अधिनियम 1969 के अंतर्गत एक संप्रभु राज्य कार्य है। डीपी़डीपी अधिनियम 2023 की धारा 7(b) के तहत यह डेटा वैधानिक रूप से प्रोसेस किया जाता है तथा इसे वापस नहीं लिया जा सकता।",
        en: "Birth certificate extract processing is a sovereign statutory State Function governed by the Registration of Births and Deaths Act, 1969. Pursuant to Section 7(b) of the DPDP Act 2023, processing is legally required and primary registry records cannot be withdrawn."
      }
    },
    {
      id: "CERT-MINOR-SCHOLARSHIP",
      code: "CERT_SCHOLARSHIP_ELIGIBILITY",
      title: "Minor Merit Scholarship Certificate (બાળકો માટે સ્કોલરશીપ પ્રમાણપત્ર)",
      department: "DEP-006",
      deptName: "Education & Child Welfare Department",
      legalGround: "Section 7(b) — State Function (Public Subsidy / Benefit)",
      childProtectionLayer: "Section 9 Child Safeguards (Anti-Profiling Mandatory)",
      isStatutory: true,
      isMinorSupported: true,
      isExemptUnderRule12FourthSchedule: true,
      exemptionCitation: "DPDP Rules 2025 Rule 12 read with Fourth Schedule Part B",
      exemptionRationale: "Statutory exemption from Section 9(1) parental consent for provision of any subsidy, benefit, service, certificate, license, or permit funded from public funds.",
      mandatoryAntiProfiling: "Section 9(3) Hard Block: Zero Behavioral Tracking, Zero Targeted Advertisements",
      applicantDefault: "Master Rohan D. Rana (Age 12) [Enrollment: SCH-2026-8912]",
      dataFields: [
        { name: "Minor Student Name", type: "PII" },
        { name: "Age & Date of Birth", type: "PII (Minor <18)" },
        { name: "School Enrollment ID", type: "PII" },
        { name: "Public Benefit Eligibility Token", type: "Rule 12 Token" },
        { name: "Bank Account for Direct Benefit Transfer", type: "Financial SPII" }
      ],
      notices: {
        gu: "આ સેવા જાહેર ભંડોળમાંથી પૂરી પાડવામાં આવતી શિષ્યવૃત્તિ સહાય છે. DPDP નિયમો ૨૦૨૫ ના નિયમ ૧૨ અને ચોથી અનુસૂચિ ભાગ ખ હેઠળ કલમ ૯(૧) વાલી સંમતિમાંથી વૈધાનિક મુક્તિ પ્રાપ્ત છે. કલમ ૯(૩) મુજબ બાળકના ડેટા પર ટ્રેકિંગ, પ્રોફાઇલિંગ અને જાહેરાતો પર સંપૂર્ણ કાનૂની પ્રતિબંધ છે.",
        hi: "यह सेवा सार्वजनिक निधि से प्रदान की जाने वाली छात्रवृत्ति सहायता है। डीपी़डीपी नियम 2025 के नियम 12 सहपठित चतुर्थ अनुसूची भाग 'ख' के तहत धारा 9(1) अभिभावक सहमति से वैधानिक छूट प्राप्त है। धारा 9(3) के अंतर्गत बच्चे के डेटा पर ट्रैकिंग, प्रोफाइलिंग और विज्ञापनों पर पूर्ण प्रतिबंध लागू रहेगा।",
        en: "This service provides an educational scholarship funded from municipal public funds. Pursuant to DPDP Rules 2025 Rule 12 read with Fourth Schedule Part B, Section 9(1) parental consent is statutorily exempted. In accordance with Section 9(3), tracking, behavioral profiling, and targeted advertising directed at children remain strictly prohibited under law."
      }
    }
  ]
};

// ── Citizen Portal Multilingual Translations (Section 5 8th Schedule) ──

var CITIZEN_I18N = {
  currentLang: 'en',
  translations: {
    en: {
      brand: "AMC Citizen Portal",
      tagline: "Data Principal Self-Service Portal · DPDP Act 2023",
      welcomeTitle: "Namaste, Shri Ramesh K. Patel",
      welcomeSub: "Welcome to Ahmedabad Municipal Corporation's Data Principal Self-Service Portal under the Digital Personal Data Protection Act, 2023.",
      tabs: {
        overview: "Overview",
        data: "My Personal Data",
        consent: "Manage Consent",
        requests: "Exercise Rights",
        nominee: "Nominee (Sec 14)"
      },
      qa: {
        viewData: "View My Data",
        viewDataDesc: "Inspect all PII held by AMC",
        manageConsent: "Manage Consent",
        manageConsentDesc: "Opt-in / revoke processing",
        fileRequest: "Submit Rights Request",
        fileRequestDesc: "Access, correction, erasure (Sec 11-14)",
        nominee: "My Nominee (Sec 14)",
        nomineeDesc: "Designate legal heir for rights",
        grievance: "Grievance Redressal",
        grievanceDesc: "Escalate privacy disputes"
      },
      buttons: {
        newRequest: "+ Submit Rights Request",
        fileGrievance: "⚖️ File Grievance",
        updateNominee: "✏️ Update Nominee",
        viewCertificate: "📄 View Nomination Certificate",
        downloadReceipt: "⬇ Download Receipt"
      }
    },
    gu: {
      brand: "અમદાવાદ મહાનગરપાલિકા નાગરિક પોર્ટલ",
      tagline: "ડેટા પ્રિન્સિપાલ સ્વ-સેવા પોર્ટલ · DPDP અધિનિયમ ૨૦૨૩",
      welcomeTitle: "નમસ્તે, શ્રી રમેશ કે. પટેલ",
      welcomeSub: "ડિજિટલ પર્સનલ ડેટા પ્રોટેક્શન એક્ટ, ૨૦૨૩ હેઠળ અમદાવાદ મ્યુનિસિપલ કોર્પોરેશનના ડેટા પ્રિન્સિપાલ પોર્ટલમાં આપનું હાર્દિક સ્વાગત છે.",
      tabs: {
        overview: "સંક્ષિપ્ત વિગત",
        data: "મારો અંગત ડેટા",
        consent: "સંમતિ વ્યવસ્થાપન",
        requests: "અધિકારોનો ઉપયોગ",
        nominee: "વારસદાર / નોમિની (કલમ ૧૪)"
      },
      qa: {
        viewData: "મારો અંગત ડેટા જુઓ",
        viewDataDesc: "AMC પાસે રહેલ બધો ડેટા તપાસો",
        manageConsent: "સંમતિ વ્યવસ્થાપન",
        manageConsentDesc: "સંમતિ આપો અથવા પાછી ખેંચો",
        fileRequest: "અધિકાર વિનંતી સબમિટ કરો",
        fileRequestDesc: "સુધારો, રદબાતલ (કલમ ૧૧-૧૪)",
        nominee: "મારા નોમિની (કલમ ૧૪)",
        nomineeDesc: "વારસદારની કાનૂની નોંધણી કરો",
        grievance: "ફરિયાદ નિવારણ",
        grievanceDesc: "ગોપનીયતા ફરિયાદ નોંધાવો"
      },
      buttons: {
        newRequest: "+ નવી અધિકાર વિનંતી",
        fileGrievance: "⚖️ ફરિયાદ નોંધાવો",
        updateNominee: "✏️ નોમિની બદલો",
        viewCertificate: "📄 નોમિનેશન સર્ટિફિકેટ જુઓ",
        downloadReceipt: "⬇ રસીદ ડાઉનલોડ"
      }
    },
    hi: {
      brand: "अहमदाबाद नगर निगम नागरिक पोर्टल",
      tagline: "डेटा प्रिंसिपल स्व-सेवा पोर्टल · डीपी़डीपी अधिनियम 2023",
      welcomeTitle: "नमस्ते, श्री रमेश के. पटेल",
      welcomeSub: "डिजिटल पर्सनल डेटा प्रोटेक्शन एक्ट, 2023 के अंतर्गत अहमदाबाद नगर निगम के डेटा प्रिंसिपल पोर्टल में आपका स्वागत है।",
      tabs: {
        overview: "अवलोकन",
        data: "मेरा व्यक्तिगत डेटा",
        consent: "सहमति प्रबंधन",
        requests: "अधिकारों का प्रयोग",
        nominee: "नामांकित व्यक्ति / नॉमिनी (धारा 14)"
      },
      qa: {
        viewData: "मेरा डेटा देखें",
        viewDataDesc: "निगम द्वारा संग्रहीत डेटा की जांच करें",
        manageConsent: "सहमति प्रबंधित करें",
        manageConsentDesc: "सहमति दें अथवा वापस लें",
        fileRequest: "अधिकार अनुरोध दर्ज करें",
        fileRequestDesc: "सत्यापन, सुधार या विलोपन (धारा 11-14)",
        nominee: "मेरा नॉमिनी (धारा 14)",
        nomineeDesc: "अधिकारों हेतु कानूनी वारिस दर्ज करें",
        grievance: "शिकायत निवारण",
        grievanceDesc: "डेटा संरक्षण शिकायत दर्ज करें"
      },
      buttons: {
        newRequest: "+ नया अधिकार अनुरोध",
        fileGrievance: "⚖️ शिकायत दर्ज करें",
        updateNominee: "✏️ नॉमिनी अपडेट करें",
        viewCertificate: "📄 नामांकन प्रमाण पत्र देखें",
        downloadReceipt: "⬇ रसीद डाउनलोड"
      }
    }
  }
};

// ── Statutory Regulatory Filings Data (DPBI Form 1 & CERT-In) ──

var STATUTORY_FILINGS = {
  "SIM-DRILL-2026-003": {
    incidentId: "SIM-DRILL-2026-003",
    title: "[CYBER DRILL SPECIMEN] Unauthorized API Data Extraction Simulation — Birth-Death Registry",
    isTabletopDrill: true,
    dpbiForm1: {
      formName: "FORM 1 [CYBER DRILL SPECIMEN] — INTIMATION OF PERSONAL DATA BREACH TO DATA PROTECTION BOARD OF INDIA",
      statutoryProvision: "Section 8(6) of DPDP Act, 2023 read with Rule 7 of DPDP Rules (Drill Simulation)",
      dateOfFiling: "2026-09-02T10:00:00+05:30",
      fiduciaryName: "Ahmedabad Municipal Corporation (Urban Local Body Data Fiduciary)",
      registrationNumber: "ULB/GJ/AMC/2026/001 (SDF Notification Pending)",
      registeredOffice: "Mahanagar Seva Sadan, Danapith, Ahmedabad - 380001, Gujarat, India",
      dpoDetails: {
        name: "Office of the Data Protection Officer, AMC",
        designation: "Municipal Data Protection & Compliance Office (Simulation Persona)",
        email: "dpo@amc.gov.in",
        phone: "+91-79-2539-1811"
      },
      incidentDetails: {
        discoveryTimestamp: "2026-09-01T22:15:00+05:30",
        occurrenceTimestamp: "2026-09-01T21:40:00+05:30",
        detectionMethod: "Automated SIEM WAF Threshold Alert (Drill Scenario: 400 requests/sec)",
        affectedSystem: "SYS-004 (Birth-Death Registration System)",
        datacenter: "NIC National Data Center, Shastri Park, New Delhi (In-Country Sovereign)",
        estimatedPrincipalsImpacted: 12000,
        categoriesOfPersonalData: [
          "Child Full Name",
          "Date & Time of Birth",
          "Hospital Registration Code",
          "Parent Names & Masked Municipal CID",
          "Permanent Residential Address"
        ],
        natureAndSeverity: "High Severity SPII Exposure via Compromised Scoped API Credential [Tabletop Simulation Drill]"
      },
      mitigationActions: [
        "Revocation of compromised API access token within 45 minutes of detection.",
        "Perimeter firewall block applied on offending foreign IP range (185.220.101.0/24).",
        "Primary database integrity verified — zero modifications, read-only extraction.",
        "Database encryption at rest verified intact (AES-256 HSM).",
        "Statutory initial intimation dispatched to CERT-In within 5h 45m."
      ],
      principalCommunicationPlan: "[DRILL SPECIMEN] SMS & registered email intimations prepared for 12,000 registered parents with guidance on vigilant monitoring and AMC toll-free helpline (155304).",
      statutorySignature: "[DRAFT / TABLETOP DRILL SPECIMEN ONLY — PENDING FORMAL INSTITUTIONAL REVIEW]"
    },
    certInNotice: {
      formName: "CYBER INCIDENT REPORTING [TABLETOP DRILL SPECIMEN] TO INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)",
      statutoryProvision: "Sub-section (6) of Section 70B of Information Technology Act, 2000 & CERT-In Directions",
      incidentCategory: "Category 12 — Unauthorized Access / Data Breach / System Intrusion [Drill Simulation]",
      reportingDeadline: "6 Hours from Discovery (Satisfied: Reported in 5h 45m in simulation)",
      incidentTrackingId: "SIM-CERTIN-DRILL-89231",
      affectedAssetIP: "164.100.112.45 (NIC Meghraj State Node)",
      threatActorSourceIP: "185.220.101.44 (Simulated Tor Exit Node)",
      hashEvidence: "SHA256: 8f42b910adbc1481e3a47900b2184910cf9042a4501928374182903849102834",
      containmentStatus: "CONTAINED (Simulated drill containment verified)"
    }
  }
};

// ── Rule 5 & Second Schedule Statutory Intimations (Section 7(b)) ──

var RULE_5_INTIMATIONS = [
  {
    id: "INT-2026-001",
    serviceName: "Municipal Property Tax Assessment & Collection",
    systemId: "SYS-001",
    departmentId: "DEP-001",
    enablingAct: "Gujarat Municipalities Act, 1963 (Section 99) & BPMC Act 1949",
    legalGround: "DPDP Act Section 7(b) — State Function / Municipal Duty",
    standards: {
      standard1_lawfulAuthority: "Levy and collection of property tax authorized under Chapter VIII of the Gujarat Municipalities Act, 1963.",
      standard2_purposeAndMinimisation: "Processing strictly confined to tenement identification, assessment calculation, demand issuance, and receipting. No biometric data collected.",
      standard3_accuracyAndUpdating: "Annual GIS survey and physical ward inspection to ensure accuracy before tax demand notice generation (Sec 8(3) Civic Decision Control).",
      standard4_retentionLimitation: "Permanent retention of property tenement title register; 7-year retention for financial payment slips per Income Tax Act Sec 44AA.",
      standard5_securitySafeguards: "All records encrypted at rest using AES-256 via FIPS 140-2 Level 3 HSM hardware at Gujarat State Data Center, Gandhinagar.",
      standard6_publishedContacts: "Data Protection Officer: Shri Rajesh M. Patel, IAS (dpo@amc.gov.in) · Grievance Officer: Smt. Ritu P. Sharma (grievance@amc.gov.in)",
      standard7_reviewAndRedressal: "Right to file grievance under Section 13 within published period (max 90 days per Rule 14(2)). Unilateral erasure restricted under Section 17(4)."
    },
    version: "v2.5 (Rule 5 Compliant)",
    effectiveDate: "2025-11-13"
  },
  {
    id: "INT-2026-002",
    serviceName: "Vital Statistics Registration (Births & Deaths)",
    systemId: "SYS-004",
    departmentId: "DEP-002",
    enablingAct: "Registration of Births and Deaths Act, 1969 (Sections 7, 8 & 12)",
    legalGround: "DPDP Act Section 7(b) — State Function / Municipal Duty",
    standards: {
      standard1_lawfulAuthority: "Statutory mandate to register all births and deaths occurring within Ahmedabad city limits under Central Act No. 18 of 1969.",
      standard2_purposeAndMinimisation: "Collection limited to child name, parent names, birth date/place, informant details, and statistical cause of death.",
      standard3_accuracyAndUpdating: "Hospital birth/death slips cross-verified with institutional delivery registers before register entry.",
      standard4_retentionLimitation: "Permanent statutory record. Section 17(4) disapplies Section 8(7) erasure to maintain civic continuity.",
      standard5_securitySafeguards: "NIC National Data Center Shastri Park, Tier-III certified, role-based access control with dual-factor authentication.",
      standard6_publishedContacts: "Registrar of Births & Deaths: Dr. Alka M. Pandya · DPO: Shri Rajesh M. Patel, IAS",
      standard7_reviewAndRedressal: "Correction of clerical errors permissible under Section 15 of RBD Act. Appeal to Chief Registrar, Gujarat."
    },
    version: "v1.4",
    effectiveDate: "2025-11-13"
  },
  {
    id: "INT-2026-003",
    serviceName: "Municipal Water Supply Connection & Distribution",
    systemId: "SYS-006",
    departmentId: "DEP-003",
    enablingAct: "Bombay Provincial Municipal Corporations Act (BPMC Act 1949)",
    legalGround: "DPDP Act Section 7(b) — State Function",
    standards: {
      standard1_lawfulAuthority: "Provision and metering of potable domestic and commercial water supply under BPMC Act Chapter XIX.",
      standard2_purposeAndMinimisation: "Consumer index number, connection diameter, billing address, meter readings.",
      standard3_accuracyAndUpdating: "Bimonthly physical and telemetry meter readings.",
      standard4_retentionLimitation: "Duration of active water connection + 3 years post-disconnection for audit.",
      standard5_securitySafeguards: "Gujarat SDC Gandhinagar, AES-256 encryption, encrypted billing APIs.",
      standard6_publishedContacts: "City Engineer (Water Works): Shri Dinesh P. Rana · DPO: Shri Rajesh M. Patel, IAS",
      standard7_reviewAndRedressal: "Billing dispute mechanism with 15-day resolution SLA. Appealable to Municipal Commissioner."
    },
    version: "v1.2",
    effectiveDate: "2025-11-13"
  }
];

// ── Data Processor & Sub-Processor Governance Register (Section 8(2) & Rule 8) ──

var DATA_PROCESSORS = [
  {
    id: "PROC-001",
    name: "Silver Touch Technologies Limited",
    systemsManaged: ["SYS-001 (Property Tax)", "SYS-006 (Water Billing)", "SYS-013 (Citizen Portal)"],
    dpaStatus: "Executed & Valid",
    dpaExecutionDate: "2025-12-01",
    dpaExpiryDate: "2028-11-30",
    securityCertifications: ["ISO/IEC 27001:2022", "CMMI Level 5", "STQC Empanelled"],
    subProcessors: [
      { name: "Netcore Cloud Communications", service: "Transactional SMS & Email Alerts", country: "India (Mumbai DC)", dpaSigned: true },
      { name: "Gujarat Informatics Limited (GIL)", service: "State Data Center Co-location", country: "India (Gandhinagar)", dpaSigned: true }
    ],
    technicalPOC: "Shri Vrutik Shah (Lead Architect)",
    auditStatus: "Annual Audit Cleared (May 2026)",
    liabilitiesClause: "Full statutory indemnity per Section 8(2) for processor security lapses."
  },
  {
    id: "PROC-002",
    name: "National Informatics Centre (NIC)",
    systemsManaged: ["SYS-004 (Birth-Death)", "SYS-008 (Building Permission)", "SYS-011 (Health)", "SYS-012 (Vaccination)"],
    dpaStatus: "Inter-Governmental MoA Active",
    dpaExecutionDate: "2024-04-01",
    dpaExpiryDate: "Permanent (Govt of India Agency)",
    securityCertifications: ["CERT-In Empanelled", "MeitY Cloud Empanelled", "ISO 27001"],
    subProcessors: [
      { name: "Meghraj National Cloud", service: "Government Cloud Infrastructure", country: "India (Delhi / Pune)", dpaSigned: true }
    ],
    technicalPOC: "Shri S. K. Sharma (Technical Director, NIC Gujarat)",
    auditStatus: "CERT-In Security Audit Cleared (Jan 2026)",
    liabilitiesClause: "MeitY Inter-Agency Data Protection Agreement."
  },
  {
    id: "PROC-003",
    name: "State Bank of India (SBI ePay)",
    systemsManaged: ["SYS-003 (Payment Gateway)"],
    dpaStatus: "Executed & Valid",
    dpaExecutionDate: "2025-08-15",
    dpaExpiryDate: "2027-08-14",
    securityCertifications: ["RBI Regulated Payment Aggregator", "PCI-DSS v4.0", "ISO 27001"],
    subProcessors: [
      { name: "NPCI (Unified Payments Interface)", service: "Payment Settlement", country: "India (Hyderabad DC)", dpaSigned: true }
    ],
    technicalPOC: "Shri R. Venkat (Chief Manager, Digital Banking)",
    auditStatus: "Quarterly PCI-DSS Attestation Verified",
    liabilitiesClause: "RBI Master Directions + DPDP Statutory Liability."
  },
  {
    id: "PROC-004",
    name: "BISAG-N (Bhaskaracharya National Institute for Space Applications)",
    systemsManaged: ["SYS-002 (Property GIS)", "SYS-009 (Town Planning GIS)"],
    dpaStatus: "Institutional MoU Active",
    dpaExecutionDate: "2024-01-10",
    dpaExpiryDate: "2029-01-09",
    securityCertifications: ["MeitY Autonomous Scientific Society", "STQC Certified"],
    subProcessors: [],
    technicalPOC: "Dr. P. K. Mehta (Scientist-G, BISAG-N)",
    auditStatus: "MeitY Cyber Security Posture Audit Cleared",
    liabilitiesClause: "State Remote Sensing & Spatial Data Agreement."
  }
];

// ── Third-Party Data Sharing & Recipient Register (Section 11(1)(b)) ──

var DATA_SHARING_REGISTER = [
  {
    id: "SHR-001",
    recipientEntity: "Gujarat State Election Commission",
    categoryOfEntity: "Constitutional Body (Government of Gujarat)",
    personalDataShared: ["Full Name", "Property Tenement Address", "Voter Age Verification"],
    statutoryLegalGround: "Section 7(b) — State Function / Statutory Electoral Roll Alignment",
    purpose: "Preparation and revision of municipal electoral ward rolls",
    dataTransferProtocol: "Air-gapped secure SFTP with AES-256 encryption",
    dpaExecuted: true
  },
  {
    id: "SHR-002",
    recipientEntity: "Commercial Tax Department, Govt. of Gujarat",
    categoryOfEntity: "State Revenue Department",
    personalDataShared: ["Commercial Property Owner Name", "GSTN / PAN", "Annual Assessment Demand"],
    statutoryLegalGround: "Section 7(c) — Compliance with Law / Cross-Tax Scrutiny",
    purpose: "Detection of commercial tax evasion and GST revenue reconciliation",
    dataTransferProtocol: "Dedicated IPsec VPN leased line between SDC and Tax Directorate",
    dpaExecuted: true
  },
  {
    id: "SHR-003",
    recipientEntity: "Ahmedabad City Police Commissionerate",
    categoryOfEntity: "Law Enforcement Agency",
    personalDataShared: ["Vital Event Records (Specified Death Extracts)", "Surveillance CCTV Metadata"],
    statutoryLegalGround: "Section 7(c) / Section 17(1) — Crime Prevention & Judicial Order",
    purpose: "Investigation of cognizable offences under CrPC / BNSS",
    dataTransferProtocol: "Formal written requisition + encrypted magistrate-signed token",
    dpaExecuted: true
  }
];

// ── Rule 23 & Seventh Schedule Inspector Inquiry Gate & Register ──

var RULE_23_INSPECTOR_CONFIG = {
  activeInquiry: {
    summonsNumber: "SIM-INQ-DPBI-DRILL-0041",
    issueDate: "2026-09-02T05:00:00Z",
    presidingMember: "Hon'ble Member, Data Protection Board of India (Simulation Specimen)",
    statutoryScope: "Tabletop cyber drill verification (SIM-DRILL-2026-003 / SYS-004) under Section 28 & Rule 23 protocol test",
    authorizedInspector: "Shri Vinod G. Mishra (ID: DPB-INSP-088 — Simulation Persona)",
    permittedSystemScopes: ["SYS-004 (Birth-Death Registration)", "SYS-001 (WAF Logs)"],
    status: "Active & Authorized (Drill Specimen)"
  },
  seventhScheduleDisclosures: [
    {
      disclosureId: "DISC-2026-001",
      timestamp: "2026-09-02T06:30:00Z",
      artifactName: "SIM-DRILL-2026-003 SIEM Log Extract Specimen (IP 103.XX.XX.45)",
      systemId: "SYS-004",
      inspectorName: "Shri Vinod G. Mishra (Simulation Persona)",
      purpose: "Verification of breach containment timestamp [Tabletop Drill]",
      sha256Hash: "f9b20892a0149021de9814209baec908234a98012bcfe890124312ab45829102"
    },
    {
      disclosureId: "DISC-2026-002",
      timestamp: "2026-09-02T08:15:00Z",
      artifactName: "DPBI Form 1 Draft Intimation [Simulation Specimen]",
      systemId: "SYS-004",
      inspectorName: "Shri Vinod G. Mishra (Simulation Persona)",
      purpose: "Inspection of 72-hour detailed statutory filing readiness [Tabletop Drill]",
      sha256Hash: "4820ba9102ecfa489102bcad890123ef980124bca8901243789012efbcda9801"
    }
  ]
};

if (typeof window !== 'undefined') {
  window.SDF_GOVERNANCE_CONFIG = SDF_GOVERNANCE_CONFIG;
  window.ROLES = ROLES;
  window.USERS = USERS;
  window.ADMIN_DATA = ADMIN_DATA;
  window.CITIZEN_DATA = CITIZEN_DATA;
  window.GUARDIAN_DATA = GUARDIAN_DATA;
  window.SAMPLE_DATA = SAMPLE_DATA;
  window.CONSENT_MANAGERS = CONSENT_MANAGERS;
  window.PENALTY_SCHEDULE = PENALTY_SCHEDULE;
  window.INTEGRATION_DATA = INTEGRATION_DATA;
  window.CITIZEN_I18N = CITIZEN_I18N;
  window.STATUTORY_FILINGS = STATUTORY_FILINGS;
  window.RULE_5_INTIMATIONS = RULE_5_INTIMATIONS;
  window.DATA_PROCESSORS = DATA_PROCESSORS;
  window.DATA_SHARING_REGISTER = DATA_SHARING_REGISTER;
  window.RULE_23_INSPECTOR_CONFIG = RULE_23_INSPECTOR_CONFIG;
  window.generateKantaraConsentReceipt = generateKantaraConsentReceipt;
}



