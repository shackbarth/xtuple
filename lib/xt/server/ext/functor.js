
/** @class
  Functors are special handlers for data requests from the client.
  They are only used by the dataRoute xt route object and are loaded
  automatically at server start.
*/
XT.Functor = XT.Object.extend(
  /** @lends XT.Functor.prototype */ {

  /**
    When loaded by the data route handler it is auto-created
    and thus we want to auto-register to be selectable by
    the route.

    @private
  */
  init: function() {
    if(XT.none(XT.Functors)) XT.Functors = [];
    XT.Functors.push({ handles: this.get('handles'), target: this });
  },

  /**
    A functor must provide a handle method that takes
    a single parameter: the xt response obejct. From here
    it has access to the original response and request objects
    as well as the payload data. The session object will be
    attached to the xt response object by the time this
    method is executed when one can be present. If a functor
    requires a session but the sessionStore fails to retrieve
    the session this method will not be executed.

    @param {Object} xtr The xt response object.
  */
  handle: function(xtr) {},

  /**
    Each functor handles a specific request type from
    the client. This is a string representing the request
    type that it should be selected when this type is
    encountered by the server.

    @type {String}
    @property
  */
  handles: null,
  
  /**
    Almost all functors should require a session. If they do,
    they will automatically attempt to acquire the session before
    handling the request to ensure they can execute their
    functionality as the correct user. In the rare cases that
    a functor does not require an active session (such as a request
    for a new session) this boolean must be set to false but it
    defaults to true.
    
    @property
    @type Boolean
    @default true
  */
  needSession: true,

  /** @private */
  className: 'XT.Functor'

});
