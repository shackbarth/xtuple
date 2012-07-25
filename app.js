
enyo.kind({
  name: "App",
  fit: true,
  classes: "xt-app enyo-unselectable",
  published: {
    isStarted: false
  },
  components: [
    { name: "postbooks", kind: "XV.Postbooks",  onTransitionStart: "handlePullout" },
    { name: "pullout", kind: "enyo.Slideable", classes: "pullout",
      value: -100, min: -100, unit: '%', components: [
      {name: "shadow", classes: "pullout-shadow"},
      {kind: "onyx.Grabber", classes: "pullout-grabbutton"},
      {kind: "FittableRows", classes: "enyo-fit", components: [
        {name: "client", classes: "pullout-toolbar"}
      ]}
    ]}
  ],
  create: function () {
    this.inherited(arguments);
  },
  handlePullout: function (inSender, inEvent) {
    var showing = inSender.$.container.getActive().showPullout || false;
    this.$.pullout.setShowing(showing);
  },
  start: function () {
    
    if (this.getIsStarted()) return;
    
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