/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true, _:true */

(function () {

  XT.extensions.purchasing.initRelationWidgets = function () {

    // ..........................................................
    // ITEM SOURCE
    //

    /**
      This relation widget requires attribute mappings as an object for
      `itemSource` and `vendorItemNumber`. If a vendor item number is keyed
      in that is not found, or a null item source is passed in while a vendor
      item number has a legitimate string, then the vendor item number will
      be displayed. This allows use of the widget as a basic text field
      for vendor item number in cases where there is no item source.
    */
    enyo.kind({
      name: "XV.ItemSourceWidget",
      kind: "XV.RelationWidget",
      label: "_itemSource".loc(),
      collection: "XM.ItemSourceCollection",
      list: "XV.ItemSourceList",
      keyAttribute: "vendorItemNumber",
      nameAttribute: "contract.number",
      published: {
        showDetail: true,
        vendorItemNumber: null,
      },
      descriptionComponents: [
        {controlClasses: 'enyo-inline', components: [
          {name: "nameRow", controlClasses: "enyo-inline", components: [
            {name: "name", classes: "xv-description"}
          ]},
          {name: "contractRow", controlClasses: "enyo-inline", components: [
            {classes: 'xv-label', content: "_contract".loc() + ":"},
            {name: "description", classes: "xv-description"}
          ]},
          {name: "minimumQtyRow", controlClasses: "enyo-inline", components: [
            {classes: 'xv-label', content: "_minimumOrderQuantity".loc() + ":"},
            {name: "minimumQty", classes: "xv-description"}
          ]},
          {name: "multipleQtyRow", controlClasses: "enyo-inline", components: [
            {classes: 'xv-label', content: "_multipleOrderQuantity".loc() + ":"},
            {name: "multipleQty", classes: "xv-description"}
          ]},
          {name: "earliestDateRow", controlClasses: "enyo-inline", components: [
            {classes: 'xv-label', content: "_earliestDate".loc() + ":"},
            {name: "earliestDate", classes: "xv-description"}
          ]}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        this.$.descriptionContainer.setShowing(this.getShowDetail());
      },
      /**
        Can accept a two property object with an item source and vendor item number
        or a full XM.ItemSource object.
      */
      setValue: function (obj, options) {
        options = options || {};
        var that = this,
          value = obj instanceof XM.ItemSource || _.isNull(obj) ? obj : obj.itemSource,
          newId = value ? value.id : null,
          oldId = this.value ? this.value.id : null,
          oldVendorItemNumber = this.getVendorItemNumber(),
          key = this.getFirstKey(),
          name = this.getNameAttribute(),
          keyValue = "",
          nameValue = "",
          Model = this._collection.model,
          id,
          newValue,
          setPrivileges = function () {
            if (value && newId) {
              if (value.couldRead) {
                that.$.openItem.setDisabled(!value.couldRead());
              } else {
                that.$.openItem.setDisabled(!value.getClass().canRead());
              }
            }
          };

        if (obj instanceof XM.ItemSource && !_.isNull(obj)) {
          keyValue = obj.get("vendorItemNumber");
        } else if (_.isObject(obj)) {
          keyValue = obj.vendorItemNumber || "";
        }

        if (_.isString(value)) {
          if (this.value === value || oldId === value) { return; }

          id = _.isObject(value) ? value.id : value;

          newValue = new Model();
          options = {
            id: id,
            success: function () {
              that.setValue({
                itemSource: newValue,
                vendorItemNumber: newValue.get("vendorItemNumber")
              });
            },
            error: function () {
              XT.log("Error setting relational widget value");
            }
          };
          newValue.fetch(options);
          return;
        }

        this.value = value;
        if (value && value.getValue) {
          keyValue = value.getValue(key) || "";
          nameValue = value.getValue(name) || "";
        }
        this.setVendorItemNumber(keyValue);
        this.$.input.setValue(keyValue);
        this.$.name.setShowing(nameValue);
        this.$.name.setContent(nameValue);

        // Only notify if selection actually changed
        if ((newId !== oldId || oldVendorItemNumber !== keyValue) && !options.silent) {
          this.doValueChange({
            originator: this,
            value: {
              itemSource: value,
              vendorItemNumber: keyValue
            }
          });
        }

        // Handle menu actions
        that.$.openItem.setShowing(true);
        that.$.openItem.setDisabled(true);
        that.$.newItem.setShowing(true);
        that.$.newItem.setDisabled(_couldNotCreate.apply(this) || this.disabled);

        if (Model) { setPrivileges(); }

        if (this.getShowDetail()) {
          var contract = value ? value.getValue("contract.number") : "",
            minimumQty = value ? value.get("minimumOrderQuantity") : 0,
            multipleQty = value ? value.get("multipleOrderQuantity") : 0,
            earliestDate = value ? XT.date.applyTimezoneOffset(value.get("earliestDate"), true) : null,
            scale = XT.QTY_SCALE;

          this.$.contractRow.setShowing(!!contract);
          this.$.description.setContent(contract);

          this.$.minimumQtyRow.setShowing(!!minimumQty);
          this.$.minimumQty.setContent(Globalize.format(minimumQty, "n" + scale));

          this.$.multipleQtyRow.setShowing(!!multipleQty);
          this.$.multipleQty.setContent(Globalize.format(multipleQty, "n" + scale));

          this.$.earliestDateRow.setShowing(!!earliestDate);
          this.$.earliestDate.setContent(Globalize.format(earliestDate, "d"));
        }
      },

      /** @protected */
      _fetchSuccess: function () {
        if (this._relationSelected) { return; }
        var value = this._collection.length ? this._collection.models[0] : null,
          vendorItemNumber = value ? value.get("vendorItemSource") : this.$.input.getValue(),
          target = enyo.dispatcher.captureTarget;
        this.setValue({
          itemSource: value,
          vendorItemNumber: vendorItemNumber
        });
        enyo.dispatcher.captureTarget = target;
      }
    });

    /** @private */
    var _couldNotCreate = function () {
      var Workspace = this._Workspace,
        Model = this._collection.model,
        couldNotCreate = true;

      if (Model && Model.couldCreate) {
        // model is a list item or relation
        couldNotCreate = !Model.couldCreate();
      } else if (Model) {
        // model is a first-class model
        couldNotCreate = !Model.canCreate();
      }
      return couldNotCreate;
    };

    // ..........................................................
    // PURCHASE VENDOR
    //

    enyo.kind({
      name: "XV.PurchaseVendorWidget",
      kind: "XV.VendorWidget",
      collection: "XM.PurchaseVendorRelationCollection"
    });

    // ..........................................................
    // VENDOR ADDRESS
    //

    enyo.kind({
      name: "XV.VendorAddressWidget",
      kind: "XV.RelationWidget",
      collection: "XM.VendorAddressRelationCollection",
      list: "XV.VendorAddressList",
      keyAttribute: "code",
      nameAttribute: ""
    });

  };

}());
