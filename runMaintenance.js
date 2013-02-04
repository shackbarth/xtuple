var request = require('request');
request('http://localhost:442/maintenance?core=true', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var result = JSON.parse(body);
      wasSuccess = !result.isError;

    if (result.isError) {
      console.log("Maintenance error", result.errorLog);
    } else {
      console.log("Maintenance success!", result.commandLog);
    }
  }
})
