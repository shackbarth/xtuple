/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, enyo:true, _:true*/

(function () {

  XT.extensions.inventory.initPickers = function () {

    // ..........................................................
    // ABC CLASS
    //

    enyo.kind({
      name: "XV.AbcClassPicker",
      kind: "XV.PickerWidget",
      collection: "XM.abcClasses",
      valueAttribute: "id",
      showNone: false
    });

    // ..........................................................
    // CONTROL METHOD
    //

    enyo.kind({
      name: "XV.ControlMethodPicker",
      kind: "XV.PickerWidget",
      collection: "XM.controlMethods",
      valueAttribute: "id",
      showNone: false
    });

    // ..........................................................
    // COST METHOD
    //

    enyo.kind({
      name: "XV.CostMethodPicker",
      kind: "XV.PickerWidget",
      collection: "XM.costMethods",
      valueAttribute: "id",
      showNone: false,
      filter: function (models) {
        var ret = [],
          costMethods;
        if (this._model) {
          costMethods = this._model.costMethods;
          ret = _.filter(models, function (model) {
            return _.contains(costMethods, model.id);
          });
        }
        return ret;
      }
    });

  };

}());
