const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
require("dotenv").config();

const doc = {
  openapi: "3.0.0",

  info: {
    title: "Pet tracker API",
    description: "API for pet tracker!",
    version: "0.0.2-dev",
  },

  servers: [
    {
      url: `${process.env.SWAGGER_SCHEMA}://${process.env.SWAGGER_HOST}/api`,
      description: "dynamic env‑based URL",
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

    /* ===================  SCHEMAS  =================== */
    schemas: {
      /* ----------  AnimalType  ---------- */
      AnimalType: {
        type: "object",
        properties: {
          name: { type: "string", example: "cat" },
          icon: {
            type: "string",
            format: "uri",
            example: "%backend%/images/baseicon.png",
          },
          breeds: {
            type: "array",
            items: { type: "string" },
            example: ["first breed", "second breed"],
          },
        },
        required: ["name"],
      },

      /* ----------  Animal  ---------- */
      Animal: {
        type: "object",
        properties: {
          name: { type: "string", example: "animal1" },
          age: { type: "number", example: 12 },
          weight: { type: "number", example: 2 },
          breed: { type: "string", description: "ObjectId" },
          animalType: { type: "string", description: "ObjectId" },
          documents: {
            type: "array",
            items: { type: "string", description: "ObjectId" },
          },
          injections: {
            type: "array",
            items: { type: "string", description: "ObjectId" },
          },
          gender: { type: "string", enum: ["male", "female", "unknown"] },
          chipId: { type: "string", example: "981020012345678" },
          birthDate: { type: "string", format: "date-time" },
          registeredAt: { type: "string", format: "date-time" },
          isSterilized: { type: "boolean", example: true },
          owner: { type: "string", description: "ObjectId" },
          avatar: {
            type: "string",
            format: "uri",
            example: "%backend%/images/baseicon.png",
          },
          notes: {
            type: "array",
            items: { type: "string", description: "ObjectId" },
          },
          status: { type: "string", enum: ["active", "archived"] },
        },
        required: ["name", "animalType", "status"],
      },

      /* ----------  Breed  ---------- */
      Breed: {
        type: "object",
        properties: {
          name: { type: "string", example: "breed1" },
          recomendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", example: "recommendation1" },
                content: { type: "string", example: "content" },
              },
              required: ["name", "content"],
            },
          },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["name"],
      },

      /* ----------  Document  ---------- */
      Document: {
        type: "object",
        properties: {
          title: { type: "string", example: "document1" },
          fileUrl: {
            type: "string",
            format: "uri",
            example: "%backend%/images/baseicon.png",
          },
          animal: { type: "string", description: "ObjectId" },
          owner: { type: "string", description: "ObjectId" },
          uploadedAt: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["active", "archived"] },
          fields: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", example: "field1" },
                data: { type: "string", example: "data" },
                type: { type: "string", example: "id" },
              },
              required: ["name", "data", "type"],
            },
          },
        },
        required: ["title", "fileUrl", "status"],
      },

      /* ----------  PlannedInjection  ---------- */
      PlannedInjection: {
        type: "object",
        properties: {
          name: { type: "string", example: "injection1" },
          variant: { type: "string", enum: ["planned"] },
          note: { type: "string", example: "note" },
          breed: { type: "string", description: "ObjectId" },
          recomendatrionsAtWeeks: { type: "number", example: 1 },
        },
        required: ["name", "variant", "breed"],
      },

      /* ----------  AdditionalInjection  ---------- */
      AdditionalInjection: {
        type: "object",
        properties: {
          name: { type: "string", example: "injection1" },
          variant: { type: "string", enum: ["additional"] },
          note: { type: "string", example: "note" },
          animal: { type: "string", description: "ObjectId" },
          recomendatrionsAtWeeks: { type: "number", example: 1 },
        },
        required: ["name", "variant", "animal"],
      },

      /* ----------  RecordInjection  ---------- */
      RecordInjection: {
        type: "object",
        properties: {
          name: { type: "string", example: "injection1" },
          variant: { type: "string", enum: ["record"] },
          note: { type: "string", example: "note" },
          animal: { type: "string", description: "ObjectId" },
          injectionRef: { type: "string", description: "ObjectId" },
          recomendatrionsAtWeeks: { type: "number", example: 1 },
        },
        required: ["name", "variant", "animal", "injectionRef"],
      },

      /* ----------  User  ---------- */
      User: {
        type: "object",
        properties: {
          username: { type: "string", example: "username" },
          email: { type: "string", format: "email", example: "test@test.com" },
          passwordHash: { type: "string", example: "hash" },
          googleId: { type: "string", example: "googleId" },
          googleAccessToken: { type: "string", example: "google access token" },
          googleRefreshToken: {
            type: "string",
            example: "google refresh token",
          },
          animals: {
            type: "array",
            items: { type: "string", description: "ObjectId" },
          },
          avatar: {
            type: "string",
            format: "uri",
            example: "%backend%/images/baseicon.png",
          },
          sessions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                provider: { type: "string", enum: ["google", "self"] },
                sessionId: { type: "string", example: "session id" },
                device: { type: "string", example: "user‑agent" },
                ip: { type: "string", example: "127.0.0.1" },
                createdAt: { type: "string", format: "date-time" },
                expiresAt: { type: "string", format: "date-time" },
              },
              required: ["provider", "sessionId", "createdAt", "expiresAt"],
            },
          },
          roles: { type: "string", enum: ["user", "admin"] },
          createdAt: { type: "string", format: "date-time" },
          lastLogin: { type: "string", format: "date-time" },
        },
        required: ["username", "email", "roles"],
      },

      /* ----------  Note  ---------- */
      Note: {
        type: "object",
        properties: {
          text: { type: "string", example: "some text" },
          author: { type: "string", description: "ObjectId" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["text", "author"],
      },
      SelfLoginSchema: {
        $username: "username",
        $password: "password",
      },
      SelfRegisterSchema: {
        $username: "username",
        $password: "password",
        $email: "email",
      },
      CreateAnimalSchema: {
        $name: "name",
        $breed: "objectId",
        $animalType: "objectId",
        $birthDate: "date",
        $isSterilized: "false",
        $avatar: "http://example.com (optional)",
        $gender: "unknown",
        $chipId: "000000000000000 (optional)",
      },
    },
  },
};
const outputFile = "./swagger.json"; // where swagger file will be generated
const endpointsFiles = ["./router.ts"]; // your route files

swaggerAutogen(outputFile, endpointsFiles, doc);
