const buildDefinitionReference = referenceId => ({ $ref: `#/definitions/${referenceId}` });

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'VA Form 40-1330M',
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
          type: 'string',
          maxLength: 30,
        },
        last: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
        },
        suffix: {
          type: 'string',
          enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
        },
      },
      required: ['first', 'last'],
    },

    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
        street2: {
          type: 'string',
          maxLength: 100,
        },
        city: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        state: {
          type: 'string',
          maxLength: 2,
        },
        postalCode: {
          type: 'string',
          pattern: '^\\d{5}(-\\d{4})?$',
        },
        country: {
          type: 'string',
          default: 'USA',
          maxLength: 3,
        },
      },
      required: ['street', 'city', 'state', 'postalCode'],
    },

    phone: {
      type: 'string',
      pattern: '^\\d{10}$',
      minLength: 10,
      maxLength: 10,
    },

    ssn: {
      type: 'string',
      pattern: '^\\d{9}$',
      minLength: 9,
      maxLength: 9,
    },

    date: {
      type: 'string',
      format: 'date',
    },

    fileUpload: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
        },
        size: {
          type: 'number',
          minimum: 0,
        },
        confirmationCode: {
          type: 'string',
        },
        attachmentId: {
          type: 'string',
        },
      },
    },
  },

  properties: {
    // ── Eligibility Screener ─────────────────────────────────────────────────
    serviceStatusAtDeath: {
      type: 'string',
      enum: ['activeDuty', 'guardOrReserve'],
      description: 'Service status of the decedent at time of death. Drives form routing: activeDuty → skip guard/reserve qualifier; guardOrReserve → show qualifier page.',
    },

    guardReserveQualifyingCircumstance: {
      type: 'string',
      enum: [
        'diedOnActiveDutyForTraining',
        'diedOnInactiveDutyForTraining',
        'entitledToRetiredPay',
      ],
      description: 'Guard/Reserve eligibility qualifier. Only required when serviceStatusAtDeath = guardOrReserve. ⚠️ UNVERIFIED: enum values and exact eligibility criteria must be confirmed against 38 CFR Part 38 and official form PDF.',
    },

    // ── Chapter 1 — About the Applicant ──────────────────────────────────────
    submitterRole: {
      type: 'string',
      enum: ['nextOfKin', 'funeralHomeDirector', 'cemeteryOfficial', 'personalRepresentative'],
      description: 'Role of the person submitting the claim.',
    },

    applicant: {
      type: 'object',
      additionalProperties: false,
      description: 'Chapter 1: Information about the person submitting this request.',
      properties: {
        name: buildDefinitionReference('fullName'),

        relationshipToDecedent: {
          type: 'string',
          enum: ['spouse', 'parent', 'child', 'sibling', 'otherFamilyMember'],
          description: 'NOK relationship. Shown when submitterRole = nextOfKin. ⚠️ UNVERIFIED: confirm enum values with NCA.',
        },

        relationshipDescription: {
          type: 'string',
          maxLength: 100,
          description: 'Free-text relationship description. Required when relationshipToDecedent = otherFamilyMember.',
        },

        organizationName: {
          type: 'string',
          maxLength: 100,
          description: 'Funeral home or cemetery organization name. Required when submitterRole is funeralHomeDirector or cemeteryOfficial.',
        },

        organizationRole: {
          type: 'string',
          maxLength: 100,
          description: 'Applicant title/role within the organization. Required when submitterRole is funeralHomeDirector or cemeteryOfficial.',
        },

        legalAuthorityDescription: {
          type: 'string',
          maxLength: 200,
          description: 'Description of legal authority to submit. Required when submitterRole = personalRepresentative.',
        },

        daytimePhone: buildDefinitionReference('phone'),

        email: {
          type: 'string',
          format: 'email',
          maxLength: 256,
        },

        address: buildDefinitionReference('address'),

        authorizationDocument: buildDefinitionReference('fileUpload'),
      },
      required: ['name', 'daytimePhone', 'email', 'address'],
    },

    // ── Chapter 2 — About the Deceased Service Member ─────────────────────────
    decedent: {
      type: 'object',
      additionalProperties: false,
      description: 'Chapter 2: Personal and military service information of the deceased service member.',
      properties: {
        name: buildDefinitionReference('fullName'),

        ssn: buildDefinitionReference('ssn'),

        dateOfBirth: buildDefinitionReference('date'),

        dateOfDeath: buildDefinitionReference('date'),

        placeOfDeath: {
          type: 'object',
          additionalProperties: false,
          description: 'City, state, and country where the service member died.',
          properties: {
            city: {
              type: 'string',
              maxLength: 100,
            },
            state: {
              type: 'string',
              maxLength: 2,
            },
            country: {
              type: 'string',
              maxLength: 3,
            },
          },
          required: ['city', 'country'],
        },

        service: {
          type: 'object',
          additionalProperties: false,
          description: 'Military service information for the decedent.',
          properties: {
            branchOfService: {
              type: 'string',
              enum: [
                'army',
                'navy',
                'airForce',
                'marineCorps',
                'coastGuard',
                'spaceForce',
                'armyNationalGuard',
                'armyReserve',
                'navyReserve',
                'airNationalGuard',
                'airForceReserve',
                'marineCorpsReserve',
                'coastGuardReserve',
              ],
              description: '⚠️ UNVERIFIED: confirm full branch list against NCA form options.',
            },

            component: {
              type: 'string',
              enum: ['active', 'guard', 'reserve'],
            },

            rankAtDeath: {
              type: 'string',
              minLength: 1,
              maxLength: 50,
              description: '⚠️ UNVERIFIED: confirm maxLength against NCA inscription character limit for rank field.',
            },

            serviceNumber: {
              type: 'string',
              maxLength: 20,
            },

            serviceEntryDate: buildDefinitionReference('date'),

            serviceEndDate: buildDefinitionReference('date'),
          },
          required: ['branchOfService', 'component', 'rankAtDeath', 'serviceEntryDate'],
        },
      },
      required: ['name', 'ssn', 'dateOfBirth', 'dateOfDeath', 'placeOfDeath', 'service'],
    },

    // ── Chapter 3 — Burial Information ───────────────────────────────────────
    burialLocation: {
      type: 'object',
      additionalProperties: false,
      description: 'Chapter 3: Cemetery and grave location information.',
      properties: {
        cemeteryName: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },

        cemeteryAddress: buildDefinitionReference('address'),

        cemeteryContactName: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },

        cemeteryContactPhone: buildDefinitionReference('phone'),

        graveSection: {
          type: 'string',
          maxLength: 20,
          description: '⚠️ UNVERIFIED: confirm whether required or optional on the actual form.',
        },

        graveLot: {
          type: 'string',
          maxLength: 20,
          description: '⚠️ UNVERIFIED: confirm whether required or optional on the actual form.',
        },

        graveNumber: {
          type: 'string',
          maxLength: 20,
          description: '⚠️ UNVERIFIED: confirm whether required or optional on the actual form.',
        },

        existingMarkerPresent: {
          type: 'string',
          enum: ['noExistingMarker', 'privateMarkerExists', 'governmentMarkerAlreadyPlaced'],
        },
      },
      required: ['cemeteryName', 'cemeteryAddress', 'cemeteryContactName', 'cemeteryContactPhone', 'existingMarkerPresent'],
    },

    // ── Chapter 4 — Headstone or Marker Selection ─────────────────────────────
    markerRequest: {
      type: 'object',
      additionalProperties: false,
      description: 'Chapter 4: Headstone or marker type, emblem, and inscription selections.',
      properties: {
        markerType: {
          type: 'string',
          enum: [
            'uprightMarble',
            'uprightGranite',
            'flatGranite',
            'flatMarble',
            'flatBronze',
          ],
          description: '⚠️ UNVERIFIED: complete current NCA marker type list must be confirmed with NCA program office.',
        },

        emblemOfBelief: {
          type: 'string',
          description: 'NCA-approved emblem of belief code. Empty string or omitted means no emblem requested. ⚠️ UNVERIFIED: emblem list must be obtained as structured data from NCA; governance process required.',
        },

        personalInscription: {
          type: 'string',
          maxLength: 60,
          description: '⚠️ UNVERIFIED: maxLength of 60 is an estimate. Must be confirmed against NCA inscription policy. Pattern allows letters, numbers, spaces, hyphens, periods, apostrophes, and commas.',
          pattern: "^[A-Za-z0-9 \\-\\.,']*$",
        },
      },
      required: ['markerType'],
    },

    // ── Chapter 5 — Supporting Documents ─────────────────────────────────────
    documents: {
      type: 'object',
      additionalProperties: false,
      description: 'Chapter 5: Uploaded supporting document references (S3 confirmation codes).',
      properties: {
        deathCertificate: buildDefinitionReference('fileUpload'),

        ddForm1300: {
          $ref: '#/definitions/fileUpload',
          description: 'DD Form 1300 (Report of Casualty). Required when serviceStatusAtDeath = activeDuty.',
        },

        ngbForm22: {
          $ref: '#/definitions/fileUpload',
          description: 'NGB Form 22 or equivalent Guard/Reserve service record. Required when serviceStatusAtDeath = guardOrReserve.',
        },

        authorizationDocument: {
          $ref: '#/definitions/fileUpload',
          description: 'Written authorization document. Required when submitterRole is not nextOfKin.',
        },

        additionalDocuments: {
          type: 'array',
          items: buildDefinitionReference('fileUpload'),
          minItems: 0,
          maxItems: 5,
          description: '⚠️ UNVERIFIED: maxItems of 5 is an estimate. Confirm with NCA.',
        },
      },
      required: ['deathCertificate'],
    },

    // ── Chapter 6 — Certification ─────────────────────────────────────────────
    certificationAttestation: {
      type: 'boolean',
      enum: [true],
      description: 'Claimant certification that all information provided is true and correct. Must be true to submit. ⚠️ UNVERIFIED: exact certification language and Privacy Act notice text must be confirmed against official form PDF.',
    },
  },

  required: [
    'serviceStatusAtDeath',
    'submitterRole',
    'applicant',
    'decedent',
    'burialLocation',
    'markerRequest',
    'documents',
    'certificationAttestation',
  ],
};

export default schema;