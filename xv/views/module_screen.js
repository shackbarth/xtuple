
enyo.kind({
  name: "XT.ModuleScreen",
  kind: "FittableRows",
  classes: "xt-module-screen",
  fit: true,
  components: [
    { name: "toolbar", kind: "XT.ModuleToolbar" },
    { name: "moduleContent", fit: true, kind: "FittableColumns", components: [
      { name: "menu", kind: "XT.ModuleMenu" },
      { name: "subModuleContent", kind: "XT.SubModuleContent" } ] }
  ],
  published: {
    menuItems: [],
    listMap: {}
  },
  create: function() {
    this.inherited(arguments);
    
    var menuItems = this.getMenuItems();
    var menu = this.$.menu;
    var idx = 0;
    var item;
    var listType;
    var collectionType;
    var collectionTypeName;
    var map = this.listMap = {};
    var sub = this.$.subModuleContent;
        
    for (; idx < menuItems.length; ++idx) {
      item = menuItems[idx];
      item = menu.createComponent({
        kind: "XT.ModuleMenuItem",
        index: idx
      }, item);
      listType = item.getListType();
      collectionTypeName = item.getCollectionType();
      
      if (!collectionTypeName) {
        continue;
      }
      
      collectionType = XT.getObjectByName(collectionTypeName);
      
      if (!collectionType) {
        this.log("Could not find the requested collection type %@".f(collectionTypeName));
        continue;
      }
      
      listType = sub.createComponent({
        kind: listType,
        name: item.name
      });
      
      map[item.name] = {
        list: listType,
        collection: collectionTypeName,
        query: item.query
      };
    }
    
    this.setListMap(map);
    
    window.IL = this;
  },
  handlers: {
    onMenuItemTapped: "menuItemTapped"
  },
  menuItemTapped: function(inSender, inEvent) {
    var orig = inEvent.originator.name;
    var menu = this.$.menu;
    if (menu.$[orig]) {
      this.selectSubModule(orig);
    }
  },
  selectSubModule: function(inName) {
    var map = this.getListMap();
    var item = map[inName];
    var menu = this.$.menu;
    var menuItem = menu.$[inName];
    var sub = this.$.subModuleContent;
    var list;
    var collection;
    var Klass;
    
    this.log(map);
    
    if (!item) {
      this.log("Could not find the requested sub module");
    } else {
    
      collection = item.collection;
      if (!(collection instanceof Object)) {
        Klass = XT.getObjectByName(collection);
        item.collection = collection = new Klass();
      }
      
      if (item.query) {
        collection._listQuery = item.query;
      } else { console.warn("NOOOOO", item); }
          
      list = item.list;
      list.setCollection(collection);
    }
    
    menu.getSelection().select(menuItem.getIndex());
    sub.setCurrentView(menuItem.name);
  }
});