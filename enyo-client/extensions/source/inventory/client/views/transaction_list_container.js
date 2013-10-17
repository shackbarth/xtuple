/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, _:true, enyo:true */

(function () {

  XT.extensions.inventory.initTransactionListContainer = function () {

    enyo.kind({
      name: "XV.IssueToShipping",
      kind: "XV.TransactionListContainer",
      prerequisite: "canIssueItem",
      notifyMessage: "_issueAll?".loc(),
      list: "XV.IssueToShippingList",
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
          validModel = _.isObject(model) ? !model.get("isShipped") : false,
          hasOpenLines = this.$.list.value.length;
        return hasPrivilege && validModel && hasOpenLines;
      },
      create: function () {
        this.inherited(arguments);
        var button = this.$.postButton;
        button.setContent("_ship".loc());
        button.setShowing(true);
      },
      issueAll: function () {
        this.$.list.issueAll();
      },
      post: function () {
        var that = this,
          shipment = this.$.parameterWidget.$.shipment.getValue(),
          callback = function (resp) {
            if (resp) { that.$.parameterWidget.$.order.setValue(null); }
          };
        this.doWorkspace({
          workspace: "XV.ShipShipmentWorkspace",
          id: shipment.id,
          callback: callback
        });
      },
      shipmentChanged: function (inSender, inEvent) {
        var disabled = _.isEmpty(inEvent.shipment) ||
                       !XT.session.privileges.get("ShipOrders");
        this.$.parameterWidget.$.shipment.setValue(inEvent.shipment);
        this.$.postButton.setDisabled(disabled);
      }
    });
  };

}());
