var request = require('request');
request('http://localhost:442/maintenance?core=true', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var result = JSON.parse(body).data;

    if (!result) {
      console.log("Maintenance error", arguments);
    } else if (result.isError) {
      console.log("Maintenance error", result.errorLog || result.message);
    } else {
      console.log("Maintenance success!", result.commandLog);
    }
  } else {
    console.log("Cannot connect to server", error);
  }
})
