
/*globals XT */

sc_require("views/nested_image");

/** @class
  
  Provids a useful-reuseable tool to have state-mutable images. It
  also provides a fairly general mechanism by which animations can
  be managed for the image as well.

  Features the ability to have a dual-state sliced image with appropriate
  CSS provided. Also features the ability to define 2 different animation
  series on active state change.

  For now, the required CSS has to take a someone tedious form. Hopefully
  this can change in the future. 

  @todo Complete the documentation for this class and add examples on
    how to use since it is not immediately obvious.

*/
XT.StatusImageView = XT.View.extend(SC.Animatable,
  /** @scope XT.StatusImageView.prototype */ {
  
  /** 
    Default layout is for a 64x64 pixel icon (png).

    @property
    @type {Hash}
  */
  layout: { height: 64, width: 64, centerY: 0 },

  /** 
    The CSS class to use as the `value` property for the child XT.NestedImageView

    @see XT.NestedImageView

    @propery
    @type {String}
  */
  imageClass: "",

  /**
    The layout hash for the child XT.NestedImageView. Defaults to the
    full scale of the XT.StatusImageView and in most cases should
    remain this way unless you are extending this for an additional
    use-case.

    @property
    @type {Hash}
  */
  imageLayout: { top: 0, left: 0, right: 0, bottom: 0 },

  /**
    The default, starting state of the XT.StatusImageView.

    @property
    @type {Boolean}
  */
  isActive: NO,

  /**
    Default transitions to define how differen transitions will be
    handled when requested. Unless there is an exception to the rule
    these should remain the same so as to remain consistent across the
    application (same types of fades, same types of smoothing, etc.).

    @property
    @type {Hash}
  */
  transitions: {
    opacity:    { duration: .08, timing: SC.Animatable.TRANSITION_CSS_EASE },
    centerX:    { duration: .08, timing: SC.Animatable.TRANSITION_CSS_EASE },
    centerY:    { duration: .08, timing: SC.Animatable.TRANSITION_CSS_EASE },
    top:        { duration: .08, timing: SC.Animatable.TRANSITION_CSS_EASE },
    bottom:     { duration: .08, timing: SC.Animatable.TRANSITION_CSS_EASE },
    left:       { duration: .08, timing: SC.Animatable.TRANSITION_CSS_EASE },
    right:      { duration: .08, timing: SC.Animatable.TRANSITION_CSS_EASE },
    height:     { duration: .08, timing: SC.Animatable.TRANSITION_CSS_EASE },
    width:      { duration: .08, timing: SC.Animatable.TRANSITION_CSS_EASE }
  },

  /** 
    Animations are defined on this property and is a hash with up to
    2 possible properties, `active`, `inactive` that will be used when
    the appropriate event takes place. Each property of the hash is an
    array of conventional options that are available and will be executed
    in the order in which they are inserted (top = first, FIFO).

    The options available are

      property          - the property being modified
      value             - the value the property should be set to
      disableAnimation  - for actions that require animation to be disabled first,
                          set this to YES
      enableAnimation   - if animation has been turned off but needs to be re-enabled
                          prior to further execution set this to YES
      set               - all properties will be modified using the `adjust` method
                          unless this is flagged as YES in which case `set` will be
                          used instead of `adjust` (ex. isVisible should use `set`)
      immediate         - will be executed followed by an `updateStyle` call                                                        
      wait              - the number of milliseconds to make the action wait before
                          being executed (relies on invokeLater)
      complete          - if set to YES the action will take place after the longest
                          wait time calculated is observed, should be the last action
                          specified otherwise results will be unknown
      reset             - reset can be set to YES on the complete task and an additional
                          task will be executed after the completion task to reset the
                          object to its original state (in cases where animation is
                          reused)
  
    @property
    @type {Hash}
  */
  animations: {},

  //.......................................................
  // Calculated Properties
  //

  /** @private */
  animationKeys: function() {
    return XT.keysFor(this.get("animations"));
  }.property("animations").cacheable(),

  //.......................................................
  // Private Properties
  //

  /** @private */
  _activateOnVisibilityChange: NO,

  /** @private */
  _imageView: null,

  /** @private */
  _hasActiveClass: NO,

  /** @private */
  _longestWait: 50,

  //.......................................................
  // Private Methods
  //

  /** @private */
  createChildViews: function() {
    var view = this._imageView = this.createChildView(
      XT.NestedImageView, {
        layout: SC.clone(this.get("imageLayout")),
        value: this.get("imageClass")
      });
    this.childViews = [view];
    return this;
  },

  /** @private */
  _isActiveDidChange: function() {
    var ak = this.get("animationKeys"),
        iv = this.get("isVisible");

    // if an image becomes active but isn't visible we have to
    // wait until it is visible in order to make the required
    // css changes to it
    if(iv === YES) this._activate();
    else this._activateOnVisibilityChange = YES;
    if(ak.length > 0 && arguments[0] !== NO) this._activateAnimation();
  }.observes("isActive"),

  /** @private */
  _isVisibleDidChange: function() {
    var iv = this.get("isVisible"),
        oc = this._activateOnVisibilityChange;
    if(oc === YES && iv === YES) {
      this._activate();
      this._activateOnVisibilityChange = NO;
    }
  }.observes("isVisible"),

  /** @private */
  _activate: function() {
    var ia = this.get("isActive"),
        ha = this._hasActiveClass;
    if(ia === YES && ha === NO) {
      this.$().addClass("active");
      this._hasActiveClass = YES;
    }
    else if(ia === NO && ha === YES) {
      this.$().removeClass("active");
      this._hasActiveClass = NO;
    }
  },

  /** @private */
  _activateAnimation: function() {
    var ia = this.get("isActive") ? "active" : "inactive",
        ans = this.get("animations")[ia];
    if(!ans) return this.warn("Could not animate, no animations available for %@ status".fmt(ia));
    ans = ans.slice();

    while(ans.length > 0) {
      var opt = ans.shift();
      this._run(opt);
    }
  },

  /** @private */
  _run: function(opt) {
      var p = opt.property,
          v = opt.value,
          d = !! opt.disableAnimation,
          e = !! opt.enableAnimation,
          i = !! opt.immediate,
          w = opt.wait,
          s = !! opt.set,
          c = !! opt.complete,
          r = !! opt.reset,
          self = this;
      
      if(!isNaN(w) && w > 10)
        if(this._longestWait < w) this._longestWait = w;

      if(c || r) {
        delete opt.complete;
        delete opt.reset;
        opt.wait = this._longestWait;
        this._longestWait = 50;

        // @todo If this causes problems it will need to be reevaluated
        //  but it would seem ok since we have to make sure that any previous
        //  animations are complete before we run this (usually removes element
        //  from the dom, etc)
        var cleanup = function() {
          if(c) self.invokeLater(self._run, opt.wait, opt);
          if(r) self.invokeLater(self._reset, opt.wait + 100);
        };
        this.invokeLater(cleanup, 300);
        return;
      }

      // disable animation
      if(d) this.disableAnimation();
      
      // enable animation
      else if(e) 

        // seems to be necessary to get this to function properly
        if(isNaN(w) || w === 0 || w === NO) this.invokeLater(this.enableAnimation, 25);

        // to ensure that animation is enabled prior to any other waiting callback
        else this.invokeLater(this.enableAnimation, (Math.floor(w/2)));
      
      // in case it was a simple enable/disable
      if(SC.none(p) || SC.none(v))

        // or maybe just a global update request
        if(i) {
          this.updateStyle();
          return;
        } else { return; }

      // to use set or no
      if(s) this.set(p, v);

      // use adjust (default)
      else {

        // immediate
        if(i) this.adjust(p, v).updateStyle(); 

        // wait
        else if(!isNaN(w) && w > 10) this.invokeLater(this.adjust, w, p, v);

        // complete default
        else this.invokeLater(this.adjust, 50, p, v);
      }
  },

  /** @private
    @todo Verify that the `resetAnimations` method from the
      SC.Animatable mixin doesn't already do this! 
  */
  _reset: function() {
    var o = this._original,
        ks = XT.keysFor(o), k, v;
    this.beginPropertyChanges();
    for(var i; i<k.length; ++i) {
      k = ks[i];
      v = o[k];
      this.set(k, v);
    }
    this.endPropertyChanges();
    this.set("layerNeedsUpdate", YES);
  },

  /** @private */
  init: function() {
    
    // if isActive is YES from the start we need to evaluate it
    this._isActiveDidChange(NO);

    // need to make a copy so we can reset later
    var o = this._original = {};
    o.layout = SC.clone(this.get("layout"));
    o.isVisible = this.get("isVisible");
    o.isActive = this.get("isActive");

    sc_super();
  }

}) ;
