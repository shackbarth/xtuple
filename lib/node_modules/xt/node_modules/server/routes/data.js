
/** @class
  All client data requests are directed through this route.
*/
xt.dataRoute = xt.route.create(
  /** @lends xt.dataRoute.prototype */ {

  /**
    All client data requests will be passed with a payload that
    indicates to the datasource what handler to use based on
    the request type.
  */
  handle: function(xtr) {
    
    if(xt.none(xtr.get('info.type'))) 
      return xtr.write("No, you don't know what you're asking.").close();

    xt.debug("The request was type: %@".f(xtr.get('info.type'))); 

    xtr.close();
  },

  /**
    Just one route, data.
  */
  routes: [ 'data' ]

});
