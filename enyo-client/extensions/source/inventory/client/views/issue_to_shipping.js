/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  XT.extensions.inventory.initIssueToShipping = function () {

    /**
      @name XV.IssueToShipping
      @extends XV.SearchContainer
     */
    enyo.kind(
      /** @lends XV.IssueToShipping# */{
      name: "XV.IssueToShipping",
      kind: "XV.SearchContainer",
      create: function () {
        this.inherited(arguments);
        this.setList({list: "XV.IssueToShippingList"});
      },
      /**
      @todo Document the itemTap method.
      */
      itemTap: function (inSender, inEvent) {
        /*
        var list = inEvent.list,
          value = list ? list.getModel(inEvent.index) : null;

        if (value) {
          this.close();
          if (this.callback) { this.callback(value); }
        }
        */
      }
    });

  };

}());
