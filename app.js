
/**
*/
enyo.kind(
  /** */ {

  /** */
  name: "App",
  
  /** */
  fit: true,
  
  /** */
  classes: "enyo-unselectable",
  
  /** */
  published: {
    
    /** */
    isStarted: false
  },
  
  /** */
  components: [
    
    /** */
    { name: "postbooks", kind: "XT.Postbooks" }
  ],
  
  /** */
  create: function() {
    this.inherited(arguments);
    
    if (DEVELOPMENT_MODE) {
      this.createComponent({
        name: "developer",
        kind: "XT.DeveloperUI"
      });
    }
  },
  
  start: function() {
    
    if (this.getIsStarted()) {
      
      // nothing to re-start
      return;
    }
    
    // on application start, create a datasource we can use
    XT.dataSource = new XT.DataSource();
    
    // now that we've started, we need to render something
    // to the screen
    // TODO: is this really where this belongs?
    this.renderInto(document.body);
    
    // lets not allow this to happen again
    this.setIsStarted(true);
    
    
  }
    
});