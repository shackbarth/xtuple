/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, 
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, enyo:true*/

(function () {
  
  enyo.kind({
    name: "XV.Dashboard",
    kind: "Control",
    classes: "xt-dashboard",
    components: [
      { name: "container", classes: "xt-dashboard-container", components: [
        { name: "icons", kind: "XV.DashboardIcons" }
      ]}
    ]
    
  });

  enyo.kind({
    name: "XV.DashboardIcons",
    classes: "xt-dashboard-icons",
    create: function () {
      this.inherited(arguments);
    
      var c$ = this.children.length;
      this.applyStyle("width", ((114 /*width*/ + 20 /*margin*/) * c$) + "px");
    },
    components: [
      { name: "crm", kind: "XV.DashboardIcon" },
      { name: "billing", kind: "XV.DashboardIcon" }
    ]
  });

  enyo.kind({
    name: "XV.DashboardIcon",
    kind: "Control",
    classes: "xt-dashboard-icon",
    tap: function () {
      var name = this.name;
      this.bubble(name, {eventName: name});
    },
    create: function () {
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

}());