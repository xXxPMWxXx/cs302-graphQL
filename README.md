## To get the Auth0 token, this is to get token from Auth0 API, this token will not work for user method
<pre>
curl --request POST \
  --url https://dev-iu4kzoymxgg0vztn.us.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"62pmKBHA4NLwlB1YiQv1wKd8JOCkRsri","client_secret":"KShZHULodLIBFXQXBx3CospZQBxhqKyGeCNFLr1EnegfMakE4pNApgodOvcRsqhq","audience":"http://localhost:4000/","grant_type":"client_credentials"}'
</pre>

## To Run test
- `npx eslint .` => static code analysis
- `npm run test:coverage` => unit test and integration test with coverage

## Login to Apollo Server to access saved query
- email: `pratahouse.cs302@gmail.com`
- password: `Pratahouse302`

