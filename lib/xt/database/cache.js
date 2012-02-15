
// require the redis driver
XT.redis = require('redis');

/** @namespace
  The central caching mechanism that allows for seamless integration
  with a redis store. 
*/
XT.cache = XT.redis.createClient(
  XT.opts['redis-port'],
  XT.opts['redis-host']
); // NEEDS TO USE GLOBAL PROPERTIES

// set up some basic error handling
// should probably be FAR more elaborate in the future
XT.cache.on('error', function(e) { issue(XT.warn(e)); });

process.once('xtBootstrapping', function() {
  XT.log("Cache looking at host %@ on port %@".f(XT.opts['redis-host'], XT.opts['redis-port']));
})
