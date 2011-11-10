
/*globals XT */

/** @namespace


*/
XT.PluginController = XT.ObjectController.create(
  /** @scope XT.PluginController.prototype */ {

  //...............................................
  // Public Methods
  //

  /**
    Plugins are activated and their content shown by calling
    their `focus` methods. In-turn they call this method
    passing themselves and additional properties as paramaters.
  */
  focus: function(plugin) {

    if(SC.typeOf(plugin) === SC.T_STRING) {
      console.warn("WAS A STRING!!!");
      var path = XT.PluginManager.pluginPath(plugin), self = this;
      console.warn("PATH => ", path);
      if(XT.PluginManager.isLoaded(path)) {
        console.warn("IS LOADED WAS TRUE FOR => ", path);
        plugin = XT.PluginManager.getPlugin(path);
        console.warn("PLUGIN => ", plugin);
        if(!plugin) {
          this.invokeLater(this.focus, 300, path);
          return;
        }
      }
      else {
        console.error("TRYING TO FETCH IT!");
        XT.PluginManager.fetch(path, function() { self.focus(path); });
        return;
      }
    }

    if(!plugin || SC.none(plugin) || !plugin.isPlugin) {
      this.warn("Attempt to focus non-plugin!");
      return NO;
    }
    
    // @todo Needs to handle specific arguments
    var pane = plugin.getPath("mainPage.defaultPane"),
        curr = this._currentPane,
        newIdx = this._indexFor(plugin),
        oldIdx = this._indexFor(curr);

    console.warn("pane => ", pane, " curr => ", curr, " newIdx => ", newIdx, " oldIdx => ", oldIdx);

    console.warn("XT.APPEND_LEFT => ", XT.APPEND_LEFT, " XT.APPEND_RIGHT => ", XT.APPEND_RIGHT, " XT.REMOVE_LEFT => ", XT.REMOVE_LEFT, " XT.REMOVE_RIGHT => ", XT.REMOVE_RIGHT);

    if(!isNaN(oldIdx) && !isNaN(newIdx) && (oldIdx === newIdx)) {
      this.warn("Attempt to focus plugin that is already focused");
      return NO;
    }

    if(SC.none(curr) && isNaN(newIdx) && isNaN(oldIdx)) { 
      this._add(plugin);
      pane.appendFrom = XT.APPEND_LEFT;
      pane.append();
    }
    else if(curr && !isNaN(oldIdx) && isNaN(newIdx)) {
      this._add(plugin);
      pane.appendFrom = XT.APPEND_RIGHT;
      curr.removeTo = XT.REMOVE_LEFT;
      curr.nextPane = pane;
      curr.remove();
    }
    else if(curr && !isNaN(oldIdx) && !isNaN(newIdx)) {
      if(oldIdx < newIdx) {
        pane.appendFrom = XT.APPEND_RIGHT;
        curr.removeTo = XT.REMOVE_LEFT;
        curr.nextPane = pane;
      }
      else if(newIdx < oldIdx) {
        this.log("SHOULD APPEND FROM LEFT");
        pane.appendFrom = XT.APPEND_LEFT;
        this.log("SHOULD REMOVE TO RIGHT");
        curr.removeTo = XT.REMOVE_RIGHT;
        curr.nextPane = pane;
      }
      curr.remove();
    }
    else {
      this.error("Reached invalid case when attempting to focus a plugin", YES);
    }

    this._currentPane = pane;
  },

  //...............................................
  // Private Methods
  //

  _add: function(plugin) {
    if(!plugin || !plugin.isPlugin) {
      this.warn("Attempt to add non-plugin to plugin controller");
      return NO;
    }
    this._orderedPanes.push(plugin);
    this.log("JUST ADDED A PLUGIN");
  },

  _indexFor: function(plugin) {
    if(!plugin) return undefined;
    var op = this._orderedPanes, idx, ret;
    if(op.length <= 0) return undefined;
    if(SC.kindOf(plugin, XT.MainPane)) {
      var f = op.find(function(p, i) {
        var pane = p.getPath("mainPage.defaultPane");
        if(pane === plugin) {
          idx = i;
          return YES;
        } else { return NO; }
      });
    } else { idx = op.indexOf(plugin); }
    ret = !~idx ? undefined : idx;
    this.log("IDX WAS => %@ AND RETURNING => %@".fmt(idx, ret));
    return ret;
  },

  //...............................................
  // Private Properties
  //

  /** @private */
  _orderedPanes: [],

  /** @private */
  _currentPane: null,
  
   

}) ;
