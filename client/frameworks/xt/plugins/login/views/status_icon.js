
/*globals Login */

/** @class

*/
Login.StatusIconView = XT.StatusImageView.extend(
  /** @scope Login.StatusIconView.prototype */ {

  layout: { height: 64, width: 64, centerY: 40, right: 60 },
  isVisible: NO,
  animations: {
    "active": [
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
      { immediate: YES },
      { complete: YES, property: "isVisible", value: NO, set: YES }
    ]
  }

}) ;
