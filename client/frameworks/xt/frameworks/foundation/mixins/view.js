
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
  _xt_notifyDidAppend: function() {
    
    // since many child views may be adjusting based on our
    // current state, go ahead and start a top-down chain
    // so we respond first then notify the children 
    if(this.xtDidAppend && SC.typeOf(this.xtDidAppend) === SC.T_FUNCTION)
      this.xtDidAppend();
    
    // go ahead and let all of the children know
    var cvs = this.get("childViews"), i=0;
    if(!cvs || cvs.length <= 0) return;
    for(; i<cvs.length; ++i) {
      if(!cvs[i]) continue;
      if(cvs[i]._xt_notifyDidAppend)
        cvs[i]._xt_notifyDidAppend();
      else this.warn(
        ("childView %@ is not an XT.View, consider overloading the view-type " +
        "so it can make use of the abstraction layer. This is highly recommended " +
        "and in some cases, required.").fmt(cvs[i])
      );
    }
  },
  
  /** @private */
  _xt_notifyDidRemove: function() {
    
    if(this.xtDidRemove && SC.typeOf(this.xtDidRemove) === SC.T_FUNCTION)
      this.xtDidRemove();
    
    // go ahead and let all of the children know
    var cvs = this.get("childViews"), i=0;
    if(!cvs || cvs.length <= 0) return;
    for(; i<cvs.length; ++i) {
      if(!cvs[i]) continue;
      if(cvs[i]._xt_notifyDidRemove)
        cvs[i]._xt_notifyDidRemove();
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

  /** @private */
  _xt_adjustWidthToBaseFrame: function() {
    var frame = XT.BASE_PANE.get("frame");
    if(this._xt_lastWidth && this._xt_lastWidth !== frame.width)
      this.adjust("width", frame.width).updateLayout();
    this._xt_lastWidth = frame.width;
  },

  /** @private */
  _xt_adjustHeightToBaseFrame: function() {
    var frame = XT.BASE_PANE.get("frame");
    var height = frame.height - (Plugin.DEFAULT_TOP_PADDING + Plugin.DEFAULT_BOTTOM_PADDING);
    if(this._xt_lastHeight && this._xt_lastHeight !== height)
      this.adjust("height", height).updateLayout();
    this._xt_lastHeight = height;
  },

} ;

// Ensures that any class that uses the mixin also receives
// the XT.Logging mixin by default.
SC.mixin(XT.ViewMixin, XT.Logging);
