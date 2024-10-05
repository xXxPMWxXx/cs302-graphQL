// import { ApolloServer } from '@apollo/server';
// import { resolvers } from '../resolver.js';
// import { typeDefs } from '../schema.js';
// import assert from 'assert';
// import { UsersAPI } from '../RESTDataSource/users-api.js'; 
// import { RecipesAPI } from '../RESTDataSource/recipes-api.js';
// import { ReviewsAPI } from '../RESTDataSource/reviews-api.js';

// const mockUsers = [
//     { _id: '6700cb36082d89a475382ef9', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
//     { _id: '2', first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com' },
// ];

// const mockRecipes = [
//     {
//         _id: '1',
//         author: '1',
//         cook_time: 30,
//         created_at: '2024-01-01',
//         cuisine_type: 'Italian',
//         description: 'Delicious spaghetti.',
//         image: 'http://example.com/spaghetti.jpg',
//         ingredients: [{ ingredient_name: 'spaghetti', quantity: '200g' }],
//         name: 'Spaghetti',
//         portion_size: 2,
//         prep_time: 15,
//         steps: [{ description: 'Boil water.', image: null }],
//     },
// ];

// const createMockDataSources = () => ({
//     usersAPI: {
//         getUserById: (id) => mockUsers.find(user => user._id === id),
//         findOrCreateUser: (userData) => {
//             const existingUser = mockUsers.find(user => user.email === userData.email);
//             if (existingUser) { return existingUser; }
//             const newUser = { _id: String(mockUsers.length + 1), ...userData };
//             mockUsers.push(newUser);
//             return newUser;
//         },
//     },
//     recipesAPI: {
//         getRecipes: () => mockRecipes,
//         getRecipe: (id) => mockRecipes.find(recipe => recipe._id === id),
//         createRecipe: (recipe) => {
//             recipe._id = String(mockRecipes.length + 1);
//             mockRecipes.push(recipe);
//             return recipe;
//         },
//     },

// });

// describe('GraphQL API with Mock Data', () => {

//     const testServer = new ApolloServer({
//         typeDefs,
//         resolvers,
//         context: ({ req }) => ({
//             cache: {}, // You can mock the cache if necessary
//             headers: req.headers,
//             dataSources: {
//                 usersAPI: new UsersAPI({ cache }),
//                 recipesAPI: new RecipesAPI({ cache }),
//                 reviewsAPI: new ReviewsAPI({ cache }),
//             }, // Pass mock data sources in context
//         }),
//     });


//     it('returns hello with the provided name', async () => {
//         const response = await testServer.executeOperation({
//             query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
//             variables: { name: 'world' },
//         });

//         assert(response.body.kind === 'single');
//         expect(response.body.singleResult.errors).toBeUndefined();
//         expect(response.body.singleResult.data?.hello).toBe('Hello world!');
//     });

//     // it('returns user by ID', async () => {
//     //     const userId = '6700cb36082d89a475382ef9'; // Assuming this ID exists in mockUsers

//     //     const response = await testServer.executeOperation({
//     //         query: 'query GetUserById($id: ID!) { userById(_id: $id) { _id, first_name, last_name, email } }',
//     //         variables: { id: userId },
//     //     });

//     //     console.log(response.body.singleResult.data);
//     //     assert(response.body.kind === 'single');
//     //     expect(response.body.singleResult.errors).toBeUndefined();
//     //     expect(response.body.singleResult.data?.userById).toEqual({
//     //         _id: '1',
//     //         first_name: 'John',
//     //         last_name: 'Doe',
//     //         email: 'john.doe@example.com',
//     //     });
//     // });
// });