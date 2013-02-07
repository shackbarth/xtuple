/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
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
      var K = XT.session,
        model = this.getOwner().getValue(),
        attr,
        columns,
        category;
        
      // Relation is true if it is not a number based attribute
      if (model) {
        attr = this.getAttr();
        columns = K.getSchema().get(model.get("type")).columns;
        category = _.findWhere(columns, { name: attr }).category;
        this._isRelation = category !== K.DB_NUMBER;
      }
      return this._isRelation;
    },
    setDisabled: function (isDisabled) {
      this.$.input.setDisabled(isDisabled || this.getLinkEnabled());
    },
    setValue: function (value, options) {
      this.inherited(arguments);
      var isRelation = this.isRelation(),
        that = this,
        color = "black",
        enabled = false,
        input = this.$.input.getValue(),
        openWorkspace,
        success,
        callback,
        model,
        recordType,
        relation,
        attrs;
        
      // Turn on label link if applicable
      if (this.getValue() && isRelation) {
        color = "blue";
        enabled = true;
      }
      this.$.label.setStyle("color: " + color);
      this.setLinkEnabled(enabled);
      this.setDisabled(enabled);
      
      // Automatically open a workspace to set up a record for this role if necessary
      if (input && isRelation && !value) {
        model = this.getOwner().getValue();
        attrs = {
          number: model.get("number"),
          name: model.get("name")
        };
        relation = model.getRelation(this.getAttr());
        recordType = relation.relatedModel.prototype.recordType;
        
        // Init function for new workspace. Makes sure the workspace understands
        // The account is already "converted".
        success = function () {
          var model = this.getValue();
          model._number = model.get("number");
        };
        
        // Callback to handle result of new role
        callback = function (model) {
          if (model) {
            that.getOwner().refresh();
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
