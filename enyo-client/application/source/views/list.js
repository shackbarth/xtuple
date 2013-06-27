/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountList",
    kind: "XV.List",
    label: "_accounts".loc(),
    collection: "XM.AccountListItemCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    parameterWidget: "XV.AccountListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "primaryContact.phone", fit: true,
                classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name"},
              {kind: "XV.ListAttr", attr: "primaryContact.primaryEmail",
                ontap: "sendMail", classes: "right hyperlink"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "primaryContact.name", classes: "italic",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "primaryContact.address.formatShort"}
          ]}
        ]}
      ]}
    ],
    sendMail: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        email = model ? model.getValue('primaryContact.primaryEmail') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
        win.close();
      }
      return true;
    }
  });

  XV.registerModelList("XM.AccountRelation", "XV.AccountList");

  // ..........................................................
  // ADDRESS
  //

  enyo.kind({
    name: "XV.AddressList",
    kind: "XV.List",
    label: "_addresses".loc(),
    collection: "XM.AddressInfoCollection",
    query: {orderBy: [
      {attribute: 'country'},
      {attribute: 'state'},
      {attribute: 'city'},
      {attribute: 'line1'}
    ]},
    parameterWidget: "XV.AddressListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "XV.ListAttr", attr: "id", formatter: "formatAddress",
          classes: "xv-addresslist-attr", allowHtml: true}
      ]}
    ],
    formatAddress: function (value, view, model) {
      return XM.Address.format(model, true);
    },
    setQuery: function (query) {
      // If account is in filter, need to switch to a model including account.
      var account,
        collection;
      account = _.find(query.parameters, function (param) {
        return param.attribute === 'account';
      });
      collection = account ?
        'XM.AccountAddressListItemCollection' : 'XM.AddressInfoCollection';
      this.setCollection(collection);
      this.inherited(arguments);
    }
  });

  // ..........................................................
  // CLASS CODE
  //

  enyo.kind({
    name: "XV.ClassCodeList",
    kind: "XV.List",
    label: "_classCodes".loc(),
    collection: "XM.ClassCodeCollection",
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

  // ..........................................................
  // CONFIGURE
  //

  enyo.kind({
    name: "XV.ConfigurationsList",
    kind: "XV.List",
    label: "_configure".loc(),
    collection: "XM.configurations",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    canAddNew: false,
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "name", classes: "bold"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ],
    collectionChanged: function () {
      var collection = this.getCollection(),
        obj = XT.getObjectByName(collection);
      this.setValue(obj);
    },
    getModel: function (index) {
      var model = this.getValue().at(index);
      return XT.getObjectByName(model.get('model'));
    },
    getWorkspace: function () {
      return this._workspace;
    },
    itemTap: function (inSender, inEvent) {
      var model = this.getValue().at(inEvent.index);
      this._workspace = model.get('workspace');
      return this.inherited(arguments);
    },
    fetch: function () {
      this.fetched();
    }

  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactList",
    kind: "XV.List",
    label: "_contacts".loc(),
    collection: "XM.ContactListItemCollection",
    query: {orderBy: [
      {attribute: 'lastName'},
      {attribute: 'firstName'},
      {attribute: 'primaryEmail'}
    ]},
    parameterWidget: "XV.ContactListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "firstName",
                  formatter: "formatFirstName", isKey: true},
                {kind: "XV.ListAttr", attr: "lastName", fit: true,
                  style: "padding-left: 0px;", isKey: true}
              ]},
              {kind: "XV.ListAttr", attr: "phone", fit: true, classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "jobTitle",
                placeholder: "_noJobTitle".loc()},
              {kind: "XV.ListAttr", attr: "primaryEmail", ontap: "sendMail",
                classes: "right hyperlink", fit: true}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.ListAttr", attr: "address.formatShort"}
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
      if (this.getToggleSelected()) {
        view.addRemoveClass("hyperlink", true);
      }
      return value;
    },
    sendMail: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        email = model ? model.getValue('primaryEmail') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
        win.close();
      }
      return true;
    }
  });

  XV.registerModelList("XM.ContactRelation", "XV.ContactList");

  // ..........................................................
  // COST CATEGORY
  //

  enyo.kind({
    name: "XV.CostCategoryList",
    kind: "XV.List",
    label: "_costCategories".loc(),
    collection: "XM.CostCategoryCollection",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    parameterWidget: "XV.CostCategoryListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "code", isKey: true},
              {kind: "XV.ListAttr", attr: "description", fit: true, classes: "right"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.CostCategory", "XV.CostCategoryList");

  // ..........................................................
  // CURRENCY
  //

  enyo.kind({
    name: "XV.CurrencyList",
    kind: "XV.List",
    label: "_currencies".loc(),
    collection: "XM.CurrencyCollection",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "abbreviation", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerList",
    kind: "XV.List",
    label: "_customers".loc(),
    collection: "XM.CustomerRelationCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    parameterWidget: "XV.CustomerListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "billingContact.phone", fit: true,
                classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name"},
              {kind: "XV.ListAttr", attr: "billingContact.primaryEmail",
                ontap: "sendMail", classes: "right hyperlink"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "billingContact.name", classes: "italic",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "billingContact.address.formatShort"}
          ]}
        ]}
      ]}
    ],
    sendMail: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        email = model ? model.getValue('billingContact.primaryEmail') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
        win.close();
      }
      return true;
    }
  });

  XV.registerModelList("XM.CustomerRelation", "XV.CustomerList");

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
  // CUSTOMER PROSPECT
  //

  enyo.kind({
    name: "XV.CustomerProspectList",
    kind: "XV.CustomerList",
    label: "_customerProspect".loc(),
    collection: "XM.CustomerProspectListItemCollection",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "contact.phone", fit: true,
                classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name"},
              {kind: "XV.ListAttr", attr: "contact.primaryEmail",
                ontap: "sendMail", classes: "right hyperlink"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "contact.name", classes: "italic",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "contact.address.formatShort"}
          ]}
        ]}
      ]}
    ],
  });

  XV.registerModelList("XM.CustomerProspectRelation", "XV.CustomerProspectList");

  // ..........................................................
  // CUSTOMER SHIPTO
  //
  enyo.kind({
    name: "XV.CustomerShiptoList",
    kind: "XV.List",
    collection: "XM.CustomerShiptoRelationCollection",
    parameterWidget: "XV.CustomerShiptoParameters",
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
  XV.registerModelList("XM.CustomerShiptoRelation", "XV.CustomerShiptoList");

  // ..........................................................
  // CUSTOMER TYPE LIST
  //

  enyo.kind({
    name: "XV.CustomerTypeList",
    kind: "XV.List",
    label: "_customerTypes".loc(),
    collection: "XM.CustomerTypeCollection",
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

  XV.registerModelList("XM.CustomerType", "XV.CustomerTypeList");

  // ..........................................................
  // DEPARTMENT
  //

  enyo.kind({
    name: "XV.DepartmentList",
    kind: "XV.List",
    label: "_departments".loc(),
    collection: "XM.DepartmentCollection",
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

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.EmployeeList",
    kind: "XV.List",
    label: "_employees".loc(),
    collection: "XM.EmployeeRelationCollection",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    parameterWidget: "XV.EmployeeListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "code", isKey: true},
              {kind: "XV.ListAttr", attr: "contact.phone", fit: true,
                classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name"},
              {kind: "XV.ListAttr", attr: "contact.primaryEmail",
                ontap: "sendMail", classes: "right hyperlink"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "contact.name", classes: "italic",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "contact.address.formatShort"}
          ]}
        ]}
      ]}
    ],
    sendMail: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        email = model ? model.getValue('contact.primaryEmail') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
        win.close();
      }
      return true;
    }
  });

  XV.registerModelList("XM.EmployeeRelation", "XV.EmployeeList");

  // ..........................................................
  // EMPLOYEE GROUP
  //

  enyo.kind({
    name: "XV.EmployeeGroupList",
    kind: "XV.CustomerGroupList",
    label: "_employeeGroup".loc(),
    collection: "XM.EmployeeGroupCollection",
    parameterWidget: "XV.EmployeeGroupListParameters"
  });

  XV.registerModelList("XM.EmployeeGroupRelation", "XV.EmployeeGroupList");

  // ..........................................................
  // EXPENSE CATEGORY
  //

  enyo.kind({
    name: "XV.ExpenseCategoryList",
    kind: "XV.List",
    label: "_expenseCategories".loc(),
    collection: "XM.ExpenseCategoryCollection",
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

  // ..........................................................
  // FILE
  //

  enyo.kind({
    name: "XV.FileList",
    kind: "XV.List",
    label: "_files".loc(),
    collection: "XM.FileRelationCollection",
    parameterWidget: "XV.FileListParameters",
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

  XV.registerModelList("XM.FileRelation", "XV.FileList");

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
  // HONORIFIC
  //

  enyo.kind({
    name: "XV.HonorificList",
    kind: "XV.List",
    label: "_honorifics".loc(),
    collection: "XM.HonorificCollection",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "XV.ListColumn", classes: "last", components: [
          {kind: "XV.ListAttr", attr: "code", isKey: true}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentList",
    kind: "XV.List",
    label: "_incidents".loc(),
    collection: "XM.IncidentListItemCollection",
    query: {orderBy: [
      {attribute: 'priorityOrder'},
      {attribute: 'updated', descending: true},
      {attribute: 'number', descending: true, numeric: true}
    ]},
    toggleSelected: false,
    parameterWidget: "XV.IncidentListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "updated", fit: true, formatter: "formatDate",
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "description"}
          ]},
          {kind: "XV.ListColumn", classes: "second", components: [
            {kind: "XV.ListAttr", attr: "account.name", classes: "italic"},
            {kind: "XV.ListAttr", attr: "contact.name"}
          ]},
          {kind: "XV.ListColumn", classes: "third", components: [
            {kind: "XV.ListAttr", attr: "getIncidentStatusString"},
            {kind: "XV.ListAttr", attr: "assignedTo.username"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "priority.name",
              placeholder: "_noPriority".loc()},
            {kind: "XV.ListAttr", attr: "category.name",
              placeholder: "_noCategory".loc()}
          ]}
        ]}
      ]}
    ],
    formatDate: function (value, view, model) {
      var isToday = !XT.date.compareDate(value, new Date());
      view.addRemoveClass("bold", isToday);
      return value;
    },
    getStyle: function (model) {
      var settings = XT.session.getSettings(),
        K = XM.Incident,
        status = model ? model.get('status') : null,
        background,
        style;
      switch (status)
      {
      case K.NEW:
        background = settings.get('IncidentNewColor');
        break;
      case K.FEEDBACK:
        background = settings.get('IncidentFeedbackColor');
        break;
      case K.CONFIRMED:
        background = settings.get('IncidentConfirmedColor');
        break;
      case K.ASSIGNED:
        background = settings.get('IncidentAssignedColor');
        break;
      case K.RESOLVED:
        background = settings.get('IncidentResolvedColor');
        break;
      case K.CLOSED:
        background = settings.get('IncidentClosedColor');
        break;
      }
      if (background) {
        style = "background: " + background + ";";
      }
      return style;
    },
    setupItem: function (inSender, inEvent) {
      this.inherited(arguments);
      var model = this.getValue().models[inEvent.index],
        style = this.getStyle(model),
        prop,
        view;

      // Apply background color to all views.
      this.$.listItem.setStyle(style);
      for (prop in this.$) {
        if (this.$.hasOwnProperty(prop) && this.$[prop].getAttr) {
          view = this.$[prop];
          view.setStyle(style);
        }
      }
      return true;
    }
  });

  XV.registerModelList("XM.IncidentListItem", "XV.IncidentList");
  XV.registerModelList("XM.IncidentRelation", "XV.IncidentList");

  // ..........................................................
  // INCIDENT EMAIL PROFILE
  //

  enyo.kind({
    name: "XV.IncidentEmailProfileList",
    kind: "XV.List",
    label: "_incidentEmailProfiles".loc(),
    collection: "XM.IncidentEmailProfileCollection",
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

  // ..........................................................
  // ITEM
  //

  enyo.kind({
    name: "XV.ItemList",
    kind: "XV.List",
    label: "_items".loc(),
    collection: "XM.ItemListItemCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    parameterWidget: "XV.ItemListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "inventoryUnit.name", fit: true,
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", formatter: "formatDescription"}
          ]},
          {kind: "XV.ListColumn", classes: "second",
            components: [
            {kind: "XV.ListAttr", attr: "getItemTypeString", classes: "italic"},
            {kind: "XV.ListAttr", attr: "classCode.code"}
          ]},
          {kind: "XV.ListColumn", classes: "third", components: [
            {kind: "XV.ListAttr", attr: "listPrice", formatter: "formatPrice"},
            {kind: "XV.ListAttr", attr: "isFractional", formatter: "formatFractional"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "priceUnit.name", formatter: "formatPriceUnit"},
            {kind: "XV.ListAttr", attr: "productCategory.code"}
          ]}
        ]}
      ]}
    ],
    formatFractional: function (value, view, model) {
      return value ? "_fractional".loc() : "";
    },
    formatPrice: function (value, view, model) {
      var sold = model.get("isSold");
      if (XT.session.privileges.get("ViewListPrices") && sold) {
        var scale = XT.session.locale.attributes.salesPriceScale;
        return Globalize.format(value, "c" + scale);
      }
      view.addRemoveClass("placeholder", true);
      if (!sold) {
        return "_notSold".loc();
      }
      return "--";
    },
    formatPriceUnit: function (value, view, model) {
      if (XT.session.privileges.get("ViewListPrices") && model.get("isSold")) {
        return value;
      }
      return "";
    },
    formatDescription: function (value, view, model) {
      var descrip1 = model.get("description1") || "",
        descrip2 = model.get("description2") || "",
        sep = descrip2 ? " - " : "";
      return descrip1 + sep + descrip2;
    }
  });

  XV.registerModelList("XM.ItemRelation", "XV.ItemList");

  // ..........................................................
  // ITEM SITE
  //

  enyo.kind({
    name: "XV.ItemSiteList",
    kind: "XV.List",
    label: "_itemSites".loc(),
    collection: "XM.ItemSiteListItemCollection",
    query: {orderBy: [
      {attribute: 'item.number'}
    ]},
    parameterWidget: "XV.ItemSiteListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "item.number", isKey: true},
              {kind: "XV.ListAttr", attr: "item.unit.name", fit: true, classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "item.description1"}
          ]},
          {kind: "XV.ListColumn", classes: "second",
            components: [
            {kind: "XV.ListAttr", attr: "site.code", classes: "bold"},
            {kind: "XV.ListAttr", attr: "site.description"}
          ]}
        ]}
      ]}
    ],
    formatActive: function (value, view, model) {
      return value ? "_active".loc() : "";
    },
    formatSold: function (value, view, model) {
      return value ? "_sold".loc() : "";
    }
  });

  XV.registerModelList("XM.ItemSiteRelation", "XV.ItemSiteList");

  // ..........................................................
  // LEDGER ACCOUNT
  //

  enyo.kind({
    name: "XV.LedgerAccountList",
    kind: "XV.List",
    label: "_ledgerAccounts".loc(),
    collection: "XM.LedgerAccountRelationCollection",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    parameterWidget: "XV.LedgerAccountListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name", isKey: true},
              {kind: "XV.ListAttr", attr: "getAccountTypeString", fit: true,
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "description"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "externalReference"},
            {kind: "XV.ListAttr", attr: "isActive", formatter: "formatActive"}
          ]}
        ]}
      ]}
    ],
    formatActive: function (value, view, model) {
      return value ? "" : "_inactive".loc();
    }
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityList",
    kind: "XV.List",
    collection: "XM.OpportunityListItemCollection",
    query: {orderBy: [
      {attribute: 'priorityOrder'},
      {attribute: 'targetClose'},
      {attribute: 'name'},
      {attribute: 'number', numeric: true}
    ]},
    label: "_opportunities".loc(),
    parameterWidget: "XV.OpportunityListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "targetClose", fit: true,
                formatter: "formatTargetClose",
                placeholder: "_noCloseTarget".loc(),
                classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name"},
              {kind: "XV.ListAttr", attr: "amount", classes: "right",
                formatter: "formatAmount"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "second",
            components: [
            {kind: "XV.ListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.ListAttr", attr: "contact.name"}
          ]},
          {kind: "XV.ListColumn", classes: "third",
            components: [
            {kind: "XV.ListAttr", attr: "opportunityStage.name",
              placeholder: "_noStage".loc()},
            {kind: "XV.ListAttr", attr: "assignedTo.username"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "priority.name",
              placeholder: "_noPriority".loc()},
            {kind: "XV.ListAttr", attr: "opportunityType.name",
              placeholder: "_noType".loc()}
          ]}
        ]}
      ]}
    ],
    formatAmount: function (value, view, model) {
      var currency = model ? model.get("currency") : false,
        scale = XT.session.locale.attributes.moneyScale;
      return currency ? currency.format(value, scale) : "";
    },
    formatTargetClose: function (value, view, model) {
      var isLate = model && model.get('isActive') &&
        (XT.date.compareDate(value, new Date()) < 1);
      view.addRemoveClass("error", isLate);
      return value;
    }
  });

  XV.registerModelList("XM.OpportunityRelation", "XV.OpportunityList");

  // ..........................................................
  // PLANNER CODE
  //

  enyo.kind({
    name: "XV.PlannerCodeList",
    kind: "XV.List",
    label: "_plannerCodes".loc(),
    collection: "XM.PlannerCodeCollection",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    parameterWidget: "XV.PlannerCodeListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "code", isKey: true},
              {kind: "XV.ListAttr", attr: "name", fit: true, classes: "right"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.PlannerCode", "XV.PlannerCodeList");

  // ..........................................................
  // PRODUCT CATEGORY
  //

  enyo.kind({
    name: "XV.ProductCategoryList",
    kind: "XV.List",
    label: "_productCategories".loc(),
    collection: "XM.ProductCategoryCollection",
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

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectList",
    kind: "XV.List",
    label: "_projects".loc(),
    collection: "XM.ProjectListItemCollection",
    query: {orderBy: [
      {attribute: 'number' }
    ]},
    parameterWidget: "XV.ProjectListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "dueDate", fit: true,
                formatter: "formatDueDate",
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "name"},
            {kind: "XV.ListAttr", attr: "account.name"}
          ]},
          {kind: "XV.ListColumn", classes: "third",
            components: [
            {kind: "XV.ListAttr", attr: "getProjectStatusString"},
            {kind: "XV.ListAttr", attr: "assignedTo.username"}
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
              classes: "text-align-right", formatter: "formatExpenses"}
          ]},
          {kind: "XV.ListColumn", classes: "money", fit: true, components: [
            {kind: "XV.ListAttr", attr: "budgetedHours",
              classes: "text-align-right", formatter: "formatHours"},
            {kind: "XV.ListAttr", attr: "actualHours",
              classes: "text-align-right", formatter: "formatHours"},
            {kind: "XV.ListAttr", attr: "balanceHours",
              classes: "text-align-right", formatter: "formatHours"}
          ]}
        ]}
      ]}
    ],
    formatDueDate: function (value, view, model) {
      var today = new Date(),
        K = XM.Project,
        isLate = (model.get('status') !== K.COMPLETED &&
          XT.date.compareDate(value, today) < 1);
      view.addRemoveClass("error", isLate);
      return value;
    },
    formatHours: function (value, view, model) {
      view.addRemoveClass("error", value < 0);
      var scale = XT.session.locale.attributes.quantityScale;
      return Globalize.format(value, "n" + scale) + " " + "_hrs".loc();
    },
    formatExpenses: function (value, view, model) {
      view.addRemoveClass("error", value < 0);
      var scale = XT.session.locale.attributes.currencyScale;
      return Globalize.format(value, "c" + scale);
    }
  });

  XV.registerModelList("XM.ProjectRelation", "XV.ProjectList");

  enyo.kind({
    name: "XV.TaskList",
    kind: "XV.List",
    label: "_tasks".loc(),
    collection: "XM.TaskListItemCollection",
    query: {orderBy: [
      {attribute: 'dueDate'},
      {attribute: 'number'}
    ]},
    parameterWidget: "XV.ProjectTaskListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "dueDate", fit: true,
                formatter: "formatDueDate",
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "name"},
            {kind: "XV.ListAttr", attr: "project.name"}
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
              classes: "text-align-right", formatter: "formatExpenses"}
          ]},
          {kind: "XV.ListColumn", classes: "money", fit: true, components: [
            {kind: "XV.ListAttr", attr: "budgetedHours",
              classes: "text-align-right", formatter: "formatHours"},
            {kind: "XV.ListAttr", attr: "actualHours",
              classes: "text-align-right", formatter: "formatHours"},
            {kind: "XV.ListAttr", attr: "balanceHours",
              classes: "text-align-right", formatter: "formatHours"}
          ]}
        ]}
      ]}
    ],
    formatDueDate: XV.ProjectList.prototype.formatDueDate,
    formatHours: XV.ProjectList.prototype.formatHours,
    formatExpenses: XV.ProjectList.prototype.formatExpenses
  });

  // ..........................................................
  // PROSPECT
  //

  enyo.kind({
    name: "XV.ProspectList",
    kind: "XV.List",
    label: "_prospects".loc(),
    collection: "XM.ProspectRelationCollection",
    events: {
      onWorkspace: ""
    },
    actions: [{
      name: "convert",
      method: "convertProspect",
      isViewMethod: true
    }],
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    parameterWidget: "XV.ProspectListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "contact.phone", fit: true,
                classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name"},
              {kind: "XV.ListAttr", attr: "contact.primaryEmail",
                ontap: "sendMail", classes: "right hyperlink"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "contact.name", classes: "italic",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "contact.address.formatShort"}
          ]}
        ]}
      ]}
    ],
    /**
      Convert the prospect from the list into a customer model. The way we
      do this is to open a customer workspace and then call the model method
      convertFromProspect AFTER the workspace is initialized. That way
      the view and the model get bound together correctly. The user will have
      to fill out some customer-specific fields, and when they save a new
      customer will be created.
     */
    convertProspect: function (inEvent) {
      var model = inEvent.model,
        modelId = model.id,
        success = function () {
          this.getValue().convertFromProspect(modelId);
        };

      this.doWorkspace({
        workspace: "XV.CustomerWorkspace",
        attributes: {
          name: model.get("name"),
          number: model.get("number")
        },
        success: success,
        allowNew: false
      });
    },
    sendMail: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        email = model ? model.getValue('contact.primaryEmail') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
        win.close();
      }
      return true;
    }
  });

  XV.registerModelList("XM.ProspectRelation", "XV.ProspectList");

  // ..........................................................
  // QUOTE
  //

  enyo.kind({
    name: "XV.QuoteList",
    kind: "XV.List",
    label: "_quotes".loc(),
    collection: "XM.QuoteListItemCollection",
    parameterWidget: "XV.QuoteListParameters",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true,
                fit: true},
              {kind: "XV.ListAttr", attr: "getQuoteStatusString",
                style: "padding-left: 24px"},
              {kind: "XV.ListAttr", attr: "expireDate",
                formatter: "formatExpireDate", classes: "right",
                placeholder: "_noExpiration".loc()}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "customer.name"},
              {kind: "XV.ListAttr", attr: "total", formatter: "formatPrice",
                classes: "right"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "second", components: [
            {kind: "XV.ListAttr", attr: "shiptoName", classes: "italic"},
            {kind: "XV.ListAttr", attr: "shiptoAddress1"}
          ]},
          {kind: "XV.ListColumn", classes: "descr", fit: true, components: [
            {kind: "XV.ListAttr", attr: "orderNotes"}
          ]}
        ]}
      ]}
    ],
    formatExpireDate: function (value, view, model) {
      var isLate = model && model.get('expireDate') &&
        (XT.date.compareDate(value, new Date()) < 1);
      view.addRemoveClass("error", isLate);
      return value;
    },
    formatPrice: function (value, view, model) {
      var currency = model ? model.get("currency") : false,
        scale = XT.session.locale.attributes.salesPriceScale;
      return currency ? currency.format(value, scale) : "";
    }
  });

  XV.registerModelList("XM.QuoteRelation", "XV.QuoteList");

  // ..........................................................
  // SALES ORDER
  //

  enyo.kind({
    name: "XV.SalesOrderList",
    kind: "XV.List",
    label: "_salesOrders".loc(),
    collection: "XM.SalesOrderListItemCollection",
    parameterWidget: "XV.SalesOrderListParameters",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "customer.name"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "second", components: [
            {kind: "XV.ListAttr", attr: "billtoName", classes: "italic"},
            {kind: "XV.ListAttr", attr: "billtoAddress1"}
          ]},
          {kind: "XV.ListColumn", classes: "second", components: [
            {kind: "XV.ListAttr", attr: "shiptoName", classes: "italic"},
            {kind: "XV.ListAttr", attr: "shiptoAddress1"}
          ]},
          {kind: "XV.ListColumn", classes: "second", components: [
            {kind: "XV.ListAttr", attr: "shipVia"}
          ]},
          {kind: "XV.ListColumn", classes: "last", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "scheduleDate"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "total", formatter: "formatPrice", classes: "right"}
            ]}
          ]}
        ]}
      ]}
    ],
    formatPrice: function (value, view, model) {
      var currency = model ? model.get("currency") : false,
        scale = XT.session.locale.attributes.salesPriceScale;
      return currency ? currency.format(value, scale) : "";
    }
  });

  XV.registerModelList("XM.SalesOrderRelation", "XV.SalesOrderList");

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
  // SITE
  //

  enyo.kind({
    name: "XV.SiteList",
    kind: "XV.List",
    label: "_sites".loc(),
    collection: "XM.SiteListItemCollection",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    parameterWidget: "XV.SiteListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "code", isKey: true},
              {kind: "XV.ListAttr", attr: "description", fit: true, classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "siteType.description"}
          ]},
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.SiteRelation", "XV.SiteList");

  // ..........................................................
  // SHIFT
  //

  enyo.kind({
    name: "XV.ShiftList",
    kind: "XV.List",
    label: "_shifts".loc(),
    collection: "XM.ShiftCollection",
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
  // TAX ASSIGNMENT
  //

  enyo.kind({
    name: "XV.TaxAssignmentList",
    kind: "XV.List",
    label: "_taxAssignment".loc(),
    collection: "XM.TaxAssignmentCollection",
    parameterWidget: "XV.TaxAssignmentListParameters",
    query: {orderBy: [
      {attribute: 'tax'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "tax.code", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "taxType.name"}
          ]}
        ]}
      ]}
    ]
  });

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
            {kind: "XV.ListAttr", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

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
  // TAX RATE
  //

  enyo.kind({
    name: "XV.TaxRateList",
    kind: "XV.List",
    label: "_taxRate".loc(),
    collection: "XM.TaxRateCollection",
    parameterWidget: "XV.TaxRateListParameters",
    query: {orderBy: [
      {attribute: 'tax'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "tax.code", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "percent"}
          ]}
        ]}
      ]}
    ]
  });

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

  // ..........................................................
  // TO DO
  //

  enyo.kind({
    name: "XV.ToDoList",
    kind: "XV.List",
    label: "_toDo".loc(),
    collection: "XM.ToDoListItemCollection",
    parameterWidget: "XV.ToDoListParameters",
    query: {orderBy: [
      {attribute: 'priorityOrder'},
      {attribute: 'dueDate'},
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name", isKey: true},
              {kind: "XV.ListAttr", attr: "dueDate", fit: true,
                formatter: "formatDueDate", placeholder: "_noDueDate".loc(),
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "description",
              placeholder: "_noDescription".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "second",
            components: [
            {kind: "XV.ListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.ListAttr", attr: "contact.name"}
          ]},
          {kind: "XV.ListColumn", classes: "third",
            components: [
            {kind: "XV.ListAttr", attr: "getToDoStatusString"},
            {kind: "XV.ListAttr", attr: "owner.username"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "priority.name",
              placeholder: "_noPriority".loc()}
          ]}
        ]}
      ]}
    ],
    formatDueDate: function (value, view, model) {
      var today = new Date(),
        isLate = (model.get('isActive') &&
          XT.date.compareDate(value, today) < 1);
      view.addRemoveClass("error", isLate);
      return value;
    }
  });

  XV.registerModelList("XM.ToDoRelation", "XV.ToDoList");

  // ..........................................................
  // URL
  //

  enyo.kind({
    name: "XV.UrlList",
    kind: "XV.List",
    label: "_urls".loc(),
    collection: "XM.UrlCollection",
    parameterWidget: "XV.UrlListParameters",
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
            {kind: "XV.ListAttr", attr: "path"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.Url", "XV.UrlList");

  // ..........................................................
  // USER ACCOUNT
  //

  enyo.kind({
    name: "XV.UserAccountList",
    kind: "XV.List",
    label: "_userAccounts".loc(),
    collection: "XM.UserAccountRelationCollection",
    parameterWidget: "XV.UserAccountListParameters",
    query: {orderBy: [
      {attribute: 'username'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "username", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "propername"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // STATES AND COUNTRIES
  //

  enyo.kind({
    name: "XV.AbbreviationList",
    kind: "XV.List",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "abbreviation", isKey: true}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.StateList",
    kind: "XV.AbbreviationList",
    label: "_states".loc(),
    collection: "XM.StateCollection",
    query: {orderBy: [{ attribute: 'abbreviation' }] }
  });

  enyo.kind({
    name: "XV.CountryList",
    kind: "XV.AbbreviationList",
    label: "_countries".loc(),
    collection: "XM.CountryCollection",
    query: {orderBy: [
      {attribute: 'abbreviation'}
    ]}
  });

  // ..........................................................
  // INCIDENT CATEGORIES, RESOLUTIONS, SEVERITIES,
  // PRIORITIES,
  // OPPORTUNITY SOURCES, STAGES, TYPES,
  //
  // Basically anything whose rows are name and description
  //

  enyo.kind({
    name: "XV.NameDescriptionList",
    kind: "XV.List",
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
    ],
    /**
      All of these lists follow a very similar naming convention.
      Apply that convention unless the list overrides the label
      or collection attribute.
    */
    create: function () {
      this.inherited(arguments);
      var kindName = this.kind.substring(0, this.kind.length - 4).substring(3);
      if (!this.getLabel()) {
        this.setLabel(this.determineLabel(kindName));
      }
      if (!this.getCollection()) {
        this.setCollection("XM." + kindName + "Collection");
      }
    },

    determineLabel: function (kindName) {
      return ("_" + kindName.camelize().pluralize()).loc();
    }
  });

  enyo.kind({
    name: "XV.IncidentCategoryList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.IncidentResolutionList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.IncidentSeverityList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.PriorityList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.UnitList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.OpportunitySourceList",
    kind: "XV.NameDescriptionList",
    published: {
      query: {orderBy: [{ attribute: 'name' }] }
    }
  });

  enyo.kind({
    name: "XV.OpportunityStageList",
    kind: "XV.NameDescriptionList",
    published: {
      query: {orderBy: [{ attribute: 'name' }] }
    }
  });

  enyo.kind({
    name: "XV.OpportunityTypeList",
    kind: "XV.NameDescriptionList",
    published: {
      query: {orderBy: [{ attribute: 'name' }] }
    }
  });

  enyo.kind({
    name: "XV.SiteTypeList",
    kind: "XV.NameDescriptionList",
    collection: "XM.SiteTypeCollection"
  });

  enyo.kind({
    name: "XV.UserAccountRoleList",
    kind: "XV.NameDescriptionList",
    collection: "XM.UserAccountRoleCollection"
  });

  enyo.kind({
    name: "XV.CharacteristicList",
    kind: "XV.NameDescriptionList",
    collection: "XM.CharacteristicCollection"
  });
}());
