
xt.database.check = function() {
  xt.db.query("select * from usr limit 1;", function(e, r) {
    if(e) throw xt.fatal("Could not connect to database", e);

    // if we got here, we're good to go...should be at least
    xt.log("Database is available and communication open");
  });
  
  // need to also check redis...
  xt.cache.set('testKey', 'testValue');
  xt.cache.get('testKey', function(e, r) {
    if(e) throw xt.fatal("Could not retrieve data from cache");
    xt.log("Cache is active and accessible");
    process.emit('xtCacheAvailable');
    xt.cache.del('testKey');
  });
}
