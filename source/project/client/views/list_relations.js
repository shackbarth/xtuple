/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.project.initListRelations = function () {

    // ..........................................................
    // ACCOUNT
    //

    enyo.kind({
      name: "XV.AccountProjectListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'dueDate', descending: true},
        {attribute: 'number' }
      ],
      parentKey: "account",
      workspace: "XV.ProjectWorkspace",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "getProjectStatusString", fit: true},
                {kind: "XV.ListAttr", attr: "dueDate", formatter: "formatDueDate",
                  placeholder: "_noCloseTarget".loc(),
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", attr: "name"}
            ]}
          ]}
        ]}
      ],
      formatDueDate: XV.ProjectList.prototype.formatDueDate
    });

    // ..........................................................
    // CONTACT
    //

    enyo.kind({
      name: "XV.ContactProjectListRelations",
      kind: "XV.AccountProjectListRelations",
      parentKey: "contact"
    });

  };

}());
