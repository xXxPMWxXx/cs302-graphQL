import { RESTDataSource } from '@apollo/datasource-rest';

export class UsersAPI extends RESTDataSource {
    baseURL = `${process.env.USER_URL}/`;

    async getUser(email) {
        return this.get(`users/${encodeURIComponent(email)}`);
    }
    async getUsers() {
        const data = await this.get('users');
        return data;
    }
    // POST
    async createUser(user) {
        return this.post(
            'users', // path
            { body: { user } }, // request body
        );
    }

}