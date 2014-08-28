/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global XT:true, XM:true, XV:true, Backbone:true, console:true */

(function () {

  XM.BackboneRouter = Backbone.Router.extend({

    routes: {
      "workspace/:recordType/:id": "workspace"
    },

    /**
      @objectName {String} in format sales-order
     */
    workspace: function (objectName, id) {
      var recordType = "XM." + objectName.charAt(0).toUpperCase() +
        objectName.slice(1).camelize();
      var inEvent = {
        workspace: XV.getWorkspace(recordType),
        id: id
      };
      XT.app.waterfallWorkspace(null, inEvent);
    }

  });
  XM.backboneRouter = new XM.BackboneRouter();

}());

