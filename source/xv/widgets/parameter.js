/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XT:true, XV:true, _:true, console:true */

(function () {

  enyo.kind({
    name: "XV.ParameterItem",
    classes: "xv-parameter-item",
    published: {
      value: "",
      label: "",
      attr: "",
      operator: ""
    },
    events: {
      onParameterChange: ""
    },
    handlers: {
      onValueChange: "parameterChanged"
    },
    components: [
      {name: "input", classes: "xv-parameter-item-input"}
    ],
    defaultKind: "XV.InputWidget",
    create: function () {
      this.inherited(arguments);
      this.valueChanged();
      this.labelChanged();
      if (!this.getOperator() && this.defaultKind === "XV.InputWidget") {
        this.setOperator("MATCHES");
      }
    },
    labelChanged: function () {
      this.$.input.setLabel(this.label);
    },
    getParameter: function () {
      var param;
      if (this.getValue()) {
        param = {
          attribute: this.getAttr(),
          operator: this.getOperator(),
          value: this.getValue()
        };
      }
      return param;
    },
    getValue: function () {
      return this.$.input.getValue();
    },
    parameterChanged: function () {
      var inEvent = { value: this.getValue, originator: this };
      this.doParameterChange(inEvent);
      return true; // stop right here
    },
    valueChanged: function () {
      this.$.input.setValue(this.value);
    }
  });

  enyo.kind({
    name: "XV.ParameterWidget",
    kind: "FittableRows",
    classes: "xv-groupbox",
    handlers: {
      onParameterChange: "memoize"
    },
    defaultKind: "XV.ParameterItem",
    isAllSetUp: false,
    create: function () {
      this.inherited(arguments);
      this.isAllSetUp = true;
    },
    getParameters: function () {
      var i,
        param,
        params = [],
        child;
      for (i = 0; i < this.children.length; i++) {
        child = this.children[i];
        param = child && child.getParameter ? child.getParameter() : null;
        if (param) { params.push(param); }
      }
      return params;
    },
    /**
      Remember the state of this parameter widget
     */
    memoize: function (inSender, inEvent) {
      var values = {},
        component,
        componentName,
        components = this.$;

      if (!this.isAllSetUp) {
        // no need to set any cookies during the create method
        return;
      }
      for (componentName in components) {
        if (componentName.indexOf("parameterItem") === 0 && components.hasOwnProperty(componentName)) {
          component = components[componentName];
          if (component.getValue()) {
            values[component.getLabel()] = component.getValue();
          }
        }
      }
      enyo.setCookie(this.name, JSON.stringify(values));
    },
    populateFromCookie: function () {
      var cookieValue = enyo.getCookie(this.name),
        name,
        cookieObject,
        item,
        savedValue;
      if (!cookieValue) {
        // there's no cookie yet for this parameter list
        return;
      }
      cookieObject = JSON.parse(cookieValue);
      for (name in cookieObject) {
        if (cookieObject.hasOwnProperty(name)) {
          savedValue = cookieObject[name];
          item = _.find(this.$, function (component) {
            return component.kind === 'XV.ParameterItem' && component.getLabel() === name;
          });
          if (item) {
            item.setValue(savedValue);
          }
        }
      }
    }
  });

}());
