/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, window:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // ORGANIZATIONS
  //

  enyo.kind({
    name: "XV.OrganizationWidget",
    kind: "XV.RelationWidget",
    collection: "XM.OrganizationCollection",
    list: "XV.OrganizationList",
    idAttribute: "name",
    keyAttribute: "name",
    nameAttribute: "description",
    setValue: function (value, options) {
      // Beat this function into submission.
      // We want just the key value emitted, not the whole object
      options = options || {};
      var silent = options.silent,
        inEvent = {};
      options.silent = true;
      XV.RelationWidget.prototype.setValue.call(this, value, options);
      if (!silent) {
        inEvent.value = this.value && this.value.get ? this.value.get('name') : "";
        this.doValueChange(inEvent);
      }
    }
  });

}());
