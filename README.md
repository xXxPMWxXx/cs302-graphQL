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
  - Download our environment variable file from S3, using this [link](https://assets-prata-house.s3.ap-southeast-1.amazonaws.com/Environment+File/CS302_G1_T4_ENV.txt)

  <mark>For setting the entire Prata House Project, we recommend using 
  - [compose](https://gitlab.com/cs302-2024/g1-team4/compose) repo for `Dev` environment, 
  - [minikube](https://gitlab.com/cs302-2024/g1-team4/kubernetes) repo for `Prod` environment.

  _Please contact us if you face any difficulty in setting up our project._

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
