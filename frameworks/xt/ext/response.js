
XT.Response = SC.Object.extend(
  /** @lends XT.Response.prototype */ {

  init: function() {
    arguments.callee.base.apply(this, arguments);
    var raw = this.get('rawResponse');
    var data;
  
    data = raw.data;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (err) {
        throw new Error("Could not parse payload response from datasource, " + raw.data);
      }
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
