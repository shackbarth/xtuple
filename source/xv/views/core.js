/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true */

(function () {
  
  XV._modelSearches = {};
  XV._modelWorkspaces = {};
  
  // Class methods
  enyo.mixin(XV, {
    /**
      Add component or array of component view(s) to a workspace class.

      @param {String} Workspace name
      @param {Object|Array} Component(s)
    */
    appendWorkspaceExtension: function (workspace, extension) {
      var Workspace = XT.getObjectByName(workspace),
        extensions = Workspace.prototype.extensions || [];
      if (!_.isArray(extension)) {
        extension = [extension];
      }
      Workspace.prototype.extensions = extensions.concat(extension);
    },

    getSearch: function (recordType) {
      return XV._modelSearches[recordType];
    },
    
    getWorkspace: function (recordType) {
      return XV._modelWorkspaces[recordType];
    },

    registerModelSearch: function (recordType, search) {
      XV._modelSearch[recordType] = search;
    },

    registerModelWorkspace: function (recordType, workspace) {
      XV._modelWorkspaces[recordType] = workspace;
    }

  });

}());
