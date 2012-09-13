/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, document:true */

(function () {

  XM.MongoUser = XM.Model.extend({
    name: "user",
    recordType: "XM.MongoUser",
    sync: function (method, model, options) {
      options = options ? _.clone(options) : {};
      var that = this,
        id = options.id || model.id,
        recordType = this.recordType,
        result,
        error = options.error;

      options.error = function (resp) {
        var K = XM.Model;
        that.setStatus(K.ERROR);
        if (error) { error(model, resp, options); }
      };

      result = XT.dataSource.configure(recordType, "updatePassword", model.toJSON(), options);
      return result || false;
    },
    validate: function () {
      // real men don't validate
    }

  });

  XM.MongoUserCollection = XM.Collection.extend({
    model: XM.MongoUser
  });

}());
