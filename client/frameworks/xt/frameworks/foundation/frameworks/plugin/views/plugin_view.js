
/*globals Plugin */

sc_require("ext/common");

/** @class

  This the the defacto-standard base view for plugins. It is
  assumed that this will be the base-type (or extended from)
  for Plugin pages and views to work properly.

*/
Plugin.View = XT.PluginView = XT.View.extend(SC.Animatable,
  /** @scope Plugin.View.prototype */ {

  //..........................................
  // Public Properties
  //

  /** @property
    Adjusts the plugin's content below the top menu of the application.
  */
  topPadding: Plugin.DEFAULT_TOP_PADDING,

  /** @property
    Adjusts the plugin's content above the bottom bar/menu of the
    application.
  */
  bottomPadding: Plugin.DEFAULT_BOTTOM_PADDING,

  /** @property */
  isShowing: NO,

  //..........................................
  // Public Methods
  //

  /** @public
    Appends the view to the application making sure
    to animate it properly. Executes an asynchronous task.
  */
  append: function() {
    console.warn("append");
    var self = this;
    SC.run(function() { self.invokeLater(self._append, 10); });
    return this;
  },

  /** @public
    Removes the view from the application making sure
    to animate it properly. Executes an asynchronous task.
  */
  remove: function(direction) {
    console.warn("remove");
    var self = this;
    SC.run(function() { self.invokeLater(self._remove, 10, direction || Plugin.RIGHT_TO_LEFT); });
    return this;
  },

  //..........................................
  // Private Properties
  //

  /** @private */
  _index: null,

  /** @private */
  _plugin: null, 

  /** @private */
  transitions: {
    left:   { duration: .25, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
    right:  { duration: .25, timing: SC.Animatable.TRANSITION_EASE_IN_OUT }
  },

  /** @private */
  name: "Plugin.View",

  //..........................................
  // Observers
  //

  /** @private */
  _isShowingDidChange: function() {

  }.observes("isShowing"),

  //..........................................
  // Private Methods
  //

  /** @private */
  transitionDidEnd: function() {

    // when the transition ends from being removed, invoke this
    // asynchronous cleanup method
    // if(!this.isShowing) this.invokeLater(this._cleanup, 10);
    if(!this.isShowing) this.invokeLater(this._cleanup, 10);
  },
  
  /** @private */
  _remove: function(direction) {
    console.warn("_remove");
    var frame = this.getPath("parentView.frame"),
        leftAdjust = this._leftAdjustmentForRemove(direction, frame);
    this.set("isShowing", NO);
    this.adjust("left", leftAdjust); 
  },

  /** @private */
  _append: function() {
    console.warn("_append");
    XT.BASE_PANE.appendChild(this);
    console.warn("MADE IT PAST APPEND CHILD!");
    var curr = Plugin.Controller._currentPlugin,
        idx = this._index,
        paddingTop = this.get("topPadding"),
        paddingBottom = this.get("bottomPadding"),
        frame = this.getPath("parentView.frame"),
        height = (frame.height-(paddingTop+paddingBottom)),
        width = (frame.width),
        top = (~~((frame.height/2)-(height/2))),
        leftAdjust, cidx, dir, side;
    if(curr) {
      cidx = curr.get("pluginIndex");
      dir = cidx < idx ? Plugin.LEFT_TO_RIGHT : Plugin.RIGHT_TO_LEFT;
    } else { dir = Plugin.RIGHT_TO_LEFT; }
    leftAdjust = this._leftAdjustmentForAppend(dir, frame);
    this.disableAnimation();
    this.set("layout", { height: height, width: width, top: top, left: leftAdjust });
    this.updateLayout();
    this.set("isShowing", YES);
    this.enableAnimation();
    if(curr) curr.remove(dir);
    this.adjust("left", 0);
    Plugin.Controller.pluginDidGetFocus(this._plugin);
  },

  /** @private */
  _cleanup: function() {
    XT.BASE_PANE.removeChild(this);
  },

  /** @private */
  _leftAdjustmentForRemove: function(direction, frame) {
    if(direction === Plugin.LEFT_TO_RIGHT) {
      return (frame.width+100);
    } else { return 0-(frame.width+100); }
  },

  /** @private */
  _leftAdjustmentForAppend: function(direction, frame) {
    if(direction === Plugin.LEFT_TO_RIGHT) {
      return 0-(frame.width+100);
    } else { return (frame.width+100); }
  }
   
}) ;
