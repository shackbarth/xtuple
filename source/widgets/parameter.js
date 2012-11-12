/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XT:true, XV:true, _:true, console:true */

(function () {

  /**
    A particular widget filter contained in a {@link XV.ParameterWidget}.

    @class
    @name XV.ParameterItem
    @see XV.ParameterWidget
   */
  enyo.kind(/** @lends XV.ParameterItem# */{
    name: "XV.ParameterItem",
    classes: "xv-parameter-item",
    published: {
      value: null,
      label: "",
      filterLabel: "",
      attr: "",
      operator: "",
      isCharacteristic: false
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
        attr = this.getAttr(),
        value = this.getValue();
      if (attr && value) {
        param = {
          attribute: attr,
          operator: this.getOperator(),
          isCharacteristic: this.getIsCharacteristic(),
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
    setValue: function (value, options) {
      this.$.input.setValue(value, options);
    }

  });

  /**
    The panel of the advanced search feature.

    @class
    @name XV.ParameterWidget
    @extends enyo.FittableRows
    @extends XV.ExtensionsMixin
    @see XV.ParameterItem
  */
  var parameterWidgetHash = {
    name: "XV.ParameterWidget",
    kind: "FittableRows",
    classes: "xv-groupbox",
    handlers: {
      onParameterChange: "memoize"
    },
    published: {
      memoizeEnabled: true,
      characteristicsRole: undefined
    },
    defaultKind: "XV.ParameterItem",
    isAllSetUp: false,
    create: function () {
      var role = this.getCharacteristicsRole(),
        K = XM.Characteristic,
        that = this,
        chars,
        hash = {};
      this.inherited(arguments);
      this.processExtensions();
      this.populateFromCookie();
      this.isAllSetUp = true;
      
      if (role) {
        hash[role] = true;
        if (XM.characteristics.where(hash).length) {
          // Header
          this.createComponent({
            kind: "onyx.GroupboxHeader",
            content: "_characteristics".loc()
          });
        
          // Process text and list
          chars = XM.characteristics.filter(function (char) {
            var type = char.get('characteristicType');
            return char.get(role) &&
              char.get('isSearchable') &&
              (type === K.TEXT || type === K.LIST);
          });
        
          _.each(chars, function (char) {
            var kind;
            hash = {
              name: char.get('name') + "Characteristic",
              label: char.get('name'),
              isCharacteristic: true,
              attr:  char.get('name')
            };
            if (char.get('characteristicType') === K.LIST) {
              kind = enyo.kind({
                kind: "XV.PickerWidget",
                idAttribute: "value",
                nameAttribute: "value",
                create: function () {
                  this.inherited(arguments);
                  this.buildList();
                },
                filteredList: function () {
                  return char.get('options').models;
                },
                getValue: function () {
                  return this.value ? this.value.get('value') : null;
                }
              });
              hash.defaultKind = kind;
            }
            that.createComponent(hash);
          });
          
          // Process dates
          chars = XM.characteristics.filter(function (char) {
            var type = char.get('characteristicType');
            return char.get(role) &&
              char.get('isSearchable') &&
              (type === K.DATE);
          });
        
          _.each(chars, function (char) {
            that.createComponent({
              kind: "onyx.GroupboxHeader",
              content: char.get('name').loc()
            });
          
            hash = {
              name: char.get('name') + "FromCharacteristic",
              label: "_from".loc(),
              filterLabel: char.get('name') + " " + "_from".loc(),
              operator: "<=",
              attr:  char.get('name'),
              isCharacteristic: true,
              defaultKind: "XV.DateWidget"
            };
            that.createComponent(hash);
          
            hash = {
              name: char.get('name') + "ToCharacteristic",
              label: "_to".loc(),
              filterLabel: char.get('name') + " " + "_to".loc(),
              operator: ">=",
              attr:  char.get('name'),
              isCharacteristic: true,
              defaultKind: "XV.DateWidget"
            };
            that.createComponent(hash);
          });
        }
      }
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
      Retrieves parameter values. By default returns values as human readable
      strings. Boolean options are:
        * name - If true returns the parameter item control name, otherwise returns the label.
        * value - If true returns the control value, other wise returns a human readable string.
        * deltaDate - If true returns as string for the date difference for date widgets. (i.e. "+5").
      @param {Object} options
    */
    getSelectedValues: function (options) {
      options = options || {};
      var values = {},
        componentName,
        component,
        value,
        label,
        control,
        date,
        today,
        days;

      for (componentName in this.$) {
        if (this.$[componentName] instanceof XV.ParameterItem &&
            this.$.hasOwnProperty(componentName)) {
          component = this.$[componentName];
          value = component.getValue();
          label = options.name ?
            component.getName() :
            component.getFilterLabel() || component.getLabel();
          control = component.$.input;
          if (value) {
            if (options.deltaDate &&
                component.$.input.kind === 'XV.DateWidget') {
              today = XT.date.today();
              date = XT.date.applyTimezoneOffset(control.getValue(), true);
              days = XT.date.daysBetween(date, today);
              days = days < 0 ? "" + days : "+" + days;
              values[label] = days;
            } else if (options.value) {
              values[label] = value instanceof XM.Model ? value.id : value;
            } else {
              values[label] = control.getValueToString ?
                control.getValueToString() : value;
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
      if (!this.getMemoizeEnabled()) { return; }
      var values,
        dbName,
        cookieName;

      if (!this.isAllSetUp) {
        // no need to set any cookies during the create method
        return;
      }

      values = this.getSelectedValues({
        name: true,
        value: true,
        deltaDate: true
      });
      dbName = XT.session.details.organization;
      cookieName = 'advancedSearchCache_' + dbName + '_' + this.name;
      enyo.setCookie(cookieName, JSON.stringify(values));
    },
    populateFromCookie: function () {
      if (!this.getMemoizeEnabled()) { return; }
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
          item = this.$[name];
          if (item) {
            item.setValue(savedValue, {silent: true});
          }
        }
      }
    },
    setParameterItemValues: function (items) {
      var that = this;
      _.each(items, function (item) {
        if (that.$[item.name]) {
          that.$[item.name].setValue(item.value, {silent: true});
        }
      });
    }
  };

  parameterWidgetHash = enyo.mixin(parameterWidgetHash, XV.ExtensionsMixin);
  enyo.kind(parameterWidgetHash);

}());
