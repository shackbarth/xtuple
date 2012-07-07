/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true*/
/*global XT:true, enyo:true, Globalize:true */

(function () {
  //"use strict";

  enyo.kind({
    name: "XT.ScreenCarousel",
    kind: "Panels",
    classes: "xt-screen-carousel enyo-unselectable",
    draggable: false,
    published: {
      currentView: "",
      currentModel: null,
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


      // SH:addCode
      if (this.getCurrentModel()) {
        this.addPanel(this.getCurrentModel());

      } else /* /SH:addCode */ if (idx === -1) {



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
    addPanel: function (model) {
      var i = this.getPanels().length;
      var workspace = this.createComponent({ kind: "XT.Workspace" });
      workspace.setModel(model);
      //var p = this.createComponent({ tag: "div", content: JSON.stringify(model.toJSON()) });
      workspace.render();
      this.reflow();
      this.setIndex(i);
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
}());
