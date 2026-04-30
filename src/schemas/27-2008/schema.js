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
          maxLength: 30,
        },
        middle: {
          type: ['string', 'null'],
          maxLength: 30,
        },
        last: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
        },
      },
      required: ['first', 'last'],
    },

    date: {
      type: 'string',
      format: 'date',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    },

    ssn: {
      type: 'string',
      pattern: '^[0-9]{9}$',
      minLength: 9,
      maxLength: 9,
    },

    phone: {
      type: 'string',
      pattern: '^[0-9]{10}$',
      minLength: 10,
      maxLength: 10,
    },

    usState: {
      type: 'string',
      enum: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
        'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
        'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
        'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
        'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
        'WY', 'PR', 'GU', 'VI', 'AS', 'MP', 'UM', 'OUTSIDE_US',
      ],
    },

    address: {
      type: 'object',
      properties: {
        addressLine1: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
        addressLine2: {
          type: ['string', 'null'],
          maxLength: 100,
        },
        city: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        state: buildDefinitionReference('usState'),
        zip: {
          type: 'string',
          pattern: '^[0-9]{5}(-[0-9]{4})?$',
          minLength: 5,
          maxLength: 10,
        },
      },
      required: ['addressLine1', 'city', 'state', 'zip'],
    },

    documentUpload: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        guid: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        confirmationCode: {
          type: 'string',
          maxLength: 255,
        },
        uploadedAt: {
          type: 'string',
        },
      },
      required: ['name', 'guid'],
    },
  },

  properties: {
    // Screen 2 — Who is submitting this application
    applicantType: {
      type: 'string',
      description: 'Identifies the role of the person submitting the application (drives conditional logic)',
      enum: [
        'nextOfKin',
        'funeralDirector',
        'vsoRepresentative',
        'closeFriend',
      ],
    },

    // Screens 3, 4, 6, 7 — Veteran Information (Items 1, 2, 3, 4, 5, 9, 10, 11, 12)
    veteranInformation: {
      type: 'object',
      description: 'Personal identification and burial information for the deceased Veteran',
      properties: {
        // Item 1 — Veteran name
        firstName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          description: "Veteran's first name (Item 1)",
        },
        middleName: {
          type: ['string', 'null'],
          maxLength: 30,
          description: "Veteran's middle name (Item 1, optional)",
        },
        lastName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          description: "Veteran's last name (Item 1)",
        },

        // Item 2 — Maiden or other name
        maidenOrOtherName: {
          type: ['string', 'null'],
          maxLength: 60,
          description: 'Maiden name or other name the Veteran used while on active duty (Item 2, optional)',
        },

        // Item 3 — VA File Number
        vaFileNumber: {
          type: ['string', 'null'],
          pattern: '^[0-9]{7,9}$',
          minLength: 7,
          maxLength: 9,
          description: 'VA file number (Item 3, optional)',
        },

        // Item 4 — Social Security Number
        socialSecurityNumber: {
          type: ['string', 'null'],
          pattern: '^[0-9]{9}$',
          minLength: 9,
          maxLength: 9,
          description: "Veteran's Social Security Number (Item 4, optional per Privacy Act notice)",
        },

        // Item 5 — Military Service Number
        militaryServiceNumber: {
          type: ['string', 'null'],
          maxLength: 20,
          description: 'Military service number or serial number (Item 5, optional)',
        },

        // Item 9 — Date of Birth
        dateOfBirth: {
          type: 'string',
          format: 'date',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
          description: "Veteran's date of birth (Item 9)",
        },

        // Item 10 — Date of Death
        dateOfDeath: {
          type: 'string',
          format: 'date',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
          description: "Veteran's date of death (Item 10)",
        },

        // Item 11 — Date of Burial
        dateOfBurial: {
          type: 'string',
          format: 'date',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
          description: 'Date of burial; may be a future date if burial has not yet occurred (Item 11)',
        },

        // Item 12 — Place of Burial
        placeOfBurialCemeteryName: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'Name of cemetery or place of burial (Item 12)',
        },
        placeOfBurialCity: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'City of cemetery or place of burial (Item 12)',
        },
        placeOfBurialState: buildDefinitionReference('usState'),
      },
      required: [
        'firstName',
        'lastName',
        'dateOfBirth',
        'dateOfDeath',
        'dateOfBurial',
        'placeOfBurialCemeteryName',
        'placeOfBurialCity',
        'placeOfBurialState',
      ],
    },

    // Screen 5 — Service Information (Items 6, 7, 8)
    serviceInformation: {
      type: 'object',
      description: 'Military service history for the deceased Veteran',
      properties: {
        // Item 6 — Branch of Service (array — multiple may be selected)
        branchOfService: {
          type: 'array',
          description: 'Branch(es) of military service the Veteran served in (Item 6)',
          minItems: 1,
          items: {
            type: 'string',
            enum: [
              'army',
              'navy',
              'airForce',
              'spaceForce',
              'marineCorps',
              'coastGuard',
              'usphs',
              'noaa',
              'selectedReserve',
              'other',
            ],
          },
          uniqueItems: true,
        },

        // Item 7 — Date Entered Active Duty
        dateEnteredActiveDuty: {
          type: 'string',
          format: 'date',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
          description: 'Date the Veteran entered active duty or Selected Reserve (Item 7)',
        },

        // Item 8 — Date Released from Active Duty
        dateReleasedFromActiveDuty: {
          type: 'string',
          format: 'date',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
          description: 'Date the Veteran was released from active duty or Selected Reserve (Item 8)',
        },
      },
      required: ['branchOfService', 'dateEnteredActiveDuty', 'dateReleasedFromActiveDuty'],
    },

    // Screens 8, 9, 10 — Eligibility (Item 13 + pre-screening)
    eligibility: {
      type: 'object',
      description: 'Eligibility documentation check and discharge character pre-screening',
      properties: {
        // Item 13 — Documentation presented or attached
        documentationAvailable: {
          type: 'boolean',
          description: 'Whether discharge documentation has been presented or is attached (Item 13)',
        },

        // Screen 9 — Discharge character
        dischargeCharacter: {
          type: 'string',
          description: 'Character of the Veteran\'s military discharge (eligibility pre-screening)',
          enum: ['honorable', 'dishonorable', 'unknown'],
        },

        // Screen 10 — Reserve/Guard eligibility criteria (conditional — shown only when selectedReserve selected)
        reserveGuardCriteria: {
          type: 'array',
          description: 'Selected Reserve eligibility criteria met by the Veteran (Item 6 / Section C(2) and C(3) of form instructions); shown only when Selected Reserve is selected in branchOfService',
          items: {
            type: 'string',
            enum: [
              'retiredPayEligible',
              'servedFullEnlistment',
              'disabilityDischarge',
              'diedWhileMember',
            ],
          },
          uniqueItems: true,
        },
      },
      required: ['documentationAvailable', 'dischargeCharacter'],
    },

    // Screens 11, 12 — Flag Recipient (Items 14A, 14B, 14C, 14D)
    flagRecipient: {
      type: 'object',
      description: 'Information about the person entitled to receive the burial flag',
      properties: {
        // Item 14A — Flag recipient full name
        recipientFullName: {
          type: 'string',
          minLength: 1,
          maxLength: 80,
          description: 'Full name of the person entitled to receive the flag (Item 14A)',
        },

        // Item 14B — Flag recipient relationship
        recipientRelationship: {
          type: 'string',
          description: 'Relationship of the flag recipient to the deceased Veteran (Item 14B)',
          enum: [
            'survivingSpouse',
            'child',
            'parent',
            'brotherOrSister',
            'uncleOrAunt',
            'nephewOrNiece',
            'cousinOrGrandparent',
            'friend',
            'other',
          ],
        },

        // Conditional free-text when relationship = "other"
        recipientRelationshipOther: {
          type: ['string', 'null'],
          maxLength: 100,
          description: 'Free-text description of relationship when recipientRelationship is "other"',
        },

        // Item 14C — Flag recipient address
        recipientAddressLine1: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'Street address or rural route or P.O. Box of flag recipient (Item 14C)',
        },
        recipientAddressLine2: {
          type: ['string', 'null'],
          maxLength: 100,
          description: 'Apartment, suite, unit of flag recipient (Item 14C, optional)',
        },
        recipientCity: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'City of flag recipient address (Item 14C)',
        },
        recipientState: buildDefinitionReference('usState'),
        recipientZip: {
          type: 'string',
          pattern: '^[0-9]{5}(-[0-9]{4})?$',
          minLength: 5,
          maxLength: 10,
          description: 'ZIP code of flag recipient address (Item 14C)',
        },

        // Item 14D — Flag recipient telephone
        recipientPhone: {
          type: ['string', 'null'],
          pattern: '^[0-9]{10}$',
          minLength: 10,
          maxLength: 10,
          description: 'Telephone number of person entitled to receive the flag (Item 14D, optional)',
        },
      },
      required: [
        'recipientFullName',
        'recipientRelationship',
        'recipientAddressLine1',
        'recipientCity',
        'recipientState',
        'recipientZip',
      ],
    },

    // Screen 13 — Applicant Information (Items 17, 18)
    applicant: {
      type: 'object',
      description: 'Name, address, and relationship to Veteran of the person submitting the application (Items 17, 18)',
      properties: {
        firstName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          description: "Applicant's first name",
        },
        middleName: {
          type: ['string', 'null'],
          maxLength: 30,
          description: "Applicant's middle name (optional)",
        },
        lastName: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          description: "Applicant's last name",
        },

        // Item 17 — Applicant address
        addressLine1: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
          description: "Applicant's street address or P.O. Box (Item 17)",
        },
        addressLine2: {
          type: ['string', 'null'],
          maxLength: 100,
          description: "Applicant's apartment, suite, unit (Item 17, optional)",
        },
        city: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
          description: "Applicant's city (Item 17)",
        },
        state: buildDefinitionReference('usState'),
        zip: {
          type: 'string',
          pattern: '^[0-9]{5}(-[0-9]{4})?$',
          minLength: 5,
          maxLength: 10,
          description: "Applicant's ZIP code (Item 17)",
        },

        // Item 18 — Applicant relationship to deceased Veteran
        relationshipToVeteran: {
          type: 'string',
          description: "Applicant's relationship to the deceased Veteran (Item 18)",
          enum: [
            'survivingSpouse',
            'child',
            'parent',
            'brotherOrSister',
            'uncleOrAunt',
            'nephewOrNiece',
            'cousinOrGrandparent',
            'funeralDirector',
            'vsoRepresentative',
            'closeFriend',
            'otherAuthorizedRepresentative',
          ],
        },

        // Conditional free-text when relationship = "otherAuthorizedRepresentative"
        relationshipToVeteranOther: {
          type: ['string', 'null'],
          maxLength: 100,
          description: "Free-text description when applicant's relationship is 'other'",
        },
      },
      required: [
        'firstName',
        'lastName',
        'addressLine1',
        'city',
        'state',
        'zip',
        'relationshipToVeteran',
      ],
    },

    // Screen 14 — Supporting Documents (DD-214 upload)
    documents: {
      type: 'object',
      description: 'Uploaded discharge documentation (DD Form 214 or equivalent)',
      properties: {
        dd214Upload: {
          type: 'array',
          description: 'One or more uploaded discharge document files; each entry contains the CarrierWave GUID returned by the document upload endpoint',
          maxItems: 3,
          items: buildDefinitionReference('documentUpload'),
        },
      },
    },

    // Screen 15 — Remarks (Item 15)
    remarks: {
      type: ['string', 'null'],
      maxLength: 1500,
      description: 'Free-text remarks field (Item 15); required when documentation is not available (Item 13 = No), when flag recipient is a friend with no next-of-kin, or other special circumstances per CL-09',
    },

    // Screen 16 — Review and Submit

    // Item 19 — Date signed
    dateSigned: {
      type: 'string',
      format: 'date',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      description: 'Date the applicant signed the application (Item 19); pre-populated with today\'s date',
    },

    // Certification attestation (electronic equivalent of Item 16 wet-ink signature)
    certificationChecked: {
      type: 'boolean',
      description: 'Electronic certification attestation; the applicant certifies that statements are true and that the Veteran is eligible and a flag has not been previously issued (Item 16 equivalent)',
    },

    // Submission metadata — not a paper form item; used by backend for adjudicator routing
    metadata: {
      type: 'object',
      description: 'Internal metadata flags set by conditional logic; not displayed to the claimant; used for adjudicator review routing',
      properties: {
        ineligibilityFlagged: {
          type: 'boolean',
          description: 'True when dischargeCharacter = "dishonorable"; flags submission for adjudicator review per CL-03',
        },
        reserveGuardIneligibilityWarning: {
          type: 'boolean',
          description: 'True when Selected Reserve criteria screen shown and no criteria selected; soft warning per CL-06',
        },
        submissionTimestamp: {
          type: ['string', 'null'],
          description: 'ISO 8601 timestamp of final submission; set by backend on successful POST',
        },
      },
    },
  },

  required: [
    'applicantType',
    'veteranInformation',
    'serviceInformation',
    'eligibility',
    'flagRecipient',
    'applicant',
    'dateSigned',
    'certificationChecked',
  ],
};

export default schema;