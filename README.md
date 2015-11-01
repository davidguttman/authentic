# Authentic

Authentication for microservices.

## Example ##

```js
var http = require('http')
var level = require('level')
var Authentic = require('authentic')

var auth = Authentic({
  publicKey: publicKey,
  privateKey: privateKey,
  db: level('./userdb'),
  email: sendEmail
})

var server = http.createServer(function (req, res) {
  if (req.url === '/auth/signup') return auth.signup(req, res, onError)
  if (req.url === '/auth/confirm') return auth.confirm(req, res, onError)
  if (req.url === '/auth/login') return auth.login(req, res, onError)
  if (req.url === '/auth/change-password-request') return auth.changePasswordRequest(req, res, onError)
  if (req.url === '/auth/change-password') return auth.changePassword(req, res, onError)
  if (req.url === '/auth/public-key') return auth.publicKey(req, res, onError)

  function onError (err) {
    if (err) {
      res.statusCode = err.statusCode || 500
      res.end(JSON.stringify({ success: false, error: err.message }))
      console.error(err)
    }
  }
})
```

## What is it? ##

Authentic is a collection of modules to help your various services authenticate a user. Put more concretely, Authentic aims to do the following:

* Allow your users to "sign up", "confirm", "login", and "change password" with their email address and a chosen password
* Provide your distributed services and APIs with a token that verifies the users identity (their email address)

## How it works ##

Let's pretend you work at ScaleHaus (Uber meets Airbnb for lizards) and you have a single page app (SPA) at `admin.scalehaus.io` that would like to talk to various internal microservices (reporting, account admin, etc...). You could ensure that only those with a `@scalehaus.io` email address have access to your SPA and services by doing the following:

1) Run an instance of Authentic (see above) at `auth.scalehaus.io`

2) Add views to `admin.scalehaus.io` for signup/login/etc, and hook them up to the appropriate CORS endpoints on `auth.scalehaus.io`

3) When a user (chet@scalehaus.io) logs in, your SPA will receive a JSON Web Token (JWT) for that user (feel free to store in localStorage for later)

4) Now, any time your user interacts with a microservice (i.e. `reporting.scalehaus.io`) your SPA will add the JWT to the request header

5) Your microservice, `reports.scalehaus.io`, will be able to use `auth.scalehaus.io`'s public key to decrypt the token and verify that the user is actually chet@scalehaus.io -- without needing a shared db


# License

MIT
