const buildDefinitionReference = referenceId => ({ $ref: `#/definitions/${referenceId}` });

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'VA Form 10-2850e',
  type: 'object',
  additionalProperties: false,
  definitions: {
    address: {
      type: 'object',
      additionalProperties: false,
      required: ['street', 'city', 'state', 'zipCode'],
      properties: {
        street: {
          type: 'string',
          maxLength: 100,
          example: '123 Main St',
        },
        street2: {
          type: 'string',
          maxLength: 50,
          example: 'Apt 4',
        },
        city: {
          type: 'string',
          maxLength: 100,
          example: 'Springfield',
        },
        state: {
          type: 'string',
          maxLength: 2,
          example: 'IL',
        },
        zipCode: {
          type: 'string',
          pattern: '^\\d{5}(-\\d{4})?$',
          example: '62701',
        },
      },
    },
    date: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      example: '2024-01-15',
    },
    phone: {
      type: 'string',
      pattern: '^(?:\\(?[2-9]\\d{2}\\)?[-. ]?){1}\\d{3}[-. ]?\\d{4}$',
      example: '555-867-5309',
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 256,
      example: 'provider@example.com',
    },
    ssn: {
      type: 'string',
      pattern: '^\\d{3}-?\\d{2}-?\\d{4}$',
      minLength: 9,
      maxLength: 11,
      example: '123-45-6789',
    },
    uploadedDocument: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
          maxLength: 255,
          example: 'rn_license_california_2024.pdf',
        },
        size: {
          type: 'integer',
          minimum: 1,
          example: 245891,
        },
        confirmationCode: {
          type: 'string',
          description: 'GUID returned by vets-api document upload endpoint after S3 staging',
          example: 'a3f9b2d1-4e58-4c21-88b9-3f9a12c45d67',
        },
      },
    },
    criminalEvent: {
      type: 'object',
      additionalProperties: false,
      properties: {
        offenseType: {
          type: 'string',
          maxLength: 200,
        },
        convictionDate: buildDefinitionReference('date'),
        jurisdiction: {
          type: 'string',
          maxLength: 200,
        },
        court: {
          type: 'string',
          maxLength: 200,
        },
        explanation: {
          type: 'string',
          maxLength: 3000,
        },
      },
    },
  },
  properties: {
    // ─── Chapter 1 — Applicant Information ───────────────────────────────────

    applicationType: {
      type: 'string',
      description: 'Type of appointment application being submitted',
      enum: ['initial', 'reappointment', 'transfer', 'temporary'],
    },

    occupationalCategory: {
      type: 'string',
      // ⚠️ Enum values unverified — must be set after official form PDF verification.
      // Placeholder values based on VHA credentialing standards; the "e" suffix
      // designation determines the exact occupational category.
      description: 'Primary professional occupational category — enum values require PDF verification',
      maxLength: 200,
    },

    personalInformation: {
      type: 'object',
      additionalProperties: false,
      description: 'Applicant legal name, SSN, date/place of birth',
      required: ['lastName', 'firstName', 'dateOfBirth', 'ssn'],
      properties: {
        lastName: {
          type: 'string',
          maxLength: 50,
          minLength: 1,
          example: 'Smith',
        },
        firstName: {
          type: 'string',
          maxLength: 50,
          minLength: 1,
          example: 'Jane',
        },
        middleName: {
          type: 'string',
          maxLength: 50,
          example: 'Marie',
        },
        suffix: {
          type: 'string',
          // ⚠️ Suffix list unverified — clinical suffixes may differ from standard VA.gov suffix list
          enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'MD', 'DO', 'PhD', 'NP', 'CRNA', 'RN', 'DNP'],
        },
        dateOfBirth: buildDefinitionReference('date'),
        ssn: buildDefinitionReference('ssn'),
        cityOfBirth: {
          type: 'string',
          maxLength: 100,
          example: 'Chicago',
        },
        stateOrCountryOfBirth: {
          type: 'string',
          maxLength: 100,
          example: 'IL',
        },
      },
    },

    contactInformation: {
      type: 'object',
      additionalProperties: false,
      description: 'Home address, mailing address, phone numbers, professional email',
      required: ['homeAddress', 'primaryPhone', 'professionalEmail'],
      properties: {
        homeAddress: buildDefinitionReference('address'),
        mailingAddressSameAsHome: {
          type: 'boolean',
        },
        mailingAddress: buildDefinitionReference('address'),
        primaryPhone: buildDefinitionReference('phone'),
        alternatePhone: buildDefinitionReference('phone'),
        professionalEmail: buildDefinitionReference('email'),
      },
    },

    citizenshipStatus: {
      type: 'object',
      additionalProperties: false,
      // ⚠️ Citizenship type enum values require verification against official form PDF
      description: 'Citizenship or work authorization status',
      properties: {
        citizenshipType: {
          type: 'string',
          // ⚠️ Exact enum values unverified
          enum: ['us-citizen', 'us-national', 'lawful-permanent-resident', 'work-authorized-nonimmigrant', 'other'],
        },
        visaType: {
          type: 'string',
          maxLength: 50,
          example: 'H-1B',
        },
        visaNumber: {
          type: 'string',
          maxLength: 50,
        },
        workAuthorizationDocumentType: {
          type: 'string',
          maxLength: 100,
        },
      },
    },

    veteranStatus: {
      type: 'object',
      additionalProperties: false,
      description: 'Whether applicant is a Veteran; service details for preference eligibility',
      properties: {
        isVeteran: {
          type: 'boolean',
        },
        branchOfService: {
          type: 'string',
          maxLength: 100,
          example: 'United States Army',
        },
        dischargeDate: buildDefinitionReference('date'),
        characterOfDischarge: {
          // ⚠️ Exact enum values unverified against form PDF
          type: 'string',
          enum: ['honorable', 'general', 'other-than-honorable', 'bad-conduct', 'dishonorable', 'uncharacterized'],
        },
      },
    },

    // ─── Chapter 2 — Licensure ────────────────────────────────────────────────

    professionalLicenses: {
      type: 'array',
      description: 'All professional licenses ever held — must include all states and jurisdictions',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['licenseType', 'issuingState', 'licenseNumber', 'issueDate', 'licenseStatus'],
        properties: {
          licenseType: {
            // ⚠️ Enum values unverified — depend on occupational category designated by "e" suffix
            type: 'string',
            maxLength: 200,
            description: 'Type of professional license — enum values require PDF verification',
          },
          issuingState: {
            type: 'string',
            maxLength: 100,
            example: 'CA',
          },
          licenseNumber: {
            type: 'string',
            maxLength: 50,
            minLength: 1,
            example: 'RN123456',
          },
          issueDate: buildDefinitionReference('date'),
          expirationDate: buildDefinitionReference('date'),
          licenseStatus: {
            type: 'string',
            enum: ['active', 'active-restricted', 'inactive', 'expired', 'surrendered', 'revoked', 'suspended'],
          },
          restrictionExplanation: {
            type: 'string',
            maxLength: 2000,
          },
        },
      },
    },

    boardCertifications: {
      type: 'array',
      description: 'Board certifications held by the applicant',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          certifyingBoard: {
            // ⚠️ Enum values unverified — must include boards relevant to occupational category
            type: 'string',
            maxLength: 200,
            description: 'Certifying board or organization — enum values require PDF verification',
          },
          certifyingBoardOther: {
            type: 'string',
            maxLength: 200,
          },
          specialty: {
            type: 'string',
            maxLength: 200,
            example: 'Critical Care Nursing',
          },
          certificationNumber: {
            type: 'string',
            maxLength: 50,
          },
          initialCertificationDate: buildDefinitionReference('date'),
          expirationDate: buildDefinitionReference('date'),
          certificationStatus: {
            type: 'string',
            enum: ['current', 'pending', 'lapsed', 'revoked'],
          },
          anticipatedCertificationDate: buildDefinitionReference('date'),
          statusExplanation: {
            type: 'string',
            maxLength: 1000,
          },
        },
      },
    },

    deaRegistration: {
      type: 'object',
      additionalProperties: false,
      description: 'DEA controlled substance registration information',
      properties: {
        deaApplicable: {
          type: 'string',
          enum: ['yes-current', 'yes-required', 'no-not-applicable'],
        },
        deaNumber: {
          type: 'string',
          // Standard DEA number format: two letters followed by 7 digits
          pattern: '^[A-Z]{2}\\d{7}$',
          example: 'AB1234567',
        },
        authorizedSchedules: {
          type: 'array',
          items: {
            type: 'string',
            // ⚠️ Schedule I intentionally excluded; not applicable to clinical practitioners
            enum: ['II', 'III', 'IV', 'V'],
          },
        },
        deaIssueDate: buildDefinitionReference('date'),
        deaExpirationDate: buildDefinitionReference('date'),
        deaState: {
          type: 'string',
          maxLength: 100,
          example: 'CA',
        },
      },
    },

    // ─── Chapter 3 — Education & Training ────────────────────────────────────

    education: {
      type: 'object',
      additionalProperties: false,
      description: 'Professional degree and postgraduate training history',
      properties: {
        graduateDegree: {
          type: 'object',
          additionalProperties: false,
          required: ['institutionName', 'degreeType', 'fieldOfStudy', 'graduationDate'],
          properties: {
            institutionName: {
              type: 'string',
              maxLength: 200,
              minLength: 1,
              example: 'University of Illinois at Chicago College of Nursing',
            },
            degreeType: {
              // ⚠️ Enum values unverified — must include degrees relevant to occupational category
              type: 'string',
              maxLength: 100,
              description: 'Degree type — enum values require PDF verification',
            },
            fieldOfStudy: {
              type: 'string',
              maxLength: 200,
              example: 'Nurse Anesthesia',
            },
            graduationDate: buildDefinitionReference('date'),
            institutionCity: {
              type: 'string',
              maxLength: 100,
              example: 'Chicago',
            },
            institutionStateOrCountry: {
              type: 'string',
              maxLength: 100,
              example: 'IL',
            },
          },
        },
        postgraduateTraining: {
          type: 'array',
          description: 'Residency, fellowship, internship, and other postgraduate training programs',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['trainingType', 'programName', 'sponsoringInstitution', 'startDate', 'completionStatus'],
            properties: {
              trainingType: {
                // ⚠️ Exact enum values unverified against form PDF
                type: 'string',
                enum: ['internship', 'residency', 'fellowship', 'clinical-practicum', 'other'],
              },
              programName: {
                type: 'string',
                maxLength: 200,
                minLength: 1,
              },
              sponsoringInstitution: {
                type: 'string',
                maxLength: 200,
                minLength: 1,
              },
              specialty: {
                type: 'string',
                maxLength: 200,
              },
              startDate: buildDefinitionReference('date'),
              endDate: buildDefinitionReference('date'),
              completionStatus: {
                type: 'string',
                enum: ['completed', 'in-progress', 'did-not-complete'],
              },
              nonCompletionExplanation: {
                type: 'string',
                maxLength: 1000,
              },
            },
          },
        },
      },
    },

    // ─── Chapter 4 — Employment History ──────────────────────────────────────

    employmentHistory: {
      type: 'array',
      description: 'All positions held in the past 10 years — ⚠️ verify timeframe against form PDF',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['employerName', 'employerCity', 'employerState', 'positionTitle', 'startDate'],
        properties: {
          employerName: {
            type: 'string',
            maxLength: 200,
            minLength: 1,
            example: 'University of Chicago Medical Center',
          },
          employerStreetAddress: {
            type: 'string',
            maxLength: 200,
            example: '5841 S Maryland Ave',
          },
          employerCity: {
            type: 'string',
            maxLength: 100,
            example: 'Chicago',
          },
          employerState: {
            type: 'string',
            maxLength: 100,
            example: 'IL',
          },
          positionTitle: {
            type: 'string',
            maxLength: 200,
            minLength: 1,
            example: 'Staff Nurse Anesthetist',
          },
          department: {
            type: 'string',
            maxLength: 200,
            example: 'Anesthesiology',
          },
          startDate: buildDefinitionReference('date'),
          endDate: buildDefinitionReference('date'),
          isCurrentPosition: {
            type: 'boolean',
          },
          reasonForLeaving: {
            type: 'string',
            maxLength: 500,
          },
          hoursPerWeek: {
            type: 'number',
            minimum: 0.1,
            maximum: 168,
            example: 40,
          },
        },
      },
    },

    employmentGapExplanations: {
      type: 'array',
      description: 'Explanations for employment gaps of 30 or more days — ⚠️ verify threshold against form PDF',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['gapStartDate', 'gapEndDate', 'explanation'],
        properties: {
          gapStartDate: buildDefinitionReference('date'),
          gapEndDate: buildDefinitionReference('date'),
          explanation: {
            type: 'string',
            maxLength: 1000,
            minLength: 10,
          },
        },
      },
    },

    professionalReferences: {
      type: 'array',
      description: 'Professional references — minimum 3 required; ⚠️ verify minimum count against form PDF',
      minItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['lastName', 'firstName', 'professionalTitle', 'institution', 'phone', 'email', 'relationship'],
        properties: {
          lastName: {
            type: 'string',
            maxLength: 50,
            minLength: 1,
          },
          firstName: {
            type: 'string',
            maxLength: 50,
            minLength: 1,
          },
          professionalTitle: {
            type: 'string',
            maxLength: 200,
            minLength: 1,
            example: 'Director of Nursing, MSN, RN',
          },
          institution: {
            type: 'string',
            maxLength: 200,
            minLength: 1,
          },
          phone: buildDefinitionReference('phone'),
          email: buildDefinitionReference('email'),
          relationship: {
            // ⚠️ Enum values unverified against form PDF
            type: 'string',
            enum: ['direct-supervisor', 'peer-colleague', 'department-chair', 'training-program-director', 'other-professional'],
          },
          yearsKnown: {
            type: 'integer',
            minimum: 0,
            maximum: 60,
          },
        },
      },
    },

    // ─── Chapter 5 — Adverse History Disclosure ──────────────────────────────

    adverseHistory: {
      type: 'object',
      additionalProperties: false,
      description: 'Adverse licensure, malpractice, clinical privileges, DEA, criminal, and federal exclusion disclosures',
      required: [
        'adverseLicensureActions',
        'malpracticeHistory',
        'clinicalPrivilegesAdverse',
        'deaRegistrationAdverse',
        'criminalHistory',
        'federalExclusion',
      ],
      properties: {
        adverseLicensureActions: {
          type: 'object',
          additionalProperties: false,
          required: ['hasAdverseLicensureActions'],
          properties: {
            hasAdverseLicensureActions: {
              type: 'boolean',
            },
            actions: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['actionType', 'stateOrJurisdiction', 'actionDate', 'explanation'],
                properties: {
                  actionType: {
                    // ⚠️ Enum values unverified against form PDF
                    type: 'string',
                    enum: [
                      'denial-of-initial-application',
                      'restriction-limitation',
                      'probation',
                      'suspension',
                      'revocation',
                      'voluntary-surrender-non-disciplinary',
                      'voluntary-surrender-disciplinary',
                      'other',
                    ],
                  },
                  stateOrJurisdiction: {
                    type: 'string',
                    maxLength: 100,
                  },
                  actionDate: buildDefinitionReference('date'),
                  explanation: {
                    type: 'string',
                    maxLength: 3000,
                    minLength: 10,
                  },
                  currentStatus: {
                    type: 'string',
                    enum: ['resolved', 'ongoing'],
                  },
                },
              },
            },
          },
        },

        malpracticeHistory: {
          type: 'object',
          additionalProperties: false,
          required: ['hasMalpracticeHistory'],
          properties: {
            hasMalpracticeHistory: {
              type: 'boolean',
            },
            claims: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['incidentDate', 'allegationType', 'outcome', 'explanation'],
                properties: {
                  incidentDate: buildDefinitionReference('date'),
                  claimFiledDate: buildDefinitionReference('date'),
                  allegationType: {
                    // ⚠️ Exact allegation type enum values require form PDF verification
                    type: 'string',
                    maxLength: 200,
                    description: 'Primary allegation type — enum values require PDF verification',
                  },
                  outcome: {
                    type: 'string',
                    enum: ['pending', 'dismissed', 'settled', 'judgmentForPlaintiff', 'judgmentForDefendant'],
                  },
                  settlementAmount: {
                    type: 'number',
                    minimum: 0,
                    description: 'Total amount paid in settlement or judgment in US dollars',
                  },
                  explanation: {
                    type: 'string',
                    maxLength: 3000,
                    minLength: 10,
                  },
                },
              },
            },
          },
        },

        clinicalPrivilegesAdverse: {
          type: 'object',
          additionalProperties: false,
          required: ['hasAdversePrivilegesHistory'],
          properties: {
            hasAdversePrivilegesHistory: {
              type: 'boolean',
            },
            actionDate: buildDefinitionReference('date'),
            explanation: {
              type: 'string',
              maxLength: 3000,
            },
          },
        },

        deaRegistrationAdverse: {
          type: 'object',
          additionalProperties: false,
          required: ['hasAdverseDeaHistory'],
          properties: {
            hasAdverseDeaHistory: {
              type: 'boolean',
            },
            actionDate: buildDefinitionReference('date'),
            explanation: {
              type: 'string',
              maxLength: 3000,
            },
          },
        },

        criminalHistory: {
          type: 'object',
          additionalProperties: false,
          required: ['hasFelonyConviction', 'hasMisdemeanorConviction'],
          properties: {
            hasFelonyConviction: {
              type: 'boolean',
            },
            felonyDetails: {
              type: 'array',
              items: buildDefinitionReference('criminalEvent'),
            },
            hasMisdemeanorConviction: {
              type: 'boolean',
            },
            misdemeanorDetails: {
              type: 'array',
              items: buildDefinitionReference('criminalEvent'),
            },
          },
        },

        federalExclusion: {
          type: 'object',
          additionalProperties: false,
          required: ['isCurrentlyExcluded'],
          properties: {
            isCurrentlyExcluded: {
              type: 'boolean',
              description: 'Whether applicant is currently on the HHS OIG exclusion list or SAM.gov excluded parties list',
            },
          },
        },
      },
    },

    // ─── Chapter 6 — Supporting Documents ────────────────────────────────────

    supportingDocuments: {
      type: 'object',
      additionalProperties: false,
      description: 'Uploaded supporting documents; each entry stores the S3 confirmationCode returned by the upload endpoint',
      properties: {
        licenseDocuments: {
          type: 'array',
          description: 'Copies of all current professional licenses listed in Chapter 2',
          items: buildDefinitionReference('uploadedDocument'),
        },
        deaCertificate: {
          // Conditional — present only when deaRegistration.deaApplicable = 'yes-current'
          ...buildDefinitionReference('uploadedDocument'),
          description: 'DEA registration certificate — conditional on deaApplicable = yes-current',
        },
        boardCertificationDocuments: {
          type: 'array',
          description: 'Board certification certificates — conditional on boardCertifications being non-empty',
          items: buildDefinitionReference('uploadedDocument'),
        },
        malpracticeInsuranceCertificate: {
          // ⚠️ Verify whether malpractice insurance certificate is required at submission or collected separately
          ...buildDefinitionReference('uploadedDocument'),
          description: 'Current malpractice insurance certificate — ⚠️ verify requirement with VHA OHRM',
        },
        adverseHistoryDocuments: {
          type: 'array',
          description: 'Supporting documentation for adverse history disclosures — conditional on any adverse YES',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              document: buildDefinitionReference('uploadedDocument'),
              description: {
                type: 'string',
                maxLength: 500,
              },
            },
          },
        },
        otherDocuments: {
          type: 'array',
          description: 'Additional required documents (diploma, training certificates, work authorization)',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              document: buildDefinitionReference('uploadedDocument'),
              description: {
                type: 'string',
                maxLength: 500,
              },
            },
          },
        },
      },
    },

    // ─── Chapter 7 — Appointment Details ─────────────────────────────────────

    appointmentDetails: {
      type: 'object',
      additionalProperties: false,
      description: 'Target VA facility, position, and appointment type',
      required: ['facilityId', 'positionTitle', 'appointmentType'],
      properties: {
        facilityId: {
          type: 'string',
          description: 'VA facility station ID from the pilot VAMC list',
          maxLength: 20,
          example: '636',
        },
        facilityName: {
          type: 'string',
          maxLength: 200,
          example: 'Jesse Brown VA Medical Center',
        },
        positionTitle: {
          type: 'string',
          maxLength: 200,
          minLength: 1,
          example: 'Certified Registered Nurse Anesthetist',
        },
        department: {
          type: 'string',
          maxLength: 200,
          example: 'Anesthesiology Service',
        },
        appointmentType: {
          // ⚠️ Enum values should be verified against official form PDF
          type: 'string',
          enum: ['full-time-permanent', 'part-time-permanent', 'temporary-full-time', 'fee-basis', 'without-compensation'],
        },
        requestedStartDate: buildDefinitionReference('date'),
        priorVaFacility: {
          type: 'string',
          maxLength: 200,
          description: 'Prior VA facility name — required only for transfer applicants',
        },
      },
    },

    // ─── Chapter 8 — Attestation & Electronic Signature ──────────────────────

    attestation: {
      type: 'object',
      additionalProperties: false,
      description: 'Applicant certification, authorizations, and electronic signature',
      required: [
        'certifiesAccuracy',
        'authorizesBackgroundInvestigation',
        'authorizesReleaseOfInformation',
        'acknowledgesNpdbQuery',
        'electronicSignatureName',
        'signatureDate',
      ],
      properties: {
        certifiesAccuracy: {
          type: 'boolean',
          // Must be true to submit
          enum: [true],
          description: 'Applicant certifies all information is true, accurate, and complete',
        },
        authorizesBackgroundInvestigation: {
          type: 'boolean',
          // Must be true to submit
          enum: [true],
          description: 'Applicant authorizes VA to conduct background investigation including NACI',
        },
        authorizesReleaseOfInformation: {
          type: 'boolean',
          // Must be true to submit
          enum: [true],
          description: 'Applicant authorizes release of information from prior employers, boards, and institutions',
        },
        acknowledgesNpdbQuery: {
          type: 'boolean',
          // Must be true to submit
          enum: [true],
          description: 'Applicant acknowledges VA will query the National Practitioner Data Bank',
        },
        electronicSignatureName: {
          type: 'string',
          minLength: 2,
          maxLength: 150,
          description: 'Typed full legal name serving as electronic signature — must match personalInformation name fields',
          example: 'Jane Marie Smith',
        },
        signatureDate: {
          type: 'string',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
          description: 'Date of electronic signature — must not be in the future and not more than 7 days in the past',
        },
      },
    },
  },

  required: [
    'applicationType',
    'occupationalCategory',
    'personalInformation',
    'contactInformation',
    'professionalLicenses',
    'employmentHistory',
    'professionalReferences',
    'adverseHistory',
    'appointmentDetails',
    'attestation',
  ],
};

export default schema;