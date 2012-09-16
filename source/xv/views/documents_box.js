/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {
  
  enyo.kind({
    name: "XV.DocumentListRelations",
    kind: "XV.ListRelations",
    parentKey: "account",
    components: [
      {kind: "XV.ListItem", classes: "header", components: [
        {kind: "XV.ListAttr", formatter: "formatType", classes: "header"},
        {kind: "XV.ListAttr", formatter: "formatNumber", classes: "bold"},
        {kind: "XV.ListAttr", formatter: "formatDescription",
          placeholder: "_noDescription".loc()}
      ]}
    ],
    orderBy: [
      {attribute: "id"}
    ],
    getInfoModel: function (model) {
      return _.find(model.attributes, function (attribute) {
          return (attribute instanceof XM.Info);
        });
    },
    /**
      @param {Integer} Index
      @param {Boolean} Return InfoModel (default = true)
    */
    getModel: function (index, infoModel) {
      var model = this.inherited(arguments);
      if (infoModel !== false) {
        return this.getInfoModel(model);
      }
      return model;
    },
    formatNumber: function (value, view, model) {
      var infoModel = this.getInfoModel(model),
        attr = infoModel.numberKey;
      return infoModel.get(attr);
    },
    formatDescription: function (value, view, model) {
      var infoModel = this.getInfoModel(model),
        attr = infoModel.descriptionKey;
      return infoModel.get(attr);
    },
    formatType: function (value, view, model) {
      var infoModel = this.getInfoModel(model);
      return ("_" + infoModel.get('type').replace("Relation", "").camelize()).loc();
    }
  });

  enyo.kind({
    name: "XV.DocumentsBox",
    kind: "XV.ListRelationsBox",
    classes: "xv-documents-box",
    title: "_documents".loc(),
    parentKey: "account",
    listRelations: "XV.DocumentListRelations",
    searchList: "XV.AccountList",
    detachRecord: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index, false);
      model.destroy();
      list.lengthChanged();
    }
  });

}());
