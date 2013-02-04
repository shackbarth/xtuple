var request = require('request');
request('http://localhost:442/maintenance?core=true', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var result = JSON.parse(body);
      status = result.status;

    console.log(result) // Print the web page.
  }
})
