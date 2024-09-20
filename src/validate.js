import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
dotenv.config();

const client = jwksClient({
    jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});


function getKey(header, callback) {
    console.log(`Fetching key for kid: ${header.kid}`);
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
    console.log("-------------------- isTokenValid method called --------------------");
    if (!token) {
        return { error: "No token provided" };  // Handle empty token case here
      }
    
    if (token) {
        const bearerToken = token.split(" ");

        const result = new Promise((resolve, reject) => {
            jwt.verify(
                bearerToken[1],
                getKey,
                {
                    audience: process.env.API_IDENTIFIER,
                    issuer: `${process.env.AUTH0_DOMAIN}/`,
                    algorithms: ["RS256"]
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

export default isTokenValid;