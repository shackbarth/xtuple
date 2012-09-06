/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true, Globalize:true */

(function () {

  enyo.kind({
    name: "XV.CommentBoxItem",
    kind: "XV.RepeaterBoxRow",
    //classes: "xv-comment-box",
    title: "_comments".loc(),
    components: [
      {attr: "createdBy", classes: "xv-comment-box-createdBy"},
      {attr: "created", formatter: 'formatDate', classes: "xv-comment-box-created"},
      //{kind: "XV.CommentTypePicker", attr: "commentType", classes: "xv-comment-box-comment-type"},
      {kind: "XV.TextArea", attr: "text"}
    ],
    create: function () {
     // debugger;
      this.inherited(arguments);
    },
    formatDate: function (value, view, model) {
      return Globalize.format(value, 'd');
    }
  });

  enyo.kind({
    name: "XV.CommentBox",
    kind: "XV.RepeaterBox",
    classes: "xv-comment-box",
    title: "_comments".loc(),
    showHeader: false
  });

}());
