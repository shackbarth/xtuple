
XT.StartupTask.create({
  taskName: "loadSessionSettings",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XT.session.loadSessionObjects(XT.session.SETTINGS, options);
  }
});

XT.StartupTask.create({
  taskName: "loadSessionPrivileges",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XT.session.loadSessionObjects(XT.session.PRIVILEGES, options);
  }
});

XT.StartupTask.create({
  taskName: "loadSessionSchema",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XT.session.loadSessionObjects(XT.session.SCHEMA, options);
  }
});

XT.StartupTask.create({
  taskName: "loadSessionLocale",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XT.session.loadSessionObjects(XT.session.LOCALE, options);
  }
});

XT.StartupTask.create({
  taskName: "loadCurrentUser",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this),
      id: XT.session.details.username
    };
    XM.currentUser = new XM.UserAccountInfo();
    XM.currentUser.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadHonorifics",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.honorifics = new XM.HonorificCollection();
    XM.honorifics.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadCommentTypes",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.commentTypes = new XM.CommentTypeCollection();
    XM.commentTypes.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadCharacteristics",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.characteristics = new XM.CharacteristicCollection();
    XM.characteristics.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadLanguages",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.languages = new XM.LanguageCollection();
    XM.languages.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadLocales",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.locales = new XM.LocaleCollection();
    XM.locales.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadPrivileges",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.privileges = new XM.PrivilegeCollection();
    XM.privileges.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadCurrencies",
  task: function() {
    var options = {
      success: _.bind(function() {
        XM.baseCurrency = _.find(XM.currencies.models, function(currency) {
          return currency.get("isBase");
        });
        this.didComplete();
      }, this)
    };
    XM.currencies = new XM.CurrencyCollection();
    XM.currencies.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadCountries",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.countries = new XM.CountryCollection();
    XM.countries.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadStates",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.states = new XM.StateCollection();
    XM.states.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadUnits",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.units = new XM.UnitCollection();
    XM.units.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadClassCodes",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.classCodes = new XM.ClassCodeCollection();
    XM.classCodes.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadProductCategories",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.productCategories = new XM.ProductCategoryCollection();
    XM.productCategories.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadPriorities",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.priorities = new XM.PriorityCollection();
    XM.priorities.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadIncidentCategories",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.incidentCategories = new XM.IncidentCategoryCollection();
    XM.incidentCategories.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadIncidentResolutions",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.incidentResolutions = new XM.IncidentResolutionCollection();
    XM.incidentResolutions.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadIncidentSeverities",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.incidentSeverities = new XM.IncidentSeverityCollection();
    XM.incidentSeverities.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadOpportunityStages",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.opportunityStages = new XM.OpportunityStageCollection();
    XM.opportunityStages.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadOpportunityTypes",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.opportunityTypes = new XM.OpportunityTypeCollection();
    XM.opportunityTypes.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadOpportunitySources",
  task: function() {
    var options = {
      success: _.bind(this.didComplete, this)
    };
    XM.opportunitySources = new XM.OpportunitySourceCollection();
    XM.opportunitySources.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});
