
/*globals Plugin */

sc_require("ext/common");

/** @class

  This the the defacto-standard base view for plugins. It is
  assumed that this will be the base-type (or extended from)
  for Plugin pages and views to work properly.
  
  @extends XT.View
  @inherits SC.Animatable
*/
Plugin.View = XT.PluginView = XT.View.extend(//SC.Animatable,
  /** @scope Plugin.View.prototype */ {

  //..........................................
  // Public Properties
  //

  layout: { top: 0, left: 0, right: 0, bottom: 0 },

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
    this._xt_notifyWillAppend();

    // this allows us to bind to the size of the current base pane
    // and its adjustments (window resize) and disconnect this
    // binding when the view is removed
    this._xt_basePaneFrameBinding = XT._baseFrameBinding(this);

    // tell the view to go ahead and make adjustments if
    // necessary now that it has changed
    this._xt_frameNeedsAdjust();

    // for development only so event will fire if issued from
    // the console!
    var self = this;
    SC.run(function() { self.invokeLater(self._xt_append, 10); });

    // real command!
    // this.invokeLater(this._xt_append, 10);
    return this;
  },

  /** @public
    Removes the view from the application making sure
    to animate it properly. Executes an asynchronous task.
  */
  remove: function(direction) {
    var bind = this._xt_basePaneFrameBinding;
    if(bind) bind.disconnect();

    var self = this;

    // for development only so event will fire if issued from
    // the console!
    SC.run(function() { self.invokeLater(self._xt_remove, 10, direction || Plugin.RIGHT_TO_LEFT); });

    // real command!
    // this.invokeLater(this._xt_remove, 10, direction || Plugin.RIGHT_TO_LEFT);
    return this;
  },

  /** @public
    @todo This needs serious attention as it is a little tricky but very important!
  */
  xtAnimate: function(e) {
    var anis = this.get("_xt_childAnimationEvents") || {};
    if(anis[e]) anis[e].xtAnimate(e);
    else this.warn("Could not find target childView for event %@".fmt(e));
    return YES;
  },

  //..........................................
  // Private Properties
  //

  /** @private */
  _index: null,

  /** @private */
  _plugin: null, 

  /** @private */
  _basePaneFrame: null,

  /** @private */
  // transitions: {
  //   left:   { duration: .25, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
  //   right:  { duration: .25, timing: SC.Animatable.TRANSITION_EASE_IN_OUT }
  // },

  /** @private */
  name: "Plugin.View",

  //..........................................
  // Observers
  //

  /** @private */
  _isShowingDidChange: function() {

  }.observes("isShowing"),

  /** @private */
  _xt_frameNeedsAdjust: function() {
    this._xt_adjustWidthToBaseFrame();
    this._xt_adjustHeightToBaseFrame();
  }.observes("*_basePaneFrame.height", "*_basePaneFrame.width"),

  //..........................................
  // Private Methods
  //

  /** @private */
  transitionDidEnd: function() {

    // when the transition ends from being removed, invoke this
    // asynchronous cleanup method
    if(!this.isShowing) this.invokeLater(this._xt_cleanup, 10);
    
    // we know that we are done now with being appended, let everyone
    // now we're in the DOM now
    else this.invokeLater(this._xt_notifyDidAppend, 100);
  },
  
  /** @private */
  _xt_remove: function(direction) {
    var frame = this.getPath("parentView.frame"),
        leftAdjust = this._xt_leftAdjustmentForRemove(direction, frame);
    this.set("isShowing", NO);
    this.adjust("left", leftAdjust); 
  },

  /** @private */
  _xt_append: function() {
    XT.BASE_PANE.appendChild(this);
    var curr = Plugin.Controller.get("_currentPlugin"),
        idx = this.get("_index"),
        paddingTop = this.get("topPadding"),
        paddingBottom = this.get("bottomPadding"),
        frame = this.getPath("parentView.frame"),
        height = (frame.height-(paddingTop+paddingBottom)),
        width = (frame.width),
        top = (~~((frame.height/2)-(height/2))),
        leftAdjust, cidx, dir, side;
    if(curr) {
      cidx = curr.get("pluginIndex");
      dir = cidx < idx ? Plugin.RIGHT_TO_LEFT : Plugin.LEFT_TO_RIGHT;
    } else { dir = Plugin.RIGHT_TO_LEFT; }
    leftAdjust = this._xt_leftAdjustmentForAppend(dir, frame);
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
  _xt_cleanup: function() {
    this._xt_notifyDidRemove();
    XT.BASE_PANE.removeChild(this);
  },

  /** @private */
  _xt_leftAdjustmentForRemove: function(direction, frame) {
    if(direction === Plugin.LEFT_TO_RIGHT) {
      return (frame.width+100);
    } else { return 0-(frame.width+100); }
  },

  /** @private */
  _xt_leftAdjustmentForAppend: function(direction, frame) {
    if(direction === Plugin.LEFT_TO_RIGHT) {
      return 0-(frame.width+100);
    } else { return (frame.width+100); }
  },

  /** @private */
  init: function() {
    arguments.callee.base.apply(this, arguments);
    var cvanis = this._xt_childAnimationEvents = {};
    this._xt_collectAnimationEvents(cvanis);
  }

}) ;
