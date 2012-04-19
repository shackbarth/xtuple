
XT.Response = SC.Object.extend(
  /** @lends XT.Response.prototype */ {

  init: function() {
    arguments.callee.base.apply(this, arguments);
    var raw = this.get('rawResponse');
    var data;
    try {
      data = SC.json.decode(raw.data);
    } catch (err) {
      data = raw.data;
    }

    if (data.isError) {
      this.error = data;
    } else {
      this.set('data', data);
      this.code = raw.code;
    }
  },

  body: function() {
    if (this.error) {
      return this.error;
    } else {
      return this.get('data') || {};
    }
  }.property('data').cacheable(),

  data: null,

  code: null,

  error: null,

  rawResponse: null

});
