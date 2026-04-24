const buildDefinitionReference = referenceId => ({ $ref: `#/definitions/${referenceId}` });

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'VA Form 22-1999b — Enrollment Change / Termination Certification',
  type: 'object',
  additionalProperties: false,

  definitions: {
    // Reusable: full name object
    fullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
          maxLength: 50,
          example: 'Jane',
        },
        last: {
          type: 'string',
          maxLength: 60,
          example: 'Smith',
        },
      },
      required: ['first', 'last'],
    },

    // Reusable: ISO 8601 date string (YYYY-MM-DD)
    date: {
      type: 'string',
      format: 'date',
      example: '2025-01-15',
      description: 'ISO 8601 date: YYYY-MM-DD',
    },

    // Reusable: US phone number — normalized 10-digit string
    usPhone: {
      type: 'string',
      pattern: '^\\d{10}$',
      minLength: 10,
      maxLength: 10,
      example: '5558675309',
      description: 'Normalized 10-digit US phone number; dashes/parens stripped before submission.',
    },

    // Reusable: email address
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255,
      example: 'certifying.official@university.edu',
    },

    // Reusable: Social Security Number — 9 digits, dashes stripped
    ssn: {
      type: 'string',
      pattern: '^\\d{9}$',
      minLength: 9,
      maxLength: 9,
      example: '123456789',
      description: '9-digit SSN, dashes stripped. Encrypted in transit and at rest.',
    },

    // Reusable: VA Facility Code — exactly 8 numeric digits
    facilityCode: {
      type: 'string',
      pattern: '^\\d{8}$',
      minLength: 8,
      maxLength: 8,
      example: '31000123',
      description: 'VA Facility Code — 8 numeric digits. Source: WEAMS.',
    },

    // Reusable: US state abbreviation (2-letter)
    usState: {
      type: 'string',
      pattern: '^[A-Z]{2}$',
      minLength: 2,
      maxLength: 2,
      example: 'VA',
    },

    // Reusable: US ZIP code (5-digit or ZIP+4)
    usZip: {
      type: 'string',
      pattern: '^\\d{5}(-\\d{4})?$',
      example: '20190',
    },

    // Reusable: mailing / institution address
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
          maxLength: 100,
          example: '123 University Ave',
        },
        city: {
          type: 'string',
          maxLength: 60,
          example: 'Richmond',
        },
        state: buildDefinitionReference('usState'),
        zip: buildDefinitionReference('usZip'),
      },
    },

    // Reusable: GI Bill benefit chapter enum
    benefitChapter: {
      type: 'string',
      enum: [
        'chapter_33',    // Post-9/11 GI Bill
        'chapter_30',    // Montgomery GI Bill — Active Duty
        'chapter_35',    // Survivors' and Dependents' Educational Assistance
        'chapter_1606',  // Montgomery GI Bill — Selected Reserve
        'chapter_1607',  // Reserve Educational Assistance Program (REAP — suspended; verify)
      ],
      description: 'GI Bill benefit chapter. NOTE: Chapter 1607 (REAP) was suspended — verify whether still valid for change certifications on existing enrollments.',
    },

    // Reusable: enrollment type (training time)
    enrollmentType: {
      type: 'string',
      enum: [
        'full_time',
        'three_quarter_time',
        'half_time',
        'less_than_half_time',
      ],
      description: 'Enrollment training time classification.',
    },

    // Reusable: credit hours integer
    creditHours: {
      type: 'integer',
      minimum: 0,
      maximum: 99,
      description: 'Number of credit hours (or clock hours for non-standard programs).',
    },

    // Reusable: UUID string (for document GUIDs)
    uuid: {
      type: 'string',
      format: 'uuid',
      description: 'RFC 4122 UUID.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Top-level properties mirror the four logical chapters of the form plus
  // the attestation field required on the Review and Submit screen.
  // ─────────────────────────────────────────────────────────────────────────
  properties: {

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPTER 1 — Institution and SCO Information
    // Screens 02 and 03
    // ═══════════════════════════════════════════════════════════════════════
    institutionAndScoInformation: {
      type: 'object',
      additionalProperties: false,
      description: 'Chapter 1 — Institution and certifying official information (screens 02–03).',
      required: [
        'facilityCode',
        'institutionName',
        'scoFirstName',
        'scoLastName',
        'scoPhone',
        'scoEmail',
      ],
      properties: {

        // Screen 02 — Institution Information
        facilityCode: buildDefinitionReference('facilityCode'),

        institutionName: {
          type: 'string',
          maxLength: 100,
          example: 'State University of Example',
          description: 'Name of institution as registered with VA / WEAMS. Pre-filled read-only from WEAMS after Facility Code entry.',
        },

        institutionAddress: buildDefinitionReference('address'),

        // Screen 03 — SCO Contact Information
        scoFirstName: {
          type: 'string',
          maxLength: 50,
          example: 'Maria',
          description: 'School Certifying Official first name. Pre-filled from authenticated session.',
        },

        scoLastName: {
          type: 'string',
          maxLength: 60,
          example: 'Hernandez',
          description: 'School Certifying Official last name. Pre-filled from authenticated session.',
        },

        scoTitle: {
          type: 'string',
          maxLength: 80,
          example: 'Associate Registrar',
          description: 'SCO job title or role. Pre-fill from VAONCE profile if available; otherwise manual entry.',
        },

        scoPhone: buildDefinitionReference('usPhone'),

        scoEmail: buildDefinitionReference('email'),
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPTER 2 — Student and Prior Certification Information
    // Screens 04 and 05
    // ═══════════════════════════════════════════════════════════════════════
    studentAndPriorCertification: {
      type: 'object',
      additionalProperties: false,
      description: 'Chapter 2 — Student identification and reference to the original VA Form 22-1999 being amended (screens 04–05).',
      required: [
        'studentFirstName',
        'studentLastName',
        'ssnOrFileNumberIndicator',
        'benefitChapter',
        'originalCertBeginDate',
        'originalCertEndDate',
        'originalCreditHours',
        'originalEnrollmentType',
      ],
      properties: {

        // Screen 04 — Student Identification
        studentFirstName: {
          type: 'string',
          maxLength: 50,
          example: 'James',
          description: 'Student-Veteran first name. Not pre-fillable — SCO manual entry.',
        },

        studentLastName: {
          type: 'string',
          maxLength: 60,
          example: 'Nguyen',
          description: 'Student-Veteran last name. Not pre-fillable — SCO manual entry.',
        },

        // SSN vs. VA File Number toggle — only one of the two identifiers
        // needs to be present; enforced by ssnOrFileNumberIndicator enum.
        ssnOrFileNumberIndicator: {
          type: 'string',
          enum: ['ssn', 'va_file_number'],
          description: 'Indicates which student identifier (SSN or VA File Number) is provided on this submission.',
        },

        studentSsn: {
          // Required when ssnOrFileNumberIndicator = 'ssn'
          // Absent (or null) when ssnOrFileNumberIndicator = 'va_file_number'
          // Cross-field conditional enforced in vets-api ActiveModel validation.
          type: 'string',
          pattern: '^\\d{9}$',
          minLength: 9,
          maxLength: 9,
          example: '123456789',
          description: '9-digit SSN, dashes stripped. Required when ssnOrFileNumberIndicator = ssn. Encrypted at rest; never logged or persisted in save-in-progress.',
        },

        studentVaFileNumber: {
          // Required when ssnOrFileNumberIndicator = 'va_file_number'
          type: 'string',
          pattern: '^\\d{8,9}$',
          minLength: 8,
          maxLength: 9,
          example: '12345678',
          description: '8- or 9-digit VA File Number. Required when ssnOrFileNumberIndicator = va_file_number.',
        },

        benefitChapter: buildDefinitionReference('benefitChapter'),

        // Screen 05 — Prior Certification Reference
        originalCertBeginDate: {
          $ref: '#/definitions/date',
          description: 'First day of the enrollment period as it appears on the original VA Form 22-1999 being amended. Must be before or equal to originalCertEndDate. Must be before effectiveDateOfChange.',
        },

        originalCertEndDate: {
          $ref: '#/definitions/date',
          description: 'Last day of the enrollment period as it appears on the original VA Form 22-1999 being amended. Must be after or equal to originalCertBeginDate.',
        },

        originalCreditHours: {
          type: 'integer',
          minimum: 1,
          maximum: 99,
          description: 'Total credit hours (or clock hours) originally certified on the VA Form 22-1999 being amended. Must be > 0.',
        },

        originalEnrollmentType: buildDefinitionReference('enrollmentType'),

        // Optional: VAONCE internal certification reference ID returned by the
        // prior-certification lookup API. Aids backend record matching.
        // Absent when VAONCE API pre-fill is unavailable (OQ-11).
        vaonceCertId: {
          type: 'string',
          maxLength: 100,
          description: 'Optional. Reference ID from VAONCE for the prior certification record, if the prior-certification lookup API is available. Aids backend record matching. See OQ-11.',
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPTER 3 — Enrollment Change Details
    // Screens 06–13 (several conditional)
    // ═══════════════════════════════════════════════════════════════════════
    enrollmentChangeDetails: {
      type: 'object',
      additionalProperties: false,
      description: 'Chapter 3 — Enrollment change details. Contains conditional sub-objects that are only present for certain change types (screens 06–13).',
      required: [
        'typeOfChange',
        'effectiveDateOfChange',
      ],
      properties: {

        // Screen 06 — Type of Change (primary branch point)
        typeOfChange: {
          type: 'string',
          enum: [
            'full_termination',      // student no longer enrolled
            'partial_withdrawal',    // withdrawal from ≥1 course; still enrolled
            'credit_hour_reduction', // reduction in hours; still enrolled
            'correction',            // correcting a previous 22-1999
          ],
          description: 'Nature of the enrollment change being reported. This is the primary branching field controlling which conditional screens appear. NOTE: Verify enum option labels against physical form.',
        },

        // Screen 07 — Effective Date of Change (always required)
        effectiveDateOfChange: {
          $ref: '#/definitions/date',
          description: 'Date the enrollment change took effect at the institution. Must not be in the future. Must be on or after originalCertBeginDate and on or before originalCertEndDate. Triggers timeliness check when (today − effectiveDateOfChange) > 30 days.',
        },

        // Screen 08 — Last Date of Attendance
        // CONDITIONAL: Required when typeOfChange IN [full_termination, partial_withdrawal]
        lastDateOfAttendance: {
          $ref: '#/definitions/date',
          description: 'Last calendar date the student attended class or documented academic activity. Required when typeOfChange is full_termination or partial_withdrawal. Must be on or before effectiveDateOfChange. Critical for MHA recalculation under Post-9/11 GI Bill (38 U.S.C. § 3699). NOTE: Verify regulatory citation.',
        },

        // Screen 09 — Updated Enrollment Details
        // CONDITIONAL: Required when typeOfChange IN [credit_hour_reduction, partial_withdrawal]
        updatedEnrollmentDetails: {
          type: 'object',
          additionalProperties: false,
          description: 'Updated enrollment details after a credit-hour reduction or partial withdrawal. Present only when typeOfChange is credit_hour_reduction or partial_withdrawal.',
          required: ['newCreditHours', 'newEnrollmentType'],
          properties: {
            newCreditHours: {
              type: 'integer',
              minimum: 1,
              maximum: 98,
              description: 'Total credit hours after the change takes effect. Must be less than originalCreditHours. Minimum 1 because if zero, the change type should be full_termination.',
            },
            newEnrollmentType: buildDefinitionReference('enrollmentType'),
          },
        },

        // Screen 10 — Reason for Change
        // CONDITIONAL: Required when typeOfChange !== 'correction'
        reasonForChange: {
          type: 'string',
          enum: [
            'voluntary_withdrawal',
            'academic_dismissal',
            'disciplinary_dismissal',
            'military_deployment',
            'medical',
            'personal_family_emergency',
            'program_change',
            'transfer',
            'non_punitive_grade',
            'reduction_no_reason',
            'other',
          ],
          description: 'Primary reason for the enrollment change. Required for all typeOfChange values except correction. Specific values trigger the mitigating circumstances screen. NOTE: Verify enum values against physical form.',
        },

        // Screen 11 — Mitigating Circumstances
        // CONDITIONAL: Present when reasonForChange IN
        //   [voluntary_withdrawal, medical, personal_family_emergency, non_punitive_grade]
        mitigatingCircumstances: {
          type: 'object',
          additionalProperties: false,
          description: 'Mitigating circumstances information. Present when the reason for change is one of: voluntary_withdrawal, medical, personal_family_emergency, non_punitive_grade.',
          required: ['mitigatingCircumstancesKnown'],
          properties: {
            mitigatingCircumstancesKnown: {
              type: 'string',
              enum: ['yes', 'no', 'unknown'],
              description: 'Whether the SCO is aware of mitigating circumstances contributing to the enrollment change. Selecting yes requires a narrative description.',
            },
            mitigatingCircumstancesNarrative: {
              type: 'string',
              minLength: 20,
              maxLength: 2000,
              description: 'Description of known mitigating circumstances. Required when mitigatingCircumstancesKnown = yes. May contain sensitive health or personal information — encrypted at rest, never logged.',
            },
          },
        },

        // Screen 12 — Correction Details
        // CONDITIONAL: Required when typeOfChange = 'correction'
        correctionDetails: {
          type: 'object',
          additionalProperties: false,
          description: 'Details of what is being corrected on the original VA Form 22-1999. Present only when typeOfChange = correction.',
          required: ['correctionItems'],
          properties: {
            // Which fields are being corrected (at least one required)
            correctionItems: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'string',
                enum: [
                  'credit_hours',
                  'enrollment_dates',
                  'enrollment_type',
                  'tuition_fees',    // Chapter 33 only — see OQ-16
                  'student_identity',
                  'benefit_chapter',
                  'other',
                ],
              },
              description: 'One or more fields being corrected. At least one value required. Each selected item reveals corresponding corrected-value fields.',
            },

            // Corrected field values — each is optional at the schema level;
            // conditional requirement based on correctionItems contents is
            // enforced in vets-api ActiveModel cross-field validation.

            correctedCreditHours: {
              type: 'integer',
              minimum: 1,
              maximum: 99,
              description: 'Corrected credit hours. Present when correctionItems includes credit_hours.',
            },

            correctedCertBeginDate: {
              $ref: '#/definitions/date',
              description: 'Corrected certification begin date. Present when correctionItems includes enrollment_dates.',
            },

            correctedCertEndDate: {
              $ref: '#/definitions/date',
              description: 'Corrected certification end date. Present when correctionItems includes enrollment_dates. Must be after correctedCertBeginDate.',
            },

            correctedEnrollmentType: {
              $ref: '#/definitions/enrollmentType',
              description: 'Corrected enrollment type. Present when correctionItems includes enrollment_type.',
            },

            correctedTuitionFeesAmount: {
              type: 'number',
              minimum: 0,
              description: 'Corrected tuition and fees amount (in USD). Applicable to Chapter 33 (Post-9/11 GI Bill) only. Present when correctionItems includes tuition_fees. NOTE: Verify applicability by chapter — OQ-16.',
            },

            correctedStudentFirstName: {
              type: 'string',
              maxLength: 50,
              description: 'Corrected student first name. Present when correctionItems includes student_identity.',
            },

            correctedStudentLastName: {
              type: 'string',
              maxLength: 60,
              description: 'Corrected student last name. Present when correctionItems includes student_identity.',
            },

            correctedStudentSsn: {
              type: 'string',
              pattern: '^\\d{9}$',
              minLength: 9,
              maxLength: 9,
              description: 'Corrected student SSN (9 digits, dashes stripped). Present when correctionItems includes student_identity. Encrypted at rest.',
            },

            correctedBenefitChapter: {
              $ref: '#/definitions/benefitChapter',
              description: 'Corrected benefit chapter. Present when correctionItems includes benefit_chapter. Should differ from the originally submitted chapter.',
            },

            correctionOtherDescription: {
              type: 'string',
              minLength: 10,
              maxLength: 1000,
              description: 'Free-text description of the correction. Required when correctionItems includes other.',
            },
          },
        },

        // Screen 13 — Timeliness Acknowledgment
        // CONDITIONAL: Present when (today - effectiveDateOfChange) > 30 days
        //              AND typeOfChange !== 'correction'
        lateSubmissionExplanation: {
          type: 'string',
          minLength: 20,
          maxLength: 1000,
          description: 'Explanation for why this enrollment change is being reported more than 30 days after the effective date. Required when the submission is retroactive (> 30-day threshold). NOTE: Verify 30-day regulatory threshold — OQ-8.',
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPTER 4 — Supporting Documentation
    // Screen 14 (conditional)
    // ═══════════════════════════════════════════════════════════════════════
    supportingDocumentation: {
      type: 'object',
      additionalProperties: false,
      description: 'Chapter 4 — Supporting documentation upload. Conditional: required when typeOfChange = correction (at least 1 document); optional but available for all other change types.',
      properties: {
        supportingDocumentIds: {
          type: 'array',
          minItems: 0,
          maxItems: 3,
          items: buildDefinitionReference('uuid'),
          description: 'Array of document GUIDs returned by the Benefits Intake / S3 upload endpoint after each supporting document is uploaded. Accepted file types: PDF, JPG, PNG. Max 25 MB per file. Max 3 files.',
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    // REVIEW AND SUBMIT — Certification Attestation
    // Screen 15
    // ═══════════════════════════════════════════════════════════════════════
    scoCertificationAttested: {
      type: 'boolean',
      enum: [true],
      description: 'SCO legal certification attestation. Must be true — a value of false or absence of this field fails validation. The attestation text rendered in the UI must be copied verbatim from the physical form. NOTE: Verify exact certification statement language — OQ-12.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Top-level required fields — all chapter objects plus the attestation
  // ─────────────────────────────────────────────────────────────────────────
  required: [
    'institutionAndScoInformation',
    'studentAndPriorCertification',
    'enrollmentChangeDetails',
    'scoCertificationAttested',
  ],
};

export default schema;