/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.project.initProjectModels = function () {

    var _proto = XM.Project.prototype,
      _defaults = _proto.defaults;

    _proto.defaults = function () {
      var defaults = _.isFunction(_defaults) ? _defaults() : defaults;
      // Add first active project type
      defaults.projectType = _.find(XM.projectTypes.models, function (model) {
        return model.get("isActive");
      });
      return defaults;
    };
    /**
      @class

      @extends XM.Document
    */
    XM.ProjectType = XM.Document.extend(
      /** @scope XM.ProjectType.prototype */ {

      recordType: 'XM.ProjectType',

      documentKey: 'code',

      enforceUpperKey: false,

      defaults: {
        isActive: true
      }

    });
  
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

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.ProjectTypeCollection = XM.Collection.extend({
      /** @scope XM.ProjectTypeCollection.prototype */

      model: XM.ProjectType

    });

  };

}());
