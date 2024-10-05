import { RESTDataSource } from '@apollo/datasource-rest';

export class UsersAPI extends RESTDataSource {
    baseURL = `${process.env.USER_URL}/`;

    // This methid is used to get user info when FE query recipe by ID
    async getUserById(_id) {
        return this.get(`users/id/${encodeURIComponent(_id)}`);
    }

    // This method will get user info from the token from Auth0 
    // and pass the data to User service, where it will check if the user
    // is existing. if not it will create a new user and return the info.
    async findOrCreateUser(user) {
        const userBody = {
            'user': {
                'first_name': user.given_name,
                'last_name': user.family_name,
                'email': user.email,
            },
        };
        return this.post(
            'users', // path
            { body:  userBody }, // request body
        );
    }

}