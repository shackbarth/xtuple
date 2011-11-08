
/*globals XT */

sc_require("runtime/common");
sc_require("ext/animation_view");

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
    XT.TESTME = this;
    return sc_super();
  },

  layout: { top: 0, left: 0, right: 0, bottom: 0 },

  xtTransitions: {
    "left": { duration: .25, timing: SC.Animatable.TRANSITION_CSS_EASE_IN_OUT }
  },

  xtAnimationEvents: {
    "hideRight": [
      { property: "left", 
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_REMOVE_RIGHT); } }
    ],
    "prepareRight": [
      { disableAnimation: YES },
      { property: "left",
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_PREPARE_RIGHT); },
        immediate: YES },
    ],
    "showRight": [
      { enableAnimation: YES },
      { property: "left",
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_APPEND_RIGHT); },
        wait: 25 }
    ],
    "hideLeft": [
      { property: "left", 
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_REMOVE_LEFT); } }
    ],
    "prepareLeft": [
      { disableAnimation: YES },
      { property: "left",
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_PREPARE_LEFT); },
        immediate: YES },
    ],
    "showLeft": [
      { enableAnimation: YES },
      { property: "left",
        value: function() { return this._adjustmentFor(XT.BASE_VIEW_APPEND_LEFT); } }
    ]
  },

  _adjustmentFor: function(type) {
    console.error("IN ADJUSTMENT FOR!");
    var layout, adjust;
    frame = this.get("frame"),
    layout = this.get("layout");
    console.error("layout => ", layout);
    console.error("frame => ", frame);
    switch(type) {
      case XT.BASE_VIEW_REMOVE_LEFT:
        adjust = 0-(frame.width * 2);
        break;
      case XT.BASE_VIEW_PREPARE_LEFT:
        adjust = 0+(frame.width * 2);
        break;
      case XT.BASE_VIEW_APPEND_LEFT:
        adjust = 0;
        break;  
    }
    console.error("RETURNING VALUE => ", adjust);
    return adjust;
  }

}) ;
