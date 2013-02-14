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

  // INCIDENT EMAIL PROFILE
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
  // SHIPPING FORMS
  //

  enyo.kind({
    name: "XV.ShippingFormPicker",
    kind: "XV.PickerWidget",
    collection: "XM.shippingForms",
    orderBy: [
      {attribute: 'name'}
    ]
  });
  
  // ..........................................................
  // SHIP Zone
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
  // TAX ZONE
  //

  enyo.kind({
    name: "XV.TaxAuthorityPicker",
    kind: "XV.PickerWidget",
    collection: "XM.taxAuthorities",
    nameAttribute: "number",
    orderBy: [
      {attribute: 'number'}
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
  // UNIT
  //

  enyo.kind({
    name: "XV.UnitWidget",
    kind: "XV.PickerWidget",
    collection: "XM.units",
    orderBy: [
      {attribute: 'name'}
    ]
  });
  
}());
