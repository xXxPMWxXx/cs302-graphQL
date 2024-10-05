import request from 'supertest';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from '../schema.js';
import { resolvers } from '../resolver.js';
import { jest } from '@jest/globals';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Assign mock for UsersAPI
const mockUsersAPI = jest.fn().mockImplementation(() => ({
    getUserById: jest.fn().mockResolvedValue(
        {
            _id: '123',
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            about_me: 'I love cooking!',
            email_preferences: true,
            created_at: '2024-10-05T00:00:00Z',
            updated_at: '2024-10-05T00:00:00Z',
        }
    ),
    findOrCreateUser: jest.fn().mockResolvedValue({
        _id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        about_me: 'I love cooking!',
        email_preferences: true,
        created_at: '2024-10-05T00:00:00Z',
        updated_at: '2024-10-05T00:00:00Z',
    }),
}));

// Assign mock for RecipesAPI
const mockRecipesAPI = jest.fn().mockImplementation(() => ({
    getRecipes: jest.fn().mockResolvedValue([
        {
            _id: '1',
            author: '123',
            cook_time: 30,
            created_at: '2024-10-01T00:00:00Z',
            cuisine_type: 'Italian',
            description: 'Delicious pasta with tomato sauce.',
            image: 'https://example.com/pasta.jpg',
            ingredients: [
                { ingredient_name: 'pasta', quantity: '200g' },
                { ingredient_name: 'tomato sauce', quantity: '100g' },
            ],
            name: 'Pasta',
            portion_size: 2,
            prep_time: 10,
            steps: [
                { description: 'Boil water.', image: null },
                { description: 'Add pasta and cook.', image: null },
            ],
            views: 100,
            reviews: [],
        },
        {
            _id: '2',
            author: '123',
            cook_time: 25,
            created_at: '2024-10-01T00:00:00Z',
            cuisine_type: 'Mexican',
            description: 'Spicy tacos with beef.',
            image: 'https://example.com/tacos.jpg',
            ingredients: [
                { ingredient_name: 'taco shell', quantity: '4' },
                { ingredient_name: 'ground beef', quantity: '300g' },
            ],
            name: 'Tacos',
            portion_size: 2,
            prep_time: 15,
            steps: [
                { description: 'Cook beef.', image: null },
                { description: 'Fill taco shells with beef.', image: null },
            ],
            views: 100,
            reviews: [],
        },
    ]),
    getRecipe: jest.fn().mockResolvedValue({
        _id: '1',
        author: '123',
        cook_time: 30,
        created_at: '2024-10-01T00:00:00Z',
        cuisine_type: 'Italian',
        description: 'Delicious pasta with tomato sauce.',
        image: 'https://example.com/pasta.jpg',
        ingredients: [
            { ingredient_name: 'pasta', quantity: '200g' },
            { ingredient_name: 'tomato sauce', quantity: '100g' },
        ],
        name: 'Pasta',
        portion_size: 2,
        prep_time: 10,
        steps: [
            { description: 'Boil water.', image: null },
            { description: 'Add pasta and cook.', image: null },
        ],
        views: 100,
        reviews: [],
    }),
    createRecipe: jest.fn().mockResolvedValue({
        _id: '2',
        author: '123',
        cook_time: 25,
        created_at: '2024-10-02T00:00:00Z',
        cuisine_type: 'Mexican',
        description: 'Spicy tacos with beef.',
        image: 'https://example.com/tacos.jpg',
        ingredients: [
            { ingredient_name: 'taco shell', quantity: '4' },
            { ingredient_name: 'ground beef', quantity: '300g' },
        ],
        name: 'Tacos',
        portion_size: 4,
        prep_time: 15,
        steps: [
            { description: 'Cook beef.', image: null },
            { description: 'Fill taco shells with beef.', image: null },
        ],
        views: 50,
        reviews: [],
    }),
}));
// Assign mock for ReviewsAPI
const mockReviewsAPI = jest.fn().mockImplementation(() => ({
    getReviews: jest.fn().mockResolvedValue([
        {
            _id: 'r1',
            recipe: '1', // Recipe ID associated with the review
            author: { _id: 'u1', email: 'Alice@email.com' }, // Mock author object
            by: { _id: 'u2', email: 'Bob@email.com' }, // Mock reviewer object
            rating: 5,
            comment: 'Fantastic!',
            created_at: '2024-10-01T00:00:00Z',
        },
        {
            _id: 'r2',
            recipe: '1', // Recipe ID associated with the review
            author: { _id: 'u1', email: 'Alice@email.com' }, // Mock author object
            by: { _id: 'u3', email: 'Bob@email.com' }, // Mock reviewer object
            rating: 4,
            comment: 'Very good, will try again!',
            created_at: '2024-10-02T00:00:00Z',
        },
    ]),
    // dont need to mock by and author, as it will be using getUserById from Mock User API
    createReview: jest.fn().mockResolvedValue({
        _id: 'r3',
        recipe: '1', // Recipe ID associated with the review
        rating: 5,
        comment: 'Amazing recipe!',
        created_at: '2024-10-03T00:00:00Z',
    }),
}));

