
//...........................................
// Server Initialization/Setup
//
// Include all of the necessary modules and ensure that
// they will be available throughout the application
// by adding them to the xt namespace.

/** @lends xt */  require('./xt');

// Execute a series of startup routines checking to ensure the
// required tasks are executed correctly.
process.once('xtReady', xt.bootstrap);

//// process.once('xtReady', function() {
////   
////   var r = xt.response.create({
////     className: 'high'
////   });
////   r.set('useSession', YES);
////   
////   
////   // setTimeout(function() {
////   //   xt.debug("DOING IT!");
////   //   r.set('useSession', YES);
////   //   r.set('test1', NO);    
////   // }, 3000);
////   
//// });
