/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true, Globalize:true */

(function () {

  enyo.kind({
    name: "XV.CommentBoxItem",
    kind: "XV.RepeaterBoxRow",
    classes: "xv-comment-box",
    title: "_comments".loc(),
    components: [
      {kind: "FittableColumns", classes: "xv-comment-box-header", components: [
        {attr: "createdBy", classes: "xv-comment-box-label"},
        {attr: "created", formatter: 'formatDate', classes: "xv-comment-box-label"},
        {attr: "commentType.name", classes: "xv-comment-box-label"}
      ]},
      //{kind: "XV.CommentTypePicker", attr: "commentType", showing: false,
      //  showLabel: false, classes: "xv-comment-box-comment-type"},
      {attr: "text", formatter: "textBlock", allowHtml: true,
        classes: "xv-comment-box-textblock"},
      //{kind: "XV.TextArea", attr: "text", showing: false}
    ],
    formatDate: function (value, view, model) {
      return Globalize.format(value, 'd');
    },
    textBlock: function (value, view, model) {
      var regExp = new RegExp("\r?\n"),
        text = value.replace("<", "&lt;").replace(regExp, "<br>\n");
      return "<p>\n<blockquote>" + text + "</pre></blockquote>\n<hr>";
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
