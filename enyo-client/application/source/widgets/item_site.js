/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, window:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // ITEM SITE
  //

  var _privateItemSiteWidget = enyo.kind({
    kind: "XV.RelationWidget",
    collection: "XM.ItemSiteRelationCollection",
    list: "XV.ItemSiteList",
    keyAttribute: ["number", "barcode"],
    nameAttribute: "item.description1",
    descripAttribute: "item.description2",
    skipCompleterFilter: true,
    classes: "xv-private-item-site-widget",
    // Key search: give the search attribute special treatment on the server
    keySearch: true
  });

  enyo.kind({
    name: "XV.ItemSiteWidget",
    published: {
      item: null,
      site: null,
      sites: null,
      attr: null,
      value: null,
      placeholder: null,
      disabled: false,
      query: null,
      isEditableKey: "item",
      horizontalOrientation: false
    },
    handlers: {
      "onValueChange": "controlValueChanged"
    },
    events: {
      "onValueChange": ""
    },
    components: [
      {kind: "enyo.Control", name: "fittableContainer",
      components: [
        {kind: _privateItemSiteWidget, name: "privateItemSiteWidget",
          label: "_item".loc()},
        {kind: "XV.SitePicker", name: "sitePicker", label: "_site".loc()}
      ]}
    ],
    /**
      Add a parameter to the query object on the widget. Parameter conventions should
      follow those described in the documentation for `XM.Collection`.

      @seealso XM.Collection
      @param {Object} Param
      @returns {Object} Receiver
    */
    addParameter: function (param) {
      this.$.privateItemSiteWidget.addParameter(param);
    },
    /**
      Empty out the widget
     */
    clear: function (options) {
      this.$.privateItemSiteWidget.clear(options);
    },
    controlValueChanged: function (inSender, inEvent) {
      var value = inEvent.value,
        sitePicker = this.$.sitePicker,
        disabledCache = sitePicker.getDisabled(),
        isNull = _.isNull(value),
        that = this,
        itemSite,
        options = {},
        site,
        item;
      if (inEvent.originator.name === 'privateItemSiteWidget') {
        sitePicker.itemSites.reset();
        sitePicker.buildList();
        if (value && value.get) {
          item = value.get("item");
          site = value.get("site");
          this.setValue({
            item: item,
            site: site
          }); // In case an id was transformed to a model
          // Don't allow another selection until we've fetch an updated list
          sitePicker.setDisabled(true);
          // Go fetch alternate sites for this item
          options.query = { parameters: [{attribute: "item", value: item}]};
          options.success = function () {
            sitePicker.buildList();
            sitePicker.setValue(site);
            sitePicker.setDisabled(disabledCache || that.getDisabled());
          };
          sitePicker.itemSites.fetch(options);
        }
        return true;
      } else if (inEvent.originator.name === 'sitePicker') {
        this.setValue({site: value});
        this.$.privateItemSiteWidget.setDisabled(isNull);
        if (isNull) {
          this.$.privateItemSiteWidget.clear();
        } else {
          itemSite = this.$.privateItemSiteWidget.getValue();
          // Change item site selection if the site changed
          if (itemSite && itemSite.getValue("site.id") !== value &&
              sitePicker.itemSites.length) {
            itemSite = _.find(sitePicker.itemSites.models, function (model) {
              return model.getValue("site.id") === value;
            });
            this.$.privateItemSiteWidget.setValue(itemSite);
          }
        }
        return true;
      }
    },
    create: function () {
      this.inherited(arguments);
      // Filter for site picker. Limit list of models if item sites
      // are specified
      var filter = function (models, options) {
          var ids;
          if (this.itemSites.length) {
            // Consolidate all the site ids
            ids = _.pluck(_.compact(_.pluck(_.pluck(this.itemSites.models, "attributes"), 'site')), 'id');
            return _.filter(models, function (model) {
              return _.contains(ids, model.id);
            });
          }
          return models;
        },
        callback,
        that = this;

      this.$.sitePicker.itemSites = new XM.ItemSiteRelationCollection();
      this.$.sitePicker.filter = filter;
      this.$.sitePicker.$.pickerButton.setAttribute("tabIndex", -1);

      // Keep track of requests, we'll ignore stale ones
      this._itemSiteCounter = 0;

      if (this.getHorizontalOrientation()) {
        this.$.fittableContainer.setLayoutKind("FittableColumnsLayout");
      } else {
        this.$.fittableContainer.setLayoutKind("FittableRowsLayout");
      }

      //
      // Prevent an ugly thick line if the site picker is hidden.
      //
      callback = function () {
        if (!XT.session.settings.get("MultiWhs")) {
          that.$.privateItemSiteWidget.applyStyle("border-bottom-width", "0px");
        }
      };
      // If not everything is loaded yet, come back to it later
      if (!XT.session || !XT.session.settings) {
        XT.getStartupManager().registerCallback(callback);
      } else {
        callback();
      }

      this._itemSites = new XM.ItemSiteRelationCollection();
      this.queryChanged();
    },
    /**
     @todo Document the focus method.
     */
    focus: function () {
      this.$.privateItemSiteWidget.focus();
    },
    placeholderChanged: function () {
      var placeholder = this.getPlaceholder();
      this.$.privateItemSiteWidget.setPlaceholder(placeholder);
    },
    queryChanged: function () {
      this.$.privateItemSiteWidget.setQuery(this.getQuery());
    },
    /**
      Removes a query parameter by attribute name from the widget's query object.

      @param {String} Attribute
      @returns {Object} Receiver
    */
    removeParameter: function (attr) {
      this.$.privateItemSiteWidget.removeParameter(attr);
    },
    disabledChanged: function () {
      var isDisabled = this.getDisabled();
      this.$.privateItemSiteWidget.setDisabled(isDisabled);
      this.$.sitePicker.setDisabled(isDisabled);
    },

    itemChanged: function () {
      var item = this.getItem(),
        site = this.getSite(),
        options = {},
        that = this,
        i;

      if (item && site) {
        // Keep track of requests, we'll ignore stale ones
        this._itemSiteCounter = this._itemSiteCounter + 1;
        i = this._itemSiteCounter;
        options.query = {
          parameters: [
            {
              attribute: "item",
              value: item
            },
            {
              attribute: "site",
              value: site
            }
          ]
        };
        options.success = function () {
          // I only smell freshness
          if (i < that._itemSiteCounter) { return; }

          if (!that.destroyed && that._itemSites.length) {
            that.$.privateItemSiteWidget.setValue(that._itemSites.at(0));
          }
        };
        this._itemSites.fetch(options);
      } else if (!item) {
        this.$.privateItemSiteWidget.clear();
      }
    },
    siteChanged: function () {
      var site = this.getSite(),
        item = this.getItem();
      this.$.sitePicker.setValue(site, {silent: true});
      if (site) {
        this.$.privateItemSiteWidget.addParameter({
          attribute: "site.code",
          value: site.id ? site.id : site
        }, true);
      } else {
        this.$.privateItemSiteWidget.removeParameter("site.code");
      }
      this.itemChanged();
    },
    validate: function (value) {
      return value;
    },
    /**
      This setValue function handles a value which is an
      object potentially consisting of multiple key/value pairs for the
      item and site controls.

      @param {Object} Value
      @param {Object} [value.item] Item
      @param {Date} [value.site] Site
    */
    setValue: function (value, options) {
      options = options || {};
      var attr = this.getAttr(),
        that = this,
        changed = {},
        hasChanges = false,
        old = {},
        keys = _.keys(value),
        key,
        i,
        expireFetches = _.once(function () {
          that._itemSiteCounter++;
        });

      // Loop through the properties and update them directly,
      // then call the appropriate "set" functions and add to "changed"
      // object if applicable. We want to make sure that both item
      // and site are set to their new, appropriate values before
      // functions like itemChanged or siteChanged get called, to avoid
      // having a mismatched old value for the fetch that those functions
      // call.
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        old[key] = this[key];
        this[key] = value[key];
      }
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (attr[key]) {
          if (!_.isObject(value[key]) ||
              !_.isObject(old[key]) ||
              value[key].id !== old[key].id) {

            // Don't bubble on path attributes that are by definition read only
            if (attr[key].indexOf(".") === -1) {
              changed[attr[key]] = value[key];
            }

            expireFetches();

            this[key + 'Changed']();
          }
        }
      }

      // Bubble changes if applicable
      if (!_.isEmpty(changed)) {
        if (!options.silent) {
          options.value = changed;
          this.doValueChange(options);
        }
      }
    },
  });

}());