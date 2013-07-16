/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XM:true, XT:true, XV:true, _:true, console:true */

(function () {

  /**
    @name XV.ParameterItem
    @class An input control for the Advanced Search feature
    in which the user specifies one or more search parameters.<br />
    Represents one search parameter.
    A component of {@link XV.ParameterWidget}.
   */
  enyo.kind(
    /** @lends XV.ParameterItem# */{
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
    /**
     @todo Document the create method.
     */
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
      if (!this.getOperator() && this.defaultKind === "XV.InputWidget") {
        this.setOperator("MATCHES");
      } else if (this.$.input instanceof XV.Picker) {
        this.$.input.setNoneText("_any".loc());
      }
    },
    /**
     @todo Document the labelChanged method.
     */
    labelChanged: function () {
      this.$.input.setLabel(this.label);
    },
    /**
     @todo Document the getParameter method.
     */
    getParameter: function () {
      var param,
        attr = this.getAttr(),
        value = this.getValue();
      if (attr && value !== undefined && value !== null) {
        param = {
          attribute: attr,
          operator: this.getOperator(),
          isCharacteristic: this.getIsCharacteristic(),
          value: value
        };
      }
      return param;
    },
    /**
     @todo Document the getValue method.
     */
    getValue: function () {
      var value = this.$.input.getValue();
      if (value && this.$.input.valueAttribute) {
        value = value.get(this.$.input.valueAttribute);
      }
      return value;
    },
    /**
     @todo Document the parameterChanged method.
     */
    parameterChanged: function () {
      var inEvent = { value: this.getValue, originator: this };
      this.doParameterChange(inEvent);
      return true; // stop right here
    },
    /**
     @todo Document the setValue method.
     */
    setValue: function (value, options) {
      this.$.input.setValue(value, options);
    }

  });

  /**
    @name XV.ParameterWidget
    @class Contains a set of fittable rows to implement the Advanced Search feature.<br />
    Each row is a {@link XV.ParameterItem} and represents a parameter on which
    the user can narrow the search results.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.FittableRows">enyo.FittableRows</a>.
    @extends enyo.FittableRows
  */
  enyo.kind(enyo.mixin(/** @lends XV.ParameterWidget# */{
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
    /**
     @todo Document the create method.
     */
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
              operator: ">=",
              attr:  char.get('name'),
              isCharacteristic: true,
              defaultKind: "XV.DateWidget"
            };
            that.createComponent(hash);

            hash = {
              name: char.get('name') + "ToCharacteristic",
              label: "_to".loc(),
              filterLabel: char.get('name') + " " + "_to".loc(),
              operator: "<=",
              attr:  char.get('name'),
              isCharacteristic: true,
              defaultKind: "XV.DateWidget"
            };
            that.createComponent(hash);
          });
        }
      }
    },
    /**
     @todo Document the getParameters method.
     */
    getParameters: function () {
      var i,
        param,
        params = [],
        child;
      for (i = 0; i < this.children.length; i++) {
        child = this.children[i];
        param = child && child.showing && child.getParameter ?
          child.getParameter() : null;
        if (param) { params.push(param); }
      }
      return params;
    },
    /**
      Retrieves parameter values. By default returns values as human readable
      strings. Boolean options are:<br />
        &#42; name - If true returns the parameter item control name, otherwise returns the label.<br />
        &#42; value - If true returns the control value, other wise returns a human readable string.<br />
        &#42; deltaDate - If true returns as string for the date difference for date widgets. (i.e. "+5").
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
            this.$[componentName].showing &&
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
     Remember the state of this parameter widget.
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
    /**
     @todo Document the populateFromCookie method.
     */
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
    /**
      Accepts an array of items to push into the parameter items. Matches item name
      to component under the assumption that there will be a component by the
      name of the incoming name (which itself is the name of the model attribute).
      Fails silently if it cannot find the name.

      @param {Array} items
      @param {Array|String} [item.name] A string *or an array of strings* with the name or attr of
        the attribute to be updated. In the case of an array, this function will set
        any component that matches any of the names, and ignore the rest.
      @param {Object|String|Number} [item.value] The payload of the setValue to the ParameterItem.
      @param {Boolean} [item.showing]  Set to false to completely hide and disable the parameter.
     */
    setParameterItemValues: function (items) {
      var that = this,
        setValueOnMatch = function (name, item) {
          var control = that.$[name] || _.find(that.$, function (ctl) {
            // look up controls by name or by the model attribute they map to
            return ctl.attr === name;
          });
          if (control) {
            if (item.showing !== false) {
              control.setValue(item.value, {silent: true});
            }
            control.setShowing(item.showing !== false);
          }
        };

      _.each(items, function (item) {
        if (typeof item.name === 'string') {
          // string case. set the component by this name
          setValueOnMatch(item.name, item);
        } else if (typeof item.name === 'object') {
          // array case. loop through item.name and set any matches
          _.each(item.name, function (subname) {
            setValueOnMatch(subname, item);
          });
        }
      });
    }
  }, XV.ExtensionsMixin));

}());
