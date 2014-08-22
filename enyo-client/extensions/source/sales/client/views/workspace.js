/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.sales.initWorkspaces = function () {
    var extensions;

    // ..........................................................
    // ACCOUNT
    //

    // Intercept calls to create customers and make sure prospects get properly
    // "converted" to customers.
    var proto = XV.AccountWorkspace.prototype;
    proto.kindHandlers.onWorkspace = "workspace";
    proto.workspace = function (inSender, inEvent) {
      var model = this.getValue(),
        prospect = model ? model.get("prospect") : false;
      if (inEvent.workspace === "XV.CustomerWorkspace" &&
          prospect &&
          !this._passThrough) {
        inEvent.success = function () {
          this.getValue().convertFromProspect(prospect.id);
        };
        this._passThrough = true;
        this.bubble("onWorkspace", inEvent, this);
        return true;
      }
      this._passThrough = false;
    };

    // ..........................................................
    // CONFIGURE
    //
    enyo.kind({
      name: "XV.SalesWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_sales".loc(),
      model: "XM.Sales",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [

              {kind: "onyx.GroupboxHeader", content: "_salesOrder".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "CONumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.NumberWidget", attr: "NextSalesOrderNumber",
                label: "_nextNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "DefaultPrintSOOnSave",
                label: "_printOnSave".loc()},
              {kind: "onyx.GroupboxHeader", content: "_quote".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "QUNumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.NumberWidget", attr: "NextQuoteNumber",
                label: "_nextNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "ShowQuotesAfterSO",
                label: "_showQuotesAfterConverted".loc()},

              {kind: "onyx.GroupboxHeader", content: "_creditMemo".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "CMNumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.NumberWidget", attr: "NextCreditMemoNumber",
                label: "_nextNumber".loc(), formatting: false},

              {kind: "onyx.GroupboxHeader", content: "_invoice".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "InvcNumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.NumberWidget", attr: "NextInvoiceNumber",
                label: "_nextNumber".loc(), formatting: false},
              // Not bothering to define a kind
              {kind: "XV.PickerWidget", attr: "InvoiceDateSource",
                label: "_invoiceDateSource".loc(), collection: "XM.invoiceDateSources"},

              {kind: "onyx.GroupboxHeader", content: "_dateControl".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowASAPShipSchedules",
                label: "_allowASAPShipSchedules".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "UsePromiseDate",
                label: "_usePromiseDates".loc()},

              {kind: "onyx.GroupboxHeader", content: "_changeLog".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "CustomerChangeLog",
                label: "_postCustomerChanges".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "SalesOrderChangeLog",
                label: "_postSalesOrderChanges".loc()},

              {kind: "onyx.GroupboxHeader", content: "_shipControl".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AlwaysShowSaveAndAdd",
                label: "_showSaveAndAddbutton".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "FirmSalesOrderPackingList",
                label: "_firmSalesOrdersWhenAddedToPackingList".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "EnableSOShipping",
                label: "_enableSOShipping".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AutoSelectForBilling",
                label: "_autoSelectForBilling".loc()},

              {kind: "onyx.GroupboxHeader", content: "_creditControl".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "RestrictCreditMemos",
                label: "_restrictCreditMemos".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AutoAllocateCreditMemos",
                label: "_autoAllocateCreditMemos".loc()}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "pricePanel", title: "_pricing".loc(), components: [
            {kind: "XV.ScrollableGroupbox", name: "priceGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_priceControl".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowDiscounts",
                label: "_allowDiscounts".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "DisableSalesOrderPriceOverride",
                label: "_disableSalesOrderPriceOverride".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "HideSOMiscCharge",
                label: "_hideSOMiscCharge".loc()},
              // Not bothering to define a kind
              {kind: "XV.PickerWidget", attr: "soPriceEffective",
                label: "_priceEffectiveDate".loc(), collection: "XM.priceEffectiveDates"},
              {kind: "onyx.GroupboxHeader", content: "_freightPricing".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "CalculateFreight",
                label: "_useCalculatedFreightPricing".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "IncludePackageWeight",
                label: "_includePackageWeight".loc()},
              // Not bothering to define a kind
              {kind: "XV.PickerWidget", attr: "UpdatePriceLineEdit",
                label: "_pricingOnLineItemEdits".loc(), collection: "XM.lineItemEditBehaviors"},
              {kind: "XV.ToggleButtonWidget", attr: "IgnoreCustDisc",
                label: "_ignoreIfDiscounted".loc()}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "defaultsPanel", title: "_customerDefaults".loc(),
              components: [
            {kind: "XV.ScrollableGroupbox", name: "defaultsGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_customerDefaults".loc()},
              {kind: "XV.CustomerTypePicker", attr: "DefaultCustType",
                label: "_customerType".loc()},
              {kind: "XV.SalesRepPicker", attr: "DefaultSalesRep",
                label: "_salesRep".loc()},
              {kind: "XV.ShipViaPicker", attr: "DefaultShipViaId",
                label: "_shipVia".loc()},
              {kind: "XV.TermsPicker", attr: "DefaultTerms",
                label: "_terms".loc()},
              {kind: "XV.BalanceMethodPicker", attr: "DefaultBalanceMethod",
                label: "_balanceMethod".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "DefaultPartialShipments",
                label: "_acceptsPartialShipments".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "DefaultBackOrders",
                label: "_acceptsBackOrders".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "DefaultFreeFormShiptos",
                label: "_allowFreeFormShiptos".loc()},
              {kind: "XV.NumberWidget", attr: "SOCreditLimit",
                label: "_creditLimit".loc()},
              {kind: "XV.InputWidget", attr: "SOCreditRate",
                label: "_creditRating".loc()}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // INVOICE
    //

    extensions = [
      {kind: "XV.MoneyWidget",
        attr: {localValue: "authorizedCredit", currency: "currency"},
        label: "_authorizedCredit".loc(), currencyShowing: false,
        container: "lineItemBox.summaryPanel.summaryColumnOne",
        defer: true},
      {kind: "XV.InputWidget", container: "mainSubgroup", addBefore: "isPosted",
        attr: "orderNumber"},
      {kind: "XV.DateWidget", container: "mainSubgroup", addBefore: "isPosted",
        attr: "orderDate"}
    ];
    XV.appendExtension("XV.InvoiceWorkspace", extensions);

    // ..........................................................
    // OPPORTUNITY
    //

    extensions = [
      {kind: "XV.OpportunityQuoteListRelationsBox", container: "panels", attr: "quoteRelations"},
      {kind: "XV.OpportunitySalesOrderListRelationsBox", container: "panels",
        attr: "salesOrderRelations"}
    ];
    XV.appendExtension("XV.OpportunityWorkspace", extensions);

  };

}());
