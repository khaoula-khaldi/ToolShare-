const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
definition: {
  openapi: '3.0.3',
  info: { title: 'ToolShare API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    responses: {
      Unauthorized: { description: 'Token missing, invalid or expired' },
      Forbidden: { description: 'Authenticated but role not allowed' },
    },
  },
},
  apis: ['./src/routes/*.js'],
});