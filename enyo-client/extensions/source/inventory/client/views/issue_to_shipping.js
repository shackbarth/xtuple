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
    var issueToShipping =  /** @lends XV.IssueToShipping# */ {
      name: "XV.IssueToShipping",
      kind: "XV.SearchContainer",
      handlers: {
        onListItemMenuTap: "showListItemMenu"
      },
      create: function () {
        this.inherited(arguments);
        this.$.listPanel.createComponent({
          name: "listItemMenu",
          kind: "onyx.Menu",
          floating: true,
          onSelect: "listActionSelected",
          maxHeight: 500,
          components: [],
          owner: this
        });
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
      },
      listActionSelected: function (inSender, inEvent) {
        alert("List Action Selected!");
      }
    };

    enyo.mixin(issueToShipping, XV.ListMenuManagerMixin);
    enyo.kind(issueToShipping);

  };

}());
