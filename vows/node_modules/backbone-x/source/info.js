/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
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
    editableModel: null,

    descriptionKey: "description",

    numberKey: "number",

    readOnly: true,

    // ..........................................................
    // METHODS
    //

    /**
      Use this function to find out whether a user could create records on the
      `editableModel`.

      @returns {Boolean}
    */
    couldCreate: function () {
      var Klass = XM[this.editableModel.suffix()];
      return Klass.canCreate();
    },

    /**
    Use this function to find out whether a user could read the
    `editableModel` version of this record.

      @returns {Boolean}
    */
    couldRead: function () {
      var Klass = XM[this.editableModel.suffix()];
      return Klass.canRead(this);
    },

    /**
    Use this function to find out whether a user could update the
    `editableModel` version of this record.

      @returns {Boolean}
    */
    couldUpdate: function () {
      var Klass = XM[this.editableModel.suffix()];
      return Klass.canUpdate(this);
    },

    /**
      Use this function to find out whether a user could delete the
      `editableModel` version of this record.

      @returns {Boolean}
    */
    couldDelete: function () {
      var Klass = XM[this.editableModel.suffix()];
      return Klass.canDelete(this);
    }

  });


}());
