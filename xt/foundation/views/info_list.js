
enyo.kind({
  name: "XT.InfoList",
  kind: "Panels",
  classes: "xt-info-list",
  draggable: false,
  components: [
    { name: "loader", classes: "xt-info-list-loader", content: "Loading content..." },
    { name: "error", classes: "xt-info-list-error", content: "There was an error" },
    { name: "list", kind: "XT.InfoListPrivate" }
  ],
  published: {
    collection: null,
    rowClass: ""
  },
  collectionChanged: function() {
    var col = this.getCollection();
    var query = this._listQuery || {};
    
    if (!col) {
      this.setIndex(1);
      return;
    }
    
    // bind the change event to our handler
    col.bind("change", enyo.bind(this, "_collectionChanged", col));
    
    // attempt to fetch (if not already fetched) and handle the
    // various states appropriately
    col.fetch({
      success: enyo.bind(this, "_collectionFetchSuccess"),
      error: enyo.bind(this, "_collectionFetchError"),
      query: { rowLimit: 100 }
    });
  },
  _collectionChanged: function(collection) {
    this.log();
  },
  _collectionFetchSuccess: function() {
    this.log();
    this.waterfall("onCollectionUpdated");
  },
  _collectionFetchError: function() {
    this.log();
  },
  create: function() {
    this.inherited(arguments);
    this.rowClassChanged();            
  },
  rowClassChanged: function() {
    // need to pass down some information to the list
    this.$.list.setRowClass(this.getRowClass());
  },
  //showingChanged: function() {
  //  this.log(this.name, this.showing, this);
  //  this.inherited(arguments);
  //  this.log(this.name, this.showing, this);
  //}
});

enyo.kind({
  name: "XT.InfoListPrivate",
  kind: "List",
  classes: "xt-info-list-private",
  published: {
    rowClass:""
  },
  handlers: {
    onSetupItem: "setupRow",
    onCollectionUpdated: "collectionUpdated"
  },
  collectionUpdated: function() {    
    var col = this.parent.getCollection();
    
    // take the properties as necessary...
    this.setCount(col.length);
    this.reset();
    
    // if we updated, let the parent know we want to be
    // visible now
    this.parent.setIndex(2);
  },
  resizeHandler: function(inSender, inEvent) {
    this.inherited(arguments);
    //this.log(this.owner.name, this);
    //if (!this.owner.getShowing()) {
    //  return true;
    //} else {
    //  this.inherited(arguments);
    //}
  },
  rowClassChanged: function() {
    this.log(this.owner.name);
    
    var rowClass = this.getRowClass();
    var component;
    var item;
        
    if (rowClass) {
      if (XT.getObjectByName(rowClass)) {
        
        component = {
          name: "item",
          kind: rowClass
        };
        
        item = this.$.item;
        if (item) {
          this.removeComponent(item);
          item.destroy();
        }
        
        this.createComponent(component);
      }
    }
  },
  setupRow: function(inSender, inEvent) {
    //this.log(this.owner.name, this.owner.showing, this);
    
    var col = this.parent.getCollection();
    var row = this.$.item;
    var idx = inEvent.index;
    var mod = col.models[idx];
            
    // as the rows need to be rendered, we proxy the data to their
    // render function if they have it, otherwise, we skip
    if (row && row.renderModel) {
      row.renderModel(mod);
    }
  }
  
});
