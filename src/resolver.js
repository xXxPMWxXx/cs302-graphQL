import { AuthenticationError } from 'apollo-server-errors';
import isTokenValid from './validate.js';


export const resolvers = {
    // for local DB source
    // Query: {
    //   reviews() {
    //     return db.reviews
    //   },
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
            const { error } = await isTokenValid(token);
            // Return error if token is invalid
            if (error) {
                throw new AuthenticationError(error);
            }
            // If token is valid, fetch games data from REST API
            try {
                const response = await fetch('http://localhost:30000/games');
                const data = await response.json();
                return data.data.games;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch games data from REST API');
            }
        },
        async game(_, args) {
            try {
                const response = await fetch('http://localhost:30000/games');
                const data = await response.json();
                const games = data.data.games; // Get the list of games
                return games.find(game => game.game_id === Number(args.game_id)); // as the data pass in is String and the data is number
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch the game from REST API');
            }
        }
    }


};