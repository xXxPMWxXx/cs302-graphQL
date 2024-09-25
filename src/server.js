import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './schema.js';
import { resolvers } from './resolver.js';
import { UsersAPI } from './RESTDataSource/users-api.js'; 
import dotenv from 'dotenv';
import { RecipesAPI } from './RESTDataSource/recipes-api.js';
dotenv.config();

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const server = new ApolloServer({
    // typeDefs -- definitions of types of data
    // resolvers -- handles request and return data
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();

app.use(
    '/graphql',
    cors(),
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    express.json({ limit: '50mb' }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
        context: async ({ req }) => {
            const { cache } = server;
            return {
                cache: cache,
                headers: req.headers,
                dataSources: {
                    usersAPI: new UsersAPI({ cache }),
                    recipesAPI: new RecipesAPI({ cache }),
                },
            };
        },
    }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log('🚀 Server ready at http://localhost:4000/graphql');
