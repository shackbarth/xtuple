
enyo.kind({
  name: "XT.ModuleMenuItem",
  classes: "xt-module-menu-item",
  published: {
    label: "",
    collectionType: "",
    listType: "",
    index: null
  },
  create: function() {
    this.inherited(arguments);
    
    var label = this.getLabel();
    this.setContent(label);
  },
  events: {
    onMenuItemTapped:""
  },
  tap: function(inSender, inEvent) {
    this.doMenuItemTapped(inEvent);
  }
});