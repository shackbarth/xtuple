/*jshint indent:2, curly:true,eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.CostCategory = XM.Document.extend(/** @lends XM.CostCategory.prototype */{

    recordType: 'XM.CostCategory',

    documentKey: "code"

  });

  /**
    @class

    @extends XM.Document
  */
  XM.PlannerCode = XM.Document.extend(/** @lends XM.PlannerCode.prototype */{

    recordType: 'XM.PlannerCode',

    documentKey: "code"

  });


  /**
    @class

    @extends XM.Document
  */
  XM.ItemSite = XM.Model.extend(/** @lends XM.ItemSite.prototype */{

    recordType: 'XM.ItemSite',

    name: function () {
      return this.getValue("item.number") + " " + this.getValue("site.code");
    },

    defaults: {
      isActive: true
    },

    //TODO if Item Type is Purchased, Cost Method available options restricted to Average, Standard
    controlMethodDidChange: function () {
      var K = XM.ItemSite,
        controlMethod = this.get("controlMethod");
      if (controlMethod === K.NO_CONTROL) {
        this.setReadOnly('costMethod', true);
        this.set('costMethod', 'N');
      }
      else if (controlMethod !== K.NO_CONTROL) {
        this.setReadOnly('costMethod', false);
        this.set('costMethod', 'S');
      }
    },

    costMethodDidChange: function () {
      var K = XM.ItemSite,
        I = XM.Item,
        costMethod = this.get("costMethod"),
        isSold = false,
        plannerCode = false,
        isStocked = false,
        abcClass = false,
        isAutomaticAbcClassUpdates = false,
        abcClass = false,
        cycleCountFrequency = false,
        isLocationControl = false,
        receiveLocation = false,
        isReceiveLocationAuto = false,
        stockLocation = false,
        isStockLocationAuto = false,
        userDefinedLocation = false,
        locationComment = false,
        useParameters = false,
        reorderLevel = false,
        orderToQuantity = false,
        minimumOrderQuantity = false,
        maximumOrderQuantity = false,
        multipleOrderQuantity = false,
        restrictedLoctionsAllowed = false,
        useParametersManual = false,
        safetyStock = false,
        leadTime = false;
      switch (costMethod) {
      case K.JOB_COST:
        if (I.MANUFACTURED) {
          isSold = true;
          plannerCode = true;
          isStocked = true;
          abcClass = true;
          isAutomaticAbcClassUpdates = true;
          abcClass = true;
          cycleCountFrequency = true;
          isLocationControl = true;
          receiveLocation = true;
          isReceiveLocationAuto = true;
          stockLocation = true;
          isStockLocationAuto = true;
          userDefinedLocation = true;
          locationComment = true;
          useParameters = true;
          reorderLevel = true;
          orderToQuantity = true;
          minimumOrderQuantity = true;
          maximumOrderQuantity = true;
          multipleOrderQuantity = true;
          restrictedLoctionsAllowed = true;
          useParametersManual = true;
          safetyStock = true;
          leadTime = true;
          this.set("isSold", false);
          this.set("isAutomaticAbcClassUpdates", false);
          this.set("cycleCountFrequency", 0);
          this.set("useParameters", false);
          this.set("isStocked", false);
          this.set("locationControl", false);
          this.set("safetyStock", 0);
        }
        else if (I.PURCHASED || I.OUTSIDE_PROCESS) {
          isSold = false;
          abcClass = true;
          isAutomaticAbcClassUpdates = true;
          cycleCountFrequency = true;
          isStocked = true;
          isLocationControl = true;
          restrictedLoctionsAllowed = true;
          safetyStock = true;
          useParameters = true;
          this.set("isSold", true);
          this.set("isAutomaticAbcClassUpdates", false);
          this.set("cycleCountFrequency", 0);
          this.set("useParameters", false);
          this.set("isStocked", false);
          this.set("locationControl", false);
          this.set("safetyStock", 0);
        }
        else {
          isStocked = true;
        }
      }
      this.setReadOnly("isSold", isSold);
      this.setReadOnly("plannerCode", plannerCode);
      this.setReadOnly("isStocked", isStocked);
      this.setReadOnly("abcClass", abcClass);
      this.setReadOnly("isAutomaticAbcClassUpdates", isAutomaticAbcClassUpdates);
      this.setReadOnly("abcClass", abcClass);
      this.setReadOnly("cycleCountFrequency", cycleCountFrequency);
      this.setReadOnly("isLocationControl", isLocationControl);
      this.setReadOnly("receiveLocation", receiveLocation);
      this.setReadOnly("isReceiveLocationAuto", isReceiveLocationAuto);
      this.setReadOnly("stockLocation", stockLocation);
      this.setReadOnly("isStockLocationAuto", isStockLocationAuto);
      this.setReadOnly("userDefinedLocation", userDefinedLocation);
      this.setReadOnly("locationComment", locationComment);
      this.setReadOnly("useParameters", useParameters);
      this.setReadOnly("reorderLevel", reorderLevel);
      this.setReadOnly("orderToQuantity", orderToQuantity);
      this.setReadOnly("minimumOrderQuantity", minimumOrderQuantity);
      this.setReadOnly("maximumOrderQuantity", maximumOrderQuantity);
      this.setReadOnly("multipleOrderQuantity", multipleOrderQuantity);
      this.setReadOnly("restrictedLoctionsAllowed", restrictedLoctionsAllowed);
      this.setReadOnly("useParametersManual", useParametersManual);
      this.setReadOnly("safetyStock", safetyStock);
      this.setReadOnly("leadTime", leadTime);     
    },

    /**
      Users must not be able to set the site except for new itemsites
     */
    initialize: function () {
      XM.Model.prototype.initialize.apply(this, arguments);
      var isReadOnly = this.getStatus() !== XM.Model.READY_NEW;
      this.setReadOnly('item', isReadOnly);
      this.setReadOnly('site', isReadOnly);
    },

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:item change:site', this.checkDuplicatePair);
      this.on('change:controlMethod', this.controlMethodDidChange);
      this.on('change:costMethod', this.costMethodDidChange);
    },

    /**
      We do not allow itemsites to be created with an item and a site that
      are already linked. Perform this validation asyncronously.

      @param {Function} callback The callback to be called when this function
        finishes. Pass a falsy value upon success and a truthy value upon error.
        Note that this function gets called with a different set of parameters
        if triggered by a binding, but we don't care about the params in that case.
     */
    checkDuplicatePair: function (callback) {
      var that = this;

      if (!this.get("item") || !this.get("site")) {
        // no need to check for duplicates unless both fields are set
        if (typeof callback === 'function') {
          callback();
        }
        return;
      }
      var options = {},
        collection = new XM.ItemSiteCollection();

      options.success = function (resp) {
        var err, params = {};

        if (resp && resp.length > 0) {
          // validation fail. This pair already exists
          params.attr = "_item".loc() + " " + "_and".loc() + " " + "_site".loc();
          params.value = [that.getValue("item.number"), that.getValue("site.code")];
          params.response = resp;
          err = XT.Error.clone('xt1008', { params: params });
          that.trigger('invalid', that, err, options);
          if (typeof callback === 'function') {
            callback(err);
          }

        } else {
          if (typeof callback === 'function') {
            callback();
          }
        }
      };

      options.error = function (err) {
        console.log("Error searching for duplicate itemsite pair", err);
        if (typeof callback === 'function') {
          callback(true);
        }
      };

      options.query = {
        parameters: [{
          attribute: "item",
          value: this.get("item")
        }, {
          attribute: "site",
          value: this.get("site")
        }]
      };

      collection.fetch(options);
    },

    /**
      Perform the duplicate pair check before we try to save a new ItemSite
     */
    save: function (key, value, options) {
      var that = this;

      if (this.isNew()) {
        this.checkDuplicatePair(function (error) {
          if (!error) {
            XM.Model.prototype.save.call(that, key, value, options);
          }
        });
      } else {
        // edits to existing ItemSites don't need to go through the duplicate pair check
        XM.Model.prototype.save.call(this, key, value, options);
      }
    },

    /**
      Retrieve the Item Site's cost.

      @returns {Object} Receiver
    */
    cost: function (options) {
      var params = [this.id];
      this.dispatch("XM.Customer", "itemPrice", params, options);
      return this;
    }

  });

  /**
    @class

    @extends XM.Comments
  */
  XM.ItemSiteComment = XM.Comment.extend(/** @lends XM.ItemSiteComment.prototype */{

    recordType: 'XM.ItemSiteComment',

    sourceName: 'IS'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ItemSiteRelation = XM.Info.extend(/** @lends XM.ItemSiteRelation.prototype */{

    recordType: 'XM.ItemSiteRelation',

    editableModel: 'XM.ItemSite'

  });


  /**
    @class

    @extends XM.Info
  */
  XM.ItemSiteListItem = XM.Info.extend(/** @lends XM.ItemSiteListItem.prototype */{

    recordType: 'XM.ItemSiteListItem',

    editableModel: 'XM.ItemSite'

  });

  _.extend(XM.ItemSiteListItem, /** @lends XM.ItemSiteListItem# */{
    /**
      Item site has no searchable attributes by default, so we have to provide some, or
      errors occur (e.g. the search screen)
     */
    getSearchableAttributes: function () {
      return ["item.number", "site.code"];
    }
  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.CostCategoryCollection = XM.Collection.extend(/** @lends XM.CostCategoryCollection.prototype */{

    model: XM.CostCategory

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.PlannerCodeCollection = XM.Collection.extend(/** @lends XM.PlannerCodeCollection.prototype */{

    model: XM.PlannerCode

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteCollection = XM.Collection.extend(/** @lends XM.ItemSiteCollection.prototype */{

    model: XM.ItemSite

  });

  /**
    If we have a special extra filter enabled, we need to perform a dispatch
    instead of a fetch to get the data we need. This is because we only want
    to show items that are associated with particular customers, shiptos,
    or effective dates.
   */
  var fetch = function (options) {
    options = options ? options : {};
    var that = this,
      params = options.query ? options.query.parameters : [],
      param = _.findWhere(params, {attribute: "customer"}),
      customerId,
      shiptoId,
      effectiveDate,
      success,
      omit = function (params, attr) {
        return _.filter(params, function (param) {
          return param.attribute !== attr;
        });
      };

    if (param) {

      // We have to do a special dispatch to fetch the data based on customer.
      // Because it's a dipatch call and not a fetch, the collection doesn't get
      // updated automatically. We have to do that by hand on success.
      customerId = param.value.id;
      params = omit(params, "customer");

      // Find shipto
      param = _.findWhere(params, {attribute: "shipto"});
      if (param) {
        shiptoId = param.value.id;
        params = omit(params, "shipto");
      }

      // Find effective Date
      param = _.findWhere(params, {attribute: "effectiveDate"});
      if (param) {
        effectiveDate = param ? param.value : null;
        params = omit(params, "effectiveDate");
      }
      options.query.parameters = params;
      XM.Collection.formatParameters("XM.ItemSiteListItem", options.query.parameters);

      // Dispatch the query
      success = options.success;
      options.success = function (data) {
        that.reset(data);
        if (success) { success(data); }
      };
      XM.ModelMixin.dispatch("XM.ItemSite", "itemsForCustomer",
        [customerId, shiptoId, effectiveDate, options.query], options);

    } else {
      // Otherwise just do a normal fetch
      XM.Collection.prototype.fetch.call(this, options);
    }
  };

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteRelationCollection = XM.Collection.extend(/** @lends XM.ItemSiteRelationCollection.prototype */{

    model: XM.ItemSiteRelation,

    fetch: fetch,

    comparator: function (itemSite) {
      var defaultSiteId = this.defaultSite ? this.defaultSite.id : -5;
      var defaultSiteOrder = itemSite.getValue("site.id") === defaultSiteId ? 'aa' : 'zz';
      return itemSite.getValue("item.number") + defaultSiteOrder + itemSite.getValue("site.code");
    }

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteListItemCollection = XM.Collection.extend(/** @lends XM.ItemSiteListItemCollection.prototype */{

    model: XM.ItemSiteListItem,

    fetch: fetch

  });

}());
