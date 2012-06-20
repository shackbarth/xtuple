
enyo.kind({
  name: "XT.InfoListRow",
  kind: "FittableColumns",
  fit: true,
  classes: "xt-info-list-row",
  published: {
    leftColumn: [],
    rightColumn: []
  },
  create: function() {
    this.inherited(arguments);
    
    var lcs = this.getLeftColumn();
    var rcs = this.getRightColumn();
    var lc;
    var rc;
    
    lc = this.createComponent({
      name: "leftColumn",
      kind: "XT.InfoListRowColumn",
      structure: lcs
    });
    
    rc = this.createComponent({
      name: "rightColumn",
      kind: "XT.InfoListRowColumn",
      structure: rcs
    });
  },
  renderModel: function(model) {
    // TEMPORARY IMPLEMENTATION
        
    //this.log(model);
        
    var $ = this.$;
    var elem;
    var idx;
    var view;
    var parts;
    var curr;
    var formatter;
    
    for (elem in $) {
      if ($.hasOwnProperty(elem)) {
        view = $[elem];
        
        if (view.isLabel) {
          continue;
        }
        
        if (elem.indexOf('.') > -1) {
          parts = elem.split('.');
                    
          idx = 0;
          curr = model;
          for (; idx < parts.length; ++idx) {
            curr = curr.get(parts[idx]);
            
            if (curr && typeof curr === "object") {
                            
            } else if (typeof curr === "string") {
              break;
            } else { 
              curr = "";
              break; 
            }
          }
      
          
          view.setContent(curr);
          
        } else {
          
          curr = model.get(elem);

        }
        
        if (view.formatter) {
          formatter = this[view.formatter];
                    
          if (formatter && formatter instanceof Function) {
            curr = formatter(curr, model);
          }
        }
        
        if (curr) {
          view.setContent(curr);
        }
        
      }
    }
  }
    
});

enyo.kind({
  name: "XT.InfoListRowColumn",
  kind: "FittableRows",
  classes: "xt-info-list-row-column",
  fit: true,
  published: {
    structure: null
  },
  create: function() {
    this.inherited(arguments);
    
    var str = this.getStructure();
    var idx = 0;
    var elem;
    var curr = this;
    var ccfa = enyo.bind(this, "createComponentFromArray", this.owner);
    var ccfo = enyo.bind(this, "createComponentFromObject", this.owner);
    
    for (; idx < str.length; ++idx) {
      elem = str[idx];
      if (elem instanceof Array) {
        curr = ccfa(curr, elem);
      } else if (typeof elem === "object") {
        ccfo(curr, elem);
      }
    }
  },
  createComponentFromArray: function(inOwner, inComponent, inElement) {
    var curr = inComponent;
    var elems = inElement;
    
    // TODO: this could be handled in much better ways...
    var width = elems.shift().width;
    
    var idx = 0;
    var elem;
    var ret;
    
    if (curr.kind !== "FittableColumns") {
      curr = curr.createComponent({
        kind: "FittableColumns"
      });
    }

    ret = curr;
    
    curr = curr.createComponent({
      kind: "FittableRows",
      style: "width: " + width + "px;"
    });
    
    for (; idx < elems.length; ++idx) {
      elem = elems[idx];
      if (elem instanceof Array) {
        curr = this.createComponentFromArray(inOwner, curr, elem, elems.length);
      } else if (typeof elem === "object") {
        this.createComponentFromObject(inOwner, curr, elem);
      }
    }
    
    return ret;
  },
  createComponentFromObject: function(inOwner, inComponent, inElement) {
    var curr = inComponent;
    var elem = inElement;
    
    //console.log("CREATECOMPONENTFROMOBJECT", elem);
    
    curr = curr.createComponent({
      kind: "XT.InfoListRowColumnCell"
    }, elem);
    
    if (!inOwner.$[elem.name]) {
      inOwner.$[elem.name] = curr;
    }
  }
});

enyo.kind({
  name:"XT.InfoListRowColumnCell",
  classes: "xt-info-list-row-column-cell"
});
