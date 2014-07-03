/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, XV:true, Backbone:true, _:true, console:true, window:true */

(function () {
  "use strict";

  XT.StartupTask.create({
    taskName: "loadSessionSettings",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XT.session.loadSessionObjects(XT.session.SETTINGS, options);
    }
  });

  XT.StartupTask.create({
    taskName: "loadSessionPrivileges",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      var relevantPrivileges = [
        "InstallExtension",
        "MaintainUsers",
        "MaintainPreferencesSelf",
        "MaintainWorkflowsSelf",
        "MaintainAllWorkflows"
      ];
      XT.session.addRelevantPrivileges("core", relevantPrivileges);
      XT.session.loadSessionObjects(XT.session.PRIVILEGES, options);
    }
  });

  XT.StartupTask.create({
    taskName: "loadSessionPreferences",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XT.session.loadSessionObjects(XT.session.PREFERENCES, options);
    }
  });

  // These will be loaded after all extensions are loaded
  if (!XT.StartupTasks) { XT.StartupTasks = []; }

  /**
    @param {String} taskName. Call it anything you like
    @param {String} cacheName. The location of the cache.
      e.g. XM.honorifics.
    @param {String} collectionName. The collection name, e.g. XM.HonorificCollection
    @param {String} orderAttribute. An optional parameter for the fetch options to specify
      the query. Just pass in the attribute name.
      so "code" will be treated like
      {orderBy: [
        {attribute: 'code'}
      ]}
      You can even put two attributes in this string if you put a space between them.
      "order name" will be treated as
      {orderBy: [
        {attribute: 'order'},
        {attribute: 'name'}
      ]}
      This function will also set a comparator on the collection so that this ordering
      is made by default if a new record is added.
   */
  XT.cacheCollection = function (cacheName, collectionName, orderAttribute) {
    var orderBy,
      Coll = Backbone.Relational.store.getObjectByName(collectionName),
      cachePrefix = cacheName.prefix(),
      cacheSuffix = cacheName.suffix(),
      cache;

    if (window[cachePrefix][cacheSuffix]) {
      // the cache already exists. Do not re-fetch
      // this might happen legitimately if multiple extensions declare a need
      // for the same cache.
      return;
    }

    cache = window[cachePrefix][cacheSuffix] = new Coll();
    XT.StartupTasks.push({
      taskName: "Load " + cacheName,
      task: function () {
        var orderBy,
          options = {};

        options.success = _.bind(this.didCompleteCache, this, cache, cacheName);
        if (typeof orderAttribute === "string") {
          orderBy = _.map(orderAttribute.split(" "), function (s) {
            return {attribute: s};
          });
          options.query = {orderBy: orderBy};

          // set the comparator on the collection
          Coll.prototype.comparator = function (model) {
            var attrs = orderAttribute.split(" ");

            if (attrs.length === 1) {
              return model.get(attrs[0]);
            } else if (attrs.length === 2) {
              return model.get(attrs[0]) + model.get(attrs[1]);
            } // XXX this is not yet generalized to n > 2
          };
        } else {
          options.query = {};
        }

        cache.fetch(options);
      }
    });
  };

  XT.cacheCollection("XM.agents", "XM.AgentCollection", "username");
  XT.cacheCollection("XM.characteristics", "XM.CharacteristicCollection", "order name");
  XT.cacheCollection("XM.commentTypes", "XM.CommentTypeCollection");
  XT.cacheCollection("XM.countries", "XM.CountryCollection", "name");
  XT.cacheCollection("XM.currencyRates", "XM.CurrencyRateCollection");
  XT.cacheCollection("XM.departments", "XM.DepartmentCollection", "number");
  XT.cacheCollection("XM.honorifics", "XM.HonorificCollection", "code");
  XT.cacheCollection("XM.itemGroups", "XM.ItemGroupRelationCollection", "name");
  XT.cacheCollection("XM.languages", "XM.LanguageCollection");
  XT.cacheCollection("XM.locales", "XM.LocaleCollection");
  XT.cacheCollection("XM.priorities", "XM.PriorityCollection");
  XT.cacheCollection("XM.privileges", "XM.PrivilegeCollection");
  XT.cacheCollection("XM.projectTypes", "XM.ProjectTypeCollection", "code");
  XT.cacheCollection("XM.siteRelations", "XM.SiteRelationCollection", "code");
  XT.cacheCollection("XM.sites", "XM.SiteCollection", "code");
  XT.cacheCollection("XM.shifts", "XM.ShiftCollection", "number");
  XT.cacheCollection("XM.sources", "XM.SourceCollection");
  XT.cacheCollection("XM.states", "XM.StateCollection", "abbreviation");
  XT.cacheCollection("XM.taxAuthorities", "XM.TaxAuthorityCollection");
  XT.cacheCollection("XM.taxClasses", "XM.TaxClassCollection");
  XT.cacheCollection("XM.taxTypes", "XM.TaxTypeCollection", "name");
  XT.cacheCollection("XM.taxZones", "XM.TaxZoneCollection");
  XT.cacheCollection("XM.taxCodes", "XM.TaxCodeCollection");
  XT.cacheCollection("XM.units", "XM.UnitCollection");
  XT.cacheCollection("XM.users", "XM.UserAccountRelationCollection", "username");
  XT.cacheCollection("XM.filters", "XM.FilterCollection");
  XT.cacheCollection("XM.reasonCodes", "XM.ReasonCodeCollection");
  XT.cacheCollection("XM.vendorTypes", "XM.VendorTypeCollection");

  /**
    These ones are a little custom and need to be done longhand.
   */
  XT.StartupTasks.push({
    taskName: "loadCurrentUser",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this),
        id: XT.session.details.username
      };
      XM.currentUser = new XM.UserAccountRelation();
      XM.currentUser.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadCurrencies",
    task: function () {
      var options = {
        success: _.bind(function () {
          XM.baseCurrency = _.find(XM.currencies.models, function (currency) {
            return currency.get("isBase");
          });
          XV.registerModelCache("XM.Currency", "XM.currencies");
          this.didComplete();
        }, this)
      };
      XM.currencies = new XM.CurrencyCollection();
      XM.currencies.fetch(options);
    }
  });
}());
