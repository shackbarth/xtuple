(function () {

  XM.SalesCategoryView = XM.ModelView.extend({

    events: XM.ModelView.events.extend({
      'change:canDeactivate': 'onCanDeactivateChange',
      'change:isActive': 'onIsActiveChange'
    })
  });

})();
