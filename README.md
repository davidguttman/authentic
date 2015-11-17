# Authentic

Authentication for microservices. This is collection of the following modules:

* [authentic-server](https://github.com/davidguttman/authentic-server)
* [authentic-service](https://github.com/davidguttman/authentic-service)
* [authentic-client](https://github.com/davidguttman/authentic-client)

## What is it? ##

Authentic is a collection of modules to help your various services authenticate a user. Put more concretely, Authentic does the following:

* Allow your users to "sign up", "confirm", "log in", and "change password" with their email address and a chosen password (persisted to a db of your choice), and provide an authentication token ([JWT](http://jwt.io)) on successful log in.
* Easily protect access to your microservice by decrypting a user's authentication token.
* Help make requests from the browser to `authentic-server` for sign up/confirm/login/password reset, as well as automatically including the authentication token in requests to your microservices.

There's also a more full [introduction to Authentic](http://dry.ly/authentic).

## Example ##

Let's pretend you work at ScaleHaus (Uber meets Airbnb for lizards). You have a web app at `admin.scalehaus.io` (client-side SPA) that is an interface to various microservices (like `reporting.scalehaus.io`). You want to make sure that only employees with a `@scalehaus.io` email address have access to your app and microservices. Here's how you can do it:

1) Create an authentication server with [authentic-server](https://github.com/davidguttman/authentic-server) available at `auth.scalehaus.io`.

2) Add views to `admin.scalehaus.io` for signup/confirm/login/reset-password and use [authentic-client](https://github.com/davidguttman/authentic-client) for those actions and for requests to your microservices.

3) In your microservice(s), e.g. `reports.scalehaus.io`, use [authentic-service](https://github.com/davidguttman/authentic-service) to decrypt the authentication token provided in the request and verify the user's identity and that their email ends in `@scalehaus.io`.

## Installation ##

It's best to install each module individually in the project that needs it. In theory, you could have a single project that needs to be the server, client, and service -- in that case feel free to `npm install --save authentic`. Otherwise use `npm install --save authentic-server`, `npm install --save authentic-service`, or `npm install --save authentic-client` depending on your project.

## In Action ##

### Authentic Server ###

```js
var fs = require('fs')
var http = require('http')
var Authentic = require('authentic').server

var auth = Authentic({
  db: './userdb',
  publicKey: fs.readFileSync('/rsa-public.pem'),
  privateKey: fs.readFileSync('/rsa-private.pem'),
  sendEmail: function (email, cb) {
    // send the email however you'd like and call cb()
  }
})

http.createServer(auth).listen(1337)
console.log('Authentic Server listening on port', 1337)
```

### Microservice ###

Authentic provides a token decrypt function for easy use, but since everything is standard JWT, feel free to use your own (`authentic-server` exposes its public-key by default at `/auth/public-key`).

```js

var http = require('http')
var Authentic = require('authentic').service

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

### Client Login ###

Authentic provides a HTTP JSON client for easy use, but since everything is standard JWT, feel free to use your own.

```js
var Authentic = require('authentic').client

var auth = Authentic({
  server: 'https://auth.scalehaus.io'
})

var creds = {
  email: 'chet@scalehaus.io',
  password: 'notswordfish'
}

// Step 1: log in
auth.login(creds, function (err) {
  if (err) return console.error(err)

  // Step 2: make a JSON request with authentication
  var url = 'https://reporting.scalehaus.io/report'
  auth.get(url, function (err, data) {
    if (err) return console.error(err)

    // show that report
    console.log(data)
  })
})

```

# License

MIT
