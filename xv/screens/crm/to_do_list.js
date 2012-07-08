/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, 
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict:true,
trailing:true white:true*/
/*global XT:true, XM:true, enyo:true, Globalize:true,*/

(function () {
  "use strict";

  enyo.kind({
    name: "ToDoInfoList",
    kind: "XT.InfoList",
    published: {
      label: "_toDos".loc(),
      collection: "XM.ToDoInfoCollection",
      rowClass: "XT.ToDoInfoCollectionRow"
    }
  });

  enyo.kind({
    name: "XT.ToDoInfoCollectionRow",
    kind: "XT.InfoListRow",
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

}());