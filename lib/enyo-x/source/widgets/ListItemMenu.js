(function () {

  enyo.kind({
    name: 'XV.ListItemMenu',
    kind: 'onyx.IconButton',
    classes: 'xv-list-gear-icon-button',
    src: '/assets/menu-icon-gear.png',
    ontap: 'doListItemMenuTap',

    events: {
      onListItemMenuTap: '',
    }

  });

})();

