

const url = 'http://localhost:3000/api/update/59d66929d7d544cca25b6422?available=true';

var request = require('request');

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

// Configure the request
var options = {
    url: url,
    method: 'POST',
    headers: headers
}

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(JSON.parse(body))
        response.send(" ")
    }
})
