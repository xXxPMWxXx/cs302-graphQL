import { RESTDataSource } from '@apollo/datasource-rest';

export class ReviewsAPI extends RESTDataSource {
    baseURL = `${process.env.REVIEW_URL}/review/`;

    async getReviews(recipe_id) {
        return this.get(`recipe/${encodeURIComponent(recipe_id)}`);
    }

    async getRecipeRating(recipe_id) {
        return this.get(`rating/${encodeURIComponent(recipe_id)}`);
    }

    async softDelByRecipeId(recipe_id) {
        return this.patch(`recipe/${encodeURIComponent(recipe_id)}`);
    }

    async createReview(review) {
        return this.post(
            'create_review', // path
            { body: { review } }, // request body
        );
    }
}