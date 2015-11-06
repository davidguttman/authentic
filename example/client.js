var Authentic = require('../').client

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
