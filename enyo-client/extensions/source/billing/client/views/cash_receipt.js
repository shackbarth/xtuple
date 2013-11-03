XT.extensions.billing.initCashReceiptView = function () {

  var model = 'XM.CashReceipt';

  /**
   * View of a SalesCategory business object.
   * @class XM.CashReceiptView
   */
  XM.CashReceiptView = XM.EnyoView.extend({

    events: {
      'view:notify': 'doNotify'
    },

    item: {
      model: model + 'ListItem',
      template: [
        [
          {attr: 'number', colspan: 2},
          {attr: 'isPosted', formatter: 'formatIsPosted', colspan: 2},
          {attr: 'amount'},
          {attr: 'distributionDate'}
        ],
        [
          {attr: 'customer.name', colspan: 2},
          {attr: 'fundsType', formatter: 'formatFundsType', colspan: 2}
        ]
      ]
    },

    list: {
      model: model + 'ListItem',
      printable: true,
      query: {
        orderBy: [
          {attribute: 'distributionDate', descending: true},
          {attribute: 'documentNumber'}
        ]
      },
      parameters: [
        {category: '_cashReceipts'.loc(), parameters: [
          {label: '_number'.loc()}
        ]},
        {category: '_show'.loc(), parameters: [
          {label: '_unposted'.loc(), default: false }
        ]},
        {category: '_customer'.loc(), parameters: [
          {label: '_number'.loc()},
          {label: '_type'.loc(), type: 'enum'},
          {label: '_typePattern'.loc()},
          {label: '_group'.loc()}
        ]},
        {category: '_documentDate'.loc(), parameters: [
          {label: '_fromDate'.loc()},
          {label: '_toDate'.loc()}
        ]}
      ],
      actions: [
        {name: 'post', prerequisite: 'canPost', method: 'post'},
        {name: 'void', prerequisite: 'canVoid', method: 'void'},
        {name: 'delete', prerequisite: 'canDelete', method: 'delete'}
      ]
    },

    workspace: {
      model: model,
      template: [

      ]
    }

  });
};

