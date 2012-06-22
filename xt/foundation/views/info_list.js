
enyo.kind({
  name: "XT.InfoList",
  kind: "Panels",
  fit: true,
  layoutKind: "CarouselArranger",
  classes: "xt-info-list",
  draggable: false,
  components: [
    { name: "loader", style: "height: 300px;", content: "Loading content..." },
    { name: "error", content: "There was an error" },
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
    
    this.log("query", query);
    
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
  } 
});

enyo.kind({
  name: "XT.InfoListPrivate",
  kind: "List",
  published: {
    rowClass:""
  },
  rowsPerPage: 10,
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
  fit: true,
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
    
    if (!this.getShowing()) {
      return;
    }
    
    var col = this.parent.getCollection();
    var row = this.$.item;
    var idx = inEvent.index;
    var mod = col.models[idx];
            
    if (row.getShowing()) {
      console.log("I'm SHOWING");
    }
            
    // as the rows need to be rendered, we proxy the data to their
    // render function if they have it, otherwise, we skip
    if (row && row.renderModel) {
      row.renderModel(mod);
    }
  }
  
});
