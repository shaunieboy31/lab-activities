import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QR Ticketing System API',
      version: '1.0.0',
      description: 'A complete event management and QR-based ticketing system with email notifications, payment tracking, and attendee check-in capabilities.'
    },
    servers: [
      {
        url: 'http://localhost:3010',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        organizerKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-org-key',
          description: 'Organizer API Key'
        },
        adminKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-admin-key',
          description: 'Admin API Key (superadmin)'
        }
      },
      schemas: {
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'bad0af0d-1c52-4f32-b317-65fb8dd07556'
            },
            title: {
              type: 'string',
              example: 'TechFest 2026'
            },
            description: {
              type: 'string',
              example: 'Campus tech showcase with demos, talks, and startup booths.'
            },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-25T07:12:00.333Z'
            },
            capacity: {
              type: 'integer',
              example: 120
            },
            price: {
              type: 'number',
              example: 100
            },
            status: {
              type: 'string',
              enum: ['active', 'suspended', 'cancelled'],
              example: 'active'
            },
            registered: {
              type: 'integer',
              example: 2
            },
            confirmed: {
              type: 'integer',
              example: 2
            },
            checkedIn: {
              type: 'integer',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-18T07:12:00.334Z'
            }
          }
        },
        Registration: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'e9bb5023-1833-4971-9bf7-3da73d58a05e'
            },
            eventId: {
              type: 'string',
              format: 'uuid',
              example: 'bad0af0d-1c52-4f32-b317-65fb8dd07556'
            },
            name: {
              type: 'string',
              example: 'Shaun Russelle Obseñares'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'shaunieboy573@gmail.com'
            },
            company: {
              type: 'string',
              example: 'CVSU'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'rejected'],
              example: 'confirmed'
            },
            qrPayload: {
              type: 'string',
              example: '{"ticketId":"e9bb5023-1833-4971-9bf7-3da73d58a05e","eventId":"bad0af0d-1c52-4f32-b317-65fb8dd07556","type":"ticket"}'
            },
            qrImage: {
              type: 'string',
              description: 'Entry ticket QR code as base64 PNG'
            },
            gcashQrImage: {
              type: 'string',
              description: 'GCash payment QR code as base64 PNG'
            },
            checkinAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-01-18T13:02:49.027Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-18T12:58:41.546Z'
            }
          }
        },
        Announcement: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            eventId: {
              type: 'string',
              format: 'uuid'
            },
            subject: {
              type: 'string',
              example: 'Venue Change Notice'
            },
            message: {
              type: 'string',
              example: 'The event location has been moved to Building B'
            },
            createdBy: {
              type: 'string',
              example: 'John Organizer'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Organizer: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              example: 'John Smith'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            key: {
              type: 'string',
              example: 'admin'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              example: 'active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    paths: {
      '/api/health': {
        get: {
          summary: 'Health Check',
          description: 'Check if the API is running',
          tags: ['System'],
          responses: {
            '200': {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/organizer': {
        post: {
          summary: 'Verify Organizer Key',
          description: 'Authenticate as an organizer using the x-org-key header',
          tags: ['Authentication'],
          security: [{ organizerKey: [] }],
          responses: {
            '200': {
              description: 'Authorization successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      organizer: { $ref: '#/components/schemas/Organizer' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Invalid or missing organizer key'
            }
          }
        }
      },
      '/api/auth/admin': {
        post: {
          summary: 'Verify Admin Key',
          description: 'Authenticate as admin using the x-admin-key header',
          tags: ['Authentication'],
          security: [{ adminKey: [] }],
          responses: {
            '200': {
              description: 'Authorization successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Authorized' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Invalid or missing admin key'
            }
          }
        }
      },
      '/api/events': {
        get: {
          summary: 'List All Events',
          description: 'Get all events with registration statistics',
          tags: ['Events'],
          responses: {
            '200': {
              description: 'List of events',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Event' }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create New Event',
          description: 'Create a new event (requires organizer key)',
          tags: ['Events'],
          security: [{ organizerKey: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', example: 'TechFest 2026' },
                    description: { type: 'string', example: 'Campus tech showcase' },
                    date: { type: 'string', format: 'date-time' },
                    capacity: { type: 'integer', example: 120 },
                    price: { type: 'number', example: 100 }
                  },
                  required: ['title']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Event created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Event' }
                }
              }
            },
            '401': { description: 'Unauthorized' }
          }
        }
      },
      '/api/events/{id}': {
        get: {
          summary: 'Get Event Details',
          description: 'Get detailed information about a specific event',
          tags: ['Events'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': {
              description: 'Event details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Event' }
                }
              }
            },
            '404': { description: 'Event not found' }
          }
        },
        put: {
          summary: 'Update Event',
          description: 'Update event details (requires organizer key)',
          tags: ['Events'],
          security: [{ organizerKey: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                    capacity: { type: 'integer' },
                    price: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Event updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Event' }
                }
              }
            },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Event not found' }
          }
        },
        delete: {
          summary: 'Delete Event',
          description: 'Delete an event (requires organizer key)',
          tags: ['Events'],
          security: [{ organizerKey: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': { description: 'Event deleted' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Event not found' }
          }
        }
      },
      '/api/events/{id}/suspend': {
        post: {
          summary: 'Suspend Event',
          description: 'Temporarily suspend an event (requires organizer key)',
          tags: ['Events'],
          security: [{ organizerKey: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': {
              description: 'Event suspended',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Event' }
                }
              }
            },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Event not found' }
          }
        }
      },
      '/api/events/{id}/activate': {
        post: {
          summary: 'Activate Event',
          description: 'Activate a suspended event (requires organizer key)',
          tags: ['Events'],
          security: [{ organizerKey: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': {
              description: 'Event activated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Event' }
                }
              }
            },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Event not found' }
          }
        }
      },
      '/api/events/{id}/register': {
        post: {
          summary: 'Register for Event',
          description: 'Register an attendee for an event and generate QR codes',
          tags: ['Registrations'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    company: { type: 'string', example: 'Acme Corp' }
                  },
                  required: ['name', 'email']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Registration successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                      qrImage: { type: 'string' },
                      gcashQrImage: { type: 'string' },
                      paymentStatus: { type: 'string' },
                      event: { $ref: '#/components/schemas/Event' }
                    }
                  }
                }
              }
            },
            '400': { description: 'Invalid data or event full' },
            '404': { description: 'Event not found' }
          }
        }
      },
      '/api/registrations': {
        get: {
          summary: 'List All Registrations',
          description: 'Get all event registrations',
          tags: ['Registrations'],
          responses: {
            '200': {
              description: 'List of registrations',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Registration' }
                  }
                }
              }
            }
          }
        }
      },
      '/api/registrations/{id}': {
        get: {
          summary: 'Get Registration Details',
          description: 'Get details of a specific registration',
          tags: ['Registrations'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': {
              description: 'Registration details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Registration' }
                }
              }
            },
            '404': { description: 'Registration not found' }
          }
        },
        put: {
          summary: 'Update Registration',
          description: 'Update attendee information',
          tags: ['Registrations'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    company: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Registration updated' },
            '404': { description: 'Registration not found' }
          }
        },
        delete: {
          summary: 'Cancel Registration',
          description: 'Cancel an event registration',
          tags: ['Registrations'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': { description: 'Registration cancelled' },
            '404': { description: 'Registration not found' }
          }
        }
      },
      '/api/registrations/{id}/confirm': {
        post: {
          summary: 'Confirm Payment',
          description: 'Confirm payment for a registration and send entry ticket',
          tags: ['Registrations'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': { description: 'Payment confirmed' },
            '404': { description: 'Registration not found' }
          }
        }
      },
      '/api/registrations/{id}/checkin': {
        post: {
          summary: 'Check In Attendee',
          description: 'Mark an attendee as checked in at the event',
          tags: ['Registrations'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': {
              description: 'Attendee checked in',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      id: { type: 'string' },
                      checkinAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            },
            '404': { description: 'Registration not found' }
          }
        }
      },
      '/api/registrations/export/csv': {
        get: {
          summary: 'Export Registrations to CSV',
          description: 'Export event registrations as CSV file',
          tags: ['Registrations'],
          parameters: [
            {
              name: 'eventId',
              in: 'query',
              required: false,
              schema: { type: 'string', format: 'uuid' },
              description: 'Filter by event ID'
            }
          ],
          responses: {
            '200': {
              description: 'CSV file exported',
              content: {
                'text/csv': {
                  schema: { type: 'string' }
                }
              }
            }
          }
        }
      },
      '/api/admin/organizers': {
        get: {
          summary: 'List All Organizers',
          description: 'Get all organizers (admin only)',
          tags: ['Admin'],
          security: [{ adminKey: [] }],
          responses: {
            '200': {
              description: 'List of organizers',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Organizer' }
                  }
                }
              }
            },
            '401': { description: 'Unauthorized' }
          }
        },
        post: {
          summary: 'Create Organizer',
          description: 'Create a new organizer account (admin only)',
          tags: ['Admin'],
          security: [{ adminKey: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'John Smith' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    key: { type: 'string', example: 'organizer-key-123' }
                  },
                  required: ['name', 'email', 'key']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Organizer created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Organizer' }
                }
              }
            },
            '400': { description: 'Invalid data' },
            '401': { description: 'Unauthorized' }
          }
        }
      },
      '/api/admin/organizers/{id}': {
        put: {
          summary: 'Update Organizer',
          description: 'Update organizer details (admin only)',
          tags: ['Admin'],
          security: [{ adminKey: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    status: { type: 'string', enum: ['active', 'inactive'] }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Organizer updated' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Organizer not found' }
          }
        },
        delete: {
          summary: 'Delete Organizer',
          description: 'Delete an organizer (admin only)',
          tags: ['Admin'],
          security: [{ adminKey: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': { description: 'Organizer deleted' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Organizer not found' }
          }
        }
      },
      '/api/events/{eventId}/announcements': {
        get: {
          summary: 'Get Event Announcements',
          description: 'Get all announcements for an event',
          tags: ['Announcements'],
          parameters: [
            {
              name: 'eventId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': {
              description: 'List of announcements',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Announcement' }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create Announcement',
          description: 'Create and broadcast announcement to all confirmed attendees',
          tags: ['Announcements'],
          security: [{ organizerKey: [] }],
          parameters: [
            {
              name: 'eventId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    subject: { type: 'string', example: 'Venue Change Notice' },
                    message: { type: 'string', example: 'The event location has been moved' }
                  },
                  required: ['subject', 'message']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Announcement created and sent',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Announcement' }
                }
              }
            },
            '400': { description: 'Invalid data' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Event not found' }
          }
        }
      },
      '/api/test-email': {
        post: {
          summary: 'Send Test Email',
          description: 'Send a test email to verify email configuration',
          tags: ['Utilities'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email', example: 'test@example.com' }
                  },
                  required: ['email']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Test email sent',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      email: { type: 'string' }
                    }
                  }
                }
              }
            },
            '400': { description: 'Email required' }
          }
        }
      }
    }
  },
  apis: []
};

export default swaggerJsdoc(options);
