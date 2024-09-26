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

    type Recipe {
        _id: ID!
        author: ID!
        cook_time: Int!
        created_at: String
        cuisine_type: String
        description: String
        image: String
        ingredients: [Ingredient]!
        name: String
        portion_size: Int!
        prep_time: Int!
        steps: [Step!]!
        views: Int
        reviews: [Review]
    }

    type Ingredient {
        ingredient_name: String!
        quantity: String!
    }

    type Step {
        description: String!
        image: String
    }

    type Review {
        _id: ID!
        recipe: String!
        author: User!
        by: User!
        comment: String
        rating: Int!
        created_at: String
    }

    # entry points for the user
    type Query {
        users: [User]
        user(email: String!): User
        userById(_id: ID!): User
        recipes: [Recipe]
        recipe(_id: ID!): Recipe
        reviews(recipe_id: String!): [Review]
    }

    input IngredientInput {
        ingredient_name: String!
        quantity: String
    }

    input StepInput {
        description: String!
        image: String
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

    createRecipe(
        name: String!,
        portion_size: Int,
        cuisine_type: String,
        description: String,
        ingredients: [IngredientInput],
        steps: [StepInput],
        author: ID!,
        prep_time: Int,
        cook_time: Int,
        image: String
    ): Recipe

    createReview(
        recipe: String!,
        author: String!,
        by: String!,
        comment: String,
        rating: Int!
    ): Review
    }

`;

// int, float, string, boolean, ID (key of the data objects)
// by add ! to indicate that field is required