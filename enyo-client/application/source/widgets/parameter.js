/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountListParameters",
    kind: "XV.ParameterWidget",
    characteristicsRole: 'isAccounts',
    components: [
      {kind: "onyx.GroupboxHeader", content: "_account".loc()},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "name", label: "_name".loc(), attr: "name"},
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {name: "primaryContact", label: "_primaryContact".loc(), attr: "primaryContact.name"},
      {name: "primaryEmail", label: "_primaryEmail".loc(), attr: "primaryContact.primaryEmail"},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {name: "phone", label: "_phone".loc(), attr: ["primaryContact.phone", "primaryContact.alternate", "primaryContact.fax"]},
      {name: "street", label: "_street".loc(), attr: ["primaryContact.address.line1", "primaryContact.address.line2", "primaryContact.address.line3"]},
      {name: "city", label: "_city".loc(), attr: "primaryContact.address.city"},
      {name: "postalCode", label: "_postalCode".loc(), attr: "primaryContact.address.postalCode"},
      {name: "state", label: "_state".loc(), attr: "primaryContact.address.state"},
      {name: "country", label: "_country".loc(), attr: "primaryContact.address.country"},
      {kind: "onyx.GroupboxHeader", content: "_userAccount".loc()},
      {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"}
    ]
  });

  enyo.kind({
    name: "XV.UserAccountListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_userAccount".loc()},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "username", label: "_username".loc(), attr: "username"},
      {name: "propername", label: "_propername".loc(), attr: "propername"},
      {name: "email", label: "_email".loc(), attr: "email"}
    ]
  });

  // ..........................................................
  // ADDRESS
  //

  enyo.kind({
    name: "XV.AddressListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "street", label: "_street".loc(), attr: ["line1", "line2", "line3"]},
      {name: "city", label: "_city".loc(), attr: "city"},
      {name: "postalCode", label: "_postalCode".loc(), attr: "postalCode"},
      {name: "state", label: "_state".loc(), attr: "state"},
      {name: "country", label: "_country".loc(), attr: "country"},
      {name: "account", label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"}
    ]
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactListParameters",
    kind: "XV.ParameterWidget",
    characteristicsRole: 'isContacts',
    components: [
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "primaryEmail", label: "_primaryEmail".loc(), attr: "primaryEmail"},
      {name: "phone", label: "_phone".loc(), attr: ["phone", "alternate", "fax"]},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {name: "street", label: "_street".loc(), attr: ["address.line1", "address.line2", "address.line3"]},
      {name: "city", label: "_city".loc(), attr: "address.city"},
      {name: "state", label: "_state".loc(), attr: "address.state"},
      {name: "postalCode", label: "_postalCode".loc(), attr: "address.postalCode"},
      {name: "country", label: "_country".loc(), attr: "address.country"},
      {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
      {name: "account", label: "_account".loc(), attr: ["account.number", "accountParent"], defaultKind: "XV.AccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_userAccount".loc()},
      {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"}
    ]
  });

  // ..........................................................
  // COST CATEGORY
  //

  enyo.kind({
    name: "XV.CostCategoryListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_costCategory".loc()},
      {name: "code", label: "_code".loc(), attr: "code"}
    ]
  });

  // ..........................................................
  // CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_customer".loc()},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "customerType", attr: "customerType", label: "_customerType".loc(), defaultKind: "XV.CustomerTypePicker"},
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {name: "primaryEmail", label: "_primaryEmail".loc(), attr: "billingContact.primaryEmail"},
      {name: "phone", label: "_phone".loc(), attr: ["billingContact.phone", "billingContact.alternate", "billingContact.fax"]},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {name: "street", label: "_street".loc(), attr: ["billingContact.address.line1", "billingContact.address.line2", "billingContact.address.line3"]},
      {name: "city", label: "_city".loc(), attr: "billingContact.address.city"},
      {name: "state", label: "_state".loc(), attr: "billingContact.address.state"},
      {name: "postalCode", label: "_postalCode".loc(), attr: "billingContact.address.postalCode"},
      {name: "country", label: "_country".loc(), attr: "billingContact.address.country"}
    ]
  });

  // ..........................................................
  // CUSTOMER GROUP
  //

  enyo.kind({
    name: "XV.CustomerGroupListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_customerGroup".loc()},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.EmployeeListParameters",
    kind: "XV.ParameterWidget",
    characteristicsRole: 'isEmployees',
    components: [
      {kind: "onyx.GroupboxHeader", content: "_account".loc()},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "code", label: "_code".loc(), attr: "code"},
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "name", label: "_name".loc(), attr: "name"},
      {kind: "onyx.GroupboxHeader", content: "_detail".loc()},
      {name: "manager", label: "_manager".loc(), attr: "manager", defaultKind: "XV.EmployeeWidget"},
      {name: "department", label: "_department".loc(), attr: "department", defaultKind: "XV.DepartmentPicker"},
      {name: "shift", label: "_shift".loc(), attr: "shift", defaultKind: "XV.ShiftPicker"},
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {name: "contact", label: "_contact".loc(), attr: "contact.name"},
      {name: "primaryEmail", label: "_primaryEmail".loc(), attr: "contact.primaryEmail"},
      {name: "phone", label: "_phone".loc(), attr: ["primaryContact.phone", "contact.alternate", "contact.fax"]},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {name: "street", label: "_street".loc(), attr: ["primaryContact.address.line1", "contact.address.line2", "contact.address.line3"]},
      {name: "city", label: "_city".loc(), attr: "contact.address.city"},
      {name: "postalCode", label: "_postalCode".loc(), attr: "contact.address.postalCode"},
      {name: "state", label: "_state".loc(), attr: "contact.address.state"},
      {name: "country", label: "_country".loc(), attr: "cntact.address.country"}
    ]
  });

  // ..........................................................
  // EMPLOYEE GROUP
  //

  enyo.kind({
    name: "XV.EmployeeGroupListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_employeeGroup".loc()},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "description", label: "_description", attr: "description"}
    ]
  });

  // ..........................................................
  // FREIGHT CLASS
  //

  enyo.kind({
    name: "XV.FreightClassListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_freightClass".loc()},
      {name: "code", label: "_code".loc(), attr: "code"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // CUSTOMER SHIPTO
  //

  enyo.kind({
    name: "XV.CustomerShiptoParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_shipTo".loc()},
      // TODO: this must not be editable
      {name: "customer", label: "_customer".loc(), attr: "customer", defaultKind: "XV.CustomerWidget"},
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "name", label: "_name".loc(), attr: "name"}
    ]
  });

  // ..........................................................
  // FILE
  //

  enyo.kind({
    name: "XV.FileListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_file".loc()},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentListParameters",
    kind: "XV.ParameterWidget",
    characteristicsRole: 'isIncidents',
    components: [
      {kind: "onyx.GroupboxHeader", content: "_incident".loc()},
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "description", label: "_description".loc(), attr: "description"},
      {name: "category", label: "_category".loc(), attr: "category",
        defaultKind: "XV.IncidentCategoryPicker"},
      {name: "severity", label: "_severity".loc(), attr: "severity",
        defaultKind: "XV.IncidentSeverityPicker"},
      {name: "resolution", label: "_resolution".loc(), attr: "resolution",
          defaultKind: "XV.IncidentResolutionPicker"},
      {kind: "onyx.GroupboxHeader", content: "_priority".loc()},
      {name: "priorityEquals", label: "_equals".loc(), attr: "priority",
        defaultKind: "XV.PriorityPicker"},
      {name: "priorityAbove", label: "_above".loc(), attr: "priority",
          filterLabel: "_priority".loc() + " " + "_above".loc(),
          defaultKind: "XV.PriorityPicker",
          getParameter: function () {
            var value = this.getValue(),
              param;
            if (value) {
              param = {
                attribute: "priorityOrder",
                operator: '<',
                value: value.get('order')
              };
            }
            return param;
          }},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {name: "statusEquals", label: "_equals".loc(), attr: "status",
        filterLabel: "_status".loc() + " " + "_equals".loc(),
        defaultKind: "XV.IncidentStatusPicker"},
      {name: "statusAbove", label: "_above".loc(), attr: "status",
        filterLabel: "_status".loc() + " " + "_above".loc(),
        defaultKind: "XV.IncidentStatusPicker",
        getParameter: function () {
          var value = this.getValue(),
            param;
          switch (value)
          {
          case 'N':
            value = 0;
            break;
          case 'F':
            value = 1;
            break;
          case 'C':
            value = 2;
            break;
          case 'A':
            value = 3;
            break;
          case 'R':
            value = 4;
            break;
          case 'L':
            value = 5;
            break;
          }
          if (value) {
            param = {
              attribute: "statusOrder",
              operator: '<',
              value: value
            };
          }
          return param;
        }},
      {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
      {name: "account", label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {name: "contact", label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {name: "assignedTo", label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_created".loc()},
      {name: "createdFromDate", label: "_fromDate".loc(),
        filterLabel: "_created".loc() + " " + "_fromDate".loc(),
        attr: "created", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {name: "createdToDate", label: "_toDate".loc(),
        filterLabel: "_created".loc() + " " + "_toDate".loc(),
        attr: "created", operator: "<=",
        defaultKind: "XV.DateWidget"},
      {kind: "onyx.GroupboxHeader", content: "_updated".loc()},
      {name: "updatedFromDate", label: "_fromDate".loc(),
        filterLabel: "_updated".loc() + " " + "_fromDate".loc(),
        attr: "updated", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {name: "updatedToDate", label: "_toDate".loc(),
        filterLabel: "_updated".loc() + " " + "_toDate".loc(),
        attr: "updated", operator: "<=",
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // ITEM
  //

  enyo.kind({
    name: "XV.ItemListParameters",
    kind: "XV.ParameterWidget",
    characteristicsRole: 'isItems',
    components: [
      {kind: "onyx.GroupboxHeader", content: "_item".loc()},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "description", label: "_description".loc(), attr: ["description1", "description2"]},
      {name: "itemType", label: "_type".loc(), attr: "itemType",
        defaultKind: "XV.ItemTypePicker"},
      {name: "classCode", label: "_classCode".loc(), attr: "classCode",
        defaultKind: "XV.ClassCodePicker"},
      {name: "category", label: "_category".loc(), attr: "productCategory",
        defaultKind: "XV.ProductCategoryPicker"}
    ]
  });

  // ..........................................................
  // ITEM SITE
  //

  enyo.kind({
    name: "XV.ItemSiteListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_itemSite".loc()},
      {name: "itemWidget", label: "_item".loc(), attr: "item",
        defaultKind: "XV.ItemWidget"},
      {name: "site", label: "_site".loc(), attr: "site",
        defaultKind: "XV.SitePicker"},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {kind: "onyx.GroupboxHeader", content: "_item".loc()},
      {name: "itemNumber", label: "_number".loc(), attr: "item.number"},
      {name: "itemDescription", label: "_description".loc(), attr: ["item.description1", "item.description2"]},
      {kind: "onyx.GroupboxHeader", content: "_site".loc()},
      {name: "siteCode", label: "_code".loc(), attr: "site.code"},
      {name: "siteDescription", label: "_description".loc(), attr: "site.description"},
      {kind: "onyx.GroupboxHeader", content: "_classCode".loc()},
      {name: "classCode", label: "_equals".loc(), attr: "item.classCode.id",
        defaultKind: "XV.ClassCodePicker"},
      {name: "classCodePattern", label: "_code".loc(), attr: "item.classCode.code"},
      {kind: "onyx.GroupboxHeader", content: "_costCategory".loc()},
      {name: "costCategory", label: "_equals".loc(), attr: "costCategory",
        defaultKind: "XV.CostCategoryPicker"},
      {name: "costCategoryPattern", label: "_code".loc(), attr: "costCategory.code"},
      {kind: "onyx.GroupboxHeader", content: "_plannerCode".loc()},
      {name: "plannerCode", label: "_equals".loc(), attr: "plannerCode",
        defaultKind: "XV.PlannerCodePicker"},
      {name: "plannerCodePattern", label: "_code".loc(), attr: "plannerCode.code"}
    ]
  });

  // ..........................................................
  // LEDGER ACCOUNT
  //

  enyo.kind({
    name: "XV.LedgerAccountListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_ledgerAccount".loc()},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "description", label: "_description".loc(), attr: "description"},
      {name: "accountType", label: "_type".loc(), attr: "accountType",
        defaultKind: "XV.LedgerAccountTypePicker"}
    ]

  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityListParameters",
    kind: "XV.ParameterWidget",
    characteristicsRole: 'isOpportunities',
    components: [
      {kind: "onyx.GroupboxHeader", content: "_opportunity".loc()},
      {name: "showInactive", label: "_showInactive".loc(), attr: "isActive",
        defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "name", label: "_name".loc(), attr: "name"},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {name: "stage", label: "_stage".loc(), attr: "opportunityStage",
        defaultKind: "XV.OpportunityStagePicker"},
      {name: "priority", label: "_priority".loc(), attr: "priority",
        defaultKind: "XV.PriorityPicker"},
      {name: "type", label: "_type".loc(), attr: "opportunityType",
        defaultKind: "XV.OpportunityTypePicker"},
      {name: "source", label: "_source".loc(), attr: "opportunitySource",
        defaultKind: "XV.OpportunitySourcePicker"},
      {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
      {name: "account", label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {name: "contact", label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {name: "assignedTo", label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_targetClose".loc()},
      {name: "fromTargetDate", label: "_fromDate".loc(), attr: "targetClose", operator: ">=",
        filterLabel: "_from".loc() + " " + "_targetClose".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"},
      {name: "toTargetDate", label: "_toDate".loc(), attr: "targetClose", operator: "<=",
        filterLabel: "_to".loc() + " " + "_targetClose".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // ORDER LIST
  //

  enyo.kind({
    name: "XV.OrderListItemParameters",
    kind: "XV.ParameterWidget",
  //  characteristicsRole: 'isAccounts',
    components: [
      {kind: "onyx.GroupboxHeader", content: "_orderListItem".loc()},
      {name: "orderType", attr: "type", label: "_orderType".loc(), defaultKind: "XV.CustomerTypePicker"},
      {name: "number", label: "_number".loc(), attr: "number"},
			{name: "scheduledDate", label: "_scheduledDate".loc(), attr: "scheduledDate"},
      {name: "assignedTo", label: "_assignedTo".loc(), attr: "assignedToUserName"}    
		]
  }); 

  // ..........................................................
  // PLANNER CODE
  //

  enyo.kind({
    name: "XV.PlannerCodeListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_plannerCode".loc()},
      {name: "code", label: "_code".loc(), attr: "code"}
    ]
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_project".loc()},
      {name: "showCompleted", label: "_showCompleted".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '!=',
              value: 'C'
            };
          }
          return param;
        }
      },
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "account", label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {name: "contact", label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {name: "status", label: "_status".loc(), attr: "status",
        defaultKind: "XV.ProjectStatusPicker"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {name: "assignedTo", label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
      {name: "fromDueDate", label: "_fromDate".loc(), attr: "dueDate", operator: ">=",
        filterLabel: "_from".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"},
      {name: "toDueDate", label: "_toDate".loc(), attr: "dueDate", operator: "<=",
        filterLabel: "_to".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"}
    ]
  });

  enyo.kind({
    name: "XV.ProjectTaskListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_project".loc()},
      {name: "showCompleted", label: "_showCompleted".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '!=',
              value: 'C'
            };
          }
          return param;
        }
      },
      {name: "project", label: "_project".loc(), attr: "project", defaultKind: "XV.ProjectWidget"},
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "name", label: "_name".loc(), attr: "name"},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {name: "status", label: "_status".loc(), attr: "status",
        defaultKind: "XV.ProjectStatusPicker"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {name: "assignedTo", label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
      {name: "fromDueDate", label: "_fromDate".loc(), attr: "dueDate", operator: ">=",
        filterLabel: "_from".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"},
      {name: "toDueDate", label: "_toDate".loc(), attr: "dueDate", operator: "<=",
        filterLabel: "_to".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // PROSPECT
  //

  enyo.kind({
    name: "XV.ProspectListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "name", label: "_name".loc(), attr: "name"},
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {name: "primaryEmail", label: "_primaryEmail".loc(), attr: "contact.primaryEmail"},
      {name: "phone", label: "_phone".loc(), attr: ["contact.phone", "contact.alternate", "contact.fax"]},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {name: "street", label: "_street".loc(), attr: ["contact.address.line1", "contact.address.line2", "contact.address.line3"]},
      {name: "city", label: "_city".loc(), attr: "contact.address.city"},
      {name: "state", label: "_state".loc(), attr: "contact.address.state"},
      {name: "postalCode", label: "_postalCode".loc(), attr: "contact.address.postalCode"},
      {name: "country", label: "_country".loc(), attr: "contact.address.country"}
    ]
  });

  // ..........................................................
  // QUOTE
  //

  enyo.kind({
    name: "XV.QuoteListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_quote".loc()},
      {name: "showExpired", label: "_showExpired".loc(), attr: "expireDate", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '>=',
              value: new Date(),
              includeNull: true
            };
          }
          return param;
        }
      },
      {name: "showClosed", label: "_showClosed".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '!=',
              value: 'C'
            };
          }
          return param;
        }
      },
      {name: "excludeProspects", label: "_excludeProspects".loc(), attr: "customer.status", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '!=',
              value: "P"
            };
          }
          return param;
        }
      },
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "salesRep", attr: "salesRep", label: "_salesRep".loc(), defaultKind: "XV.SalesRepPicker"},
      {kind: "onyx.GroupboxHeader", content: "_customer".loc()},
      {name: "customer", attr: "customer", label: "_customer".loc(), defaultKind: "XV.CustomerProspectWidget"},
      {name: "customerType", attr: "customer.customerType", label: "_customerType".loc(), defaultKind: "XV.CustomerTypePicker"},
      {name: "customerPurchaseOrderNumber", attr: "customerPurchaseOrderNumber",
        label: "_custPO".loc()},
      {kind: "onyx.GroupboxHeader", content: "_quoteDate".loc()},
      {name: "createdFromDate", label: "_fromDate".loc(),
        filterLabel: "_quoteDate".loc() + " " + "_fromDate".loc(),
        attr: "quoteDate", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {name: "createdToDate", label: "_toDate".loc(),
        filterLabel: "_quoteDate".loc() + " " + "_toDate".loc(),
        attr: "quoteDate", operator: "<=",
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // SALES ORDER
  //

  enyo.kind({
    name: "XV.SalesOrderListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_quote".loc()},
      {name: "showClosed", label: "_showClosed".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '!=',
              value: 'C'
            };
          }
          return param;
        }
      },
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "salesRep", attr: "salesRep", label: "_salesRep".loc(), defaultKind: "XV.SalesRepPicker"},
      {kind: "onyx.GroupboxHeader", content: "_customer".loc()},
      {name: "customer", attr: "customer", label: "_customer".loc(), defaultKind: "XV.CustomerProspectWidget"},
      {name: "customerType", attr: "customer.customerType", label: "_customerType".loc(), defaultKind: "XV.CustomerTypePicker"},
      {name: "customerPurchaseOrderNumber", attr: "customerPurchaseOrderNumber",
        label: "_custPO".loc()},
      {kind: "onyx.GroupboxHeader", content: "_salesOrderDate".loc()},
      {name: "createdFromDate", label: "_fromDate".loc(),
        filterLabel: "_salesOrderDate".loc() + " " + "_fromDate".loc(),
        attr: "orderDate", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {name: "createdToDate", label: "_toDate".loc(),
        filterLabel: "_orderDate".loc() + " " + "_toDate".loc(),
        attr: "orderDate", operator: "<=",
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // SALE TYPE
  //

  enyo.kind({
    name: "XV.SaleTypeListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {kind: "onyx.GroupboxHeader", content: "_saleTypes".loc()},
      {name: "code", label: "_code".loc(), attr: "code"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // SALES REP
  //

  enyo.kind({
    name: "XV.SalesRepListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {kind: "onyx.GroupboxHeader", content: "_salesRep".loc()},
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "commission", label: "_commission".loc(), attr: "commission"}
    ]
  });

  // ..........................................................
  // SITE
  //

  enyo.kind({
    name: "XV.SiteListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {kind: "onyx.GroupboxHeader", content: "_site".loc()},
      {name: "code", label: "_code".loc(), attr: "code"}
    ]
  });

  // ..........................................................
  // SHIP ZONE
  //

  enyo.kind({
    name: "XV.ShipZoneListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_shipZones".loc()},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // SITE TYPE
  //

  enyo.kind({
    name: "XV.SiteTypeListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_siteType".loc()},
      {name: "name", label: "_name".loc(), attr: "name"}
    ]
  });

  // ..........................................................
  // TAX ASSIGNMENT
  //

  enyo.kind({
    name: "XV.TaxAssignmentListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_taxAssignment".loc()},
      {name: "tax", label: "_tax".loc(), attr: "tax"},
      {name: "taxZone", label: "_taxZone".loc(), attr: "taxZone"},
      {name: "taxType", label: "_taxType".loc(), attr: "taxType"}
    ]
  });

  // ..........................................................
  // TAX AUTHORITY
  //

  enyo.kind({
    name: "XV.TaxAuthorityListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_taxAuthority".loc()},
      {name: "code", label: "_code".loc(), attr: "code"},
      {name: "name", label: "_name".loc(), attr: "name"}
    ]
  });


  // ..........................................................
  // TAX CODE
  //

  enyo.kind({
    name: "XV.TaxCodeListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_taxCode".loc()},
      {name: "code", label: "_code".loc(), attr: "code"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // TAX CLASS
  //

  enyo.kind({
    name: "XV.TaxClassListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_taxClass".loc()},
      {name: "code", label: "_code".loc(), attr: "code"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // TAX RATE
  //

  enyo.kind({
    name: "XV.TaxRateListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_taxRate".loc()},
      {name: "tax", label: "_tax".loc(), attr: "tax.code"},
      {name: "percent", label: "_percent".loc(), attr: "percent"}
    ]
  });

  // ..........................................................
  // TAX TYPE
  //

  enyo.kind({
    name: "XV.TaxTypeListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_taxType".loc()},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // TAX ZONE
  //

  enyo.kind({
    name: "XV.TaxZoneListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_taxZone".loc()},
      {name: "code", label: "_code".loc(), attr: "code"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // TERMS
  //

  enyo.kind({
    name: "XV.TermsListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_terms".loc()},
      {name: "code", label: "_code".loc(), attr: "code"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // TO DO
  //

  enyo.kind({
    name: "XV.ToDoListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_toDo".loc()},
      {name: "showInactive", label: "_showInactive".loc(), attr: "isActive", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "description", label: "_description".loc(), attr: "description"},
      {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
      {name: "account", label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {name: "contact", label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {name: "assignedTo", label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
      {name: "fromDate", label: "_fromDate".loc(), attr: "dueDate", operator: ">=",
        filterLabel: "_from".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"},
      {name: "toDate", label: "_toDate".loc(), attr: "dueDate", operator: "<=",
        filterLabel: "_to".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // URL
  //

  enyo.kind({
    name: "XV.UrlListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_url".loc()},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "address", label: "_address".loc(), attr: "path"}
    ]
  });

}());
