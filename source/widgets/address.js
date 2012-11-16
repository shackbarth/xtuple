/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  /**
    @class
    @name XV.AddressWidget
    @extends FittableRows
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
          {kind: "XV.StateCombobox", name: "state", placeholder: "_state".loc(),
            onValueChange: "inputChanged"}
        ]},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-input-decorator",
          components: [
          {kind: "onyx.Input", name: "postalCode",
            classes: "xv-addresswidget-input",
            placeholder: "_postalCode".loc(), onchange: "inputChanged"}
        ]},
        {kind: "onyx.InputDecorator", fit: true,
          classes: "xv-addresswidget-combobox-decorator",
          components: [
          {kind: "XV.CountryCombobox", name: "country",
            onValueChange: "countryChanged",
            placeholder: "_country".loc()}
        ]},
        {tag: "br"},
        {kind: "onyx.Button", content: "_done".loc(), ontap: "done",
          classes: "onyx-blue"}
      ]}
    ],
    countryChanged: function (inSender, inEvent) {
      var country = this.$.country.getValue();
      this.inputChanged(inSender, inEvent);
      this.$.state.setCountry(country);
      return true;
    },
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
    editButtonKeyUp: function (inSender, inEvent) {
      // Return or space bar activates button
      if (inEvent.keyCode === 13 ||
         (inEvent.keyCode === 32)) {
        this.edit();
      }
      return true;
    },
    inputChanged: function (inSender, inEvent) {
      var value = this.getValue(),
        attr = inEvent.originator.name;
      value.set(attr, this.$[attr].getValue());
      this.setValue(value);
      this.valueChanged();
      inEvent = {
        originator: this,
        value: value
      };
      this.doValueChange(inEvent);
      return true;
    },
    keyUp: function (inSender, inEvent) {
      // Return
      if (inEvent.keyCode === 13) {
        this.done();
      }
    },
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
    editorHidden: function () {
      if (!this._popupDone) {
        this.edit();
      }
    },
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
    searchButtonKeyUp: function (inSender, inEvent) {
      // Return or space bar activates button
      if (inEvent.keyCode === 13 ||
         (inEvent.keyCode === 32)) {
        this.search();
      }
      return true;
    },
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
    pickerTapped: function (inSender, inEvent) {
      if (inEvent.originator.name === "iconButton") {
        this.receiveFocus();
      }
    },
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
}());
