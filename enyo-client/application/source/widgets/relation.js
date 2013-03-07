/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
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
    collection: "XM.ContactRelationCollection",
    list: "XV.ContactList",
    keyAttribute: "name",
    nameAttribute: "jobTitle",
    descripAttribute: "phone",
    published: {
      showAddress: false,
      account: null
    },
    filterRestrictionType: ["account", "accountParent"],
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label"},
        {kind: "onyx.InputDecorator", name: "decorator",
          classes: "xv-input-decorator", components: [
          {name: 'input', kind: "onyx.Input", classes: "xv-subinput",
            onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur",
            onfocus: "receiveFocus"
          },
          {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
            {kind: "onyx.IconButton", src: "/client/lib/enyo-x/assets/triangle-down-large.png",
              classes: "xv-relationwidget-icon"},
            {name: 'popupMenu', floating: true, kind: "onyx.Menu",
              components: [
              {kind: "XV.MenuItem", name: 'searchItem', content: "_search".loc()},
              {kind: "XV.MenuItem", name: 'openItem', content: "_open".loc(),
                disabled: true},
              {kind: "XV.MenuItem", name: 'newItem', content: "_new".loc(),
                disabled: true}
            ]}
          ]},
          {name: "completer", kind: "XV.Completer", onSelect: "itemSelected"}
        ]}
      ]},
      {kind: "FittableColumns", components: [
        {name: "labels", classes: "xv-relationwidget-column left",
          components: [
          {name: "jobTitleLabel", content: "_jobTitle".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "phoneLabel", content: "_phone".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "alternateLabel", content: "_alternate".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "faxLabel", content: "_fax".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "primaryEmailLabel", content: "_email".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "webAddressLabel", content: "_web".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "addressLabel", content: "_address".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false}
        ]},
        {name: "data", fit: true, components: [
          {name: "name", classes: "xv-relationwidget-description hasLabel"},
          {name: "description", classes: "xv-relationwidget-description hasLabel"},
          {name: "alternate", classes: "xv-relationwidget-description hasLabel"},
          {name: "fax", classes: "xv-relationwidget-description hasLabel"},
          {name: "primaryEmail", ontap: "sendMail",
            classes: "xv-relationwidget-description hasLabel hyperlink"},
          {name: "webAddress", ontap: "openWindow",
            classes: "xv-relationwidget-description hasLabel hyperlink"},
          {name: "address", classes: "xv-relationwidget-description hasLabel",
            allowHtml: true}
        ]}
      ]}
    ],
    disabledChanged: function () {
      this.inherited(arguments);
      var disabled = this.getDisabled();
      if (this.$.phone) {
        this.$.jobTitle.addRemoveClass("disabled", disabled);
        this.$.phone.addRemoveClass("disabled", disabled);
        this.$.alternate.addRemoveClass("disabled", disabled);
        this.$.fax.addRemoveClass("disabled", disabled);
        this.$.primaryEmail.addRemoveClass("disabled", disabled);
        this.$.webAddress.addRemoveClass("disabled", disabled);
      }
    },
    setValue: function (value, options) {
      this.inherited(arguments);
      if (value && !value.get) {
        // the value of the widget is still being fetched asyncronously.
        // when the value is fetched, this function will be run again,
        // so for now we can just stop here.
        return;
      }
      var jobTitle = value ? value.get('jobTitle') : "",
        phone = value ? value.get('phone') : "",
        alternate = value ? value.get('alternate') : "",
        fax = value ? value.get('fax') : "",
        primaryEmail = value ? value.get('primaryEmail') : "",
        webAddress = value ? value.get('webAddress') : "",
        address = value ? XM.Address.format(value.get('address')) : "",
        showAddress = this.getShowAddress();
      this.$.jobTitleLabel.setShowing(jobTitle);
      this.$.phoneLabel.setShowing(phone);
      this.$.alternate.setShowing(alternate);
      this.$.alternate.setContent(alternate);
      this.$.alternateLabel.setShowing(alternate);
      this.$.fax.setShowing(fax);
      this.$.fax.setContent(fax);
      this.$.faxLabel.setShowing(fax);
      this.$.primaryEmail.setShowing(primaryEmail);
      this.$.primaryEmail.setContent(primaryEmail);
      this.$.primaryEmailLabel.setShowing(primaryEmail);
      this.$.webAddress.setShowing(webAddress);
      this.$.webAddress.setContent(webAddress);
      this.$.webAddressLabel.setShowing(webAddress);
      this.$.address.setShowing(address && showAddress);
      this.$.addressLabel.setShowing(address && showAddress);
      if (showAddress) { this.$.address.setContent(address); }
    },
    openWindow: function () {
      var address = this.value ? this.value.get('webAddress') : null;
      if (address) { window.open('http://' + address); }
      return true;
    },
    sendMail: function () {
      var email = this.value ? this.value.get('primaryEmail') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
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
          {kind: "onyx.Button", content: "_customer".loc(), ontap: "newCustomer",
            classes: "onyx-blue xv-popup-button"},
          {kind: "onyx.Button", content: "_prospect".loc(), ontap: "newProspect",
            classes: "onyx-blue xv-popup-button"}
        ]
      });
      this.$.newItem.setDisabled(false);
      return ret;
    },
    newCustomer: function () {
      this.$.customerOrProspectPopup.hide();
      this.doWorkspace({
        workspace: "XV.CustomerWorkspace",
        allowNew: false
      });
    },
    newProspect: function () {
      this.$.customerOrProspectPopup.hide();
      this.doWorkspace({
        workspace: "XV.ProspectWorkspace",
        allowNew: false
      });
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
        id = model ? model.id : null,
        workspace = this._List ? this._List.prototype.getWorkspace() : null,
        callback;
      switch (menuItem.name)
      {
      case 'searchItem':
        callback = function (value) {
          that.setValue(value);
        };
        this.doSearch({
          list: list,
          searchText: this.$.input.getValue(),
          callback: callback
        });
        break;
      case 'openItem':
        this.doWorkspace({
          workspace: workspace,
          id: id,
          allowNew: false
        });
        break;
      case 'newItem':
        this.$.customerOrProspectPopup.show();
      }
    }
  });

  // ..........................................................
  // CUSTOMER SHIPTO
  //

  enyo.kind({
    name: "XV.CustomerShiptoWidget",
    kind: "XV.RelationWidget",
    collection: "XM.CustomerShiptoRelationCollection",
    list: "XV.CustomerShiptoList",
    filterRestrictionType: ["customer"]
  });


  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.EmployeeWidget",
    kind: "XV.RelationWidget",
    collection: "XM.EmployeeRelationCollection",
    list: "XV.EmployeeList"
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
  // ITEM SITE
  //

  enyo.kind({
    name: "XV.ItemSiteWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ItemSiteRelationCollection",
    list: "XV.ItemSiteList",
    published: {
      customer: null,
      shipto: null
    },
    keyAttribute: "item.number",
    nameAttribute: "item.number",
    descripAttribute: "site.code",
    handlers: {
      onValueChange: "theValueChanged"
    },
    /**
      Add a site picker to the bottom of the component array
    */
    create: function () {
      this.inherited(arguments);
      this.createComponent(
        {
          kind: "XV.SitePicker",
          name: "sitePicker",
          label: "_site".loc(),
          showing: false,
          /**
            The ItemSite widget might want to restrict the list to a specific
            set of site IDs, as specified in the options object
           */
          filter: function (models, options) {
            var siteIds = options && options.siteIds,
              matches = _.filter(this._collection.models, function (model) {
                return !siteIds || _.indexOf(siteIds, model.getValue("id")) >= 0;
              });

            return matches || [];
          }
        }
      );
    },
    shiptoChanged: function (inSender, inEvent) {
      if (this.getShipto()) {
        var extraSearchOptions = this.getExtraSearchOptions() || {};
        extraSearchOptions.shipto = this.getShipto().id;
        this.setExtraSearchOptions(extraSearchOptions);
      }
    },
    customerChanged: function (inSender, inEvent) {
      if (this.getCustomer()) {
        var extraSearchOptions = this.getExtraSearchOptions() || {};
        extraSearchOptions.customer = this.getCustomer().id;
        this.setExtraSearchOptions(extraSearchOptions);
      }
    },
    /**
      This is going to have to be a dispatch function, due to the
      complexity of customer-specific items
     */
    fetchCollection: function (value, rowLimit, callbackName) {
      var customerId = this.getCustomer() && this.getCustomer().id,
        shiptoId = this.getShipto() && this.getShipto().id,
        options = {
          success: enyo.bind(this, callbackName)
        },
        key = this.getKeyAttribute(),
        parameters = [{
          attribute: key,
          operator: "BEGINS_WITH",
          value: value
        }],
        query = {
          parameters: parameters,
          rowLimit: rowLimit,
          orderBy: [{
            attribute: key
          }]
        };

      XM.ItemSite.dispatchForCollection(query, customerId, shiptoId, options);
    },
    /**
      We only want the picker to show Site models with an ItemSite Item that
      was just picked.
     */
    setValue: function (value, options) {
      this.inherited(arguments);

      if (!this._collection || this._collection.length === 0) {
        // we're not ready to filter down the site picker
        return;
      }
      var itemId = this.getValue().getValue("item.id"),
        // matches are an array of ItemSite models, whose Item was just picked
        matches = _.filter(this._collection.models, function (model) {
          return model.getValue("item.id") === itemId;
        }),
        siteIds = _.map(matches, function (model) {
          return model.getValue("site.id");
        });

      this.$.sitePicker.setShowing(true);
      this.$.sitePicker.buildList({siteIds: siteIds});
      this.$.sitePicker.setValue(this.getValue().getValue("site"), {silent: true});
    },
    theValueChanged: function (inSender, inEvent) {
      var itemId,
        siteId,
        itemSite;
      console.log("The value changed", inEvent);
      if (inEvent.originator.name === 'sitePicker') {
        // the site picker has changed. Update the item site value, but do not propagate this.

        // the user has just selected a specific site based on the ones available for that item
        // use the itemsite with the item we are on, plus the site that was chosen
        itemId = this.getValue().getValue("item.id");
        siteId = inEvent.originator.getValue().id;
        itemSiteModel = _.find(this._collection.models, function (model) {
          return model.getValue("item.id") === itemId && model.getValue("site.id") === siteId;
        });
        if (itemSiteModel) {
          console.log("picked itemsite model is", itemSiteModel.toJSON());
          this.setValue(itemSiteModel);
        } else {
          // Why is this._collection already filtered?
          console.log("this shouldn't happen");
        }
        return true;
      }
    },
    /**
      Because we fetch with a dispatch the collection doesn't get refreshed by default. Do that.
    */
    _collectionFetchSuccess: function (data) {
      this._collection.reset(data);
      this.inherited(arguments);
    },
    /**
      Because we fetch with a dispatch the collection doesn't get refreshed by default. Do that.
    */
    _fetchSuccess: function (data) {
      this._collection.reset(data);
      this.inherited(arguments);
    }
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityWidget",
    kind: "XV.RelationWidget",
    collection: "XM.OpportunityRelationCollection",
    list: "XV.OpportunityList"
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ProjectRelationCollection",
    list: "XV.ProjectList"
  });

  // ..........................................................
  // USER ACCOUNT
  //

  enyo.kind({
    name: "XV.UserAccountWidget",
    kind: "XV.RelationWidget",
    collection: "XM.UserAccountRelationCollection",
    list: "XV.UserAccountList",
    keyAttribute: "username",
    nameAttribute: "properName"
  });

}());
