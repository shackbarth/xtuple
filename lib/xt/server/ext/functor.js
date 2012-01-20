
/** @class
  Functors are special handlers for data requests from the client.
  They are only used by the dataRoute xt route object and are loaded
  automatically at server start.
*/
xt.functor = xt.object.extend(
  /** @lends xt.functor.prototype */ {

  /**
    When loaded by the data route handler it is auto-created
    and thus we want to auto-register to be selectable by
    the route.

    @private
  */
  init: function() {
    if(xt.none(xt.functors)) xt.functors = [];
    xt.functors.push({ handles: this.get('handles'), target: this });
  },

  /**
    A functor must provide a handle method that takes
    a single parameter: the xt response obejct. From here
    it has access to the original response and request objects
    as well as the payload data.

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

  /** @private */
  className: 'xt.functor'

});
