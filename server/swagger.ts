import swaggerAutogen from "swagger-autogen"

const doc = {
    info: {
        title: "Pet tracker API",
        description: "API for pet tracker!",
    },
    host: "localhost:3000", // your server host
    schemes: ["http"], // or 'https'
    // you can add more Swagger config here
}

const outputFile = "./swagger.json" // where swagger file will be generated
const endpointsFiles = ["./index.ts"] // your route files

swaggerAutogen(outputFile, endpointsFiles, doc)
