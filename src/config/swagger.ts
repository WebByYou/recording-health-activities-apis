import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recording Health Activities API",
      version: "1.0.0",
      description:
        "API documentation for Recording Health Activities application",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
