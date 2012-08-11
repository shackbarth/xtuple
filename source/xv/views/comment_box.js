/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
  enyo.kind({
    name: "XV.CommentBox",
    kind: "XV.RepeaterBox",
    classes: "xv-comment-box",
    published: {
      columns: [
        {kind: "XV.Input", name: "comments.text", classes: "xv-comment-box-text"},
        {kind: "XV.Input", name: "comments.createdBy", classes: "xv-comment-box-createdBy"},
        {kind: "XV.Date", name: "comments.created", classes: "xv-comment-box-created"},
        {kind: "XV.CommentTypeDropdown", name: "comments.commentType", classes: "xv-comment-box-comment-type"}
      ]
    }
  });
}());
