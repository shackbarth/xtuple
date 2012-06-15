
XT.CRM_MENU_OPTIONS = [

  "Contacts",
  
  "Accounts",
  
  "To Dos",
  
  "Opportunities",
  
  "Incidents",
  
  "Projects"

];

enyo.kind(
  /** */ {

  name: "XT.ModuleInfinitePane",
  
  kind: "newness.InfiniteSlidingPane"
    
});

enyo.kind(
  /** */ {

  name: "XT.ModuleLeftPanel",
  
  kind: "FittableRows",
  
  classes: "module-left-panel-container"
    
});


enyo.kind(
  /** */ {

  name: "XT.ModuleRightPanel",
  
  kind: "FittableRows",
  
  classes: "module-right-panel-container"
    
});


enyo.kind(
  /** */ {

  name: "XT.ModuleLayout",
  
  kind: "Panels",
  
  arrangerKind: "CollapsingArranger",
  
  fit: true
    
});

enyo.kind(
  /** */ {

  /** */
  name: "XT.Crm",
  
  /** */
  kind: "FittableRows",
  
  fit: true,
  
  published: {
    _projects:null
  },
  
  /** */
  components: [
    { name: "toolbar", kind: "XT.ModuleToolbar" },
    { name: "module", kind: "XT.ModuleLayout", components: [
      { name: "leftPanel", kind: "XT.ModuleLeftPanel", components: [
        { name: "menuList", kind: "List", touch: true, onSetupItem: "crmMenuSetupItem", components: [
          { name: "item", classes: "crm-menu-item", ontap: "crmMenuTap" } ]} ]},
      { kind: "XT.ModuleRightPanel", components: [
        { name: "rightPanel", kind: "XT.ModuleInfinitePane",
          defaultViewType: "projects",
          viewTypes: [
            {
              name: "projects",
              kind: "FittableRows",
              fit: true,
              components: [
                {
                  name: "projectList",
                  kind: "List",
                  onSetupItem: "setupProjectItem",
                  components: [
                    {
                      name: "item",
                      classes: "crm-project-list-item"
                    }
                  ],
                  countChanged: function() {
                    this.log("yo", this.getCount());
                  }
                }
              ]
            }
          ]
        
        
        
        
        } ]} ]}
  ],
  
  create: function() {
    this.inherited(arguments);
    
    this.$.menuList.setCount(XT.CRM_MENU_OPTIONS.length);
    
    window.CRM = this;
  },
  
  rendered: function() {
    this.inherited(arguments);
  },
  
  crmMenuTap: function(inSender, inEvent) {
    
  },
  
  crmMenuSetupItem: function(inSender, inEvent) {
    var opts = XT.CRM_MENU_OPTIONS;
    var idx = inEvent.index;
    this.$.item.setContent(opts[idx]);
  },
  
  didBecomeActive: function() {
    
    var self = this;
    
    // TESTTTTTTTTT
    this._projects = new XM.ProjectCollection();
    this._projects.fetch({success:function(collection){
      console.log(self);
      self.$.rightPanel.$.projectList._projects = collection;
      self.$.rightPanel.$.projectList.setCount(collection.length);
    }});
  }
    
});