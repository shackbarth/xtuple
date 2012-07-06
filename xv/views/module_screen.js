
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
    onMenuItemTapped: "menuItemTapped",
    onInfoListRowTapped: "doInfoListRowTapped"
  },
  doInfoListRowTapped: function (inSender, inEvent) {
    var listIndex = inEvent.index;
    var currentView = this.$.subModuleContent.getCurrentView();
    var clickedModel = this.getListMap()[currentView].collection.models[listIndex];
    XT.log("Model was clicked: " + JSON.stringify(clickedModel.toJSON()));

    this.selectSubModuleFromModel(clickedModel);
  },
  menuItemTapped: function(inSender, inEvent) {
    var orig = inEvent.originator.name;
    var menu = this.$.menu;
    if (menu.$[orig]) {
      this.selectSubModule(orig);
    }
  },
  // maybe refactor this into selectSubModule
  selectSubModuleFromModel: function(model) {
    this.$.subModuleContent.setCurrentView("model_workspace"); // TODO: screen_carousel doesn't know what to do with this name

    this.clearMenu();
    var menuItems = ['Overview', 'Primary Contact', 'Comments', 'Documents']; // TODO: get these dynamically
    for(var i = 0; i < menuItems.length; i++) {
      this.$.menu.createComponent({
          kind: "XT.ModuleMenuItem",
          index: i,
          label: menuItems[i]
        }, model); // TODO: lots of work still todo here

    }
    this.$.menu.render();
  },
  clearMenu: function() {
    var menuLength = this.$.menu.children.length;
    for (var i = 0; i < menuLength; i++) {
      this.$.menu.removeChild(this.$.menu.children[0]);
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

    this.log(map);
    XT.log("Current submodule is " + inName);

    if (!item) {
      this.log("Could not find the requested sub module");
    } else {

      collection = item.collection;
      if (!(collection instanceof Object)) {
        item.collection = collection = XT.getObjectByName(collection).create();
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
