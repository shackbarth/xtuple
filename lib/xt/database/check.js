
XT.db.check = function() {

  // before we run the first query set the poolSize default
  XT.pg.defaults.poolSize = 12;

  XT.db.query("select * from usr limit 1", function(err, res) {
    if(err) throw XT.fatal("Could not connect to database", err);

    // if we got here, we're good to go...should be at least
    XT.log("Database is available and communication open");
  });
  
  // need to also check redis...
  XT.cache.set('testKey', 'testValue');
  XT.cache.get('testKey', function(err) {
    if(err) throw XT.fatal("Could not retrieve data from cache");
    XT.log("Cache is active and accessible");
    process.emit('xtCacheAvailable');
    XT.cache.del('testKey');
  });
}
