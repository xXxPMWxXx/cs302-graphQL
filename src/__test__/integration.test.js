import request from 'supertest';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from '../schema.js';  // Adjust the path based on your structure
import { resolvers } from '../resolver.js'; // Adjust the path based on your structure
import { UsersAPI } from '../RESTDataSource/users-api.js';
import { RecipesAPI } from '../RESTDataSource/recipes-api.js';
import { ReviewsAPI } from '../RESTDataSource/reviews-api.js';
import dotenv from 'dotenv';

dotenv.config();

// Create a new Express app for testing
const app = express();
const httpServer = http.createServer(app);
const testToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkdtWFZRdEMybk5iR2NKMHY0NG9jZCJ9.eyJpc3MiOiJodHRwczovL2Rldi1pdTRrem95bXhnZzB2enRuLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNTg0NTI2OTY4ODkyMTE5NTkxMSIsImF1ZCI6WyJodHRwOi8vbG9jYWxob3N0OjQwMDAvIiwiaHR0cHM6Ly9kZXYtaXU0a3pveW14Z2cwdnp0bi51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4MTAyNTgyLCJleHAiOjE3MjgxODg5ODIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhenAiOiJHVmlXeGNPS1NhSFFpclhocGYwd3Rvd2VHQjczQ21XVyJ9.Jgotj9iNZ4QTmz7_T8dg-Y0rlKI26_BBEhZ1V1F_zba1JtRPQuDfME3yOPAGFi_Gfrkh1OORMUXUerkSzGJ8bzJhrhzjUFcKf9msTuXhmzIFNPJ3Eu54LsUp2eBuLeI08ytq5st7QsFPYGOoo9s625xAS7Cla_5YjdpFNrONVyQU4IeUtv8FGrjT35_LsuH885rdedF8ZrM87GuCGaudha5heNyQaXikNIUpYdasIq2ihAWS--HCDZaQv8An8UYK-LN7n5eZDbFP_gnXdjhQIVW3dTlNkIkFCHrz8x0suuyLlVWcphheFtpXe-5hPkZc1qFQgRHlC7DYLfr33BwO5w';
// Set up Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start the server before running tests
beforeAll(async () => {
    await server.start();
    // Use the express middleware
    app.use(
        '/graphql',
        cors(),
        // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
        express.json({ limit: '50mb' }),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const { cache } = server;
                return {
                    cache: cache,
                    headers: req.headers,
                    dataSources: {
                        usersAPI: new UsersAPI({ cache }),
                        recipesAPI: new RecipesAPI({ cache }),
                        reviewsAPI: new ReviewsAPI({ cache }),
                    },
                };
            },
        }),
    );
});

// Stop the server after tests
afterAll(async () => {
    await server.stop();
});

describe('GraphQL Integration Tests', () => {
    it('fetches a list of recipes', async () => {
        const GET_RECIPES = `
            query {
                recipes {
                    _id
                    name
                    description
                }
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_RECIPES })
            .set('Authorization', `Bearer ${testToken}`);
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.recipes).toBeInstanceOf(Array); // Expect an array of recipes
    });

    // it('fetches a recipe by ID', async () => {
    //     const GET_RECIPE = `
    //         query($id: ID!) {
    //             recipe(_id: $id) {
    //                 _id
    //                 name
    //                 description
    //             }
    //         }
    //     `;

    //     const variables = { id: 'some-recipe-id' }; // Replace with a valid recipe ID

    //     const response = await request(httpServer)
    //         .post('/graphql')
    //         .send({ query: GET_RECIPE, variables })
    //         .set('Authorization', `Bearer ${testToken}`);

    //     expect(response.status).toBe(200);
    //     expect(response.body.errors).toBeUndefined();
    //     expect(response.body.data.recipe).toBeDefined();
    //     expect(response.body.data.recipe._id).toBe(variables.id); // Validate the ID matches
    // });

    // it('creates a new recipe', async () => {
    //     const CREATE_RECIPE = `
    //         mutation($input: CreateRecipeInput!) {
    //             createRecipe(input: $input) {
    //                 _id
    //                 name
    //             }
    //         }
    //     `;

    //     const variables = {
    //         input: {
    //             name: 'New Recipe',
    //             description: 'A delicious new recipe.',
    //             portion_size: 4,
    //             cuisine_type: 'Italian',
    //             ingredients: ['ingredient1', 'ingredient2'],
    //             steps: ['step1', 'step2'],
    //             author: 'authorId', // Use a valid author ID
    //             prep_time: 30,
    //             cook_time: 60,
    //             created_at: new Date().toISOString(),
    //             image: 'http://example.com/image.jpg',
    //         },
    //     };

    //     const response = await request(httpServer)
    //         .post('/graphql')
    //         .send({ query: CREATE_RECIPE, variables })
    //         .set('Authorization', `Bearer ${testToken}`);

    //     expect(response.status).toBe(200);
    //     expect(response.body.errors).toBeUndefined();
    //     expect(response.body.data.createRecipe).toBeDefined();
    //     expect(response.body.data.createRecipe.name).toBe(variables.input.name); // Validate the name matches
    // });

    // Add more tests for other resolvers and cases as needed
});