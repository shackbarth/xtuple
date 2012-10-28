/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

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
            {kind: "XV.UserAccountWidget", attr: "owner"},
            {kind: "onyx.GroupboxHeader", content: "_primaryContact".loc()},
            {kind: "XV.ContactWidget", attr: "primaryContact",
              showAddress: true},
            {kind: "onyx.GroupboxHeader", content: "_secondaryContact".loc()},
            {kind: "XV.ContactWidget", attr: "secondaryContact",
              showAddress: true},
            {kind: "XV.AccountCharacteristicsWidget", attr: "characteristics"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]},
        {kind: "XV.AccountCommentBox", attr: "comments"},
        {kind: "XV.AccountDocumentsBox", attr: "documents"},
        {kind: "XV.AccountContactsBox", attr: "contactRelations"}
      ]}
    ]
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
            {kind: "XV.InputWidget", attr: "honorific"},
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
            {kind: "XV.InputWidget", attr: "primaryEmail"},
            {kind: "XV.InputWidget", attr: "phone"},
            {kind: "XV.InputWidget", attr: "alternate"},
            {kind: "XV.InputWidget", attr: "fax"},
            {kind: "XV.ContactCharacteristicsWidget", attr: "characteristics"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes"}
          ]}
        ]},
        {kind: "XV.ContactCommentBox", attr: "comments"},
        {kind: "XV.ContactDocumentsBox", attr: "documents"}
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

  enyo.kind({
    name: "XV.ImageWorkspace",
    kind: "XV.FileWorkspace",
    title: "_image".loc(),
    model: "XM.Image",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name", name: "name"},
            // XXX the disabled flag here doesn't seem to work
            {kind: "XV.InputWidget", attr: "description", name: "description", disabled: true},
            {kind: "XV.FileInput", name: "file", attr: "data"}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "previewPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_preview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "previewGroup", classes: "in-panel", components: [
            {tag: "img", name: "image"}
          ]}
        ]}
      ]}
    ],
    attributesChanged: function (model, options) {
      var id = this.getValue().get("id"),
        K = XM.Model;

      this.inherited(arguments);
      if (id &&
          !this.$.image.getAttribute("src") && this.isImageFile() &&
          this.getValue().getStatus() !== K.READY_NEW) {
        this.$.image.setAttribute("src", "/file?recordType=XM.Image&id=" + id);
      }
    },
    isImageFile: function () {
      var filename = this.$.description.getValue(),
        extension;
      if (!filename) {
        return false;
      }
      extension = filename.substring(filename.lastIndexOf('.') + 1);
      return (['png', 'gif', 'jpg'].indexOf(extension) >= 0);
    }


  });

  XV.registerModelWorkspace("XM.ImageRelation", "XV.ImageWorkspace");


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
    ]
  };
  
  incidentHash = enyo.mixin(incidentHash, XV.accountNotifyContactMixin);
  enyo.kind(incidentHash);

  XV.registerModelWorkspace("XM.IncidentRelation", "XV.IncidentWorkspace");
  XV.registerModelWorkspace("XM.IncidentListItem", "XV.IncidentWorkspace");

  // ..........................................................
  // INCIDENT CATEGORY
  //

  enyo.kind({
    name: "XV.IncidentCategoryWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_incidentCategory".loc(),
    model: "XM.IncidentCategory"
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
    model: "XM.OpportunityStage"
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
            {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
            {kind: "XV.ContactWidget", attr: "contact"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true},
            {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
            {kind: "XV.AccountWidget", attr: "account"}
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
            {kind: "XV.InputWidget", attr: "properName"},
            {kind: "XV.InputWidget", attr: "initials"},
            {kind: "XV.InputWidget", attr: "email"},
            {kind: "XV.CheckboxWidget", attr: "disableExport"},
            {kind: "XV.CheckboxWidget", attr: "isActive"}
          ]}
        ]},
        {kind: "XV.UserAccountRoleAssignmentBox", attr: "grantedUserAccountRoles", name: "grantedRoles", title: "_roles".loc()},
        {kind: "XV.UserAccountPrivilegeAssignmentBox", attr: "grantedPrivileges", name: "grantedPrivileges", title: "_privileges".loc() }
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
        //{kind: "XV.Groupbox", name: "privilegePanel", title: "_privileges".loc(), components: [
        //  {kind: "onyx.GroupboxHeader", content: "_privileges".loc()},
        {kind: "XV.UserAccountRolePrivilegeAssignmentBox", attr: "grantedPrivileges", name: "grantedPrivileges", title: "_privileges".loc() }
        //]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.UserAccountRole", "XV.UserAccountRoleWorkspace");
  XV.registerModelWorkspace("XM.UserAccountRoleRelation", "XV.UserAccountRoleWorkspace");
  XV.registerModelWorkspace("XM.UserAccountRoleListItem", "XV.UserAccountRoleWorkspace");

}());
