
enyo.kind({
  name: "App",
  fit: true,
  classes: "xt-app enyo-unselectable",
  published: {
    isStarted: false
  },
  components: [
    { name: "postbooks", kind: "XV.Postbooks" }
  ],
  create: function() {
    this.inherited(arguments);
  },
  start: function() {
    
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