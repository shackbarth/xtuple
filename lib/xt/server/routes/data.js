
/** @class
  All client data requests are directed through this route.
*/
XT.dataRoute = XT.Route.create(
  /** @lends XT.dataRoute.prototype */ {

  /**
    All client data requests will be passed with a payload that
    indicates to the datasource what handler to use based on
    the request type.

    @param {Object} xtr The xt response object.
    @method
  */
  handle: function(xtr) {
    
    // XT.debug("in XT.dataRoute.handle");
    
    var t = xtr.get('info.json.requestType');

    if(XT.none(t))
      return xtr.write(
        "I can't believe I'm even humoring you with this response, ",
        "you have no idea what you're asking for.").close();

    // XT.debug("The request was type: %@".f(t)); 

    // attempt to find a functor to handle the request type
    var f = this.find(t);

    if(XT.none(f))
      return issue(XT.close("Could not handle request type, %@".f(t), xtr));


    // if the functor requires a session, it must be loaded before
    // it is allowed to handle the request
    if(f.target.get('needSession')) {
      
      // XT.debug("needSession was true for %@".f(f.target.toString()));
      
      xtr .set('useSession', true)
          .set('handler', f.target);

    }
      
    // this was stored as hash { handles: '{type}', target: {object} }
    else {
      // XT.debug("DID NOT NEED SESSION?!?!");
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
  routes: "data /data".w()

});

XT.run(function() {
  XT.dataRoute.set('functors', XT.Functors);
  XT.log("%@ functors were found and loaded for data route".f(XT.Functors.length)); 
});
