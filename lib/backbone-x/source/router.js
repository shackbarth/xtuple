/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, console:true */

(function () {

  XM.BackboneRouter = Backbone.Router.extend({

    routes: {
      "help": "help",    // #help
      "workspace/:recordType/:id": "workspace",
      "search/:query/p:page": "search"   // #search/kiwis/p7
    },

    help: function () {
      console.log("help");
    },

    search: function (query, page) {
      console.log("serach", query, page);
    },

    workspace: function (recordType, id) {
      console.log("workspace", recordType, id);
      var inEvent = {
        workspace: "XV." + recordType + "Workspace",
        id: id
      };
      XT.app.waterfallWorkspace(null, inEvent);
    }

  });
  XM.backboneRouter = new XM.BackboneRouter();

}());

