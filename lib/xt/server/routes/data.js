
/** @class
  All client data requests are directed through this route.
*/
xt.dataRoute = xt.route.create(
  /** @lends xt.dataRoute.prototype */ {

  /**
    All client data requests will be passed with a payload that
    indicates to the datasource what handler to use based on
    the request type.

    @param {Object} xtr The xt response object.
    @method
  */
  handle: function(xtr) {
    
    // xt.debug("in xt.dataRoute.handle");
    
    var t = xtr.get('info.json.requestType');

    if(xt.none(t))
      return xtr.write(
        "I can't believe I'm even humoring you with this response, ",
        "you have no idea what you're asking for.").close();

    // xt.debug("The request was type: %@".f(t)); 

    // attempt to find a functor to handle the request type
    var f = this.find(t);

    if(xt.none(f))
      return issue(xt.close("Could not handle request type, %@".f(t), xtr));


    // if the functor requires a session, it must be loaded before
    // it is allowed to handle the request
    if(f.target.get('needSession')) {
      
      // xt.debug("needSession was true for %@".f(f.target.toString()));
      
      xtr .set('useSession', YES)
          .set('handler', f.target);

    }
      
    // this was stored as hash { handles: '{type}', target: {object} }
    else {
      // xt.debug("DID NOT NEED SESSION?!?!");
      f.target.handle(xtr);
    }
  },

  /**
    Finds the functor that handles the request type requested and
    returns it or null if none is found.

    @param {String} req The request type.
    @returns {Object} The functor that handles the request type or null.
  */
  find: function(req) {
    var s = this.get('functors'), f;
    f = _.filter(s, function(v) {
      return v.handles === req;
    }, this);
    return f[0] ? f[0] : null;
  },

  /**
    Just one route, data.
    @property
  */
  routes: [ 'data' ],

  /**
    Here we've overloaded init so that we can grab any available
    handlers for the record types without explicitly knowing
    about them.

    @private
  */
  init: function() {
    var s = this;
    process.chdir(__dirname);
    xt.fs.directoryFiles('../functors', function(files) {
      var num = files.length;
      if(num <= 0)
        return issue(
          xt.warning("There were no functors to load by the data route handler."));
      _.each(files, function(v, k) {
        require('../functors/%@'.f(v));
        --num; if(num == 0) this.emit('xtFunctorsLoaded');
      }, s); // note the context
    }, 'js');
  },

  /**
    Effectively just checks to make sure we've loaded some functor's
    otherwise we're in trouble.

    @private
  */
  _finalize_init: function() {
    this.set('functors', xt.functors);
    xt.log("%@ functors were found and loaded for data route".f(xt.functors.length)); 
  }.by('xtFunctorsLoaded')

});
