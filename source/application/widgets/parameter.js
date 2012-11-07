/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountListParameters",
    kind: "XV.ParameterWidget",
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
      {name: "account", label: "_account".loc(), attr: ["account.id", "accountParent"], defaultKind: "XV.AccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_userAccount".loc()},
      {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"}
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
  // IMAGE
  //

  enyo.kind({
    name: "XV.ImageListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_image".loc()},
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
      {name: "number", label: "_number".loc(), attr: "number",
        getParameter: function () {
          var param,
            value = this.getValue() - 0;
          if (value && _.isNumber(value)) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: value
            };
          }
          return param;
        }
      },
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
        filterLabel: "_status" + " " + "_equals".loc(),
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
      {name: "fromDate", label: "_fromDate".loc(), attr: "created", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {name: "toDate", label: "_toDate".loc(), attr: "created", operator: "<=",
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ItemListParameters",
    kind: "XV.ParameterWidget",
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
      {name: "classCode", label: "_classCode".loc(), attr: "classCode",
        defaultKind: "XV.ClassCodePicker"},
      {name: "category", label: "_category".loc(), attr: "productCategory",
        defaultKind: "XV.ProductCategoryPicker"}
    ]
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityListParameters",
    kind: "XV.ParameterWidget",
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
