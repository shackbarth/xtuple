/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.billing.initWorkspaces = function () {

    // ..........................................................
    // CONFIGURE
    //

    enyo.kind({
      name: "XV.BillingWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_billing".loc(),
      model: "XM.Billing",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_accountsReceivable".loc()},
              {kind: "XV.NumberWidget", attr: "NextARMemoNumber",
                label: "_nextARMemoNumber".loc(), formatting: false},
              {kind: "XV.NumberWidget", attr: "NextCashRcptNumber",
                label: "_nextCashRcptNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "HideApplyToBalance",
                label: "_hideApplyToBalance".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "EnableCustomerDeposits",
                label: "_enableCustomerDeposits".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "CreditTaxDiscount",
                label: "_creditTaxDiscount".loc(), formatting: false},
              {kind: "XV.AddressFieldsWidget",
                name: "billtoAddress", attr:
                {name: "remitto_name", line1: "remitto_address1",
                  line2: "remitto_address2", line3: "remitto_address3",
                  city: "remitto_city", state: "remitto_state",
                  postalCode: "remitto_zipcode", country: "remitto_country"}
              },
              {kind: "XV.InputWidget", attr: "remitto_phone",
                label: "_phone".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "AutoCreditWarnLateCustomers",
                label: "_autoCreditWarnLateCustomers".loc()},
              {kind: "XV.NumberSpinnerWidget", attr: "DefaultAutoCreditWarnGraceDays",
                label: "_defaultAutoCreditWarnGraceDays".loc()},
              {kind: "XV.NumberSpinnerWidget", attr: "RecurringInvoiceBuffer",
                label: "_recurringInvoiceBuffer".loc()},
              {kind: "XV.IncidentCategoryPicker", attr: "DefaultARIncidentStatus",
                label: "_defaultARIncidentStatus".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AutoCloseARIncident",
                label: "_autoCloseARIncident".loc()}
            ]}
          ]}
        ]}
      ]
    });
  };
}());
