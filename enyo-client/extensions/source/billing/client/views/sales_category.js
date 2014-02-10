XT.extensions.billing.initSalesCategoryView = function () {

  var model = 'XM.SalesCategory';

  /**
   * View of a SalesCategory business object.
   * @author travis@xtuple.com
   */
  XM.SalesCategoryView = XM.EnyoView.extend({

    /**
     * @listens change:canDeactivate  @fires onCanDeactivateChanged
     * @listens change:isActive       @fires onIsActiveChanged
     */
    events: {
      'change:canDeactivate': 'onCanDeactivateChange',
      'change:isActive'     : 'onIsActiveChange',
      'status:READY_CLEAN':   'onModelReadyClean'
    },

    item: {
      model: model,
      template: [
        [ {attr: 'name'}, {attr: 'description'} ]
      ]
    },

    list: {
      model: model,
      query: {
        orderBy: [
          {attribute: 'isActive', descending: true},
          {attribute: 'name'}
        ]
      },
      actions: [
        {
          name: 'deactivate',
          privilege: "MaintainSalesCategories",
          prerequisite: 'canDeactivate',
          method: 'deactivate'
        }
      ]
    },

    workspace: {
      model: model,
      template: [
        {title: '_overview'.loc(), template: [
          {attr: 'name'},
          {attr: 'description'},
          {attr: 'isActive', prerequisite: 'canDeactivate'}
        ]}
      ]
    }
  });
};
