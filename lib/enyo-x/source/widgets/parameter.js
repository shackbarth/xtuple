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
     Sets up widget in parameter item.
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
     Sets the label value of the parameter item to that
     specified in the kind definition.
     */
    labelChanged: function () {
      this.$.input.setLabel(this.label);
    },
    /**
     Returns the search parameter object.
     */
    getParameter: function () {
      var param,
        attr = this.getAttr(),
        value = this.getValue();
      if (attr && !_.isEmpty(value)) {
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
     Returns the value of the parameter.
     */
    getValue: function () {
      var value = this.$.input.getValue();
      if (value && this.$.input.valueAttribute) {
        value = value.get(this.$.input.valueAttribute);
      }
      return value;
    },
    /**
     This stores the originating parameter item and it's value
     in an event and bubbles up a parameter change to the
     parent (Navigator).
     */
    parameterChanged: function () {
      var inEvent = { value: this.getValue, originator: this };
      this.doParameterChange(inEvent);
      return true; // stop right here
    },
    /**
     Sets the value of the parameter item.
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
    classes: "xv-groupbox xv-parameter",
    handlers: {
      onFilterSave: "saveFilter",
      onFilterChange: "loadFilter",
    },
    events: {
      onParameterChange: ""
    },
    published: {
      characteristicsRole: undefined,
      showSaveFilter: true,
      defaultFilter: null
    },
    defaultParameters: null,
    defaultKind: "XV.ParameterItem",
    isAllSetUp: false,
    /**
     Setup function for the parameter widget which adds the
     filter add/manage form to the top of the kind and the
     characteristics to the bottom of the kind. Also loads
     the last filter choice and sets the parameter values for
     this choice.
     */
    create: function () {
      var role = this.getCharacteristicsRole(),
        K = XM.Characteristic,
        that = this,
        chars,
        hash = {};
      this.inherited(arguments);
      // set the published property with the params object
      // from the defaults if it exists
      // using _.result here because defaultParameters may be a function
      this.setDefaultFilter(_.result(this, 'defaultParameters'));
      if (this.getShowSaveFilter()) {
        // Add the save/manage filter form to the component array.
        // The "null" value of addBefore will add this
        // component to the beginning of the array.
        this.createComponent({kind: "XV.FilterForm", addBefore: null});
      }
      // this populates the last picker value
      this.populateFromUserPref();
      this.processExtensions();
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
      When the default filter is set, populate the
      params with the values.
    */
    defaultFilterChanged: function () {
      // if defaults are null, this does nothing
      this.populateParameters(this.getDefaultFilter());
    },
    /**
     Returns an array of the parameter search objects.
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
        if (param) {
          // using union instead of push here in case param is an array of params
          params = _.union(params, param);
        }
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
      Receives the event from the filter form with the user-
      entered values and combines these with the filter values
      for a save.
      If the filter name already exists, it performs an edit
      instead of a new.
    */
    saveFilter: function (inSender, inEvent) {
      var Klass = XT.getObjectByName("XM.Filter"),
        model = inEvent.model,
        options = {}, attrs = {},
        params = JSON.stringify(this.getSelectedValues({
          name: true,
          value: true,
          deltaDate: true
        })),
        success,
        that = this;

      if (!model) {
        // there is not already a model
        model = new Klass(null, {isNew: true});
      }
      // set the values from the save event and save
      model.set("name", inEvent.filterName);
      model.set("shared", inEvent.isShared);
      model.set("params", params);
      model.set("kind", that.kind);
      options.success = function (model, resp, options) {
        // dear filter form, we're all done here!
        inEvent.callback(model);
      };
      if (model.isDirty()) {
        model.save(null, options);
      } else {
        options.success(model);
      }
    },
    /**
      Gets the filter model from the filter change
      event and populates the fields with parameter
      values from the model.
    */
    loadFilter: function (inSender, inEvent) {
      var model = inEvent.model,
        params = model ? model.get("params") : null,
        kind = this.kind,
        payload = JSON.stringify(model),
        operation;

      // clear out the existing filters before populating this one
      this.clearParameters();

      // save this filter to the user preference
      operation = XT.DataSource.getUserPreference(kind) ? "replace" : "add";
      XT.DataSource.saveUserPreference(kind, payload, operation);

      // save this filter to the preference cache
      XT.session.preferences.set(kind, payload);

      // if there are no parameters, take the defaults
      params = params ? params : this.getDefaultFilter();

      // populate the parameters with filter or defaults
      this.populateParameters(params);
    },
    /**
      Clear all of the currently loaded parameters and bubble
      parameter change events.
    */
    clearParameters: function () {
      _.each(this.$, function (item) {
        if (item instanceof XV.ParameterItem && item.showing) {
          item.$.input.clear();
        }
      });
      this.doParameterChange();
    },
    /**
      Loops through the values in the params object
      and sets the value on the parameter fields and
      bubbles up the change events.
    */
    populateParameters: function (params) {
      params = _.isObject(params) ? params : JSON.parse(params);
      _.each(params, function (value, key) {
        var param = this.$[key];
        if (param) {
          param.setValue(value, {silent: true});
        }
      }, this);
      this.doParameterChange();
    },
    /**
      Reads the last filter value from the user preferences
      and populates the filter picker with this value.
     */
    populateFromUserPref: function () {
      var lastFilter,
        kind = this.kind;

      // we have a cache of preferences, so find the last
      // selected filter for this kind
      lastFilter = XT.DataSource.getUserPreference(kind);

      // if there is a last filter for this kind,
      // and it isn't null, set the filter picker.
      if (lastFilter && lastFilter !== "null") {
        lastFilter = JSON.parse(lastFilter);
        this.$.filterForm.$.filterPicker.setValue(lastFilter.uuid);
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

  /**
    This is a component that includes the picker for selecting
    saved filters, a save drawer for saving the current filter,
    and a manage drawer for sharing and deleting filters.
  */
  enyo.kind(
    /** @lends XV.FilterForm# */{
    name: "XV.FilterForm",
    classes: "xv-filter-form",
    events: {
      onFilterSave: "",
      onFilterChange: ""
    },
    handlers: {
      onValueChange: "valueChanged",
      onCollectionChange: "collectionChanged"
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_filters".loc()},
      {kind: "XV.FilterPicker", label: "_filter".loc()},
      {kind: "XV.TopDrawer", name: "saveTopDrawer", ontap: "activateSave", content: "_saveFilter".loc()},
      {kind: "onyx.Drawer", name: "saveDrawer", open: false, animated: true, components: [
        {kind: "onyx.GroupboxHeader", content: "_saveFilter".loc()},
        {kind: "XV.InputWidget", name: "filterName", label: "_filterName".loc()},
        {kind: "XV.CheckboxWidget", name: "isShared", attr: "isShared", label: "_isShared".loc()},
        {kind: "FittableColumns", classes: "button-row", components: [
          {kind: "onyx.Button", name: "apply", disabled: true, content: "_apply".loc(), ontap: "checkExisting"},
          {kind: "onyx.Button", content: "_cancel".loc(), ontap: "activateSave"}
        ]}
      ]},
      {kind: "XV.TopDrawer", name: "manageTopDrawer", ontap: "activateManage", content: "_manageFilters".loc()},
      {kind: "onyx.Drawer", name: "manageDrawer", open: false, animated: true, components: [
        {kind: "onyx.GroupboxHeader", content: "_manageFilters".loc()},
        {kind: "XV.FilterList", name: "filterList", allowFilter: false},
        {kind: "FittableColumns", classes: "button-row", components: [
          {kind: "onyx.Button", content: "_done".loc(), ontap: "activateManage"}
        ]}
      ]},
      {kind: "onyx.Popup", name: "existingPopup", centered: true,
        modal: true, floating: true, scrim: true, components: [
        {content: "_filterExists".loc()},
        {content: "_editFilter?".loc()},
        {tag: "br"},
        {kind: "onyx.Button", content: "_edit".loc(), ontap: "saveFilter",
          classes: "onyx-blue xv-popup-button"},
        {kind: "onyx.Button", content: "_cancel".loc(), ontap: "hidePopup",
          classes: "xv-popup-button"}
      ]},
    ],
    /**
      Opens the save drawer and switches the drawer icons.
    */
    activateSave: function (inSender, inEvent) {
      this.$.saveDrawer.setOpen(!this.$.saveDrawer.open);
      this.$.saveTopDrawer.changeIcon(this.$.saveDrawer.open);
    },
    /**
      Opens the manage filter drawer and switches the
      drawer icons.
    */
    activateManage: function (inSender, inEvent) {
      this.$.filterList.fetch();
      this.$.filterList.reset();
      this.$.manageDrawer.setOpen(!this.$.manageDrawer.open);
      this.$.manageTopDrawer.changeIcon(this.$.manageDrawer.open);
    },
    /**
      This is called by the save/apply button in the
      save drawer. It checks for an existing filter and
      shows the warning popup or continues to the save.
    */
    checkExisting: function (inSender, inEvent) {
      var name = this.$.filterName.getValue(),
        exists = this.filterExists(name);
      if (exists) {
        this.$.existingPopup.show();
      } else {
        this.saveFilter(inSender, inEvent);
      }
    },
    /**
      There was a change to the list collection and a model
      was added or removed. Refresh list and picker.
    */
    collectionChanged: function (inSender, inEvent) {
      inEvent = inEvent || {};
      this.$.filterPicker.collectionChanged();
      // a model was deleted
      if (inEvent.delete && inEvent.model === this.$.filterPicker.getValue()) {
        this.$.filterPicker.setValue(null);
      }
      // when an item is deleted, have the item selected
      // fire again with the new collection
      this.$.filterList.fetch();
      this.$.filterList.reset();
    },
    /**
      Sets the default filters for the filter picker and the
      list of filters that can be managed. Fetches data for
    */
    create: function () {
      this.inherited(arguments);
      this.$.apply.setDisabled(!this.validate());

      // filter the filter picker
      var filter = function (models, options) {
        var filtered = _.filter(models, function (model) {
          var kind = this.parent.parent.kind === model.get("kind");
          var permission = model.get("shared") ||
            model.get("createdBy") === XM.currentUser.get("username");
          if (kind && permission) {
            return true;
          }
        }, this);
        return filtered;
      };
      this.$.filterPicker.filter = filter;
      this.$.filterPicker.collectionChanged();

      // filters the manage list
      var query =  this.$.filterList.getQuery() || {};
      query.parameters = [];
      query.parameters = [{
        attribute: "createdBy",
        operator: "=",
        value: XT.session.details.username
      },
      {
        attribute: "kind",
        operator: "=",
        value: this.parent.kind
      }];

      this.$.filterList.setQuery(query);
      this.$.filterList.fetch();
    },
    /**
      Looks at the list of filters for the current user and determines
      if a filter exists by name.
    */
    filterExists: function (name) {
      var exists = _.find(this.$.filterList.getValue().models,
        function (model) {
          return model.get("name") === name;
        });
      return exists;
    },
    hidePopup: function (inSender, inEvent) {
      this.$.existingPopup.hide();
    },
    /**
      This is called by the save/apply button in the
      save drawer. It bubbles up the event to the parameter
      widget with a callback so it knows when the save was
      successful. It then closes the drawer and refreshes
      the filter collections.
    */
    saveFilter: function (inSender, inEvent) {
      var name = this.$.filterName.getValue(),
        shared = this.$.isShared.getValue(),
        exists = this.filterExists(name),
        that = this;

      inEvent = {model: exists, filterName: name, isShared: shared,
        callback: function (model) {
          if (!exists) {
            that.$.filterList.getValue().add(model);
          }
          that.activateSave(); // close the save drawer
          that.$.existingPopup.hide(); // hide the popup if it was showing
          that.collectionChanged();
          that.$.filterPicker.setValue(model);
        }};
      this.doFilterSave(inEvent);
    },
    /**
      Checks that all of the form fields have
      been completed.
    */
    validate: function () {
      if (this.$.filterName.getValue()) {
        return true;
      }
      return false;
    },
    /**
      When a filter is selected from the picker, the
      form fields are populated and a filter changed
      event is bubbled up to the parameter widget.
    */
    valueChanged: function (inSender, inEvent) {
      this.$.apply.setDisabled(!this.validate());
      if (inSender.kind === "XV.FilterPicker") {
        // get values from inEvent for form load
        var value = inEvent.originator.value,
          name = value ? value.get("name") : null,
          shared = value ? value.get("shared") : false;
        this.$.filterName.setValue(name);
        this.$.isShared.setValue(shared);
        inEvent = {model: value};
        this.doFilterChange(inEvent);
      }
      return true;
    }
  });
  /**
    Simple FittableColumns that contains the open/close icon
    and some text. When the ontap event is fired, this control
    is responsible for switching icons and opening a drawer.
  */
  enyo.kind(
    /** @lends XV.TopDrawer */{
    name: "XV.TopDrawer",
    kind: "FittableColumns",
    classes: "top-drawer",
    published: {
      content: ""
    },
    components: [
      {tag: "i", classes: "icon-plus-sign-alt", name: "drawerIcon"},
      {name: "label"}
    ],
    /**
      Switch icons depending on open state of a drawer
    */
    changeIcon: function (drawerOpen) {
      if (drawerOpen) {
        this.$.drawerIcon.setClasses("icon-minus-sign-alt");
      } else {
        this.$.drawerIcon.setClasses("icon-plus-sign-alt");
      }
    },
    contentChanged: function () {
      this.$.label.setContent(this.getContent());
    },
    create: function () {
      this.inherited(arguments);
      this.contentChanged();
    }
  });

}());
