
// require the redis driver
XT.redis = require('redis');

XT.cache = {
  createClient: function(port, hostname) {
    try {
      XT.cache = XT.redis.createClient(
        port,
        hostname
      );
      XT.log("Cache looking at host %@ on port %@".f(hostname, port));
    } catch (err) {
      issue(XT.fatal("Could not connect to Cache"));
    }
  }
};
