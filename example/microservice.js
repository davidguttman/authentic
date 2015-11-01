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
