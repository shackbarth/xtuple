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
    taskName: "loadHonorifics",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.honorifics = new XM.HonorificCollection();
      options.query = {};
      options.query.orderBy = [
        {attribute: 'code'}
      ];
      XM.honorifics.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadSources",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.sources = new XM.SourceCollection();
      XM.sources.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadCommentTypes",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.commentTypes = new XM.CommentTypeCollection();
      XM.commentTypes.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadCharacteristics",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this),
        query: {
          orderBy: [
            {attribute: 'order'},
            {attribute: 'name'}
          ]
        }
      };
      XM.characteristics = new XM.CharacteristicCollection();
      XM.characteristics.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadLanguages",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.languages = new XM.LanguageCollection();
      XM.languages.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadLocales",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.locales = new XM.LocaleCollection();
      XM.locales.fetch(options);
    }
  });

  XT.StartupTasks.push({
    taskName: "loadPrivileges",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.privileges = new XM.PrivilegeCollection();
      XM.privileges.fetch(options);
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
    taskName: "loadClassCodes",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
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
    taskName: "loadShipVia",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.shipVia = new XM.ShipViaCollection();
      XM.shipVia.fetch(options);
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
  
  // XT.StartupTasks.push({
  //   taskName: "loadShippingForms",
  //   task: function () {
  //     var options = {
  //       success: _.bind(this.didComplete, this)
  //     };
  //     XM.shippingForms = new XM.ShippingFormCollection();
  //     XM.shippingForms.fetch(options);
  //   }
  // });

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

}());
