/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true, XV:true */

(function () {

  enyo.kind({
    name: "XV.AccountRoleCheckboxWidget",
    kind: "XV.CheckboxWidget",
    published: {
      linkEnabled: false
    },
    events: {
      onSavePrompt: "",
      onWorkspace: ""
    },
    handlers: {
      ontap: "tapped"
    },
    clear: function () {
      this.inherited(arguments);
      this.$.input.setChecked(false);
    },
    inputChanged: function (inSender, inEvent) {
      var isNotRelation = !this.isRelation(),
        input = this.$.input.getValue(),
        value = isNotRelation && input ? 1 : null;
      this.setValue(value);
    },
    isRelation: function () {
      if (this._isRelation !== undefined) { return this._isRelation; }
      var model = this.getOwner().getValue(),
        attr;

      // Relation is true if it is not a number based attribute
      if (model) {
        attr = this.getAttr();
        this._isRelation = _.isObject(model.getRelation(attr));
      }
      return this._isRelation;
    },
    setDisabled: function (isDisabled) {
      this.$.input.setDisabled(isDisabled || this.getLinkEnabled());
    },
    setValue: function (value, options) {
      this.inherited(arguments);
      options = options || {};
      var isRelation = this.isRelation(),
        that = this,
        colorClass = "",
        enabled = false,
        input = this.$.input.getValue(),
        openWorkspace,
        success,
        callback,
        model,
        recordType,
        relation,
        documentKey,
        nameAttribute,
        attrs = {},
        Klass,
        map;

      // Turn on label link if applicable
      if (this.getValue() && isRelation) {
        colorClass = "hyperlink";
        enabled = true;
      }
      this.$.label.addClass(colorClass);
      this.setLinkEnabled(enabled);
      this.setDisabled(enabled);

      // Automatically open a workspace to set up a record for this role if necessary
      if (input && isRelation && !value && !options.silent) {
        model = this.getOwner().getValue();
        relation = model.getRelation(this.getAttr());
        recordType = relation.relatedModel.prototype.recordType;
        Klass = XT.getObjectByName(recordType);

        // If it has an editable model it must be an XM.Info model
        if (Klass.prototype.editableModel) {
          Klass = XT.getObjectByName(Klass.prototype.editableModel);
          documentKey = Klass.prototype.documentKey;
          map = Klass.prototype.conversionMap;
        } else {
          documentKey = relation.relatedModel.prototype.documentKey;
          map = relation.relatedModel.prototype.conversionMap;
        }
        // Most account docs will make this upper again, but needs to be lower for user account
        attrs[documentKey] = model.get("number");
        // Map other attribute candidates
        _.each(map, function (value, key) {
          attrs[value] = model.get(key);
        });

        // Init function for new workspace. Makes sure the workspace understands
        // The account is already "converted".
        success = function () {
          this.getValue().checkConflicts = false;
        };

        // Callback to handle result of new role
        callback = function (model) {
          if (model) {
            that.getOwner().requery();
          } else {
            that.$.input.setChecked(false);
          }
        };

        // Only open the workspace if `valid` is true
        openWorkspace = function (valid) {
          if (valid) {
            that.doWorkspace({
              workspace: XV.getWorkspace(recordType),
              attributes: attrs,
              success: success,
              callback: callback,
              allowNew: false
            });
          } else {
            that.$.input.setChecked(false);
          }
        };

        // Must have committed all changes before proceeding
        if (model.isDirty()) {
          this.doSavePrompt({
            callback: openWorkspace
          });
        } else {
          openWorkspace(true);
        }
      }
    },
    tapped: function (inSender, inEvent) {
      var value;
      if (inEvent.originator.name === "label" &&
          this.getLinkEnabled()) {
        value = this.getValue();
        this.doWorkspace({
          workspace: XV.getWorkspace(value.recordType),
          id: value.id
        });
      }
    }
  });

}());
