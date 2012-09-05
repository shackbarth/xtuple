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
      title: "_comments".loc(),
      columns: [
        {kind: "XV.TextArea", attr: "text", classes: "xv-comment-box-text"},
        {kind: "XV.Input", attr: "createdBy", classes: "xv-comment-box-createdBy"},
        {kind: "XV.Date", attr: "created", classes: "xv-comment-box-created"},
        {kind: "XV.CommentTypePicker", attr: "commentType",
          classes: "xv-comment-box-comment-type"}
      ]
    }
  });

}());
