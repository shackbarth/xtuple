
enyo.kind({
  name: "XV.ScreenCarousel",
  kind: "Panels",
  classes: "xt-screen-carousel enyo-unselectable",
  draggable: false,
  published: {
    currentView: "",
    carouselEvents: null
  },
  previousView: "",
  currentViewChanged: function () {
    var children = this.children;
    var viewName = this.getCurrentView();
    var view = this.$[viewName];
    var idx = children.indexOf(view);
    var prev = this.previousView;

    //this.log(this.name, "currentViewChanged", viewName);

    if (idx === -1) {

      this.log(this.name, "Could not find requested view %@".f(viewName), this.children, view, this.$);

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
  create: function () {

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
  dispatch: function () {
    //this.log(this.name, arguments);
    this.inherited(arguments);
  },
  handleCarouselEvent: function (inSender, inEvent) {
    var carouselEvents = this.getCarouselEvents();
    var evt = inEvent.eventName;
    var viewName = carouselEvents[evt];

    if (viewName) {
      this.setCurrentView(viewName);
      // allow a payload to be attached to the event. This
      // payload will be sent down to the view that's being
      // rendered
      var view = this.$[viewName];
      if(inEvent.options && view && view.setOptions) {
        view.setOptions(inEvent.options);
      }
    }

    // we got this, stop bubbling
    return true;
  },
  indexChanged: function () {
    this.inherited(arguments);
  },
  completed: function () {
    var active;

    this.inherited(arguments);
    active = this.getActive();
    if (active && active.didBecomeActive) {
      active.didBecomeActive();
    }
	}
});
