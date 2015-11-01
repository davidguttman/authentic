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

# License

MIT
