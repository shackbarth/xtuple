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
      return ("_" + infoModel.get('type')
                             .replace("Relation", "")
                             .replace("ListItem", "")
                             .camelize()).loc();
    }
  });

  enyo.kind({
    name: "XV.DocumentsBox",
    kind: "XV.ListRelationsBox",
    classes: "xv-documents-box",
    title: "_documents".loc(),
    listRelations: "XV.DocumentListRelations",
    searchList: "dummy",
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
            {content: "_purpose".loc() + ":", classes: "xv-documents-picker-label"},
            {kind: "onyx.PickerDecorator", components: [
              {classes: "xv-documents-picker"},
              {kind: "onyx.Picker", name: "purposePicker", style: "z-index: 999;",
                onChange: "purposeSelected", components: [
                {content: "_relatedTo".loc(), value: "S", active: true},
                {content: "_parentOf".loc(), value: "C" },
                {content: "_childOf".loc(), value: "A" },
                {content: "_duplicateOf".loc(), value: "D" }
              ]}
            ]}
          ]},
          {kind: "FittableColumns", components: [
            {content: "_type".loc() + ":", classes: "xv-documents-picker-label"},
            {kind: "onyx.PickerDecorator", components: [
              {classes: "xv-documents-picker"},
              {kind: "onyx.Picker", name: "typePicker",
                onChange: "typeSelected", style: "z-index: 999;"}
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
      var parent = this.$.list.getValue().parent,
        searchList = XV.getList(this._type.infoModel),
        purpose = this._purpose,
        docsModel = this._type.docsModel,
        docsAttr = this._type.docsAttr,
        infoAttr = this._type.infoAttr,
        collection = parent.get(docsAttr),
        inEvent,

        // Callback to handle selection...
        callback = function (selectedModel) {

          // Create a new document assignment record
          var Klass = XT.getObjectByName(docsModel),
            model = new Klass(),

            // When id has been fetched, set attributes and
            // add document assignment to parent
            idFetched = function () {
              model.off('change:id', idFetched);
              model.set('purpose', purpose, {silent: true});
              model.set(infoAttr, selectedModel, {silent: true});
              collection.add(model);
            };
          model.on('change:id', idFetched);
          model.initialize(null, { isNew: true });
        };

      // Open a search screen
      inEvent = {
        list: searchList,
        callback: callback
      };
      this.doSearch(inEvent);
    },
    attachItem: function () {
      if (!this._initPicker) { this._buildList(); }
      this._popupDone = false;
      this._mode = "attach";
      this.$.selectionPopup.show();
    },
    detachItem: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index, false);
      model.destroy();
      list.lengthChanged();
    },
    newDocument: function () {
      var parent = this.$.list.getValue().parent,
        purpose = this._purpose,
        docsModel = this._type.docsModel,
        docsAttr = this._type.docsAttr,
        infoAttr = this._type.infoAttr,
        infoModel = this._type.infoModel,
        workspace = XV.getWorkspace(infoModel),
        collection = parent.get(docsAttr),
        inEvent,
        
        // Callback when new model is successfully committed
        callback = function (model) {
          
          // First load up the info model version
          // of the model just created
          var Klass = XT.getObjectByName(infoModel),
            info = new Klass({id: model.id}),
            options = {};
          options.success = function () {
            
            // Now create a document assignment model
            var Klass = XT.getObjectByName(docsModel),
              model = new Klass(),
              
              // When id has been fetched, set attributes and
              // add document assignment to parent
              idFetched = function () {
                model.off('change:id', idFetched);
                model.set('purpose', purpose, {silent: true});
                model.set(infoAttr, info, {silent: true});
                collection.add(model);
              };
            model.on('change:id', idFetched);
            model.initialize(null, { isNew: true });
          };
          
          // Fetch the info model
          info.fetch(options);
        };
      inEvent = {
        originator: this,
        workspace: workspace,
        callback: callback
      };
      this.doWorkspace(inEvent);
    },
    newItem: function () {
      if (!this._initPicker) { this._buildList(); }
      this._popupDone = false;
      this._mode = "new";
      this.$.selectionPopup.show();
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
      } else if (this._mode === "new") {
        this.newDocument();
      }
    },
    purposeSelected: function (inSender, inEvent) {
      this._purpose = inEvent.selected.value;
    },
    typeSelected: function (inSender, inEvent) {
      this._type = inEvent.selected.value;
    },
    valueChanged: function () {
      this.inherited(arguments);
      this.$.newButton.setDisabled(false);
      this.$.attachButton.setDisabled(false);
    },
    /** private */
    _buildList: function () {
      var that = this,
        parent = this.parent.parent.getValue(),
        delegates = [],
        relation,
        relations,
        prop,
        content,
        docsAttr,
        docsModel,
        infoAttr,
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
        docsAttr = relation.key;
        docsModel = relation.relatedModel.prototype.recordType;
        relations = relation.relatedModel.prototype.relations;
        relation = _.find(relations, function (rel) {
          // There should only be one of these and it's the info model
          return rel.isNested;
        });
        infoAttr = relation.key;
        infoModel = relation.relatedModel;
        content = ("_" + infoModel.suffix()
                                 .camelize()
                                 .replace("Relation", "")
                                 .camelize()).loc();
        hashes.push({
          content: content,
          value: {
            docsAttr: docsAttr,
            docsModel: docsModel,
            infoAttr: infoAttr,
            infoModel: infoModel
          }
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
