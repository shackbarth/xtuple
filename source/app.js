/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, document:true */

(function () {

  enyo.kind({
    name: "App",
    fit: true,
    classes: "xt-app enyo-unselectable",
    published: {
      isStarted: false
    },
    handlers: {
      onListAdded: "addPulloutItem",
      onModelChange: "modelChanged",
      onParameterChange: "parameterDidChange",
      onNavigatorEvent: "togglePullout",
      onHistoryChange: "refreshHistoryPanel",
      onHistoryItemSelected: "selectHistoryItem",
      onAnimateProgressFinish: "dataLoaded"
    },
    components: [
      { name: "postbooks", kind: "XV.Postbooks",  onTransitionStart: "handlePullout" },
      { name: "pullout", kind: "XV.Pullout", onAnimateFinish: "pulloutAnimateFinish" }
    ],
    addPulloutItem: function (inSender, inEvent) {
      var item = {
        name: inEvent.name,
        showing: false
      };
      if (inEvent.getParameterWidget) {
        item.kind = inEvent.getParameterWidget();
      }
      if (item.kind) {
        if (this._pulloutItems === undefined) {
          this._pulloutItems = [];
        }
        this._pulloutItems.push(item);
      }
    },
    create: function () {
      this.inherited(arguments);
      var pulloutItems = this._pulloutItems || [],
        item,
        i;
      for (i = 0; i < pulloutItems.length; i++) {
        item = pulloutItems[i];
        item.container = this.$.pullout.$.pulloutItems;
        this.$.pullout.createComponent(item);
      }
      XT.app = this;
    },
    getPullout: function () {
      return this.$.pullout;
    },
    handlePullout: function (inSender, inEvent) {
      var showing = inSender.getActive().showPullout || false;
      this.$.pullout.setShowing(showing);
    },
    modelChanged: function (inSender, inEvent) {
      this.$.postbooks.waterfall("onModelChange", inEvent);
    },
    parameterDidChange: function (inSender, inEvent) {
      if (this.getIsStarted()) {
        this.$.postbooks.getNavigator().waterfall("onParameterChange", inEvent);
      }
    },
    /**
     * Manages the "lit-up-ness" of the icon buttons based on the pullout.
     * If the pull-out is put away, we want all buttons to dim. If the pull-out
     * is activated, we want the button related to the active pullout pane
     * to light up. The presentation of these buttons take care of themselves
     * if the user actually clicks on the buttons.
     */
    pulloutAnimateFinish: function (inSender, inEvent) {
      var activeIconButton;

      if (inSender.value === inSender.max) {
        // pullout is active
        if (this.$.pullout.getSelectedPanel() === 'history') {
          activeIconButton = 'history';
        } else {
          activeIconButton = 'search';
        }
      } else if (inSender.value === inSender.min) {
        // pullout is inactive
        activeIconButton = null;
      }
      this.$.postbooks.getNavigator().setActiveIconButton(activeIconButton);
    },
    refreshHistoryPanel: function (inSender, inEvent) {
      this.$.pullout.refreshHistoryList();
    },
    /**
      When a history item is selected we bubble an event way up the application.
      Note that we create a sort of ersatz model to mimic the way the handler
      expects to have a model with the event to know what to drill down into.
    */
    selectHistoryItem: function (inSender, inEvent) {
      XT.log("Load from history: " + inEvent.workspace + " " + inEvent.id);
      inEvent.eventName = "onWorkspace";
      this.waterfall("onWorkspace", inEvent);
    },
    dataLoaded: function () {
      // Initialize extensions
      if (this._dataLoaded) { return; }
      this._dataLoaded = true;
      var prop,
        ext,
        extprop;
      for (prop in XT.extensions) {
        if (XT.extensions.hasOwnProperty(prop)) {
          ext = XT.extensions[prop];
          for (extprop in ext) {
            if (ext.hasOwnProperty(extprop) &&
                typeof ext[extprop] === "function") {
              XT.log('Installing ' + prop + ' ' + extprop);
              ext[extprop]();
            }
          }
        }
      }
      
      // Go to the navigator
      XT.app.$.postbooks.next();
      XT.app.$.postbooks.getNavigator().activate();
    },
    start: function () {
      if (this.getIsStarted()) { return; }
      XT.app = this;

      // on application start, connect the datasource
      var startupManager = XT.getStartupManager(),
        progressBar = XT.app.$.postbooks.getStartupProgressBar(),
        eachCallback = function () {
          var completed = startupManager.get('completed').length;
          progressBar.animateProgressTo(completed);
        };
      startupManager.registerCallback(eachCallback, true);
      XT.dataSource.connect();
      progressBar.setMax(startupManager.get('queue').length +
        startupManager.get('completed').length);

      // lets not allow this to happen again
      this.setIsStarted(true);
    },
    show: function () {
      if (this.getShowing() && this.getIsStarted()) {
        this.renderInto(document.body);
      } else {
        this.inherited(arguments);
      }
    },
    togglePullout: function (inSender, inEvent) {
      this.$.pullout.togglePullout(inSender, inEvent);
    }
  });
}());
