/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // EMAIL
  //

  /**
    An abstract list to be used for email profiles
  */
  enyo.kind({
    name: "XV.EmailProfileList",
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
    ]
  });

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
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {kind: "XV.ListAttr", attr: "number", isKey: true},
            {kind: "XV.ListAttr", attr: "name"}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {kind: "XV.ListAttr", attr: "primaryContact.phone", },
            {kind: "XV.ListAttr", attr: "primaryContact.primaryEmail"}
          ]},
          {kind: "XV.ListColumn", fit: true, components: [
            {kind: "XV.ListAttr", attr: "primaryContact.name",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "primaryContact.address"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.AccountRelation", "XV.AccountList");

  // ..........................................................
  // ACTIVITY
  //

  enyo.kind({
    name: "XV.ActivityList",
    kind: "XV.List",
    label: "_activities".loc(),
    collection: "XM.ActivityListItemCollection",
    parameterWidget: "XV.ActivityListParameters",
    published: {
      activityActions: []
    },
    actions: [
      {name: "reassignUser",
        method: "reassignUser",
        prerequisite: "canReassign",
        isViewMethod: true,
        notify: false}
    ],
    events: {
      onNotify: ""
    },
    query: {orderBy: [
      {attribute: 'dueDate'},
      {attribute: 'name'},
      {attribute: 'uuid'}
    ]},
    multiSelect: true,
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {kind: "XV.ListAttr", formatter: "formatName", isKey: true},
            {kind: "XV.ListAttr", formatter: "formatDescription1"},
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {kind: "XV.ListAttr", attr: "dueDate", placeholder: "_noDueDate".loc()},
            {kind: "XV.ListAttr", attr: "getActivityStatusString"}
          ]},
          {kind: "XV.ListColumn", classes: "second",
            components: [
            {kind: "XV.ListAttr", attr: "activityType",
              formatter: "formatType",
              placeholder: "_noDescription".loc()},
            {kind: "XV.ListAttr", formatter: "formatDescription2"}
          ]},
          {kind: "XV.ListColumn", fit: true, components: [
            {kind: "XV.ListAttr", attr: "owner.username",
              placeholder: "_noOwner".loc()},
            {kind: "XV.ListAttr", attr: "assignedTo.username", name: "assignedTo",
              placeholder: "_noAssignedTo".loc()}
          ]}
        ]}
      ]}
    ],
    selectedModels: function () {
      var that = this,
        collection = this.getValue(),
        models = [],
        selected;
      if (collection.length) {
        selected = _.keys(this.getSelection().selected);
        // Using the selected index keys, go grab the models and return them in an array
        models.push(_.map(selected, function (index) {
          return that.getModel(index);
        }));
      }
      return models[0];
    },
    reassignUser: function () {
      var callback = function (resp, optionsObj) {
        var navigator = this.$.navigator;
        if (!resp.answer) {
          return;
        } else if (!resp.componentValue) {
          navigator.$.contentPanels.getActive().doNotify({
            type: XM.Model.WARNING,
            message: "_noUserSelected".loc()
          });
        } else {
          // Gather selected models, assemble dispatch params object and send dispatch to server
          var options = {},
            params = [],
            models = optionsObj.models,
            assignedTo = resp.componentValue.id,
            ids = _.map(models, function (model) {
              return model.id;
            });
          // Loop through and assemble dispatch param object
          for (var i = 0; i < ids.length; i++) {
            params.push({
              activityId: ids[i],
              username: assignedTo
            });
          }

          // TODO - dispatch error handling
          options.success = function (resp) {
            navigator.requery();
            return;
          };

          // Send to server with dispath. Need to pass options.error callback for error handling
          XM.Model.prototype.dispatch("XM.Activity", "reassignUser", params, options);
        }
      };

      this.doNotify({
        type: XM.Model.QUESTION,
        callback: callback,
        message: "_reassignSelectedActivities".loc(),
        yesLabel: "_reassign".loc(),
        noLabel: "_cancel".loc(),
        component: {kind: "XV.UserPicker", name: "assignTo", label: "_assignTo".loc()},
        options: {models: this.selectedModels()}
      });
    },
    getWorkspace: function () {
      if (!this._lastTapIndex) {
        // don't respond to events waterfalled from other models
        return;
      }
      var collection = this.getValue(),
        model = collection.at(this._lastTapIndex),
        recordType = "XM." + model.get("activityType");
      return XV.getWorkspace(recordType);
    },
    formatName: function (value, view, model) {
      var parent = model.get("parent");
      if (parent) { return parent.get("name"); }
      return model.get("name");
    },
    formatDescription1: function (value, view, model) {
      var parent = model.get("parent");
      if (parent) { return model.get("name"); }
      return model.get("description");
    },
    formatDescription2: function (value, view, model) {
      var parent = model.get("parent");
      if (!parent) { return ""; }
      return model.get("description");
    },
    formatType: function (value) {
      return ("_" + value.slice(0, 1).toLowerCase() + value.slice(1)).loc();
    },
    itemTap: function (inSender, inEvent) {
      var model = this.getModel(inEvent.index),
        key = model.get("editorKey"),
        oldId = model.id,
        type = model.get("activityType"),
        action = model.get("activityAction"),
        actActions = this.getActivityActions(),
        actAction = _.find(actActions, function (item) {
          return item.activityType === type && item.activityAction === action;
        });

      if (actAction) {
        if (!this.getToggleSelected() || inEvent.originator.isKey) {
          inEvent.model = model;
          actAction.method.call(this, inSender, inEvent);
          return true;
        }
      } else {
        model.id = key;
        this._lastTapIndex = inEvent.index;
        this.inherited(arguments);
        model.id = oldId;
      }
    }
  });

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
  // BANK ACCOUNT
  //

  enyo.kind({
    name: "XV.BankAccountList",
    kind: "XV.List",
    label: "_bankAccounts".loc(),
    collection: "XM.BankAccountRelationCollection",
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

  XV.registerModelList("XM.BankAccountRelation", "XV.BankAccountList");

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
    getWorkspace: function () {
      return this._workspace;
    },
    /**
      Configuration is a special list because it's backed by a backbone
      model which points to an empty XM.Model in its model attribute. Don't
      let this go up through the normal channels; handle the opening of
      the workspace here.
     */
    itemTap: function (inSender, inEvent) {
      var model = this.getValue().at(inEvent.index),
        workspace = model.get("workspace"),
        xmModel = XT.getObjectByName(model.get('model')),
        canNotRead = !xmModel.getClass().canRead(),
        id = false;

      this._workspace = model.get('workspace');

      // Check privileges first
      if (canNotRead) {
        this.showError("_insufficientViewPrivileges".loc());
        return true;
      }

      // Bubble requset for workspace view, including the model id payload
      if (workspace) {
        this.doWorkspace({workspace: workspace, id: id});
      }
      return true;
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
    actions: [{
      name: "exportContact",
      method: "vCardExport",
      isViewMethod: "true"
    }],
    query: {orderBy: [
      {attribute: 'lastName'},
      {attribute: 'firstName'},
      {attribute: 'primaryEmail'}
    ]},
    parameterWidget: "XV.ContactListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "firstName",
                formatter: "formatFirstName", isKey: true},
              {kind: "XV.ListAttr", attr: "lastName", fit: true,
                style: "padding-left: 0px;", isKey: true}
            ]},
            {kind: "XV.ListAttr", attr: "jobTitle", showPlaceholder: true}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {kind: "XV.ListAttr", attr: "phone"},
            {kind: "XV.ListAttr", attr: "primaryEmail"}
          ]},
          {kind: "XV.ListColumn", fit: true, components: [
            {kind: "XV.ListAttr", attr: "account.name", showPlaceholder: true},
            {kind: "XV.ListAttr", attr: "address", showPlaceholder: true}
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
    vCardExport: function (inEvent) {
      var imodel = inEvent.model,
          model = imodel,
          begin,
          version,
          name,
          fullName,
          org,
          title,
          phoneWork,
          phoneHome,
          phoneFax,
          address = [],
          addressWork,
          labelWork,
          email,
          website,
          revision,
          end,
          stringToSave;

      if (model.get('lastName')) {
        name = model.get('lastName');
        fullName = model.get('lastName');
      }
      if (model.get('middleName')) {
        name = name + ";" + model.get('middleName');
        fullName = model.get('middleName') + " " + fullName;
      }
      if (model.get('firstName')) {
        name = name + ";" + model.get('firstName');
        fullName = model.get('firstName') + " " + fullName;
      }

      begin = "VCARD";
      version = "3.0";
      org = "";
      title = model.get('jobTitle');
      phoneWork = model.get('phone');
      phoneHome = model.get('alternate');
      phoneFax = model.get('fax');
      if (isNaN(model.getValue('address.line1').charAt(0))) {
        org = model.getValue('address.line1');
        address[0] = model.getValue('address.line2');
      }
      else {
        address[0] = model.getValue('address.line1');
        address.push(model.getValue('address.line2'));
      }
      address.push(model.getValue('address.line3'));
      address.push(model.getValue('address.city'));
      address.push(model.getValue('address.state'));
      address.push(model.getValue('address.postalCode'));
      address.push(model.getValue('address.country'));
      //for address, set address with semicolon delimiters
      //for label, set address with ESCAPED newline delimiters
      if (address[0]) {
        addressWork = address[0] + ";";
        labelWork = address[0] + "\\n";
      }
      for (var i = 1; i < address.length; i++) {
        if (address[i]) {
          addressWork = addressWork + address[i] + ";";
          labelWork = labelWork + address[i] + "\\n";
        }
      }
      email = model.get('primaryEmail');
      website = model.get('webAddress');
      revision = Globalize.format(new Date(), "yyyy-MM-dd");
      end = "VCARD";

      stringToSave = "BEGIN:" + begin + "%0A";
      stringToSave = stringToSave + "VERSION:" + version + "%0A";
      stringToSave = stringToSave + "N:" + name + "%0A";
      stringToSave = stringToSave + "FN:" + fullName + "%0A";
      if (org) {
        stringToSave = stringToSave + "ORG:" + org + "%0A";
      }
      if (title) {
        stringToSave = stringToSave + "TITLE:" + title + "%0A";
      }
      if (phoneWork) {
        stringToSave = stringToSave + "TEL;TYPE=WORK,VOICE:" + phoneWork + "%0A";
      }
      if (phoneHome) {
        stringToSave = stringToSave + "TEL;TYPE=HOME,VOICE:" + phoneHome + "%0A";
      }
      if (phoneFax) {
        stringToSave = stringToSave + "TEL;TYPE=FAX:" + phoneFax + "%0A";
      }
      if (addressWork) {
        stringToSave = stringToSave + "ADR;TYPE=WORK:;;" + addressWork + "%0A";
      }
      if (labelWork) {
        stringToSave = stringToSave + "LABEL;TYPE=WORK:;;" + labelWork + "%0A";
      }
      if (email) {
        stringToSave = stringToSave + "EMAIL;TYPE=PREF,INTERNET:" + email + "%0A";
      }
      if (website) {
        stringToSave = stringToSave + "URL:" + website + "%0A";
      }
      stringToSave = stringToSave + "REV:" + revision + "%0A";
      stringToSave = stringToSave + "END:" + end + "%0A";

      window.open(XT.getOrganizationPath() +
        '/%@?stringToSave=%@'
        .f('vcfExport',
          stringToSave),
        '_newtab');
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

  XV.registerModelList("XM.CostCategory", "XV.CostCategoryList");

  // ..........................................................
  // CREDIT CARD
  //

  enyo.kind({
    name: "XV.CreditCardList",
    kind: "XV.List",
    label: "_creditCards".loc(),
    collection: "XM.CreditCardCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    parameterWidget: "XV.CreditCardListParameters",
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
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "isBase"}
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
    collection: "XM.CustomerListItemCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    multiSelect: true,
    parameterWidget: "XV.CustomerListParameters",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {kind: "XV.ListAttr", attr: "number", isKey: true},
            {kind: "XV.ListAttr", attr: "name"}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {kind: "XV.ListAttr", attr: "billingContact.phone", },
            {kind: "XV.ListAttr", attr: "billingContact.primaryEmail"}
          ]},
          {kind: "XV.ListColumn", classes: "descr", components: [
            {kind: "XV.ListAttr", attr: "billingContact.name",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "billingContact.address"}
          ]},
          {kind: "XV.ListColumn", fit: true, components: [
            {kind: "XV.ListAttr", attr: "customerType.code"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("XM.CustomerRelation", "XV.CustomerList");

  // ..........................................................
  // CUSTOMER EMAIL PROFILE
  //
  enyo.kind({
    name: "XV.CustomerEmailProfileList",
    kind: "XV.EmailProfileList",
    label: "_customerEmailProfiles".loc(),
    collection: "XM.CustomerEmailProfileCollection"
  });

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
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {kind: "XV.ListAttr", attr: "number", isKey: true},
            {kind: "XV.ListAttr", attr: "name"}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {kind: "XV.ListAttr", attr: "contact.phone", },
            {kind: "XV.ListAttr", attr: "contact.primaryEmail"}
          ]},
          {kind: "XV.ListColumn", fit: true, components: [
            {kind: "XV.ListAttr", attr: "contact.name",
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
    parameterWidget: "XV.DepartmentListParameters",
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
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {kind: "XV.ListAttr", attr: "code", isKey: true},
            {kind: "XV.ListAttr", attr: "name"}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {kind: "XV.ListAttr", attr: "contact.phone", },
            {kind: "XV.ListAttr", attr: "contact.primaryEmail"}
          ]},
          {kind: "XV.ListColumn", fit: true, components: [
            {kind: "XV.ListAttr", attr: "contact.name",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "contact.address.formatShort"}
          ]}
        ]}
      ]}
    ]
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
  // FILTER
  //

  enyo.kind({
    name: "XV.FilterList",
    kind: "XV.List",
    label: "_filters".loc(),
    collection: "XM.FilterCollection",
    query: {
      orderBy: [{
        attribute: 'name'
      }]
    },
    events: {
      onListChange: ""
    },
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", fit: true,
            components: [
            {kind: "XV.ListAttr", attr: "name"}
          ]},
          {kind: "XV.ListColumn", classes: "third", components: [
            {kind: "XV.ListAttr", attr: "shared", formatter: "formatShared"}
          ]},
          {kind: "XV.ListColumn",  components: [
            {tag: "i", classes: "icon-remove list-icon", ontap: "removeRow"}
          ]},
          {kind: "XV.ListColumn", components: [
            {tag: "i", classes: "icon-signout list-icon", ontap: "shareRow"}
          ]}
        ]}
      ]}
    ],
    /**
      When the value of the list is changed, bind the add
      and remove events of this collection.
    */
    valueChanged: function () {
      this.inherited(arguments);
      // bind enyo event to add/remove on collection of models
      this.getValue().on("add", this.doListChange(), this);
      this.getValue().on("remove", this.doListChange(), this);
    },
    /**
      Formatting function to show the shared text instead of
      the boolean value.
    */
    formatShared: function (value, view, model) {
      var shared = model && model.get('shared') ? "_shared".loc() : "";
      return shared;
    },
    /**
      Removes the selected row when the "remove" icon is
      selected.
    */
    removeRow: function (inSender, inEvent) {
      var index = inEvent.index,
        value = this.getValue(),
        model = value.models[index],
        that = this;
      inEvent.model = model;
      inEvent.done = function () {
        inEvent.delete = true;
        that.doListChange(inEvent);
      };
      this.deleteItem(inEvent);
    },
    /**
      Sets the shared value of the current model when the
      "shared" icon is selected.
    */
    shareRow: function (inSender, inEvent) {
      var options = {},
        index = inEvent.index,
        that = this,
        model = this.getValue().models[index];
      if (!model.get("shared")) {
        model.set("shared", true);
        options.success = function (model, resp, options) {
          that.reset();
        };
        model.save(null, options);
      }
    }
  });

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
              {kind: "XV.ListAttr", attr: "updated", fit: true,
                formatter: "formatDate",
                classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "description"}
          ]},
          {kind: "XV.ListColumn", classes: "second", components: [
            {kind: "XV.ListAttr", attr: "account.name"},
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
      var date = value ? XT.date.applyTimezoneOffset(value, true) : "",
        isToday = date ? !XT.date.compareDate(date, new Date()) : false;
      view.addRemoveClass("bold", isToday);
      return date ? Globalize.format(date, "d") : "";
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
    kind: "XV.EmailProfileList",
    label: "_incidentEmailProfiles".loc(),
    collection: "XM.IncidentEmailProfileCollection"
  });

  // ..........................................................
  // INVOICE
  //

  enyo.kind({
    name: "XV.InvoiceList",
    kind: "XV.List",
    multiSelect: true,
    label: "_invoices".loc(),
    parameterWidget: "XV.InvoiceListParameters",
    collection: "XM.InvoiceListItemCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    actions: [
      {name: "void", privilege: "VoidPostedInvoices", prerequisite: "canVoid",
        method: "doVoid" },
      {name: "post", privilege: "PostMiscInvoices", prerequisite: "canPost",
        method: "doPost" },
      {name: "print", privilege: "PrintInvoices", method: "doPrint", isViewMethod: true },
      {name: "email", privilege: "PrintInvoices", method: "doEmail", isViewMethod: true},
      {name: "download", privilege: "PrintInvoices", method: "doDownload",
        isViewMethod: true}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
              {kind: "XV.ListAttr", attr: "isPosted", fit: true,
                formatter: "formatPosted", style: "padding-left: 24px"},
              {kind: "XV.ListAttr", name: "dateField", attr: "invoiceDate",
                formatter: "formatInvoiceDate", classes: "right",
                placeholder: "_noDate".loc()}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "customer.name"},
              {kind: "XV.ListAttr", attr: "total", formatter: "formatTotal",
                classes: "right"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", components: [
            {kind: "XV.ListAttr", formatter: "formatName"},
            {kind: "XV.ListAttr", formatter: "formatAddress"}
          ]}
        ]}
      ]}
    ],
    // some extensions may override this function (i.e. inventory)
    formatAddress: function (value, view, model) {
      var city = model.get("billtoCity"),
        state = model.get("billtoState"),
        country = model.get("billtoCountry");
      return XM.Address.formatShort(city, state, country);
    },
    // some extensions may override this function (i.e. inventory)
    formatName: function (value, view, model) {
      return model.get("billtoName");
    },
    formatPosted: function (value) {
      return value ? "_posted".loc() : "_unposted".loc();
    },
    formatInvoiceDate: function (value, view, model) {
      var isLate = model && !model.get("isPosted") &&
        model.get(model.documentDateKey) &&
        (XT.date.compareDate(value, new Date()) < 1);
      view.addRemoveClass("error", isLate);
      return Globalize.format(value, "d");
    },
    formatTotal: function (value, view, model) {
      var currency = model ? model.get("currency") : false,
        scale = XT.locale.moneyScale;
      return currency ? currency.format(value, scale) : "";
    },
  });
  XV.registerModelList("XM.InvoiceRelation", "XV.InvoiceList");

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
            {kind: "XV.ListAttr", attr: "formatItemType", classes: "italic"},
            {kind: "XV.ListAttr", attr: "classCode.code"}
          ]},
          {kind: "XV.ListColumn", classes: "third", components: [
            {kind: "XV.ListAttr", attr: "listPrice", formatter: "formatPrice"},
            {kind: "XV.ListAttr", attr: "isFractional", formatter: "formatFractional"}
          ]},
          {kind: "XV.ListColumn", fit: true, components: [
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
        var scale = XT.locale.salesPriceScale;
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
  // ITEM GROUP
  //

  enyo.kind({
    name: "XV.ItemGroupList",
    kind: "XV.List",
    label: "_itemGroups".loc(),
    collection: "XM.ItemGroupRelationCollection",
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
              {kind: "XV.ListAttr", attr: "item.barcode", fit: true, classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "item.description1"},
              {kind: "XV.ListAttr", attr: "item.aliases", fit: true,
                formatter: "formatAliases", classes: "right"}
            ]}
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
    formatAliases: function (value, view, model) {
      return value.map(function (model) {
        return model.get("aliasNumber");
      }).join();
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
            {kind: "XV.ListAttr", attr: "account.name",
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
        scale = XT.locale.moneyScale;
      return currency ? currency.format(value, scale) : "";
    }
  });

  XV.registerModelList("XM.OpportunityListItem", "XV.OpportunityList");
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
      {attribute: "number" }
    ]},
    parameterWidget: "XV.ProjectListParameters",
    headerComponents: [
      {kind: "FittableColumns", classes: "xv-list-header",
        components: [
        {kind: "XV.ListColumn", classes: "name-column", components: [
          {content: "_name".loc()},
          {content: "_description".loc()},
          {content: "_account".loc()}
        ]},
        {kind: "XV.ListColumn", classes: "right-column", components: [
          {content: "_dueDate".loc()},
          {content: "_priority".loc()},
          {content: "_complete".loc()}
        ]},
        {kind: "XV.ListColumn", classes: "short", components: [
          {content: "_status".loc()},
          {content: "_assignedTo".loc()},
          {content: "_type".loc()}
        ]},
        {kind: "XV.ListColumn", classes: "right-column"},
        {kind: "XV.ListColumn", classes: "right-column", components: [
          {content: "_budgeted".loc()},
          {content: "_actual".loc()},
          {content: "_balance".loc()}
        ]}
      ]}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {kind: "XV.ListAttr", attr: "number", isKey: true},
            {kind: "XV.ListAttr", attr: "name"},
            {kind: "XV.ListAttr", attr: "account.name"}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {kind: "XV.ListAttr", attr: "dueDate"},
            {kind: "XV.ListAttr", attr: "priority.name",
                placeholder: "_noPriority".loc()},
            {kind: "XV.ListAttr", attr: "percentComplete"}
          ]},
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "getProjectStatusString"},
            {kind: "XV.ListAttr", attr: "assignedTo.username",
              placeholder: "_noAssignedTo".loc()},
            {kind: "XV.ListAttr", attr: "projectType.code",
              placeholder: "_noProjectType".loc()},
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {kind: "XV.ListAttr", attr: "budgetedExpenses",
              classes: "text-align-right", formatter: "formatExpenses"},
            {kind: "XV.ListAttr", attr: "actualExpenses",
              classes: "text-align-right", formatter: "formatExpenses"},
            {kind: "XV.ListAttr", attr: "balanceExpenses",
              classes: "text-align-right", formatter: "formatExpenses"}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", fit: true,
            components: [
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
    formatHours: function (value, view, model) {
      view.addRemoveClass("error", value < 0);
      var scale = XT.locale.quantityScale;
      return Globalize.format(value, "n" + scale) + " " + "_hrs".loc();
    },
    formatExpenses: function (value, view, model) {
      view.addRemoveClass("error", value < 0);
      var scale = XT.locale.currencyScale;
      return Globalize.format(value, "c" + scale);
    }

  });

  XV.registerModelList("XM.ProjectListItem", "XV.ProjectList");
  XV.registerModelList("XM.ProjectRelation", "XV.ProjectList");

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
      privilege: "MaintainCustomerMasters",
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
              {kind: "XV.ListAttr", attr: "contact.primaryEmail", classes: "right"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "contact.name",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "contact.address"}
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
    }
  });

  XV.registerModelList("XM.ProspectRelation", "XV.ProspectList");

  // ..........................................................
  // SALES EMAIL PROFILE
  //

  enyo.kind({
    name: "XV.SalesEmailProfileList",
    kind: "XV.EmailProfileList",
    label: "_salesEmailProfiles".loc(),
    collection: "XM.SalesEmailProfileCollection"
  });

  // ..........................................................
  // SALES ORDER
  //

  enyo.kind({
    name: "XV.SalesOrderList",
    kind: "XV.List",
    label: "_salesOrders".loc(),
    collection: "XM.SalesOrderListItemCollection",
    parameterWidget: "XV.SalesOrderListParameters",
    actions: [
      {name: "print", privilege: "ViewSalesOrders", method: "doPrint", isViewMethod: true},
      {name: "email", privilege: "ViewSalesOrders", method: "doEmail", isViewMethod: true}
    ],
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "XV.ListAttr", attr: "number", isKey: true},
              {kind: "XV.ListAttr", attr: "customer.name"}
            ]},
            {kind: "XV.ListColumn", components: [
              {kind: "XV.ListAttr", attr: "formatStatus"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "scheduleDate",
                placeholder: "_noSchedule".loc()},
              {kind: "XV.ListAttr", attr: "total", formatter: "formatTotal"}
            ]},
            {kind: "XV.ListColumn", fit: true, components: [
              {kind: "XV.ListAttr", formatter: "formatName"},
              {kind: "XV.ListAttr", formatter: "formatShiptoOrBillto"}
            ]}
          ]}
        ]}
      ]}
    ],
    formatBillto: function (value, view, model) {
      var city = model.get("billtoCity"),
        state = model.get("billtoState"),
        country = model.get("billtoCountry");
      return XM.Address.formatShort(city, state, country);
    },
    /**
      Returns Shipto Name if one exists, otherwise Billto Name.
    */
    formatName: function (value, view, model) {
      return model.get("shiptoName") || model.get("billtoName");
    },
    formatTotal: function (value, view, model) {
      var currency = model ? model.get("currency") : false,
        scale = XT.locale.moneyScale;
      return currency ? currency.format(value, scale) : "";
    },

    formatShipto: function (value, view, model) {
      var city = model.get("shiptoCity"),
        state = model.get("shiptoState"),
        country = model.get("shiptoCountry");
      return XM.Address.formatShort(city, state, country);
    },
    /**
      Returns formatted Shipto City, State and Country if
      Shipto Name exists, otherwise Billto location.
    */
    formatShiptoOrBillto: function (value, view, model) {
      var hasShipto = model.get("shiptoName") ? true : false,
        cityAttr = hasShipto ? "shiptoCity": "billtoCity",
        stateAttr = hasShipto ? "shiptoState" : "billtoState",
        countryAttr = hasShipto ? "shiptoCountry" : "billtoCountry",
        city = model.get(cityAttr),
        state = model.get(stateAttr),
        country = model.get(countryAttr);
      return XM.Address.formatShort(city, state, country);
    }
  });

  XV.registerModelList("XM.SalesOrderRelation", "XV.SalesOrderList");

  // ..........................................................
  // QUOTE
  //

  enyo.kind({
    name: "XV.QuoteList",
    kind: "XV.SalesOrderList",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    events: {
      onNotify: ""
    },
    actions: [{
      name: "convert",
      method: "convertQuote",
      privilege: "ConvertQuotes",
      isViewMethod: true,
      notify: false
    }],
    label: "_quotes".loc(),
    collection: "XM.QuoteListItemCollection",
    parameterWidget: "XV.QuoteListParameters",
    formatDate: function (value, view, model) {
      var isLate = model && model.get('expireDate') &&
        (XT.date.compareDate(value, new Date()) < 1);
      view.addRemoveClass("error", isLate);
      return value;
    },
    convertQuote: function (inEvent) {
      var model = inEvent.model,
        that = this,
        customer = model.get("customer"),
        K = XM.CustomerProspectRelation,
        attrs,

        // In case we are converting a prospect
        convertToCustomer = function (resp) {
          if (!resp.answer) { return; }

          that.doWorkspace({
            workspace: "XV.CustomerWorkspace",
            attributes: {
              number: customer.get("number"),
              name: customer.get("name")
            },
            success: afterCustomerCreated,
            callback: convertToSalesOrder,
            allowNew: false
          });
        },

        afterCustomerCreated = function () {
          this.getValue().convertFromProspect(customer.id);
        },

        convertToSalesOrder = function () {
          XM.SalesOrder.convertFromQuote(model.id, {
            success: afterQuoteConvertedSuccess
          });
        },

        afterQuoteConvertedSuccess = function (resp) {
          attrs = resp;
          that.doWorkspace({
            workspace: "XV.SalesOrderWorkspace",
            success: afterSalesOrderCreated,
            allowNew: false
          });
        },

        afterSalesOrderCreated = function () {
          var value = this.getValue(),
            gridBox = this.$.salesOrderLineItemBox;

          value.setStatus(XM.Model.BUSY_FETCHING);
          value.set(attrs);
          value.revertStatus();

          //Hack to force grid to refresh. Why doesn't it on its own?
          gridBox.valueChanged();
          gridBox.setDisabled(false);
        };


      // Get the process started one way or another
      if (customer.get("status") === K.PROSPECT_STATUS) {
        this.doNotify({
          type: XM.Model.QUESTION,
          callback: convertToCustomer,
          message: "_convertProspect".loc()
        });
      } else {
        convertToSalesOrder();
      }
    }
  });

  XV.registerModelList("XM.QuoteRelation", "XV.QuoteList");

  // ..........................................................
  // REASON CODE
  //

  enyo.kind({
    name: "XV.ReasonCodeList",
    kind: "XV.List",
    label: "_reasonCodes".loc(),
    collection: "XM.ReasonCodeCollection",
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first",
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
  // RETURN
  //

  enyo.kind({
    name: "XV.ReturnList",
    kind: "XV.InvoiceList",
    label: "_returns".loc(),
    multiSelect: false,
    parameterWidget: "XV.ReturnListParameters",
    collection: "XM.ReturnListItemCollection",
    actions: [
      {name: "void", privilege: "VoidPostedARCreditMemos",
        prerequisite: "canVoid", method: "doVoid" },
      {name: "post", privilege: "PostARDocuments",
        prerequisite: "canPost", method: "doPost" },
      {name: "print", privilege: "PrintCreditMemos",
        method: "doPrint" }
    ],
    create: function () {
      this.inherited(arguments);
      this.$.dateField.setAttr("returnDate");
    }
  });
  XV.registerModelList("XM.ReturnRelation", "XV.ReturnList");

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
    parameterWidget: "XV.ShiftListParameters",
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
  // SHIP VIA
  //

  enyo.kind({
    name: "XV.ShipViaList",
    kind: "XV.List",
    label: "_shipVias".loc(),
    collection: "XM.ShipViaCollection",
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
  XV.registerModelList("XM.ShipVia", "XV.ShipViaList");

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
                placeholder: "_noDueDate".loc(), classes: "right"}
            ]},
            {kind: "XV.ListAttr", attr: "description",
              placeholder: "_noDescription".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "second",
            components: [
            {kind: "XV.ListAttr", attr: "account.name",
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
    ]
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

  XV.registerModelList("XM.UserAccountRelation", "XV.UserAccountList");

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
  // VENDOR
  //

  enyo.kind({
    name: "XV.VendorList",
    kind: "XV.List",
    label: "_vendors".loc(),
    collection: "XM.VendorListItemCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    parameterWidget: "XV.VendorListParameters",
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
              {kind: "XV.ListAttr", attr: "primaryContact.primaryEmail", classes: "right"}
            ]}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "primaryContact.name",
              placeholder: "_noContact".loc()},
            {kind: "XV.ListAttr", attr: "address"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.VendorRelation", "XV.VendorList");

  // ..........................................................
  // VENDOR ADDRESS
  //

  enyo.kind({
    name: "XV.VendorAddressList",
    kind: "XV.List",
    collection: "XM.VendorAddressRelationCollection",
    parameterWidget: "XV.VendorAddressParameters",
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
          {kind: "XV.ListColumn", fit: true, components: [
            {kind: "XV.ListAttr", attr: "name"},
            {kind: "XV.ListAttr", formatter: "formatAddress",
              classes: "xv-addresslist-attr", allowHtml: true}
          ]}
        ]}
      ]}
    ],
    formatAddress: function (value, view, model) {
      var address = model.get("address");
      return address.format(true);
    }
  });

  XV.registerModelList("XM.VendarAddressRelation", "XV.VendorAddressList");

  enyo.kind({
    name: "XV.NameList",
    kind: "XV.List",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first",
            components: [
            {kind: "XV.ListAttr", attr: "name", isKey: true}
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
      var kindName = this.kind.substring(0, this.kind.length - 4).substring(3);
      if (!this.getLabel()) {
        this.setLabel(this.determineLabel(kindName));
      }
      if (!this.getCollection()) {
        this.setCollection("XM." + kindName + "Collection");
      }
      this.inherited(arguments);
    },

    determineLabel: function (kindName) {
      return ("_" + kindName.camelize().pluralize()).loc();
    }
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
    kind: "XV.NameList",
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
    collection: "XM.UserAccountRoleListItemCollection"
  });

  enyo.kind({
    name: "XV.CharacteristicList",
    kind: "XV.NameList",
    collection: "XM.CharacteristicCollection"
  });
}());
