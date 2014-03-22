/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.ContactListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "lastName"},
      {attribute: "firstName"},
      {attribute: "primaryEmail"}
    ],
    parentKey: "account",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "firstName",
                  formatter: "formatFirstName"},
                {kind: "XV.ListAttr", attr: "lastName", fit: true, classes: "bold",
                  style: "padding-left: 0px;"}
              ]},
              {kind: "XV.ListAttr", attr: "phone", fit: true, classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "jobTitle",
                placeholder: "_noJobTitle".loc()},
              {kind: "XV.ListAttr", attr: "primaryEmail", ontap: "sendMail",
                classes: "right hyperlink", fit: true}
            ]}
          ]}
        ]}
      ]}
    ],
    formatFirstName: function (value, view, model) {
      var lastName = (model.get('lastName') || "").trim(),
        firstName = (model.get('firstName') || "").trim();
      if (_.isEmpty(firstName) && _.isEmpty(lastName)) {
        view.addRemoveClass("placeholder", true);
        value = "_noName".loc();
      } else {
        view.addRemoveClass("bold", _.isEmpty(lastName));
      }
      return value;
    },
    sendMail: XV.ContactList.prototype.sendMail
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactEmailListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "email"}
    ],
    parentKey: "contact",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "email", classes: "hyperlink", ontap: "sendMail"}
            ]}
          ]}
        ]}
      ]}
    ],
    sendMail: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        email = model ? model.getValue('email') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
        win.close();
      }
      return true;
    }
  });

  // ..........................................................
  // CREDIT CARDS
  //

  enyo.kind({
    name: "XV.CreditCardListRelations",
    kind: "XV.ListRelations",
    published: {
      suppressInactive: false
    },
    parentKey: "customer",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", fit: true, components: [
            {kind: "XV.ListAttr", attr: "name"}
          ]},
          {kind: "XV.ListColumn", components: [
            {kind: "XV.ListAttr", attr: "number", classes: "bold"}
          ]}
        ]}
      ]}
    ],
    setupItem: function (inSender, inEvent) {
      var index = inEvent.index,
        model = this.readyModels()[index],
        isActive = model ? model.getValue('isActive') : false,
        isNotActive = _.isBoolean(isActive) ? !isActive : false;
      if (!model) { return; }

      this.inherited(arguments);

      if (this.getSuppressInactive()) {
        this.$.listItem.setShowing(!isNotActive);
      }
    }
  });

  // ..........................................................
  // CUSTOMER GROUP CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerGroupCustomerListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "customer.number"}
    ],
    parentKey: "customerGroup",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableRows", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "customer.number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "customer.name", fit: true}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // CUSTOMER SHIPTO
  //

  enyo.kind({
    name: "XV.CustomerShipToListRelations",
    kind: "XV.ListRelations",
    parentKey: "customer",
    orderBy: [
      {attribute: "number"}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true}
              ]}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "contact.name", classes: "italic"},
            {kind: "XV.ListAttr", attr: "address.formatShort"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // EMPLOYEE GROUP EMPLOYEE
  //

  enyo.kind({
    name: "XV.EmployeeGroupEmployeeListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "employee.code"}
    ],
    parentKey: "employeeGroup",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableRows", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "employee.code", classes: "bold"},
              {kind: "XV.ListAttr", attr: "employee.name", fit: true}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // EMPLOYEE GROUP GROUP
  //

  enyo.kind({
    name: "XV.EmployeeGroupGroupListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "employeeGroup.name"}
    ],
    parentKey: "employee",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableRows", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "employeeGroup.name", classes: "bold"},
              {kind: "XV.ListAttr", attr: "employeeGroup.description", fit: true}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // INVOICE ALLOCATION
  //

  enyo.kind({
    name: "XV.InvoiceAllocationListRelations",
    kind: "XV.ListRelations",
    parentKey: "invoice",
    orderBy: [
      {attribute: "uuid"}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "amount"}
              ]}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "currency"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // INVOICE LINE
  //

  enyo.kind({
    name: "XV.InvoiceLineItemListRelations",
    kind: "XV.ListRelations",
    parentKey: "invoice",
    orderBy: [
      {attribute: "lineNumber"}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "lineNumber", isKey: true}
              ]}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "item.number"},
              {kind: "XV.ListAttr", attr: "site.code"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "quantity", formatter: "formatQuantity"},
            {kind: "XV.ListAttr", attr: "billed", formatter: "formatBilled"}
          ]}
        ]}
      ]}
    ],
    formatBilled: function (value) {
      return "_billed".loc() + ": " + value;
    },
    formatQuantity: function (value) {
      return "_quantity".loc() + ": " + value;
    },
  });

  // ..........................................................
  // INVOICE LINE TAX
  //

  enyo.kind({
    name: "XV.InvoiceLineTaxListRelations",
    kind: "XV.ListRelations",
    parentKey: "parent",
    orderBy: [
      {attribute: "uuid"}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableRows", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "taxCode.code"},
              {kind: "XV.ListAttr", attr: "taxType.name", fit: true, classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "amount"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // INVOICE TAX
  // Summarized read-only models of line item taxes

  enyo.kind({
    name: "XV.InvoiceTaxListRelations",
    kind: "XV.ListRelations",
    parentKey: "invoice",
    orderBy: [
      {attribute: "uuid"}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableRows", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "type"},
              {kind: "XV.ListAttr", attr: "code", classes: "right"},
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "amount", formatter: "formatPrice"}
            ]}
          ]}
        ]}
      ]}
    ],
    formatPrice: function (value, view, model) {
      var currency = model.get("currency"),
        scale = XT.locale.salesPriceScale;
      return currency ? currency.format(value, scale) : "";
    }
  });

  // ..........................................................
  // INVOICE TAX ADJUSTMENT
  //

  enyo.kind({
    name: "XV.InvoiceTaxAdjustmentListRelations",
    kind: "XV.ListRelations",
    parentKey: "invoice",
    orderBy: [
      {attribute: "uuid"}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableRows", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "taxCode.code"},
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "amount", formatter: "formatPrice"}
            ]}
          ]}
        ]}
      ]}
    ],
    formatPrice: function (value, view, model) {
      var parent = model.getParent(),
        currency = parent ? parent.get("currency") : false,
        scale = XT.locale.salesPriceScale;
      return currency ? currency.format(value, scale) : "";
    }
  });

  // ..........................................................
  // ITEM ALIAS
  //

  enyo.kind({
    name: "XV.ItemAliasListRelations",
    kind: "XV.ListRelations",
    parentKey: "item",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "aliasNumber", classes: "bold"},
              {kind: "XV.ListAttr", attr: "account.number",
                classes: "right", placeholder: "_allAccounts".loc()}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "description1",
                placeholder: "_noDescription".loc()}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // TAX REGISTRATION
  //

  enyo.kind({
    name: "XV.TaxRegistrationListRelations",
    kind: "XV.ListRelations",
    parentKey: "customer",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", fit: true, components: [
            {kind: "XV.ListAttr", attr: "taxAuthority.number", classes: "bold"}
          ]},
          {kind: "XV.ListColumn", components: [
            {kind: "XV.ListAttr", attr: "number"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // CHARACTERISTIC
  //

  enyo.kind({
    name: "XV.CharacteristicOptionListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: 'order', descending: true}
    ],
    parentKey: "characteristic",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", fit: true, components: [
            {kind: "XV.ListAttr", attr: "value", classes: "bold"}
          ]},
          {kind: "XV.ListColumn", components: [
            {kind: "XV.ListAttr", attr: "order"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: 'number', descending: true}
    ],
    //parentKey: "account", to be defined by subkind
    workspace: "XV.IncidentWorkspace",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "getIncidentStatusString", fit: true},
              {kind: "XV.ListAttr", attr: "updated", formatter: "formatDate",
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ],
    formatDate: XV.IncidentList.prototype.formatDate
  });

  // ..........................................................
  // INCIDENT HISTORY
  //

  enyo.kind({
    name: "XV.IncidentHistoryListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "lastName"},
      {attribute: "firstName"},
      {attribute: "primaryEmail"}
    ],
    parentKey: "history",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableRows", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "createdBy"},
              {kind: "XV.ListAttr", attr: "created", fit: true, classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // ITEM GROUP ITEM
  //

  enyo.kind({
    name: "XV.ItemGroupItemListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "item.number"}
    ],
    parentKey: "itemGroup",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableRows", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "item.number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "item.description1", classes: "right"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // LOCATION ITEM
  //

  enyo.kind({
    name: "XV.LocationItemListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: 'item.number'}
    ],
    parentKey: "location",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "item.number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "item.description1", classes: "right"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // QUOTE LINE ITEM
  //

  enyo.kind({
    name: "XV.QuoteLineItemListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "lineNumber"}
    ],
    parentKey: "quote",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "lineNumber", classes: "bold"},
              {kind: "XV.ListAttr", attr: "site.code",
                classes: "right"},
              {kind: "XV.ListAttr", attr: "item.number", fit: true}
            ]},
            {kind: "XV.ListAttr", attr: "item.description1",
              fit: true,  style: "text-indent: 18px;"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "quantity",
              style: "text-align: right"},
            {kind: "XV.ListAttr", attr: "price",
              style: "text-align: right"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "quantityUnit.name"},
            {kind: "XV.ListAttr", attr: "priceUnit.name"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "scheduleDate",
              style: "text-align: right"},
            {kind: "XV.ListAttr", attr: "extendedPrice",
              style: "text-align: right"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // RETURN LINE
  //

  enyo.kind({
    name: "XV.ReturnLineItemListRelations",
    kind: "XV.ListRelations",
    parentKey: "return",
    orderBy: [
      {attribute: "lineNumber"}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "lineNumber", isKey: true}
              ]}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "item.number"},
              {kind: "XV.ListAttr", attr: "site.code"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "quantity", formatter: "formatQuantity"},
            {kind: "XV.ListAttr", attr: "credited", formatter: "formatCredited"}
          ]}
        ]}
      ]}
    ],
    formatCredited: function (value) {
      return "_credited".loc() + ": " + value;
    },
    formatQuantity: function (value) {
      return "_quantity".loc() + ": " + value;
    },
  });

  // ..........................................................
  // RETURN TAX
  // Summarized read-only models of line item taxes

  enyo.kind({
    name: "XV.ReturnTaxListRelations",
    kind: "XV.InvoiceTaxListRelations",
    parentKey: "return"
  });

  // ..........................................................
  // RETURN TAX ADJUSTMENT
  //

  enyo.kind({
    name: "XV.ReturnTaxAdjustmentListRelations",
    kind: "XV.InvoiceTaxAdjustmentListRelations",
    parentKey: "return"
  });

  // ..........................................................
  // SALES ORDER LINE ITEM
  //

  enyo.kind({
    name: "XV.SalesOrderLineItemListRelations",
    kind: "XV.QuoteLineItemListRelations",
    parentKey: "salesOrder"
  });

  // ..........................................................
  // SALES ORDER AND SALE TYPE WORKFLOW
  //

  enyo.kind({
    name: "XV.WorkflowListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "sequence"}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name", classes: "bold"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.SalesOrderWorkflowListRelations",
    kind: "XV.WorkflowListRelations",
    parentKey: "salesOrder"
  });

  enyo.kind({
    name: "XV.SaleTypeWorkflowListRelations",
    kind: "XV.WorkflowListRelations",
    parentKey: "saleType"
  });

}());
