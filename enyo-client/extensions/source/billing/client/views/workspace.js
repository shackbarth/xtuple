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
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
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
    view: 'XM.ReceivableView',
    events: {
      onPrint: ""
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.SalesCustomerWidget", attr: "customer"},
            {kind: "XV.DateWidget", attr: "documentDate"},
            {kind: "XV.DateWidget", attr: "dueDate"},
            {kind: "XV.ReceivableTypePicker", attr: "documentType"},
            {kind: "XV.InputWidget", attr: "documentNumber"},
            {kind: "XV.InputWidget", attr: "orderNumber"},
            {kind: "XV.ReasonCodePicker", name: "reasonCodePicker", attr: "reasonCode", documentType: null},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes"},
            {kind: "onyx.GroupboxHeader", content: "_options".loc()},
            {kind: "XV.StickyCheckboxWidget", label: "_printOnPost".loc(),
              name: "printOnPost"}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "settingsPanel", title: "_settings".loc(),
          components: [
          {kind: "onyx.GroupboxHeader", content: "_settings".loc()},
          {kind: "XV.ScrollableGroupbox", name: "settingsGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.BillingTermsPicker", attr: "terms"},
            {kind: "XV.SalesRepPicker", attr: "salesRep"},
            {kind: "XV.MoneyWidget",
              attr: {localValue: "amount", currency: "currency"},
              label: "_amount".loc(), effective: "documentDate"},
            {kind: "XV.MoneyWidget", attr: {localValue: "paid", currency: "currency"},
              label: "_paid".loc(), effective: "documentDate", currencyDisabled: true},
            {kind: "XV.MoneyWidget", attr: {localValue: "balance", currency: "currency"},
              label: "_balance".loc(), effective: "documentDate", currencyDisabled: true},
            {kind: "XV.MoneyWidget", attr: {localValue: "commission", currency: "currency"},
              label: "_commission".loc(), effective: "documentDate", currencyDisabled: true},
            // TODO: Move this under taxes
            {kind: "XV.MoneyWidget", attr: {localValue: "taxTotal"},
              label: "_taxTotal".loc(), name: "taxTotal", currencyShowing: false},
          ]}
        ]},
        {kind: "XV.ReceivableTaxBox", name: "taxes", attr: "taxes", title: "_taxes".loc()},
        {kind: "XV.ReceivableApplicationsListRelationsBox", attr: "applications", title: "_applications".loc()}
      ]}
    ],

    /**
      @see XM.ReceivableView
      @listens XM.ReceivableView#events
    */
    handlers: {
      onStatusChange: "statusChanged"
    },

    /**
      Only show taxes when the Receivable is not an invoice.

      Set DocumentType field on the ReasonCodePicker to handle
        filtering of ReasonCodes.
    */
    attributesChanged: function (model, options) {
      this.inherited(arguments);
      var documentType = this.value.get("documentType");
      if (!documentType) {
        return;
      }

      var isInvoice = documentType === XM.Receivable.INVOICE;
      this.$.taxTotal.setShowing(!isInvoice);
      this.$.taxes.setShowing(!isInvoice);

      if (documentType === XM.Receivable.CREDIT_MEMO) {
        this.$.reasonCodePicker.setDocumentType(XM.ReasonCode.CREDIT_MEMO);
      } else if (documentType === XM.Receivable.DEBIT_MEMO) {
        this.$.reasonCodePicker.setDocumentType(XM.ReasonCode.DEBIT_MEMO);
      }
    },

    /**
      The saveText property on the workspace will be 'Post' when
      the status of the object is READY_NEW and 'Save' for any other status.

      When the model is in a READY_NEW state a checkbox is visible
      that provides the option to 'Print on Post.'
    */
    statusChanged: function (inSender, inEvent) {
      var isNew = this.value.getStatus() === XM.Model.READY_NEW;
      if (isNew) {
        this.setSaveText("_post".loc());
      }
      this.$.printOnPost.setShowing(isNew);
    },

    /**
      When 'Print on Post' is checked,
      a standard form should be printed when posting.
    */
    save: function (options) {
      if (this.$.printOnPost.isChecked()) {
        this.doPrint();
      }
      this.inherited(arguments);
    }
  });

  XV.registerModelWorkspace("XM.Receivable", "XV.ReceivableWorkspace");
  XV.registerModelWorkspace("XM.ReceivableListItem", "XV.ReceivableWorkspace");

  enyo.kind({
    name: 'XV.SalesCategoryWorkspace',
    kind: 'XV.Workspace',
    model: 'XM.SalesCategory',
    view: 'XM.SalesCategoryView',
    title: '_salesCategory'.loc(),

    components: [
      {kind: 'Panels', arrangerKind: 'CarouselArranger',
        fit: true, components: [
        {kind: 'XV.Groupbox', name: 'mainPanel', components: [
          {kind: 'onyx.GroupboxHeader', content: '_overview'.loc()},
          {kind: 'XV.ScrollableGroupbox', name: 'mainGroup',
            classes: 'in-panel', components: [
            {kind: 'XV.InputWidget', attr: 'name'},
            {kind: 'XV.InputWidget', attr: 'description'},
            {kind: 'XV.CheckboxWidget', name: 'isActive', attr: 'isActive', disabled: true}
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

  XV.registerModelWorkspace('XM.SalesCategory', 'XV.SalesCategoryWorkspace');

  /**
   * @class XV.CashReceiptWorkspace
   * @extends XV.Workspace
   * @presents XM.CashReceiptView
   */
  enyo.kind({
    name: 'XV.CashReceiptWorkspace',
    kind: 'XV.Workspace',
    view: 'XM.CashReceiptView',
    model: 'XM.CashReceipt',
    title: '_cashReceipt'.loc(),
    components: [
      {kind: 'Panels', arrangerKind: 'CarouselArranger',
          fit: true, components: [
        {kind: 'XV.Groupbox', name: 'mainPanel', components: [
          {kind: 'onyx.GroupboxHeader', content: '_overview'.loc()},
          {kind: 'XV.ScrollableGroupbox', name: 'mainGroup',
              classes: 'in-panel', components: [
            {kind: 'XV.InputWidget', attr: 'number'},
            {kind: 'XV.CheckboxWidget', attr: 'isPosted', label: '_posted'.loc()},
            {kind: 'XV.SalesCustomerWidget', attr: 'customer'},
            {kind: 'XV.BankAccountWidget', attr: 'bankAccount'},
            {kind: 'XV.FundsTypePicker', attr: 'fundsType', onSelect: 'fundsTypeSelected'},
            {kind: 'XV.CashReceiptApplyOptionsPicker',
              attr: 'useCustomerDeposit',
              onSelect: 'applyOptionSelected'
            },
            {tag: 'hr'},
            {kind: 'XV.DateWidget', attr: 'documentDate'},
            {kind: 'XV.DateWidget', attr: 'distributionDate'},
            {kind: 'XV.DateWidget', attr: 'applicationDate'},
            {tag: 'hr'},
            {kind: 'XV.MoneyWidget',
              name: 'balance',
              label: '_balance'.loc(),
              attr: { localValue: 'balance', currency: 'currency' },
              disableCurrency: true
            },
            {kind: 'XV.MoneyWidget',
              label: '_amount'.loc(),
              attr: { localValue: 'amount', currency: 'currency' },
              disableCurrency: true
            },
            {kind: 'XV.MoneyWidget',
              label: '_appliedAmount'.loc(),
              attr: { localValue: 'appliedAmount', currency: 'currency' },
              disableCurrency: true
            },
            {kind: 'onyx.GroupboxHeader', content: '_notes'.loc()},
            {kind: 'XV.TextArea', attr: 'notes'},
          ]}
        ]},
        {kind: 'XV.CashReceiptApplicationsBox', attr: 'lineItems'},
        {kind: 'XV.CreditCardBox', attr: 'customer.creditCards'}
      ]}
    ],

    /**
     * @see XM.CashReceiptView
     * @fires XM.CashReceiptView#events
     */
    handlers: {
      onDateChange: 'dateChanged',
      onBalanceChange: 'balanceChanged',
      newItem: 'newCashReceiptLineTapped'
    },

    newCashReceiptLineTapped: function (inSender, inEvent) {
      this.log(inEvent);
    },

    /**
     * @listens onBalanceChange
     */
    balanceChanged: function (inSender, inEvent) {
      this.$.balance.addRemoveClass('xv-balance-negative', this.value.get('balance') < 0);
    },

    /**
     * @listens onDateChange
     */
    dateChanged: function (inSender, inEvent) {
      // XXX also the DateWidget is broken and is mangling the dates. there seems
      // to be an off-by-one error in both directions, maybe it's a timezone issue.
      // #bug
      //
      // XXX I don't think this code makes sense. I need to revisit the spec
      // and figure out what's going on here
      /*
      if (moment(this.value.get('distributionDate'))
          .isBefore(this.value.get('applicationDate'))) {
        this.$.fundsTypePicker.setLabel('_recordReceiptAs'.loc());
      }
      else {
        this.$.fundsTypePicker.setLabel('_applyBalanceAs'.loc());
      }
      */
    }

  });

  XV.registerModelWorkspace('XM.CashReceipt', 'XV.CashReceiptWorkspace');
  XV.registerModelWorkspace('XM.CashReceiptRelation', 'XV.CashReceiptWorkspace');
  XV.registerModelWorkspace('XM.CashReceiptListItem', 'XV.CashReceiptWorkspace');

  /**
   * @class XV.CashReceiptReceivableWorkspace
   * @extends XV.Workspace
   * @presents XM.CashReceiptView
   */
  enyo.kind({
    name: 'XV.CashReceiptReceivableWorkspace',
    kind: 'XV.Workspace',
    view: 'XM.CashReceiptView',
    title: '_cashReceiptReceivable'.loc(),

    components: [
      {kind: 'Panels', arrangerKind: 'CarouselArranger',
          fit: true, components: [
        {kind: 'XV.Groupbox', name: 'mainPanel', components: [
          {kind: 'onyx.GroupboxHeader', content: '_overview'.loc()},
          {kind: 'XV.ScrollableGroupbox', name: 'mainGroup',
              classes: 'in-panel', components: [
            {kind: 'XV.InputWidget', attr: 'number'}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace('XM.CashReceiptLineListItem', 'XV.CashReceiptReceivableWorkspace');

}());
