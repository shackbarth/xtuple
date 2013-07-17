/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, window:true */

(function () {

  var hash;

  /**
    Used to notify change of account to contact widget if both exist on
    the same workspace.
  */
  XV.accountNotifyContactMixin = {
    accountChanged: function () {
      var account = this.$.accountWidget.getValue();
      if (account) {
        this.$.contactWidget.addParameter({
          attribute: ["account", "accountParent"],
          value: account.id
        }, true);
      } else {
        this.$.contactWidget.removeParameter("account");
      }
    },
    attributesChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      this.accountChanged();
    },
    controlValueChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      if (inEvent.originator.name === 'accountWidget') {
        this.accountChanged();
      }
    }
  };

  /**
    Handles Address change with prompts.
  */
  XV.WorkspaceAddressMixin = {
    accountChanged: function () {
      var account = this.getAccount();
      this.$.addressWidget.setAccount(account);
    },
    attributesChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      this.accountChanged();
    },
    controlValueChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      if (inEvent.originator.name === 'accountWidget') {
        this.accountChanged();
      }
    },
    getAccount: function () {
      var model = this.getValue();
      return model ? model.get('account') : undefined;
    }
  };

  /**
    Abstract workspace to be used for objects that are attached to models subclassed from `AccountDocument`.
    Must be subclassed.
  */
  enyo.kind({
    name: "XV.AccountDocumentWorkspace",
    kind: "XV.Workspace",
    handlers: {
      onError: "errorNotify"
    },
    published: {
      existingId: ""
    },
    accountConvert: function (inEvent) {
      this.value.convertFromAccount(this.existingId);
      this._popupDone = true;
      this.$.findExistingAccountPopup.hide();
    },
    errorNotify: function (inSender, inEvent) {
      // Handle existing
      if (inEvent.error.code === 'xt1008') {
        this.existingId = inEvent.error.params.response.id;
        this._popupDone = false;
        this.$.findExistingAccountPopup.show();
        return true;
      }
    },
    accountCancel: function () {
      this._popupDone = true;
      this.$.findExistingAccountPopup.hide();
    },
    popupHidden: function () {
      if (!this._popupDone) {
        this.$.findExistingAccountPopup.show();
        return true;
      }
    }
  });

  // ..........................................................
  // BASE CLASS
  //

  enyo.kind({
    name: "XV.OrderedReferenceWorkspace",
    kind: "XV.Workspace",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            // these order fields are integers, so setting a maxlength
            // to prevent exceeding integer's max value
            {kind: "XV.NumberWidget", attr: "order", maxlength: 9, formatting: false}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountWorkspace",
    kind: "XV.Workspace",
    title: "_account".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.Account",
    allowPrint: true,
    handlers: {
      onSavePrompt: "savePrompt"
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.AccountTypePicker", attr: "accountType"},
            {kind: "XV.AccountWidget", attr: "parent", label: "_parent".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "onyx.GroupboxHeader", content: "_primaryContact".loc()},
            {kind: "XV.ContactWidget", attr: "primaryContact",
              showAddress: true, label: "_name".loc()},
            {kind: "onyx.GroupboxHeader", content: "_secondaryContact".loc()},
            {kind: "XV.ContactWidget", attr: "secondaryContact",
              showAddress: true, label: "_name".loc()},
            {kind: "XV.AccountCharacteristicsWidget", attr: "characteristics"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]},
        {kind: "XV.AccountCommentBox", attr: "comments"},
        {kind: "XV.Groupbox", name: "rolesPanel", title: "_roles".loc(),
          components: [
          {kind: "onyx.GroupboxHeader", content: "_roles".loc()},
          {kind: "XV.ScrollableGroupbox", name: "rolesGroup", fit: true,
            classes: "in-panel", components: []
          }
        ]},
        {kind: "XV.AccountDocumentsBox", attr: "documents"},
        {kind: "XV.AccountContactsBox", attr: "contactRelations"}
      ]},
      {kind: "onyx.Popup", name: "savePromptPopup", centered: true,
        modal: true, floating: true, scrim: true,
        onHide: "popupHidden", components: [
        {content: "_mustSave".loc() },
        {content: "_saveYourWork?".loc() },
        {tag: "br"},
        {kind: "onyx.Button", content: "_cancel".loc(), ontap: "savePromptCancel",
          classes: "xv-popup-button"},
        {kind: "onyx.Button", content: "_save".loc(), ontap: "savePromptSave",
          classes: "onyx-blue xv-popup-button"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      var K = XM.Account.prototype,
        roles = K.roleAttributes.sort(),
        that = this;

      // Loop and add a role checkbox for each role attribute found on the model
      _.each(roles, function (role) {
        that.createComponent({
          kind: XV.AccountRoleCheckboxWidget,
          name: role + "Control",
          label: ("_" + role).loc(),
          attr: role,
          container: that.$.rolesGroup,
          owner: that
        });
      });

    },
    savePrompt: function (inSender, inEvent) {
      this._popupDone = false;
      this._inEvent = inEvent;
      this.$.savePromptPopup.show();
    },
    savePromptCancel: function () {
      this._popupDone = true;
      this._inEvent.callback(false);
      this.$.savePromptPopup.hide();
    },
    savePromptSave: function () {
      var that = this,
        options = {};
      options.success = function () {
        that._inEvent.callback(true);
      };
      this._popupDone = true;
      this.$.savePromptPopup.hide();
      this.save(options);
    }
  });

  XV.registerModelWorkspace("XM.AccountRelation", "XV.AccountWorkspace");
  XV.registerModelWorkspace("XM.AccountListItem", "XV.AccountWorkspace");

  // ..........................................................
  // CLASS CODE
  //

  enyo.kind({
    name: "XV.ClassCodeWorkspace",
    kind: "XV.Workspace",
    title: "_classCode".loc(),
    model: "XM.ClassCode",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.ClassCode", "XV.ClassCodeWorkspace");

  // ..........................................................
  // CONFIGURE
  //

  enyo.kind({
    name: "XV.DatabaseInformationWorkspace",
    kind: "XV.Workspace",
    title: "_database".loc() + " " + "_information".loc(),
    model: "XM.DatabaseInformation",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "DatabaseName",
              label: "_name".loc()},
            {kind: "XV.InputWidget", attr: "ServerVersion",
                label: "_version".loc()},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "DatabaseComments"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // CONTACT
  //

  hash = {
    name: "XV.ContactWorkspace",
    kind: "XV.Workspace",
    title: "_contact".loc(),
    model: "XM.Contact",
    allowPrint: true,
    headerAttrs: ["firstName", "lastName"],
    handlers: {
      onError: "errorNotify"
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "onyx.GroupboxHeader", content: "_name".loc()},
            {kind: "XV.HonorificCombobox", attr: "honorific"},
            {kind: "XV.InputWidget", attr: "firstName"},
            {kind: "XV.InputWidget", attr: "middleName"},
            {kind: "XV.InputWidget", attr: "lastName"},
            {kind: "XV.InputWidget", attr: "suffix"},
            {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.AccountWidget", attr: "account"},
            {kind: "onyx.GroupboxHeader", content: "_address".loc()},
            {kind: "XV.AddressWidget", attr: "address"},
            {kind: "onyx.GroupboxHeader", content: "_information".loc()},
            {kind: "XV.InputWidget", attr: "jobTitle"},
            {kind: "XV.ComboboxWidget", attr: "primaryEmail",
              keyAttribute: "email"},
            {kind: "XV.InputWidget", attr: "phone"},
            {kind: "XV.InputWidget", attr: "alternate"},
            {kind: "XV.InputWidget", attr: "fax"},
            {kind: "XV.ContactCharacteristicsWidget", attr: "characteristics"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes"}
          ]}
        ]},
        {kind: "XV.ContactCommentBox", attr: "comments"},
        {kind: "XV.ContactDocumentsBox", attr: "documents"},
        {kind: "XV.ContactEmailBox", attr: "email"}
      ]}
    ]
  };

  hash = enyo.mixin(hash, XV.WorkspaceAddressMixin);
  enyo.kind(hash);

  XV.registerModelWorkspace("XM.ContactRelation", "XV.ContactWorkspace");
  XV.registerModelWorkspace("XM.ContactListItem", "XV.ContactWorkspace");

  // ..........................................................
  // COST CATEGORY
  //

  enyo.kind({
    name: "XV.CostCategoryWorkspace",
    kind: "XV.Workspace",
    title: "_costCategory".loc(),
    model: "XM.CostCategory",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.CostCategory", "XV.CostCategoryWorkspace");


  // ..........................................................
  // COUNTRY
  //

  enyo.kind({
    name: "XV.CountryWorkspace",
    kind: "XV.Workspace",
    title: "_country".loc(),
    model: "XM.Country",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "abbreviation"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "currencyName"},
            {kind: "XV.InputWidget", attr: "currencySymbol"},
            {kind: "XV.InputWidget", attr: "currencyAbbreviation"},
            {kind: "XV.InputWidget", attr: "currencyNumber"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Country", "XV.CountryWorkspace");

  // ..........................................................
  // CURRENCY
  //

  enyo.kind({
    name: "XV.CurrencyWorkspace",
    kind: "XV.Workspace",
    title: "_currency".loc(),
    model: "XM.Currency",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "abbreviation"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "symbol"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Currency", "XV.CurrencyWorkspace");

  // ..........................................................
  // CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerWorkspace",
    kind: "XV.Workspace",
    title: "_customer".loc(),
    model: "XM.Customer",
    allowPrint: true,
    headerAttrs: ["number", "-", "name"],
    handlers: {
      onError: "errorNotify"
    },
    published: {
      existingId: ""
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.CustomerTypePicker", attr: "customerType"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "onyx.GroupboxHeader", content: "_billingContact".loc()},
            {kind: "XV.ContactWidget", attr: "billingContact",
              showAddress: true, label: "_name".loc()},
            {kind: "onyx.GroupboxHeader", content: "_correspondenceContact".loc()},
            {kind: "XV.ContactWidget", attr: "correspondenceContact",
              showAddress: true, label: "_name".loc()},
            {kind: "XV.ContactCharacteristicsWidget", attr: "characteristics"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes"}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "settingsPanel", title: "_settings".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_settings".loc()},
          {kind: "XV.ScrollableGroupbox", name: "settingsGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.SalesRepPicker", attr: "salesRep"},
            {kind: "XV.PercentWidget", attr: "commission"},
            {kind: "XV.ShipViaCombobox", attr: "shipVia"},
            {kind: "XV.ShippingChargePicker", attr: "shipCharge"},
            {kind: "XV.CheckboxWidget", attr: "backorder"},
            {kind: "XV.CheckboxWidget", attr: "partialShip"},
            {kind: "XV.CheckboxWidget", attr: "isFreeFormShipto", label: "_freeFormShip".loc()},
            {kind: "XV.CheckboxWidget", attr: "isFreeFormBillto", label: "_freeFormBill".loc()},
            {kind: "onyx.GroupboxHeader", content: "_terms".loc()},
            {kind: "XV.TermsPicker", attr: "terms"},
            {kind: "XV.PercentWidget", attr: "discount"},
            {kind: "XV.CreditStatusPicker", attr: "creditStatus"},
            {kind: "XV.CheckboxWidget", attr: "usesPurchaseOrders"},
            {kind: "XV.CheckboxWidget", attr: "blanketPurchaseOrders"},
            {kind: "XV.BalanceMethodPicker", attr: "balanceMethod"},
            {kind: "XV.NumberWidget", attr: "creditLimit"},
            {kind: "XV.InputWidget", attr: "creditRating"},
            {kind: "XV.NumberWidget", attr: "graceDays"},
            {kind: "onyx.GroupboxHeader", content: "_tax".loc()},
            {kind: "XV.TaxZonePicker", attr: "taxZone", label: "_defaultTaxZone".loc()}
          ]}
        ]},
        {kind: "XV.CustomerQuoteListRelationsBox", attr: "quoteRelations"},
        {kind: "XV.CustomerSalesOrderListRelationsBox", attr: "salesOrderRelations"},
        {kind: "XV.CustomerShipToBox", attr: "shiptos"},
        {kind: "XV.CustomerCommentBox", attr: "comments"},
        {kind: "XV.TaxRegistrationBox", attr: "taxRegistration"},
        {kind: "XV.CustomerDocumentsBox", attr: "documents"}
      ]},
      // TODO: move this to notify system
      {kind: "onyx.Popup", name: "findExistingCustomerPopup", centered: true,
        modal: true, floating: true, scrim: true, onShow: "popupShown",
        onHide: "popupHidden", components: [
        {name: "exists"},
        {name: "whatToDo"},
        {tag: "br"},
        {kind: "onyx.Button", name: "ok", content: "_ok".loc(), ontap: "customerConvert",
          classes: "onyx-blue xv-popup-button", type: ""},
        {kind: "onyx.Button", name: "cancel", content: "_cancel".loc(), ontap: "customerCancel",
          classes: "xv-popup-button", type: ""}
      ]}
    ],
    customerConvert: function (inEvent) {
      this._popupDone = true;
      this.$.findExistingCustomerPopup.hide();
      if (inEvent.type === "prospect") {
        this.value.convertFromProspect(this.existingId);
      } else if (inEvent.type === "account") {
        this.value.convertFromAccount(this.existingId);
      }
    },
    errorNotify: function (inSender, inEvent) {
      // Handle customer existing as prospect
      if (inEvent.error.code === 'xt1008') {
        var type = inEvent.error.params.response.type;
        this.existingId = inEvent.error.params.response.id;
        if (type === 'P') { // Prospect
          this._popupDone = false;
          this.$.exists.setContent("_prospectExists".loc());
          this.$.whatToDo.setContent("_convertProspect".loc());
          this.$.ok.type = "prospect";
          this.$.findExistingCustomerPopup.show();
          return true;
        } else if (type === 'A') { // Existing Account
          this._popupDone = false;
          this.$.exists.setContent("_accountExists".loc());
          this.$.whatToDo.setContent("_convertAccount".loc());
          this.$.ok.type = "account";
          this.$.findExistingCustomerPopup.show();
          return true;
        }
      }
    },
    customerCancel: function () {
      this._popupDone = true;
      this.$.findExistingCustomerPopup.hide();
      return true;
    },
    popupHidden: function () {
      if (!this._popupDone) {
        this.$.findExistingCustomerPopup.show();
        return true;
      }
    }
  });

  XV.registerModelWorkspace("XM.CustomerRelation", "XV.CustomerWorkspace");
  XV.registerModelWorkspace("XM.CustomerListItem", "XV.CustomerWorkspace");
  XV.registerModelWorkspace("XM.CustomerProspectListItem", "XV.CustomerWorkspace");

  // ..........................................................
  // CUSTOMER GROUP
  //

  enyo.kind({
    name: "XV.CustomerGroupWorkspace",
    kind: "XV.Workspace",
    title: "_customerGroup".loc(),
    model: "XM.CustomerGroup",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]},
        {kind: "XV.CustomerGroupCustomerBox", attr: "customers"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.CustomerGroup", "XV.CustomerGroupWorkspace");

  // ..........................................................
  // CUSTOMER TYPE
  //

  enyo.kind({
    name: "XV.CustomerTypeWorkspace",
    kind: "XV.Workspace",
    title: "_customerType".loc(),
    model: "XM.CustomerType",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.CustomerType", "XV.CustomerTypeWorkspace");

  // ..........................................................
  // CLASS CODE
  //

  enyo.kind({
    name: "XV.ExpenseCategoryWorkspace",
    kind: "XV.Workspace",
    title: "_expenseCategory".loc(),
    model: "XM.ExpenseCategory",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.ExpenseCategory", "XV.ExpenseCategoryWorkspace");

  // ..........................................................
  // DEPARTMENT
  //

  enyo.kind({
    name: "XV.DepartmentWorkspace",
    kind: "XV.Workspace",
    title: "_department".loc(),
    model: "XM.Department",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Department", "XV.DepartmentWorkspace");

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.EmployeeWorkspace",
    kind: "XV.AccountDocumentWorkspace",
    title: "_employee".loc(),
    model: "XM.Employee",
    allowPrint: false,
    headerAttrs: ["number", "-", "name"],
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
            {kind: "XV.ContactWidget", attr: "contact",
              showAddress: true, label: "_name".loc()},
            {kind: "XV.EmployeeCharacteristicsWidget", attr: "characteristics"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes"}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "detailPanel", title: "_detail".loc(),
          components: [
          {kind: "onyx.GroupboxHeader", content: "_detail".loc()},
          {kind: "XV.ScrollableGroupbox", name: "detailGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.DateWidget", attr: "startDate"},
            {kind: "XV.SitePicker", attr: "site"},
            {kind: "XV.DepartmentPicker", attr: "department"},
            {kind: "XV.EmployeeWidget", attr: "manager"},
            {kind: "XV.ShiftPicker", attr: "shift"},
            {kind: "onyx.GroupboxHeader", content: "_financials".loc()},
            {kind: "XV.WageTypePicker", attr: "wageType"},
            {kind: "XV.MoneyWidget",
              attr: {localValue: "wage", currency: "wageCurrency"},
              currencyDisabled: true},
            {kind: "XV.WagePeriodPicker", attr: "wagePeriod", label: "_period".loc()},
            {kind: "XV.MoneyWidget",
              attr: {localValue: "billingRate", currency: "billingCurrency"},
              currencyDisabled: true},
            {kind: "XV.WagePeriodPicker", attr: "billingPeriod", label: "_period".loc()}
          ]}
        ]},
        {kind: "XV.EmployeeCommentBox", attr: "comments"},
        {kind: "XV.EmployeeGroupGroupBox", attr: "groups"}
      ]},
      {kind: "onyx.Popup", name: "findExistingAccountPopup", centered: true,
        modal: true, floating: true, scrim: true, onShow: "popupShown",
        onHide: "popupHidden", components: [
        {content: "_accountExists".loc()},
        {name: "whatToDo", content: "_convertAccountEmployee".loc()},
        {tag: "br"},
        {kind: "onyx.Button", name: "convert", content: "_ok".loc(), ontap: "accountConvert",
          classes: "onyx-blue xv-popup-button"},
        {kind: "onyx.Button", name: "cancel", content: "_cancel".loc(), ontap: "accountCancel",
          classes: "xv-popup-button"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.EmployeeRelation", "XV.EmployeeWorkspace");
  XV.registerModelWorkspace("XM.EmployeeListItem", "XV.EmployeeWorkspace");

  // ..........................................................
  // EMPLOYEE GROUP
  //

  enyo.kind({
    name: "XV.EmployeeGroupWorkspace",
    kind: "XV.Workspace",
    title: "_employeeGroup".loc(),
    model: "XM.EmployeeGroup",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]},
        {kind: "XV.EmployeeGroupEmployeeBox", attr: "employees"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.EmployeeGroup", "XV.EmployeeGroupWorkspace");

  // ..........................................................
  // FILE
  //

  enyo.kind({
    name: "XV.FileWorkspace",
    kind: "XV.Workspace",
    title: "_file".loc(),
    model: "XM.File",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name", name: "name"},
            {kind: "XV.InputWidget", attr: "description", name: "description" },
            {kind: "XV.FileInput", name: "file", attr: "data"}
          ]}
        ]}
      ]}
    ],

    /**
      When a file is uploaded we want the filename to overwrite
      the name and description fields.
     */
    controlValueChanged: function (inSender, inEvent) {
      var filename = inEvent.filename;
      this.inherited(arguments);

      if (filename) {
        this.$.name.setValue(filename);
        this.$.description.setValue(filename);
      }
    },
    /**
      We want the description to be always disabled, which means we have
      to go in after the attributesChanged method, which, as it's defined
      in the superkind, will reset the disabled status based on permissions etc.
     */
    attributesChanged: function (model, options) {
      this.inherited(arguments);
      this.$.description.setDisabled(true);
    }
  });

  XV.registerModelWorkspace("XM.FileRelation", "XV.FileWorkspace");

  // ..........................................................
  // FREIGHT CLASS
  //

  enyo.kind({
    name: "XV.FreightClassWorkspace",
    kind: "XV.Workspace",
    title: "_freightClass".loc(),
    model: "XM.FreightClass",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.FreightClass", "XV.FreightClassWorkspace");

  // ..........................................................
  // HONORIFIC
  //

  enyo.kind({
    name: "XV.HonorificWorkspace",
    kind: "XV.Workspace",
    title: "_honorific".loc(),
    model: "XM.Honorific",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Honorific", "XV.HonorificWorkspace");

  // ..........................................................
  // INCIDENT
  //

  var incidentHash = {
    name: "XV.IncidentWorkspace",
    kind: "XV.Workspace",
    title: "_incident".loc(),
    headerAttrs: ["number", "-", "description"],
    model: "XM.Incident",
    allowPrint: true,
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.CheckboxWidget", attr: "isPublic", name: "isPublic"},
            {kind: "XV.AccountWidget", attr: "account"},
            {kind: "XV.ContactWidget", attr: "contact"},
            {kind: "XV.IncidentCategoryPicker", attr: "category"},
            {kind: "onyx.GroupboxHeader", content: "_status".loc()},
            {kind: "XV.IncidentStatusPicker", attr: "status"},
            {kind: "XV.PriorityPicker", attr: "priority"},
            {kind: "XV.IncidentSeverityPicker", attr: "severity"},
            {kind: "XV.IncidentResolutionPicker", attr: "resolution"},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"},
            {kind: "XV.IncidentCharacteristicsWidget", attr: "characteristics"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true},
            {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
            {kind: "XV.ItemWidget", attr: "item"}
          ]}
        ]},
        {kind: "XV.IncidentCommentBox", attr: "comments"},
        {kind: "XV.IncidentDocumentsBox", attr: "documents"},
        {kind: "XV.IncidentHistoryRelationsBox", attr: "history"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      var settings = XT.session.getSettings();
      this.$.isPublic.setShowing(settings.get('IncidentsPublicPrivate'));
    }
  };

  incidentHash = enyo.mixin(incidentHash, XV.accountNotifyContactMixin);
  enyo.kind(incidentHash);

  XV.registerModelWorkspace("XM.IncidentRelation", "XV.IncidentWorkspace");
  XV.registerModelWorkspace("XM.IncidentListItem", "XV.IncidentWorkspace");

  // ..........................................................
  // INCIDENT EMAIL PROFILE
  //

  enyo.kind({
    name: "XV.IncidentEmailProfileWorkspace",
    kind: "XV.Workspace",
    title: "_incidentEmailProfile".loc(),
    headerAttrs: ["name", "-", "description"],
    model: "XM.IncidentEmailProfile",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel",
          style: "width: 480px;", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "onyx.GroupboxHeader", content: "_header".loc()},
            {kind: "XV.InputWidget", attr: "from"},
            {kind: "XV.InputWidget", attr: "replyTo"},
            {kind: "XV.InputWidget", attr: "to"},
            {kind: "XV.InputWidget", attr: "cc"},
            {kind: "XV.InputWidget", attr: "bcc"},
            {kind: "XV.InputWidget", attr: "subject"},
            {kind: "onyx.GroupboxHeader", content: "_body".loc()},
            {kind: "XV.TextArea", attr: "body", classes: "max-height"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.IncidentEmailProfile", "XV.IncidentEmailProfileWorkspace");

  // ..........................................................
  // INCIDENT CATEGORY
  //

  enyo.kind({
    name: "XV.IncidentCategoryWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_incidentCategory".loc(),
    model: "XM.IncidentCategory",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.NumberWidget", attr: "order"},
            {kind: "XV.IncidentEmailProfilePicker", attr: "emailProfile"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.IncidentCategory", "XV.IncidentCategoryWorkspace");

  // ..........................................................
  // INCIDENT RESOLUTION
  //

  enyo.kind({
    name: "XV.IncidentResolutionWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_incidentResolution".loc(),
    model: "XM.IncidentResolution"
  });

  XV.registerModelWorkspace("XM.IncidentResolution", "XV.IncidentResolutionWorkspace");

  // ..........................................................
  // INCIDENT SEVERITY
  //

  enyo.kind({
    name: "XV.IncidentSeverityWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_incidentSeverity".loc(),
    model: "XM.IncidentSeverity"
  });

  XV.registerModelWorkspace("XM.IncidentSeverity", "XV.IncidentSeverityWorkspace");

  // ..........................................................
  // ITEM
  //

  enyo.kind({
    name: "XV.ItemWorkspace",
    kind: "XV.Workspace",
    title: "_item".loc(),
    model: "XM.Item",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "description1"},
            {kind: "XV.InputWidget", attr: "description2"},
            {kind: "XV.ItemTypePicker", attr: "itemType", showNone: false},
            {kind: "XV.ClassCodePicker", attr: "classCode"},
            {kind: "XV.UnitPicker", attr: "inventoryUnit"},
            {kind: "XV.CheckboxWidget", attr: "isFractional"},
            {kind: "XV.CheckboxWidget", attr: "isPicklist"},
            {kind: "onyx.GroupboxHeader", content: "_product".loc()},
            {kind: "XV.CheckboxWidget", attr: "isSold"},
            {kind: "XV.ProductCategoryPicker", attr: "productCategory",
              label: "_category".loc()},
            {kind: "XV.SalesPriceWidget", attr: "listPrice"},
            {kind: "XV.UnitPicker", attr: "priceUnit"},
            {kind: "XV.ItemCharacteristicsWidget", attr: "characteristics"},
            {kind: "onyx.GroupboxHeader",
              content: "_extendedDescription".loc()},
            {kind: "XV.TextArea", attr: "extendedDescription"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]},
        {kind: "XV.ItemCommentBox", attr: "comments"},
        {kind: "XV.ItemDocumentsBox", attr: "documents"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.ItemRelation", "XV.ItemWorkspace");
  XV.registerModelWorkspace("XM.ItemListItem", "XV.ItemWorkspace");

  // ..........................................................
  // ITEM SITE
  //

  enyo.kind({
    name: "XV.ItemSiteWorkspace",
    kind: "XV.Workspace",
    title: "_itemSite".loc(),
    model: "XM.ItemSite",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.ItemWidget", attr: "item"},
            {kind: "XV.SitePicker", attr: "site"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.PlannerCodePicker", attr: "plannerCode"},
            {kind: "XV.CostCategoryPicker", attr: "costCategory"},
            {kind: "XV.CheckboxWidget", attr: "isSold"},
            {kind: "XV.NumberWidget", attr: "soldRanking"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]},
        {kind: "XV.ItemSiteCommentBox", attr: "comments"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.ItemSiteRelation", "XV.ItemSiteWorkspace");
  XV.registerModelWorkspace("XM.ItemSiteListItem", "XV.ItemSiteWorkspace");

  // ..........................................................
  // OPPORTUNITY
  //

  var opportunityHash = {
    name: "XV.OpportunityWorkspace",
    kind: "XV.Workspace",
    title: "_opportunity".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.Opportunity",
    allowPrint: true,
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.AccountWidget", attr: "account"},
            {kind: "XV.ContactWidget", attr: "contact"},
            {kind: "XV.MoneyWidget",
              attr: {localValue: "amount", currency: "currency"},
              label: "_amount".loc()},
            {kind: "XV.NumberWidget", attr: "probability"},
            {kind: "onyx.GroupboxHeader", content: "_status".loc()},
            {kind: "XV.OpportunityStagePicker", attr: "opportunityStage",
              label: "_stage".loc()},
            {kind: "XV.PriorityPicker", attr: "priority"},
            {kind: "XV.OpportunityTypePicker", attr: "opportunityType",
              label: "_type".loc()},
            {kind: "XV.OpportunitySourcePicker", attr: "opportunitySource",
              label: "_source".loc()},
            {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
            {kind: "XV.DateWidget", attr: "targetClose"},
            {kind: "XV.DateWidget", attr: "startDate"},
            {kind: "XV.DateWidget", attr: "assignDate"},
            {kind: "XV.DateWidget", attr: "actualClose"},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"},
            {kind: "XV.OpportunityCharacteristicsWidget", attr: "characteristics"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]},
        {kind: "XV.OpportunityCommentBox", attr: "comments"},
        {kind: "XV.OpportunityDocumentsBox", attr: "documents"}
      ]}
    ]
  };

  opportunityHash = enyo.mixin(opportunityHash, XV.accountNotifyContactMixin);
  enyo.kind(opportunityHash);

  XV.registerModelWorkspace("XM.OpportunityRelation", "XV.OpportunityWorkspace");
  XV.registerModelWorkspace("XM.OpportunityListItem", "XV.OpportunityWorkspace");

  // ..........................................................
  // OPPORTUNITY SOURCE
  //

  enyo.kind({
    name: "XV.OpportunitySourceWorkspace",
    kind: "XV.Workspace",
    title: "_opportunitySource".loc(),
    model: "XM.OpportunitySource"
  });

  XV.registerModelWorkspace("XM.OpportunitySource", "XV.OpportunitySourceWorkspace");

  // ..........................................................
  // OPPORTUNITY STAGE
  //

  enyo.kind({
    name: "XV.OpportunityStageWorkspace",
    kind: "XV.Workspace",
    title: "_opportunityStage".loc(),
    model: "XM.OpportunityStage",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.CheckboxWidget", attr: "deactivate"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.OpportunityStage", "XV.OpportunityStageWorkspace");

  // ..........................................................
  // OPPORTUNITY TYPE
  //

  enyo.kind({
    name: "XV.OpportunityTypeWorkspace",
    kind: "XV.Workspace",
    title: "_opportunityType".loc(),
    model: "XM.OpportunityType"
  });

  XV.registerModelWorkspace("XM.OpportunityType", "XV.OpportunityTypeWorkspace");

  // ..........................................................
  // PLANNER CODE
  //

  enyo.kind({
    name: "XV.PlannerCodeWorkspace",
    kind: "XV.Workspace",
    title: "_plannerCode".loc(),
    model: "XM.PlannerCode",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.PlannerCode", "XV.PlannerCodeWorkspace");

  // ..........................................................
  // PRIORITY
  //

  enyo.kind({
    name: "XV.PriorityWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_priority".loc(),
    model: "XM.Priority"
  });

  XV.registerModelWorkspace("XM.Priority", "XV.PriorityWorkspace");

  // ..........................................................
  // PRODUCT CATEGORY
  //

  enyo.kind({
    name: "XV.ProductCategoryWorkspace",
    kind: "XV.Workspace",
    title: "_productCategory".loc(),
    model: "XM.ProductCategory",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.ProductCategory", "XV.ProductCategoryWorkspace");

  // ..........................................................
  // PROJECT
  //

  var projectHash = {
    name: "XV.ProjectWorkspace",
    kind: "XV.Workspace",
    title: "_project".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.Project",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.ProjectStatusPicker", attr: "status"},
            {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
            {kind: "XV.DateWidget", attr: "dueDate"},
            {kind: "XV.DateWidget", attr: "startDate"},
            {kind: "XV.DateWidget", attr: "assignDate"},
            {kind: "XV.DateWidget", attr: "completeDate"},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true},
            {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
            {kind: "XV.AccountWidget", attr: "account"},
            {kind: "XV.ContactWidget", attr: "contact"}
          ]}
        ]},
        {kind: "XV.ProjectTasksBox", attr: "tasks"},
        {kind: "XV.ProjectCommentBox", attr: "comments"},
        {kind: "XV.ContactDocumentsBox", attr: "documents"}
      ]}
    ]
  };

  projectHash = enyo.mixin(projectHash, XV.accountNotifyContactMixin);
  enyo.kind(projectHash);

  XV.registerModelWorkspace("XM.ProjectRelation", "XV.ProjectWorkspace");
  XV.registerModelWorkspace("XM.ProjectListItem", "XV.ProjectWorkspace");

  enyo.kind({
    name: "XV.TaskWorkspace",
    kind: "XV.Workspace",
    title: "_task".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.Task",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.ProjectWidget", attr: "project"},
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.ProjectStatusPicker", attr: "status"},
            {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
            {kind: "XV.DateWidget", attr: "dueDate"},
            {kind: "XV.DateWidget", attr: "startDate"},
            {kind: "XV.DateWidget", attr: "assignDate"},
            {kind: "XV.DateWidget", attr: "completeDate"},
            {kind: "onyx.GroupboxHeader", content: "_hours".loc()},
            {kind: "XV.QuantityWidget", attr: "budgetedHours",
             label: "_budgeted".loc()},
            {kind: "XV.QuantityWidget", attr: "actualHours",
             label: "_actual".loc()},
            {kind: "onyx.GroupboxHeader", content: "_expenses".loc()},
            {kind: "XV.MoneyWidget", attr: {localValue: "budgetedExpenses"},
             label: "_budgeted".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget", attr: {localValue: "actualExpenses"},
             label: "_actual".loc(), currencyShowing: false},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]},
        {kind: "XV.TaskCommentBox", attr: "comments"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Task", "XV.TaskWorkspace");
  XV.registerModelWorkspace("XM.TaskListItem", "XV.TaskWorkspace");

  // ..........................................................
  // PROSPECT
  //

  enyo.kind({
    name: "XV.ProspectWorkspace",
    kind: "XV.AccountDocumentWorkspace",
    title: "_prospect".loc(),
    model: "XM.Prospect",
    allowPrint: true,
    headerAttrs: ["number", "-", "name"],
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.SalesRepPicker", attr: "salesRep"},
            {kind: "XV.TaxZonePicker", attr: "taxZone"},
            {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
            {kind: "XV.ContactWidget", attr: "contact",
              showAddress: true, label: "_name".loc()},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes"}
          ]}
        ]},
        {kind: "XV.ProspectQuoteListRelationsBox", attr: "quoteRelations"}
      ]},
      // TODO: use standard notify mechanism
      {kind: "onyx.Popup", name: "findExistingAccountPopup", centered: true,
        modal: true, floating: true, scrim: true, onShow: "popupShown",
        onHide: "popupHidden", components: [
        {content: "_accountExists".loc()},
        {name: "whatToDo", content: "_convertAccountProspect".loc()},
        {tag: "br"},
        {kind: "onyx.Button", name: "convert", content: "_ok".loc(), ontap: "accountConvert",
          classes: "onyx-blue xv-popup-button"},
        {kind: "onyx.Button", name: "cancel", content: "_cancel".loc(), ontap: "accountCancel",
          classes: "xv-popup-button"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.ProspectRelation", "XV.ProspectWorkspace");
  XV.registerModelWorkspace("XM.ProspectListItem", "XV.ProspectWorkspace");

  // ..........................................................
  // SALES ORDER BASE
  //

  /**
    This is the base kind for Quote and Sales order. This should include all common components
    and functions.
  */
  enyo.kind({
    name: "XV.SalesOrderBase",
    kind: "XV.Workspace",
    allowPrint: true,
    printOnSaveSetting: "DefaultPrintSOOnSave",
    headerAttrs: ["number", "-", "billtoName"],
    published: {
      effectiveLabel: "_orderDate".loc(),
      effectiveKey: "orderDate"
    },
    components: [
      {kind: "Panels", name: "salesPanels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.DateWidget", name: "dateField", attr: "", label: "_orderDate".loc()},
            {kind: "XV.DateWidget", attr: "scheduleDate"},
            {name: "datePanel"},
            {kind: "XV.InputWidget", attr: "getOrderStatusString", label: "_status".loc()},
            {kind: "onyx.GroupboxHeader", content: "_billTo".loc()},
            {kind: "XV.CustomerProspectWidget", attr: "customer",
              showAddress: true, label: "_customer".loc(),
              nameAttribute: ""},
            {kind: "XV.AddressFieldsWidget", attr:
              {name: "billtoName", line1: "billtoAddress1",
                line2: "billtoAddress2", line3: "billtoAddress3",
                city: "billtoCity", state: "billtoState",
                postalCode: "billtoPostalCode", country: "billtoCountry"}
            },
            {classes: "xv-button-section", components: [
              {kind: "onyx.Button", content: "_copyToShipTo".loc(),
                name: "copyAddressButton",
                ontap: "copyBilltoToShipto",
                style: "margin: 4px;"}
            ]},
            {kind: "XV.ContactWidget", attr: "billtoContact",
              name: "billtoContact"},
            {kind: "onyx.GroupboxHeader", content: "_shipTo".loc()},
            {kind: "XV.CustomerShiptoWidget", attr: "shipto",
              showAddress: true, label: "_number".loc(),
              nameAttribute: ""},
            {kind: "XV.AddressFieldsWidget",
              disabled: true,
              attr: {name: "shiptoName", line1: "shiptoAddress1",
                line2: "shiptoAddress2", line3: "shiptoAddress3",
                city: "shiptoCity", state: "shiptoState",
                postalCode: "shiptoPostalCode", country: "shiptoCountry"}
            },
            {kind: "XV.ContactWidget", attr: "shiptoContact",
              name: "shiptoContact"},
            {kind: "onyx.GroupboxHeader", content: "_shipping".loc()},
            {kind: "XV.SitePicker", attr: "site"},
            {kind: "XV.DateWidget", attr: "packDate"},
            {kind: "XV.InputWidget", attr: "fob"},
            {kind: "XV.InputWidget", attr: "customerPurchaseOrderNumber",
             label: "_custPO".loc()},
            {kind: "XV.ShipViaCombobox", attr: "shipVia"},
            {kind: "XV.ShipZonePicker", attr: "shipZone"},
            {name: "shippingPanel"},
            {kind: "onyx.GroupboxHeader", content: "_settings".loc()},
            {kind: "XV.TermsPicker", attr: "terms"},
            {kind: "XV.SalesRepPicker", attr: "salesRep"},
            {kind: "XV.PercentWidget", attr: "commission"},
            {kind: "XV.TaxZonePicker", attr: "taxZone"},
            {kind: "XV.SaleTypePicker", attr: "saleType"},
            {name: "settingsPanel"},
            {kind: "onyx.GroupboxHeader", content: "_orderNotes".loc()},
            {kind: "XV.TextArea", attr: "orderNotes", fit: true},
            {kind: "onyx.GroupboxHeader", content: "_shippingNotes".loc()},
            {kind: "XV.TextArea", attr: "shipNotes", fit: true}
          ]}
        ]},
        {kind: "FittableRows", title: "_lineItems".loc(), name: "lineItemsPanel"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      var effectiveKey = this.getEffectiveKey();
      this.build();
      this.$.dateField.setLabel(this.getEffectiveLabel());
      this.$.dateField.setAttr(effectiveKey);
      this.getComponents().forEach(function (ctl) {
        if (ctl.kind === "XV.MoneyWidget") {
          ctl.getAttr().effective = effectiveKey; // append this property onto the object
        }
      });
      this.titleChanged();
    },
    customerChanged: function () {
      var customer = this.$.customerProspectWidget.getValue(),
        id = customer ? customer.get("account") : -1;
      this.$.billtoContact.addParameter({attribute: "account", value: id}, true);
      this.$.shiptoContact.addParameter({attribute: "account", value: id}, true);
      if (customer) {
        this.$.customerShiptoWidget.setDisabled(false);
        this.$.customerShiptoWidget.addParameter({
          attribute: "customer",
          value: customer.id
        });
      } else {
        this.$.customerShiptoWidget.setDisabled(true);
      }
    },
    attributesChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      var model = this.getValue(),
        customer = model ? model.get("customer") : false,
        isFreeFormShipto = customer ? customer.get("isFreeFormShipto") : true;

      this.$.copyAddressButton.setDisabled(!isFreeFormShipto);
      this.customerChanged();
    },
    controlValueChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      if (inEvent.originator.name === 'customerWidget') {
        this.customerChanged();
      }
    },
    copyBilltoToShipto: function () {
      this.getValue().copyBilltoToShipto();
    }
  });

  // ..........................................................
  // QUOTE
  //
  enyo.kind({
    name: "XV.QuoteWorkspace",
    kind: "XV.SalesOrderBase",
    title: "_quote".loc(),
    model: "XM.Quote",
    effectiveLabel: "_quoteDate".loc(),
    effectiveKey: "quoteDate",
    /**
      Loops through the components array of the parent kind and inserts the addtional
      components where they should be rendered.
    */
    build: function () {
      this.$.datePanel.createComponents([
        {kind: "XV.DateWidget", attr: "expireDate"}
      ], {owner: this});
      this.$.salesPanels.createComponents([
          {kind: "XV.QuoteCommentBox", attr: "comments"},
          {kind: "XV.QuoteDocumentsBox", attr: "documents"}
        ], {owner: this});
      this.$.lineItemsPanel.createComponents([
        // Line Item Box
        {kind: "XV.QuoteLineItemBox", attr: "lineItems", fit: true}
      ], {owner: this});
    }
  });

  XV.registerModelWorkspace("XM.QuoteRelation", "XV.QuoteWorkspace");
  XV.registerModelWorkspace("XM.QuoteListItem", "XV.QuoteWorkspace");

  // ..........................................................
  // LINE ITEM
  //
  var lineItem = {
    kind: "XV.Workspace",
    modelAmnesty: true,
    components: [
      {kind: "Panels", name: "salesLinePanels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", fit: true, components: [
            {kind: "XV.NumberWidget", attr: "lineNumber"},
            {kind: "XV.ItemSiteWidget", attr: {item: "item", site: "site"},
              name: "itemSiteWidget",
              query: {parameters: [
              {attribute: "item.isSold", value: true},
              {attribute: "item.isActive", value: true},
              {attribute: "isSold", value: true},
              {attribute: "isActive", value: true}
            ]}},
            {kind: "XV.QuantityWidget", attr: "quantity"},
            {kind: "XV.UnitPicker", name: "quantityUnitPicker",
              attr: "quantityUnit"},
            {kind: "XV.PercentWidget", name: "discount", attr: "discount"},
            {kind: "XV.MoneyWidget", attr:
              {localValue: "price", currency: ""},
              label: "_price".loc(), currencyDisabled: true,
              scale: XT.SALES_PRICE_SCALE},
            {kind: "XV.UnitPicker", name: "priceUnitPicker",
              attr: "priceUnit"},
            {kind: "XV.MoneyWidget", attr:
              {localValue: "extendedPrice", currency: ""},
              label: "_extendedPrice".loc(), currencyDisabled: true,
              scale: XT.EXTENDED_PRICE_SCALE},
            {kind: "onyx.GroupboxHeader", content: "_delivery".loc()},
            {kind: "XV.DateWidget", attr: "scheduleDate"},
            {kind: "XV.DateWidget", attr: "promiseDate", showing: false,
              name: "promiseDate"},
            {kind: "XV.QuoteLineCharacteristicsWidget",
              attr: "characteristics"}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "detailsPanel", title: "_detail".loc(),
          components: [
          {kind: "onyx.GroupboxHeader", content: "_detail".loc()},
          {kind: "XV.ScrollableGroupbox", name: "detailGroup",
            classes: "in-panel", fit: true, components: [
            {kind: "XV.MoneyWidget", attr: {baseValue: "unitCost"},
              label: "_unitCost".loc(), isEditableProperty: "baseValue",
              currencyDisabled: true},
            {kind: "XV.MoneyWidget", attr: {baseValue: "listPrice"},
              label: "_listPrice".loc(), scale: XT.SALES_PRICE_SCALE,
              isEditableProperty: "baseValue", currencyDisabled: true},
            {kind: "XV.MoneyWidget", attr: {localValue: "customerPrice"},
              label: "_customerPrice".loc(), scale: XT.SALES_PRICE_SCALE,
              currencyDisabled: true},
            {kind: "XV.PercentWidget", attr: "listPriceDiscount"},
            {kind: "XV.PercentWidget", attr: "markup"},
            {kind: "XV.MoneyWidget", attr: {localValue: "margin"},
              label: "_margin".loc(), scale: XT.EXTENDED_PRICE_SCALE,
              currencyDisabled: true},
            {kind: "onyx.GroupboxHeader", content: "_tax".loc()},
            {kind: "XV.TaxTypePicker", attr: "taxType"},
            {kind: "XV.NumberWidget", attr: "tax"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      var effectiveKey = this.getEffectiveKey(),
        currencyKey = this.getCurrencyKey(),
        comments = this.getCommentBox();

      // Show/Hide promise date
      this.$.promiseDate.setShowing(XT.session.settings.get("UsePromiseDate"));

      // Set currency and effective attributes on money widgets
      this.getComponents().forEach(function (ctl) {
        if (ctl.kind === "XV.MoneyWidget") {
          ctl.attr.currency = currencyKey;
          ctl.attr.effective = effectiveKey;
        }
      });

      // Add the Comment Box to Panels
      this.$.salesLinePanels.createComponents([comments], {owner: this});
    }
  };
  enyo.mixin(lineItem, XV.LineMixin);

  // ..........................................................
  // QUOTE LINE ITEM
  //
  var quoteLineItem = {
    name: "XV.QuoteLineWorkspace",
    title: "_quoteLine".loc(),
    model: "XM.QuoteLine",
    published: {
      currencyKey: "quote.currency",
      effectiveKey: "quote.quoteDate",
      commentBox: {kind: "XV.QuoteLineCommentBox", attr: "comments"}
    }
  };
  enyo.mixin(quoteLineItem, XV.QuoteLineMixin);
  enyo.mixin(quoteLineItem, lineItem);
  enyo.kind(quoteLineItem);

  // ..........................................................
  // SALES ORDER LINE ITEM
  //
  var salesOrderLineItem = {
    name: "XV.SalesOrderLineWorkspace",
    title: "_salesOrderLine".loc(),
    model: "XM.SalesOrderLine",
    published: {
      currencyKey: "salesOrder.currency",
      effectiveKey: "salesOrder.orderDate",
      commentBox: {kind: "XV.SalesOrderLineCommentBox", attr: "comments"}
    }
  };
  enyo.mixin(salesOrderLineItem, XV.SalesOrderLineMixin);
  enyo.mixin(salesOrderLineItem, lineItem);
  enyo.kind(salesOrderLineItem);

  // ..........................................................
  // SALES ORDER
  //

  enyo.kind({
    name: "XV.SalesOrderWorkspace",
    kind: "XV.SalesOrderBase",
    title: "_salesOrder".loc(),
    model: "XM.SalesOrder",
    /**
      Inserts additional components where they should be rendered.
    */
    build: function () {
      this.$.datePanel.createComponents([
        {kind: "XV.CheckboxWidget", attr: "shipComplete"}
      ], {owner: this});
      this.$.shippingPanel.createComponents([
        {kind: "XV.ShippingChargePicker", attr: "shipCharge"}
      ], {owner: this});
      this.$.settingsPanel.createComponents([
        {kind: "XV.HoldTypePicker", attr: "holdType"}
      ], {owner: this});
      this.$.salesPanels.createComponents([
          {kind: "XV.SalesOrderCommentBox", attr: "comments"},
          {kind: "XV.SalesOrderDocumentsBox", attr: "documents"}
        ], {owner: this});
      this.$.lineItemsPanel.createComponents([
        // Line Item Box
        {kind: "XV.SalesOrderLineItemBox", attr: "lineItems", fit: true}
      ], {owner: this});
    }
  });

  XV.registerModelWorkspace("XM.SalesOrderRelation", "XV.SalesOrderWorkspace");
  XV.registerModelWorkspace("XM.SalesOrderListItem", "XV.SalesOrderWorkspace");

  // ..........................................................
  // SALES REP
  //

  enyo.kind({
    name: "XV.SalesRepWorkspace",
    kind: "XV.AccountDocumentWorkspace",
    title: "_salesRep".loc(),
    model: "XM.SalesRep",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.PercentWidget", attr: "commission"}
          ]}
        ]}
      ]},
      {kind: "onyx.Popup", name: "findExistingAccountPopup", centered: true,
        modal: true, floating: true, scrim: true, onShow: "popupShown",
        onHide: "popupHidden", components: [
        {content: "_accountExists".loc()},
        {name: "whatToDo", content: "_convertAccountSalesRep".loc()},
        {tag: "br"},
        {kind: "onyx.Button", name: "convert", content: "_ok".loc(), ontap: "accountConvert",
          classes: "onyx-blue xv-popup-button"},
        {kind: "onyx.Button", name: "cancel", content: "_cancel".loc(), ontap: "accountCancel",
          classes: "xv-popup-button"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.SalesRep", "XV.SalesRepWorkspace");

  // ..........................................................
  // SALE TYPE
  //

  enyo.kind({
    name: "XV.SaleTypeWorkspace",
    kind: "XV.Workspace",
    title: "_saleType".loc(),
    model: "XM.SaleType",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.SaleType", "XV.SaleTypeWorkspace");

  // ..........................................................
  // SHIFT
  //

  enyo.kind({
    name: "XV.ShiftWorkspace",
    kind: "XV.Workspace",
    title: "_shift".loc(),
    model: "XM.Shift",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Shift", "XV.ShiftWorkspace");

  // ..........................................................
  // SHIP ZONE
  //

  enyo.kind({
    name: "XV.ShipZoneWorkspace",
    kind: "XV.Workspace",
    title: "_shipZone".loc(),
    model: "XM.ShipZone",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.ShipZone", "XV.ShipZoneWorkspace");

  // ..........................................................
  // SITE
  //

  enyo.kind({
    name: "XV.SiteWorkspace",
    kind: "XV.Workspace",
    title: "_site".loc(),
    model: "XM.Site",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.SiteTypePicker", attr: "siteType"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.ContactWidget", attr: "contact"},
            {kind: "XV.AddressWidget", attr: "address"},
            {kind: "XV.TaxZonePicker", attr: "taxZone"},
            {kind: "XV.InputWidget", attr: "fob"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]},
        {kind: "XV.SiteCommentBox", attr: "comments"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.SiteRelation", "XV.SiteWorkspace");
  XV.registerModelWorkspace("XM.SiteListItem", "XV.SiteWorkspace");

  // ..........................................................
  // SITE TYPE
  //

  enyo.kind({
    name: "XV.SiteTypeWorkspace",
    kind: "XV.Workspace",
    title: "_siteType".loc(),
    model: "XM.SiteType"
  });

  XV.registerModelWorkspace("XM.SiteType", "XV.SiteTypeWorkspace");

  // ..........................................................
  // STATE
  //

  enyo.kind({
    name: "XV.StateWorkspace",
    kind: "XV.Workspace",
    title: "_state".loc(),
    model: "XM.State",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "abbreviation"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.CountryPicker", attr: "country"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.State", "XV.StateWorkspace");

  // ..........................................................
  // TAX ASSIGNMENT
  //

  enyo.kind({
    name: "XV.TaxAssignmentWorkspace",
    kind: "XV.Workspace",
    title: "_taxAssignment".loc(),
    model: "XM.TaxAssignment",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
              {kind: "XV.TaxCodePicker", label: "_taxCode".loc(), attr: "tax"},
              {kind: "XV.TaxZonePicker", label: "_taxZone".loc(), attr: "taxZone"},
              {kind: "XV.TaxTypePicker", label: "_taxType".loc(), attr: "taxType"}
            ]}
          ]}
        ]}
      ]
    });

  XV.registerModelWorkspace("XM.TaxAssignment", "XV.TaxAssignmentWorkspace");

  // ..........................................................
  // TAX AUTHORITY
  //

  hash = {
    name: "XV.TaxAuthorityWorkspace",
    kind: "XV.AccountDocumentWorkspace",
    title: "_taxAuthority".loc(),
    model: "XM.TaxAuthority",
    headerAttrs: ["code", "-", "name"],
    handlers: {
      onError: "errorNotify"
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "externalReference"},
            {kind: "XV.CurrencyPicker", attr: "currency"},
            {kind: "XV.InputWidget", attr: "county"},
            {kind: "onyx.GroupboxHeader", content: "_address".loc()},
            {kind: "XV.AddressWidget", attr: "address"}
          ]}
        ]}
      ]},
      {kind: "onyx.Popup", name: "findExistingAccountPopup", centered: true,
        modal: true, floating: true, scrim: true, onShow: "popupShown",
        onHide: "popupHidden", components: [
        {content: "_accountExists".loc()},
        {name: "whatToDo", content: "_convertAccountTaxAuthority".loc()},
        {tag: "br"},
        {kind: "onyx.Button", name: "convert", content: "_ok".loc(), ontap: "accountConvert",
          classes: "onyx-blue xv-popup-button"},
        {kind: "onyx.Button", name: "cancel", content: "_cancel".loc(), ontap: "accountCancel",
          classes: "xv-popup-button"}
      ]}
    ]
  };

  hash = enyo.mixin(hash, XV.WorkspaceAddressMixin);
  enyo.kind(hash);

  XV.registerModelWorkspace("XM.TaxAuthority", "XV.TaxAuthorityWorkspace");
  XV.registerModelWorkspace("XM.TaxAuthorityRelation", "XV.TaxAuthorityWorkspace");

  // ..........................................................
  // TAX CODE
  //

  enyo.kind({
    name: "XV.TaxCodeWorkspace",
    kind: "XV.Workspace",
    title: "_taxCode".loc(),
    model: "XM.TaxCode",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.TaxClassPicker", attr: "class", label: "_taxClass".loc()},
            {kind: "XV.TaxAuthorityPicker", attr: "authority", label: "_taxAuthority".loc()},
            {kind: "XV.TaxCodePicker", attr: "basis"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.TaxCode", "XV.TaxCodeWorkspace");

  // ..........................................................
  // TAX CLASS
  //

  enyo.kind({
    name: "XV.TaxClassWorkspace",
    kind: "XV.Workspace",
    title: "_taxClass".loc(),
    model: "XM.TaxClass",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.NumberWidget", attr: "sequence"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.TaxClass", "XV.TaxClassWorkspace");

  // ..........................................................
  // TAX RATE
  //

  enyo.kind({
    name: "XV.TaxRateWorkspace",
    kind: "XV.Workspace",
    title: "_taxRate".loc(),
    model: "XM.TaxRate",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
              {kind: "XV.TaxCodePicker", label: "_taxCode".loc(), attr: "tax"},
              {kind: "XV.NumberWidget", label: "_percent".loc(), attr: "percent", scale: XT.PERCENT_SCALE},
              {kind: "XV.MoneyWidget", attr: {localValue: "amount", currency: "currency",
                effective: "effectiveDate"}, label: "_amount".loc()},
              {kind: "XV.DateWidget", label: "_effective".loc(), attr: "effectiveDate"},
              {kind: "XV.DateWidget", label: "_expires".loc(), attr: "expirationDate"}
            ]}
          ]}
        ]}
      ]
    });

  XV.registerModelWorkspace("XM.TaxRate", "XV.TaxRateWorkspace");

  // ..........................................................
  // TAX TYPE
  //

  enyo.kind({
    name: "XV.TaxTypeWorkspace",
    kind: "XV.Workspace",
    title: "_taxType".loc(),
    model: "XM.TaxType",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.CheckboxWidget", attr: "isSystem"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.TaxType", "XV.TaxTypeWorkspace");

  // ..........................................................
  // TAX ZONE
  //

  enyo.kind({
    name: "XV.TaxZoneWorkspace",
    kind: "XV.Workspace",
    title: "_taxZone".loc(),
    model: "XM.TaxZone",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.TaxZone", "XV.TaxZoneWorkspace");

  // ..........................................................
  // TERMS
  //

  enyo.kind({
    name: "XV.TermsWorkspace",
    kind: "XV.Workspace",
    title: "_terms".loc(),
    model: "XM.Terms",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.TermsTypePicker", attr: "termsType"},
            {kind: "XV.NumberWidget", attr: "dueDays"},
            {kind: "XV.NumberWidget", attr: "discountDays"},
            {kind: "XV.NumberWidget", attr: "cutOffDay"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Terms", "XV.TermsWorkspace");

  // ..........................................................
  // TO DO
  //

  var toDoHash = {
    name: "XV.ToDoWorkspace",
    kind: "XV.Workspace",
    title: "_toDo".loc(),
    headerAttrs: ["name"],
    model: "XM.ToDo",
    allowPrint: true,
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.PriorityPicker", attr: "priority"},
            {kind: "XV.ToDoStatusPicker", label: "_status".loc(), attr: "statusProxy"},
            {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
            {kind: "XV.DateWidget", attr: "dueDate"},
            {kind: "XV.DateWidget", attr: "startDate"},
            {kind: "XV.DateWidget", attr: "assignDate"},
            {kind: "XV.DateWidget", attr: "completeDate"},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true},
            {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
            {kind: "XV.AccountWidget", attr: "account"},
            {kind: "XV.ContactWidget", attr: "contact"}
          ]}
        ]},
        {kind: "XV.ToDoCommentBox", attr: "comments"},
        {kind: "XV.ToDoDocumentsBox", attr: "documents"}
      ]}
    ]
  };
  toDoHash = enyo.mixin(toDoHash, XV.accountNotifyContactMixin);
  enyo.kind(toDoHash);
  XV.registerModelWorkspace("XM.ToDoRelation", "XV.ToDoWorkspace");
  XV.registerModelWorkspace("XM.ToDoListItem", "XV.ToDoWorkspace");

  // ..........................................................
  // URL
  //

  enyo.kind({
    name: "XV.UrlWorkspace",
    kind: "XV.Workspace",
    title: "_url".loc(),
    model: "XM.Url",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "path", label: "_address".loc()}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Url", "XV.UrlWorkspace");

  // ..........................................................
  // UNIT
  //

  enyo.kind({
    name: "XV.UnitWorkspace",
    kind: "XV.Workspace",
    title: "_unit".loc(),
    model: "XM.Unit",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.CheckboxWidget", attr: "isItemWeight"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Unit", "XV.UnitWorkspace");

  // ..........................................................
  // USER ACCOUNT
  //

  enyo.kind({
    name: "XV.UserAccountWorkspace",
    kind: "XV.Workspace",
    title: "_userAccount".loc(),
    model: "XM.UserAccount",
    handlers: {
      onRefreshPrivileges: "refreshPrivileges"
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, classes: "xv-top-panel", components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "username"},
            {kind: "XV.InputWidget", type: "password", attr: "password"},
            {kind: "XV.InputWidget", type: "password", name: "passwordCheck",
              label: "_reEnterPassword".loc()},
            {kind: "XV.LocalePicker", attr: "locale"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "properName"},
            {kind: "XV.InputWidget", attr: "initials"},
            {kind: "XV.InputWidget", attr: "email"},
            {kind: "XV.CheckboxWidget", attr: "useEnhancedAuth"},
            {kind: "XV.CheckboxWidget", attr: "disableExport"},
            // normally I'd put classes: "xv-assignment-box" into the container of the assignmentbox,
            // but there is no such container here. Maybe some CSS work to be done now that assignmentbox
            // is the thing inside the thing instead of the thing and the container all together.
            {kind: "onyx.GroupboxHeader", content: "_extensions".loc()},
            {kind: "XV.UserAccountExtensionAssignmentBox", attr: "grantedExtensions", name: "grantedExtensions" },
            {kind: "onyx.GroupboxHeader", content: "_roles".loc()},
            {kind: "XV.UserAccountRoleAssignmentBox", attr: "grantedUserAccountRoles", name: "grantedRoles" },
          ]}
        ]},
        {kind: "XV.Groupbox", name: "privilegePanel", classes: "xv-assignment-box",
            title: "_privileges".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_privileges".loc()},
          {kind: "XV.UserAccountPrivilegeAssignmentBox", attr: "grantedPrivileges", name: "grantedPrivileges" }
        ]}
      ]}
    ],
    /**
      The passwordCheck field is not on the model. Pipe to a hidden field.
     */
    controlValueChanged: function (inSender, inEvent) {
      if (inEvent.originator.name === 'passwordCheck') {
        this.value._passwordCheck = inEvent.originator.value;
        return true;
      }
      this.inherited(arguments);
    },

    /**
      Inject awareness of privileges earned by role into the privilege box when prompted
     */
    refreshPrivileges: function (inSender, inEvent) {
      this.$.grantedPrivileges.mapIds(this.$.grantedRoles.getAssignedCollection().models);
      this.$.grantedPrivileges.tryToRender();
      this.$.grantedExtensions.mapIds(this.$.grantedRoles.getAssignedCollection().models);
      this.$.grantedExtensions.tryToRender();
    },

    /**
      Inject awareness of privileges earned by role into the privilege box at the start of the model loading
     */
    statusChanged: function (model, status, options) {
      this.inherited(arguments);
      if (model.getStatus() & XM.Model.READY) {
        this.$.grantedPrivileges.mapIds(this.getValue().get("grantedUserAccountRoles").models);
        this.$.grantedPrivileges.tryToRender();
        this.$.grantedExtensions.mapIds(this.getValue().get("grantedUserAccountRoles").models);
        this.$.grantedExtensions.tryToRender();
      }
    }
  });

  XV.registerModelWorkspace("XM.UserAccountRelation", "XV.UserAccountWorkspace");
  XV.registerModelWorkspace("XM.UserAccountListItem", "XV.UserAccountWorkspace");

  // ..........................................................
  // USER ACCOUNT ROLE
  //

  enyo.kind({
    name: "XV.UserAccountRoleWorkspace",
    kind: "XV.Workspace",
    title: "_userAccountRole".loc(),
    model: "XM.UserAccountRole",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, classes: "xv-top-panel", components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "onyx.GroupboxHeader", content: "_extensions".loc()},
            {kind: "XV.UserAccountRoleExtensionAssignmentBox", attr: "grantedExtensions", name: "grantedExtensions" }
          ]}
        ]},
        {kind: "XV.Groupbox", name: "privilegePanel", classes: "xv-assignment-box",
            title: "_privileges".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_privileges".loc()},
          {kind: "XV.UserAccountRolePrivilegeAssignmentBox", attr: "grantedPrivileges", name: "grantedPrivileges" }
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.UserAccountRole", "XV.UserAccountRoleWorkspace");
  XV.registerModelWorkspace("XM.UserAccountRoleRelation", "XV.UserAccountRoleWorkspace");
  XV.registerModelWorkspace("XM.UserAccountRoleListItem", "XV.UserAccountRoleWorkspace");

  // ..........................................................
  // CHARACTERISTIC
  //

  enyo.kind({
    name: "XV.CharacteristicWorkspace",
    kind: "XV.Workspace",
    title: "_characteristic".loc(),
    model: "XM.Characteristic",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.CharacteristicTypePicker", name: "typePicker", attr: "characteristicType"},
            {kind: "XV.CheckboxWidget", attr: "isSearchable"},
            {kind: "onyx.GroupboxHeader", content: "_roles".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isAddresses", label: "_address".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isContacts", label: "_contact".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isAccounts", label: "_account".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isIncidents", label: "_incident".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isItems", label: "_item".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isOpportunities", label: "_opportunity".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isEmployees", label: "_employees".loc()},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true},
            {name: "advancedPanel", showing: false, components: [
              {kind: "onyx.GroupboxHeader", content: "_advanced".loc()},
              {kind: "XV.InputWidget", attr: "mask"},
              {kind: "XV.InputWidget", attr: "validator"}
            ]}
          ]}
        ]},
        {kind: "XV.CharacteristicOptionBox", name: "optionsPanel", attr: "options", showing: false}
      ]}
    ],
    /**
      After the controls are updated by the model, determine visibility of panels.
     */
    attributesChanged: function (model, options) {
      this.inherited(arguments);
      if (this.getValue().getStatus() === XM.Model.READY_CLEAN ||
        this.getValue().getStatus() === XM.Model.READY_NEW) {
        this.typeValueChanged(model);
      }
    },

    /**
      Function to determine visibility of "advanced" and "options" panels based
        on the characteristicType
     */
    typeValueChanged: function (model) {
      var type = model ? model.get('characteristicType') : null;
      var isText = type === XM.Characteristic.TEXT;
      var isList = type === XM.Characteristic.LIST;
      this.$.advancedPanel.setShowing(isText);
      this.$.optionsPanel.setShowing(isList);
      if (isList) {
        this.$.optionsPanel.render();
      } else if (isText) {
        this.$.advancedPanel.render();
      }
      // signal to workspace container that the menu needs to re-render
      this.doMenuChange();
    }
  });

  XV.registerModelWorkspace("XM.Characteristic", "XV.CharacteristicWorkspace");

}());
