
/*globals Login */

/** @class

*/
Login.StatusIconView = XT.StatusImageView.extend(
  /** @scope Login.StatusIconView.prototype */ {

  layout: { height: 64, width: 64, centerY: 40, right: 60 },
  isVisible: NO,
  xtTransitions: {
    "centerY": { duration: .2, timing: SC.Animatable.TRANSITION_CSS_EASE },
    "opacity": { duration: .2, timing: SC.Animatable.TRANSITION_CSS_EASE }
  },
  xtAnimationEvents: {
    "active": [
      { start: 250 },
      { disableAnimation: YES },
      { property: "opacity", value: 0.0, immediate: YES },
      { property: "centerY", value: 0, immediate: YES },
      { property: "isVisible", value: YES, set: YES },
      { enableAnimation: YES },
      { property: "opacity", value: 1.0, wait: 100 },
      { property: "centerY", value: 40, wait: 100 }
    ],
    "inactive": [
      { property: "centerY", value: 80, wait: 100 },
      { property: "opacity", value: 0.0, wait: 100 },
      { disableAnimation: YES },
      { property: "centerY", value: -30, wait: 300 },
      { enableAnimation: YES }
    ]
  }

}) ;
