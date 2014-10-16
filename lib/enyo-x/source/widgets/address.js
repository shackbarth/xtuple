/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XM:true, enyo:true, _:true, window:true */

(function () {

  /**
    @name XV.AddressWidget
    @class Contains a set of fittable rows made up of
    controls for inputting and viewing addresses,
    including the popup for adding or editing them.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.FittableRows">enyo.FittableRows</a>.
    @extends enyo.FittableRows
   */
  enyo.kind(
    /** @lends XV.AddressWidget# */{
    name: "XV.AddressWidget",
    kind: "FittableRows",
    classes: "xv-addresswidget",
    published: {
      attr: null,
      value: null,
      list: "XV.AddressList",
      account: null
    },
    events: {
      onSearch: "",
      onValueChange: "",
      onNotify: ""
    },
    handlers: {
      onkeyup: "keyUp"
    },
    components: [
      {name: "viewer", showing: true, fit: true, allowHtml: true,
        classes: "xv-addresswidget-viewer",
        placeholder: "_none".loc(), ontap: "mapTap"},
      {kind: "FittableColumns", classes: "xv-buttons",
        name: "buttonColumns", components: [
        {kind: "onyx.Button", name: "editButton",
          ontap: "edit", onkeyup: "editButtonKeyUp",
          classes: "icon-edit"},
        {kind: "onyx.Button", name: "searchButton",
          ontap: "search", onkeyup: "searchButtonKeyUp",
          classes: "icon-search"}
      ]},
      {kind: "onyx.Popup", name: "editor", onHide: "editorHidden",
        classes: "xv-addresswidget-editor", modal: true, floating: true,
        centered: true, scrim: true, components: [
        {content: "_editAddress".loc(),
          classes: "xv-addresswidget-editor-header"},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-input-decorator",
          components: [
          {kind: "onyx.Input", name: "line1",
            placeholder: "_street".loc(), classes: "xv-addresswidget-input",
            onchange: "inputChanged"}
        ]},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-input-decorator",
          components: [
          {kind: "onyx.Input", name: "line2",
            classes: "xv-addresswidget-input", onchange: "inputChanged"}
        ]},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-input-decorator",
          components: [
          {kind: "onyx.Input", name: "line3",
            classes: "xv-addresswidget-input", onchange: "inputChanged"}
        ]},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-input-decorator",
          components: [
          {kind: "onyx.Input", name: "city", placeholder: "_city".loc(),
            classes: "xv-addresswidget-input", onchange: "inputChanged"}
        ]},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-combobox-decorator",
          components: [
          {kind: "XV.CountryCombobox", name: "country",
            onValueChange: "countryChanged", showLabel: false,
            placeholder: "_country".loc()}
        ]},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-combobox-decorator",
          components: [
          {kind: "XV.StateCombobox", name: "state", placeholder: "_state".loc(),
            onValueChange: "inputChanged", showLabel: false}
        ]},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-input-decorator short",
          components: [
          {kind: "onyx.Input", name: "postalCode",
            classes: "xv-addresswidget-input",
            placeholder: "_postalCode".loc(), onchange: "inputChanged"}
        ]},
        {tag: "br"},
        {kind: "onyx.Button", content: "_done".loc(), ontap: "done",
          classes: "onyx-blue"}
      ]}
    ],
    /**
      When the country is changed we want to both do the typical event
      (to update the model) but also set the country of the state, which
      will limit its options.
    */
    countryChanged: function (inSender, inEvent) {
      var country = this.$.country.getValue();
      this.inputChanged(inSender, inEvent);
      this.$.state.setCountry(country);
      return true;
    },
    destroy: function () {
      if (this.value && this.value instanceof XM.Model) {
        this.value.releaseLock();
      }
      this.inherited(arguments);
    },
    /**
      Closes the editor popup and saves the address immediately.
      Note that we don't typically wait for the user to save from the
      workspace for address changes to get saved to the database.
    */
    done: function () {
      var siblings,
        i,
        next = false;
      if (!this._nextWidget) {
        // Find next widget to shift focus to
        siblings = this.parent.children;
        for (i = 0; i < siblings.length; i++) {
          if (next) {
            if (siblings[i].focus) {
              this._nextWidget = siblings[i];
              break;
            }
          }
          if (siblings[i] === this) { next = true; }
        }
      }
      this._popupDone = true;
      this.$.editor.hide();
      // the address model takes care of itself through
      // some complicated logic, here
      this.saveAddress();
      if (this._nextWidget) { this._nextWidget.focus(); }
    },
    /**
      Opens the editor popup and creates a new address model if necessary.
    */
    edit: function () {
      var value = this.getValue();
      if (!value) {
        value = new XM.AddressInfo(null, {isNew: true});
        this.setValue(value);
      }
      if (!this.$.editor.showing) {
        this.$.editor.show();
        this.$.line1.focus();
        this._popupDone = false;
      }
    },
    /**
    @todo Document the editButtonKeyUp method.
    */
    editButtonKeyUp: function (inSender, inEvent) {
      // Return or space bar activates button
      if (inEvent.keyCode === 13 ||
         (inEvent.keyCode === 32)) {
        this.edit();
      }
      return true;
    },
    /**
    @todo Document the editorHidden method.
    */
    editorHidden: function () {
      if (!this._popupDone) {
        this.edit();
      }
    },
    /**
      Triggered by a change to any one of the fields inside the address.
      Updates the model that backs this kind and signals an event with the
      updated model as the payload.
    */
    inputChanged: function (inSender, inEvent) {
      var value = this.getValue(),
        attr = inEvent.originator.name;
      if (value) {
        value.set(attr, this.$[attr].getValue());
        this.setValue(value);
        this.valueChanged();
        inEvent = {
          originator: this,
          value: value
        };
        this.doValueChange(inEvent);
      }
      return true;
    },
    /**
      Listens for the enter key
    */
    keyUp: function (inSender, inEvent) {
      // Return
      if (inEvent.keyCode === 13) {
        this.done();
      }
    },
    /**
      Ask a question to the workspace container
     */
    notify: function (options) {
      var inEvent = _.extend(options, {
        originator: this,
        model: this.getValue()
      });
      this.doNotify(inEvent);
    },
    /**
    @todo Document the pickerTapped method.
    */
    pickerTapped: function (inSender, inEvent) {
      if (inEvent.originator.name === "iconButton") {
        this.receiveFocus();
      }
    },
    /**
      Saves the address, taking care of the complicated business logic
      of checking to see if the address is in use anywhere else, and, if it
      is, asking the user if he wants to update them all, or just this one.
     */
    saveAddress: function (options) {
      var that = this,
        model = this.getValue(),
        maxUse = model.isNew() ? 0 : 1,
        findExistingOptions = {},
        useCountOptions = {},
        isValid = model.isValid(),
        K = XM.Model;

      options = options || {};
      // Perform address checks if warranted
      if (isValid && model.getStatus() !== K.READY_CLEAN) {

        // If the address is empty set it to null
        if (model.getStatus() === XM.EMPTY || model.isAllEmpty()) {
          if (model.isNew()) { model.releaseNumber(); }
          model.clear();
          this.setValue(null);

        // If dirty, see if this address already exists
        } else if (model.isDirty()) {
          // Callback: call save on the original again
          findExistingOptions.success = function (resp) {
            var mergeAddress,
              options = {};

            if (resp) {
              // We've just changed the address to something that's identical
              // with a pre-existing address in the system. Start using that
              // address. XXX we miss out on the opportunity here "changeAll"
              options[XM.Address.prototype.idAttribute] = resp;
              mergeAddress = XM.Address.findOrCreate(options);
              options.success = function () {
                that.setValue(mergeAddress);
                // tell the view to re-render
                that.valueChanged();
              };
              mergeAddress.fetch(options);
              return;
            }

            useCountOptions.success = function (resp) {
              var notifyOptions = {},
                fetchOptions = {},
                callback,
                newAddress;

              // If address is used then we need to handle that
              if (resp > maxUse) {
                // ask the user if they want to CHANGE_ONE or CHANGE_ALL
                notifyOptions.type = XM.Model.YES_NO_CANCEL;
                notifyOptions.callback = function (response) {
                  var changeOneCallback;

                  if (response.answer === false) {
                    // just change this one by creating a new model
                    // Callback after successfull copy
                    // Only proceed when we have both an id and number from the server
                    changeOneCallback = function () {
                      var id = newAddress.id,
                        number = newAddress.get('number');
                      if (id && number) {
                        newAddress.off('change:id change:number', callback);
                        newAddress.save(null);
                        that.setValue(newAddress);
                      }
                    };
                    newAddress = model.copy();
                    newAddress.on('change:id change:number', changeOneCallback);
                    changeOneCallback(); // In case the data was here before event handlers respond

                    fetchOptions[model.idAttribute] = model.id;
                    model.fetch(fetchOptions); // refresh the original address to clear out changes

                  } else if (response.answer === true) {
                    // change all the references by updating this model
                    model.save(null, options);

                  } else {
                    // answer === null means that the user wants to cancel this action
                    // fetching is a good way to throw out the changes
                    model.fetch({success: function () {
                      // tell the view to re-render
                      that.valueChanged();
                    }});
                  }
                };
                notifyOptions.message = "_addressShared".loc() + " " + "_changeAll?".loc();
                that.notify(notifyOptions);

              } else {
                // the model is not in use. Just update it
                model.save(null, options);
              }
            };
            // Perform the check: find out how many places this address is used
            model.useCount(useCountOptions);
          };
          return XM.Address.findExisting(model.get('line1'),
                                  model.get('line2'),
                                  model.get('line3'),
                                  model.get('city'),
                                  model.get('state'),
                                  model.get('postalCode'),
                                  model.get('country'),
                                  findExistingOptions);

        }
      }
      // No problem with address, just save the record
      // If record was invalid, this will bubble up the error
      var saveResult = model.save(null, options);
      // XXX it would be really nice if XM.Model.save called a callback if no changes to save
      if (!saveResult && options.success) {
        options.success(model);
      }
    },
    /**
      Opens up the search screen for addresses.
      Restricts on account if this widget has been account-restricted.
    */
    search: function () {
      var that = this,
        list = this.getList(),
        account = this.getAccount(),
        parameterItemValues = [],
        callback = function (value) {
          that.setValue(value);
        };
      if (account) {
        parameterItemValues.push({
          name: 'account',
          // if account is a model, pass the id, which will avoid
          // entaglements of different flavors of account models
          value: account.id ? account.id : account
        });
      }
      this.doSearch({
        list: list,
        callback: callback,
        parameterItemValues: parameterItemValues
      });
    },
    /**
    * @mapButtonTap
    *
    * opens the google map page for this address in a new browser window
    */
    mapTap: function () {
      var model = this.getValue(),
        address = [
          model.get('line1') || "",
          model.get('line2') || "",
          model.get('line3') || "",
          model.get('city') || "",
          model.get('state') || "",
          model.get('postalCode') || "",
          model.get('country') || ""
        ],
        hasContent = false;

      for (var i = 0; i < address.length; i++) {
        if (address[i]) {
          address[i] = address[i] + ",+";
          hasContent = true;
        }
      }

      if (hasContent) {
        window.open("http://maps.google.com/?q=" + address.join(''));
      }
      return true;
    },
    /**
    @todo Document the searchButtonKeyUp method.
    */
    searchButtonKeyUp: function (inSender, inEvent) {
      // Return or space bar activates button
      if (inEvent.keyCode === 13 ||
         (inEvent.keyCode === 32)) {
        this.search();
      }
      return true;
    },
    setDisabled: function (disabled) {
      this.$.viewer.addRemoveClass("disabled", disabled);
      this.$.editButton.setDisabled(disabled);
      this.$.searchButton.setDisabled(disabled);
    },
    /**
    @todo Document the setValue method.
    */
    setValue: function (value, options) {
      var that = this,
        inEvent,
        transformModel,
        transformSuccess,
        oldId = this.value ? this.value.id : null,
        newId = value ? value.id : null,
        fetchOptions = {};

      if (this.value && this.value instanceof XM.Model) {
        this.value.releaseLock();
      }

      // If we're being passed in a model here that's not an AddressInfo,
      // (say, a line item from a search), we'll want to convert it.
      if (value instanceof XM.Model &&
         // hack 1: John added etag to prevent a bug on editing shared addresses
         // hack 2: ...which broke the creation of new addresses, so Steve put on value.id
         // and !isNew()
         // The general idea here is that if address comes along as a child of contact, say, it's
         // not going to have a lock. So we might want to re-fetch the address so that we have
         // a record we can update.
         ((_.isNull(value.etag) && value.id && !value.isNew()) ||
         value.recordType !== 'XM.AddressInfo')) {
        transformModel = new XM.AddressInfo();
        transformSuccess = function () {
          that.setValue(transformModel, options);
        };
        fetchOptions[transformModel.idAttribute] = value.id;
        fetchOptions.success = transformSuccess;
        transformModel.fetch(fetchOptions);
        return;
      }

      options = options || {};
      if (newId === oldId) { return; }
      this.value = value;
      this.valueChanged(value, options);

      // make sure that the state combobox is filtered properly
      this.$.state.setCountry(value && value.get("country"));

      if (!options.silent) {
        inEvent = {
          originator: this,
          value: value
        };
        this.doValueChange(inEvent);
      }
    },
    /**
      Set the contents of the subcomponents based on the value
      of the model. Note that we pass through the options object,
      which might have silent:true as an attribute.
    */
    valueChanged: function (value, options) {
      value = value || this.getValue();
      var line1 = "",
        line2 = "",
        line3 = "",
        city = "",
        state = "",
        postalCode = "",
        country = "",
        fmt = "";
      if (value) {
        line1 = value.get('line1') || "";
        line2 = value.get('line2') || "";
        line3 = value.get('line3') || "";
        city = value.get('city') || "";
        state = value.get('state') || "";
        postalCode = value.get('postalCode') || "";
        country = value.get('country') || "";
        fmt = XM.Address.format(value);
      }
      this.$.line1.setValue(line1, options);
      this.$.line2.setValue(line2, options);
      this.$.line3.setValue(line3, options);
      this.$.city.setValue(city, options);
      this.$.state.setValue(state, options);
      this.$.postalCode.setValue(postalCode, options);
      this.$.country.setValue(country, options);
      this.$.viewer.addRemoveClass("placeholder", !fmt);
      this.$.viewer.addRemoveClass("hyperlink", fmt);
      this.$.viewer.setContent(fmt || '_none'.loc());
    }
  });

  /**
    @name XV.AddressFieldsWidget
    @class Similar in presentation to XV.AddressWidget except that it is used when you
    want to set each field from a separate attribute of the model, and not
    all at once using an Address model
    @extends XV.AddressWidget
   */
  enyo.kind(/** @lends XV.AddressFieldsWidget# */{
    name: "XV.AddressFieldsWidget",
    kind: "XV.AddressWidget",
    /**
      The originator is the field within the address, and the workspace
      relies on looking at the attr attribute within the originator
      to know which model field to update. This information is
      actually kept in a hash in the attr attibute of this AddressWidget,
      so find it there.

      Unlike the function that this is overriding, we don't update the model
      in this kind because this kind is not backed by a model. We send the
      event up to the workspace to be saved on that model.
     */
    inputChanged: function (inSender, inEvent) {
      var fieldName = inEvent.originator.name,
        modelAttribute = this.attr[fieldName];

      inEvent.originator.attr = modelAttribute;
      inEvent.value = inEvent.originator.getValue();
      this.doValueChange(inEvent);
      return true;
    },
    /**
      When each text field is backed by a model attribute on the master
      model, we never want to do the complicated business logic that
      operates on an address-wide scale.
     */
    saveAddress: function () {
      // do nothing
    },
    /**
      @param {Object} values This is a hash of assignments in the form
        {name: "Toy Truck", line1: "123 Main Street", ... }
      @param {Object} options
    */
    setValue: function (values, options) {
      var that = this,
        inEvent;

      // hack to make the model-specific code in the superkind work.
      // makes this hash behave a (tiny) bit like a model
      if (!values.get) {
        values = _.clone(values);
        values.get = function (prop) {
          return this[prop];
        };
      } else {
        // There is a case where a real model gets sent here, which is when
        // an address was searched for. This is tricky because we have to notify
        // the workspace to change each individual field.
        _.each(this.attr, function (value, key) {
          inEvent = {};
          inEvent.originator = {attr: value};
          inEvent.value = values.get(key);
          if (inEvent.value !== undefined) {
            that.doValueChange(inEvent);
          }
        });
      }

      // make sure that the state combobox is filtered properly
      this.$.state.setCountry(values.get("country"));

      this.value = values;
      this.valueChanged(values, options);
    }
  });
}());
