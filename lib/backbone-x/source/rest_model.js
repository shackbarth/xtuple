
(function () {

  "use strict";
  XM.RestModel = Backbone.RelationalModel.extend({
    // instance properties

    //
    // Functions that are copied from XM.Model
    //
    canEdit: function (attr) {
      return XM.Model.prototype.canEdit.apply(this, arguments);
    },

    canUpdate: function () {
      return XM.Model.prototype.canUpdate.apply(this, arguments);
    },

    canView: function () {
      return XM.Model.prototype.canView.apply(this, arguments);
    },

    getAttributeNames: function () {
      return XM.Model.prototype.getAttributeNames.apply(this, arguments);
    },

    getClass: function () {
      return XM.Model.prototype.getClass.apply(this, arguments);
    },

    getLockKey: function (getRoot) {
      return XM.Model.prototype.getLockKey.apply(this, arguments);
    },

    getParent: function (getRoot) {
      return XM.Model.prototype.getParent.apply(this, arguments);
    },

    getValue: function (attr) {
      return XM.Model.prototype.getValue.apply(this, arguments);
    },

    hasLockKey: function () {
      return XM.Model.prototype.hasLockKey.apply(this, arguments);
    },

    isReadOnly: function () {
      return XM.Model.prototype.isReadOnly.apply(this, arguments);
    },

    isRequired: function (attr) {
      return XM.Model.prototype.isRequired.apply(this, arguments);
    },

    //
    // Newly re-implemented functions
    //
    getStatus: function () {
      return XM.Model.READY_CLEAN; // TODO
    },

    isDirty: function () {
      return !_.isEmpty(this.changedAttributes());
    },

    //
    // Our Google-style REST API doesn't provide the data in the exact way that
    // backbone is used to, but it's real close and the mapping is easy
    //
    // @override
    parse: function (response) {
      if (response.data && response.status) {
        return response.data.data;
      }
      return response;
      //return response.data.data;
    },

    releaseLock: function () {
      XM.Model.prototype.releaseLock.apply(this, arguments);
    },

    setValue: function (value) {
      XM.Model.prototype.setValue.apply(this, arguments);
    }

  }, {
    // class properties. Think of these like static methods that hang off the constructor.

    canCreate: XM.ModelClassMixin.canCreate,
    canRead: XM.ModelClassMixin.canRead,
    canUpdate: XM.ModelClassMixin.canUpdate,
    canDelete: XM.ModelClassMixin.canDelete,
    checkCompoundPrivs: XM.ModelClassMixin.checkCompoundPrivs
  });



})();
