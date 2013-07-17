/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
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
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectTaskListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "number"}
    ],
    parentKey: "project",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "dueDate", fit: true,
                formatter: "formatDueDate",
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "name"}
          ]},
          {kind: "XV.ListColumn", classes: "third",
            components: [
            {kind: "XV.ListAttr", attr: "getProjectStatusString"},
            {kind: "XV.ListAttr", attr: "owner.username"}
          ]},
          {kind: "XV.ListColumn", style: "width: 80;",
            components: [
            {content: "_budgeted".loc() + ":", classes: "xv-list-attr",
              style: "text-align: right;"},
            {content: "_actual".loc() + ":", classes: "xv-list-attr",
              style: "text-align: right;"},
            {content: "_balance".loc() + ":", classes: "xv-list-attr",
              style: "text-align: right;"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "budgetedExpenses",
              classes: "text-align-right", formatter: "formatExpenses"},
            {kind: "XV.ListAttr", attr: "actualExpenses",
              classes: "text-align-right", formatter: "formatExpenses"},
            {kind: "XV.ListAttr", attr: "balanceExpenses",
              classes: "text-align-right", formatter: "formatBalanceExpenses"}
          ]},
          {kind: "XV.ListColumn", classes: "money", fit: true, components: [
            {kind: "XV.ListAttr", attr: "budgetedHours",
              classes: "text-align-right", formatter: "formatHours"},
            {kind: "XV.ListAttr", attr: "actualHours",
              classes: "text-align-right", formatter: "formatHours"},
            {kind: "XV.ListAttr", attr: "balanceHours",
              classes: "text-align-right", formatter: "formatBalanceHours"}
          ]}
        ]}
      ]}
    ],
    formatBalanceExpenses: function (value, view, model) {
      var actual = model.get('actualExpenses'),
        budget = model.get('budgetedExpenses');
      return this.formatExpenses(budget - actual, view);
    },
    formatBalanceHours: function (value, view, model) {
      var actual = model.get('actualHours'),
        budget = model.get('budgetedHours');
      return this.formatHours(budget - actual, view);
    },
    formatDueDate: XV.ProjectList.prototype.formatDueDate,
    formatHours: XV.ProjectList.prototype.formatHours,
    formatExpenses: XV.ProjectList.prototype.formatExpenses
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
  // OPPORTUNITY QUOTE
  //

  enyo.kind({
    name: "XV.OpportunityQuoteListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: 'number', descending: true}
    ],
    parentKey: "opportunity",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "shipVia", classes: "right"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // CUSTOMER/PROSPECT QUOTE/SALESORDER
  //

  enyo.kind({
    name: "XV.CustomerQuoteListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: 'number', descending: true}
    ],
    parentKey: "customer",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", classes: "bold"},
              {kind: "XV.ListAttr", attr: "shipVia", classes: "right"}
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
              formatter: "formatQuantity", style: "text-align: right"},
            {kind: "XV.ListAttr", attr: "price",
              formatter: "formatPrice", style: "text-align: right"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "quantityUnit.name"},
            {kind: "XV.ListAttr", attr: "priceUnit.name"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "scheduleDate",
              style: "text-align: right"},
            {kind: "XV.ListAttr", attr: "extendedPrice",
              style: "text-align: right", formatter: "formatExtendedPrice"}
          ]}
        ]}
      ]}
    ],
    formatExtendedPrice: function (value, view, model) {
      var parent = model.getParent(),
        currency = parent ? parent.get("currency") : false,
        scale = XT.session.locale.attributes.extendedPriceScale;
      return currency ? currency.format(value, scale) : "";
    },
    formatPercentage: function (value, view, model) {
      var parent = model.getParent(),
        currency = parent ? parent.get("currency") : false,
        scale = XT.session.locale.attributes.percentPriceScale;
      return currency ? currency.format(value, scale) : "";
    },
    formatPrice: function (value, view, model) {
      var parent = model.getParent(),
        currency = parent ? parent.get("currency") : false,
        scale = XT.session.locale.attributes.salesPriceScale;
      return currency ? currency.format(value, scale) : "";
    },
    formatQuantity: function (value, view, model) {
      var scale = XT.session.locale.attributes.quantityScale;
      return Globalize.format(value, "n" + scale);
    }
  });

  // ..........................................................
  // SALES ORDER LINE ITEM
  //

  enyo.kind({
    name: "XV.SalesOrderLineItemListRelations",
    kind: "XV.QuoteLineItemListRelations",
    parentKey: "salesOrder"
  });

}());
