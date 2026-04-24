const buildDefinitionReference = referenceId => ({ $ref: `#/definitions/${referenceId}` });

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  additionalProperties: false,

  definitions: {
    fullName: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          example: 'Jane',
        },
        middleInitial: {
          type: ['string', 'null'],
          pattern: '^[A-Za-z]$',
          maxLength: 1,
          example: 'A',
        },
        lastName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          example: 'Doe',
        },
      },
      required: ['firstName', 'lastName'],
    },

    ssn: {
      type: 'string',
      pattern: '^\\d{3}-\\d{2}-\\d{4}$',
      minLength: 11,
      maxLength: 11,
      example: '123-45-6789',
      description: 'Social Security Number in format ###-##-####',
    },

    date: {
      type: 'string',
      format: 'date',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      example: '2025-01-15',
      description: 'Date in ISO 8601 format YYYY-MM-DD',
    },

    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
          example: '123 Main St',
        },
        city: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          example: 'Springfield',
        },
        state: {
          type: 'string',
          minLength: 2,
          maxLength: 2,
          example: 'IL',
          enum: [
            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
            'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
            'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
            'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
            'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA',
            'WA', 'WV', 'WI', 'WY',
          ],
        },
        zipCode: {
          type: 'string',
          pattern: '^\\d{5}(-\\d{4})?$',
          minLength: 5,
          maxLength: 10,
          example: '62701',
        },
      },
      required: ['street', 'city', 'state', 'zipCode'],
    },

    phone: {
      type: 'string',
      pattern: '^\\(\\d{3}\\) \\d{3}-\\d{4}$',
      minLength: 14,
      maxLength: 14,
      example: '(555) 867-5309',
      description: 'Phone number in format (###) ###-####',
    },

    travelTime: {
      type: 'string',
      pattern: '^([01]\\d|2[0-3])[0-5]\\d$',
      minLength: 4,
      maxLength: 4,
      example: '0815',
      description: '24-hour time in HHMM format',
    },

    travelSegment: {
      type: 'object',
      properties: {
        dateOfTravel: buildDefinitionReference('date'),
        departure: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              minLength: 1,
              maxLength: 30,
              example: 'Springfield',
            },
            state: {
              type: 'string',
              minLength: 2,
              maxLength: 2,
              example: 'IL',
              enum: [
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
                'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
                'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
                'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
                'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA',
                'WA', 'WV', 'WI', 'WY',
              ],
            },
            time: buildDefinitionReference('travelTime'),
          },
          required: ['city', 'state', 'time'],
        },
        arrival: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              minLength: 1,
              maxLength: 30,
              example: 'Chicago',
            },
            state: {
              type: 'string',
              minLength: 2,
              maxLength: 2,
              example: 'IL',
              enum: [
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
                'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
                'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
                'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
                'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA',
                'WA', 'WV', 'WI', 'WY',
              ],
            },
            time: buildDefinitionReference('travelTime'),
          },
          required: ['city', 'state', 'time'],
        },
      },
      required: ['dateOfTravel', 'departure', 'arrival'],
    },

    receiptItem: {
      type: 'object',
      properties: {
        confirmationCode: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
          description: 'UUID returned by the document upload API',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          description: 'Original filename of the uploaded receipt',
          example: 'lodging_receipt.pdf',
        },
        size: {
          type: 'integer',
          minimum: 1,
          description: 'File size in bytes',
          example: 102400,
        },
        mimeType: {
          type: 'string',
          enum: ['application/pdf', 'image/jpeg', 'image/png'],
          description: 'MIME type of the uploaded file',
          example: 'application/pdf',
        },
        category: {
          type: 'string',
          enum: [
            'lodging',
            'meals',
            'airline',
            'taxi',
            'bus',
            'train',
            'parking-tolls',
            'other',
          ],
          description: 'Expense category associated with this receipt',
          example: 'lodging',
        },
      },
      required: ['confirmationCode', 'name', 'size', 'mimeType', 'category'],
    },
  },

  properties: {

    // ─── Program Selection ─────────────────────────────────────────────────────
    programSelection: {
      type: 'object',
      description: 'Identifies which VA benefit program this claim is filed under',
      properties: {
        program: {
          type: 'string',
          enum: ['spina-bifida', 'cwvv'],
          description: 'spina-bifida = Spina Bifida Health Care Benefits Program; cwvv = Children of Women Vietnam Veterans Program',
          example: 'spina-bifida',
        },
      },
      required: ['program'],
      additionalProperties: false,
    },

    // ─── Section I: Patient Information ───────────────────────────────────────
    patient: {
      type: 'object',
      description: 'Section I — Patient (beneficiary child) identifying information',
      properties: {
        firstName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          example: 'Jane',
          description: "Patient's first name",
        },
        middleInitial: {
          type: ['string', 'null'],
          pattern: '^[A-Za-z]$',
          maxLength: 1,
          example: 'A',
          description: "Patient's middle initial (single letter)",
        },
        lastName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          example: 'Doe',
          description: "Patient's last name",
        },
        ssn: buildDefinitionReference('ssn'),
        dateOfBirth: buildDefinitionReference('date'),
        address: buildDefinitionReference('address'),
        phone: buildDefinitionReference('phone'),
      },
      required: [
        'firstName',
        'lastName',
        'ssn',
        'dateOfBirth',
        'address',
        'phone',
      ],
      additionalProperties: false,
    },

    // ─── Section II: Sponsor Information ──────────────────────────────────────
    sponsor: {
      type: 'object',
      description: 'Section II — Qualifying Veteran sponsor information',
      properties: {
        firstName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          example: 'John',
          description: "Sponsor's first name",
        },
        middleInitial: {
          type: ['string', 'null'],
          pattern: '^[A-Za-z]$',
          maxLength: 1,
          example: 'B',
          description: "Sponsor's middle initial (single letter)",
        },
        lastName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          example: 'Doe',
          description: "Sponsor's last name",
        },
        ssn: buildDefinitionReference('ssn'),
      },
      required: ['firstName', 'lastName', 'ssn'],
      additionalProperties: false,
    },

    // ─── Claim Type Selection ──────────────────────────────────────────────────
    claimType: {
      type: 'array',
      description: 'Types of expenses being claimed on this form. At least one must be selected.',
      minItems: 1,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['travel', 'lodging', 'meals', 'other'],
      },
      example: ['travel', 'lodging'],
    },

    // ─── Section III: Travel ──────────────────────────────────────────────────
    travel: {
      type: 'object',
      description: 'Section III — Travel expense details. Required only when claimType includes "travel".',
      properties: {

        providerCertification: {
          type: 'object',
          description: 'Provider certification of medical service (required for all travel claims)',
          properties: {
            dateOfService: buildDefinitionReference('date'),
            providerTaxId: {
              type: 'string',
              pattern: '^(\\d{2}-\\d{7}|\\d{3}-\\d{2}-\\d{4})$',
              minLength: 9,
              maxLength: 12,
              example: '12-3456789',
              description: 'Provider Tax Identification Number (EIN or SSN-format TIN)',
            },
            providerSignature: {
              type: 'string',
              minLength: 1,
              maxLength: 60,
              example: 'Dr. Sarah Smith',
              description: "Provider's typed electronic signature (full name)",
            },
            providerWillBill: {
              type: 'string',
              enum: ['yes', 'no'],
              description: 'Whether the provider will separately bill for services',
              example: 'no',
            },
          },
          required: [
            'dateOfService',
            'providerTaxId',
            'providerSignature',
            'providerWillBill',
          ],
          additionalProperties: false,
        },

        modeOfTravel: {
          type: 'array',
          description: 'Modes of transportation used for the trip. At least one must be selected.',
          minItems: 1,
          uniqueItems: true,
          items: {
            type: 'string',
            enum: ['airline', 'taxi', 'pov', 'bus', 'train', 'other'],
          },
          example: ['airline', 'taxi'],
        },

        modeOfTravelOther: {
          type: ['string', 'null'],
          minLength: 1,
          maxLength: 60,
          example: 'Rideshare service',
          description: 'Description of other mode of travel when "other" is selected in modeOfTravel',
        },

        segments: {
          type: 'array',
          description: 'Travel segment(s). The PDF form provides two rows; the digital form collects one or two segments.',
          minItems: 1,
          maxItems: 2,
          items: buildDefinitionReference('travelSegment'),
        },

        pov: {
          type: 'object',
          description: 'Privately owned vehicle departure and arrival locations (required when modeOfTravel includes "pov")',
          properties: {
            departureCity: {
              type: ['string', 'null'],
              minLength: 1,
              maxLength: 30,
              example: 'Springfield',
              description: 'City where the POV trip began',
            },
            departureState: {
              type: ['string', 'null'],
              minLength: 2,
              maxLength: 2,
              example: 'IL',
              enum: [
                null,
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
                'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
                'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
                'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
                'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA',
                'WA', 'WV', 'WI', 'WY',
              ],
            },
            arrivalCity: {
              type: ['string', 'null'],
              minLength: 1,
              maxLength: 30,
              example: 'Chicago',
              description: 'City where the medical appointment took place',
            },
            arrivalState: {
              type: ['string', 'null'],
              minLength: 2,
              maxLength: 2,
              example: 'IL',
              enum: [
                null,
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
                'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
                'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
                'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
                'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA',
                'WA', 'WV', 'WI', 'WY',
              ],
            },
          },
          additionalProperties: false,
        },

        attendant: {
          type: 'object',
          description: 'Attendant travel information (required when an attendant traveled with the patient)',
          properties: {
            traveled: {
              type: 'string',
              enum: ['yes', 'no'],
              description: 'Whether an attendant traveled with the patient',
              example: 'no',
            },
            firstName: {
              type: ['string', 'null'],
              minLength: 1,
              maxLength: 30,
              example: 'Mary',
              description: "Attendant's first name",
            },
            middleInitial: {
              type: ['string', 'null'],
              pattern: '^[A-Za-z]$',
              maxLength: 1,
              example: 'C',
              description: "Attendant's middle initial (single letter)",
            },
            lastName: {
              type: ['string', 'null'],
              minLength: 1,
              maxLength: 30,
              example: 'Doe',
              description: "Attendant's last name",
            },
            relationshipToPatient: {
              type: ['string', 'null'],
              minLength: 1,
              maxLength: 30,
              example: 'Parent',
              description: "Attendant's relationship to the patient",
            },
          },
          required: ['traveled'],
          additionalProperties: false,
        },

      },
      required: [
        'providerCertification',
        'modeOfTravel',
        'segments',
        'attendant',
      ],
      additionalProperties: false,
    },

    // ─── Expenses ──────────────────────────────────────────────────────────────
    expenses: {
      type: 'object',
      description: 'Patient/attendant miscellaneous expense dollar amounts (Section III)',
      properties: {
        lodging: {
          type: ['number', 'null'],
          minimum: 0.01,
          example: 89.00,
          description: 'Total lodging expense amount in US dollars',
        },
        meals: {
          type: ['number', 'null'],
          minimum: 0.01,
          example: 32.50,
          description: 'Total meal expense amount in US dollars',
        },
        other: {
          type: ['number', 'null'],
          minimum: 0.01,
          example: 15.00,
          description: 'Total other expense amount (parking, tolls, etc.) in US dollars',
        },
      },
      additionalProperties: false,
    },

    // ─── Receipt File Upload References ───────────────────────────────────────
    receipts: {
      type: 'array',
      description: 'References to uploaded receipt files staged via the document upload API',
      items: buildDefinitionReference('receiptItem'),
      minItems: 0,
    },

    // ─── Section IV: Certification Signer Selection ────────────────────────────
    certificationSigner: {
      type: 'string',
      enum: ['patient', 'representative'],
      description: 'Identifies who is signing the Section IV certification',
      example: 'representative',
    },

    // ─── Section IV: Representative Information (conditional) ─────────────────
    representative: {
      type: 'object',
      description: 'Section IV — Representative (parent, guardian, or authorized person) information. Required only when certificationSigner is "representative".',
      properties: {
        firstName: {
          type: ['string', 'null'],
          minLength: 1,
          maxLength: 30,
          example: 'John',
          description: "Representative's first name",
        },
        middleInitial: {
          type: ['string', 'null'],
          pattern: '^[A-Za-z]$',
          maxLength: 1,
          example: 'B',
          description: "Representative's middle initial",
        },
        lastName: {
          type: ['string', 'null'],
          minLength: 1,
          maxLength: 30,
          example: 'Doe',
          description: "Representative's last name",
        },
        ssn: {
          type: ['string', 'null'],
          pattern: '^\\d{3}-\\d{2}-\\d{4}$',
          minLength: 11,
          maxLength: 11,
          example: '123-45-6789',
          description: "Representative's Social Security Number in format ###-##-####",
        },
        address: {
          type: 'object',
          properties: {
            street: {
              type: ['string', 'null'],
              maxLength: 50,
              example: '456 Oak Ave',
            },
            city: {
              type: ['string', 'null'],
              maxLength: 30,
              example: 'Springfield',
            },
            state: {
              type: ['string', 'null'],
              maxLength: 2,
              example: 'IL',
              enum: [
                null,
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
                'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
                'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
                'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
                'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA',
                'WA', 'WV', 'WI', 'WY',
              ],
            },
            zipCode: {
              type: ['string', 'null'],
              pattern: '^\\d{5}(-\\d{4})?$',
              maxLength: 10,
              example: '62701',
            },
          },
          additionalProperties: false,
        },
        phone: {
          type: ['string', 'null'],
          pattern: '^\\(\\d{3}\\) \\d{3}-\\d{4}$',
          minLength: 14,
          maxLength: 14,
          example: '(555) 867-5309',
          description: "Representative's telephone number in format (###) ###-####",
        },
      },
      additionalProperties: false,
    },

    // ─── Section IV: Certification ────────────────────────────────────────────
    certification: {
      type: 'object',
      description: 'Section IV — Certification, release of medical information consent, and signature',
      properties: {
        acknowledged: {
          type: 'boolean',
          description: 'Claimant has certified that all information and attachments are correct and represent actual services, dates, and fees charged',
          example: true,
        },
        signature: {
          type: 'string',
          minLength: 1,
          maxLength: 60,
          example: 'John B. Doe',
          description: "Claimant's typed electronic signature (full legal name)",
        },
        date: buildDefinitionReference('date'),
      },
      required: ['acknowledged', 'signature', 'date'],
      additionalProperties: false,
    },

  },

  required: [
    'programSelection',
    'patient',
    'sponsor',
    'claimType',
    'certificationSigner',
    'certification',
  ],
};

export default schema;