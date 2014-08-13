/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, console:true */

(function () {

  XM.BackboneRouter = Backbone.Router.extend({

    routes: {
      "workspace/:recordType/:id": "workspace"
    },

    workspace: function (recordType, id) {
      var inEvent = {
        workspace: "XV." + recordType + "Workspace",
        id: id
      };
      XT.app.waterfallWorkspace(null, inEvent);
    }

  });
  XM.backboneRouter = new XM.BackboneRouter();

}());

