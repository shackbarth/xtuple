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
      {name: "header", formatter: "formatHeader",
        classes: "xv-comment-box-label"},
      {attr: "text", name: "textBlock", formatter: "formatText", allowHtml: true,
        classes: "xv-comment-box-textblock"},
      // Editing widgets
      {kind: "XV.CommentTypePicker", name: "commentType", attr: "commentType",
        showing: false},
      {kind: "XV.TextArea", name: 'textArea', attr: "text", showing: false,
        showBorder: true, onblur: 'textAreaBlur'}
    ],
    edit: function () {
      var that = this,
        model = this.getValue(),
        commentType = this.$.commentType,
        header = this.$.header,
        textInput = this.$.textArea.$.input,
        typeChanged = function () {
          var headerText = that.formatHeader(null, that, model);
          textInput.setDisabled(false);
          textInput.focus();
          header.setContent(headerText);
          commentType.hide();
          model.off('change:commentType', typeChanged);
        };
      if (model.isReadOnly()) { return; }
      this.$.textBlock.hide();
      this.$.textArea.show();
      if (model.get('commentType')) {
        textInput.focus();
      } else {
        commentType.show();
        textInput.setDisabled(true);
        model.on('change:commentType', typeChanged);
      }
    },
    formatHeader: function (value, view, model) {
      var values = [
        Globalize.format(model.get('created'), 'd'),
        Globalize.format(model.get('created'), 't'),
        model.get('createdBy'),
        model.getValue('commentType.name')
      ];
      return values.join(' ');
    },
    formatText: function (value, view, model) {
      var text = value ? value.replace(/</g, "&lt;").replace(/\r?\n/g, "<br>\n") : value;
      view.addRemoveClass("disabled", model.isReadOnly());
      return "<p>\n<blockquote>" + text + "</pre></blockquote><br><hr>";
    },
    textAreaBlur: function () {
      var value = this.getValue(),
        text = this.formatText(value.get('text'), this, value);
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
