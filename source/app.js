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
      onInfoListAdded: "addPulloutItem",
      onParameterChange: "parameterDidChange",
      onTogglePullout: "togglePullout",
      onHistoryChanged: "refreshHistoryPanel",
      onHistoryItemSelected: "selectHistoryItem"
    },
    components: [
      { name: "postbooks", kind: "XV.Postbooks",  onTransitionStart: "handlePullout" },
      { name: "pullout", kind: "XV.Pullout" }
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
      var pulloutItems = this._pulloutItems || [], i;
      for (i = 0; i < pulloutItems.length; i++) {
        this.$.pullout.$.pulloutItems.createComponent(pulloutItems[i]);
      }
      XT.app = this;
    },
    handlePullout: function (inSender, inEvent) {
      var showing = inSender.$.container.getActive().showPullout || false;
      this.$.pullout.setShowing(showing);
    },
    parameterDidChange: function (inSender, inEvent) {
      this.$.postbooks.getActiveModule().waterfall("onParameterChange", inEvent);
    },
    togglePullout: function (inSender, inEvent) {
      this.$.pullout.togglePullout(inEvent.name);
    },
    refreshHistoryPanel: function (inSender, inEvent) {
      this.$.pullout.refreshHistoryList();
    },
    /**
     * When a history item is selected we bubble an event way up the application.
     * Note that we create a sort of ersatz model to mimic the way the handler
     * expects to have a model with the event to know what to drill down into.
     */
    selectHistoryItem: function (inSender, inEvent) {
      var module = inEvent.module;
      var modelId = inEvent.modelId;
      var modelType = inEvent.modelType;
      var modelShell = { recordType: modelType, id: modelId };
      XT.log("Load from history: " + modelType + " " + modelId);
      // XXX we don't apply the module because workspace is a peer to crm etc.
      // this might become a problem once we're in a true multimodule environment
      // where for example backing up from a CRM workspace really should land you
      // in the CRM module

      this.$.postbooks.getContainer().applyWorkspace(modelShell);
    },
    start: function () {

      if (this.getIsStarted()) { return; }

      // on application start, connect the datasource
      XT.dataSource.connect();

      // lets not allow this to happen again
      this.setIsStarted(true);
    },
    show: function () {
      if (this.getShowing() && this.getIsStarted()) {
        this.renderInto(document.body);
      } else {
        this.inherited(arguments);
      }
    }
  });
}());
