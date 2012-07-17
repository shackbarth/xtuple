/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */
(function () {
  //"use strict";

  enyo.kind({
    name: "XV",
    kind: enyo.Component,
    published: {
      workspacePanelDescriptor: null,
      relationTitleFields: {},
      history: []
    },
    create: function () {
      this.inherited(arguments);

      /**
       * I've thought about getting the workspace code to figure out the
       * appropriate fieldType dynamically (if it's a date object, use DateWidget,
       * etc. But I think this would fail if the field happens to be null.
       */
      this.setWorkspacePanelDescriptor({
        // the key is uppercase because the model name is uppercase
        Account: [
          {
            title: "Account Info",
            fields: [
              { fieldName: "name" },
              { fieldName: "number" }
            ]
          },
          {
            title: "Contact", // I know this doesn't really merit its own box
            fields: [
              { fieldName: "primaryContact", fieldType: "XV.RelationalWidget" }
            ]
          }
        ],

        Contact: [
          {
            title: "Contact Info",
            fields: [
              { fieldName: "firstName" },
              { fieldName: "lastName" },
              { fieldName: "jobTitle" },
              { fieldName: "phone" },
              { fieldName: "primaryEmail" }
            ]
          },
          {
            title: "Account Info",
            fields: [
              { fieldName: "account", fieldType: "XV.RelationalWidget" }
            ]
          }
        ],

        ToDo: [
          {
            title: "ToDo Info",
            fields: [
              { fieldName: "name" },
              { fieldName: "description" },
              { fieldName: "status", fieldType: "XV.DropdownWidget", modelType: "XM.projectStatuses" },
              { fieldName: "priority", fieldType: "XV.DropdownWidget", modelType: "XM.priorities" },
              { fieldName: "incident", fieldType: "XV.RelationalWidget" }
            ]
          },
          {
            title: "Schedule",
            fields: [
              { fieldName: "startDate", fieldType: "XV.DateWidget" },
              { fieldName: "dueDate", fieldType: "XV.DateWidget" },
              { fieldName: "assignDate", fieldType: "XV.DateWidget" },
              { fieldName: "completeDate", fieldType: "XV.DateWidget" }
            ]
          }
        ],

        Opportunity: [
          {
            title: "Opportunity Info",
            fields: [
              { fieldName: "number" },
              { fieldName: "name" },
              { fieldName: "account", fieldType: "XV.RelationalWidget" },
              { fieldName: "amount", fieldType: "XV.NumberWidget" },
              { fieldName: "probability", fieldType: "XV.NumberWidget" }
            ]
          },
          {
            title: "Schedule",
            fields: [
              { fieldName: "startDate", fieldType: "XV.DateWidget" },
              { fieldName: "assignDate", fieldType: "XV.DateWidget" },
              { fieldName: "targetClose", fieldType: "XV.DateWidget" },
              { fieldName: "actualClose", fieldType: "XV.DateWidget" }
            ]
          },
          {
            title: "Notes",
            location: "bottom",
            fields: [
              { fieldName: "notes" }
            ]
          }
        ],

        Incident: [
          {
            title: "Incident Info",
            fields: [
              { fieldName: "number" },
              { fieldName: "description" },
              { fieldName: "notes" }
            ]
          },
          {
            title: "Incident Info",
            fields: [
              { fieldName: "owner", fieldType: "XM.RelationalWidget" },
              { fieldName: "contact", fieldType: "XM.RelationalWidget" },
              { fieldName: "account", fieldType: "XM.RelationalWidget" },
              { fieldName: "item", fieldType: "relation" }
            ]
          }
        ],

        Project: [
          {
            title: "Project Info",
            fields: [
              { fieldName: "number", placeholder: "Enter the project number" },
              { fieldName: "name" },
              { fieldName: "notes" },
              { fieldName: "status", fieldType: "XV.DropdownWidget", modelType: "XM.projectStatuses" }
            ]
          },
          {
            title: "Summary",
            fields: [
              // FIXME: we can grab the field names but they eval to 0 wrongly
              { fieldName: "budgetedHoursTotal", fieldType: "XV.NumberWidget" },
              { fieldName: "actualHoursTotal", fieldType: "XV.ReadOnlyWidget" },
              { fieldName: "balanceHoursTotal", fieldType: "XV.ReadOnlyWidget" },
              { fieldName: "budgetedExpensesTotal", fieldType: "XV.NumberWidget" },
              { fieldName: "actualExpensesTotal", fieldType: "XV.ReadOnlyWidget" },
              { fieldName: "balanceExpensesTotal", fieldType: "XV.ReadOnlyWidget" }

            ]
          },

          {
            title: "Schedule",
            fields: [
              { fieldName: "owner", fieldType: "XV.RelationalWidget" },
              { fieldName: "assignedTo", fieldType: "XV.RelationalWidget" },
              { fieldName: "dueDate", fieldType: "XV.DateWidget" },
              { fieldName: "assignDate", fieldType: "XV.DateWidget" },
              { fieldName: "startDate", fieldType: "XV.DateWidget" },
              { fieldName: "completeDate", fieldType: "XV.DateWidget" }
            ]
          },
          {
            title: "Tasks",
            location: "bottom",
            boxType: "XV.GridWidget",
            fields: [
              { label: "number", fieldName: "number", width: "120" },
              { label: "name", fieldName: "name", width: "120" },
              { label: "notes", fieldName: "notes", width: "220" },
              { label: "actualHours", fieldName: "actualHours", fieldType: "XV.NumberWidget", width: "40" },
              { label: "actualExpenses", fieldName: "actualExpenses", fieldType: "XV.NumberWidget", width: "40" }
            ]
          }
        ]
      });


      this.getRelationalTitleFields = {};
      this.getRelationalTitleFields["XM.UserAccountInfo"] = "username";
      this.getRelationalTitleFields["XM.ContactInfo"] = "lastName";
      this.getRelationalTitleFields["XM.IncidentInfo"] = "number";
      this.getRelationalTitleFields["XM.AccountInfo"] = "name";

    }
  });
}());

