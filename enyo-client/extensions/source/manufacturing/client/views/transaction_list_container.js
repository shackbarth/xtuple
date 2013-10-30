/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, _:true, enyo:true */

(function () {

  XT.extensions.manufacturing.initTransactionListContainer = function () {

    /** @private */
    var _canDo = function (priv) {
      var hasPrivilege = XT.session.privileges.get(priv),
        model = this.getModel(),
        //validModel = _.isObject(model) ? !model.get("isShipped") : false;
        validModel = _.isObject(model);
      return hasPrivilege && validModel;
    };

    enyo.kind({
      name: "XV.IssueMaterial",
      kind: "XV.TransactionListContainer",
      prerequisite: "canIssueItem",
      notifyMessage: "_issueAll?".loc(),
      list: "XV.IssueMaterialList",
      actions: [
        {name: "issueAll", label: "_issueAll".loc(),
          prerequisite: "canIssueItem" }
      ],
      handlers: {
        onShipmentChanged: "shipmentChanged"
      },
      canIssueItem: function () {
        var hasPrivilege = XT.session.privileges.get("IssueStockToShipping"),
          model = this.getModel(),
          validModel = _.isObject(model) ? true : false,
          hasOpenLines = this.$.list.value.length;
        return hasPrivilege && validModel && hasOpenLines;
      },
      create: function () {
        this.inherited(arguments);
        var button = this.$.postButton;
        button.setContent("_post".loc());
        button.setShowing(true);
      },
      issueAll: function () {
        this.$.list.issueAll();
      },
      post: function () {
        var that = this,
          model = that.model,
          callback = function (resp) {
            if (resp) { that.$.parameterWidget.$.order.setValue(null); }
          };
        this.doWorkspace({
          workspace: "XV.PostProductionWorkspace",
          id: model.id,
          callback: callback
        });
      },
      parameterChanged: function (inSender, inEvent) {
        this.inherited(arguments);
        var originator = inEvent ? inEvent.originator : false,
          name = originator ? originator.name : false,
          that = this;
        if (name === "order" && this.model !== -1) {
          if (inEvent.originator.$.input.getValue().id === that.model.id) {
            this.$.postButton.setDisabled(false);
          }
        } else {
          this.$.postButton.setDisabled(true);
        }
        //this.$.postButton.setDisabled(false);
      }
    });
  };

}());
