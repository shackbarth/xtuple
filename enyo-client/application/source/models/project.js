/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.ProjectType = XM.Document.extend(
    /** @scope XM.ProjectType.prototype */ {

    recordType: "XM.ProjectType",

    documentKey: "code",

    enforceUpperKey: false,

    defaults: {
      isActive: true
    }

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.ProjectTypeCharacteristic = XM.CharacteristicAssignment.extend(
    /** @scope XM.ProjectTypeCharacteristic.prototype */ {

    recordType: "XM.ProjectTypeCharacteristic",

    which: "isProjects"

  });

  /**
    @class

    @extends XM.WorkflowSource
  */
  XM.ProjectTypeWorkflow = XM.WorkflowSource.extend(
    /** @scope XM.ProjectTypeWorkflow.prototype */ {

    recordType: "XM.ProjectTypeWorkflow"

  });

  XM.ProjectStatusMixin = {
    // ..........................................................
    // CONSTANTS
    //

    /**
      Concept status for project.

      @static
      @constant
      @type String
      @default P
    */
    CONCEPT: "P",

    /**
      Review status for project.

      @static
      @constant
      @type String
      @default R
    */
    REVIEW: "R",

    /**
      Revision status for project.

      @static
      @constant
      @type String
      @default V
    */
    REVISION: "V",

    /**
      Approved status for project.

      @static
      @constant
      @type String
      @default A
    */
    APPROVED: "A",

    /**
      In-Process status for project.

      @static
      @constant
      @type String
      @default O
    */
    IN_PROCESS: "O",

    /**
      Completed status for project.
      @static
      @constant
      @type String
      @default C
    */
    COMPLETED: "C",

    /**
      Rejected status for project.
      @static
      @constant
      @type String
      @default J
    */
    REJECTED: "J"
  };

  /**
    @namespace

    A mixin shared by project models that share common project status
    functionality.
  */
  XM.ProjectStatus = {
    /** @scope XM.ProjectStatus */

    /**
    Returns project status as a localized string.

    @returns {String}
    */
    getProjectStatusString: function () {
      var K = XM.ProjectStatusMixin,
        status = this.get("status");

      switch (status)
      {
      case K.CONCEPT:
        return "_concept".loc();
      case K.REVIEW:
        return "_review".loc();
      case K.REVISION:
        return "_revision".loc();
      case K.APPROVED:
        return "_approved".loc();
      case K.IN_PROCESS:
        return "_inProcess".loc();
      case K.COMPLETED:
        return "_completed".loc();
      case K.REJECTED:
        return "_rejected".loc();
      }
    },

    isActive: function () {
      var K = XM.ProjectStatusMixin,
        status = this.get("status");
      return (status !== K.COMPLETED && status !== K.REJECTED);
    }

  };

  /**
    @class

    @extends XM.Info
    @extends XM.ProjectStatus
  */
  XM.ProjectListItem = XM.Info.extend({
    /** @scope XM.ProjectListItem.prototype */

    recordType: "XM.ProjectListItem",

    editableModel: "XM.Project"

  });

  XM.ProjectListItem = XM.ProjectListItem.extend(XM.ProjectStatus);

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.ProjectListItemCharacteristic = XM.CharacteristicAssignment.extend(
    /** @scope XM.ProjectListItemCharacteristic.prototype */ {

    recordType: "XM.ProjectListItemCharacteristic",

    which: "isProjects"

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ProjectRelation = XM.Info.extend({
    /** @scope XM.ProjectRelation.prototype */

    recordType: "XM.ProjectRelation"

  });

  XM.ProjectRelation = XM.ProjectRelation.extend(XM.ProjectStatus);

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

  /**
    @class

    @extends XM.Collection
  */
  XM.ProjectListItemCollection = XM.Collection.extend({
    /** @scope XM.ProjectListItemCollection.prototype */

    model: XM.ProjectListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ProjectRelationCollection = XM.Collection.extend({
    /** @scope XM.ProjectRelationCollection.prototype */

    model: XM.ProjectRelation

  });


}());