// Create a new Express app for testing
const app = express();
const httpServer = http.createServer(app);
// Set up Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Function to retrieve the token
let testToken;
const getToken = async () => {
    const response = await axios.post(`${process.env.AUTH0_DOMAIN}/oauth/token`, {
        client_id: `${process.env.AUTH0_CLIENT_ID}`,
        client_secret: `${process.env.AUTH0_CLIENT_SECRET}`,
        audience: `${process.env.API_IDENTIFIER}`,
        grant_type: 'client_credentials'
    });
    return response.data.access_token; // Get the access token from the response
};

// Start the server before running tests
beforeAll(async () => {
    testToken = await getToken();
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
                        usersAPI: new mockUsersAPI({ cache }),
                        recipesAPI: new mockRecipesAPI({ cache }),
                        reviewsAPI: new mockReviewsAPI({ cache }),
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

afterEach(() => {
    jest.clearAllMocks();  // Clear mocks between tests
});

describe('GraphQL Integration Tests', () => {

    // For User API, cannot integrate test for FindOrCreateUser as the token need to be generated from FE, 
    // as need to login using Google account, cannot simulate.
    it('fetches a user by ID', async () => {
        const GET_USER_BY_ID = `
          query GetUserById($id: ID!) {
            userById(_id: $id) {
              _id
              first_name
              last_name
              email
              about_me
              email_preferences
            }
          }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_USER_BY_ID, variables: { id: '123' } })
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.userById).toEqual({
            _id: '123',
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            about_me: 'I love cooking!',
            email_preferences: true,
        });
    });

    // For Recipe API 
    it('creates a new recipe', async () => {
        const CREATE_RECIPE = `
          mutation CreateRecipe(
            $name: String!
            $portion_size: Int
            $cuisine_type: String
            $description: String
            $ingredients: [IngredientInput]
            $steps: [StepInput]
            $author: ID!
            $prep_time: Int
            $cook_time: Int
            $image: String
          ) {
            createRecipe(
              name: $name
              portion_size: $portion_size
              cuisine_type: $cuisine_type
              description: $description
              ingredients: $ingredients
              steps: $steps
              author: $author
              prep_time: $prep_time
              cook_time: $cook_time
              image: $image
            ) {
              _id
              name
              description
              author
              cook_time
              prep_time
              ingredients {
                ingredient_name
                quantity
              }
            }
          }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({
                query: CREATE_RECIPE,
                variables: {
                    name: 'Tacos',
                    portion_size: 4,
                    cuisine_type: 'Mexican',
                    description: 'Spicy tacos with beef.',
                    ingredients: [
                        { ingredient_name: 'taco shell', quantity: '4' },
                        { ingredient_name: 'ground beef', quantity: '300g' },
                    ],
                    steps: [
                        { description: 'Cook beef.', image: null },
                        { description: 'Fill taco shells with beef.', image: null },
                    ],
                    author: '123',
                    prep_time: 15,
                    cook_time: 25,
                    image: 'https://example.com/tacos.jpg',
                },
            })
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.createRecipe).toEqual({
            _id: '2',
            name: 'Tacos',
            description: 'Spicy tacos with beef.',
            author: '123',
            cook_time: 25,
            prep_time: 15,
            ingredients: [
                { ingredient_name: 'taco shell', quantity: '4' },
                { ingredient_name: 'ground beef', quantity: '300g' },
            ],
        });
    });

    it('fetches a recipe by ID', async () => {
        const GET_RECIPE_BY_ID = `
          query GetRecipeById($id: ID!) {
            recipe(_id: $id) {
                _id
                name
                description
                author
                cook_time
                prep_time
                ingredients {
                ingredient_name
                quantity
                }
                steps {
                description
                image
                }
                reviews {
                    recipe
                    comment
                    rating
                }
                image
            }
          }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_RECIPE_BY_ID, variables: { id: '1' } })
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.recipe).toEqual({
            _id: '1',
            name: 'Pasta',
            description: 'Delicious pasta with tomato sauce.',
            author: '123',
            cook_time: 30,
            prep_time: 10,
            ingredients: [
                { ingredient_name: 'pasta', quantity: '200g' },
                { ingredient_name: 'tomato sauce', quantity: '100g' },
            ],
            steps: [
                { description: 'Boil water.', image: null },
                { description: 'Add pasta and cook.', image: null },
            ],
            image: 'https://example.com/pasta.jpg',
            reviews: expect.any(Array),
        });
    });

    it('fetches all recipes', async () => {
        const GET_ALL_RECIPES = `
          query GetAllRecipes {
            recipes {
              _id
              name
              description
              author
              cook_time
              prep_time
              ingredients {
                ingredient_name
                quantity
              }
              steps {
                description
                image
              }
              image
            }
          }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_ALL_RECIPES })
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.recipes).toEqual([
            {
                _id: '1',
                name: 'Pasta',
                description: 'Delicious pasta with tomato sauce.',
                author: '123',
                cook_time: 30,
                prep_time: 10,
                ingredients: [
                    { ingredient_name: 'pasta', quantity: '200g' },
                    { ingredient_name: 'tomato sauce', quantity: '100g' },
                ],
                steps: [
                    { description: 'Boil water.', image: null },
                    { description: 'Add pasta and cook.', image: null },
                ],
                image: 'https://example.com/pasta.jpg',
            },
            {
                _id: '2',
                name: 'Tacos',
                description: 'Spicy tacos with beef.',
                author: '123',
                cook_time: 25,
                prep_time: 15,
                ingredients: [
                    { ingredient_name: 'taco shell', quantity: '4' },
                    { ingredient_name: 'ground beef', quantity: '300g' },
                ],
                steps: [
                    { description: 'Cook beef.', image: null },
                    { description: 'Fill taco shells with beef.', image: null },
                ],
                image: 'https://example.com/tacos.jpg',
            },
        ]);
    });

    // For Review API
    it('creates a new review', async () => {
        const CREATE_REVIEW = `
            mutation CreateReview($recipe: String!, $author: String!, $by: String!, $rating: Int!, $comment: String) {
                createReview(recipe: $recipe, author: $author, by: $by, rating: $rating, comment: $comment) {
                    _id
                    author {
                        _id
                        email
                    }
                    by {
                        _id
                        email
                    }
                    comment
                    created_at
                    rating
                    recipe
                }
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({
                query: CREATE_REVIEW,
                variables: {
                    recipe: '1',
                    author: '123',
                    by: '123',
                    comment: 'Amazing recipe!',
                    rating: 5,
                },
            })
            .set('Authorization', `Bearer ${testToken}`);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.createReview).toEqual({
            _id: expect.any(String),
            recipe: '1',
            author: {
                _id: '123',
                email: expect.any(String),
            },
            by: {
                _id: '123',
                email: expect.any(String),
            },
            comment: 'Amazing recipe!',
            rating: 5,
            created_at: expect.any(String),
        });
    });

    it('fetches reviews by recipe ID', async () => {
        const GET_REVIEWS_BY_RECIPE_ID = `
          query GetReviewsByRecipeId($recipe_id: String!) {
            reviews(recipe_id: $recipe_id) {
              _id
              recipe
              author {
                _id
                email
              }
              by {
                _id
                email
              }
              comment
              rating
              created_at
            }
          }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_REVIEWS_BY_RECIPE_ID, variables: { recipe_id: '1' } })
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.reviews).toEqual(expect.arrayContaining([
            {
                _id: expect.any(String), // The ID will be generated, so we can check for its existence
                recipe: '1',
                author: {
                    _id: expect.any(String), // Replace with the expected user ID if needed
                    email: expect.any(String), // Replace with the expected name if needed
                },
                by: {
                    _id: expect.any(String), // Replace with the expected user ID if needed
                    email: expect.any(String), // Replace with the expected name if needed
                },
                comment: expect.any(String),
                rating: expect.any(Number),
                created_at: expect.any(String),
            },
        ]));
    });
});