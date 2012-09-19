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
      var param,
        value = this.getValue();
      if (value) {
        param = {
          attribute: this.getAttr(),
          operator: this.getOperator(),
          value: value
        };
      }
      return param;
    },
    getValue: function () {
      var value = this.$.input.getValue();
      if (value && this.$.input.valueAttribute) {
        value = value.get(this.$.input.valueAttribute);
      }
      return value;
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

      var that = this,
        callback = function () {
          that.populateFromCookie();
        };

      XT.getStartupManager().registerCallback(callback, true);

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
    getSelectedValues: function () {
      var values = {},
        componentName,
        component,
        value,
        label,
        control;

      for (componentName in this.$) {
        if (componentName.indexOf("parameterItem") === 0 && this.$.hasOwnProperty(componentName)) {
          component = this.$[componentName];
          value = component.getValue();
          label = component.getLabel();
          control = component.$.input;
          if (value) {
            if (control instanceof XV.RelationWidget) {
              values[label] = value.get(control.getKeyAttribute());
            } else if (control instanceof XV.PickerWidget) {
              values[label] = value.get(control.getNameAttribute());
            } else if (control instanceof XV.DateWidget) {
              values[label] = control.toString();
            } else {
              // default case: save the value in the cookie
              values[label] = value;
            }
          }
        }
      }
      return values;
    },
    /**
      Remember the state of this parameter widget
     */
    memoize: function (inSender, inEvent) {
      var values,
        dbName,
        cookieName;

      if (!this.isAllSetUp) {
        // no need to set any cookies during the create method
        return;
      }

      values = this.getSelectedValues();
      dbName = XT.session.details.organization;
      cookieName = 'advancedSearchCache_' + dbName + '_' + this.name;
      enyo.setCookie(cookieName, JSON.stringify(values));
    },
    populateFromCookie: function () {
      var dbName = XT.session.details.organization,
        cookieName = 'advancedSearchCache_' + dbName + '_' + this.name,
        cookieValue = enyo.getCookie(cookieName),
        name,
        cookieObject,
        item,
        savedValue;
      if (!cookieValue || cookieValue === 'undefined') {
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
