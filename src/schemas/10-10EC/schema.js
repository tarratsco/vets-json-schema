const buildDefinitionReference = referenceId => ({ $ref: `#/definitions/${referenceId}` });

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  additionalProperties: false,
  definitions: {
    fullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
          minLength: 1,
          maxLength: 35,
          pattern: "^[A-Za-z\\s'\\-]+$",
        },
        middle: {
          type: ['string', 'null'],
          maxLength: 1,
          pattern: '^[A-Za-z]$',
        },
        last: {
          type: 'string',
          minLength: 1,
          maxLength: 35,
          pattern: "^[A-Za-z\\s'\\-]+$",
        },
      },
      required: ['first', 'last'],
    },

    ssn: {
      type: 'string',
      description: 'Social Security Number — 9 digits, no hyphens, stored stripped',
      pattern: '^(?!000)(?!9\\d{2})\\d{9}$',
      minLength: 9,
      maxLength: 9,
    },

    date: {
      type: 'string',
      description: 'ISO 8601 date string YYYY-MM-DD',
      format: 'date',
      pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    },

    currencyAmount: {
      type: ['number', 'null'],
      description: 'Dollar amount; null when not entered',
      minimum: 0,
      maximum: 999999999.99,
    },

    incomeFrequency: {
      type: ['string', 'null'],
      enum: ['annually', 'monthly', 'twice_monthly', 'bi_weekly', 'weekly', null],
    },

    incomeEntry: {
      type: 'object',
      additionalProperties: false,
      properties: {
        amount: buildDefinitionReference('currencyAmount'),
        frequency: buildDefinitionReference('incomeFrequency'),
      },
    },

    documentGuid: {
      type: 'string',
      description: 'UUID of a document previously uploaded via the document upload endpoint',
      pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
      minLength: 36,
      maxLength: 36,
    },

    dependent: {
      type: 'object',
      additionalProperties: false,
      required: ['fullName', 'ssn', 'dateOfBirth'],
      properties: {
        fullName: buildDefinitionReference('fullName'),
        ssn: buildDefinitionReference('ssn'),
        dateOfBirth: buildDefinitionReference('date'),
      },
    },

    fixedAssetGroup: {
      type: 'object',
      additionalProperties: false,
      description: 'Section V fixed asset values for one party (Veteran or Spouse)',
      properties: {
        primaryResidence: {
          description: 'Market value of primary residence minus outstanding mortgages/liens',
          $ref: '#/definitions/currencyAmount',
        },
        otherResidences: {
          description: 'Combined market value of other residences, land, farm, ranch minus liens',
          $ref: '#/definitions/currencyAmount',
        },
        vehicles: {
          description: 'Vehicle value minus outstanding lien',
          $ref: '#/definitions/currencyAmount',
        },
      },
    },

    liquidAssetGroup: {
      type: 'object',
      additionalProperties: false,
      description: 'Section VI liquid asset values for one party (Veteran or Spouse)',
      properties: {
        cashAndInvestments: {
          description: 'Cash, checking/savings, CDs, IRAs, stocks, bonds',
          $ref: '#/definitions/currencyAmount',
        },
        otherLiquidAssets: {
          description: 'Art, rare coins, collectibles minus amounts owed',
          $ref: '#/definitions/currencyAmount',
        },
        householdEffects: {
          description: 'Clothing, jewelry, personal items — excluded when spouse or dependent resides in community (not institutionalized)',
          $ref: '#/definitions/currencyAmount',
        },
      },
    },

    incomeGroup: {
      type: 'object',
      additionalProperties: false,
      description: 'Section VII gross income entries for one party (Veteran or Spouse)',
      properties: {
        employmentIncome: buildDefinitionReference('incomeEntry'),
        businessIncome: buildDefinitionReference('incomeEntry'),
        otherIncome: buildDefinitionReference('incomeEntry'),
      },
    },
  },

  properties: {
    // ─── Section I — General Information ───────────────────────────────────
    sectionI: {
      type: 'object',
      additionalProperties: false,
      description: 'Section I — General Information (Veteran identification)',
      required: ['veteranFullName', 'veteranSsn'],
      properties: {
        veteranFullName: buildDefinitionReference('fullName'),
        veteranSsn: buildDefinitionReference('ssn'),
      },
    },

    // ─── Section II — Insurance Information ────────────────────────────────
    sectionII: {
      type: 'object',
      additionalProperties: false,
      description: 'Section II — Insurance Information',
      required: ['hasCurrentInsurance'],
      properties: {
        hasCurrentInsurance: {
          type: 'boolean',
          description: 'Does the Veteran have current health insurance (including coverage through a spouse)?',
        },
        insuranceDocumentGuids: {
          type: 'array',
          description: 'GUIDs for uploaded insurance card images; required when hasCurrentInsurance = true',
          items: buildDefinitionReference('documentGuid'),
          minItems: 0,
          maxItems: 20,
        },
        medicareDocumentGuid: {
          type: ['string', 'null'],
          description: 'GUID for uploaded Medicare card (Parts A & B); null if not applicable',
          pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
        },
        medicaidDocumentGuid: {
          type: ['string', 'null'],
          description: 'GUID for uploaded Medicaid card; null if not applicable',
          pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
        },
      },
    },

    // ─── Section III — Spouse / Dependent Information ───────────────────────
    sectionIII: {
      type: 'object',
      additionalProperties: false,
      description: 'Section III — Spouse and Dependent Information',
      required: ['maritalStatus'],
      properties: {
        maritalStatus: {
          type: 'string',
          description: 'Current marital and dependent status (field 4)',
          enum: [
            'single_with_dependent',
            'single_no_dependent',
            'married_living_with',
            'married_separate_not_institutionalized',
            'married_separate_institutionalized',
            'divorced_separated_widowed_this_year',
          ],
        },

        // Spouse fields — present when maritalStatus is any married or divorced_separated_widowed_this_year value
        spouseFullName: {
          description: 'Spouse name (field 5) — required when married status',
          $ref: '#/definitions/fullName',
        },
        spouseSsn: {
          description: 'Spouse SSN (field 5A) — required when married status',
          $ref: '#/definitions/ssn',
        },
        spouseDateOfBirth: {
          description: 'Spouse date of birth (field 5B) — required when married status',
          $ref: '#/definitions/date',
        },
        dateOfMarriage: {
          description: 'Date of marriage (field 5C) — required when married status',
          $ref: '#/definitions/date',
        },
        dateOfLegalSeparationOrDivorce: {
          description: 'Date of legal separation or divorce (field 5D) — applicable when divorced_separated_widowed_this_year',
          oneOf: [
            buildDefinitionReference('date'),
            { type: 'null' },
          ],
        },
        dateOfSpouseDeath: {
          description: "Date of spouse's death (field 5E) — applicable when divorced_separated_widowed_this_year",
          oneOf: [
            buildDefinitionReference('date'),
            { type: 'null' },
          ],
        },

        // Dependents array (fields 6–9 on paper; digital form extends beyond 4)
        dependents: {
          type: 'array',
          description: 'Dependent children — fields 6 through 9 and beyond',
          items: buildDefinitionReference('dependent'),
          minItems: 0,
          maxItems: 50,
        },
      },
    },

    // ─── Section IV — Financial Disclosure Election ─────────────────────────
    sectionIV: {
      type: 'object',
      additionalProperties: false,
      description: 'Section IV — Financial Disclosure Election',
      required: ['financialDisclosureElection'],
      properties: {
        financialDisclosureElection: {
          type: 'string',
          description: 'Whether the Veteran elects to provide financial details (YES = income-based copayment; NO = maximum copayment)',
          enum: ['yes', 'no'],
        },
      },
    },

    // ─── Care Type (pre-screen — drives Sections V and VI visibility) ────────
    careType: {
      type: 'string',
      description: 'Type of extended care: institutional (inpatient/nursing home, after 181+ days) or non-institutional (home-based, adult day health, etc.). Determines whether Sections V and VI are applicable.',
      enum: ['institutional', 'non_institutional'],
    },

    // ─── Section V — Fixed Assets ────────────────────────────────────────────
    sectionV: {
      type: 'object',
      additionalProperties: false,
      description: 'Section V — Fixed Assets. Applicable only for institutional care when financial disclosure = YES. N/A for non-institutional care.',
      properties: {
        applicable: {
          type: 'boolean',
          description: 'Whether Section V applies (true when care type = institutional and financial disclosure = yes)',
        },
        veteran: buildDefinitionReference('fixedAssetGroup'),
        spouse: buildDefinitionReference('fixedAssetGroup'),
      },
    },

    // ─── Section VI — Liquid Assets ──────────────────────────────────────────
    sectionVI: {
      type: 'object',
      additionalProperties: false,
      description: 'Section VI — Liquid Assets. Applicable only for institutional care when financial disclosure = YES. N/A for non-institutional care.',
      properties: {
        applicable: {
          type: 'boolean',
          description: 'Whether Section VI applies (true when care type = institutional and financial disclosure = yes)',
        },
        veteran: buildDefinitionReference('liquidAssetGroup'),
        spouse: buildDefinitionReference('liquidAssetGroup'),
      },
    },

    // ─── Section VII — Current Gross Income ──────────────────────────────────
    sectionVII: {
      type: 'object',
      additionalProperties: false,
      description: 'Section VII — Current Gross Income (Veteran and Spouse columns). Applicable when financial disclosure = YES.',
      properties: {
        veteran: buildDefinitionReference('incomeGroup'),
        spouse: buildDefinitionReference('incomeGroup'),
      },
    },

    // ─── Section VIII — Deductible Expenses ──────────────────────────────────
    sectionVIII: {
      type: 'object',
      additionalProperties: false,
      description: 'Section VIII — Deductible Expenses. Applicable when financial disclosure = YES. Average monthly over past 12 months unless otherwise specified.',
      properties: {
        educationalExpenses: {
          description: 'VIII.1 — Educational expenses (tuition, books, fees, materials) for Veteran, spouse, or dependents; monthly average',
          $ref: '#/definitions/currencyAmount',
        },
        funeralBurialExpenses: {
          description: 'VIII.2 — Funeral and burial expenses for spouse or child, including prepaid arrangements; monthly average',
          $ref: '#/definitions/currencyAmount',
        },
        rentMortgage: {
          type: 'object',
          additionalProperties: false,
          description: 'VIII.3 — Rent or mortgage payment for primary residence with frequency',
          properties: {
            amount: buildDefinitionReference('currencyAmount'),
            frequency: {
              type: ['string', 'null'],
              enum: ['monthly', 'annually', null],
            },
          },
        },
        utilities: {
          description: 'VIII.4 — Utilities for primary residence (electricity, gas, water, phone, internet); monthly average',
          $ref: '#/definitions/currencyAmount',
        },
        carPayment: {
          description: 'VIII.5 — Car payment for one vehicle; monthly amount',
          $ref: '#/definitions/currencyAmount',
        },
        food: {
          description: 'VIII.6 — Food expenses for Veteran, spouse, and dependents; monthly average',
          $ref: '#/definitions/currencyAmount',
        },
        nonReimbursedMedical: {
          description: 'VIII.7 — Non-reimbursed medical expenses (copayments, medications, Medicare premiums, health insurance premiums, hospital/nursing home expenses); monthly average',
          $ref: '#/definitions/currencyAmount',
        },
        courtOrderedPayments: {
          description: 'VIII.8 — Court-ordered payments (alimony, child support); monthly average',
          $ref: '#/definitions/currencyAmount',
        },
        insurancePremiums: {
          description: 'VIII.9 — Insurance premiums (automobile and homeowners only; life insurance excluded); monthly average',
          $ref: '#/definitions/currencyAmount',
        },
        taxesPaid: {
          description: 'VIII.10 — Taxes paid over past 12 months (personal property, home, automobile, income taxes); total annual amount',
          $ref: '#/definitions/currencyAmount',
        },
      },
    },

    // ─── Section IX + XI — Consent and Attestation ───────────────────────────
    sectionIXXIAttestation: {
      type: 'object',
      additionalProperties: false,
      description: 'Section IX (Consent to Copayment Agreement) and Section XI (Assignment of Benefits) — digital attestation block',
      required: ['attested', 'attestationTimestamp', 'attestedBy'],
      properties: {
        attested: {
          type: 'boolean',
          description: 'Veteran or authorized POA representative has checked the digital attestation checkbox under penalty of perjury (18 U.S.C. 287 and 1001) and consented to Assignment of Benefits (38 U.S.C. 1729, 42 U.S.C. 2651)',
          enum: [true],
        },
        attestationTimestamp: {
          type: 'string',
          description: 'ISO 8601 timestamp of attestation event',
          format: 'date-time',
        },
        attestedBy: {
          type: 'string',
          description: 'Whether the attestation was made by the Veteran or an authorized POA representative',
          enum: ['veteran', 'poa_representative'],
        },
      },
    },

    // ─── POA — Power of Attorney (optional flow) ──────────────────────────────
    poa: {
      type: 'object',
      additionalProperties: false,
      description: 'Power of Attorney submission metadata — applicable when submitter is an authorized POA representative, not the Veteran',
      required: ['isPoaSubmission'],
      properties: {
        isPoaSubmission: {
          type: 'boolean',
          description: 'Whether this application is being submitted by an authorized POA representative',
        },
        poaDocumentGuid: {
          type: ['string', 'null'],
          description: 'GUID of the uploaded POA document — required when isPoaSubmission = true',
          pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
        },
      },
    },

    // ─── Submission Metadata ──────────────────────────────────────────────────
    submissionMetadata: {
      type: 'object',
      additionalProperties: false,
      description: 'Metadata about this digital submission; populated by transformForSubmit before POST',
      required: ['formVersion', 'ombControlNumber', 'submissionSource'],
      properties: {
        formVersion: {
          type: 'string',
          description: 'Edition of the authoritative paper form',
          enum: ['MAY 2025'],
        },
        ombControlNumber: {
          type: 'string',
          description: 'OMB control number from the form header',
          enum: ['2900-0629'],
        },
        enrolledFacilityId: {
          type: 'string',
          description: 'VHA facility ID resolved from Enrollment System preferred_facility; used for routing',
          pattern: '^\\d{3,6}$',
        },
        submissionSource: {
          type: 'string',
          description: 'Originating system identifier',
          enum: ['va.gov_digital'],
        },
      },
    },
  },

  required: [
    'sectionI',
    'sectionII',
    'sectionIII',
    'sectionIV',
    'sectionIXXIAttestation',
    'poa',
    'submissionMetadata',
  ],
};

export default schema;