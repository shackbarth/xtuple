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
        {attr: "created", formatter: 'formatDate',
          classes: "xv-comment-box-label"},
        {attr: "createdBy", classes: "xv-comment-box-label"},
        {attr: "commentType.name", classes: "xv-comment-box-label"}
      ]},
      {attr: "text", formatter: "textBlock", allowHtml: true,
        classes: "xv-comment-box-textblock"},
      // Editing widgets
      {kind: "XV.CommentTypePicker", attr: "commentType", showing: false,
        showLabel: false, classes: "xv-comment-box-comment-type"},
      {kind: "XV.TextArea", attr: "text", showing: false}
    ],
    formatDate: function (value, view, model) {
      return Globalize.format(value, 'd') + ' ' + Globalize.format(value, 't');
    },
    textBlock: function (value, view, model) {
      var regExp = new RegExp("\r?\n"),
        text = value.replace("<", "&lt;").replace(regExp, "<br>\n");
      view.addRemoveClass("disabled", model.isReadOnly());
      return "<p>\n<blockquote>" + text + "</pre></blockquote><br><hr>";
    }
  });

  enyo.kind({
    name: "XV.CommentBox",
    kind: "XV.RepeaterBox",
    classes: "xv-comment-box",
    title: "_comments".loc(),
    showHeader: false,
    setValue: function (value, options) {
      if (value) {
        value.comparator = this.sort;
        value.sort();
      }
      this.inherited(arguments);
    },
    sort: function (a, b) {
      var aval = a.get('created'),
        bval = b.get('created');
      return XT.date.compare(bval, aval);
    }
  });

}());
