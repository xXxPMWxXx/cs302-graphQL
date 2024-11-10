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

## Prerequisite
- Download our environment variable file from S3, using this [link](https://assets-prata-house.s3.ap-southeast-1.amazonaws.com/Environment+File/CS302_G1_T4_ENV.txt)
- Copy the graphQL service variable into .env file, which are:
  - `AUTH0_DOMAIN`
  - `AUTH0_CLIENT_ID`
  - `AUTH0_CLIENT_SECRET`
  - `API_IDENTIFIER`
  - `USER_URL`
  - `RECIPE_URL`
  - `REVIEW_URL`
- Notes: 
  - The above environment variable is for setting up our whole backend using Docker under the same container. 
  <mark>We recommend to setup our project using our [compose](https://gitlab.com/cs302-2024/g1-team4/compose) repo to setup everything at once.</mark>
  - Depend on how you setup the other service, the environment variable may need to change accordingly
  - Please contact us, if you face any difficulty in setting up our project.

## To Run test
- `npx eslint .` => static code analysis
- `npm run test:coverage` => unit test and integration test with coverage

## To Run locally
- `npm install` => install dependencies
- `npm start` => start graphQL server
  - Please ensure that all the other services are running and the environment variable are added in the .env file
  - `http://localhost:4000/graphql` => Access the GraphQL server sandbox to check the available query and mutation

## To Run using Docker
- `docker compose up` => to run graphQL service (Need to modify the environment variable accordingly)

## Login to Apollo Server to access saved query
- email: `pratahouse.cs302@gmail.com`
- password: `Pratahouse302`