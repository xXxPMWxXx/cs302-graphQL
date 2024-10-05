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