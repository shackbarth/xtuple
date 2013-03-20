/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
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
    name: "XV.IncidentCommentBox",
    kind: "XV.CommentBox",
    model: "XM.IncidentComment"
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
    name: "XV.ToDoCommentBox",
    kind: "XV.CommentBox",
    model: "XM.ToDoComment"
  });

  enyo.kind({
    name: "XV.QuoteLineCommentBox",
    kind: "XV.CommentBox",
    model: "XM.QuoteLineComment"
  });

}());
