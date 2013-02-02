/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, window:true */

(function () {

  /**
    Used to notify change of account to contact widget if both exist on
    the same workspace.
  */
  XV.accountNotifyContactMixin = {
    accountChanged: function () {
      var account = this.$.accountWidget.getValue();
      this.$.contactWidget.setAccount(account);
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
            {kind: "XV.NumberWidget", attr: "order"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // ACCOUNT
  //
  
  enyo.kind({
    name: "XV.AccountRoleCheckboxWidget",
    kind: "XV.CheckboxWidget"
  });

  enyo.kind({
    name: "XV.AccountWorkspace",
    kind: "XV.Workspace",
    title: "_account".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.Account",
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
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      var K = XM.Account.prototype,
        roles = K.roleAttributes.sort(),
        that = this;
        
      // Loop and add a role checkbox for each role attribute found on the model
      _.each(roles, function (role) {
        var attr = K.getRolePropertyName(role);
        that.createComponent({
          kind: XV.AccountRoleCheckboxWidget,
          name: attr + "Control",
          label: ("_" + role).loc(),
          attr: attr,
          container: that.$.rolesGroup,
          owner: that
        });
      });
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

  enyo.kind({
    name: "XV.ContactWorkspace",
    kind: "XV.Workspace",
    title: "_contact".loc(),
    model: "XM.Contact",
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
      ]},
      {kind: "onyx.Popup", name: "multipleAddressPopup", centered: true,
        modal: true, floating: true, scrim: true, onShow: "popupShown",
        onHide: "popupHidden", components: [
        {content: "_addressShared".loc()},
        {content: "_whatToDo".loc()},
        {tag: "br"},
        {kind: "onyx.Button", content: "_changeOne".loc(), ontap: "addressChangeOne",
          classes: "onyx-blue xv-popup-button"},
        {kind: "onyx.Button", content: "_changeAll".loc(), ontap: "addressChangeAll",
          classes: "xv-popup-button"},
        {kind: "onyx.Button", content: "_cancel".loc(), ontap: "addressCancel",
          classes: "xv-popup-button"}
      ]}
    ],
    accountChanged: function () {
      var account = this.$.accountWidget.getValue();
      this.$.addressWidget.setAccount(account);
    },
    addressChangeAll: function () {
      var options = {address: XM.Address.CHANGE_ALL};
      this._popupDone = true;
      this.$.multipleAddressPopup.hide();
      this.save(options);
    },
    addressChangeOne: function () {
      var options = {address: XM.Address.CHANGE_ONE};
      this._popupDone = true;
      this.$.multipleAddressPopup.hide();
      this.save(options);
    },
    addressCancel: function () {
      this._popupDone = true;
      this.$.multipleAddressPopup.hide();
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
    errorNotify: function (inSender, inEvent) {
      // Handle address questions
      if (inEvent.error.code === 'xt2007') {
        this._popupDone = false;
        this.$.multipleAddressPopup.show();
        return true;
      }
    },
    modelChanged: function () {
      this.inherited(arguments);
      var input = this.findControl("primaryEmail").$.input,
       value = this.getValue();
      input._collection = value ? value.get("email") : [];
      input.buildList();
    },
    statusChanged: function () {
      this.inherited(arguments);
      var input = this.findControl("primaryEmail").$.input;
      input.buildList();
    },
    popupHidden: function () {
      if (!this._popupDone) {
        this.$.multipleAddressPopup.show();
      }
    }
  });

  XV.registerModelWorkspace("XM.ContactRelation", "XV.ContactWorkspace");
  XV.registerModelWorkspace("XM.ContactListItem", "XV.ContactWorkspace");

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
            // this is only going to be added by commerical editions
            // {kind: "XV.InputWidget", attr: "preferredSite"},
            {kind: "onyx.GroupboxHeader", content: "_terms".loc()},
            // comes from Time & Expense
            //{kind: "XV.CheckboxWidget", attr: "isSpecifiedBillingRate"}, Enables Rate Widget
            //{kind: "XV.NumberWidget", attr: "billingRate"},
            {kind: "XV.TermsPicker", attr: "terms"},
            {kind: "XV.PercentWidget", attr: "discount"},
            {kind: "XV.CreditStatusPicker", attr: "creditStatus"},
            {kind: "XV.CheckboxWidget", attr: "usesPurchaseOrders"},
            {kind: "XV.CheckboxWidget", attr: "blanketPurchaseOrders"},
            {kind: "XV.BalanceMethodPicker", attr: "balanceMethod"},
            {kind: "XV.NumberWidget", attr: "creditLimit"},
            {kind: "XV.InputWidget", attr: "creditRating"},
            // will be added by sales
            // {kind: "XV.CheckboxWidget", attr: "autoHoldOrders"},
            {kind: "XV.NumberWidget", attr: "graceDays"},
            {kind: "onyx.GroupboxHeader", content: "_tax".loc()},
            {kind: "XV.TaxZonePicker", attr: "taxZone", label: "_defaultTaxZone".loc()}
          ]}
        ]},
        //{kind: "XV.TaxRegistrationBox", attr: "taxRegistration"},
        {kind: "XV.CustomerCommentBox", attr: "comments"},
        {kind: "XV.CustomerShipToBox", attr: "shiptos"},
        {kind: "XV.CustomerDocumentsBox", attr: "documents"}
      ]},
      {kind: "onyx.Popup", name: "findExistingCustomerPopup", centered: true,
        modal: true, floating: true, scrim: true, onShow: "popupShown",
        onHide: "popupHidden", components: [
        {name: "exists"},
        {content: "_whatToDo".loc()},
        {tag: "br"},
        {kind: "onyx.Button", name: "convert", ontap: "customerConvert",
          classes: "onyx-blue xv-popup-button"},
        {kind: "onyx.Button", name: "cancel", content: "_cancel".loc(), ontap: "customerCancel",
          classes: "xv-popup-button"}
      ]}
    ],
    customerConvert: function (inEvent) {
      this._popupDone = true;
      this.$.findExistingCustomerPopup.hide();
      if (inEvent.getContent() === "_convertProspect".loc()) {
        this.value.convertFromProspect(this.existingId);
      } else if (inEvent.getContent() === "_convertAccount".loc()) {
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
          this.$.exists.setContent("_customerExistsProspect".loc());
          this.$.convert.setContent("_convertProspect".loc());
          this.$.findExistingCustomerPopup.show();
        } else if (type === 'A') { // Existing Account
          this._popupDone = false;
          this.$.exists.setContent("_customerExistsAccount".loc());
          this.$.convert.setContent("_convertAccount".loc());
          this.$.findExistingCustomerPopup.show();
        }
      }
    },
    customerCancel: function () {
      this._popupDone = true;
      this.$.findExistingCustomerPopup.hide();
    },
    popupHidden: function () {
      if (!this._popupDone) {
        this.$.findExistingCustomerPopup.show();
      }
    }
  });

  XV.registerModelWorkspace("XM.CustomerRelation", "XV.CustomerWorkspace");
  XV.registerModelWorkspace("XM.CustomerListItem", "XV.CustomerWorkspace");

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
            {kind: "XV.UnitWidget", attr: "inventoryUnit"},
            {kind: "XV.ClassCodePicker", attr: "classCode"},
            {kind: "XV.CheckboxWidget", attr: "isFractional"},
            {kind: "onyx.GroupboxHeader", content: "_product".loc()},
            {kind: "XV.CheckboxWidget", attr: "isSold"},
            {kind: "XV.ProductCategoryPicker", attr: "productCategory",
              label: "_category".loc()},
            {kind: "XV.SalesPriceWidget", attr: "listPrice"},
            {kind: "XV.UnitWidget", attr: "priceUnit"},
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
  // OPPORTUNITY
  //

  var opportunityHash = {
    name: "XV.OpportunityWorkspace",
    kind: "XV.Workspace",
    title: "_opportunity".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.Opportunity",
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
            {kind: "XV.MoneyWidget", attr: "amount"},
            {kind: "XV.PercentWidget", attr: "probability"},
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
    ],
    controlValueChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      var account;
      if (inEvent.originator.name === 'accountWidget') {
        account = this.$.accountWidget.getValue();
        this.$.contactWidget.setAccount(account);
      }
    }
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
    ],
    controlValueChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      var account;
      if (inEvent.originator.name === 'accountWidget') {
        account = this.$.accountWidget.getValue();
        this.$.contactWidget.setAccount(account);
      }
    }
  };

  projectHash = enyo.mixin(projectHash, XV.accountNotifyContactMixin);
  enyo.kind(projectHash);

  XV.registerModelWorkspace("XM.ProjectRelation", "XV.ProjectWorkspace");
  XV.registerModelWorkspace("XM.ProjectListItem", "XV.ProjectWorkspace");

  enyo.kind({
    name: "XV.ProjectTaskWorkspace",
    kind: "XV.Workspace",
    title: "_projectTask".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.ProjectTask",
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
            {kind: "onyx.GroupboxHeader", content: "_hours".loc()},
            {kind: "XV.QuantityWidget", attr: "budgetedHours",
              label: "_budgeted".loc()},
            {kind: "XV.QuantityWidget", attr: "actualHours",
              label: "_actual".loc()},
            {kind: "onyx.GroupboxHeader", content: "_expenses".loc()},
            {kind: "XV.MoneyWidget", attr: "budgetedExpenses",
              label: "_budgeted".loc()},
            {kind: "XV.MoneyWidget", attr: "actualExpenses",
              label: "_actual".loc()},
            {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "XV.UserAccountWidget", attr: "assignedTo"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]},
        {kind: "XV.ProjectTaskCommentBox", attr: "comments"}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.ProjectTask", "XV.ProjectTaskWorkspace");
  XV.registerModelWorkspace("XM.ProjectTaskListItem", "XV.ProjectTaskWorkspace");

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
  // TO DO
  //

  var toDoHash = {
    name: "XV.ToDoWorkspace",
    kind: "XV.Workspace",
    title: "_toDo".loc(),
    headerAttrs: ["name"],
    model: "XM.ToDo",
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
    ],
    controlValueChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      var account;
      if (inEvent.originator.name === 'accountWidget') {
        account = this.$.accountWidget.getValue();
        this.$.contactWidget.setAccount(account);
      }
    }
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
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "username"},
            {kind: "XV.LocalePicker", attr: "locale"},
            {kind: "XV.InputWidget", attr: "properName"},
            {kind: "XV.InputWidget", attr: "initials"},
            {kind: "XV.InputWidget", attr: "email"},
            {kind: "XV.CheckboxWidget", attr: "disableExport"},
            // normally I'd put classes: "xv-assignment-box" into the container of the assignmentbox,
            // but there is no such container here. Maybe some CSS work to be done now that assignmentbox
            // is the thing inside the thing instead of the thing and the container all together.
            {kind: "onyx.GroupboxHeader", content: "_roles".loc()},
            {kind: "XV.UserAccountRoleAssignmentBox", attr: "grantedUserAccountRoles", name: "grantedRoles" }
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
      Inject awareness of privileges earned by role into the privilege box when prompted
     */
    refreshPrivileges: function (inSender, inEvent) {
      this.$.grantedPrivileges.mapIds(this.$.grantedRoles.getAssignedCollection().models);
      this.$.grantedPrivileges.tryToRender();
    },

    /**
      Inject awareness of privileges earned by role into the privilege box at the start of the model loading
     */
    statusChanged: function (model, status, options) {
      this.inherited(arguments);
      if (model.getStatus() & XM.Model.READY) {
        this.$.grantedPrivileges.mapIds(this.getValue().get("grantedUserAccountRoles").models);
        this.$.grantedPrivileges.tryToRender();
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
            {kind: "XV.InputWidget", attr: "description"}
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
            //{kind: "XV.ToggleButtonWidget", attr: "isCustomers", label: "_customer".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isAccounts", label: "_account".loc()},
            //{kind: "XV.ToggleButtonWidget", attr: "isEmployees", label: "_employee".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isIncidents", label: "_incident".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isItems", label: "_item".loc()},
            //{kind: "XV.ToggleButtonWidget", attr: "isLotSerial", label: "_lotSerial".loc()},
            {kind: "XV.ToggleButtonWidget", attr: "isOpportunities", label: "_opportunity".loc()},
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
