
enyo.kind({
  name: "XT.Dashboard",
  kind: "Control",
  classes: "xt-dashboard",
  components: [
    { name: "container", classes: "xt-dashboard-container", components: [
      { name: "icons", kind: "XT.DashboardIcons" } ]}
  ]
    
});

enyo.kind({
  name: "XT.DashboardIcons",
  classes: "xt-dashboard-icons",
  create: function() {
    this.inherited(arguments);
    
    var c$ = this.children.length;
    this.applyStyle("width", ((114 /*width*/ + 20 /*margin*/)*c$) + "px");
  },
  components: [
    { name: "crm", kind: "XT.DashboardIcon" },
    { name: "billing", kind: "XT.DashboardIcon" }
  ]
});

enyo.kind({
  name: "XT.DashboardIcon",
  kind: "Control",
  classes: "xt-dashboard-icon",
  tap: function() {
    var name = this.name;
    this.bubble(name, {eventName:name});
  },
  create: function() {
    this.inherited(arguments);
    
    // we derive the icon path from the name
    var name = this.name;
    var componentName = "%@Icon".f(name);
    
    // dynamically create the image component
    this.createComponent({
      name: componentName,
      kind: "Image",
      classes: "xt-dashboard-icon-image",
      src: "images/" + name + "-icon.png"
    });
    
    // dynamically create the label
    this.createComponent({
      name: "%@Label".f(componentName),
      content: name,
      classes: "xt-dashboard-icon-label"
    });
  }
});