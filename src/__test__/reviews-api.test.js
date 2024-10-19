// src/__tests__/reviews-api.test.js
import { RESTDataSource } from '@apollo/datasource-rest';
import { ReviewsAPI } from '../RESTDataSource/reviews-api.js';
import { jest } from '@jest/globals';

describe('ReviewsAPI', () => {
    let reviewsAPI;

    beforeEach(() => {
        reviewsAPI = new ReviewsAPI();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore mocks after each test
    });

    test('getReviews retrieves reviews by recipe ID', async () => {
        // Mocked reviews data
        const mockedReviewsData = [
            { _id: '1', recipe_id: '123', content: 'Great recipe!' },
            { _id: '2', recipe_id: '123', content: 'Loved it!' }
        ];

        // Mock the RESTDataSource get method
        const mockedSuperGet = jest.spyOn(RESTDataSource.prototype, 'get').mockResolvedValueOnce(mockedReviewsData);

        const recipeId = '123';
        const result = await reviewsAPI.getReviews(recipeId);

        // Check that the get method was called with the correct endpoint
        expect(mockedSuperGet).toHaveBeenCalledWith(`recipe/${encodeURIComponent(recipeId)}`);

        // Verify the response matches the mocked reviews data
        expect(result).toEqual(mockedReviewsData);

        mockedSuperGet.mockRestore(); // Clean up the mock after the test
    });

    test('getReviews handles API failure', async () => {
        const recipeId = '123';
    
        // Mock the RESTDataSource get method to simulate an API failure
        const mockedSuperGet = jest.spyOn(RESTDataSource.prototype, 'get').mockRejectedValueOnce(new Error('API failure'));
    
        // Expect an error to be thrown when the API fails
        await expect(reviewsAPI.getReviews(recipeId)).rejects.toThrow('API failure');
    
        mockedSuperGet.mockRestore(); // Clean up the mock after the test
    });

    test('getRecipeRating retrieves the rating for a recipe by ID', async () => {
        const recipeId = '123';

        // Mocked rating data
        const mockedRatingData = {
            rating: 4.5,
        };

        // Mock the RESTDataSource get method
        const mockedSuperGet = jest.spyOn(RESTDataSource.prototype, 'get').mockResolvedValueOnce(mockedRatingData);

        const result = await reviewsAPI.getRecipeRating(recipeId);

        // Check that the get method was called with the correct endpoint
        expect(mockedSuperGet).toHaveBeenCalledWith(`rating/${encodeURIComponent(recipeId)}`);

        // Verify the response matches the mocked rating data
        expect(result).toEqual(mockedRatingData);

        mockedSuperGet.mockRestore(); // Clean up the mock after the test
    });

    test('getRecipeRating handles API failure', async () => {
        const recipeId = '123';

        // Mock the RESTDataSource get method to simulate an API failure
        const mockedSuperGet = jest.spyOn(RESTDataSource.prototype, 'get').mockRejectedValueOnce(new Error('API failure'));

        // Expect an error to be thrown when the API fails
        await expect(reviewsAPI.getRecipeRating(recipeId)).rejects.toThrow('API failure');

        mockedSuperGet.mockRestore(); // Clean up the mock after the test
    });
    
    test('softDelByRecipeId sends a PATCH request to delete the recipe by ID', async () => {
        const recipeId = '123';
        
        // Mock the RESTDataSource patch method to simulate successful soft delete
        const mockedSuperPatch = jest.spyOn(RESTDataSource.prototype, 'patch').mockResolvedValueOnce({
            success: true,
            message: 'Review(s) successfully deleted for the recipe',
        });

        const result = await reviewsAPI.softDelByRecipeId(recipeId);

        // Check that the patch method was called with the correct endpoint
        expect(mockedSuperPatch).toHaveBeenCalledWith(`recipe/${encodeURIComponent(recipeId)}`);

        // Verify the response matches the mocked data
        expect(result).toEqual({
            success: true,
            message: 'Review(s) successfully deleted for the recipe',
        });

        mockedSuperPatch.mockRestore(); // Clean up the mock after the test
    });

    test('softDelByRecipeId handles API failure', async () => {
        const recipeId = '123';

        // Mock the RESTDataSource patch method to simulate an API failure
        const mockedSuperPatch = jest.spyOn(RESTDataSource.prototype, 'patch').mockRejectedValueOnce(new Error('API failure'));

        // Expect an error to be thrown when the API fails
        await expect(reviewsAPI.softDelByRecipeId(recipeId)).rejects.toThrow('API failure');

        mockedSuperPatch.mockRestore(); // Clean up the mock after the test
    });

    test('createReview handles valid review input', async () => {
        const newReview = { recipe_id: '123', content: 'Amazing recipe!' };
        const mockCreatedReview = { _id: '3', ...newReview };

        const mockedSuperPost = jest.spyOn(RESTDataSource.prototype, 'post').mockResolvedValueOnce(mockCreatedReview);

        const result = await reviewsAPI.createReview(newReview);

        expect(mockedSuperPost).toHaveBeenCalledWith('create_review', { body: { review: newReview } });
        expect(result).toEqual(mockCreatedReview); // Check if the created review matches the expected result

        mockedSuperPost.mockRestore(); // Restore the original method
    });

    test('createReview handles missing review content', async () => {
        const review = { recipe_id: '123' }; // Missing content

        const mockedSuperPost = jest.spyOn(RESTDataSource.prototype, 'post').mockResolvedValueOnce({
            error: 'Content is required',
        });

        const result = await reviewsAPI.createReview(review);

        expect(mockedSuperPost).toHaveBeenCalledWith('create_review', { body: { review } });
        expect(result).toEqual({ error: 'Content is required' }); // Check for specific error handling

        mockedSuperPost.mockRestore(); 
    });

    test('createReview handles API failure', async () => {
        const review = { recipe_id: '123', content: 'Fantastic recipe!' };

        const mockedSuperPost = jest.spyOn(RESTDataSource.prototype, 'post').mockRejectedValueOnce(new Error('API failure'));

        await expect(reviewsAPI.createReview(review)).rejects.toThrow('API failure'); // Check for API failure handling

        mockedSuperPost.mockRestore(); // Restore the original method
    });
});