/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XT:true, XV:true, XM:true, Backbone:true, window:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountWidget",
    kind: "XV.RelationWidget",
    collection: "XM.AccountRelationCollection",
    list: "XV.AccountList"
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactWidget",
    kind: "XV.RelationWidget",
    label: "_contact".loc(),
    keyAttribute: "name",
    nameAttribute: "jobTitle",
    descripAttribute: "phone",
    collection: "XM.ContactRelationCollection",
    list: "XV.ContactList",
    published: {
      showAddress: false
    },
    descriptionComponents: [
      {name: "jobTitleRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: 'xv-description', name: "name"}
      ]},
      {name: "phoneRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: "xv-description hyperlink", target: '_blank', name: "description"}
      ]},
      {name: "alternateRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: "xv-description hyperlink", target: "_blank", name: "alternate"}
      ]},
      {name: "faxRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: "xv-description hyperlink", target: "_blank", name: "fax"}
      ]},
      {name: "emailRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: 'xv-description hyperlink', target: "_blank", name: "email"}
      ]},
      {name: "webAddressRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: 'xv-description hyperlink', target: "_blank", name: "webAddress"}
      ]},
      {name: "addressRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: "xv-description", name: "address", allowHtml: true}
      ]}
    ],
    setValue: function (value, options) {
      this.inherited(arguments);

      if (value && !value.get) {
        // the value of the widget is still being fetched asyncronously.
        // when the value is fetched, this function will be run again,
        // so for now we can just stop here.
        return;
      }

      // The rows are here because sometimes the values needs labels
      // to go with the values.
      var jobTitle = value ? value.get("jobTitle") : "",
        phone = value ? value.get("phone") : "",
        alternate = value ? value.get("alternate") : "",
        fax = value ? value.get("fax") : "",
        primaryEmail = value ? value.get("primaryEmail") : "",
        webAddress = value ? value.get("webAddress") : "",
        address = value ? XM.Address.format(value.get("address")) : "",
        showAddress = this.getShowAddress();

      this.$.jobTitleRow.setShowing(!!jobTitle);
      this.$.name.setContent(jobTitle);

      this.$.phoneRow.setShowing(!!phone);
      this.$.description.setContent(phone);
      this.$.description.setAttribute('href', 'tel://' + phone);

      this.$.alternateRow.setShowing(!!alternate);
      this.$.alternate.setContent(alternate);
      this.$.alternate.setAttribute('href', 'tel://' + alternate);

      this.$.faxRow.setShowing(!!fax);
      this.$.fax.setContent(fax);
      this.$.fax.setAttribute('href', 'tel://' + fax);

      this.$.emailRow.setShowing(!!primaryEmail);
      this.$.email.setContent(primaryEmail);
      this.$.email.setAttribute('href', 'mailto:' + primaryEmail);

      this.$.webAddressRow.setShowing(!!webAddress);
      this.$.webAddress.setContent(webAddress);
      this.$.webAddress.setAttribute('href', '//' + alternate);

      this.$.addressRow.setShowing(address && showAddress);
      this.$.address.setContent(address);
    },
    openWindow: function () {
      var address = this.value ? this.value.get("webAddress") : null;
      if (address) { window.open("http://" + address); }
      return true;
    },
    callPhone: function () {
      var phoneNumber = this.value ? this.value.get("phone") : null,
        win;
      if (phoneNumber) {
        win = window.open("tel://" + phoneNumber);
        win.close();
      }
      return true;
    },
    sendMail: function () {
      var email = this.value ? this.value.get("primaryEmail") : null,
        win;
      if (email) {
        win = window.open("mailto:" + email);
        win.close();
      }
      return true;
    }
  });

  // ..........................................................
  // CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerWidget",
    kind: "XV.RelationWidget",
    collection: "XM.CustomerRelationCollection",
    list: "XV.CustomerList"
  });

  enyo.kind({
    name: "XV.BillingCustomerWidget",
    kind: "XV.RelationWidget",
    collection: "XM.BillingCustomerCollection",
    query: { parameters: [{attribute: "isActive", value: true}]},
    list: "XV.CustomerList"
  });

  enyo.kind({
    name: "XV.SalesCustomerWidget",
    kind: "XV.RelationWidget",
    collection: "XM.SalesCustomerCollection",
    list: "XV.CustomerList"
  });

  // ..........................................................
  // CUSTOMER GROUP
  //
  enyo.kind({
    name: "XV.CustomerGroupWidget",
    kind: "XV.RelationWidget",
    collection: "XM.CustomerGroupCollection",
    keyAttribute: "name",
    list: "XV.CustomerGroupList"
  });

  // ..........................................................
  // CUSTOMER PROSPECT
  //

  enyo.kind({
    name: "XV.CustomerProspectWidget",
    kind: "XV.RelationWidget",
    collection: "XM.CustomerProspectRelationCollection",
    list: "XV.CustomerProspectList",
    create: function () {
      var ret = this.inherited(arguments);
      this.createComponent({
        kind: "onyx.Popup",
        name: "customerOrProspectPopup",
        centered: true,
        modal: true,
        floating: true,
        scrim: true,
        onShow: "popupShown",
        onHide: "popupHidden",
        components: [
          {content: "_customerOrProspect".loc()},
          {tag: "br"},
          {kind: "onyx.Button", name: "customerButton", content: "_customer".loc(), ontap: "popupTapped",
            classes: "onyx-blue xv-popup-button"},
          {kind: "onyx.Button", name: "prospectButton", content: "_prospect".loc(), ontap: "popupTapped",
            classes: "onyx-blue xv-popup-button"}
        ]
      });
      this.$.newItem.setDisabled(false);
      return ret;
    },
    /**
     @menuItemSelected
     this overrides the menuItemSelected function of RelationWidget to
     account for the different types of models presented by the widget.
     */
    menuItemSelected: function (inSender, inEvent) {
      var that = this,
        menuItem = inEvent.originator,
        list = this.getList(),
        model = this.getValue(),
        K, status, id, workspace,
        callback;

      switch (menuItem.name)
      {
      case "searchItem":
        callback = function (value) {
          that.setValue(value);
        };
        this.doSearch({
          list: list,
          searchText: this.$.input.getValue(),
          callback: callback
        });
        break;
      case "openItem":
        K = model.getClass();
        status = model.get("status");
        id = model ? model.id : null;
        workspace = status === K.PROSPECT_STATUS ? "XV.ProspectWorkspace" : "XV.CustomerWorkspace";

        this.doWorkspace({
          workspace: workspace,
          id: id,
          allowNew: false
        });
        break;
      case "newItem":
        this.$.customerOrProspectPopup.show();
      }
    },
    popupTapped: function (inSender, inEvent) {
      var that = this,
        callback = function (model) {
          if (!model) { return; }
          var Model = that._collection.model,
            attrs = {},
            value,
            options = {};
          options.success = function () {
            that.setValue(value);
          };
          attrs[Model.prototype.idAttribute] = model.id;
          value = Model.findOrCreate(attrs);
          value.fetch(options);
        };

      this.$.customerOrProspectPopup.hide();
      this.doWorkspace({
        callback: callback,
        workspace: inEvent.originator.name === "customerButton" ?
          "XV.CustomerWorkspace" : "XV.ProspectWorkspace",
        allowNew: false
      });
    },
  });

  // ..........................................................
  // CUSTOMER SHIPTO
  //

  enyo.kind({
    name: "XV.CustomerShiptoWidget",
    kind: "XV.RelationWidget",
    collection: "XM.CustomerShiptoRelationCollection",
    list: "XV.CustomerShiptoList"
  });

  // ..........................................................
  // DEPARTMENT
  //

  enyo.kind({
    name: "XV.DepartmentWidget",
    kind: "XV.RelationWidget",
    collection: "XM.DepartmentCollection",
    list: "XV.DepartmentList"
  });

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.EmployeeWidget",
    kind: "XV.RelationWidget",
    collection: "XM.EmployeeRelationCollection",
    list: "XV.EmployeeList",
    keyAttribute: "code"
  });

  // ..........................................................
  // EXPENSE CATEGORY
  //

  enyo.kind({
    name: "XV.ExpenseCategoryWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ExpenseCategoryCollection",
    list: "XV.ExpenseCategoryList",
    keyAttribute: "code"
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentWidget",
    kind: "XV.RelationWidget",
    collection: "XM.IncidentRelationCollection",
    list: "XV.IncidentList",
    nameAttribute: "description"
  });

  // ..........................................................
  // ITEM
  //

  enyo.kind({
    name: "XV.ItemWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ItemRelationCollection",
    list: "XV.ItemList",
    nameAttribute: "description1",
    descripAttribute: "description2"
  });

  // ..........................................................
  // LEDGER ACCOUNT
  //

  enyo.kind({
    name: "XV.LedgerAccountWidget",
    kind: "XV.RelationWidget",
    collection: "XM.LedgerAccountRelationCollection",
    list: "XV.LedgerAccountList",
    keyAttribute: "name",
    nameAttribute: "description"
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityWidget",
    kind: "XV.RelationWidget",
    collection: "XM.OpportunityRelationCollection",
    keyAttribute: "name",
    list: "XV.OpportunityList"
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ProjectRelationCollection",
    list: "XV.ProjectList",
    create: function () {
      this.inherited(arguments);
      this.setShowing(XT.session.settings.get("UseProjects"));
    },
    setShowing: function (showing) {
      if (!showing || showing && XT.session.settings.get("UseProjects")) {
        this.inherited(arguments);
      }
    }
  });

  // ..........................................................
  // PURCHASE ORDER
  //

  enyo.kind({
    name: "XV.PurchaseOrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.PurchaseOrderRelationCollection",
    keyAttribute: "number",
    list: "XV.PurchaseOrderList"
  });

  // ..........................................................
  // SALES ORDER
  //

  enyo.kind({
    name: "XV.SalesOrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.SalesOrderRelationCollection",
    keyAttribute: "number",
    list: "XV.SalesOrderList"
  });

  // ..........................................................
  // SHIFT
  //

  enyo.kind({
    name: "XV.ShiftWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ShiftCollection",
    list: "XV.ShiftList"
  });

  // ..........................................................
  // USER ACCOUNT
  //

  enyo.kind({
    name: "XV.UserAccountWidget",
    classes: "xv-useraccount-widget",
    kind: "XV.RelationWidget",
    collection: "XM.UserAccountRelationCollection",
    list: "XV.UserAccountList",
    keyAttribute: "username",
    nameAttribute: "properName"
  });

  // ..........................................................
  // VENDOR
  //

  enyo.kind({
    name: "XV.VendorWidget",
    kind: "XV.RelationWidget",
    collection: "XM.VendorRelationCollection",
    keyAttribute: "number",
    list: "XV.VendorList"
  });

}());
