import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import AuthenticationError from 'apollo-server-errors';
dotenv.config();

const client = jwksClient({
  jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});


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

// New function to handle token validation in resolvers
export const validateToken = async (token) => {
  const { error } = await isTokenValid(token);
  if (error) {
    throw new AuthenticationError('Invalid token');
  }
};