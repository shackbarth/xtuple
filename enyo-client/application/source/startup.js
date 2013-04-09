/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

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
        success: _.bind(this.didComplete, this),
        databaseTypes: ["global", undefined]
      };
      XT.session.loadSessionObjects(XT.session.PRIVILEGES, options);
    }
  });

  XT.StartupTask.create({
    taskName: "loadSessionLocale",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XT.session.loadSessionObjects(XT.session.LOCALE, options);
    }
  });

  XT.StartupTask.create({
    taskName: "loadSessionExtensions",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XT.session.loadSessionObjects(XT.session.EXTENSIONS, options);
    }
  });

  // These will be loaded after all extensions are loaded
  if (!XT.StartupTasks) { XT.StartupTasks = []; }

  /**
    @param {String} taskName. Call it anything you like
    @param {String} cacheName. The location of the cache.
      e.g. XM.honorifics.
    @param {String} collectionName. The collection name, e.g. XM.HonorificCollection
    @param {Object|String} query. An optional parameter for the fetch options to specify
      the query. In the most common case you'll just be setting the orderBy attribute.
      If so, you can just pass in the attribute name.
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

   */
  XT.cacheCollection = function (cacheName, collectionName, query) {
    var orderBy;

    cacheName = cacheName.suffix(); // strip off the XM
    collectionName = collectionName.suffix(); // strip off the XM

    XT.StartupTasks.push({
      taskName: "Load " + cacheName,
      task: function () {
        var options = {};

        XM[cacheName] = new XM[collectionName]();
        options.success = _.bind(this.didCompleteCache, this, XM[cacheName]);

        if (typeof query === "string") {
          orderBy = _.map(query.split(" "), function (s) {
            return {attribute: s};
          });
          options.query = {orderBy: orderBy};
        } else {
          options.query = query || {};
        }

        XM[cacheName].fetch(options);
      }
    });
  };

  XT.cacheCollection("XM.characteristics", "XM.CharacteristicCollection", "order name");
  XT.cacheCollection("XM.classCodes", "XM.ClassCodeCollection", "code");
  XT.cacheCollection("XM.commentTypes", "XM.CommentTypeCollection");
  XT.cacheCollection("XM.costCategories", "XM.CostCategoryCollection", "code");
  XT.cacheCollection("XM.countries", "XM.CountryCollection", "name");
  XT.cacheCollection("XM.currencyRates", "XM.CurrencyRateCollection");
  XT.cacheCollection("XM.customerTypes", "XM.CustomerTypeCollection");
  XT.cacheCollection("XM.freightClasses", "XM.FreightClassCollection", "code");
  XT.cacheCollection("XM.honorifics", "XM.HonorificCollection", "code");
  XT.cacheCollection("XM.languages", "XM.LanguageCollection");
  XT.cacheCollection("XM.locales", "XM.LocaleCollection");
  XT.cacheCollection("XM.plannerCodes", "XM.PlannerCodeCollection", "code");
  XT.cacheCollection("XM.priorities", "XM.PriorityCollection");
  XT.cacheCollection("XM.privileges", "XM.PrivilegeCollection");
  XT.cacheCollection("XM.productCategories", "XM.ProductCategoryCollection");
  XT.cacheCollection("XM.salesReps", "XM.SalesRepCollection");
  XT.cacheCollection("XM.saleTypes", "XM.SaleTypeCollection", "code");
  XT.cacheCollection("XM.sites", "XM.SiteCollection", "code");
  XT.cacheCollection("XM.shipCharges", "XM.ShipChargeCollection");
  XT.cacheCollection("XM.shipVias", "XM.ShipViaCollection", "code");
  XT.cacheCollection("XM.shipZones", "XM.ShipZoneCollection");
  XT.cacheCollection("XM.sources", "XM.SourceCollection");
  XT.cacheCollection("XM.states", "XM.StateCollection", "abbreviation");
  XT.cacheCollection("XM.taxAuthorities", "XM.TaxAuthorityCollection");
  XT.cacheCollection("XM.taxTypes", "XM.TaxTypeCollection", "name");
  XT.cacheCollection("XM.taxZones", "XM.TaxZoneCollection");
  XT.cacheCollection("XM.terms", "XM.TermsCollection");
  XT.cacheCollection("XM.units", "XM.UnitCollection");

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
          this.didComplete();
        }, this)
      };
      XM.currencies = new XM.CurrencyCollection();
      XM.currencies.fetch(options);
    }
  });
}());
