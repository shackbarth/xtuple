
/*globals XT */

sc_require("runtime/common");
sc_require("views/animation_view");

XT.BASE_VIEW_REMOVE_LEFT = XT.hex();
XT.BASE_VIEW_APPEND_LEFT = XT.hex();
XT.BASE_VIEW_PREPARE_LEFT = XT.hex();
XT.BASE_VIEW_REMOVE_RIGHT = XT.hex();
XT.BASE_VIEW_APPEND_RIGHT = XT.hex();
XT.BASE_VIEW_PREPARE_RIGHT = XT.hex();

/** @class

*/
XT.BaseContentView = XT.AnimationView.extend(
  /** @scope XT.BaseContentView.prototype */ {

  init: function() {
    this._layout = SC.clone(this.get("layout"));
    return sc_super();
  },

  layout: { top: 0, left: 0, right: 0, bottom: 0 },

  xtTransitions: {
    "left": { duration: .25, timing: SC.Animatable.TRANSITION_CSS_EASE_IN_OUT },
    "right": { duration: .25, timing: SC.Animatable.TRANSITION_CSS_EASE_IN_OUT },
  },

  xtAnimationEvents: {
    "reset": [
      { start: 200 },
      { call: function() { this.warn(this.resetAnimation()); } },
    ],
    "hideRight": [
      { property: "left", 
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_REMOVE_RIGHT); },
        immediate: YES },
    ],
    "prepareRight": [
      { disableAnimation: YES },
      { property: "left",
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_PREPARE_RIGHT); } },
    ],
    "showRight": [
      { enableAnimation: YES },
      { property: "left",
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_APPEND_RIGHT); },
        wait: 50 },
    ],
    "hideLeft": [
      { property: "left", 
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_REMOVE_LEFT); },
        immediate: YES },
    ],
    "prepareLeft": [
      { disableAnimation: YES },
      { property: "left",
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_PREPARE_LEFT); } },
    ],
    "showLeft": [
      { enableAnimation: YES },
      { property: "left",
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_APPEND_LEFT); },
        wait: 50 },
    ]
  },

  _adjustmentFor: function(type) {
    var layout, adjust;
    frame = this.get("frame"),
    layout = this.get("layout");
    switch(type) {
      case XT.BASE_VIEW_REMOVE_LEFT:
        this.log("XT.BASE_VIEW_REMOVE_LEFT");
        adjust = 0-(frame.width * 2);
        break;
      case XT.BASE_VIEW_REMOVE_RIGHT:
        this.log("XT.BASE_VIEW_REMOVE_RIGHT");
        adjust = (frame.width * 2);
        break;
      case XT.BASE_VIEW_PREPARE_LEFT:
        this.log("XT.BASE_VIEW_PREPARE_LEFT");
        adjust = 0+(frame.width * 2);
        break;
      case XT.BASE_VIEW_PREPARE_RIGHT:
        this.log("XT.BASE_VIEW_PREPARE_RIGHT");
        adjust = 0-(frame.width * 2);
        break;
      case XT.BASE_VIEW_APPEND_LEFT:
        this.log("XT.BASE_VIEW_APPEND_LEFT");
        adjust = 0;
        break;  
      case XT.BASE_VIEW_APPEND_RIGHT:
        this.log("XT.BASE_VIEW_APPEND_RIGHT");
        adjust = 0;
        break;
    }
    this.log("_adjustmenFor returning value => %@".fmt(adjust));
    return adjust;
  }

}) ;
