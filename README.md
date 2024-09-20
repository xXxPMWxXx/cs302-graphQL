## To get the Auth0 token
<pre>
curl --request POST \
  --url https://dev-iu4kzoymxgg0vztn.us.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"62pmKBHA4NLwlB1YiQv1wKd8JOCkRsri","client_secret":"KShZHULodLIBFXQXBx3CospZQBxhqKyGeCNFLr1EnegfMakE4pNApgodOvcRsqhq","audience":"http://localhost:4000/","grant_type":"client_credentials"}'
</pre>

## To Run static code analysis tool 
- `npx eslint .`