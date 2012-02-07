
/** @namespace
  This is the primary namespace for the database driver and
  functionality of the framework.
*/

xt.database = xt.object.create(
  /** @lends xt.database.prototype */ {

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
    if(a[0] && xt.typeOf(a[0]) === xt.t_hash) {
      var a = a[0];
      u = a.user;
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
    Returns the default connection string for the database.
    Typically not useful outside the context of the database
    controller and should not be accessed globally.

    @property
  */
  defaultString: function() {
    var s = this._defaultString;
    if(xt.none(s))
      s = this._defaultString = this.conString(xt.opts);
    return s;
  }.property(),

  /**
    Queries the database. Expects a ready SQL query string and
    a valid callback to handle errors and responses. It is important
    to note that this is not a final state for this method and
    the API is volatile with a strong likelyhood that it will change
    dramatically. This method is not intended to be executed
    arbitrarily but is instead used by xt session objects to
    execute specific types of queries.

    @param {String} query The SQL query string ready to execute.
    @param {Function} callback The callback that can also handle errors.
      If the callback was passed in from a xt session object then it
      will be capable of calling `this` from the context of the session.
    @method
  */
  query: function() {
    var a = arguments;
    if(
      a.length != 2
      || xt.typeOf(a[0]) !== xt.t_string
      || xt.typeOf(a[1]) !== xt.t_function
    ) return;
    var q = a[0],
        f = a[1],
        s = a[2] ? this.conString(a[2]) : this.get('defaultString');
    xt.pg.connect(s, function(e, c) {
      if(e) throw xt.fatal("Failed to connect to database", e);
      c.query(q, f);
    });
  }

});

xt.db = xt.database;

/** xt.database.check */  require('./check');
/** xt.cache */           require('./cache');

process.once('xtBootstrapping', xt.db.check);
