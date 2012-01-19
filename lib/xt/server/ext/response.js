
/** @namespace
  The xt response object provides a mechanism to pass around
  data from client requests of various types and have methods interact
  and be able to respond via a single API. It provides a means
  of inspection of the original server request/response objects
  but also a means to push back various types of data such as
  JSON payloads or bitstreams.
*/
xt.response = xt.object.extend(
  /** @lends xt.response.prototype */ {

  /**
    Initialization of the response object ends in a call back to
    the router that created it emitting an event to actually
    route the request once any payload has been acquired.
    
    @private
  */
  init: function() {
    var req = this.get("_request"),
        r = this.get("_router"),
        s = this; 

    // make sure to retrieve any payload data
    req.on('data', function(c) {
      s.payloadData += c;
    }).on('end', function() {
      s.consume();
      r.emit('xtrReady', s);
    });
  },

  /**
    Any payload data retrieved from the original
    server request object on initialization.

    @property
  */
  payloadData: '',

  /**
    Explicit write to response stream. If no content-type
    or additional headers have been set this forces
    implicit headers.
  */
  write: function() {
    var a = args(),
        i = 0,
        l = a.length,
        r = this.get('_response');
    for(; i<l; ++i)
        r.write(a[i]);
    return this;
  },

  /**
    Close the connection to the client...forcefully.
  */
  close: function() {
    this.get('_response').end();
  },

  /**
    Consumes information about the server request...
  */
  consume: function() {
    var req = this.get('_request'),
        res = this.get('_response');

    // console.log(xt.util.inspect(res, true, 6));

    // interesting information about a request that we
    // store for possible useful reasons and debugging
    // (because apparently debugging isn't useful...)
    var i = {
      url: req.url || null,
      method: req.method || null,
      status: req.statusCode || null,
      client: req.client.remoteAddress || null,
      server: this.get('_server.name') || null,
      payload: this.get('payloadData') || null
    },

    d = "Client request received with the following information",
    t = "REQUEST INFORMATION";

    // if there is a leading / strip it
    if(i.url.indexOf('/') == 0)
      i.url = i.url.slice(1);

    this.set('route', i.url);

    // go and and add these properties to the xt response
    // object for later if necessary
    this.set('info', _.clone(i));

    xt.report(i, t, d);
  },

  className: 'xt.response'

});
