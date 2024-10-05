import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import axios from 'axios';
import { AuthenticationError } from 'apollo-server-errors';
import dotenv from 'dotenv';
dotenv.config();

const client = jwksClient({
    jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

// To Check if the token is valid with the public key
function getKey(header, callback) {
    client.getSigningKey(header.kid, function (error, key) {
        if (error) {
            console.error('Error fetching signing key:', error);
            return callback(error);
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

async function isTokenValid(token) {
    if (!token) {
        return { error: 'No token provided' };  // Handle empty token case here
    }

    if (token) {
        const bearerToken = token.split(' ');

        // const decodedToken = jwt.decode(bearerToken[1], { complete: true });  // `complete: true` includes header and signature
        // console.log('Decoded Token:', decodedToken);  // This will log the fields in the token
        const result = new Promise((resolve) => {
            jwt.verify(
                bearerToken[1],
                getKey,
                {
                    audience: process.env.API_IDENTIFIER,
                    issuer: `${process.env.AUTH0_DOMAIN}/`,
                    algorithms: ['RS256']
                },
                (error, decoded) => {
                    if (error) {
                        resolve({ error });
                    }
                    if (decoded) {
                        resolve({ decoded });
                    }
                }
            );
        });
        return result;
    }
}

export const fetchUserInfo = async (token) => {
    try {
    // Call Auth0's userinfo endpoint
        const response = await axios.get(`${process.env.AUTH0_DOMAIN}/userinfo`, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return callback(error);
    }
};

// New function to handle token validation in resolvers
export const validateToken = async (token) => {
    const { error } = await isTokenValid(token);
    // const user = await fetchUserInfo(token);
    // console.log(user);
    if (error) {
        throw new AuthenticationError('Invalid token');
    }
};