
/*globals XT */

sc_require("views/view");

/** @class

  This is a prototype of what "could" be and avoids some of the
  more complex implementation possibilities for the sake of time
  immediately. In the future this should be fully implemented
  using caching and other safer, more efficient techniques
  to deliver the same results with better performance and fewer
  resources needed at runtime.

  @todo RESET AND COMPLETE DO NOT WORK YET!!!!

*/
XT.AnimationView = XT.View.extend(SC.Animatable,
  /** @scope XT.AnimationView.prototype */ {

  
  wait: NO,

  init: function() {
    var t = this.get("xtTransitions"),
        d = XT.ANIMATION_DEFAULT_TRANSITIONS,
        n = {};
    // console.warn("original transitions => ", t, " defaults => ", d);
    SC.mixin(n, d, t);
    // console.warn("new ones => ", n);
    this.set("transitions", n);
    this._processAnimationEvents();
    this._queue = [];
    return sc_super();
  },
  
  xtAnimate: function xtAnimate(eventName) {
    if(!eventName) return this.warn("No event given to xtAnimate");
    var e = this._getAnimationEvent(eventName);
    if(!e || e === NO)
      return this.warn("Could not find animation event %@".fmt(eventName));
    this._animate(e);    
  },

  _processAnimationEvents: function() {
    var e = this.get("xtAnimationEvents");
    if(!e || e.length <= 0) return;
    this._eventNames = XT.keysFor(e).compact();
  },

  _getAnimationEvent: function(event) {
    var events = this._eventNames;
    if(events.contains(event)) return this.xtAnimationEvents[event].slice();
    else return NO;
  },

  _animate: function(eventArray) {
    var e = eventArray, opt, r;
    while(e.length > 0) {
      opt = e.shift();
      r = this._run(opt); 
      if(!isNaN(r) && r > 10) {
        this.invokeLater(this._animate, r, e);
        break;
      }
    }
  },
    
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
          t = opt.start,
          zc = opt.call,
          zp = opt.path,
          self = this;

      if(t && !isNaN(t) && t > 10) {
        return t;
      }

      // @todo This was not finished! It does not accurately
      //   support pathing! Please finish me!
      if(zc) {

        if(SC.typeOf(zc) === SC.T_FUNCTION) {
          zc.call(this);
          return;
        }

        // this.warn("Using a call to another animation event");
        if(zp) {
          // this.warn("Using a remote path to object to animate");
          var zpt = SC.objectForPropertyPath(zp, this);
          zpt.xtAnimate(zc);
        } else { this.xtAnimate(zc); }
        return;
      }
      
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
        // if(isNaN(w) || w === 0 || w === NO) this.invokeLater(this.enableAnimation, 1);
        if(isNaN(w) || w === 0 || w === NO) {
          var disables = this._disableAnimation;
          for(; disables > 0; --disables)
            this.enableAnimation();
        }

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

        // if value is a function we need to execute it now
        if(SC.typeOf(v) === SC.T_FUNCTION) {
          v = v.call(this, opt);
        }

        // immediate
        if(i) this.adjust(p, v).updateStyle(); 

        // wait
        else if(!isNaN(w) && w > 10) this.invokeLater(this.adjust, w, p, v);

        // complete default
        else this.invokeLater(this.adjust, 50, p, v);
      }
  },

}) ;

XT.ANIMATION_DEFAULT_TRANSITIONS = {
  // opacity:    { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
  // centerX:    { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
  // centerY:    { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
  // top:        { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
  // bottom:     { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
  // left:       { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
  // right:      { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
  // height:     { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
  // width:      { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT }
};


