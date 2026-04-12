import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const routesGlob = path.resolve(__dirname, '../routes/*.{ts,js}');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'YogaApp API',
      version: '1.0.0',
      description: 'REST API for Yoga H\'om Studio Management',
    },
    servers: [
      {
        url: '/api',
        description: 'API base path',
      },
    ],
    components: {
      schemas: {
        Address: {
          type: 'object',
          properties: {
            street: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'Pittsburgh' },
            state: { type: 'string', example: 'PA' },
            zip: { type: 'string', example: '15213' },
          },
        },
        Instructor: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            instructorId: { type: 'string', example: 'I00001' },
            firstName: { type: 'string', example: 'Stan' },
            lastName: { type: 'string', example: 'Smith' },
            fullName: { type: 'string', example: 'Stan Smith' },
            address: { $ref: '#/components/schemas/Address' },
            phone: { type: 'string', example: '412-555-0123' },
            email: { type: 'string', example: 'stan@yogahom.com' },
            preferredCommunication: { type: 'string', enum: ['phone', 'email'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        InstructorInput: {
          type: 'object',
          required: ['firstName', 'lastName'],
          properties: {
            firstName: { type: 'string', example: 'Stan' },
            lastName: { type: 'string', example: 'Smith' },
            address: { $ref: '#/components/schemas/Address' },
            phone: { type: 'string', example: '412-555-0123' },
            email: { type: 'string', example: 'stan@yogahom.com' },
            preferredCommunication: { type: 'string', enum: ['phone', 'email'], default: 'email' },
          },
        },
        NameCheckResponse: {
          type: 'object',
          properties: {
            exists: { type: 'boolean' },
            count: { type: 'integer' },
            matches: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  instructorId: { type: 'string' },
                  fullName: { type: 'string' },
                },
              },
            },
          },
        },
        Class: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            instructor: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                instructorId: { type: 'string' },
              },
            },
            dayOfWeek: { type: 'string', enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '10:15' },
            classType: { type: 'string', enum: ['General', 'Special'] },
            className: { type: 'string', example: 'All Levels' },
            payRate: { type: 'number', example: 45.0 },
            isPublished: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ClassInput: {
          type: 'object',
          required: ['instructor', 'dayOfWeek', 'startTime', 'endTime', 'payRate'],
          properties: {
            instructor: { type: 'string', description: 'Instructor ObjectId' },
            dayOfWeek: { type: 'string', enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '10:15' },
            classType: { type: 'string', enum: ['General', 'Special'], default: 'General' },
            className: { type: 'string', default: 'All Levels' },
            payRate: { type: 'number', example: 45.0 },
          },
        },
        TimeSlot: {
          type: 'object',
          properties: {
            start: { type: 'string', example: '09:00' },
            end: { type: 'string', example: '10:15' },
          },
        },
        ConflictResponse: {
          type: 'object',
          properties: {
            hasConflict: { type: 'boolean' },
            conflicts: { type: 'array', items: { $ref: '#/components/schemas/Class' } },
            availableSlots: { type: 'array', items: { $ref: '#/components/schemas/TimeSlot' } },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [routesGlob],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;