import { RESTDataSource } from '@apollo/datasource-rest';
import { UsersAPI } from '../RESTDataSource/users-api.js';
import { jest } from '@jest/globals';

describe('UsersAPI', () => {
    let userAPI;

    beforeEach(() => {
        userAPI = new UsersAPI();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore mocks after each test
    });

    test('getUserById adds the correct parameters to the get call', async () => {
        // Mocked user data
        const mockedUserData = {
            _id: '6700cf86bf5ac2b522177ccb',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            about_me: 'Software developer with a passion for open source.',
            email_preferences: true,
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-10-01T10:00:00Z',
        };

        // Mock the RESTDataSource get method
        const mockedSuperGet = jest.spyOn(RESTDataSource.prototype, 'get').mockResolvedValueOnce(mockedUserData);

        const userId = '6700cf86bf5ac2b522177ccb';
        const result = await userAPI.getUserById(userId);

        // Check that the get method was called with the correct endpoint
        expect(mockedSuperGet).toHaveBeenCalledWith(`users/id/${encodeURIComponent(userId)}`);

        // Verify the response matches the mocked user data
        expect(result).toEqual(mockedUserData);

        mockedSuperGet.mockRestore(); // Clean up the mock after the test
    });

    test('findOrCreateUser handles an empty user object', async () => {
        const user = {}; // Empty user object

        const mockedSuperPost = jest.spyOn(RESTDataSource.prototype, 'post').mockResolvedValueOnce(null);

        const result = await userAPI.findOrCreateUser(user);

        expect(mockedSuperPost).toHaveBeenCalledWith('users', {
            body: {
                user: {
                    first_name: undefined,
                    last_name: undefined,
                    email: undefined,
                },
            },
        });
        expect(result).toBeNull(); // Assuming the API returns null for empty input

        mockedSuperPost.mockRestore(); // Restore the original method
    });

    test('findOrCreateUser handles missing required fields', async () => {
        const user = {
            given_name: 'Jane',
            // Missing family_name and email
        };

        const mockedSuperPost = jest.spyOn(RESTDataSource.prototype, 'post').mockResolvedValueOnce({
            error: 'Email is required',
        });

        const result = await userAPI.findOrCreateUser(user);

        expect(mockedSuperPost).toHaveBeenCalledWith('users', {
            body: {
                user: {
                    first_name: user.given_name,
                    last_name: undefined,
                    email: undefined,
                },
            },
        });
        expect(result).toEqual({ error: 'Email is required' }); // Check for specific error handling

        mockedSuperPost.mockRestore(); 
    });

    test('findOrCreateUser handles API failure', async () => {
        const user = {
            given_name: 'Jane',
            family_name: 'Doe',
            email: 'jane.doe@example.com',
        };

        const mockedSuperPost = jest.spyOn(RESTDataSource.prototype, 'post').mockRejectedValueOnce(new Error('API failure'));

        await expect(userAPI.findOrCreateUser(user)).rejects.toThrow('API failure'); // Check for API failure handling

        mockedSuperPost.mockRestore(); // Restore the original method
    });
});