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
    keyAttribute: ["item.number", "item.barcode"],
    nameAttribute: "item.description1",
    descripAttribute: "item.description2",
    skipCompleterFilter: true,
    classes: "xv-private-item-site-widget"
  });

  /**
    The value for this widget is an object potentially consisting
    of multiple key/value pairs for the item and site controls.

    TODO: Deal with attributes with a "." (read only)
  */
  enyo.kind({
    name: "XV.ItemSiteWidget",
    published: {
      item: null,
      site: null,
      sites: null,
      attr: null,
      value: null,
      model: null,
      placeholder: null,
      disabled: false,
      query: null,
      isEditableKey: "item",
      horizontalOrientation: false
    },
    // handlers: {
    //   "onValueChange": "controlValueChanged"
    // },
    // events: {
    //   "onValueChange": ""
    // },
    components: [
      {kind: "enyo.Control", name: "fittableContainer",
      components: [
        {kind: _privateItemSiteWidget, name: "privateItemSiteWidget",
          label: "_item".loc(), onValueChange: 'handleItemSiteChange'},
        {kind: "XV.SitePicker", name: "sitePicker", label: "_site".loc(),
          onValueChange: 'handleSiteChange'}
      ]}
    ],

    create: function () {
      this.inherited(arguments);

      // changes layout of relation widget/picker
      if (this.getHorizontalOrientation()) {
        this.$.fittableContainer.setLayoutKind("FittableColumnsLayout");
      } else {
        this.$.fittableContainer.setLayoutKind("FittableRowsLayout");
      }

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

      // TODO: this isn't necessary?
      this.$.sitePicker.itemSites = new XM.ItemSiteRelationCollection();
      this.$.sitePicker.filter = filter;
      this.$.sitePicker.$.pickerButton.setAttribute("tabIndex", -1);

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

      this.model = new XM.ItemSite();
      this.model.initialize(null, {isNew: true});
      this._itemSites = new XM.ItemSiteRelationCollection();
      this.queryChanged();
    },

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
    /**
      This is an override on the component's focus to properly set
      focus on the item widget.
     */
    focus: function () {
      this.$.privateItemSiteWidget.focus();
    },
    /**
      @todo document this function
     */
    placeholderChanged: function () {
      var placeholder = this.getPlaceholder();
      this.$.privateItemSiteWidget.setPlaceholder(placeholder);
    },
    /**
      Sets the relation widget with the query from the Item
        Site widget.
     */
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
    /**
      Disables the two widgets in the compound widget
        if the disabled flag is set
     */
    disabledChanged: function () {
      var isDisabled = this.getDisabled();
      this.$.privateItemSiteWidget.setDisabled(isDisabled);
      this.$.sitePicker.setDisabled(isDisabled);
    },
    /**
      @todo document this function
     */
    validate: function (value) {
      return value;
    },

    /**
      Handles a change in the value which is an
      object potentially consisting of multiple key/value pairs for the
      item and site controls.
    */
    valueChanged: function () {
      var attr = this.getAttr(),
        that = this;

      // Loop through values in the object
      // and set the published properties
      _.each(this.getValue(), function (value, key) {
        if (key === 'item') {
          that.setItem(value);
        } else if (key === 'site') {
          that.setSite(value);
        }
      });
    },

    /**
      Handles change fired from the privateItemSiteWidget
    */
    handleItemSiteChange: function (inSender, inEvent) {
      var value = inEvent.value,
        sitePicker = this.$.sitePicker,
        disabledCache = sitePicker.getDisabled(),
        isNull = _.isNull(value),
        options = {},
        that = this,
        site,
        item;

      // TODO: this is the collection on itemSites that needs
      // to go away
      sitePicker.itemSites.reset();
      sitePicker.buildList();

      if (value && value.get) {
        item = value.get("item");
        site = value.get("site");
        this.setValue({
          item: item,
          site: site
        });
        // disable selection until list is updated
        sitePicker.setDisabled(true);
        // Go fetch alternate sites for this item
        options.query = { parameters: [{attribute: "item", value: item}]};

        options.success = function () {
          sitePicker.buildList();
          sitePicker.setDisabled(disabledCache || that.getDisabled());
        };
        // use itemSites list on model
        sitePicker.itemSites.fetch(options);
      }
    },
    /**
      Handles change fired from the site picker
    */
    handleSiteChange: function (inSender, inEvent) {
      var value = inEvent.value,
        sitePicker = this.$.sitePicker,
        isNull = _.isNull(value),
        itemSiteModel;

      this.setValue({site: value});
      this.$.privateItemSiteWidget.setDisabled(isNull);
      if (isNull) {
        this.clear();
      } else {
        itemSiteModel = this.$.privateItemSiteWidget.getValue();
        // Change item site selection if the site changed
        if (itemSiteModel && itemSiteModel.getValue("site.id") !== value &&
            sitePicker.itemSites.length) { // TODO: itemSites needs replaced
          itemSiteModel = _.find(sitePicker.itemSites.models, function (model) {
            return model.getValue("site.id") === value;
          });
          this.$.privateItemSiteWidget.setValue(itemSiteModel);
        }
      }
    },

    itemChanged: function () {
      var item = this.getItem(),
        site = this.getSite(),
        options = {},
        that = this;

      if (item && site) {
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
          if (!that.destroyed && that._itemSites.length) {
            that.$.privateItemSiteWidget.setValue(that._itemSites.at(0));
          }
        };
        this._itemSites.fetch(options);
        // this.model.meta.get("_itemSites").fetch(options);

      } else if (!item) {
        this.clear();
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
    }
  });

}());