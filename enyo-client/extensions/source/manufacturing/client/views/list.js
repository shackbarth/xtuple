/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.manufacturing.initLists = function () {

    // ..........................................................
    // ISSUE WORK ORDER MATERIALS
    //

    enyo.kind({
      name: "XV.IssueMaterialList",
      kind: "XV.List",
      label: "_issueMaterial".loc(),
      collection: "XM.IssueMaterialCollection",
      parameterWidget: "XV.IssueMaterialParameters",
      multiSelect: true,
      query: {orderBy: [
        {attribute: "order.number"},
        {attribute: "order.subnumber"}
      ]},
      showDeleteAction: false,
      actions: [
        {name: "issueMaterial", prerequisite: "canIssueMaterial",
          method: "issueStock", notify: false, isViewMethod: true},
        {name: "issueLine", prerequisite: "canIssueMaterial",
          method: "issueLine", notify: false, isViewMethod: true},
        {name: "returnLine", prerequisite: "canReturnMaterial",
          method: "doReturnMaterial", notify: false}
      ],
      toggleSelected: true,
      published: {
        shipment: null
      },
      events: {
        onShipmentChanged: ""
      },
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "lineNumber"},
                {kind: "XV.ListAttr", attr: "itemSite.site.code",
                  classes: "right"},
                {kind: "XV.ListAttr", attr: "itemSite.item.number", fit: true}
              ]},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1",
                fit: true,  style: "text-indent: 18px;"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "ordered",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "balance",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "atShipping",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "scheduleDate",
                formatter: "formatScheduleDate", style: "text-align: right"}
            ]}
          ]}
        ]}
      ],
      fetch: function () {
        this.setShipment(null);
        this.inherited(arguments);
      },
      /*
      formatScheduleDate: function (value, view, model) {
        var today = new Date(),
          isLate = XT.date.compareDate(value, today) < 1 &&
            model.get("balance") > 0;
        view.addRemoveClass("error", isLate);
        return value;
      },

      formatLineNumber: function (value, view, model) {
        var lineNumber = model.get("lineNumber"),
          subnumber = model.get("subNumber");
        if (subnumber === 0) {
          value = lineNumber;
        } else {
          value = lineNumber + "." + subnumber;
        }
        return value;
      },
      */
      formatQuantity: function (value) {
        var scale = XT.session.locale.attributes.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      issueLine: function (inEvent) {
        var model = inEvent.model,
          index = inEvent.index,
          that = this,
          options = {
            success: function () {
              that.resetActions(index);
              that.renderRow(index);
            }
          };
        // Model sets toIssue value on load and attempts to
        // distribute detail to default if applicable. If
        // still undistributed detail, we'll have to prompt
        // user. Otherwise just save the model with the
        // precalculated values.
        if (model.undistributed()) {
          this.issueStock(inEvent);
        } else {
          model.save(null, options);
        }
      },
      /*
      issueMaterial: function (inEvent) {
        var model = inEvent.model,
         transDate = model.transactionDate;

        this.doWorkspace({
          workspace: "XV.IssueMaterialWorkspace",
          id: model.id,
          allowNew: false,
          success: function (model) {
            // Set the transaction date to match the source
            model.transactionDate = transDate;
          }
        });
      },*/
      /**
        Overload: used to keep track of shipment.
      */
      /*
      setupItem: function (inSender, inEvent) {
        this.inherited(arguments);
        var collection = this.getValue(),
          listShipment = collection.at(inEvent.index).get("shipment"),
          listShipmentId = listShipment ? listShipment.id : false,
          shipment = this.getShipment(),
          shipmentId = shipment ? shipment.id : false;
        if (listShipmentId !== shipmentId) {
          this.setShipment(listShipment);
          // Update all rows to match
          _.each(collection.models, function (model) {
            model.set("shipment", listShipment);
          });
        }
      },*/
      shipmentChanged: function () {
        this.doShipmentChanged({shipment: this.getShipment()});
      }
    });

    XV.registerModelList("XM.WorkOrderRelation", "XV.WorkOrderListItem");

  };
}());
