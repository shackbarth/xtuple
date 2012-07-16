/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, 
trailing:true white:true*/
/*global XT:true, XM:true, enyo:true, Globalize:true*/

(function () {
  
  // ..........................................................
  // BASE CLASSES
  //
  
  enyo.kind({
    name: "XV.InfoList",
    kind: "Panels",
    classes: "xt-info-list",
    draggable: false,
    components: [
      { name: "loader", classes: "xt-info-list-loader", content: "Loading content..." },
      { name: "error", classes: "xt-info-list-error", content: "There was an error" },
      { name: "list", kind: "XV.InfoListPrivate" }
    ],
    published: {
      collection: null,
      rowClass: "",
      query: null
    },
    collectionChanged: function () {
      var col = this.getCollection(),
        Klass;
    
      // Change string to an object if necessary
      if (typeof col === 'string') {
        Klass = XT.getObjectByName(col);
        col = this.collection = new Klass();
      }
    
      if (!col) {
        this.setIndex(1);
        return;
      }
    
      // bind the change event to our handler
      col.bind("change", enyo.bind(this, "_collectionChanged", col));
    },
    _collectionChanged: function (collection) {
      this.log();
    },
    _collectionFetchSuccess: function () {
      this.log();
      this.waterfall("onCollectionUpdated");
    },
    _collectionFetchError: function () {
      this.log();
    },
    create: function () {
      this.inherited(arguments);
      this.rowClassChanged();
      this.collectionChanged();
    },
    rowClassChanged: function () {
      // need to pass down some information to the list
      this.$.list.setRowClass(this.getRowClass());
    },
    showingChanged: function () {
      this.inherited(arguments);
      this.log(this.name, this.showing, this);
    },
    fetch: function () {
      var col = this.getCollection(),
       query = this.getQuery();
    
      // attempt to fetch (if not already fetched) and handle the
      // various states appropriately
      col.fetch({
        success: enyo.bind(this, "_collectionFetchSuccess"),
        error: enyo.bind(this, "_collectionFetchError"),
        query: query
      });
    }
  });

  enyo.kind({
    name: "XV.InfoListPrivate",
    kind: "List",
    classes: "xt-info-list-private",
    published: {
      rowClass: ""
    },
    handlers: {
      onSetupItem: "setupRow",
      onCollectionUpdated: "collectionUpdated"
    },
    collectionUpdated: function () {
      var col = this.parent.getCollection();
    
      // take the properties as necessary...
      this.setCount(col.length);
      this.reset();
    
      // if we updated, let the parent know we want to be
      // visible now
      this.parent.setIndex(2);
    },
    rowClassChanged: function () {
      //this.log(this.owner.name);
    
      var rowClass = this.getRowClass();
      var component;
      var item;
        
      if (rowClass) {
        if (XT.getObjectByName(rowClass)) {
        
          component = {
            name: "item",
            kind: rowClass
          };
        
          item = this.$.item;
          if (item) {
            this.removeComponent(item);
            item.destroy();
          }
        
          this.createComponent(component);
        }
      }
    },
    setupRow: function (inSender, inEvent) {
      //this.log(this.owner.name, this.owner.showing, this);
    
      var col = this.parent.getCollection();
      var row = this.$.item;
      var idx = inEvent.index;
      var mod = col.models[idx];
            
      // as the rows need to be rendered, we proxy the data to their
      // render function if they have it, otherwise, we skip
      if (row && row.renderModel) {
        row.renderModel(mod);
      }
    }
  
  });
  
  enyo.kind({
    name: "XV.InfoListRow",
    classes: "xt-info-list-row",
    published: {
      leftColumn: [],
      rightColumn: []
    },
    events: {
      onInfoListRowTapped: ""
    },
    create: function () {
      this.inherited(arguments);

      var lcs = this.getLeftColumn();
      var rcs = this.getRightColumn();
      var lc;
      var rc;

      lc = this.createComponent({
        name: "leftColumn",
        kind: "XV.InfoListRowColumn",
        structure: lcs
      });

      rc = this.createComponent({
        name: "rightColumn",
        kind: "XV.InfoListRowColumn",
        structure: rcs
      });
    },
    renderModel: function (model) {
      // TEMPORARY IMPLEMENTATION

      //this.log(model);

      var $ = this.$;
      var elem;
      var idx;
      var view;
      var parts;
      var curr;
      var formatter;

      for (elem in $) {
        if ($.hasOwnProperty(elem)) {
          view = $[elem];
          if (view.isLabel) {
            continue;
          }
          if (elem.indexOf('.') > -1) {
            parts = elem.split('.');
            idx = 0;
            curr = model;
            for (; idx < parts.length; ++idx) {
              curr = curr.getValue(parts[idx]);
              if (curr && curr instanceof Date) {
                break;
              } else if (curr && typeof curr === "object") {

              } else if (typeof curr === "string") {
                break;
              } else {
                curr = "";
                break;
              }
            }
            view.setContent(curr);
          } else {
            curr = model.getValue(elem);
          }
          if (view.formatter) {
            formatter = this[view.formatter];
                    
            if (formatter && formatter instanceof Function) {
              curr = formatter(curr, model, view);
            }
          }
          if (curr && curr instanceof Date) {
            curr = Globalize.format(curr, 'd');
          }
          view.setContent(curr || view.placeholder || "");
          if (curr) {
            view.removeClass("empty");
          } else {
            view.addClass("empty");
          }
        }
      }
    },
    tap: function (inSender, inEvent) {
      this.doInfoListRowTapped(inEvent);
    }

  });

  enyo.kind({
    name: "XV.InfoListRowColumn",
    classes: "xt-info-list-row-column",
    published: {
      structure: null
    },
    create: function () {
      this.inherited(arguments);

      var str = this.getStructure();
      var idx = 0;
      var elem;
      var curr = this;
      var ccfa = enyo.bind(this, "createComponentFromArray", this.owner);
      var ccfo = enyo.bind(this, "createComponentFromObject", this.owner);

      for (; idx < str.length; ++idx) {
        elem = str[idx];
        if (elem instanceof Array) {
          curr = ccfa(curr, elem);
        } else if (typeof elem === "object") {
          ccfo(curr, elem);
        }
      }
    },
    createComponentFromArray: function (inOwner, inComponent, inElement) {
      var curr = inComponent;
      var elems = inElement;

      //console.log("found array", inComponent, inElement);


      // TODO: this could be handled in much better ways...
      var width = elems.shift().width;

      var idx = 0;
      var elem;
      var ret;

      if (curr.kind !== "InfoListBasicColumn") {

        //console.log("creating new basic column");

        ret = curr;

        curr = curr.createComponent({
          kind: "XV.InfoListBasicColumn",
          style: "width:" + width + "px;"
        });
      }

      //console.log("begin");

      for (; idx < elems.length; ++idx) {

        //console.log(elems[idx]);

        elem = elems[idx];
        if (elem instanceof Array) {
          curr = this.createComponentFromArray(inOwner, curr, elem, elems.length);
        } else if (typeof elem === "object") {
          this.createComponentFromObject(inOwner, curr, elem);
        }
      }

      //console.log("end");

      return ret;
    },
    createComponentFromObject: function (inOwner, inComponent, inElement) {
      var curr = inComponent;
      var elem = inElement;

      //console.log("CREATECOMPONENTFROMOBJECT", elem);

      curr = curr.createComponent({
        kind: "XV.InfoListBasicCell"
      }, elem);

      if (!inOwner.$[elem.name]) {
        inOwner.$[elem.name] = curr;
      }
    }
  });

  enyo.kind({
    name: "XV.InfoListBasicRow",
    classes: "xt-info-list-basic-row"
  });

  enyo.kind({
    name: "XV.InfoListBasicColumn",
    classes: "xt-info-list-basic-column"
  });

  enyo.kind({
    name: "XV.InfoListBasicCell",
    classes: "xt-info-list-basic-cell"
  });
  
  // ..........................................................
  // ACCOUNT
  //
  
  enyo.kind({
    name: "XV.AccountInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_accounts".loc(),
      collection: "XM.AccountInfoCollection",
      query: {orderBy: 'number'},
      rowClass: "XV.AccountInfoCollectionRow"
    }
  });

  enyo.kind({
    name: "XV.AccountInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "number", classes: "cell-key account-number" },
        { name: "name", classes: "account-name", placeholder: "_noJobTitle".loc() }
      ],
      [
        { width: 160 },
        { name: "primaryContact.phone",
            classes: "cell-align-right account-primaryContact-phone" },
        { name: "primaryContact.primaryEmail",
            classes: "cell-align-right account-primaryContact-primaryEmail" }
      ]
    ],
    rightColumn: [
      [
        { width: 320 },
        { name: "primaryContact.name",
            classes: "cell-italic account-primaryContact-name",
            placeholder: "_noContact".loc() },
        { name: "primaryContact.address.formatShort",
            classes: "account-primaryContact-address" }
      ]
    ]
  });
  
  // ..........................................................
  // CONTACT
  //
  
  enyo.kind({
    name: "XV.ContactInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_contacts".loc(),
      collection: "XM.ContactInfoCollection",
      query: {orderBy: 'lastName, firstName'},
      rowClass: "XV.ContactInfoCollectionRow"
    }
  });

  enyo.kind({
    name: "XV.ContactInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "name", classes: "cell-key contact-name" },
        { name: "jobTitle", classes: "contact-job-title",
            placeholder: "_noJobTitle".loc() }
      ],
      [
        { width: 160 },
        { name: "phone", classes: "cell-align-right contact-phone" },
        { name: "primaryEmail", classes: "cell-align-right contact-email" }
      ]
    ],
    rightColumn: [
      [
        { width: 320 },
        { name: "account.name", classes: "cell-italic contact-account-name",
            placeholder: "_noAccountName".loc() },
        { name: "address.formatShort", classes: "contact-account-name" }
      ]
    ]
  });
  
  // ..........................................................
  // INCIDENT
  //
  
  enyo.kind({
    name: "XV.IncidentInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_incidents".loc(),
      collection: "XM.IncidentInfoCollection",
      rowClass: "XV.IncidentInfoCollectionRow"
    }
  });

  enyo.kind({
    name: "XV.IncidentInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 245 },
        { name: "number", classes: "cell-key incident-number" },
        { name: "description", classes: "cell incident-description" }
      ],
      [
        { width: 75 },
        { name: "updated", classes: "cell-align-right incident-updated",
           formatter: "formatDate" }
      ]
    ],
    rightColumn: [
      [
        { width: 165 },
        { name: "account.name", classes: "cell-italic incident-account-name" },
        { name: "contact.getName", classes: "incident-contact-name" }
      ],
      [
        { width: 75 },
        { name: "getIncidentStatusString", classes: "incident-status" },
        { name: "owner.username", classes: "incident-owner-username" }
      ],
      [
        { width: 75 },
        { name: "priority.name", classes: "incident-priority",
           placeholder: "_noPriority".loc() },
        { name: "category.name", classes: "incident-category",
           placeholder: "_noCategory".loc() }
      ]
    ],
    formatDate: function (content, model, view) {
      var today = new Date();
      if (XT.date.compareDate(content, today)) {
        view.removeClass("bold");
      } else {
        view.addClass("bold");
      }
      return content;
    }
  });
  
  // ..........................................................
  // OPPORTUNITY
  //
  
  enyo.kind({
    name: "XV.OpportunityInfoList",
    kind: "XV.InfoList",
    published: {
      collection: "XM.OpportunityInfoCollection",
      label: "_opportunities".loc(),
      rowClass: "XV.OpportunityInfoCollectionRow"
    }
  });

  enyo.kind({
    name: "XV.OpportunityInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 200 },
        { name: "number", classes: "cell-key opportunity-number" },
        { name: "name", classes: "opportunity-description" }
      ],
      [
        { width: 120 },
        { name: "targetClose", classes: "cell-align-right",
            formatter: "formatTargetClose",
            placeholder: "_noCloseTarget".loc() }
      ]
    ],
    rightColumn: [
      [
        { width: 165 },
        { name: "account.name", classes: "cell-italic opportunity-account-name" },
        { name: "contact.getName", classes: "opportunity-contact-name",
           placeholder: "_noContact".loc() }
      ],
      [
        { width: 75 },
        { name: "opportunityStage.name", classes: "opportunity-opportunityStage-name",
            placeholder: "_noStage".loc() },
        { name: "owner.username", classes: "opportunity-owner-username" }
      ],
      [
        { width: 75 },
        { name: "priority.name", classes: "opportunity-priority-name",
            placeholder: "_noPriority".loc() },
        { name: "opportunityType.name", classes: "opportunity-opportunityType-name",
            placeholder: "_noType".loc() }
      ]
    ],
    formatTargetClose: function (content, model, view) {
      var today = new Date();
      if (model.get('isActive') &&
          content && XT.date.compareDate(content, today) < 1) {
        view.addClass("error");
      } else {
        view.removeClass("error");
      }
      return content;
    }
  });
  
  // ..........................................................
  // PROJECT
  //
  
  enyo.kind({
    name: "XV.ProjectInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_projects".loc(),
      collection: "XM.ProjectInfoCollection",
      query: {orderBy: 'number'},
      rowClass: "XV.ProjectInfoCollectionRow"
    }
  });

  enyo.kind({
    name: "XV.ProjectInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 200 },
        { name: "number", classes: "cell-key project-number" },
        { name: "name", classes: "project-name" },
        { name: "account.name", classes: "project-account-name" }
      ],
      [
        { width: 120 },
        { name: "dueDate", classes: "cell-align-right project-due-date",
            formatter: "formatDueDate" }
      ]
    ],
    rightColumn: [
      [
        { width: 70 },
        { name: "getProjectStatusString", classes: "project-status" },
        { name: "owner.username", classes: "project-owner-username" }
      ],
      [
        { width: 70 },
        { content: "budgeted:", style: "text-align: right;", isLabel: true },
        { content: "actual:", style: "text-align: right;", isLabel: true },
        { content: "balance:", style: "text-align: right;", isLabel: true }
      ],
      [
        { width: 80 },
        { name: "budgetedExpenses",
            classes: "cell-align-right project-budgeted-expenses",
            formatter: "formatExpenses" },
        { name: "actualExpenses",
            classes: "cell-align-right project-actual-expenses",
            formatter: "formatExpenses" },
        { name: "balanceExpenses",
            classes: "cell-align-right project-balance-expenses",
            formatter: "formatExpenses" }
      ],
      [
        { width: 80 },
        { name: "budgetedHours",
            classes: "cell-align-right project-budgeted-hours",
            formatter: "formatHours" },
        { name: "actualHours",
            classes: "cell-align-right project-actual-hours",
            formatter: "formatHours" },
        { name: "balanceHours",
            classes: "cell-align-right project-balance-hours",
            formatter: "formatHours" }
      ]
    ],
    formatDueDate: function (content, model, view) {
      var today = new Date(),
        K = XM.Project;
      if (model.get('status') !== K.COMPLETED &&
          XT.date.compareDate(content, today) < 1) {
        view.addClass("error");
      } else {
        view.removeClass("error");
      }
      return content;
    },
    formatHours: function (content, model, view) {
      return Globalize.format(content, "n" + 2) + " " + "_hrs".loc();
    },
    formatExpenses: function (content, model, view) {
      return Globalize.format(content, "c" + XT.MONEY_SCALE);
    }
  });
  
  // ..........................................................
  // TO DO
  //
  
  enyo.kind({
    name: "XV.ToDoInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_toDos".loc(),
      collection: "XM.ToDoInfoCollection",
      rowClass: "XV.ToDoInfoCollectionRow"
    }
  });

  enyo.kind({
    name: "XV.ToDoInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 245 },
        { name: "name", classes: "cell-key toDo-name" },
        { name: "description", classes: "cell toDo-description" }
      ],
      [
        { width: 75 },
        { name: "dueDate", classes: "cell-align-right toDo-dueDate",
            formatter: "formatDueDate" }
      ]
    ],
    rightColumn: [
      [
        { width: 165 },
        { name: "account.name", classes: "cell-italic toDo-account-name",
            placeholder: "_noAccountName".loc() },
        { name: "contact.getName", classes: "toDo-contact-name" }
      ],
      [
        { width: 75 },
        { name: "getToDoStatusString", classes: "toDo-status" },
        { name: "assignedTo.username", classes: "toDo-assignedTo-username" }
      ],
      [
        { width: 75 },
        { name: "priority.name", classes: "toDo-priority",
            placeholder: "_noPriority".loc() }
      ]
    ],
    formatDueDate: function (content, model, view) {
      var today = new Date(),
        K = XM.ToDo;
      if (model.get('status') !== K.COMPLETED &&
          XT.date.compareDate(content, today) < 1) {
        view.addClass("error");
      } else {
        view.removeClass("error");
      }
      return content;
    }
  });
  
  // ..........................................................
  // USER ACCOUNT
  //
  
  enyo.kind({
    name: "XV.UserAccountInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_userAccounts".loc(),
      collection: "XM.UserAccountInfoCollection",
      query: {orderBy: 'username'},
      rowClass: "XV.UserAccountInfoCollectionRow"
    }
  });

  enyo.kind({
    name: "XV.UserAccountInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "username", classes: "cell-key user-account-username" }
      ],
      [
        { width: 160 },
        { name: "propername", classes: "user-account-proper-name"  }
      ]
    ],
    rightColumn: [
      [
        { width: 320 },
        { name: "isActive", classes: "cell-align-right user-account-active",
          formatter: "formatActive" }
      ]
    ],
    formatActive: function (content) {
      return content ? "_active".loc() : "";
    }
  });
  
}());
