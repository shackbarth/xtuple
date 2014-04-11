/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {

  enyo.kind({
    name: "XV.AccountCommentBox",
    kind: "XV.CommentBox",
    model: "XM.AccountComment"
  });

  enyo.kind({
    name: "XV.ContactCommentBox",
    kind: "XV.CommentBox",
    model: "XM.ContactComment"
  });

  enyo.kind({
    name: "XV.CustomerCommentBox",
    kind: "XV.CommentBox",
    model: "XM.CustomerComment"
  });

  enyo.kind({
    name: "XV.EmployeeCommentBox",
    kind: "XV.CommentBox",
    model: "XM.EmployeeComment"
  });

  //
  // Adds isPublic checkbox to default functionality
  //
  enyo.kind({
    name: "XV.IncidentCommentBoxItem",
    kind: "XV.CommentBoxItem",
    components: [
      {name: "header", formatter: "formatHeader",
        classes: "xv-comment-box-label"},
      {attr: "text", name: "textBlock", formatter: "formatText", allowHtml: true,
        classes: "xv-comment-box-textblock"},
      // Editing widgets
      {kind: "XV.CommentTypePicker", name: "commentType",
        attr: "commentType", showing: false},
      {kind: "XV.CheckboxWidget", name: "isPublic",
        attr: "isPublic", showing: false},
      {kind: "XV.TextArea", name: 'textArea', attr: "text",
        showing: false, showBorder: true}
    ],
    formatHeader: function (value, view, model) {
      var header = this.inherited(arguments);
      if (!model.get("isPublic")) {
        header = header + " (private)";
      }
      return header;
    },
    hideEditableArea: function () {
      this.inherited(arguments);
      this.$.isPublic.hide();
    },
    openEditableArea: function () {
      this.inherited(arguments);
      if (this.getValue().isReadOnly()) {
        return;
      }
      this.$.isPublic.show();
    }
  });

  //
  // Just like the superkind, except the XV.CommentBoxItem is
  // an XV.IncidentCommentBoxItem
  //
  enyo.kind({
    name: "XV.IncidentCommentBox",
    kind: "XV.CommentBox",
    model: "XM.IncidentComment",
    components: [
      {kind: "onyx.GroupboxHeader", name: "header"},
      {
        kind: "XV.Scroller",
        horizontal: 'hidden',
        fit: true,
        components: [{
          kind: "Repeater",
          name: "repeater",
          count: 0,
          onSetupItem: "setupItem",
          classes: "xv-comment-box-repeater",
          components: [
            {kind: "XV.IncidentCommentBoxItem", name: "repeaterItem" }
          ]
        }]
      },
      {kind: 'FittableColumns', classes: "xv-buttons", components: [
        {kind: "onyx.Button", name: "newButton", onclick: "newItem", classes: "icon-plus"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.ItemSiteCommentBox",
    kind: "XV.CommentBox",
    model: "XM.ItemSiteComment"
  });

  enyo.kind({
    name: "XV.ItemCommentBox",
    kind: "XV.CommentBox",
    model: "XM.ItemComment"
  });

  enyo.kind({
    name: "XV.OpportunityCommentBox",
    kind: "XV.CommentBox",
    model: "XM.OpportunityComment"
  });

  enyo.kind({
    name: "XV.ProjectCommentBox",
    kind: "XV.CommentBox",
    model: "XM.ProjectComment"
  });

  enyo.kind({
    name: "XV.ProjectTaskCommentBox",
    kind: "XV.CommentBox",
    model: "XM.ProjectTaskComment"
  });

  enyo.kind({
    name: "XV.QuoteCommentBox",
    kind: "XV.CommentBox",
    model: "XM.QuoteComment"
  });

  enyo.kind({
    name: "XV.SiteCommentBox",
    kind: "XV.CommentBox",
    model: "XM.SiteComment"
  });

  enyo.kind({
    name: "XV.TaskCommentBox",
    kind: "XV.CommentBox",
    model: "XM.TaskComment"
  });

  enyo.kind({
    name: "XV.ToDoCommentBox",
    kind: "XV.CommentBox",
    model: "XM.ToDoComment"
  });

  enyo.kind({
    name: "XV.QuoteLineCommentBox",
    kind: "XV.CommentBox",
    model: "XM.QuoteLineComment"
  });

  enyo.kind({
    name: "XV.SalesOrderLineCommentBox",
    kind: "XV.CommentBox",
    model: "XM.SalesOrderLineComment"
  });

  enyo.kind({
    name: "XV.SalesOrderCommentBox",
    kind: "XV.CommentBox",
    model: "XM.SalesOrderComment"
  });

}());
