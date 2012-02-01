/**
  The following is an attempt to create an exhaustive normalized API for the
  xTuple Sproutcore client application for scrolling. Elements that wish to
  scroll must be appropriately designed to make use of this mixin and its
  features. Some devices may not support some of the features (cannot be
  overcome in most cases) but most support a minimal set of features that will
  still make this mixin useful.

  Use-cases for this mixin have not yet been written.

  Documentation for this mixin have not yet been written.

  It is still under heavy development.
*/

// THIS WILL NEED TO CHANGE!!!!
// CS = XT.CS = SC.Object.create({ NAMESPACE: "CScroll", VERSION: "0.0.1" });
// 
// /**
//   For browsers that support addEventListener.
// */
// CS.ADD = function(elem, eventName, callback) {
//   var capture = arguments.length > 3 ? arguments[ 3 ] : false;
//   if(elem.addEventListener)
//     elem.addEventListener(eventName, callback, capture);
// };
// 
// /**
//   For browsers that support attachEvent.
// */
// CS.ATT = function(elem, eventName, callback) {
//   if(elem.attachEvent)
//     elem.attachEvent(eventName, callback);
// };
// 
// /**
//   For browsers that support removeEventListener.
// */
// CS.REM = function(elem, eventName, callback) {
//   if(!elem) return;
//   var capture = arguments.length > 3 ? arguments[ 3 ] : false;
//   if(elem.removeEventListener)
//     elem.removeEventListener(eventName, callback, capture);
// };
// 
// /**
//   For browsers that support detachEvent.
// */
// CS.DET = function(elem, eventName, callback) {
//   if(elem.detachEvent)
//     elem.detachEvent(eventName, callback);
// };
// 
// /**
//   For browsers that support preventDefault.
// */
// CS.PREV = function(e) {
//   if(e.preventDefault) e.preventDefault();
//   if(e.stopPropagation) e.stopPropagation();
// };
// 
// /**
//   The following are a growing collection of browser-specific events
//   that at some point needed to be addressed. While it is always a goal
//   to avoid browser-specific code it is IMPOSSIBLE when needing to
//   retrieve mouse events.
// 
//   Also note that this mixin currently relies on jQuery's `browser`
//   element based on the browser's `navigator` presentation. This is not
//   safe in some cases but should be fine here unless a more suitible and
//   dependable method is devised.
// */
// 
// // events container
// CS.EVENTS = {};
// 
// // mozilla firefox
// CS.EVENTS.mozilla = {
// 
//   // add/remove event 
//   add: CS.ADD,
//   remove: CS.REM,
// 
//   // prevent event
//   prevent: CS.PREV,
// 
//   // event types
//   // scroll: "DOMMouseScroll",
//   scroll: "MozMousePixelScroll",
//   MozMousePixelScroll: "scroll",
// 
//   resize: "resize",
// 
//   // retrieve delta
//   delta: function(e) {
//     return -1 * parseInt(e.detail);
//   },
// };
// 
// // safari
// CS.EVENTS.safari = {
// 
//   // add/remove event
//   add: CS.ADD,
//   remove: CS.REM,
// 
//   // prevent event
//   prevent: CS.PREV,
// 
//   // event types
//   scroll: "mousewheel",
//   mousewheel: "scroll",
// 
//   resize: "resize",
// 
//   // retrieve delta
//   delta: function(e) {
//     return parseInt(e.wheelDeltaY);
//   },
// };
// 
// // webkit and safari are the same so this includes chrome
// CS.EVENTS.webkit = CS.EVENTS.safari;
// 
// // msie
// CS.EVENTS.msie = {
// 
//   // add/remove event
//   add: CS.ADD,
//   remove: CS.REM,
// 
//   // prevent event
//   prevent: CS.PREV,
// 
//   scroll: "mousewheel",
//   mousewheel: "scroll",
// 
//   resize: "resize",
// 
//   // retrieve delta
//   delta: function(e) {
//     return parseInt(e.wheelDeltaY);
//   },
// };
// 
// /**
//   The mixin.
// */
// CS.CScroll = {
// 
//   //.........................................
//   //  Default Properties
//   //
//   
//   _cs_isRegistered: NO,
// 
//   //.........................................
//   // Computed Properties
//   //
// 
//   //.........................................
//   // Public methods
//   //
//   
//   /** @public
//     Call this method if you need to manually register
//     for scroll events.
//   */
//   _cs_register: function(dom) {
//     
//     // if in error state do nothing
//     if(this._cs_error_state) return;
//     
//     if(this._cs_isRegistered) return;
// 
//     var events = this._cs_events, self = this,
//       dom = dom ? this.$(dom)[ 0 ] : events.target();
// 
//     if(!dom) {
//       this._cs_warn("could not register for => %@ dom did not exist".fmt(this.get("_xt_id")));
//       return;
//     }
// 
//     // if there isn't a handler defined, use the default
//     if(!events.handler)
//       events.handler = function(e) { CS.DEFAULT_HANDLER.call(self, e); };
// 
//     this._cs_warn("registering for => %@".fmt(events.scroll));
// 
//     // register the scroll event
//     events.add(dom, events.scroll, events.handler, this._cs_capture ? true : false);
// 
//     // register the resize event on the window
//     events.add(window, events.resize, events.handler, this._cs_capture ? true : false);
//     
//     this._cs_isRegistered = YES;
//   },
// 
//   /** @public
//     Call this method if you need to manually unregister
//     for scroll events.
//   */
//   _cs_unregister: function(dom) {
//     
//     // if in error state do nothing
//     if(this._cs_error_state) return;
// 
//     var events = this._cs_events,
//       dom = dom ? this.$(dom)[ 0 ] : events.target();
// 
//     this._cs_warn("unregistering for => %@".fmt(events.scroll));
// 
//     // unregister the scroll event
//     events.remove(dom, events.scroll, events.handler, this._cs_capture ? true : false);
// 
//     // unregister the resize event on the window
//     events.remove(window, events.resize, events.handler, this._cs_capture ? true : false);
//     
//     this._cs_isRegistered = NO;
//   },
// 
//   //.........................................
//   // Private/Internal Methods
//   //
// 
//   /** @private */
//   initMixin: function() {
// 
//     // what type of browser do we have
//     var browser = this._cs_keys_for(jQuery.browser)[ 0 ], self = this;
// 
//     this.warn("found to be browser type => %@".fmt(browser));
// 
//     // store this info for later
//     this._cs_browser_type = browser;
// 
//     // store the events type from the browser type
//     this._cs_events = SC.clone(CS.EVENTS[ browser ]);
// 
//     // if there aren't any, we can't do jack...
//     if(!this._cs_events) {
//       this._cs_warn("can't handle events for browser => %@".fmt(browser));
//       this._cs_error_state = YES;
//     } else { this._cs_error_state = NO; }
// 
//     // try and grab the necessary target element to scroll
//     this._cs_events.target = function() {
//       var t = self.get("scrollTarget");
//       return self.$(t)[0];
//       //return self.$("#" + self.get("scrollTarget"))[ 0 ];
//     };
// 
//   },
// 
//   //.........................................
//   // Other
//   //
// 
//   /** @private
//     Retrieve the top-level property `keys` for an object.
//   */
//   _cs_keys_for: function(o) {
//     if(o) {
//       var keys = [];
//       for(var key in o)
//         if(o.hasOwnProperty(key))
//           keys.push(key);
//       return keys.length > 0 ? keys : NO;
//     } else { return NO; }
//   },
// 
//   /** @private
//     Log a warning to console with correct prefix.
//   */
//   _cs_warn: function(msg) {
//     console.warn("CScroll (%@): %@".fmt(this.get("_xt_id"), msg));
//   },
// 
// };
// 
// /**
//   Default handler for CScroll handling of scroll and related events.
// */
// CS.DEFAULT_HANDLER = function(e) {
// 
//   var events = this._cs_events;
// 
//   // prevent default action of event
//   // and stop all propagation/bubbling
//   events.prevent(e); 
// 
//   // grab the type of event
//   var type = events[ e.type ] || e.type;
// 
//   // @note This is tricky only because the browsers
//   //    denote the event type differently so we have to
//   //    work backwards
// 
//   // try and figure out what event category it is
//   
//   // @note Went ahead and added the explicit inverse
//   //    so that this doesn't need to be determined via
//   //    calculations and can instead be directly indexed
//   //    for speed
//   if(CS[ type ]) {
//     CS[ type ].call(this, e);
//   } else { this._cs_warn("could not handle event of type => %@".fmt(type), YES); }
// };
// 
// CS.scroll = CS.DEFAULT_SCROLL_HANDLER = function(e) {
// 
//   var events = this._cs_events;
// 
//   // grab delta and the element and parent
//   var delta = events.delta(e);
// 
//   // in an attempt to alleviate the need to calculate things we
//   // do not need on each event, offload it to the corresponding
//   // method
// 
//   // determine if we are scrolling up or down
// 
//   if(delta < 0)
// 
//     // we are scrolling up (see more from bottom)
//     // CS.DEFAULT_HANDLER_UP.call(this, elem, _parent, delta, offset);
//     CS.DEFAULT_HANDLER_UP.call(this, delta);
// 
//   else
// 
//     // we are scrolling down (see more from top)
//     // CS.DEFAULT_HANDLER_DOWN.call(this, elem, _parent, delta, offset);
//     CS.DEFAULT_HANDLER_DOWN.call(this, delta);
// 
// };
// 
// CS.DEFAULT_HANDLER_UP = function(delta) {
// 
//   var events = this._cs_events, elem = events.target(),
//     offset = this.offset();
// 
//   // calculate the vertical value of the bottom of the parent container
//   // to determine whether or not we can scroll
//   var floor = this.parentBottom();
// 
//   // calculate the vertical value of the bottom of the scroll container
//   // to determine how much is visible
// 
//   var height = this.height(), bottom = this.bottom();
// 
//   // this.log("delta => %@ offset => %@ floor => %@ height => %@ bottom => %@ original => %@".fmt(
//   //    delta, offset, floor, height, bottom, this._cs_original_offset), YES);
// 
//   // if the bottom is greater than the floor value, allow the scroll
//   if(bottom > floor) {
// 
//     if((delta + offset + height) < floor) {
//       
//       // arbitrarily move it so it is at the bottom
//       // elem.style.top = (floor - height) + "px";
//       this.scrollTo(floor - height);
//     }
// 
//     else {
// 
//       // move the top to the new location
//       // elem.style.top = (delta + offset) + "px";
//       this.scrollTo(delta + offset);
//     }
//   }
// 
// };
// 
// CS.DEFAULT_HANDLER_DOWN = function(delta) {
// 
// 
//   // grab the original offset for comparitive purposes
//   var events = this._cs_events, _orig = this._cs_original_offset,
//     offset = this.offset(), elem = events.target();
// 
//   // if the offset is less than the original offset, we can scroll until
//   // they are equal
//   
//   // this.log("original offset => %@".fmt(_orig));
// 
//   if(offset < _orig)
// 
//     // make sure that if the move would put us past the original position
//     // we arbitrarily set it
//     if((offset + delta) > _orig)
// 
//       // move it to the original position and be done with it
//       // elem.style.top = _orig + "px";
//       this.scrollTo(_orig);
// 
//     else
// 
//       // move it because it should be ok
//       // elem.style.top = (delta + offset) + "px";
//       this.scrollTo(delta + offset);
// 
// };
// 
// CS.resize = CS.DEFAULT_RESIZE_HANDLER = function(e) {
//   
//   var events = this._cs_events;
// 
//   // regardless we have to calculate this...
//   // in the future it would be great to have time to revisit this
// 
//   // easiest thing to do is start at the top...
// 
//   // grab the element and the offset
//   var elem = events.target(), offset = this.offset();
// 
//   // if the offset does not equal the original offset position
//   // we have something to do
//   if(offset !== this._cs_original_offset) {
// 
//     // unfortunately to really do this even `ok` we need to know
//     // what direction the resize is (contracting, expanding) vertically
// 
//     // if there is no previous value stored, create one based on
//     // current window size calc and be done
//     if(!this._cs_window_size) {
//       this._cs_window_size = this.windowSize();
//       return;
//     }
// 
//     var last = this._cs_window_size, size = this.windowSize();
// 
//     // if they are equal it means there was no vertical change
//     if(last === size) return;
// 
//     // determine if we're expanding or contracting
//     var direction = last > size ? CS.contracting : CS.expanding;
// 
//     // go ahead and let the appropriate function do the rest
//     // of the calculations and work
//     direction.call(this, last, size);
// 
//     // set the last value to the current one for next event
//     this._cs_window_size = size;
// 
//   }
// 
// };
// 
// 
// // @todo Determine if it is more efficient to use Sproutcore's
// //  viewDidResize event and if so is it reliable?
// 
// /**
//   Handles scenarios where there was a scroll position (not origin)
//   and the window resized. Just need to determine if it affected
//   us or not and if so how to appropriately respond.
// */
// CS.contracting = CS.RESIZE_CONTRACTING = function() {
//   
//   // @note Currently there is no support for additional
//   //    functionality during a window contracting but in the
//   //    future there should be and that is why this is here
//    
// };
// 
// /**
//   Handles scenarios where there is a scroll position (not origin)
//   and the window resized. Just need to determine if it iaffected
//   us or not and if so how to appropriately respond.
// */
// CS.expanding = CS.RESIZE_EXPANDING = function() {
// 
//   // if we are scroll up at all and we're expanding (and we are...)
//   if(this.scrollPosition() < 0) {
// 
//     var floor = this.parentBottom(), bottom = this.bottom();
// 
//     if(bottom > floor) return;
// 
//     // calculate new position based on the bottom of the parent
//     // minus our scrolling element's height
//     var pos = this.parentBottom() - this.height();
// 
//     // exception is if pos is now greater than the original position
//     if(pos > this._cs_original_offset)
//       pos = this._cs_original_offset;
// 
//     // move the bottom of the element to the bottom of the parent
//     // while the screen is expanding will release automatically
//     // when the top is even
//     this.scrollTo(pos);
//   }
// 
// };
// 
// 
// 
// //..........................................
// // Internal Helper Functions
// //
// 
// CS.CScroll._parent = function() {
//   var events = this._cs_events;
//   return events.target().parentNode;
// };
// 
// CS.CScroll.parentBottom = function() {
//   return this.parentOffset() + this.parentHeight();
// };
// 
// CS.CScroll.parentOffset = function() {
//   return this.$(this._parent()).position().top;
// };
// 
// CS.CScroll.parentHeight = function() {
//   return this.$(this._parent()).height();
// };
// 
// CS.CScroll.parentWidth = function() {
//   return this.$(this._parent()).width();
// };
// 
// CS.CScroll.height = function() {
//   var events = this._cs_events;
//   return this.$(events.target()).height();
// };
// 
// CS.CScroll.windowSize = function() {
//   return $(window).height();
// };
// 
// CS.CScroll.offset = function() {
//   var events = this._cs_events;
//   return this.$(events.target()).position().top;
// };
// 
// CS.CScroll.bottom = function() {
//   var events = this._cs_events;
//   return this.offset() + this.$(events.target()).height();
// };
// 
// CS.CScroll.scrollPosition = function() {
//   return -1 * (this._cs_original_offset - this.offset());
// };
// 
// CS.CScroll.scrollTo = function(pos) {
//   var events = this._cs_events;
//   events.target().style.top = pos + "px";
// };
