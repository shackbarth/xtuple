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
      onTogglePullout: "togglePullout"
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
      var pulloutItems = this._pulloutItems || [],
        i;
      for (i = 0; i < pulloutItems.length; i++) {
        this.$.pullout.$.pulloutItems.createComponent(pulloutItems[i]);
      }
    },
    handlePullout: function (inSender, inEvent) {
      var showing = inSender.$.container.getActive().showPullout || false;
      this.$.pullout.setShowing(showing);
    },
    parameterDidChange: function (inSender, inEvent) {
      this.$.postbooks.$.container.getActive().waterfall("onParameterChange", inEvent);
    },
    togglePullout: function (inSender, inEvent) {
      this.$.pullout.togglePullout(inEvent.name);
    },
    start: function () {
    
      if (this.getIsStarted()) { return; }
    
      // on application start, connect the datasource
      XT.dataSource.connect();
    
      // lets not allow this to happen again
      this.setIsStarted(true);
    },
    show: function () {
      if (this.getShowing() && this.getIsStarted())
        this.renderInto(document.body);
      else this.inherited(arguments);
    }
  });
}());