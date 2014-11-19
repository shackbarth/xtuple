/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XV:true, XM:true, _:true, window: true, Backbone:true, enyo:true, XT:true, async:true */

(function () {

  /**
    @name XV.DocumentListRelations
    @class A control that displays a list of scrolling rows.<br />
    Use to provide the list of related data to the {@link XV.DocumentsBox}.<br />
    @extends XV.ListRelations
   */
  enyo.kind(
    /** @lends XV.DocumentListRelations# */{
    name: "XV.DocumentListRelations",
    kind: "XV.ListRelations",
    parentKey: "account",
    published: {
      // the cache of asynchrously-fetched documently-associated info models
      resolvedModels: {}
    },
    events: {
      onError: ""
    },
    components: [
      {kind: "XV.ListItem", classes: "header", components: [
        {kind: "XV.ListColumn", name: "column", components: [
          {kind: "XV.ListAttr", attr: "targetType", formatter: "formatType", classes: "header"},
          {kind: "FittableColumns", components: [
            {kind: "XV.ListAttr", attr: "target", formatter: "formatNumber", name: "numberAttr", classes: "bold"},
            {kind: "XV.ListAttr", attr: "purpose", fit: true, formatter: "formatPurpose",
              classes: "right"}
          ]},
          {kind: "XV.ListAttr", formatter: "formatDescription",
            ontap: "openWindow", placeholder: "_noDescription".loc()}
        ]}
      ]}
    ],
    orderBy: [
      {attribute: "id"}
    ],
    /**
     @todo Document getInfoModel method.
     */
    getInfoModel: function (model) {
      return this.getResolvedModels()[model.id];
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
    /**
      To be able to render this list with the appropriate detail we need to have
      a cache of all of the info models that the document assignment models point
      to. Load up that cache, and then rerender the list when we have everything
    */
    lengthChanged: function () {
      var that = this;
      this.inherited(arguments);
      async.map(this.readyModels(), function (model, callback) {
        that.resolveModel(model, function (resolvedModel) {
          that.resolvedModels[model.id] = resolvedModel;
          callback();
        });
      }, function (err, results) {
        that.refresh();
      });
    },
    resolveModel: function (model, callback) {
      if (_.isObject(model.get("target"))) {
        callback(model.get("target"));
        return;
      }


      var recordType = XT.documentAssociations[model.get("targetType")].model;
      var resolvedModel = new (XT.getObjectByName(recordType))();
      resolvedModel.fetch({
        id: model.get("target"),
        queryOnPrimaryKey: true,
        success: callback
      });
    },
    /**
      Show the natural ID of the info model
     */
    formatNumber: function (value, view, model) {
      var resolvedModel = this.resolvedModels[model.id];
      if (resolvedModel) {
        return resolvedModel.get(resolvedModel.nameAttribute) || resolvedModel.id;
      }
      return value;
    },
    /**
      Show the description field of the info model
     */
    formatDescription: function (value, view, model) {
      var infoModel = this.getInfoModel(model),
        attr, recordType, isUrl;

      if (!infoModel) {
        return;
      }

      attr = infoModel.descriptionKey;
      recordType = infoModel.recordType;
      isUrl = recordType === 'XM.Url' || recordType === 'XM.FileRelation';

      view.addRemoveClass("hyperlink", isUrl);
      return infoModel.get(attr);
    },
    /**
      Show the purpose of the document assignment
     */
    formatPurpose: function (value) {
      var purpose;
      switch (value)
      {
      case 'S':
        purpose = "_related".loc();
        break;
      case 'A':
        purpose = "_child".loc();
        break;
      case 'C':
        purpose = "_parent".loc();
        break;
      case 'D':
        purpose = "_duplicate".loc();
        break;
      }
      return purpose;
    },
    /**
      Show the record type of the info model
     */
    formatType: function (value, view, model) {
      return XT.documentAssociations[value] ? XT.documentAssociations[value].label : value;
    },
    /**
     @todo Document the openWindow method.
     */
    openWindow: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        recordType = model.recordType,
        path,
        error;

      if (recordType === "XM.Url") {
        path = model.getValue('path');
      } else if (recordType === 'XM.FileRelation') {
        path = XT.getOrganizationPath() + '/file?recordType=XM.File&id=' + model.id;
      }
      if (path) {
        if (path.search(/^file/i) > -1) {
          error = XT.Error.clone('xt1011');
          this.doError({error: error});
          return true;
        }
        window.open(path);
        return true;
      }
    },
    setupItem: function () {
      this.inherited(arguments);
      // Hack: You _will_ conform!
      this.$.column.applyStyle("width", "100%");
    }
  });

  /**
    @name XV.DocumentsBox
	@class Provides a container in which its components are a vertically stacked group
    of horizontal rows.<br />
    Made up of a header, scroller, and a row of navigation buttons.<br />
    Use to implement a popup window for the user to define document relationships,
    for example: the purpose (related to, parent of, child of, duplicate of) and
    the type (account, contact, file, incident, item) of object to which the document is related.
    @extends XV.ListRelationsBox
   */
  enyo.kind(/** @lends XV.DocumentsBox# */{
    name: "XV.DocumentsBox",
    kind: "XV.ListRelationsBox",
    classes: "xv-documents-box",
    title: "_documents".loc(),
    listRelations: "XV.DocumentListRelations",
    searchList: "dummy",
    /**
     Creates a pop-up window for user to define the document relationships.
     For example, a file related to an account or a photograph related to an
     inventory item.
     */
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
                {content: "_parentOf".loc(), value: "A" },
                {content: "_childOf".loc(), value: "C" },
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
    /**
     @todo Document the attachDocument method.
     */
    attachDocument: function () {
      var searchList = XV.getList(this._type.infoModel),
        purpose = this._purpose,
        sourceKey = this._type.sourceKey,
        targetKey = this._type.targetKey,
        collection = this.$.list.getValue(),
        inEvent,

        // Callback to handle selection...
        callback = function (selectedModel) {

          // Create a new document assignment record
          var Klass = XT.getObjectByName("XM.DocumentAssociation"),
            model = new Klass(null, {isNew: true}),
            options = {
              silent: true,
              status: XM.Model.READY_CLEAN
            };

          model.set('purpose', purpose, {silent: true});
          model.set('sourceType', sourceKey, {silent: true});
          model.set('targetType', targetKey, {silent: true});
          model.set('target', selectedModel, options);
          collection.add(model);
        };

      // Open a search screen
      inEvent = {
        list: searchList,
        callback: callback
      };
      this.doSearch(inEvent);
    },
    /**
     @todo Document the attachItem method.
     */
    attachItem: function () {
      if (!this._initPicker) { this._buildList(); }
      this._popupDone = false;
      this._mode = "attach";
      this.$.selectionPopup.show();
    },
    /**
     @todo Document the detachItem method.
     */
    detachItem: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index, false);
      model.destroy();
      list.lengthChanged();
    },
    /**
     @todo Document the newDocument method.
     */
    newDocument: function () {
      var purpose = this._purpose,
        infoModel = this._type.infoModel,
        sourceKey = this._type.sourceKey,
        targetKey = this._type.targetKey,
        workspace = XV.getWorkspace(infoModel),
        collection = this.$.list.getValue(),
        inEvent,

        // Callback when new model is successfully committed
        callback = function (model) {
          if (!model) { return; }

          // First load up the info model version
          // of the model just created
          var Klass = XT.getObjectByName(infoModel),
            attrs = {},
            info,
            options = {};
          attrs[Klass.prototype.idAttribute] = model.id;
          info = Klass.findOrCreate(attrs);
          options.success = function () {

            // Now create a document assignment model
            var Klass = XT.getObjectByName("XM.DocumentAssociation"),
              model = new Klass(null, {isNew: true});

            model.set('purpose', purpose, {silent: true});
            model.set('sourceType', sourceKey, {silent: true});
            model.set('targetType', targetKey, {silent: true});
            model.set('target', info, {silent: true});
            collection.add(model);
          };

          // Fetch the info model
          info.fetch(options);
        };
      inEvent = {
        originator: this,
        workspace: workspace,
        callback: callback,
        allowNew: false
      };
      this.doWorkspace(inEvent);
    },
    /**
     @todo Document the newItem method.
     */
    newItem: function () {
      if (!this._initPicker) { this._buildList(); }
      this._popupDone = false;
      this._mode = "new";
      this.$.selectionPopup.show();
    },
    /**
     @todo Document the popupHidden method.
     */
    popupHidden: function (inSender, inEvent) {
      if (!this._popupDone &&
          inEvent.originator.name === "selectionPopup") {
        inEvent.originator.show();
      }
    },
    /**
     @todo Document the popupOK method.
     */
    popupOk: function () {
      this._popupDone = true;
      this.$.selectionPopup.hide();
      if (this._mode === "attach") {
        this.attachDocument();
      } else if (this._mode === "new") {
        this.newDocument();
      }
    },
    /**
     @todo Document the purposeSelected method.
     */
    purposeSelected: function (inSender, inEvent) {
      this._purpose = inEvent.selected.value;
    },
    /**
     @todo Document the selectionChanged method.
     */
    selectionChanged: function (inSender, inEvent) {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null,
        couldNotRead = model ? !model.couldRead() : true;
      this.$.detachButton.setDisabled(index === undefined || this.getDisabled());
      this.$.openButton.setDisabled(couldNotRead || this.getDisabled());
    },
    /**
     @todo Document the typeSelected method.
     */
    typeSelected: function (inSender, inEvent) {
      this._type = inEvent.selected.value;
    },
    /**
     @todo Document the valueChanged method.
     */
    valueChanged: function () {
      this.inherited(arguments);
      this.$.newButton.setDisabled(this.getDisabled());
      this.$.attachButton.setDisabled(this.getDisabled());
    },
    /** private */
    _buildList: function () {
      var that = this,
        infoModel,
        hashes = [],
        InfoModel,
        parentRecordType = this.parent.parent.value.recordType,
        sourceKey,
        EditableModel;

      // figure out what the key is for the workspace that's hosting this doc box
      _.each(XT.documentAssociations, function (docAssoc, key) {
        if (docAssoc.model.indexOf(parentRecordType) === 0) {
          sourceKey = key;
        }
      });

      _.each(XT.documentAssociations, function (docAssoc, key) {
        infoModel = docAssoc.model;
        InfoModel = XT.getObjectByName(infoModel);
        EditableModel = XT.getObjectByName(InfoModel.prototype.editableModel);

        if (EditableModel.canCreate()) {
          hashes.push({
            content: docAssoc.label,
            value: {
              sourceKey: sourceKey,
              targetKey: key,
              infoModel: infoModel
            }
          });
        }
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
