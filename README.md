## To get the Auth0 token, this is to get token from Auth0 API, this token will not work for user method
<pre>
curl --request POST \
  --url https://dev-iu4kzoymxgg0vztn.us.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"62pmKBHA4NLwlB1YiQv1wKd8JOCkRsri","client_secret":"KShZHULodLIBFXQXBx3CospZQBxhqKyGeCNFLr1EnegfMakE4pNApgodOvcRsqhq","audience":"http://localhost:4000/","grant_type":"client_credentials"}'
</pre>
### Query need access token
- getRecipesByAuthor
### All mutation need access token
- findOrCreateUser (only work with access token generated via frontend)
- softDelByRecipeId
- createReview


## To Run test
- `npx eslint .` => static code analysis
- `npm run test:coverage` => unit test and integration test with coverage

## To Run locally
- `npm install` => install dependencies
- `npm start` => start graphQL server
  - Please ensure that all the other services are running and the environment variable are added in the .env file
  - `http://localhost:4000/graphql` => Access the GraphQL server sandbox to check the available query and mutation

## Login to Apollo Server to access saved query
- email: `pratahouse.cs302@gmail.com`
- password: `Pratahouse302`