import { validateToken, fetchUserInfo } from './utils/authService.js';

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
    Query: {
        // Check if user is authenticated
        // (parent, args)
        userById: async (_, { _id }, { dataSources }) => {
            return dataSources.usersAPI.getUserById(_id);
        },
        recipes: async (_, __, { dataSources }) => {
            return dataSources.recipesAPI.getRecipes();
        },
        getRecipesByAuthor: async (_, { author_id }, { dataSources }) => {
            return dataSources.recipesAPI.getRecipesByAuthor(author_id);
        },
        recipe: async (_, { _id }, { dataSources }) => {
            return dataSources.recipesAPI.getRecipe(_id);
        },
        reviews: async (_, { recipe_id }, { dataSources }) => {
            return dataSources.reviewsAPI.getReviews(recipe_id);
        },
        getRecipeRating: async (_, { recipe_id }, { dataSources }) => {
            return dataSources.reviewsAPI.getRecipeRating(recipe_id);
        },
    },
    Recipe: { // To return from other data sources
        reviews: async (parent, __, { dataSources }) => {
            return dataSources.reviewsAPI.getReviews(parent._id);
        },
        author: async (parent, __, { dataSources }) => {
            return dataSources.usersAPI.getUserById(parent.author);
        },
        rating: async (parent, _, { dataSources }) => {
            return dataSources.reviewsAPI.getRecipeRating(parent._id);
        },
    },
    Review: { // To return from other data sources
        author: async (parent, __, { dataSources }) => {
            return dataSources.usersAPI.getUserById(parent.author);
        },
        by: async (parent, __, { dataSources }) => {
            return dataSources.usersAPI.getUserById(parent.author);
        },
    },
    Mutation: {
        findOrCreateUser: withAuth(async (_, __, { dataSources, headers }) => {
            const user = await fetchUserInfo(headers.authorization);
            return dataSources.usersAPI.findOrCreateUser(user);
        }),
        softDelByRecipeId: withAuth(async (_, { recipe_id }, { dataSources}) => {
            try {
                // Call the PATCH method
                await dataSources.reviewsAPI.softDelByRecipeId(recipe_id);
                return true; // Return true if successful
            } catch (error) {
                console.error(error);
                return false; // Return false if there's an error
            }
        }),
        createRecipe: withAuth(async (_, { name, portion_size, cuisine_type, description, ingredients, steps, author, prep_time, cook_time, created_at, image }, { dataSources, cache }) => {
            const newRecipe = {
                name,
                portion_size,
                cuisine_type,
                description,
                ingredients,
                steps,
                author,
                prep_time,
                cook_time,
                created_at,
                image
            };

            const cacheKey = `httpcache:GET ${process.env.RECIPE_URL}/recipes`; // clear the get all recipes cache
            await cache.delete(cacheKey);
            return dataSources.recipesAPI.createRecipe(newRecipe);
        }),
        createReview: withAuth(async (_, { recipe, author, by, comment, rating }, { dataSources, cache }) => {
            const newReview = {
                recipe,
                author,
                by,
                comment,
                rating,
            };

            const cacheKey = `httpcache:GET ${process.env.RECIPE_URL}/reviews`; // clear the get all recipes cache
            await cache.delete(cacheKey);
            return dataSources.reviewsAPI.createReview(newReview);
        }),
    }
};