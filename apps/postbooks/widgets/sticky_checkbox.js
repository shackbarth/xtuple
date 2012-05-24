// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert XT */

Postbooks.StickyCheckboxWidget = SC.CheckboxWidget.extend({

  stickKey: null,

  _pb_valueDidChange: function() {
    var stickyKey = this.get('stickyKey');
    if (stickyKey) SC.userDefaults.writeDefault(stickyKey, this.get('value'));
  }

});
