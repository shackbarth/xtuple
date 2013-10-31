/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.project.initStatic = function () {
    
    // Project Status
    var K = XM.Project,
      i;
    var projectStatusJson = [
      { id: K.CONCEPT, name: "_concept".loc() },
      { id: K.IN_PROCESS, name: "_inProcess".loc() },
      { id: K.COMPLETED, name: "_completed".loc() }
    ];
    XM.ProjectStatusModel = Backbone.Model.extend({
    });
    XM.ProjectStatusCollection = Backbone.Collection.extend({
      model: XM.ProjectStatusModel
    });
    XM.projectStatuses = new XM.ProjectStatusCollection();
    for (i = 0; i < projectStatusJson.length; i++) {
      var projectStatus = new XM.ProjectStatusModel(projectStatusJson[i]);
      XM.projectStatuses.add(projectStatus);
    }
  };

}());
