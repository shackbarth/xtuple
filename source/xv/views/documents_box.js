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
    listRelations: "XV.DocumentListRelations",
    searchList: "dummy",
    handlers: {
      onSelect: "itemSelected"
    },
    create: function () {
      this.inherited(arguments);
      var popup = {
        kind: "onyx.Popup",
        name: "selectionPopup",
        centered: true,
        modal: true,
        floating: true,
        scrim: true,
        onHide: "popupHidden",
        components: [
          {kind: "FittableColumns", components: [
            {content: "_purpose".loc() + ":"},
            {kind: "onyx.PickerDecorator", components: [
              {},
              {kind: "onyx.Picker", name: "purposePicker", components: [
                {content: "_relatedTo".loc(), value: "S", active: true},
                {content: "_parentOf".loc(), value: "C" },
                {content: "_childOf".loc(), value: "A" },
                {content: "_duplicateOf".loc(), value: "D" }
              ]}
            ]}
          ]},
          {kind: "FittableColumns", components: [
            {content: "_type".loc() + ":"},
            {kind: "onyx.PickerDecorator", components: [
              {style: "width: 100px;"},
              {kind: "onyx.Picker", name: "typePicker"}
            ]}
          ]},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "popupOk",
            classes: "onyx-blue xv-popup-button"}
        ]
      };
      this.createComponent(popup);
    },
    attachDocument: function () {
      
    },
    attachItem: function () {
      if (!this._initPicker) { this._pickerInit(); }
      this._popupDone = false;
      this._mode = "attach";
      this.$.selectionPopup.show();
    },
    detachRecord: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index, false);
      model.destroy();
      list.lengthChanged();
    },
    itemSelected: function (inSender, inEvent) {
      if (inEvent.originator.name === "purposePicker") {
        this._purpose = inEvent.selected.value;
      } else if (inEvent.originator.name === "typePicker") {
        this._type = inEvent.selected.value;
      }
      return true;
    },
    popupHidden: function (inSender, inEvent) {
      if (!this._popupDone &&
          inEvent.originator.name === "selectionPopup") {
        inEvent.originator.show();
      }
    },
    popupOk: function () {
      this._popupDone = true;
      this.$.selectionPopup.hide();
      if (this._mode === "attach") {
        this.attachDocument();
      }
    },
    valueChanged: function () {
      this.inherited(arguments);
      this.$.newButton.setDisabled(false);
      this.$.attachButton.setDisabled(false);
    },
    /** private */
    _pickerInit: function () {
      var that = this,
        parent = this.parent.parent.getValue(),
        delegates = [],
        relation,
        relations,
        prop,
        content,
        infoModel,
        hashes = [];
        
      // Make sure we only have 'documents' delegates
      for (prop in parent.attributeDelegates) {
        if (parent.attributeDelegates.hasOwnProperty(prop) &&
            parent.attributeDelegates[prop] === 'documents') {
          delegates.push(prop);
        }
      }
      
      // Magic! Determine selections from the parent and delegate map
      _.each(delegates, function (del) {
        relation = parent.getRelation(del);
        relations = relation.relatedModel.prototype.relations;
        relation = _.find(relations, function (rel) {
          // There should only be one of these and it's the info model
          return rel.isNested;
        });
        infoModel = relation.relatedModel;
        content = ("_" + infoModel.suffix()
                                 .camelize()
                                 .replace("Relation", "")
                                 .camelize()).loc();
        hashes.push({
          content: content,
          value: infoModel
        });
      });
      
      // Sort by the content
      hashes = _.sortBy(hashes, function (hash) {
        return hash.content;
      });
      
      // Default first one
      hashes[0].active = true;
      
      // Create the components
      _.each(hashes, function (hash) {
        that.$.typePicker.createComponent(hash);
      });
      
      // Don't come back here
      this._initPicker = true;
    }
  });

}());
