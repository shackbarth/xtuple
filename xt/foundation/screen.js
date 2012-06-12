
enyo.kind(
  /** */ {

  /** */
  name: "XT.ScreenCarousel",
  
  /** */
  kind: "Panels",
  
  /** */
  fit: true,
  
  /** */
  classes: "onyx",
  
  /** */
  layoutKind: "CarouselArranger",
  
  /** */
  draggable: false,
  
  /** */
  arrangerKind: "CarouselArranger",
  
  /** */
  published: {
    
    /** */
    currentView: "",
    
    /** */
    carouselEvents: null
  },
  
  /** */
  previousView: "",
  
  /** */
  currentViewChanged: function() {
    var children = this.children;
    var viewName = this.getCurrentView();
    var view = this.$[viewName];
    var idx = children.indexOf(view);
    var prev = this.previousView;
    
    if (idx === -1) {
      
      // can't do anything if we can't find the requested
      // view, so return the currentView to the one it was
      // if any
      if (prev || prev === null) {
        this.currentView = prev;
      } else { this.currentView = null; }
    } else {
      
      // if the index is the same as the current view don't
      // do anything
      if (idx === this.getIndex()) {
        return;
      }
      
      // we found the view requested so go ahead and update
      this.previousView = viewName;
      this.setIndex(idx);
    }
  },
  
  /** */
  create: function() {
    
    // need to point any special carousel events to the
    // proper handler
    var carouselEvents = this.getCarouselEvents();
    var handlers = this.handlers;
    var evt;
    
    if (carouselEvents) {
    
      for (evt in carouselEvents) {
        if (carouselEvents.hasOwnProperty(evt)) {
          handlers[evt] = "handleCarouselEvent";
        }
      }
    }
    
    // carry on
    this.inherited(arguments);
  },
  
  /** */
  handleCarouselEvent: function(inSender, inEvent) {
    var carouselEvents = this.getCarouselEvents();
    var evt = inEvent.eventName;
    var viewName = carouselEvents[evt];
    
    if (viewName) {
      this.setCurrentView(viewName);
    }
    
    // we got this, stop bubbling
    return true;
  },
  
  /** */
	bubble: function(inEventName, inEvent, inSender) {
		var e = inEvent || {};
		// FIXME: is this the right place?
		if (!("originator" in e)) {
			e.originator = inSender || this;
			// FIXME: use indirection here?
			//e.delegate = e.originator.delegate || e.originator.owner;
		}
		
		if (!("eventName" in e)) {
      e.eventName = inEventName;
		}
		
		return this.dispatchBubble(inEventName, e, inSender);
	},
    
});