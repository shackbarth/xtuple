/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true */

(function () {
  
  XV._modelLists = {};
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

    getList: function (recordType) {
      return XV._modelLists[recordType];
    },
    
    getWorkspace: function (recordType) {
      return XV._modelWorkspaces[recordType];
    },

    registerModelList: function (recordType, list) {
      XV._modelLists[recordType] = list;
    },

    registerModelWorkspace: function (recordType, workspace) {
      XV._modelWorkspaces[recordType] = workspace;
    }

  });

}());
