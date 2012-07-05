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
        success: _.bind(this.didComplete, this)
      };
      XT.session.loadSessionObjects(XT.session.PRIVILEGES, options);
    }
  });

  XT.StartupTask.create({
    taskName: "loadSessionSchema",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XT.session.loadSessionObjects(XT.session.SCHEMA, options);
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
    taskName: "loadCurrentUser",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this),
        id: XT.session.details.username
      };
      XM.currentUser = XM.UserAccountInfo.create();
      XM.currentUser.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadHonorifics",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.honorifics = XM.HonorificCollection.create();
      XM.honorifics.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadCommentTypes",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.commentTypes = XM.CommentTypeCollection.create();
      XM.commentTypes.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadCharacteristics",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.characteristics = XM.CharacteristicCollection.create();
      XM.characteristics.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadLanguages",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.languages = XM.LanguageCollection.create();
      XM.languages.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadLocales",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.locales = XM.LocaleCollection.create();
      XM.locales.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadPrivileges",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.privileges = XM.PrivilegeCollection.create();
      XM.privileges.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
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
      XM.currencies = XM.CurrencyCollection.create();
      XM.currencies.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadCountries",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.countries = XM.CountryCollection.create();
      XM.countries.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadStates",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.states = XM.StateCollection.create();
      XM.states.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadUnits",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.units = XM.UnitCollection.create();
      XM.units.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadClassCodes",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.classCodes = XM.ClassCodeCollection.create();
      XM.classCodes.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadProductCategories",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.productCategories = XM.ProductCategoryCollection.create();
      XM.productCategories.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadPriorities",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.priorities = XM.PriorityCollection.create();
      XM.priorities.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadIncidentCategories",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.incidentCategories = XM.IncidentCategoryCollection.create();
      XM.incidentCategories.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadIncidentResolutions",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.incidentResolutions = XM.IncidentResolutionCollection.create();
      XM.incidentResolutions.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadIncidentSeverities",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.incidentSeverities = XM.IncidentSeverityCollection.create();
      XM.incidentSeverities.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadOpportunityStages",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.opportunityStages = XM.OpportunityStageCollection.create();
      XM.opportunityStages.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadOpportunityTypes",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.opportunityTypes = XM.OpportunityTypeCollection.create();
      XM.opportunityTypes.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

  XT.StartupTask.create({
    taskName: "loadOpportunitySources",
    task: function () {
      var options = {
        success: _.bind(this.didComplete, this)
      };
      XM.opportunitySources = XM.OpportunitySourceCollection.create();
      XM.opportunitySources.fetch(options);
    },
    waitingList: ["loadSessionSettings", "loadSessionSchema", "loadSessionPrivileges"]
  });

}());
