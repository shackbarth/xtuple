(function () {

  var _net = require("net"), client, opts = X.options.datasource,
      connect, retryTimer, failedTimer, failed;

  //X.debugging = true;

  connect = function () {
    client = _net.connect(22000, X.options.proxy.hostname);
    client.on("connect", function () {

      // now that we have a valid connection, register a cleanup
      // task to report why we shut down...
      X.addCleanupTask(function () {
        client.write(X.json({reason: X.SHUTDOWN_SIGNAL}));
      });

      X.log("Connection established with the router");

      if (failedTimer) clearTimeout(failedTimer);
      if (retryTimer) clearTimeout(retryTimer);

      var info = {};
      //info.port = opts.securePort;
      info.port = opts.port;
      info.hostname = opts.hostname;
      info.name = opts.name;
      info.description = opts.description;
      info.location = opts.location;
      client.write(X.json({type: "datasource", details: info}));
    });
    client.on("error", function (err) {
      //issue(X.fatal("could not connect to router: ", err.message));
      X.warn("Could not connect to the router...retrying in 10 seconds");
      if (!failedTimer) failedTimer = setTimeout(failed, 120000);
      //if (!failedTimer) failedTimer = setTimeout(failed, 60000);
      retryTimer = setTimeout(connect, 10000);
    });
    client.on("end", function () {
      X.warn("Disconnected from the router, trying to reconnect");
      connect();
    });
  };

  failed = function () {
    issue(X.fatal("Could not establish a connection with the router"));
  };

  //client = _net.connect(22000, X.options.proxy.hostname);
  connect();

}());
