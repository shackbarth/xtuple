
// require the redis driver
XT.redis = require('redis');

// process.once('xtBootstrapping', function() {

  XT.run(function() {

  /** @namespace
    The central caching mechanism that allows for seamless integration
    with a redis store. 
  */
  try {
    XT.cache = XT.redis.createClient(
      XT.opts['redis-port'],
      XT.opts['redis-host']
    ); // NEEDS TO USE GLOBAL PROPERTIES
  } catch(err) {
    issue(XT.fatal("Could not connect to Redis server"));
  }
  
  // set up some basic error handling
  // should probably be FAR more elaborate in the future
  XT.cache.on('error', function(e) { issue(XT.warn(e)); });

  XT.log("Cache looking at host %@ on port %@".f(XT.opts['redis-host'], XT.opts['redis-port']));
  });
// })
