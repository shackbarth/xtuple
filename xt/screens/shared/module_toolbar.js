
enyo.kind(
  /** */ {

  /** */
  name: "XT.ModuleToolbar",
  
  /** */
  kind: "onyx.Toolbar",
  
  /** */
  create: function() {
    this.inherited(arguments);
    
    var owner = this.owner;
    var label = "%@ Module".f(enyo.cap(owner.name));
    
    this.$.label.setContent(label);
  },
  
  /** */
  components: [
    { name: "prevButton", kind: "XT.ModuleToolbarBackButton" },
    { name: "label" }
  ]
    
});

enyo.kind(
  /** */ {

  /** */
  name: "XT.ModuleToolbarBackButton",
  
  /** */
  kind: "onyx.Button",
  
  /** */
  published: {
    target: "dashboard"
  },
  
  /** */
  create: function() {
    this.inherited(arguments);
    
    // set 'er up right
    this.targetChanged();
  },
  
  /** */
  targetChanged: function() {
    var target = this.getTarget();
    this.setContent(enyo.cap(target));
  },
  
  /** */
  tap: function() {
    var target = this.getTarget();
    
    this.log("supposed to be bubbling", target);
    
    this.bubble(target, {eventName:target});
  }
    
});