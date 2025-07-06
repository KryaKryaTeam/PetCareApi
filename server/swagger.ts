import swaggerAutogen from "swagger-autogen"
import { AdditionalInjection } from "./models/Injection"

const doc = {
    info: {
        title: "Pet tracker API",
        description: "API for pet tracker!",
        version: "0.0.1-dev",
    },
    host: "localhost:3000", // your server host
    schemes: ["http"], // or 'https'
    basePath: "/api/",
    definitions: {
        AnimalType: {
            name: "cat",
            icon: "%backend%/images/baseicon.png",
            breeds: ["first breed", "secound breed"],
        },
        Animal: {
            name: "animal1",
            age: 12,
            weight: 2,
            breed: "ObjectId",
            animalType: "ObejectId",
            documents: ["ObjectId"],
            injections: ["ObjectId"],
            gender: "male || famale || unknown",
            chipId: "981020012345678",
            birthDate: new Date(),
            registeredAt: new Date(),
            isSterilized: true,
            owner: "ObjectId",
            avatar: "%backend%/images/baseicon.png",
            notes: ["ObjectId"],
            status: "active || archived",
        },
        Breed: {
            name: "breed1",
            recomendations: [
                {
                    name: "recomendation1",
                    content: "content",
                },
            ],
            createdAt: new Date(),
        },
        Document: {
            title: "document1",
            fileUrl: "%backend%/images/baseicon.png",
            animal: "ObjectId",
            owner: "ObjetcId",
            uploadedAt: new Date(),
            status: "active || archived",
            fields: [
                {
                    name: "field1",
                    data: "data",
                    type: "id",
                },
            ],
        },
        PlannedInjection: {
            name: "injection1",
            variant: "planned",
            note: "note",
            breed: "ObjectId",
            recomendatrionsAtWeeks: 1,
        },
        AdditionalInjection: {
            name: "injection1",
            variant: "additional",
            note: "note",
            animal: "ObjectId",
            recomendatrionsAtWeeks: 1,
        },
        RecordInjection: {
            name: "injection1",
            variant: "record",
            note: "note",
            animal: "ObjectId",
            injectionRef: "ObjectId",
            recomendatrionsAtWeeks: 1,
        },
        User: {
            username: "username",
            email: "test@test.com",
            passwordHash: "hash",
            googleId: "googleId",
            googleAccessToken: "google access token",
            googleRefreshToken: "google refresh token",
            animals: ["ObjectId"],
            avatar: "%backend%/images/baseicon.png",
            sessions: [
                {
                    provider: "google || self",
                    sessionId: "session id",
                    device: "user-agent",
                    ip: "ip",
                    createdAt: new Date(),
                    expiresAt: new Date(),
                },
            ],
            roles: "user || admin",
            createdAt: new Date(),
            lastLogin: new Date(),
        },
        Note: {
            text: "some text",
            author: "ObjectId",
            createdAt: new Date(),
        },
    },
}

const outputFile = "./swagger.json" // where swagger file will be generated
const endpointsFiles = ["./router.ts"] // your route files

swaggerAutogen(outputFile, endpointsFiles, doc)
