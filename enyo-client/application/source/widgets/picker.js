/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // ACCOUNT TYPE
  //

  enyo.kind({
    name: "XV.AccountTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.accountTypes"
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
    collection: "XM.creditStatuses"
  });
  
  // ..........................................................
  // DEPARTMENT
  //

  enyo.kind({
    name: "XV.DepartmentPicker",
    kind: "XV.PickerWidget",
    collection: "XM.departments"
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
    collection: "XM.projectStatuses"
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
  // PLANNER CODE
  //

  enyo.kind({
    name: "XV.SitePicker",
    kind: "XV.PickerWidget",
    collection: "XM.sites",
    orderBy: [
      {attribute: 'code'}
    ]
  });
  
  // ..........................................................
  // SHIFT
  //

  enyo.kind({
    name: "XV.ShiftPicker",
    kind: "XV.PickerWidget",
    collection: "XM.shifts"
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
  // SITE
  //

  enyo.kind({
    name: "XV.SitePicker",
    kind: "XV.PickerWidget",
    nameAttribute: "code",
    collection: "XM.sites",
    orderBy: [
      {attribute: 'code'}
    ]
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

}());
