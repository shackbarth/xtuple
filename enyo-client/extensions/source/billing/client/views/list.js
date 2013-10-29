/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

XT.extensions.billing.initLists = function () {

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

  // ..........................................................
  // RECEIVABLES
  //

  enyo.kind({
    name: "XV.ReceivableList",
    kind: "XV.List",
    label: "_receivables".loc(),
    collection: "XM.ReceivableListItemCollection",
    published: {
      newActions: [
        {name: "creditMemo", label: "_creditMemo".loc(), attributes: {
          documentType: XM.Receivable.CREDIT_MEMO
        }},
        {name: "debitMemo", label: "_debitMemo".loc(), attributes: {
          documentType: XM.Receivable.DEBIT_MEMO
        }}
      ]
    },
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "documentType", formatter: "formatDocumentType"}
          ]},
          {kind: "XV.ListColumn", classes: "third", components: [
            {kind: "XV.ListAttr", attr: "isPosted", formatter: "formatPosted"}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "documentNumber"}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "customer"}
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
    }
  });

  XV.registerModelList('XM.Receivable', 'XV.ReceivableList');
};
