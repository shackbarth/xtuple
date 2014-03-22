/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class An abstract model whose subclasses are lightweight versions of full models.
    `info` models are suitable for displaying information on lists and widgets.
    Usually they are not themselves editable, but special functions are included that
    allow the `info` model to determine whether its "full" counterpart is editable.

    The special `could` privileges are designed to take personal privilege settings
    into account, so it is important that info models have the necessary attributes
    such as `owner` and/or `assignedTo` to check for access.

    @name XM.Info
    @extends XM.Model
  */
  XM.Info = XM.Model.extend(/** @lends XM.Info# */{

    /**
      The "full" editable counterpart for this model. This is model whose privileges
      will be checked in `could` functions.

      @type {String}
    */
    editableModel: "",

    descriptionKey: "description",
    numberKey: "number",
    readOnly: true,

    // ..........................................................
    // METHODS
    //

    /**
      Returns whether the current record could be created on the editableModel
      based on privilege settings.

      @returns {Boolean}
    */
    couldCreate: function () {
      return this.getClass().couldCreate();
    },

    /**
      Returns whether the current record could be read on the editableModel
      based on privilege settings.

      @returns {Boolean}
    */
    couldRead: function () {
      return this.getClass().couldRead(this);
    },

    /**
      Returns whether the current record could be updated on the editableModel
      based on privilege settings.

      @returns {Boolean}
    */
    couldUpdate: function () {
      return this.getClass().couldUpdate(this);
    },

    /**
      Returns whether the current record could be deleted on the editableModel
      based on privilege settings.

      @returns {Boolean}
    */
    couldDelete: function () {
      return this.getClass().couldDelete(this);
    },

    /**
      Returns whether the current record could be destroyed on the editableModel
      based on privilege settings and whether it's used. Requires a callback to the
      server.

      @returns Receiver
    */
    couldDestroy: function (callback) {
      this.getClass().couldDestroy(this, callback);
      return this;
    }
  }, /** @lends XM.Info# */{
    /**
      Use this function to find out whether a user could create records on the
      `editableModel`.

      @returns {Boolean}
    */
    couldCreate: function () {
      var Klass = Backbone.Relational.store.getObjectByName(this.prototype.editableModel);
      return Klass ? Klass.canCreate() : false;
    },

    /**
    Use this function to find out whether a user could read the
    `editableModel` version of this record or model.

      @param {XM.Info} model Optional argument to ask about a specific
        model. If this is falsy we ask about the class generally.

      @returns {Boolean}
    */
    couldRead: function (model) {
      var Klass = Backbone.Relational.store.getObjectByName(this.prototype.editableModel);
      return Klass ? Klass.canRead(model || this) : false;
    },

    /**
    Use this function to find out whether a user could update the
    `editableModel` version of this record or model.

      @param {XM.Info} model Optional argument to ask about a specific
        model. If this is falsy we ask about the class generally.

      @returns {Boolean}
    */
    couldUpdate: function (model) {
      var Klass = Backbone.Relational.store.getObjectByName(this.prototype.editableModel);
      return Klass ? Klass.canUpdate(model || this) : false;
    },

    /**
      Use this function to find out whether a user could delete the
      `editableModel` version of this record or model.

      @param {XM.Info} model Optional argument to ask about a specific
        model. If this is falsy we ask about the class generally.

      @returns {Boolean}
    */
    couldDelete: function (model) {
      var Klass = Backbone.Relational.store.getObjectByName(this.prototype.editableModel);
      return Klass ? Klass.canDelete(model || this) : false;
    },

    /**
      Returns whether the current record could be destroyed on the editableModel
      based on privilege settings and whether it's used. Requires a callback to the
      server.

      @returns {Boolean}
    */
    couldDestroy: function (model, callback) {
      var Klass = Backbone.Relational.store.getObjectByName(this.prototype.editableModel);
      return Klass ? Klass.canDestroy(model || this, callback) : false;
    }
  });
}());
