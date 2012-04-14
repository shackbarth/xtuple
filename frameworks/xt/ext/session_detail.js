
XT.SessionDetail = SC.Object.extend(SC.Freezable, SC.Copyable,
  /** @lends XT.SessionDetail.prototype */ {

  sid: null,
  username: null,
  password: null,
  lastModified: null,
  created: null,
  checksum: null,

  detailProperties: "sid username password lastModified created checksum organization".w(),

  unmix: function() {
    var properties = this.get('detailProperties');
    var key;
    var idx = 0;
    var unmixed = {};
    for (; idx < properties.length; ++idx) {
      key = properties[idx];
      unmixed[key] = this[key];
    }
    return unmixed;
  },

  destroy: function() {
    arguments.callee.base.apply(this, arguments);
    this.password = null;
  }

});
