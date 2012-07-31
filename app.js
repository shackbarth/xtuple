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
      { name: "pullout", kind: "enyo.Slideable", classes: "pullout",
        value: -100, min: -100, unit: '%', components: [
        {name: "shadow", classes: "pullout-shadow"},
        {name: "grabber", kind: "onyx.Grabber", classes: "pullout-grabbutton"},
        {kind: "FittableRows", classes: "enyo-fit", components: [
          {name: "client", classes: "pullout-toolbar"},
          {name: "pulloutItems", fit: true, style: "position: relative;", components: [
            {name: "history", kind: "FittableRows", showing: false, classes: "enyo-fit", components: [
              {kind: "onyx.RadioGroup", classes: "history-header", components: [
                {content: "Saved", active: true},
                {content: "Recents"}
              ]},
              {fit: true, kind: "Scroller", classes: "history-scroller", components: [
                {kind: "List", onItemSelect: "itemSelect"}
              ]}
            ]}
          ]}
        ]}
      ]}
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
        this.$.pulloutItems.createComponent(pulloutItems[i]);
      }
    },
    handlePullout: function (inSender, inEvent) {
      var showing = inSender.$.container.getActive().showPullout || false;
      this.$.pullout.setShowing(showing);
    },
    parameterDidChange: function (inSender, inEvent) {
      this.$.postbooks.waterfall("onParameterChange", inEvent);
    },
    togglePullout: function (inSender, inEvent) {
      var pullout = this.$.pullout,
        item = this.$.pulloutItems.$[inEvent.name],
        children = this.$.pulloutItems.children,
        i;
      if (item.showing && pullout.isAtMax()) {
        pullout.animateToMin();
      } else {
        pullout.animateToMax();
        for (i = 0; i < children.length; i++) {
          children[i].hide();
        }
        item.show();
        item.resized();
      }
    },
    start: function () {
    
      if (this.getIsStarted()) { return; }
    
      // on application start, connect the datasource
      XT.dataSource.connect();
    
      // now that we've started, we need to render something
      // to the screen
      // TODO: is this really where this belongs?
      this.renderInto(document.body);
    
      // lets not allow this to happen again
      this.setIsStarted(true);
    }
  });

}());