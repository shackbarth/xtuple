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
              {kind: "XV.ToggleButtonWidget", name: "hideApplyToBalance", attr: "HideApplyToBalance",
                label: "_hideApplyToBalance".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "EnableCustomerDeposits",
                label: "_enableCustomerDeposits".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "CreditTaxDiscount",
                label: "_creditTaxDiscount".loc(), formatting: false},
              {kind: "XV.AddressFieldsWidget",
                name: "address", attr:
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

  // ..........................................................
  // RECEIVABLE
  //
  enyo.kind({
    name: "XV.ReceivableWorkspace",
    kind: "XV.Workspace",
    title: "_receivable".loc(),
    model: "XM.Receivable",
    saveText: "_post".loc(),
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.SalesCustomerWidget", attr: "customer"},
            {kind: "onyx.GroupboxHeader", content: ""},
            {kind: "XV.DateWidget", attr: "documentDate"},
            {kind: "XV.DateWidget", attr: "dueDate"},
            {kind: "onyx.GroupboxHeader", content: ""},
            {kind: "XV.ReceivableTypePicker", attr: "documentType"},
            {kind: "XV.InputWidget", attr: "documentNumber"},
            {kind: "XV.InputWidget", attr: "orderNumber"},
            {kind: "XV.ReasonCodePicker", attr: "reasonCode"},
            {kind: "onyx.GroupboxHeader", content: ""},
            {kind: "XV.BillingTermsPicker", attr: "terms"},
            {kind: "XV.SalesRepPicker", attr: "salesRep"},
            {kind: "onyx.GroupboxHeader", content: ""},
            {kind: "XV.MoneyWidget",
              attr: {localValue: "amount", currency: "currency"},
              label: "_amount".loc()},
            {kind: "XV.NumberWidget", attr: "paid"},
            {kind: "XV.NumberWidget", attr: "balance"},
            {kind: "XV.PercentWidget", attr: "commission"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes"}
            // taxes
            //{kind: "XV.NumberWidget", attr: "taxTotal"},
            // applications
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.Receivable", "XV.ReceivableWorkspace");
  XV.registerModelWorkspace("XM.ReceivableListItem", "XV.ReceivableWorkspace");

  enyo.kind({
    name: "XV.SalesCategoryWorkspace",
    kind: "XV.Workspace",
    view: "XM.SalesCategoryView",
    title: "_salesCategory".loc(),

    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.CheckboxWidget", name: 'isActive', attr: "isActive", disabled: true}
          ]}
        ]}
      ]}
    ],

    /**
     * @see XM.SalesCategoryView
     * @listens XM.SalesCategoryView#events
     */
    handlers: {
      onCanDeactivateChange: 'canDeactivateChanged',
      onModelReadyClean:     'modelReady'
    },

    /**
     * @listens onModelReadyClean
     */
    modelReady: function (inSender, inEvent) {
      if (this.value.get('isActive')) {
        inEvent.result.canDeactivate();
      }
      else {
        this.$.isActive.setDisabled(!this.value.canEdit('isActive'));
      }

      return true;
    },

    /**
     * @listens onCanDeactivateChange
     */
    canDeactivateChanged: function (inSender, canDeactivate) {
      this.$.isActive.setDisabled(!canDeactivate);

      return true;
    }
  });

  XV.registerModelWorkspace("XM.SalesCategory", "XV.SalesCategoryWorkspace");

}());
