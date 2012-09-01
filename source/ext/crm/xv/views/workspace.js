/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  var extensions;
 
  // ..........................................................
  // INCIDENT
  //
  
  enyo.kind({
    name: "XV.AccountIncidentsPanel",
    kind: "XV.Groupbox",
    title: "_incidents".loc(),
    classes: "panel",
    published: {
      attr: null,
      value: null
    },
    events: {
      onSearch: "",
      onWorkspace: ""
    },
    handlers: {
      onSelect: "selectionChanged",
      onDeselect: "selectionChanged"
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_contacts".loc()},
      {kind: "XV.AccountContactListRelations", name: "list",
        attr: "contactRelations", fit: true},
      {kind: 'FittableColumns', classes: "xv-groupbox-buttons", components: [
        {kind: "onyx.Button", name: "newButton", onclick: "newContact",
          content: "_new".loc(), classes: "xv-groupbox-button-left",
          disabled: true},
        {kind: "onyx.Button", name: "attachButton", onclick: "attachContact",
          content: "_attach".loc(), classes: "xv-groupbox-button-center",
          disabled: true},
        {kind: "onyx.Button", name: "detachButton", onclick: "detachContact",
          content: "_detach".loc(), classes: "xv-groupbox-button-center",
          disabled: true},
        {kind: "onyx.Button", name: "openButton", onclick: "openContact",
          content: "_open".loc(), classes: "xv-groupbox-button-right",
          disabled: true, fit: true}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this.$.newButton.setDisabled(!XM.Contact.canCreate());
      this.$.attachButton.setDisabled(!XM.Contact.canUpdate());
    },
    attachContact: function () {
      var list = this.$.list,
        accountId = list.getParent().id,

        // Callback to handle selection...
        callback = function (contactInfo) {

          // Instantiate the models involved
          var contact = new XM.Contact({id: contactInfo.id}),
            contactAccountInfo = new XM.ContactAccountInfo({id: accountId}),
            setAndSave = function () {
              var K = XM.Model,
                options = {};
              if (contact.getStatus() === K.READY_CLEAN &&
                  contactAccountInfo.getStatus() === K.READY_CLEAN) {
                contact.off('statusChange', setAndSave);
                contactAccountInfo.off('statusChange', setAndSave);

                // Callback to update our list with changes when save complete
                options.success = function () {
                  list._collection.add(contactInfo);
                  list.setCount(list._collection.length);
                  list.refresh();
                };

                // Set and save our contact with the new account relation
                contact.set('account', contactAccountInfo);
                contact.save(null, options);
              }
            };

          // When fetch complete, trigger set and save
          contact.on('statusChange', setAndSave);
          contactAccountInfo.on('statusChange', setAndSave);

          // Go get the data
          contact.fetch();
          contactAccountInfo.fetch();
        };

      this.doSearch({list: "XV.ContactList", callback: callback});
    },
    attrChanged: function () {
      this.$.list.setAttr(this.attr);
    },
    detachContact: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        contactInfo = list.getModel(index),
        contact = new XM.Contact({id: contactInfo.id}),
        setAndSave = function () {
          var K = XM.Model,
            options = {};
          if (contact.getStatus() === K.READY_CLEAN) {
            contact.off('statusChange', setAndSave);

            // Callback to update our list with changes when save complete
            options.success = function () {
              list._collection.remove(contactInfo);
              list.setCount(list._collection.length);
              list.refresh();
            };

            // Set and save our contact without account relation
            contact.set('account', null);
            contact.save(null, options);
          }
        };

      // When fetch complete, trigger set and save
      contact.on('statusChange', setAndSave);

      // Go get the data
      contact.fetch();
    },
    newContact: function () {
      var list = this.$.list,
        account = this.$.list.getParent(),
        id = account ? account.id : null,
        attributes = {account: id},
        callback = function (model) {
          var Model = list._collection.model,
            value = new Model({id: model.id}),
            options = {};
          options.success = function () {
            list._collection.add(value);
            list.setCount(list._collection.length);
            list.refresh();
          };
          value.fetch(options);
        },
        inEvent = {
          originator: this,
          workspace: "XV.ContactWorkspace",
          attributes: attributes,
          callback: callback
        };
      this.doWorkspace(inEvent);
    },
    openContact: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index),
        id = model.id,
        callback = function () {
          var options = {};
          options.success = function () {
            list.refresh();
          };
          // Refresh
          model.fetch(options);
        },
        inEvent = {
          workspace: "XV.ContactWorkspace",
          id: id,
          callback: callback
        };

      this.doWorkspace(inEvent);
    },
    selectionChanged: function (inSender, inEvent) {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null,
        couldNotRead = model ? !model.couldRead() : true,
        couldNotUpdate = model ? !model.couldUpdate() : true;
      this.$.detachButton.setDisabled(couldNotUpdate);
      this.$.openButton.setDisabled(couldNotRead);
    },
    valueChanged: function () {
      this.$.list.setValue(this.value);
    }
  });

  // ..........................................................
  // INCIDENT
  //

  extensions = [
    {kind: "XV.ProjectWidget", container: "mainGroup", attr: "project"}
  ];

  XV.appendExtension("XV.IncidentWorkspace", extensions);

  // ..........................................................
  // TO DO
  //

  extensions = [
    {kind: "XV.IncidentWidget", container: "mainGroup", attr: "incident"},
    {kind: "XV.OpportunityWidget", container: "mainGroup", attr: "opportunity"}
  ];

  XV.appendExtension("XV.ToDoWorkspace", extensions);

}());
