
/** @namespace
  This is the primary namespace for the database driver and
  functionality of the framework.
*/
XT.database = XT.Object.create(
  /** @lends XT.database.prototype */ {

  /**
    Takes parameter(s) to construct a PostgreSQL connection
    string. Can be passed an ordered number of parameters
    or a hash of key/value entries for the string with the
    parts user, password, host, port and database (all required).
    Note, the string contains the password for the given
    database user!

    @param {Object|String} user A hash with all parameters or the username.
    @param {String} [password] The database password for the user.
    @param {String} [host] The hostname for the database.
    @param {Number} [port] The port for the database.
    @param {String} [database] The name of the database to use once connected.
    @returns {String} The formatted connection string.
    @method
  */
  conString: function() {
    var a = args(),
        s = "tcp://{user}:{password}@{host}:{port}/{database}",
        u, p, P, h, d; 
    if(a[0] && XT.typeOf(a[0]) === XT.T_HASH) {
      var a = a[0];
      u = a.userName;
      p = a.password;
      P = a.port;
      h = a.host;
      d = a.database;
    }
    else {
      u = a[0];
      p = a[1];
      h = a[2];
      P = a[3];
      d = a[4];
    }
    return s.f({
      user: u,
      password: p,
      host: h,
      port: P,
      database: d
    });
  },

  /**
    TODO: rewrite

    @property
  */
  defaults: function(organization) {
    var ret = {};

    // NOTE: SINCE THE KEY-MAP ISN'T SET UP THIS
    // IS PURELY ARBITRARY!!!
    // THESE HAVE TO BE SUPPLIED SOMEHOW - WHEN USED
    // IN CONJUNCTION WITH XT AS A WHOLE IT IS SUPPLIED
    // AUTOMATICALLY FROM THE CONFIGURATION OPTIONS
    ret.userName = XT.database.user;
    ret.password = XT.database.password;
    ret.port = XT.database.port;
    ret.host = XT.database.hostname;
    ret.database = organization || XT.database.organization;
    return ret;
  },

  /**
    TODO: rewrite

    @method
  */
  query: function(organization, query, callback) {
    var defaults = this.defaults(organization);
    var conString = this.conString(defaults);

    // use the built-in pooling for this particular
    // connection
    XT.pg.connect(conString, function(err, client) {
      
      // if there was an error connecting to the database
      // we can't do much but report it
      if(err) {
        issue(XT.warning("Failed to connect to database", err));
        return callback(err);
      }

      // since we just connected, tell plv8 to init our session
      client.query("set plv8.start_proc = \"xt.js_init\";");

      // else we got a pooled client, now go ahead and query the
      // the sucker
      client.query(query, callback);
    });
  },

  className: 'XT.database'
});

XT.db = XT.database;

XT.run(function() {
  XT.pg.defaults.poolSize = 12;
});

/** XT.cache */           require('./cache');
/** XT.MongooseSchema */  require("./ext/mongoose_schema");