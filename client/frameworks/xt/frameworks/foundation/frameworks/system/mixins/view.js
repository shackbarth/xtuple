
/*globals XT */

sc_require("mixins/logging");

/** @class

*/
XT.ViewMixin = {

  /** @private */
  _xt_notifyWillAppend: function() {
    
    // since many child views may be adjusting based on our
    // current state, go ahead and start a top-down chain
    // so we respond first then notify the children 
    if(this.xtWillAppend && SC.typeOf(this.xtWillAppend) === SC.T_FUNCTION)
      this.xtWillAppend();
    
    // go ahead and let all of the children know
    var cvs = this.get("childViews"), i=0;
    if(!cvs || cvs.length <= 0) return;
    for(; i<cvs.length; ++i) {
      if(!cvs[i]) continue;
      if(cvs[i]._xt_notifyWillAppend)
        cvs[i]._xt_notifyWillAppend();
      else this.warn(
        ("childView %@ is not an XT.View, consider overloading the view-type " +
        "so it can make use of the abstraction layer. This is highly recommended " +
        "and in some cases, required.").fmt(cvs[i])
      );
    }
  },

  /** @private */
  _xt_collectAnimationEvents: function(fill) {
    XT._collectAnimationEventsFor.call(this, fill);
  },

} ;

// Ensures that any class that uses the mixin also receives
// the XT.Logging mixin by default.
SC.mixin(XT.ViewMixin, XT.Logging);
