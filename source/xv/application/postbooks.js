
enyo.kind({
  name: "XV.Postbooks",
  kind: "Panels",
  classes: "xt-postbooks enyo-unselectable",
  components: [
    { name: "container", kind: "XV.PostbooksContainer" }
  ],
  getContainer: function () {
    return this.$.container;
  },
  getActiveModule: function () {
    return this.getContainer().getActive();
  }
});

enyo.kind({
  name: "XV.PostbooksContainer",
  kind: "Panels",
  classes: "xt-postbooks-container enyo-unselectable",
  draggable: false,
  published: {
    currentView: "",
    carouselEvents: {
      crm: "crm",
      billing: "billing",
      setup: "setup",
      workspace: "workspace",
      dashboard: "dashboard",
      search: "search"
    }
  },
  components: [
    { name: "dashboard", kind: "XV.Dashboard" },
    { name: "crm", kind: "XV.Crm" },
    { name: "billing", kind: "XV.Billing" },
    { name: "setup", kind: "XV.Setup" },
    { name: "workspace", kind: "XV.WorkspaceContainer" },
    { name: "search", kind: "XV.Search" }
  ],
  previousView: "",
  getModuleByName: function (name) {
    return this.$[name];
  },
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
  handleCarouselEvent: function (inSender, inEvent) {
    var carouselEvents = this.getCarouselEvents(),
      evt = inEvent.eventName,
      viewName = carouselEvents[evt],
      previous = this.getActive().name;

    if (viewName) {
      this.setCurrentView(viewName);
      inEvent.previous = previous;
      this.$[viewName].waterfall("onPanelChange", inEvent);
    }

    // we got this, stop bubbling
    return true;
  },
  completed: function () {
    var active;

    this.inherited(arguments);
    active = this.getActive();
    if (active && active.activated) {
      active.activated();
    }
  }
    
});
