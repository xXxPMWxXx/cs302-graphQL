import { validateToken } from './utils/authService.js';

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
        users: withAuth(async (_, __, { dataSources }) => {
            return dataSources.usersAPI.getUsers();
        }),
        user: withAuth(async (_, { email }, { dataSources }) => {
            return dataSources.usersAPI.getUser(email);
        }),
        userById: withAuth(async (_, { _id }, { dataSources }) => {
            return dataSources.usersAPI.getUserById(_id);
        }),
        recipes: withAuth(async (_, __, { dataSources }) => {
            return dataSources.recipesAPI.getRecipes();
        }),
        recipe: withAuth(async (_, {_id}, { dataSources }) => {
            return dataSources.recipesAPI.getRecipe(_id);
        }),
        reviews: withAuth(async (_, {recipe_id}, { dataSources }) => {
            return dataSources.reviewsAPI.getReviews(recipe_id);
        }),
    },
    Recipe : { // To return from other data sources
        reviews: async (parent,__,{ dataSources }) => {
            return dataSources.reviewsAPI.getReviews(parent._id);
        },
    },
    Review : { // To return from other data sources
        author: async (parent,__,{ dataSources }) => {
            return dataSources.usersAPI.getUserById(parent.author);
        },
        by: async (parent,__,{ dataSources }) => {
            return dataSources.usersAPI.getUserById(parent.author);
        },
    },
    Mutation: {
        createUser: withAuth(async (_, { first_name, last_name, email, image, about_me, email_preferences },{ dataSources,cache }) => {
            const newUser = {
                first_name,
                last_name,
                email,
                image,
                about_me,
                email_preferences
            };

            const cacheKey = `httpcache:GET ${process.env.USER_URL}/users`; // clear the get all users cache
            await cache.delete(cacheKey); 
            return dataSources.usersAPI.createUser(newUser);
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
        createReview: withAuth(async (_, { recipe,author,by,comment,rating}, { dataSources, cache }) => {
            const newReview = {
                recipe,
                author,
                by,
                comment,
                rating,
            };
        
            const cacheKey = `httpcache:GET ${process.env.RECIPE_URL}/recipes`; // clear the get all recipes cache
            await cache.delete(cacheKey); 
            return dataSources.reviewsAPI.createReview(newReview);
        }),
    }
};