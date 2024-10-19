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
    getUserById: jest.fn().mockImplementation((id) => {
        if (id === '123') {  // Known ID for success
            return Promise.resolve({
                _id: '123',
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com',
                about_me: 'I love cooking!',
                email_preferences: true,
                created_at: '2024-10-05T00:00:00Z',
                updated_at: '2024-10-05T00:00:00Z',
            });
        } else {  // Unknown ID for error
            return Promise.reject(new Error('User not found'));
        }
    }),
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
            cook_time: 30,
            created_at: '2024-10-01T00:00:00Z',
            cuisine_type: 'Italian',
            description: 'Delicious pasta with tomato sauce.',
            image: 'https://example.com/pasta.jpg',
            author: '123', // need to map this id with the getUserById mock
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
            cook_time: 25,
            created_at: '2024-10-01T00:00:00Z',
            cuisine_type: 'Mexican',
            author: '123', // need to map this id with the getUserById mock
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
    getRecipe: jest.fn().mockImplementation((recipe_id) => {
        if (recipe_id === '1') {
            return Promise.resolve({
                _id: '1',
                cook_time: 30,
                created_at: '2024-10-01T00:00:00Z',
                cuisine_type: 'Italian',
                author: '123',
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
            });
        } else {  // Unknown author ID for error
            return Promise.reject(new Error('Recipe not found'));
        }


    }),
    getRecipesByAuthor: jest.fn().mockImplementation((author_id) => {
        if (author_id === '123') {  // Known author ID for success
            return Promise.resolve([
                {
                    _id: 'recipe1',
                    name: 'Delicious Pasta',
                    description: 'Pasta with tomato sauce.',
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
                    _id: 'recipe2',
                    name: 'Chocolate Cake',
                    description: 'A rich chocolate cake.',
                    author: '123',
                    cook_time: 45,
                    prep_time: 15,
                    ingredients: [
                        { ingredient_name: 'flour', quantity: '200g' },
                        { ingredient_name: 'cocoa powder', quantity: '50g' },
                    ],
                    steps: [
                        { description: 'Mix ingredients.', image: null },
                        { description: 'Bake at 350°F.', image: null },
                    ],
                    image: 'https://example.com/cake.jpg',
                },
            ]);
        } else {  // Unknown author ID for error
            return Promise.reject(new Error('No recipes found for this author'));
        }
    }),
}));
// Assign mock for ReviewsAPI
const mockReviewsAPI = jest.fn().mockImplementation(() => ({
    getReviews: jest.fn().mockResolvedValue([
        {
            _id: 'r1',
            recipe: '1', // Recipe ID associated with the review
            rating: 5,
            author: '123',
            comment: 'Fantastic!',
            created_at: '2024-10-01T00:00:00Z',
        },
        {
            _id: 'r2',
            recipe: '1', // Recipe ID associated with the review
            rating: 4,
            author: '123',
            comment: 'Very good, will try again!',
            created_at: '2024-10-02T00:00:00Z',
        },
    ]),
    // dont need to mock by and author, as it will be using getUserById from Mock User API
    createReview: jest.fn().mockResolvedValue({
        _id: 'r3',
        recipe: '1', // Recipe ID associated with the review
        rating: 5,
        author: '123',
        comment: 'Amazing recipe!',
        created_at: '2024-10-03T00:00:00Z',
    }),
    getRecipeRating: jest.fn().mockImplementation((recipe_id) => {
        if (recipe_id === '1') {
            return Promise.resolve(5); // the actuall method will just return rating (int)
        } else {  // Unknown author ID for error
            return Promise.reject(new Error('Recipe not found'));
        }
    }),
    softDelByRecipeId: jest.fn().mockImplementation(async (recipe_id) => {
        if (recipe_id === '1') {
            return Promise.resolve(); // Simulate a successful soft delete
        } else {
            return Promise.reject(new Error('Recipe not found')); // Simulate an error for other IDs
        }
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

describe('GraphQL Integration Tests for User API', () => {
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
            .send({ query: GET_USER_BY_ID, variables: { id: '123' } });

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

    it('returns an error for a non-existent user', async () => {
        const GET_USER_BY_ID = `
          query GetUserById($id: ID!) {
            userById(_id: $id) {
              _id
              first_name
              last_name
            }
          }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_USER_BY_ID, variables: { id: 'invalid-id' } });
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe('User not found'); // Update this according to your error handling
    });

    it('finds or creates a user with invalid token', async () => {
        // Arrange
        const FIND_OR_CREATE_USER = `
            mutation FindOrCreateUser {
                findOrCreateUser {
                    _id
                    first_name
                    last_name
                    email
                    about_me
                    email_preferences
                    created_at
                    updated_at
                }
            }
        `;
        // Act
        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: FIND_OR_CREATE_USER })
            .set('Authorization', 'Bearer invalid_token'); // Set your test token here
        // Assert
        expect(response.body.errors).toBeDefined(); // Expecting an error to be present
        expect(response.body.errors[0].message).toBe('Invalid token'); // Error message should match
        expect(response.body.data.findOrCreateUser).toBe(null); // Expecting null on failur
    });

});

describe('GraphQL Integration Tests for Recipe API', () => {

    it('fetches a recipe by ID', async () => {
        const GET_RECIPE_BY_ID = `
      query GetRecipeById($id: ID!) {
        recipe(_id: $id) {
            _id
            name
            description
            author {
                email
            }
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
            rating
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
            author: {
                email: 'johndoe@example.com', // based on mockUserAPI method output
            },
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
            rating: 5
        });
    });

    it('returns an error when recipe is not found', async () => {
        const GET_RECIPE_BY_ID = `
            query GetRecipeById($id: ID!) {
                recipe(_id: $id) {
                    _id
                    name
                    description
                }
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_RECIPE_BY_ID, variables: { id: '2' } })
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe('Recipe not found');
    });

    it('fetches all recipes', async () => {
        const GET_ALL_RECIPES = `
      query GetAllRecipes {
        recipes {
          _id
          name
          description
          author {
            email
            first_name
            last_name
          }
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
                author: {
                    email: 'johndoe@example.com',
                    first_name: 'John',
                    last_name: 'Doe',
                },
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
                author: {
                    email: 'johndoe@example.com',
                    first_name: 'John',
                    last_name: 'Doe',
                },
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

    it('fetches recipes by author ID', async () => {
        const GET_RECIPES_BY_AUTHOR = `
            query GetRecipesByAuthor($authorId: ID!) {
                getRecipesByAuthor(author_id: $authorId) {
                    _id
                    name
                    description
                    author {
                        email
                    }
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

        const authorId = '123'; // Valid author ID for the mock
        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_RECIPES_BY_AUTHOR, variables: { authorId } });
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.getRecipesByAuthor).toEqual([
            {
                _id: 'recipe1',
                name: 'Delicious Pasta',
                description: 'Pasta with tomato sauce.',
                author: {
                    email: 'johndoe@example.com',
                },
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
                _id: 'recipe2',
                name: 'Chocolate Cake',
                description: 'A rich chocolate cake.',
                author: {
                    email: 'johndoe@example.com',
                },
                cook_time: 45,
                prep_time: 15,
                ingredients: [
                    { ingredient_name: 'flour', quantity: '200g' },
                    { ingredient_name: 'cocoa powder', quantity: '50g' },
                ],
                steps: [
                    { description: 'Mix ingredients.', image: null },
                    { description: 'Bake at 350°F.', image: null },
                ],
                image: 'https://example.com/cake.jpg',
            },
        ]);
    });

    it('throws an error when no recipes are found for the author', async () => {
        const GET_RECIPES_BY_AUTHOR = `
            query GetRecipesByAuthor($authorId: ID!) {
                getRecipesByAuthor(author_id: $authorId) {
                    _id
                    name
                }
            }
        `;
        const authorId = 'unknown_author'; // Unknown author ID for the error case
        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_RECIPES_BY_AUTHOR, variables: { authorId } });

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe('No recipes found for this author');
    });


});

describe('GraphQL Integration Tests for Review API', () => {

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
        expect(response.body.data.reviews).toEqual([
            {
                _id: 'r1',
                recipe: '1',
                author: {
                    _id: '123',
                    email: 'johndoe@example.com'
                },
                by: {
                    _id: '123',
                    email: 'johndoe@example.com'
                },
                rating: 5,
                comment: 'Fantastic!',
                created_at: expect.any(String),
            },
            {
                _id: 'r2',
                recipe: '1',
                author: {
                    _id: '123',
                    email: 'johndoe@example.com'
                },
                by: {
                    _id: '123',
                    email: 'johndoe@example.com'
                },
                comment: 'Very good, will try again!',
                rating: 4,
                created_at: expect.any(String)
            }
        ]);
    });

    it('fetches the rating for a valid recipe ID', async () => {
        const GET_RECIPE_RATING = `
            query GetRecipeRating($recipe_id: String!) {
                getRecipeRating(recipe_id: $recipe_id)
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_RECIPE_RATING, variables: { recipe_id: '1' } });

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.getRecipeRating).toEqual(5); // Expected rating
    });

    it('getRecipeRating returns an error for an unknown recipe ID', async () => {
        const GET_RECIPE_RATING = `
            query GetRecipeRating($recipe_id: String!) {
                getRecipeRating(recipe_id: $recipe_id)
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: GET_RECIPE_RATING, variables: { recipe_id: 'unknown_id' } });

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe('Recipe not found'); // Check the error message
    });

    it('successfully soft deletes a recipe by ID', async () => {
        const SOFT_DELETE_RECIPE = `
            mutation SoftDelByRecipeId($recipe_id: ID!) {
                softDelByRecipeId(recipe_id: $recipe_id)
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: SOFT_DELETE_RECIPE, variables: { recipe_id: '1' } })
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.softDelByRecipeId).toBe(true);
    });

    it('soft deletes a recipe by ID with no access token', async () => {
        const SOFT_DELETE_RECIPE = `
            mutation SoftDelByRecipeId($recipe_id: ID!) {
                softDelByRecipeId(recipe_id: $recipe_id)
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: SOFT_DELETE_RECIPE, variables: { recipe_id: '1' } });

        expect(response.body.errors).toBeDefined(); // Expecting an error to be present
        expect(response.body.errors[0].message).toBe('Authorization token is required'); // Error message should match
        expect(response.body.data.softDelByRecipeId).toBe(null); // Expecting null on failure
    });

    it('soft deletes a recipe by ID with with invalid access token', async () => {
        const SOFT_DELETE_RECIPE = `
            mutation SoftDelByRecipeId($recipe_id: ID!) {
                softDelByRecipeId(recipe_id: $recipe_id)
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: SOFT_DELETE_RECIPE, variables: { recipe_id: '1' } })
            .set('Authorization', 'Bearer invalid_token');

        expect(response.body.errors).toBeDefined(); // Expecting an error to be present
        expect(response.body.errors[0].message).toBe('Invalid token'); // Error message should match
        expect(response.body.data.softDelByRecipeId).toBe(null); // Expecting null on failure
    });

    it('fails to soft delete a recipe by ID if recipe does not exist', async () => {
        const SOFT_DELETE_RECIPE = `
            mutation SoftDelByRecipeId($recipe_id: ID!) {
                softDelByRecipeId(recipe_id: $recipe_id)
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .send({ query: SOFT_DELETE_RECIPE, variables: { recipe_id: '999' } })
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.body.errors).toBeDefined(); // Expecting an error to be present
        expect(response.body.errors[0].message).toBe('Recipe not found'); // Error message should match
        expect(response.body.data.softDelByRecipeId).toBe(null); // Expecting null on failure
    });
});