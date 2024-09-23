import { validateToken } from './utils/authService.js';
import { fetchGames, fetchGameById } from './services/gameService.js';

// Wrapper for AuthService
const withAuth = (resolver) => {
    return async (parent, args, context, info) => {
        const token = context.headers.authorization;
        if (token) {
            await validateToken(token);
        } else {
            throw new Error('Authorization token is required');
        }
        return resolver(parent, args, context, info);
    };
};

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
    // (parent, args)
        games: withAuth(async () => {
            return fetchGames();
        }),
        // Sample for without authentication
        game: async (_, args) => {
            return fetchGameById(args.game_id);
        },
        users: withAuth(async (_, __, { dataSources }) => {
            return dataSources.usersAPI.getUsers();
        }),
        user: async (_, { email }, { dataSources }) => {
            return dataSources.usersAPI.getUser(email);
        },
    },
    Mutation: {
        createUser: withAuth(async (_, { first_name, last_name, email, image, about_me, email_preferences },{ dataSources }) => {
            const newUser = {
                first_name,
                last_name,
                email,
                image,
                about_me,
                email_preferences
            };
            return dataSources.usersAPI.createUser(newUser);
        }),
    }
};