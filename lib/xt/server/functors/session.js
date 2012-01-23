
/** @class
*/
xt.requestSession = xt.functor.create(
  /** @lends xt.requestSession.prototype */ {

  handle: function(xtr) {
    xtr.close();
  },

  /** @property */
  handles: 'requestSession',

  /** @private */
  className: 'xt.requestSession' 

});

