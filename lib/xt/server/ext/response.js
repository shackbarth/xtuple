
/** @namespace
  The xt response object provides a mechanism to pass around
  data from client requests of various types and have methods interact
  and be able to respond via a single API. It provides a means
  of inspection of the original server request/response objects
  but also a means to push back various types of data such as
  JSON payloads or bitstreams.
*/
XT.Response = XT.Object.extend(
  /** @lends XT.Response.prototype */ {

  /**
    Initialization of the response object ends in a call back to
    the router that created it emitting an event to actually
    route the request once any payload has been acquired.
    
    @private
  */
  init: function() {
    var req = this.get('request'),
        r = this.get('router'),
        s = this; 

    // for development may need to create fake
    // requests so allow them to not always have
    // legit requests...
    if(XT.none(req))
      return this.set('isOpen', NO);
    
    // make sure to retrieve any payload data
    req.on('data', function(c) {
      s.payloadData += c;
    }).on('end', function() {
      s.consume();
      r.route(s);
    });
  },

  /**
    Any payload data retrieved from the original
    server request object on initialization.

    @property
    @type String
  */
  payloadData: '',

  /**
    Any payload data retrieved from the original
    server request object on initialization but
    parsed as JSON.
    
    @property
    @type Object
  */
  payloadJSON: null,
  
  /**
    The database expects keys to have been decamelized.
    This is the decamelized and database-safe/friendly object.
    
    @property
    @type Object
  */
  payloadSafe: null,

  /**
    If the current request is part of a valid session.
    
    @see xt#response#session
    @property
    @default NO
    @type Boolean
  */
  useSession: NO,

  /**
    The server request object.

    @property
    @type Object
  */
  request: null,

  /**
    The server response object.

    @property
    @type Object
  */
  response: null,

  /**
    The server that owns the router that owns this
    response object.

    @property
    @type Object
  */
  server: null,

  /**
    The router that owns this response object.

    @property
    @type Object
  */
  router: null,

  /**
    If the server response object can still be written to.
    Will be YES unless the pipe has been closed. Subsequent
    requests to close the connection when this is already
    NO will be ignored.

    @default YES
    @property
    @type Boolean
  */
  isOpen: YES,
  
  /**
    On occassions when a session is needed by a functor,
    this will be a reference to the functor to execute
    once the session has been successfully acquired.
    
    @property
    @type XT.Functor
    @default null
  */
  handler: null,

  /**
    Explicit write to response stream. If no content-type
    or additional headers have been set this forces
    implicit headers.
  */
  write: function() {
    var a = args(),
        i = 0,
        l = a.length,
        r = this.get('response');
        
    for(; i<l; ++i) {     
      if(XT.typeOf(a[i]) === XT.T_HASH)
        a[i] = XT.json(a[i]) || ''; // we need to be able to know this failed
      //XT.debug("XT.Response (%@) writing: %@".f(this.toString(), a[i]));
      r.write(a[i]);
    }
    return this;
  },

  /**
    Close the connection to the client...forcefully.
  */
  close: function() {
    if(this.get('isOpen') === NO) return;
    this.get('response').end();
    this.set('isOpen', NO);
  },

  /**
    Consumes information about the server request...
  */
  consume: function() {
    
    
  //   XT.debug("in XT.Response.consume");
    
    
    var req = this.get('request'),
        res = this.get('response'),
        json = XT.json(this.get('payloadData')), dbsafe;

    // this is...well for now we're setting the encryption
    // key here but functors should use the payloadSafe property
    // to have the already stringified version that has it
    json.encryptionKey = XT.ENCRYPTIONKEY;
    dbsafe = XT.json(json);

    this.set('payloadJSON', json);
    this.set('payloadSafe', dbsafe);
  
    // interesting information about a request that we
    // store for possible useful reasons and debugging
    // (because apparently debugging isn't useful...)
    var i = {
      url: req.url || null,
      method: req.method || null,
      status: req.statusCode || null,
      clientAddress: req.client.remoteAddress || null,
      clientPort: req.client.remotePort || null,
      server: this.get('server.name') || null,
      serverPort: req.client.address().port || null,
      serverAddress: req.client.address().address || null,
      payload: this.get('payloadData') || null,
      json: json || null
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

    XT.report(i, t, d);
  },

  getSession: function(p, useSession) {
    
    // XT.debug("XT.Response.useSession %@".f(useSession ? "YES" : "NO"));
    
    if(!useSession) return;
    
    XT.sessionStore.getSession(this);
  }.by('useSession'),

  className: 'XT.Response'

});
