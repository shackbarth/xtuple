
XT.Response = SC.Object.extend(
  /** @lends XT.Response.prototype */ {

  init: function() {
    arguments.callee.base.apply(this, arguments);
    var raw = this.get('rawResponse');
    this.set('data', raw.data);
    this.set('code', raw.code);
  },

  body: function() {
    var data = this.get('data');
    return data;
  }.property('data').cacheable(),

  error: function() {
    var data = this.get('data');
    data.error = data;
    return data;
  }.property('data').cacheable(),

  data: null,

  code: null,

  rawResponse: null

});
