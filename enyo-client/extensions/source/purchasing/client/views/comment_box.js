/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true */

/** @module XV */

(function () {

  XT.extensions.purchasing.initCommentBox = function () {

    enyo.kind({
      name: "XV.PurchaseOrderCommentBox",
      kind: "XV.CommentBox",
      model: "XM.PurchaseOrderComment"
    });

    enyo.kind({
      name: "XV.PurchaseOrderLineCommentBox",
      kind: "XV.CommentBox",
      model: "XM.PurchaseOrderLineComment"
    });

  };

}());
