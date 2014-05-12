/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // AGENT

  enyo.kind({
    name: "XV.AgentPicker",
    kind: "XV.PickerWidget",
    nameAttribute: "username",
    collection: "XM.agents"
  });

  // ..........................................................
  // ACCOUNT TYPE
  //

  enyo.kind({
    name: "XV.AccountTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.accountTypes"
  });

  // ..........................................................
  // ATTRIBUTE PICKER
  //

  enyo.kind({
    name: "XV.AttributePicker",
    kind: "XV.PickerWidget",
    onSelect: "itemSelected",
    showLabel: false,
    prerender: false,
    orderBy: [
      {attribute: 'name'}
    ],
    /**
      This takes the list of attributes and sets up a
      collection that this picker can use.
    */
    setComponentsList: function (toSet) {
      var columnAttr,
        stringToSet,
        objectToSet,
        attrs = [],
        columns = new XM.AttributeCollection();

      for (var i = 0; i < toSet.length; i++) {
        if (toSet[i].indexOf('.') !== -1) {
          attrs = toSet[i].split(".");
          stringToSet = ("_" + attrs[0]).loc() + " " + ("_" + attrs[1]).loc();
        } else {
          stringToSet = ("_" + toSet[i]).loc();
        }
        objectToSet = { id: toSet[i], name: stringToSet };
        columnAttr = new XM.Attribute(objectToSet);
        columns.add(columnAttr);
      }
      this.setCollection(columns);
    }
  });

  // ..........................................................
  // BALANCE METHOD
  //

  enyo.kind({
    name: "XV.BalanceMethodPicker",
    kind: "XV.PickerWidget",
    collection: "XM.balanceMethods"
  });

  // ..........................................................
  // BILLING TERMS
  //

  enyo.kind({
    name: "XV.BillingTermsPicker",
    kind: "XV.PickerWidget",
    collection: "XM.terms",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ],
    filter: function (models) {
      return _.filter(models, function (m) {
        return m.getValue("isUsedByBilling");
      });
    }
  });

  // ..........................................................
  // BANK ACCOUNT TYPE
  //

  enyo.kind({
    name: "XV.BankAccountTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.bankAccountTypes",
    showNone: false
  });

  // ..........................................................
  // BILLING BANK ACCOUNT PICKER
  //

  enyo.kind({
    name: "XV.BillingBankAccountPicker",
    kind: "XV.PickerWidget",
    collection: "XM.bankAccountRelations",
    filter: function (models) {
      var ret = _.filter(models, function (m) {
        return m.get("isUsedByBilling");
      });
      return ret;
    }
  });

  // ..........................................................
  // CHARACTERISTIC TYPE
  //

  enyo.kind({
    name: "XV.CharacteristicTypePicker",
    kind: "XV.PickerWidget",
    classes: "xv-characteristic-picker",
    collection: "XM.characteristicTypes"
  });

  // ..........................................................
  // CLASS CODE
  //

  enyo.kind({
    name: "XV.ClassCodePicker",
    kind: "XV.PickerWidget",
    collection: "XM.classCodes",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // COST CATEGORY
  //

  enyo.kind({
    name: "XV.CostCategoryPicker",
    kind: "XV.PickerWidget",
    collection: "XM.costCategories",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // COUNTRY
  //

  enyo.kind({
    name: "XV.CountryPicker",
    kind: "XV.PickerWidget",
    collection: "XM.countries",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // CREDIT CARD TYPE
  //

  enyo.kind({
    name: "XV.CreditCardTypePicker",
    kind: "XV.PickerWidget",
    showNone: false,
    collection: "XM.creditCardTypes"
  });

  // ..........................................................
  // CURRENCY
  //

  enyo.kind({
    name: "XV.CurrencyPicker",
    kind: "XV.PickerWidget",
    collection: "XM.currencies",
    nameAttribute: "abbreviation",
    showNone: false,
    orderBy: [
      {attribute: 'abbreviation'}
    ]
  });

  // ..........................................................
  // CUSTOMER EMAIL PROFILE
  //

  enyo.kind({
    name: "XV.CustomerEmailProfilePicker",
    kind: "XV.PickerWidget",
    label: "_emailProfile".loc(),
    collection: "XM.customerEmailProfiles"
  });

  // ..........................................................
  // CUSTOMER TYPE
  //

  enyo.kind({
    name: "XV.CustomerTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.customerTypes",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // CREDIT STATUS
  //

  enyo.kind({
    name: "XV.CreditStatusPicker",
    kind: "XV.PickerWidget",
    showNone: false,
    collection: "XM.creditStatuses"
  });

  // ..........................................................
  // EXPENSE CATEGORY
  //

  enyo.kind({
    name: "XV.ExpenseCategoryPicker",
    kind: "XV.PickerWidget",
    collection: "XM.expenseCategories",
    nameAttribute: "code"
  });

  // ..........................................................
  // FILTER
  //

  enyo.kind({
    name: "XV.FilterPicker",
    kind: "XV.PickerWidget",
    collection: "XM.filters",
    valueAttribute: "id",
    noneText: "_default".loc(),
    iconClass: "icon-group",
    iconVisible: function (model) {
      return model.get("shared");
    }
  });

  // ..........................................................
  // FREIGHT CLASS
  //

  enyo.kind({
    name: "XV.FreightClassPicker",
    kind: "XV.PickerWidget",
    collection: "XM.freightClasses",
    nameAttribute: "code"
  });

  // ..........................................................
  // HOLD TYPE
  //

  enyo.kind({
    name: "XV.HoldTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.holdTypes"
  });

  // ..........................................................
  // INCIDENT EMAIL PROFILE
  //

  enyo.kind({
    name: "XV.IncidentEmailProfilePicker",
    kind: "XV.PickerWidget",
    label: "_emailProfile".loc(),
    collection: "XM.incidentEmailProfiles"
  });

  // ..........................................................
  // INCIDENT CATEGORY
  //

  enyo.kind({
    name: "XV.IncidentCategoryPicker",
    kind: "XV.PickerWidget",
    collection: "XM.incidentCategories",
    orderBy: [
      {attribute: 'order'},
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // INCIDENT RESOLUTION
  //

  enyo.kind({
    name: "XV.IncidentResolutionPicker",
    kind: "XV.PickerWidget",
    collection: "XM.incidentResolutions",
    orderBy: [
      {attribute: 'order'},
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // INCIDENT SEVERITY
  //

  enyo.kind({
    name: "XV.IncidentSeverityPicker",
    kind: "XV.PickerWidget",
    collection: "XM.incidentSeverities",
    orderBy: [
      {attribute: 'order'},
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // INCIDENT STATUS
  //

  enyo.kind({
    name: "XV.IncidentStatusPicker",
    kind: "XV.PickerWidget",
    collection: "XM.incidentStatuses",
    valueAttribute: "id"
  });

  // ..........................................................
  // ITEM GROUP
  //

  enyo.kind({
    name: "XV.ItemGroupPicker",
    kind: "XV.PickerWidget",
    collection: "XM.itemGroups",
    nameAttribute: "name",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // ITEM TYPE
  //

  enyo.kind({
    name: "XV.ItemTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.itemTypes",
    valueAttribute: "id"
  });

  // ..........................................................
  // LEDGER ACCOUNT TYPE
  //

  enyo.kind({
    name: "XV.LedgerAccountTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.ledgerAccountTypes"
  });

  // ..........................................................
  // LOCALE
  //

  enyo.kind({
    name: "XV.LocalePicker",
    kind: "XV.PickerWidget",
    collection: "XM.locales",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // MONTH
  //

  enyo.kind({
    name: "XV.MonthPicker",
    kind: "XV.PickerWidget",
    showNone: false,
    collection: "XM.months"
  });

  // ..........................................................
  // NUMBER POLICY
  //

  enyo.kind({
    name: "XV.NumberPolicyPicker",
    kind: "XV.PickerWidget",
    collection: "XM.numberPolicies"
  });

  // ..........................................................
  // OPPORTUNITY SOURCE
  //

  enyo.kind({
    name: "XV.OpportunitySourcePicker",
    kind: "XV.PickerWidget",
    collection: "XM.opportunitySources",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // OPPORTUNITY STAGE
  //

  enyo.kind({
    name: "XV.OpportunityStagePicker",
    kind: "XV.PickerWidget",
    collection: "XM.opportunityStages",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // OPPORTUNITY TYPE
  //

  enyo.kind({
    name: "XV.OpportunityTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.opportunityTypes",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // PLANNER CODE
  //

  enyo.kind({
    name: "XV.PlannerCodePicker",
    kind: "XV.PickerWidget",
    collection: "XM.plannerCodes",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // PRIORITY
  //

  enyo.kind({
    name: "XV.PriorityPicker",
    kind: "XV.PickerWidget",
    collection: "XM.priorities",
    orderBy: [
      {attribute: 'order'},
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // PRODUCT CATEGORY
  //

  enyo.kind({
    name: "XV.ProductCategoryPicker",
    kind: "XV.PickerWidget",
    collection: "XM.productCategories",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // PROJECT STATUS
  //

  enyo.kind({
    name: "XV.ProjectStatusPicker",
    kind: "XV.PickerWidget",
    collection: "XM.projectStatuses",
    showNone: false
  });


  // ..........................................................
  // PROJECT TYPE
  //

  enyo.kind({
    name: "XV.ProjectTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.projectTypes",
    nameAttribute: "code"
  });

  // ..........................................................
  // REASON CODES
  //

  enyo.kind({
    name: "XV.ReasonCodePicker",
    kind: "XV.PickerWidget",
    collection: "XM.reasonCodes",
    showNone: false,
    nameAttribute: "code",
    published: {
      documentType: null
    },
    create: function () {
      this.inherited(arguments);
      this.documentTypeChanged();
    },
    /**
      If documentType is set to XM.ReasonCode.CREDIT_MEMO, then only reason codes
      with null or CREDIT_MEMO values on the document type attribute should be shown
      on the picker list.

      If documentType is set to XM.ReasonCode.DEBIT_MEMO, then only reason codes with
      null or DEBIT_MEMO values on the document type attribute should be shown on the
      picker list.
    */
    documentTypeChanged: function () {
      var docType = this.getDocumentType();
      if (docType) {
        this.filter = function (models) {
          var ret = _.filter(models, function (m) {
            return m.getValue("documentType") === docType || !m.getValue("documentType");
          });
          return ret;
        };
        this.buildList();
      }
    },
  });

  // ..........................................................
  // REASON CODE DOCUMENT TYPE
  //
  enyo.kind({
    name: "XV.ReasonCodeDocumentTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.reasonCodeDocumentTypes",
    noneText: "Any"

  });

  // ..........................................................
  // TODO STATUS
  //

  enyo.kind({
    name: "XV.ToDoStatusPicker",
    kind: "XV.PickerWidget",
    collection: "XM.toDoStatuses"
  });

  // ..........................................................
  // SALES CATEGORY
  //

  enyo.kind({
    name: "XV.SalesCategoryPicker",
    kind: "XV.PickerWidget",
    collection: "XM.salesCategories",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // SALES EMAIL PROFILE
  //

  enyo.kind({
    name: "XV.SalesEmailProfilePicker",
    kind: "XV.PickerWidget",
    label: "_emailProfile".loc(),
    collection: "XM.salesEmailProfiles"
  });

  // ..........................................................
  // SALES ORDER STATUS
  //

  enyo.kind({
    name: "XV.SalesOrderStatusPicker",
    kind: "XV.PickerWidget",
    collection: "XM.salesOrderStatuses",
    showNone: false
  });

  // ..........................................................
  // SALES REP
  //

  enyo.kind({
    name: "XV.SalesRepPicker",
    kind: "XV.PickerWidget",
    collection: "XM.salesReps",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // SHIPPING CHARGES
  //

  enyo.kind({
    name: "XV.ShippingChargePicker",
    kind: "XV.PickerWidget",
    collection: "XM.shipCharges",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // SHIP VIA
  //

  enyo.kind({
    name: "XV.ShipViaPicker",
    kind: "XV.PickerWidget",
    collection: "XM.shipVias",
    nameAttribute: "description",
    orderBy: [
      {attribute: 'description'}
    ]
  });

  // ..........................................................
  // SHIP ZONE
  //

  enyo.kind({
    name: "XV.ShipZonePicker",
    kind: "XV.PickerWidget",
    collection: "XM.shipZones",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // SORT TYPE
  //

  enyo.kind({
    name: "XV.SortTypePicker",
    kind: "XV.PickerWidget",
    showLabel: false,
    prerender: false,
    collection: "XM.sortTypes"
  });

  // ..........................................................
  // TAX AUTHORITY
  //

  enyo.kind({
    name: "XV.TaxAuthorityPicker",
    kind: "XV.PickerWidget",
    collection: "XM.taxAuthorities",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // TAX CLASS
  //

  enyo.kind({
    name: "XV.TaxClassPicker",
    kind: "XV.PickerWidget",
    collection: "XM.taxClasses",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // TAX ZONE
  //

  enyo.kind({
    name: "XV.TaxZonePicker",
    kind: "XV.PickerWidget",
    collection: "XM.taxZones",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // TAX CODE
  //

  enyo.kind({
    name: "XV.TaxCodePicker",
    kind: "XV.PickerWidget",
    collection: "XM.taxCodes",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // TAX TYPE
  //

  enyo.kind({
    name: "XV.TaxTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.taxTypes",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // TERMS
  //

  enyo.kind({
    name: "XV.TermsPicker",
    kind: "XV.PickerWidget",
    collection: "XM.terms",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // TERMS TYPE
  //

  enyo.kind({
    name: "XV.TermsTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.termsTypes",
    showNone: false,
    nameAttribute: "name"
  });

  // ..........................................................
  // UNIT
  //

  enyo.kind({
    name: "XV.UnitPicker",
    kind: "XV.PickerWidget",
    collection: "XM.units",
    published: {
      allowedUnits: null
    },
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // USER
  //

  enyo.kind({
    name: "XV.UserPicker",
    kind: "XV.PickerWidget",
    collection: "XM.users",
    nameAttribute: "username",
    orderBy: [
      {attribute: 'username'}
    ]
  });

  // ..........................................................
  // VENDOR TYPE
  //

  enyo.kind({
    name: "XV.VendorTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.vendorTypes",
    nameAttribute: "code"
  });

  // ..........................................................
  // SITE
  //

  enyo.kind({
    name: "XV.SitePicker",
    kind: "XV.PickerWidget",
    nameAttribute: "code",
    collection: "XM.siteRelations",
    orderBy: [
      {attribute: 'code'}
    ],
    /**
      We can't assume that setShowing will be called on
      this widget, so call it ourselves on create. Note
      that we have to make sure XT.session.settings exists
      before we can do so.
     */
    create: function () {
      this.inherited(arguments);
      var that = this,
        callback = function () {
          that.setShowing(that.getShowing());
        };

      // If not everything is loaded yet, come back to it later
      if (!XT.session || !XT.session.settings) {
        XT.getStartupManager().registerCallback(callback);
      } else {
        callback();
      }
    },
    /**
      If the user does not have multi-site, then always
      keep hidden. We assume that this function is called
      at least once by the time the picker is to be used.
     */
    setShowing: function () {
      if (XT.session.settings.get("MultiWhs")) {
        this.inherited(arguments);
      } else {
        this.inherited(arguments, [false]);
      }
    },
  });

  enyo.kind({
    name: "XV.HeavyweightSitePicker",
    kind: "XV.SitePicker",
    collection: "XM.sites"
  });

  enyo.kind({
    name: "XV.OptionalSitePicker",
    kind: "XV.SitePicker",
    showNone: true
  });

  // ..........................................................
  // SITE TYPE
  //

  enyo.kind({
    name: "XV.SiteTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.siteTypes",
    orderBy: [
      {attribute: 'name'}
    ]
  });

  // ..........................................................
  // SALE TYPE
  //

  enyo.kind({
    name: "XV.SaleTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.saleTypes",
    nameAttribute: "code",
    orderBy: [
      {attribute: 'code'}
    ]
  });

  // ..........................................................
  // WAGE TYPE
  //

  enyo.kind({
    name: "XV.WageTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.wageTypes",
    showNone: false,
    valueAttribute: "id"
  });

  // ..........................................................
  // WAGE PERIOD
  //

  enyo.kind({
    name: "XV.WagePeriodPicker",
    kind: "XV.PickerWidget",
    collection: "XM.wagePeriods",
    showNone: false,
    valueAttribute: "id"
  });

  // ..........................................................
  // WORKFLOW STATUS
  //

  enyo.kind({
    name: "XV.WorkflowStatusPicker",
    kind: "XV.PickerWidget",
    showNone: false,
    collection: "XM.workflowStatuses"
  });

  // ..........................................................
  // WORKFLOW TYPE
  //

  enyo.kind({
    name: "XV.SalesOrderWorkflowTypePicker",
    kind: "XV.PickerWidget",
    showNone: false,
    collection: "XM.salesOrderWorkflowTypes"
  });

  // ..........................................................
  // YEAR
  //

  enyo.kind({
    name: "XV.YearPicker",
    kind: "XV.PickerWidget",
    showNone: false,
    collection: "XM.years"
  });
}());
