/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true */

(function () {
  
  // Class methods
  enyo.mixin(XV, {
    /**
      Add component view(s) to a workspace class.

      @param {String} Workspace name
      @param {Object} Component(s)
    */
    appendExtension: function (workspace, component) {
      var Workspace = XT.getObjectByName(workspace),
        extensions = Workspace.prototype.extensions || [];
      extensions.push(component);
      Workspace.prototype.extensions = extensions;
    }

  });

}());
