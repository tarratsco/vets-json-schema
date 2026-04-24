const buildDefinitionReference = referenceId => ({ $ref: `#/definitions/${referenceId}` });

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  additionalProperties: false,

  definitions: {
    fullName: {
      type: 'object',
      properties: {
        lastName: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
        firstName: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
        middleName: {
          type: 'string',
          maxLength: 50,
        },
        otherNamesUsed: {
          type: 'string',
          maxLength: 200,
        },
      },
      required: ['lastName', 'firstName'],
    },

    address: {
      type: 'object',
      properties: {
        street1: {
          type: 'string',
          maxLength: 100,
        },
        street2: {
          type: 'string',
          maxLength: 100,
        },
        city: {
          type: 'string',
          maxLength: 100,
        },
        state: {
          type: 'string',
          maxLength: 50,
          enum: [
            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
            'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
            'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
            'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
            'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
            'WY', 'AS', 'GU', 'MP', 'PR', 'VI',
          ],
        },
        zipCode: {
          type: 'string',
          pattern: '^\\d{5}(-\\d{4})?$',
          maxLength: 10,
        },
      },
      required: ['street1', 'city', 'state', 'zipCode'],
    },

    ssn: {
      type: 'string',
      pattern: '^\\d{3}-?\\d{2}-?\\d{4}$',
      minLength: 9,
      maxLength: 11,
    },

    date: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    },

    phone: {
      type: 'string',
      pattern: '^\\d{10}$',
      minLength: 10,
      maxLength: 10,
    },

    email: {
      type: 'string',
      format: 'email',
      maxLength: 254,
    },

    yesNo: {
      type: 'string',
      enum: ['Y', 'N'],
    },

    issuingState: {
      type: 'string',
      enum: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
        'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
        'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
        'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
        'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
        'WY', 'AS', 'GU', 'MP', 'PR', 'VI', 'DEA_FEDERAL',
      ],
    },

    currentLicense: {
      type: 'object',
      properties: {
        licenseType: {
          type: 'string',
          maxLength: 100,
        },
        licenseNumber: {
          type: 'string',
          maxLength: 50,
        },
        issuingState: buildDefinitionReference('issuingState'),
        expirationDate: buildDefinitionReference('date'),
      },
      required: ['licenseType', 'licenseNumber', 'issuingState', 'expirationDate'],
    },

    priorLicense: {
      type: 'object',
      properties: {
        licenseType: {
          type: 'string',
          maxLength: 100,
        },
        licenseNumber: {
          type: 'string',
          maxLength: 50,
        },
        issuingState: buildDefinitionReference('issuingState'),
        expirationDate: buildDefinitionReference('date'),
      },
      required: ['licenseType', 'licenseNumber', 'issuingState', 'expirationDate'],
    },

    educationEntry: {
      type: 'object',
      properties: {
        schoolName: {
          type: 'string',
          maxLength: 200,
        },
        city: {
          type: 'string',
          maxLength: 100,
        },
        state: {
          type: 'string',
          maxLength: 100,
        },
        zipCode: {
          type: 'string',
          maxLength: 10,
        },
        startDate: buildDefinitionReference('date'),
        completionDate: buildDefinitionReference('date'),
        degreeType: {
          type: 'string',
          maxLength: 100,
        },
        majorFieldOfStudy: {
          type: 'string',
          maxLength: 100,
        },
      },
      required: ['schoolName', 'city', 'startDate', 'completionDate', 'degreeType', 'majorFieldOfStudy'],
    },

    trainingEntry: {
      type: 'object',
      properties: {
        institutionName: {
          type: 'string',
          maxLength: 200,
        },
        city: {
          type: 'string',
          maxLength: 100,
        },
        stateOrCountry: {
          type: 'string',
          maxLength: 100,
        },
        specialty: {
          type: 'string',
          maxLength: 100,
        },
        startDate: buildDefinitionReference('date'),
        completionDate: buildDefinitionReference('date'),
        monthsCompleted: {
          type: 'integer',
          minimum: 0,
          maximum: 120,
        },
      },
      required: ['institutionName', 'city', 'specialty', 'startDate', 'completionDate', 'monthsCompleted'],
    },

    documentToken: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
  },

  properties: {

    // ─── Chapter 1: Applicant Information (Section I) ────────────────────────

    applicantInformation: {
      type: 'object',
      description: 'Section I: Applicant Information (Items 1A–7D)',
      properties: {

        // Items 1A–1B: Name
        lastName: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
        firstName: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
        middleName: {
          type: 'string',
          maxLength: 50,
        },
        otherNamesUsed: {
          type: 'string',
          maxLength: 200,
        },

        // Item 2: Present Address
        presentAddressStreet1: {
          type: 'string',
          maxLength: 100,
        },
        presentAddressStreet2: {
          type: 'string',
          maxLength: 100,
        },
        presentAddressCity: {
          type: 'string',
          maxLength: 100,
        },
        presentAddressState: {
          type: 'string',
          enum: [
            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
            'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
            'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
            'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
            'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
            'WY', 'AS', 'GU', 'MP', 'PR', 'VI',
          ],
        },
        presentAddressZip: {
          type: 'string',
          pattern: '^\\d{5}(-\\d{4})?$',
          maxLength: 10,
        },

        // Items 3A–3B: Phone Numbers
        primaryPhone: buildDefinitionReference('phone'),
        alternatePhone: buildDefinitionReference('phone'),

        // Items 5A–5B: Email Addresses
        primaryEmail: buildDefinitionReference('email'),
        alternateEmail: buildDefinitionReference('email'),

        // Item 4: Social Security Number
        ssn: buildDefinitionReference('ssn'),

        // Item 6: Date of Birth
        dateOfBirth: buildDefinitionReference('date'),

        // Items 7A–7D: VA Training Facility and Dates
        vaTrainingFacilityCity: {
          type: 'string',
          maxLength: 100,
        },
        vaTrainingFacilityState: {
          type: 'string',
          maxLength: 50,
        },
        vaTrainingFacilityId: {
          type: 'string',
          maxLength: 10,
        },
        vaTrainingStartDate: buildDefinitionReference('date'),
        vaTrainingEndDate: buildDefinitionReference('date'),
        everEmployedOrAffiliatedWithVaOrFederal: buildDefinitionReference('yesNo'),
      },
      required: [
        'lastName',
        'firstName',
        'presentAddressStreet1',
        'presentAddressCity',
        'presentAddressState',
        'presentAddressZip',
        'primaryPhone',
        'primaryEmail',
        'ssn',
        'dateOfBirth',
        'vaTrainingFacilityCity',
        'vaTrainingFacilityState',
        'vaTrainingStartDate',
        'vaTrainingEndDate',
        'everEmployedOrAffiliatedWithVaOrFederal',
      ],
    },

    // ─── Chapter 2: Military Duty Status (Section II) ────────────────────────

    militaryStatus: {
      type: 'object',
      description: 'Section II: Military Duty Status (Items 8A–8C)',
      properties: {
        currentlyInUsMilitary: buildDefinitionReference('yesNo'),
        inReservesOrNationalGuard: buildDefinitionReference('yesNo'),
        branchOfService: {
          type: 'string',
          enum: [
            'Army',
            'Navy',
            'Marine Corps',
            'Air Force',
            'Space Force',
            'Coast Guard',
            'National Guard (Army)',
            'National Guard (Air)',
          ],
        },
      },
      required: ['currentlyInUsMilitary', 'inReservesOrNationalGuard'],
    },

    // ─── Chapter 3: Citizenship (Section III) ────────────────────────────────

    citizenship: {
      type: 'object',
      description: 'Section III: Citizenship and Immigration Status (Items 9A–10D)',
      properties: {

        // Items 9A–9C
        citizenshipStatus: {
          type: 'string',
          enum: ['US_BIRTH', 'NATURALIZED', 'NOT_US'],
        },
        placeOfBirth: {
          type: 'string',
          maxLength: 100,
        },
        countryOfCitizenship: {
          type: 'string',
          maxLength: 100,
        },

        // Visa category routing selector (digital-only field, not a PDF item number)
        visaCategory: {
          type: 'string',
          enum: ['IMMIGRANT', 'EXCHANGE_VISITOR', 'OTHER_NONIMMIGRANT'],
        },

        // Item 10A: Immigrant Visa
        immigrantVisaANumber: {
          type: 'string',
          pattern: '^A\\d{7,9}$',
          maxLength: 11,
        },
        immigrantVisaIssueDate: buildDefinitionReference('date'),
        immigrantVisaExpirationDate: buildDefinitionReference('date'),

        // Item 10B: Exchange Visitor (J-1/J-2) Visa
        exchangeVisitorVisaType: {
          type: 'string',
          maxLength: 10,
        },
        exchangeVisitorVisaNumber: {
          type: 'string',
          pattern: '^\\d{8}$',
          maxLength: 8,
        },
        exchangeVisitorVisaIssueDate: buildDefinitionReference('date'),
        exchangeVisitorVisaExpirationDate: buildDefinitionReference('date'),

        // Item 10C: Other Non-Immigrant Visa
        otherNonimmigrantVisaType: {
          type: 'string',
          maxLength: 10,
        },
        otherNonimmigrantVisaNumber: {
          type: 'string',
          maxLength: 20,
        },
        otherNonimmigrantVisaIssueDate: buildDefinitionReference('date'),
        otherNonimmigrantVisaExpirationDate: buildDefinitionReference('date'),

        // Item 10D: DS-2019
        hasValidDs2019: buildDefinitionReference('yesNo'),
        ds2019LastValidationDate: buildDefinitionReference('date'),
      },
      required: ['citizenshipStatus', 'countryOfCitizenship'],
    },

    // ─── Chapter 4: Licenses and Credentials (Sections V–VI + Items 15–17) ──

    licensesAndCredentials: {
      type: 'object',
      description: 'Sections V–VI: Current and Prior Licensure; Items 15–17: NPI and Adverse History',
      properties: {

        // Items 13A–13D: Current Licenses (repeating)
        currentLicenses: {
          type: 'array',
          minItems: 0,
          items: buildDefinitionReference('currentLicense'),
        },

        // Items 14A–14D: Prior Licenses (repeating)
        priorLicenses: {
          type: 'array',
          minItems: 0,
          items: buildDefinitionReference('priorLicense'),
        },

        // Item 15: NPI
        npi: {
          type: 'string',
          pattern: '^\\d{10}$',
          minLength: 10,
          maxLength: 10,
        },

        // Item 16: License Action History
        licenseActionHistory: buildDefinitionReference('yesNo'),

        // Item 17: Clinical Privilege Action History
        clinicalPrivilegeActionHistory: buildDefinitionReference('yesNo'),

        // Section XI explanation for Items 16/17 (conditional)
        licenseAdverseExplanation: {
          type: 'string',
          minLength: 50,
          maxLength: 4000,
        },

        // Supporting document tokens for adverse licensure explanation (conditional)
        licenseAdverseSupportingDocumentTokens: {
          type: 'array',
          minItems: 0,
          maxItems: 5,
          items: buildDefinitionReference('documentToken'),
        },
      },
      required: ['licenseActionHistory', 'clinicalPrivilegeActionHistory'],
    },

    // ─── Chapter 5: Education (Sections VII–VIII) ────────────────────────────

    education: {
      type: 'object',
      description: 'Section VII: Education History (Items 18A–18F); Section VIII: International Medical School (Items 19A–19C)',
      properties: {

        // Items 18A–18F: Education History (repeating, minimum 1 entry)
        educationHistory: {
          type: 'array',
          minItems: 1,
          items: buildDefinitionReference('educationEntry'),
        },

        // Item 19A: International Medical School Graduate
        internationalMedicalSchoolGraduate: buildDefinitionReference('yesNo'),

        // Item 19B: ECFMG Certificate Number (conditional)
        ecfmgCertificateNumber: {
          type: 'string',
          maxLength: 20,
        },

        // Item 19C: ECFMG Certificate Date (conditional)
        ecfmgCertificateDate: buildDefinitionReference('date'),
      },
      required: ['educationHistory', 'internationalMedicalSchoolGraduate'],
    },

    // ─── Chapter 6: Training History (Section IX) ────────────────────────────

    trainingHistory: {
      type: 'object',
      description: 'Section IX: Internship, Residency, and Fellowship Training History (Items 20A–20F)',
      properties: {

        // Items 20A–20F: Training History (repeating)
        trainingHistory: {
          type: 'array',
          minItems: 0,
          items: buildDefinitionReference('trainingEntry'),
        },
      },
      required: [],
    },

    // ─── Chapter 7: Additional Questions (Section X + Section XI general) ────

    additionalQuestions: {
      type: 'object',
      description: 'Section X: Medicare/Medicaid Fraud and Malpractice History (Items 21–22); Section XI: General Remarks',
      properties: {

        // Item 21: Medicare/Medicaid Fraud History
        medicaidFraudHistory: buildDefinitionReference('yesNo'),

        // Item 22: Malpractice History
        malpracticeHistory: buildDefinitionReference('yesNo'),

        // Section XI explanation for Items 21/22 (conditional)
        fraudMalpracticeExplanation: {
          type: 'string',
          minLength: 50,
          maxLength: 4000,
        },

        // Supporting document tokens for fraud/malpractice explanation (conditional)
        fraudMalpracticeSupportingDocumentTokens: {
          type: 'array',
          minItems: 0,
          maxItems: 5,
          items: buildDefinitionReference('documentToken'),
        },

        // Section XI: General Remarks
        generalRemarks: {
          type: 'string',
          maxLength: 4000,
        },
      },
      required: ['medicaidFraudHistory', 'malpracticeHistory'],
    },

    // ─── Chapter 8: Certification and Authorization (Section XII) ────────────

    certification: {
      type: 'object',
      description: 'Section XII: Trainee Certification (Item 23A–23B)',
      properties: {

        // Item 23A: Trainee Certification acknowledgment
        traineeCertification: {
          type: 'boolean',
        },

        // Item 23B: Date of certification (server-side — client value used only for display)
        traineeCertificationDate: buildDefinitionReference('date'),
      },
      required: ['traineeCertification', 'traineeCertificationDate'],
    },

    authorization: {
      type: 'object',
      description: 'Authorization for Release of Information (page 4 of form — separate electronic signature event)',
      properties: {

        // Clause 1: Authorize VA inquiries to employers, educational institutions, licensing boards, etc.
        authorizationInquiries: {
          type: 'boolean',
        },

        // Clause 2: Authorize release of records and documents to VA
        authorizationRelease: {
          type: 'boolean',
        },

        // Clause 3: Release from liability for those who provide information in good faith
        authorizationLiabilityRelease: {
          type: 'boolean',
        },

        // Clause 4: Authorize VA to disclose identifying information to enable inquiries
        authorizationDisclose: {
          type: 'boolean',
        },

        // Clause 5: Authorize VA to share information with affiliated institution
        authorizationShareAffiliated: {
          type: 'boolean',
        },

        // Authorization date (server-side — client value used only for display)
        authorizationDate: buildDefinitionReference('date'),
      },
      required: [
        'authorizationInquiries',
        'authorizationRelease',
        'authorizationLiabilityRelease',
        'authorizationDisclose',
        'authorizationShareAffiliated',
        'authorizationDate',
      ],
    },
  },

  required: [
    'applicantInformation',
    'militaryStatus',
    'citizenship',
    'licensesAndCredentials',
    'education',
    'trainingHistory',
    'additionalQuestions',
    'certification',
    'authorization',
  ],
};

export default schema;