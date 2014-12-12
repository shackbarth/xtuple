/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, XV:true, Backbone:true, console:true */

(function () {

  XM.BackboneRouter = Backbone.Router.extend({

    routes: {
      "list/:listName": "list",
      "list/:listName/": "list",
      "workspace/:recordType/:id": "workspace",
      "workspace/:recordType/:id/:action": "workspace"
    },

    list: function (listName) {
      var listKind = "XV." + listName.charAt(0).toUpperCase() +
        listName.slice(1).camelize();
      XV.navigateToList(XT.app, listKind);
    },

    /**
      @objectName {String} in format sales-order

      @param action {String} the first use-case, in inventory, goes as follows:
      https://host/dev/app#workspace/sales-order/50218/popup-signature
     */
    workspace: function (objectName, id, action) {
      var recordType = "XM." + objectName.charAt(0).toUpperCase() +
        objectName.slice(1).camelize();

      var inEvent = {
        workspace: XV.getWorkspace(recordType),
        id: id,
        success: function () {
          if (action && _.isFunction(this[action.camelize()])) {
            this[action.camelize()]();
          }
        }
      };
      XT.app.waterfallWorkspace(null, inEvent);
    }

  });
  XM.backboneRouter = new XM.BackboneRouter();

}());

