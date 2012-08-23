/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.AddressWidget",
    kind: "FittableRows",
    classes: "xv-addresswidget",
    published: {
      attr: null,
      value: null
    },
    events: {
      onValueChange: ""
    },
    handlers: {
      onblur: "receiveBlur",
      onfocus: "receiveFocus"
    },
    components: [
      {kind: "enyo.TextArea", name: "viewer", showing: true, fit: true,
        classes: "xv-addresswidget-viewer", placeholder: "_none".loc()},
      {name: "editor", showing: false, fit: true,
        classes: "xv-addresswidget-editor",
        components: [
        {kind: "onyx.Input", name: "line1", showing: false,
          placeholder: "_street".loc(), style: "display: block; width: 100%;",
          classes: "xv-addresswidget-input", onchange: "inputChanged"},
        {kind: "onyx.Input", name: "line2", showing: false,
          style: "display: block; width: 100%;",
          classes: "xv-addresswidget-input", onchange: "inputChanged"},
        {kind: "onyx.Input", name: "line3", showing: false,
          style: "display: block; width: 100%;",
          classes: "xv-addresswidget-input", onchange: "inputChanged"},
        {kind: "onyx.Input", name: "city", placeholder: "_city".loc(),
          showing: false, style: "width: 120px;",
          classes: "xv-addresswidget-input", onchange: "inputChanged"},
        {kind: "onyx.Input", name: "state", placeholder: "_state".loc(),
          showing: false, style: "width: 70px; margin-left: 4px;",
          classes: "xv-addresswidget-input", onchange: "inputChanged"},
        {kind: "onyx.Input", name: "postalCode",  showing: false,
          placeholder: "_postalCode".loc(), style: "width: 120px; margin-left: 4px;",
          classes: "xv-addresswidget-input", onchange: "inputChanged"},
        {kind: "XV.CountryCombobox", name: "country", showing: false,
          onValueChange: "inputChanged",
          placeholder: "_country".loc(),
          style: "display: block; width: 100%;",
          onValueChange: "inputChanged",
          classes: "xv-addresswidget-input"}
      ]}
    ],
    inputChanged: function (inSender, inEvent) {
      var value = this.getValue(),
        attr = inEvent.originator.name;
      if (!value) {
        value = new XM.Address(null, {isNew: true});
      }
      value.set(attr, this.$[attr].getValue());
      this.setValue(value);
      return true;
    },
    receiveBlur: function (inSender, inEvent) {
      this.$.viewer.show();
      this.$.editor.hide();
      this.$.line1.hide();
      this.$.line2.hide();
      this.$.line3.hide();
      this.$.city.hide();
      this.$.state.hide();
      this.$.postalCode.hide();
      this.$.country.hide();
    },
    receiveFocus: function (inSender, inEvent) {
      this.$.viewer.hide();
      this.$.editor.show();
      this.$.line1.show();
      this.$.line2.show();
      this.$.line3.show();
      this.$.city.show();
      this.$.state.show();
      this.$.postalCode.show();
      this.$.country.show();
    },
    setValue: function (value, options) {
      var inEvent,
        oldAttrs = this.value ? this.value.toJSON() : null,
        newAttrs = value ? value.toJSON() : null;
      options = options || {};
      if (_.isEqual(oldAttrs, newAttrs)) { return; }
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
    valueChanged: function () {
      var value = this.getValue(),
        line1 = value.get('line1') || "",
        line2 = value.get('line2') || "",
        line3 = value.get('line3') || "",
        city = value.get('city') || "",
        state = value.get('state') || "",
        postalCode = value.get('postalCode') || "",
        country = value.get('country') || "",
        fmt = XM.Address.format(value);
      this.$.line1.setValue(line1);
      this.$.line2.setValue(line2);
      this.$.line3.setValue(line3);
      this.$.city.setValue(city);
      this.$.state.setValue(state);
      this.$.postalCode.setValue(postalCode);
      this.$.country.setValue(country);
      this.$.viewer.setValue(fmt);
    }

  });
}());
