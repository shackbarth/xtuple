/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  /**
    @name XV.AddressWidget
    @class Contains a set of fittable rows made up of
    controls for inputting and viewing addresses,
    including the popup for adding or editing them.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.FittableRows">enyo.FittableRows</a>.
    @extends enyo.FittableRows
   */
  enyo.kind(/** @lends XV.AddressWidget# */{
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
      onValueChange: ""
    },
    handlers: {
      onkeyup: "keyUp"
    },
    components: [
      {name: "viewer", showing: true, fit: true, allowHtml: true,
        classes: "xv-addresswidget-viewer", placeholder: "_none".loc()},
      {kind: "FittableColumns", classes: "xv-addresswidget-buttons",
        components: [
        {kind: "onyx.Button", name: "editButton", content: "_edit".loc(),
          ontap: "edit", onkeyup: "editButtonKeyUp",
          classes: "xv-addresswidget-button"},
        {kind: "onyx.Button", name: "searchButton", content: "_search".loc(),
          ontap: "search", onkeyup: "searchButtonKeyUp",
          classes: "xv-addresswidget-button"}
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
            onValueChange: "countryChanged",
            placeholder: "_country".loc()}
        ]},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-combobox-decorator",
          components: [
          {kind: "XV.StateCombobox", name: "state", placeholder: "_state".loc(),
            onValueChange: "inputChanged"}
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
    @todo Document the countryChanged method.
    */
    countryChanged: function (inSender, inEvent) {
      var country = this.$.country.getValue();
      this.inputChanged(inSender, inEvent);
      this.$.state.setCountry(country);
      return true;
    },
    /**
    @todo Document the done method.
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
      if (this._nextWidget) { this._nextWidget.focus(); }
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
    @todo Document the inputChanged method.
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
    @todo Document the keyUp method.
    */
    keyUp: function (inSender, inEvent) {
      // Return
      if (inEvent.keyCode === 13) {
        this.done();
      }
    },
    /**
    @todo Document the edit method.
    */
    edit: function (inSender, inEvent) {
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
    @todo Document the editorHidden method.
    */
    editorHidden: function () {
      if (!this._popupDone) {
        this.edit();
      }
    },
    /**
    @todo Document the search method.
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
          value: account
        });
      }
      this.doSearch({
        list: list,
        callback: callback,
        parameterItemValues: parameterItemValues
      });
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
    /**
    @todo Document the setValue method.
    */
    setValue: function (value, options) {
      var inEvent,
        oldId = this.value ? this.value.id : null,
        newId = value ? value.id : null;
      options = options || {};
      if (newId === oldId) { return; }
      this.value = value;
      this.valueChanged();
      if (!options.silent) {
        inEvent = {
          originator: this,
          value: value
        };
        this.doValueChange(inEvent);
      }
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
    @todo Document the valueChanged method.
    */
    valueChanged: function () {
      var value = this.getValue(),
        line1 = "",
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
      this.$.line1.setValue(line1);
      this.$.line2.setValue(line2);
      this.$.line3.setValue(line3);
      this.$.city.setValue(city);
      this.$.state.setValue(state);
      this.$.postalCode.setValue(postalCode);
      this.$.country.setValue(country);
      this.$.viewer.addRemoveClass("placeholder", !fmt);
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
      We have make a single tweak to inEvent as it flies by.
      The originator is the field within the address, and the workspace
      relies on looking at the attr attribute within the originator
      to know which model field to update. This information is
      actually kept in a hash in the attr attibute of this AddressWidget,
      so find it there and slap it on.
     */
    inputChanged: function (inSender, inEvent) {
      var fieldName = inEvent.originator.name,
        modelAttribute = this.attr[fieldName];

      inEvent.originator.attr = modelAttribute;
    },
    setValue: function (values, options) {
      var values = _.clone(values);
      // hack to make the model-specific code in the superkind work.
      // makes this hash behave a (tiny) bit like a model
      values.get = function (prop) {
        return this[prop];
      }
      this.value = values;
      this.valueChanged();
    }
  });
}());
