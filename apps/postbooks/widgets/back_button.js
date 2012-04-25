// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('widgets/button');

Postbooks.BackButton = Postbooks.Button.extend({

  displayName: function() {
    return '\u2190 '+this.get('name');
  }.property('name')

});
