/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {
  
  // ..........................................................
  // CUSTOMER GROUP
  //

  enyo.kind({
    name: "XV.CustomerGroupList",
    kind: "XV.List",
    label: "_customerGroup".loc(),
    collection: "XM.CustomerGroupCollection",
    parameterWidget: "XV.CustomerGroupListParameters",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "name", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.CustomerGroupRelation", "XV.CustomerGroupList");
  
  // ..........................................................
  // CUSTOMER GROUP CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerGroupCustomerList",
    kind: "XV.List",
    label: "_customers".loc(),
    collection: "XM.CustomerGroupCustomerCollection",
    parameterWidget: "XV.CustomerGroupCustomerListParameters",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "name", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.CustomerGroupCustomerRelation", "XV.CustomerGroupCustomerList");
  
  // ..........................................................
  // FREIGHT CLASS
  //

  enyo.kind({
    name: "XV.FreightClassList",
    kind: "XV.List",
    label: "_freightClass".loc(),
    collection: "XM.FreightClassCollection",
    parameterWidget: "XV.FreightClassListParameters",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "code", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.FreightClassRelation", "XV.FreightClassList");
  
  // ..........................................................
  // SALE TYPE
  //

  enyo.kind({
    name: "XV.SaleTypeList",
    kind: "XV.List",
    label: "_saleTypes".loc(),
    collection: "XM.SaleTypeCollection",
    parameterWidget: "XV.SaleTypeListParameters",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "code", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });
  
  XV.registerModelList("XM.SaleTypeRelation", "XV.SaleTypeList");
  
  // ..........................................................
  // SALES REP
  //

  enyo.kind({
    name: "XV.SalesRepList",
    kind: "XV.List",
    label: "_salesRep".loc(),
    collection: "XM.SalesRepCollection",
    parameterWidget: "XV.SalesRepListParameters",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "number", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.SalesRepRelation", "XV.SalesRepList");
  
  // ..........................................................
  // SHIP ZONE
  //

  enyo.kind({
    name: "XV.ShipZoneList",
    kind: "XV.List",
    label: "_shipZones".loc(),
    collection: "XM.ShipZoneCollection",
    parameterWidget: "XV.ShipZoneListParameters",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "name", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.ShipZoneRelation", "XV.ShipZoneList");
  
  // ..........................................................
  // TAX AUTHORITY
  //

  enyo.kind({
    name: "XV.TaxAuthorityList",
    kind: "XV.List",
    label: "_taxAuthority".loc(),
    collection: "XM.TaxAuthorityCollection",
    parameterWidget: "XV.TaxAuthorityListParameters",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "number", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.TaxAuthorityRelation", "XV.TaxAuthorityList");
  
  // ..........................................................
  // TAX CODE
  //

  enyo.kind({
    name: "XV.TaxCodeList",
    kind: "XV.List",
    label: "_taxCode".loc(),
    collection: "XM.TaxCodeCollection",
    parameterWidget: "XV.TaxCodeListParameters",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "code", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.TaxCodeRelation", "XV.TaxCodeList");
  
  // ..........................................................
  // TAX CLASS
  //

  enyo.kind({
    name: "XV.TaxClassList",
    kind: "XV.List",
    label: "_taxClass".loc(),
    collection: "XM.TaxClassCollection",
    parameterWidget: "XV.TaxClassListParameters",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "code", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.TaxClassRelation", "XV.TaxClassList");
  
  // ..........................................................
  // TAX TYPE
  //

  enyo.kind({
    name: "XV.TaxTypeList",
    kind: "XV.List",
    label: "_taxType".loc(),
    collection: "XM.TaxTypeCollection",
    parameterWidget: "XV.TaxTypeListParameters",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "name", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.TaxTypeRelation", "XV.TaxTypeList");
  
  // ..........................................................
  // TAX ZONE
  //

  enyo.kind({
    name: "XV.TaxZoneList",
    kind: "XV.List",
    label: "_taxZone".loc(),
    collection: "XM.TaxZoneCollection",
    parameterWidget: "XV.TaxZoneListParameters",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "code", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.TaxZoneRelation", "XV.TaxZoneList");
  
  // ..........................................................
  // TERMS
  //

  enyo.kind({
    name: "XV.TermsList",
    kind: "XV.List",
    label: "_terms".loc(),
    collection: "XM.TermsCollection",
    parameterWidget: "XV.TermsListParameters",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "code", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.TermsRelation", "XV.TermsList");

}());
