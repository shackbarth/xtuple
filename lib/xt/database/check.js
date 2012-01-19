
xt.database.check = function() {
  xt.db.query("SELECT * FROM usr;", function(e, r) {
    if(e) throw xt.fatal("Could not connect to database", e);

    // if we got here, we're good to go...should be at least
    xt.log("Database is available and communication open.");
  });
}
