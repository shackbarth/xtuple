/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @namespace

    A mixin shared by To-Do models that share common incident status
    functionality.
  */
  XM.ToDoStatus = {
    /** @scope XM.ToDoStatus */

    /**
    Returns to-do status as a localized string.

    @returns {String}
    */
    getToDoStatusString: function () {
      var K = XM.ToDo,
        status = this.get('status');
      if (status === K.PENDING) {
        return '_pending'.loc();
      }
      if (status === K.DEFERRED) {
        return '_deferred'.loc();
      }
      if (status === K.NEITHER) {
        return '_neither'.loc();
      }
      if (status === K.IN_PROCESS) {
        return '_inProcess'.loc();
      }
      if (status === K.COMPLETED) {
        return '_completed'.loc();
      }
    }

  };

  /**
    @class

    @extends XM.Model
    @extends XM.DocumentAssignmentsMixin
  */
  XM.ToDo = XM.Model.extend({
    /** @scope XM.ToDo.prototype */

    recordType: 'XM.ToDo',

    defaults: function () {
      return {
        isActive: true,
        owner: XM.currentUser,
        assignedTo: XM.currentUser,
        status: XM.ToDo.NEITHER
      };
    },

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:startDate change:completeDate change:statusProxy', this.toDoStatusDidChange);
      // Bind document assignments
      this.bindDocuments();
    },

    /**
      Handles upkeep of the internal `status` value stored on the to-do record
      which can be one of five options.
    */
    toDoStatusDidChange: function (model, value, options) {
      var proxy = this.get("statusProxy"),
        startDate = this.get('startDate'),
        completeDate = this.get('completeDate'),
        K = XM.ToDo,
        attrStatus = K.NEITHER;

      // Set the `status` attribute with appropriate value
      if (completeDate) {
        attrStatus = K.COMPLETED;
        this.set("statusProxy", K.NEITHER);
      } else if (proxy === K.DEFERRED || proxy === K.PENDING) {
        attrStatus = proxy;
      } else if (startDate) {
        attrStatus = K.IN_PROCESS;
        this.set("statusProxy", K.NEITHER);
      }
      this.set('status', attrStatus);
    }

  });

  XM.ToDo = XM.ToDo.extend(XM.DocumentAssignmentsMixin);

  // To-Do status mixin
  XM.ToDo = XM.ToDo.extend(XM.ToDoStatus);

  _.extend(XM.ToDo, {
     /** @scope XM.ToDo */

    /**
      Pending status for To-Do.

      @static
      @constant
      @type String
      @default P
    */
    PENDING: 'P',

    /**
      Deffered status for To-Do.

      @static
      @constant
      @type String
      @default D
    */
    DEFERRED: 'D',

    /**
      Open status for To-Do. Neither Pending or Deferred.
      @static
      @constant
      @type String
      @default N
    */
    NEITHER: 'N',

    /**
      In-progress status for To-Do (startDate entered and status is NOT 'P' or 'D').
      @static
      @constant
      @type String
      @default I
    */
    IN_PROCESS: 'I',

    /**
      Completed status for To-Do (completeDate is entered).
      @static
      @constant
      @type String
      @default C
    */
    COMPLETED: 'C'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ToDoAccount = XM.Model.extend({
    /** @scope XM.ToDoAccount.prototype */

    recordType: 'XM.ToDoAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Alarm
  */
  XM.ToDoAlarm = XM.Alarm.extend({
    /** @scope XM.ProjectTaskAlarm.prototype */

    recordType: 'XM.ToDoAlarm'

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.ToDoComment = XM.Comment.extend({
    /** @scope XM.ToDoComment.prototype */

    recordType: 'XM.ToDoComment',

    sourceName: 'TD'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ToDoContact = XM.Model.extend({
    /** @scope XM.ToDoContact.prototype */

    recordType: 'XM.ToDoContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ToDoItem = XM.Model.extend({
    /** @scope XM.ToDoItem.prototype */

    recordType: 'XM.ToDoItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ToDoFile = XM.Model.extend({
    /** @scope XM.ToDoFile.prototype */

    recordType: 'XM.ToDoFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ToDoToDo = XM.Model.extend({
    /** @scope XM.ToDoToDo.prototype */

    recordType: 'XM.ToDoToDo',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ToDoUrl = XM.Model.extend({
    /** @scope XM.ToDoUrl.prototype */

    recordType: 'XM.ToDoUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ToDoRelation = XM.Info.extend({
    /** @scope XM.ToDoRelation.prototype */

    recordType: 'XM.ToDoRelation',

    editableModel: 'XM.ToDo',

    numberKey: 'name'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ToDoListItem = XM.Info.extend({
    /** @scope XM.ToDoListItem.prototype */

    recordType: 'XM.ToDoListItem',

    editableModel: 'XM.ToDo'

  });

  // To-Do status mixin
  XM.ToDoListItem = XM.ToDoListItem.extend(XM.ToDoStatus);

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.ToDoListItemCollection = XM.Collection.extend({
    /** @scope XM.ToDoListItemCollection.prototype */

    model: XM.ToDoListItem

  });

}());
