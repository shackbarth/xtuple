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
    var orderBy;

    cacheName = cacheName.suffix(); // strip off the XM
    collectionName = collectionName.suffix(); // strip off the XM

    if (XM[cacheName]) {
      // the cache already exists. Do not re-fetch
      // this might happen legitimately if multiple extensions declare a need
      // for the same cache.
      return;
    }

    XM[cacheName] = new XM[collectionName]();
    XT.StartupTasks.push({
      taskName: "Load " + cacheName,
      task: function () {
        var orderBy,
          options = {};

        options.success = _.bind(this.didCompleteCache, this, XM[cacheName]);
        if (typeof orderAttribute === "string") {
          orderBy = _.map(orderAttribute.split(" "), function (s) {
            return {attribute: s};
          });
          options.query = {orderBy: orderBy};

          // set the comparator on the collection
          XM[collectionName].prototype.comparator = function (model) {
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

        XM[cacheName].fetch(options);
      }
    });
  };

  XT.cacheCollection("XM.characteristics", "XM.CharacteristicCollection", "order name");
  XT.cacheCollection("XM.commentTypes", "XM.CommentTypeCollection");
  XT.cacheCollection("XM.countries", "XM.CountryCollection", "name");
  XT.cacheCollection("XM.currencyRates", "XM.CurrencyRateCollection");
  XT.cacheCollection("XM.honorifics", "XM.HonorificCollection", "code");
  XT.cacheCollection("XM.languages", "XM.LanguageCollection");
  XT.cacheCollection("XM.locales", "XM.LocaleCollection");
  XT.cacheCollection("XM.priorities", "XM.PriorityCollection");
  XT.cacheCollection("XM.privileges", "XM.PrivilegeCollection");
  XT.cacheCollection("XM.sources", "XM.SourceCollection");
  XT.cacheCollection("XM.states", "XM.StateCollection", "abbreviation");
  XT.cacheCollection("XM.taxAuthorities", "XM.TaxAuthorityCollection");
  XT.cacheCollection("XM.taxTypes", "XM.TaxTypeCollection", "name");
  XT.cacheCollection("XM.taxZones", "XM.TaxZoneCollection");
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

  XT.StartupTasks.push({
    taskName: "loadCountries",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'name'}
      ];
      XM.countries = new XM.CountryCollection();
      XM.countries.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadStates",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'abbreviation'}
      ];
      XM.states = new XM.StateCollection();
      XM.states.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadUnits",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.units = new XM.UnitCollection();
      XM.units.fetch(options);
    }
  });
  
  XT.StartupTasks.push({
    taskName: "loadFreightClasses",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'code'}
      ];
      XM.freightClasses = new XM.FreightClassCollection();
      XM.freightClasses.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadClassCodes",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'code'}
      ];
      XM.classCodes = new XM.ClassCodeCollection();
      XM.classCodes.fetch(options);
    }
  });

  XT.StartupTasks.push({
      taskName: "loadCustomerTypes",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.customerTypes = new XM.CustomerTypeCollection();
        XM.customerTypes.fetch(options);
      }
    });

  XT.StartupTasks.push({
    taskName: "loadProductCategories",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.productCategories = new XM.ProductCategoryCollection();
      XM.productCategories.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadPriorities",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.priorities = new XM.PriorityCollection();
      XM.priorities.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadShipVias",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'code'}
      ];
      XM.shipVias = new XM.ShipViaCollection();
      XM.shipVias.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadSalesReps",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.salesReps = new XM.SalesRepCollection();
      XM.salesReps.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadShipCharges",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.shipCharges = new XM.ShipChargeCollection();
      XM.shipCharges.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadShipVias",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.shipVias = new XM.ShipViaCollection();
      XM.shipVias.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadShipZones",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.shipZones = new XM.ShipZoneCollection();
      XM.shipZones.fetch(options);
    }
  });
  
  XT.StartupTasks.push({
    taskName: "loadCostCategories",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'code'}
      ];
      XM.costCategories = new XM.CostCategoryCollection();
      XM.costCategories.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadPlannerCodes",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'code'}
      ];
      XM.plannerCodes = new XM.PlannerCodeCollection();
      XM.plannerCodes.fetch(options);
    }
  });
  
  XT.StartupTasks.push({
    taskName: "loadSaleTypes",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'code'}
      ];
      XM.saleTypes = new XM.SaleTypeCollection();
      XM.saleTypes.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadSites",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'code'}
      ];
      XM.sites = new XM.SiteCollection();
      XM.sites.fetch(options);
    }
  });
  
  XT.StartupTasks.push({
    taskName: "loadTaxTypes",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      options.query = {};
      options.query.orderBy = [
        {attribute: 'name'}
      ];
      XM.taxTypes = new XM.TaxTypeCollection();
      XM.taxTypes.fetch(options);
    }
  });
  
  XT.StartupTasks.push({
    taskName: "loadTaxAuthorities",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.taxAuthorities = new XM.TaxAuthorityCollection();
      XM.taxAuthorities.fetch(options);
    }
  });
  
  XT.StartupTasks.push({
    taskName: "loadTaxClasses",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.taxClasses = new XM.TaxClassCollection();
      XM.taxClasses.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadTaxZones",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.taxZones = new XM.TaxZoneCollection();
      XM.taxZones.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadTerms",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.terms = new XM.TermsCollection();
      XM.terms.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadCurrencyRates",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.currencyRates = new XM.CurrencyRateCollection();
      XM.currencyRates.fetch(options);
    }
  });
}());
