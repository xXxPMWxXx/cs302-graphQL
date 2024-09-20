import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolver.js';
import db from '../_db.js'

const server = new ApolloServer({
  // typeDefs -- definitions of types of data
  // resolvers -- handles request and return data
  typeDefs,
  resolvers,

});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({
    headers: req.headers
  }),
  listen: { port: 4000 },
})

console.log(` Server ready at ${url}`);
