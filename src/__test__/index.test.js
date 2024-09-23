jest.mock('../services/gameService.js', () => ({
    fetchGames: jest.fn(),  // This ensures fetchGames is a mock function
    fetchGameById: jest.fn(),
}));

jest.mock('../services/authService.js', () => ({
    validateToken: jest.fn(),
}));
import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../schema.js';
import { resolvers } from '../resolver.js';
import { jest } from '@jest/globals';
import gql from 'graphql-tag';
import { fetchGames,fetchGameById } from '../services/gameService.js';
import { validateToken } from '../services/authService.js';


// Debugging log to check if fetchGames is mocked correctly
console.log('fetchGames:', fetchGames);
describe('GraphQL resolvers test', () => {
    let testServer;

    beforeAll(() => {
        testServer = new ApolloServer({
            typeDefs,
            resolvers,
        });
    });

    beforeEach(() => {
        jest.resetAllMocks(); // Reset mocks before each test

        jest.mock('../services/gameService.js', () => ({
            fetchGames: jest.fn(),  // This ensures fetchGames is a mock function
            fetchGameById: jest.fn(),
        }));

        jest.mock('../services/authService.js', () => ({
            validateToken: jest.fn(),
        }));
    
    });

    it('fetches a list of games with authentication', async () => {
    // Arrange: Mock the API and auth service
        const mockGames = [
            {
                game_id: '1',
                title: 'Super Mario',
                platform: 'Nintendo Switch',
                price: 59.99,
                stock: 10,
            },
            {
                game_id: '2',
                title: 'Zelda',
                platform: 'Nintendo Switch',
                price: 69.99,
                stock: 5,
            },
        ];
        fetchGames.mockResolvedValue(mockGames);
        validateToken.mockResolvedValue(true); // Mock token validation

        // Act: Execute the GraphQL query
        const query = gql`
      query GetGames {
        games {
          game_id
          title
          platform
          price
          stock
        }
      }
    `;

        const response = await testServer.executeOperation(
            { query },
            { contextValue: { headers: { authorization: 'Bearer token' } } } // Provide a fake token
        );

        // Assert: Verify the results
        expect(response.errors).toBeUndefined();
        expect(response.data.games.length).toBe(2);
        expect(response.data.games).toEqual(mockGames);
    });

    // it('fetches a game by ID', async () => {
    //   const query = gql`
    //     query GetGame($gameId: ID!) {
    //       game(game_id: $gameId) {
    //         game_id
    //         title
    //         platform
    //         price
    //         stock
    //       }
    //     }
    //   `;

    //   const variables = { gameId: '1' };
    //   const response = await testServer.executeOperation({ query, variables });

    //   expect(response.errors).toBeUndefined();
    //   expect(response.data.game.game_id).toBe('1');
    // });

    // it('creates a new user', async () => {
    //   const mutation = gql`
    //     mutation CreateUser($email: String!) {
    //       createUser(email: $email) {
    //         _id
    //         email
    //       }
    //     }
    //   `;

    //   const variables = {
    //     email: 'test@example.com',
    //   };

    //   const response = await testServer.executeOperation({ query: mutation, variables });

    //   expect(response.errors).toBeUndefined();
    //   expect(response.data.createUser.email).toBe('test@example.com');
    // });

});

// For clarity in this example we included our typeDefs and resolvers above our test,
// but in a real world situation you'd be importing these in from different files
// const typeDefs = `#graphql
//   type Query {
//     hello(name: String): String!
//   }
// `;

// const resolvers = {
//   Query: {
//     hello: (_, { name }) => `Hello ${name}!`,
//   },
// };

// it('returns hello with the provided name', async () => {
//   const testServer = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });

//   const response = await testServer.executeOperation({
//     query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
//     variables: { name: 'world' },
//   });

//   // Note the use of Node's assert rather than Jest's expect; if using
//   // TypeScript, `assert`` will appropriately narrow the type of `body`
//   // and `expect` will not.
//   expect(response.body.kind === 'single');
//   expect(response.body.singleResult.errors).toBeUndefined();
//   expect(response.body.singleResult.data?.hello).toBe('Hello world!');
// });