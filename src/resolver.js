import { validateToken } from './services/authService.js';
import { fetchGames, fetchGameById } from './services/gameService.js';
import { fetchUsers, createUser } from './services/userService.js';

export const resolvers = {
  // for local DB source
  // Query: {
  //   reviews() {
  //     return db.reviews
  //   games() {
  //     return db.games
  //   },
  //   authors() {
  //     return db.authors
  //   },
  //   review(parent, args) { // args is the data user pass in 
  //     return db.reviews.find(review => review.id === args.id);
  //   },
  //   game(_, args) { 
  //     return db.games.find(game => game.id === args.id);
  //   }
  // },
  // Game: { // this is to return reviews data when query game
  //     reviews(parent) {
  //         return db.reviews.filter(review => review.game_id === parent.id);
  //     }
  // }
  Query: {
    // Check if user is authenticated
    // (parent, args, {headers})
    async games(_, __, { headers }) {
      const token = headers.authorization;
      await validateToken(token);

      return fetchGames();
    },
    async game(_, args, { headers }) {
      const token = headers.authorization;
      await validateToken(token);

      return fetchGameById(args.game_id);
    },
    async users(_, __, { headers }) {
      const token = headers.authorization;
      await validateToken(token);

      return fetchUsers();
    }
  },
  Mutation: {
    async createUser(_, { first_name, last_name, email, image, about_me, email_preferences }) {
      const newUser = {
        first_name,
        last_name,
        email,
        image,
        about_me,
        email_preferences
      };
      return await createUser(newUser);
    }
  }
};