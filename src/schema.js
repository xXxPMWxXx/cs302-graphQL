export const typeDefs = `#graphql
# below are for local DB
    # type Game {
    #     id: ID!
    #     title: String!
    #     platforms: [String!]!
    #     reviews: [Review!] 
    # }
    # type Review {
    #     id: ID!
    #     content: String!
    #     rating: Int!
    #     game: Game!
    # }
    # type Author {
    #     id: ID!
    #     name: String!
    #     verified: Boolean!
    #     reviews: [Review!] 
    # }
    # # entry points for the user
    # type Query {
    #     reviews: [Review]
    #     review(id: ID!): Review
    #     games: [Game]
    #     game(id: ID!): Game
    #     authors: [Author]
    # }
    

    # For demo purposes
    type Game {
        game_id: ID!
        title: String!
        platform: String!
        price: Float!
        stock: Int!
    }

    type User {
        _id: ID!
        first_name: String
        last_name: String
        email: String!
        image: String
        about_me: String
        email_preferences: Boolean
        created_at: String
        updated_at: String
    }

    # entry points for the user
    type Query {
        games: [Game]
        game(game_id: ID!): Game
        users: [User]
    }

    type Mutation {
    createUser(
        first_name: String
        last_name: String
        email: String!
        image: String
        about_me: String
        email_preferences: Boolean
    ): User
    }

`;

// int, float, string, boolean, ID (key of the data objects)
// by add ! to indicate that field is required