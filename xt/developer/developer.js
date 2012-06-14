
// cluster fuck of developer aids...
enyo.kind(
  /** */ {

  name: "XT.DeveloperUI",
  
  kind: "Slideable",
  
  unit: "%",
  
  min: -100,
  
  value: -100,
  
  touch: true,
    
  components: [
      { classes: "developer-rows", kind: "FittableRows", components: [
        { classes: "row", kind: "onyx.Toolbar", content: "Quick Swap Datasource" },
        { classes: "row", kind: "onyx.InputDecorator", components: [
          { name: "url", kind: "onyx.Input", placeholder: "Hostname" } ] },
        { classes: "row", kind: "onyx.InputDecorator", components: [
          { name: "port", kind: "onyx.Input", placeholder: "Port" } ] },
        { classes: "row", kind: "onyx.Button", name: "apply", content: "Apply" }] },
      { kind: "onyx.Grabber", classes: "developer-grabber" }
  ],
  
  tap: function(inSender, inEvent) {
    var originator = inEvent.originator;
    
    if (originator.name === "apply") {
      XT.dataSource.setDatasourceUrl(this.$.url.getValue());
      XT.dataSource.setDatasourcePort(this.$.port.getValue());
      XT.dataSource.reset();
      
      
    }
  },
  
  create: function() {
    this.inherited(arguments);
  },
  
  rendered: function() {
    this.inherited(arguments);
    
    this.$.url.setValue(XT.dataSource.getDatasourceUrl());
    this.$.port.setValue(XT.dataSource.getDatasourcePort());
  },
  
  classes: "developer-ui-container enyo-unselectable onyx"
    
});