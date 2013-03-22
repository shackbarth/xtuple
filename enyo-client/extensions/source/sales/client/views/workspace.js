/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.sales.initWorkspaces = function () {

    // ..........................................................
    // ACCOUNT
    //

    // Intercept calls to create customers and make sure prospects get properly"converted" to customers.
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
              {kind: "onyx.GroupboxHeader",
                content: "_invoice".loc()},
              {kind: "XV.NumberPolicyPicker",
                attr: "InvcNumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.NumberWidget", attr: "SOCreditLimit",
                label: "_SOCreditLimit".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "IncludePackageWeight",
                label: "_includePackageWeight".loc()},
            ]}
          ]}
        ]}
      ]
    });

/*
AllowASAPShipSchedules: true
AllowDiscounts: true
AlwaysShowSaveAndAdd: true
AutoAllocateCreditMemos: false
AutoSelectForBilling: true
CMNumberGeneration: "A"
CONumberGeneration: "A"
CalculateFreight: true
CustomerChangeLog: true
DefaultBackOrders: true
DefaultBalanceMethod: "B"
DefaultCustType: 18
DefaultFreeFormShiptos: true
DefaultPartialShipments: true
DefaultPrintSOOnSave: false
DefaultSalesRep: 29
DefaultShipFormId: 12
DefaultShipViaId: 13
DefaultTerms: 42
DisableSalesOrderPriceOverride: false
EnableSOShipping: true
FirmSalesOrderPackingList: true
HideSOMiscCharge: false
IgnoreCustDisc: false
IncludePackageWeight: true
InvcNumberGeneration: "A"
InvoiceDateSource: "shipdate"
NextCreditMemoNumber: 70001
NextInvoiceNumber: 60136
NextQuoteNumber: 40018
NextSalesOrderNumber: 50238
QUNumberGeneration: "O"
RestrictCreditMemos: false
SOCreditLimit: 20000
SOCreditRate: "No check"
SalesOrderChangeLog: true
ShowQuotesAfterSO: true
UpdatePriceLineEdit: 2
UsePromiseDate: true
soPriceEffective: "CurrentDate"
*/

  };

}());
