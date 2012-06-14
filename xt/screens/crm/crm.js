
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
  
  /** */
  components: [
    { name: "toolbar", kind: "XT.ModuleToolbar" },
    { name: "module", kind: "XT.ModuleLayout", components: [
      { name: "leftPanel", kind: "XT.ModuleLeftPanel", components: [
        { name: "menuList", kind: "List", touch: true, onSetupItem: "crmMenuSetup", components: [
          { name: "item", classes: "crm-menu-item" } ]} ]},
      { kind: "XT.ModuleRightPanel", components: [
        { name: "rightPanel", kind: "XT.ModuleInfinitePane",
          defaultViewType: "contacts",
          viewTypes: [
            {
              name: "contacts",
              kind: "FittableRows",
              fit: true,
              components: [
                {
                  name: "contactList",
                  kind: "List",
                  onSetupItem: "setupContactItem"
                }
              ],
              setupContactItem: function(inSender, inEvent) {
                
              }
            }
          ]
        
        
        
        
        } ]} ]}
  ],
  
  create: function() {
    this.inherited(arguments);
    
    this.$.menuList.setCount(XT.CRM_MENU_OPTIONS.length);
  },
  
  crmMenuSetup: function(inSender, inEvent) {
    var opts = XT.CRM_MENU_OPTIONS;
    var idx = inEvent.index;
    this.$.item.setContent(opts[idx]);
  }
    
});