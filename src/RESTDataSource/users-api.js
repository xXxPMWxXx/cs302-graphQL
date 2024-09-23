import { RESTDataSource } from '@apollo/datasource-rest';
import dotenv from 'dotenv';
dotenv.config();

export class UsersAPI extends RESTDataSource {
    baseURL = `${process.env.USER_URL}/`;
    async getUser(email) {
        return this.get(`users/${encodeURIComponent(email)}`);
    }
    async getUsers(limit = '10') {
        const data = await this.get('users', {
            params: {
                per_page: limit.toString(), // all params entries should be strings,
                order_by: 'updated_at', 
            },
        });
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