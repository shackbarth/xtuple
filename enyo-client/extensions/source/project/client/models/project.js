/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.project.initProjectModels = function () {
  
    /**
      @class

      @extends XM.Model
    */
    XM.ProjectIncident = XM.Model.extend(
      /** @scope XM.ProjectIncident.prototype */ {

      recordType: 'XM.ProjectIncident',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectOpportunity = XM.Model.extend(
      /** @scope XM.ProjectOpportunity.prototype */ {

      recordType: 'XM.ProjectOpportunity',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ProjectToDo = XM.Model.extend(
      /** @scope XM.ProjectToDo.prototype */ {

      recordType: 'XM.ProjectToDo',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.ProjectCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.ProjectCharacteristic.prototype */ {

      recordType: 'XM.ProjectCharacteristic'

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.ProjectListItemCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.ProjectListItemCharacteristic.prototype */ {

      recordType: 'XM.ProjectListItemCharacteristic'

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.ProjectTaskCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.ProjectTaskCharacteristic.prototype */ {

      recordType: 'XM.ProjectTaskCharacteristic'

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.TaskCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.TaskCharacteristic.prototype */ {

      recordType: 'XM.TaskCharacteristic'

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.TaskListItemCharacteristic = XM.CharacteristicAssignment.extend(
      /** @scope XM.TaskListItemCharacteristic.prototype */ {

      recordType: 'XM.TaskListItemCharacteristic'

    });

    // Add to context attributes
    var ary = XM.Characteristic.prototype.contextAttributes;
    ary.push("isProjects");
    ary.push("isTasks");

  };

}());
