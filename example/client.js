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
