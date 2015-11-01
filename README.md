# Authentic

Authentication for microservices. This is collection of the following modules:

* `authentic-server`
* `authentic-service`
* `authentic-client`

## What is it? ##

Authentic is a collection of modules to help your various services authenticate a user. Put more concretely, Authentic aims to do the following:

* Allow your users to "sign up", "confirm", "login", and "change password" with their email address and a chosen password
* Provide your distributed services and APIs with a token that verifies the user's identity (their email address)

## How it works ##

Let's pretend you work at ScaleHaus (Uber meets Airbnb for lizards) and you have a single page app (SPA) at `admin.scalehaus.io` that would like to talk to various internal microservices (reporting, account admin, etc...). You could ensure that only those with a `@scalehaus.io` email address have access to your SPA and services by doing the following:

1) Run an instance of Authentic (see above) at `auth.scalehaus.io`

2) Add views to `admin.scalehaus.io` for signup/login/etc, and hook them up to the appropriate CORS endpoints on `auth.scalehaus.io`

3) When a user (chet@scalehaus.io) logs in, your SPA will receive a JSON Web Token (JWT) for that user (feel free to store in localStorage for later)

4) Now, any time your user interacts with a microservice (i.e. `reporting.scalehaus.io`) your SPA will add the JWT to the request header

5) Your microservice, `reports.scalehaus.io`, will be able to use `auth.scalehaus.io`'s public key to decrypt the token and verify that the user is actually chet@scalehaus.io -- without needing a shared db


## Example ##

Authentic Server

```js
var fs = require('fs')
var http = require('http')
var Authentic = require('../')

var auth = Authentic({
  db: __dirname + '/../db/',
  publicKey: fs.readFileSync(__dirname + '/rsa-public.pem'),
  privateKey: fs.readFileSync(__dirname + '/rsa-private.pem'),
  sendEmail: function (email, cb) {
    console.log(email)
    setImmediate(cb)
  }
})

var server = http.createServer(function (req, res) {
  auth(req, res, next)

  function next (req, res) {
    // not an authentic route, send 404 or send to another route
    res.end('Not an authentic route =)')
  }
})

server.listen(1337)
console.log('Authentic enabled server listening on port', 1337)
```

Client Login
```js
var jsonist = require('jsonist')

var loginUrl = 'https://auth.scalehaus.io/auth/login'

var userData = {
  email: 'chet@scalehaus.io',
  password: 'definitelynotswordfish'
}

// Step 1: get token
jsonist.post(loginUrl, userData, function (err, resp) {
  if (err || resp.error) return console.error(err || resp.error)

  var token = resp.authToken

  // Step 2: use token!
  var microserviceUrl = 'https://reports.scalehaus.io/private'
  var opts = {headers: {authorization: 'Bearer ' + token}}

  jsonist.get(microserviceUrl, opts, function (err, report) {
    if (err) return console.error(err)

    // Show dat report!
  })
})

```

Microservice
```js

var http = require('http')
var Authentic = require('../').service

var auth = Authentic({
  server: 'https://auth.scalehaus.io'
})

http.createServer(function (req, res) {
  // Step 1: decrypt the token
  auth(req, res, function (err, authData) {
    if (err) return console.error(err)

    // Step 2: if we get an email and it's one we like, let them in!
    if (authData && authData.email.match(/@scalehaus\.io$/)) {
      res.writeHead(200)
      res.end('You\'re in!')

    // otherwise, keep them out!
    } else {
      res.writeHead(403)
      res.end('Nope.')
    }
  })
}).listen(1338)

console.log('Protected microservice listening on port', 1338)

```

# License

MIT
