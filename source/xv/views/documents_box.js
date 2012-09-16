/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  enyo.kind({
    name: "XV.DocumentPurposePicker",
    kind: "onyx.PickerDecorator",
    components: [
      {},
      {kind: "onyx.Picker", components: [
        {content: "_relatedTo".loc(), value: "S", active: true},
        {content: "_parentOf".loc(), value: "C" },
        {content: "_childOf".loc(), value: "A" },
        {content: "_duplicateOf".loc(), value: "D" }
      ]}
    ]
  });
  
  enyo.kind({
    name: "XV.DocumentTypePicker",
    kind: "onyx.PickerDecorator",
    components: [
      {},
      {kind: "onyx.Picker", components: [
      ]}
    ]
  });

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
    listRelations: "XV.DocumentListRelations",
    searchList: "dummy",
    handlers: {
      onValueChange: "popupValueChanged"
    },
    create: function () {
      this.inherited(arguments);
      var popup = {
        kind: "onyx.Popup",
        name: "attachPopup",
        centered: true,
        modal: true,
        floating: true,
        scrim: true,
        onHide: "popupHidden",
        components: [
          {kind: "FittableColumns", components: [
            {content: "_purpose".loc() + ":"},
            {kind: "XV.DocumentPurposePicker"}
          ]},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "attachOk",
            classes: "onyx-blue xv-popup-button"}
        ]
      };
      this.createComponent(popup);
    },
    attachItem: function () {
      this._popupDone = false;
      this.$.attachPopup.show();
    },
    attachOk: function () {
      this._popupDone = true;
      this.$.attachPopup.hide();
    },
    detachRecord: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index, false);
      model.destroy();
      list.lengthChanged();
    },
    popupHidden: function (inSender, inEvent) {
      if (inEvent.originator.name !== "attachPopup") {
        return;
      }
      if (!this._popupDone) {
        inEvent.originator.show();
      }
    },
    popupValueChanged: function () {
      return true;
    },
    valueChanged: function () {
      this.inherited(arguments);
      this.$.newButton.setDisabled(false);
      this.$.attachButton.setDisabled(false);
    }
  });

}());
