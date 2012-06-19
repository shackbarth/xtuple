

/**
  @class
  
  Designed to accept a Backbone.Collection object and render
  the contents based on the rowClass specified.
  
*/
enyo.kind(
  /** @scope XT.InfoList.prototype */ {

  /**
  */
  name: "XT.InfoList",
  
  /**
  */
  kind: "Panels",
  
  /**
  */
  fit: true,
  
  /**
  */
  layoutKind: "CarouselArranger",
  
  /**
  */
  classes: "enyo-stretch onyx",
  
  /**
  */
  draggable: false,
  
  /**
  */
  components: [
    
    /**
      The default view for the list is a loading message.
    */
    { name: "loader", style: "height: 300px;", content: "Loading content..." },
    
    /**
      We also have an error-state view if we don't get content...
    */
    { name: "error", content: "There was an error" },
    
    /**
      The actual list itself.
    */
    { name: "list", kind: "XT.InfoListPrivate" }
  ],
  
  /**
  */
  published: {
    
    /**
    */
    collection: null,
    
    /**
      Exposing the rowClass property of the underlying
      XT.InfoListPrivate child.
    */
    rowClass: ""
  },
  
  /**
    @private
    
    When the collection is modified/set it triggers a state
    check to see what needs to be done to the table.
  */
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
  
  /**
    @private
  */
  _collectionChanged: function(collection) {
    this.log();
  },
  
  /**
    @private
  */
  _collectionFetchSuccess: function() {
    this.log();
    this.waterfall("onCollectionUpdated");
  },
  
  /**
    @private
  */
  _collectionFetchError: function() {
    this.log();
  },
  
  /**
  */
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
  
  /** */
  name: "XT.InfoListPrivate",
  
  /** */
  kind: "List",
  
  /** */
  published: {
    
    /** 
      The name of the class to use as the row template. The view
      will attempt to find the constructor and initiate it as the
      row view. Note that its name in this.$ will be _item_.
    */
    rowClass:""
  },
  
  /** */
  handlers: {
    
    /**
      The row rendering function map on the _onSetupItem_ event.
    */
    onSetupItem: "setupRow",
    
    /**
      When the parent has an updated collection...
    */
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
  
  /** */
  fit: true,
  
  /**
  */
  rowClassChanged: function() {
    this.log();
    
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
