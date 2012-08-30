/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true */

(function () {
  
  // Class methods
  enyo.mixin(XV, {
    /**
      Add component or array of component view(s) to a workspace class.

      @param {String} Workspace name
      @param {Object|Array} Component(s)
    */
    appendExtension: function (workspace, extension) {
      var Workspace = XT.getObjectByName(workspace),
        extensions = Workspace.prototype.extensions || [];
      if (!_.isArray(extension)) {
        extension = [extension];
      }
      Workspace.prototype.extensions = extensions.concat(extension);
    }

  });

}());
