
// require the redis driver
xt.redis = require('redis');

/** @namespace
  The central caching mechanism that allows for seamless integration
  with a redis store. 
*/
xt.cache = xt.redis.createClient(
  xt.opts['redis-port'],
  xt.opts['redis-host']
); // NEEDS TO USE GLOBAL PROPERTIES

// set up some basic error handling
// should probably be FAR more elaborate in the future
xt.cache.on('error', function(e) { issue(xt.warn(e)); });

process.once('xtBootstrapping', function() {
  xt.log("Cache looking at host %@ on port %@".f(xt.opts['redis-host'], xt.opts['redis-port']));
})