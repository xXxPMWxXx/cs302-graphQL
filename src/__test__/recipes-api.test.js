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

    test('createRecipe handles valid recipe input', async () => {
        const newRecipe = {
            title: 'Chocolate Cake',
            ingredients: ['flour', 'sugar', 'cocoa powder'],
            instructions: 'Mix and bake.',
        };
        const mockCreatedRecipe = { _id: '3', ...newRecipe };

        const mockedSuperPost = jest.spyOn(RESTDataSource.prototype, 'post').mockResolvedValueOnce(mockCreatedRecipe);

        const result = await recipesAPI.createRecipe(newRecipe);

        expect(mockedSuperPost).toHaveBeenCalledWith('recipes', { body: { recipe: newRecipe } });
        expect(result).toEqual(mockCreatedRecipe); // Check if the created recipe matches the expected result

        mockedSuperPost.mockRestore(); // Restore the original method
    });

    test('createRecipe handles missing required fields', async () => {
        const recipe = { title: 'Simple Salad' }; // Missing ingredients and instructions

        const mockedSuperPost = jest.spyOn(RESTDataSource.prototype, 'post').mockResolvedValueOnce({
            error: 'Ingredients are required',
        });

        const result = await recipesAPI.createRecipe(recipe);

        expect(mockedSuperPost).toHaveBeenCalledWith('recipes', { body: { recipe } });
        expect(result).toEqual({ error: 'Ingredients are required' }); // Check for specific error handling

        mockedSuperPost.mockRestore(); 
    });

    test('createRecipe handles API failure', async () => {
        const recipe = {
            title: 'Omelette',
            ingredients: ['eggs', 'salt'],
            instructions: 'Beat and cook.',
        };

        const mockedSuperPost = jest.spyOn(RESTDataSource.prototype, 'post').mockRejectedValueOnce(new Error('API failure'));

        await expect(recipesAPI.createRecipe(recipe)).rejects.toThrow('API failure'); // Check for API failure handling

        mockedSuperPost.mockRestore(); // Restore the original method
    });
});