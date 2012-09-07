/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true, XM:true, Globalize:true */

(function () {

  enyo.kind({
    name: "XV.CommentBoxItem",
    kind: "XV.RepeaterBoxItem",
    classes: "xv-comment-box",
    title: "_comments".loc(),
    handlers: {
      ontap: "edit"
    },
    components: [
      {kind: "FittableColumns", classes: "xv-comment-box-header", components: [
        {attr: "created", formatter: 'formatDate',
          classes: "xv-comment-box-label"},
        {attr: "createdBy", classes: "xv-comment-box-label"},
        {attr: "commentType.name", classes: "xv-comment-box-label"}
      ]},
      {attr: "text", name: "textBlock", formatter: "formatTextBlock", allowHtml: true,
        classes: "xv-comment-box-textblock"},
      // Editing widgets
      {kind: "XV.CommentTypePicker", name: "commentType", attr: "commentType",
        showing: false},
      {kind: "XV.TextArea", name: 'textArea', attr: "text", showing: false,
        showBorder: true, onblur: 'textAreaBlur'}
    ],
    edit: function () {
      var value = this.getValue(),
        commentType = this.$.commentType,
        textBlock = this.$.textBlock,
        textInput = this.$.textArea.$.input,
        typeChanged = function () {
          var name = value.getValue('commentType.name');
          textInput.setDisabled(false);
          textInput.focus();
          textBlock.setContent(name);
          textBlock.render();
          commentType.hide();
          value.off('change:commentType', typeChanged);
        };
      if (value.isReadOnly()) { return; }
      this.$.textBlock.hide();
      this.$.textArea.show();
      if (value.get('commentType')) {
        textInput.focus();
      } else {
        commentType.show();
        textInput.setDisabled(true);
        value.on('change:commentType', typeChanged);
      }
    },
    formatDate: function (value) {
      return Globalize.format(value, 'd') + ' ' + Globalize.format(value, 't');
    },
    formatTextBlock: function (value, view, model) {
      var regExp = new RegExp("\r?\n"),
        text = value ? value.replace("<", "&lt;").replace(regExp, "<br>\n") : value;
      view.addRemoveClass("disabled", model.isReadOnly());
      return "<p>\n<blockquote>" + text + "</pre></blockquote><br><hr>";
    },
    textAreaBlur: function () {
      var value = this.getValue(),
        text = this.formatTextBlock(value.get('text'), this, value);
      this.$.textBlock.setContent(text);
      this.$.textBlock.show();
      this.$.textArea.hide();
      this.$.commentType.hide();
    },
    valueChanged: function () {
      this.inherited(arguments);
      var value = this.getValue(),
        status = value ? value.getStatus() : null,
        K = XM.Model;
      if (status === K.READY_NEW) {
        this.edit();
      }
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
