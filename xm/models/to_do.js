/*jslint bitwise: true, nomen: true, indent:2 */
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

    @extends XT.Model
  */
  XM.ToDo = XT.Model.extend({
    /** @scope XM.ToDo.prototype */

    recordType: 'XM.ToDo',

    privileges: {
      "all": {
        "create": "MaintainAllToDoItems",
        "read": "ViewAllToDoItems",
        "update": "MaintainAllToDoItems",
        "delete": "MaintainAllToDoItems"
      },
      "personal": {
        "create": "MaintainPersonalToDoItems",
        "read": "ViewPersonalToDoItems",
        "update": "MaintainPersonalToDoItems",
        "delete": "MaintainPersonalToDoItems",
        "properties": [
          "owner",
          "assignedTo"
        ]
      }
    },

    defaults: function () {
      return {
        isActive: true,
        owner: XM.currentUser,
        assignedTo: XM.currentUser,
        status: XM.ToDo.NEITHER
      };
    },

    requiredAttributes: [
      "dueDate",
      "name"
    ],

    relations: [{
      type: Backbone.HasOne,
      key: 'contact',
      relatedModel: 'XM.ContactInfo'
    }, {
      type: Backbone.HasOne,
      key: 'assignedTo',
      relatedModel: 'XM.UserAccountInfo'
    }, {
      type: Backbone.HasMany,
      key: 'accounts',
      relatedModel: 'XM.ToDoAccount',
      reverseRelation: {
        key: 'toDo'
      }
    }, {
      type: Backbone.HasMany,
      key: 'contacts',
      relatedModel: 'XM.ToDoContact',
      reverseRelation: {
        key: 'toDo'
      }
    }, {
      type: Backbone.HasMany,
      key: 'items',
      relatedModel: 'XM.ToDoItem',
      reverseRelation: {
        key: 'toDo'
      }
    }, {
      type: Backbone.HasMany,
      key: 'files',
      relatedModel: 'XM.ToDoFile',
      reverseRelation: {
        key: 'toDo'
      }
    }, {
      type: Backbone.HasMany,
      key: 'images',
      relatedModel: 'XM.ToDoImage',
      reverseRelation: {
        key: 'toDo'
      }
    }, {
      type: Backbone.HasMany,
      key: 'urls',
      relatedModel: 'XM.ToDoUrl',
      reverseRelation: {
        key: 'toDo'
      }
    }],

    // ..........................................................
    // METHODS
    //

    /**
      This is the source of data for the user three-way status interface where
      the only possible status options are `PENDING`, `DEFERRED` and `NEITHER`.
      
      @returns {String}
    */
    getToDoStatusProxy: function () {
      var K = XM.ToDo;
      return this._status || K.NEITHER;
    },

    initialize: function () {
      XT.Model.prototype.initialize.apply(this, arguments);
      this.on('change:startDate change:completeDate', this.toDoStatusDidChange);
      this.on('change:status', this.toDoDidChange);
      this.on('changeStatus', this.toDoDidChange);
    },

    toDoDidChange: function () {
      this.setToDoStatusProxy(this.get('status'));
    },

    /**
      Handles upkeep of the internal `status` value stored on the to-do record
      which can be one of five options.
    */
    toDoStatusDidChange: function (model, value, options) {
      var status = this.getStatus(),
        proxy = this.getToDoStatusProxy(),
        startDate = this.get('startDate'),
        completeDate = this.get('completeDate'),
        K = XM.ToDo,
        attrStatus = K.NEITHER;
      if ((options && options.force) || !(status & XT.Model.READY)) { return; }

      // Set the `status` attribute with appropriate value
      if (completeDate) {
        attrStatus = K.COMPLETED;
        this.setToDoStatusProxy(K.NEITHER);
      } else if (proxy === K.DEFERRED) {
        attrStatus = K.DEFERRED;
      } else if (proxy === K.PENDING) {
        attrStatus = K.PENDING;
      } else if (startDate) {
        attrStatus = K.IN_PROCESS;
      }
      this.set('status', attrStatus);
    },

    /**
      Set the three-way status option.
      
      @param {String} Value
      @returns Receiver
    */
    setToDoStatusProxy: function (value) {
      var K = XM.ToDo;
      if (value === this._status) { return this; }
      if (value === K.PENDING || value === K.DEFERRED) {
        this._status = value;
      } else {
        if (this._status === K.NEITHER) { return this; }
        this._status = K.NEITHER;
      }
      this.toDoStatusDidChange();
      return this;
    }

  });

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
  
    @extends XT.Model
  */
  XM.ToDoAccount = XT.Model.extend({
    /** @scope XM.ToDoAccount.prototype */

    recordType: 'XM.ToDoAccount',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'account',
      relatedModel: 'XM.AccountInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ToDoContact = XT.Model.extend({
    /** @scope XM.ToDoContact.prototype */

    recordType: 'XM.ToDoContact',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'contact',
      relatedModel: 'XM.ContactInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ToDoItem = XT.Model.extend({
    /** @scope XM.ToDoItem.prototype */

    recordType: 'XM.ToDoItem',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'item',
      relatedModel: 'XM.ItemInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ToDoFile = XT.Model.extend({
    /** @scope XM.ToDoFile.prototype */

    recordType: 'XM.ToDoFile',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'file',
      relatedModel: 'XM.FileInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ToDoImage = XT.Model.extend({
    /** @scope XM.ToDoImage.prototype */

    recordType: 'XM.ToDoImage',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'image',
      relatedModel: 'XM.ImageInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ToDoUrl = XT.Model.extend({
    /** @scope XM.ToDoUrl.prototype */

    recordType: 'XM.ToDoUrl',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'url',
      relatedModel: 'XM.Url'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ToDoInfo = XT.Model.extend({
    /** @scope XM.ToDoInfo.prototype */

    recordType: 'XM.ToDoInfo',

    relations: [{
      type: Backbone.HasOne,
      key: 'contact',
      relatedModel: 'XM.ContactInfo'
    }, {
      type: Backbone.HasOne,
      key: 'assignedTo',
      relatedModel: 'XM.UserAccountInfo'
    }]

  });

  // To-Do status mixin
  XM.ToDoInfo = XM.ToDoInfo.extend(XM.ToDoStatus);

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class
  
    @extends XT.Collection
  */
  XM.ToDoInfoCollection = XT.Collection.extend({
    /** @scope XM.ToDoInfoCollection.prototype */

    model: XM.ToDoInfo

  });

}());