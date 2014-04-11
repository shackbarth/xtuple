XT.extensions.billing.initLists = function () {
  'use strict';

  /**
   * @class XV.SalesCategory
   * @see XM.SalesCategoryCollection
   */
  enyo.kind({
    name: 'XV.SalesCategoryList',
    kind: 'XV.List',
    view: 'XM.SalesCategoryView',
    label: '_salesCategories'.loc(),
    collection: 'XM.SalesCategoryCollection',
    components: [
      {kind: 'XV.ListItemDecorator', components: [
        {name: 'listItem', kind: 'XV.SalesCategoryListItem'}
      ]}
    ]

  });

  XV.registerModelList('XM.SalesCategory', 'XV.SalesCategoryList');

  /**
   * @class XV.CashReceiptList
   * @see XM.CashReceiptListItemCollection
   */
  enyo.kind({
    name: 'XV.CashReceiptList',
    kind: 'XV.List',
    view: 'XM.CashReceiptView',
    label: '_cashReceipts'.loc(),
    collection: 'XM.CashReceiptListItemCollection',
    parameterWidget: 'XV.CashReceiptListParameters',
    components: [
      {kind: 'XV.ListItemDecorator', components: [
        {name: 'listItem', kind: 'XV.CashReceiptListItem'}
      ]}
    ]
  });
  XV.registerModelList('XM.CashReceiptListItem', 'XV.CashReceiptList');

  //
  // ..........................................................
  // RECEIVABLES
  //

  enyo.kind({
    name: "XV.ReceivableList",
    kind: "XV.List",
    view: 'XM.ReceivableView',
    label: "_receivables".loc(),
    collection: "XM.ReceivableListItemCollection",
    parameterWidget: "XV.ReceivableListParameters",
    allowPrint: true,
    multiSelect: true,
    showDeleteAction: false,
    query: {orderBy: [
      {attribute: 'documentNumber'}
    ]},
    newActions: [
      {name: "creditMemo", label: "_miscCreditMemo".loc(), allowNew: false, defaults: {
        documentType: XM.Receivable.CREDIT_MEMO
      }},
      {name: "debitMemo", label: "_miscDebitMemo".loc(), allowNew: false, defaults: {
        documentType: XM.Receivable.DEBIT_MEMO
      }}
    ],
    actions: [
      {name: "open", privilege: "ViewAROpenItems", prerequisite: "canOpen",
        method: "openReceivable", notify: false, isViewMethod: true}
    ],
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "documentType", formatter: "formatDocumentType"}
          ]},
          {kind: "XV.ListColumn", classes: "third", components: [
            {kind: "XV.ListAttr", attr: "isPosted", formatter: "formatPosted"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "documentNumber"}
          ]},
          {kind: "XV.ListColumn", classes: "descr", components: [
            {kind: "XV.ListAttr", attr: "customer.name"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "documentDate"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "dueDate"} // format this
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "amount", formatter: "formatMoney"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "paid", formatter: "formatMoney"}
          ]},
          {kind: "XV.ListColumn", classes: "money", components: [
            {kind: "XV.ListAttr", attr: "balance", formatter: "formatMoney"}
          ]}
        ]}
      ]}
    ],
    /**
      Format the money fields with the specified
        currency on the model.
    */
    formatMoney: function (value, view, model) {
      var currency = model ? model.get("currency") : false,
        scale = XT.locale.moneyScale;
      return currency ? currency.format(value, scale) : "";
    },
    /**
      Set the text value that is associated with the
        letter document type.
    */
    formatDocumentType: function (value, view, model) {
      var K = XM.Receivable,
        type = model ? model.get('documentType') : null;
      // TODO: change color depending on type
      switch (type) {
      case K.INVOICE:
        return "_invoice".loc();
      case K.DEBIT_MEMO:
        return "_debitMemo".loc();
      case K.CREDIT_MEMO:
        return "_creditMemo".loc();
      case K.CUSTOMER_DEPOSIT:
        return "_customerDeposit".loc();
      }
      return "";
    },
    formatPosted: function (value, view, model) {
      var posted = model ? model.get('isPosted') : null;
      return posted ? "_yes".loc() : "_no".loc();
    },
    openReceivable: function (inEvent) {
      var model = inEvent.model;

      this.doWorkspace({
        workspace: this.getWorkspace(),
        id: model.id,
        allowNew: false
      });
    }
  });

  XV.registerModelList('XM.Receivable', 'XV.ReceivableList');

};
