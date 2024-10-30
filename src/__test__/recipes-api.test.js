// src/__tests__/recipes-api.test.js
import { RESTDataSource } from '@apollo/datasource-rest';
import { RecipesAPI } from '../RESTDataSource/recipes-api.js';
import { jest } from '@jest/globals';

describe('RecipesAPI', () => {
    let recipesAPI;

    beforeEach(() => {
        recipesAPI = new RecipesAPI();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore mocks after each test
    });

    test('getRecipe retrieves a recipe by ID', async () => {
        // Mocked recipe data
        const mockedRecipeData = {
            _id: '123',
            title: 'Delicious Pancakes',
            ingredients: ['flour', 'milk', 'eggs'],
            instructions: 'Mix ingredients and cook.',
        };

        // Mock the RESTDataSource get method
        const mockedSuperGet = jest.spyOn(RESTDataSource.prototype, 'get').mockResolvedValueOnce(mockedRecipeData);

        const recipeId = '123';
        const result = await recipesAPI.getRecipe(recipeId);

        // Check that the get method was called with the correct endpoint
        expect(mockedSuperGet).toHaveBeenCalledWith(`recipes/${encodeURIComponent(recipeId)}`);

        // Verify the response matches the mocked recipe data
        expect(result).toEqual(mockedRecipeData);

        mockedSuperGet.mockRestore(); // Clean up the mock after the test
    });

    test('getRecipes retrieves a list of recipes', async () => {
        // Mocked recipes data
        const mockedRecipesData = {
            recipes: [
                { _id: '1', title: 'Pasta', ingredients: ['noodles', 'sauce'] },
                { _id: '2', title: 'Salad', ingredients: ['lettuce', 'tomato'] }
            ],
        };

        // Mock the RESTDataSource get method
        const mockedSuperGet = jest.spyOn(RESTDataSource.prototype, 'get').mockResolvedValueOnce(mockedRecipesData);

        const result = await recipesAPI.getRecipes();

        // Check that the get method was called with the correct endpoint
        expect(mockedSuperGet).toHaveBeenCalledWith('recipes');

        // Verify the response matches the mocked recipes data
        expect(result).toEqual(mockedRecipesData.recipes);

        mockedSuperGet.mockRestore(); // Clean up the mock after the test
    });

    test('getRecipesByAuthor retrieves recipes by author', async () => {
        // Mocked recipes data for a specific author
        const mockedRecipesData = {
            recipes: [
                {
                    _id: '1',
                    name: 'Vegan Tacos',
                    cuisine_type: 'Mexican',
                    cook_time: 30,
                    author: {
                        _id: '100',
                        first_name: 'Jane',
                        last_name: 'Doe',
                        email: 'jane.doe@example.com',
                        about_me: 'Food blogger',
                    },
                    ingredients: [{ name: 'Tortilla' }, { name: 'Beans' }],
                    steps: [{ step_number: 1, description: 'Cook beans' }],
                    portion_size: 4,
                    prep_time: 10,
                    description: 'Delicious vegan tacos',
                    views: 100,
                    reviews: [],
                    rating: 4.5,
                },
                {
                    _id: '2',
                    name: 'Avocado Toast',
                    cuisine_type: 'American',
                    cook_time: 5,
                    author: {
                        _id: '80b8d295f36d283b9ca346d4',
                        first_name: 'Jane',
                        last_name: 'Doe',
                        email: 'jane.doe@example.com',
                        about_me: 'Food blogger',
                    },
                    ingredients: [{ name: 'Avocado' }, { name: 'Bread' }],
                    steps: [{ step_number: 1, description: 'Spread avocado' }],
                    portion_size: 2,
                    prep_time: 5,
                    description: 'Simple and tasty avocado toast',
                    views: 250,
                    reviews: [],
                    rating: 4.8,
                },
            ],
        };

        const author = '80b8d295f36d283b9ca346d4';

        // Mock the RESTDataSource get method
        const mockedSuperGet = jest.spyOn(RESTDataSource.prototype, 'get').mockResolvedValueOnce(mockedRecipesData);

        const result = await recipesAPI.getRecipesByAuthor(author);

        // Check that the get method was called with the correct endpoint and encoded author
        expect(mockedSuperGet).toHaveBeenCalledWith(`recipes/author/${encodeURIComponent(author)}`);

        // Verify the response matches the mocked recipes data
        expect(result).toEqual(mockedRecipesData.recipes);

        mockedSuperGet.mockRestore(); // Clean up the mock after the test
    });

    test('getRecipesByAuthor handles API failure', async () => {
        const author = 'John Smith';

        // Mock the RESTDataSource get method to simulate an API failure
        const mockedSuperGet = jest.spyOn(RESTDataSource.prototype, 'get').mockRejectedValueOnce(new Error('API failure'));

        // Expect an error to be thrown when the API fails
        await expect(recipesAPI.getRecipesByAuthor(author)).rejects.toThrow('API failure');

        mockedSuperGet.mockRestore(); // Clean up the mock after the test
    });
});