const swaggerJSDoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Ignite Repos Documentation',
      version: '1.0.0',
      description: 'Ignite Repos Documentation',
    },
  },
  // Path to the API docs
  apis: ['./app/**/*.ts'], // Adjust the path based on your project structure
}

module.exports = swaggerJSDoc(options)
