/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.project.initStartup = function () {
    XT.cacheCollection("XM.projectEmailProfiles", "XM.ProjectEmailProfileCollection", "name");
    XT.cacheCollection("XM.resources", "XM.ResourceCollection", "code"); // TODO: remove when we move off the picker
  };

}());
