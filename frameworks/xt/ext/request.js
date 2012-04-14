// ==========================================================================
// Project:   XT.Request
// Copyright: Â©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('ext/response');

/**
  @class

  Not intended to be a full-replacement for SC.Request and does not extend
  SC.Request. This class is designed to communicate with a node datasource
  via a web socket connection. There is a strict API as this is a proprietary
  abstraction and has limited applicability to other use cases.

  A request can be issued with a string/json payload to the datasource.
  It must have the correct namespace (if any) and event name else it will
  be ignored by the datasource. 

  A request should be invoked from the constructor by either calling
  XT.Request.issue("eventName") and chaining settings or XT.Request.create() and
  chaining settings.

  TODO: does not actually use a namespace.

*/
XT.Request = SC.Object.extend(
  /** @lends XT.Request.prototype */ {

  /**
    The method to call once the request has been
    sent and acknowledged by the datasource.

    @method
    @param {Object} target The context object from which
      to call the method.
    @param {String|Function} method The name of the method on
      the target to invoke or the function to invoke with
      the context.
    @returns {XT.Request} Receiver
  */
  notify: function(target, method) {
    var args = SC.A(arguments).slice(2);
    var func;
    var context;
    var callback;

    if (target instanceof Function) {
      func = target;
      if (typeof method === 'object') {
        context = method;
      } else {
        context = XT;
      }
    } else {
      func = target[method];
      context = target;
    }

    callback = function(response) {

      response = XT.Response.create({
        rawResponse: response
      });

      args.unshift(response);

      SC.run(function() {
        func.apply(context, args);
      });
    }

    this.callback = callback;
    return this;
  },

  socket: function() {
    return XT.socket;
  }.property().cacheable(),

  session: function() {
    return XT.session.get('details');
  }.property(),

  /**
     
  */
  event: function() {
    return this.get('issueEvent');
  }.property('issueEvent'),

  /**
    Flags the request as having a JSON payload. If no
    flag is provided it will be assumed the payload is
    JSON.

    @method
    @param {Boolean} [flag] true|false value for whether
      the payload should be interpreted as JSON.
  */
  json: function(flag) {
    if (flag === undefined) flag = true;
    return this.set('isJSON', flag);
  },

  send: function(payload) {
    var json = this.get('isJSON');
    var event = this.get('event');
    var socket = this.get('socket');
    var callback = this.get('callback');
    var ack = this.ack(callback, event);
    var session = this.get('session');
    var wrapper = {};
    if (json) {
      payload = SC.json.encode(payload);
    }
    wrapper.payload = payload;
    SC.mixin(wrapper, session.unmix());

    // console.log("EVENT", event);
    // console.log("WRAPPER => ", wrapper);
    // console.log(ack);
    // console.log(callback);

    socket.json.emit(event, wrapper, ack);
  },

  ack: function(callback, event) {
    return function(response, ack) {
      if (callback && callback instanceof Function) callback(response, ack);
    }
  },

  isJSON: false,

  issueEvent: 'message',
  callback: SC.K

});

SC.mixin(XT.Request,
  /** @lends XT.Request */ {

  /**
    @method
  */
  issue: function(namespace, event) {
    var req = this.create();
    if (namespace && (event === undefined)) {
      event = namespace;
      namespace = null;
    } else if (event === undefined && namespace === undefined) {
      event = 'message';
      namespace = null;
    }

    req.set('issueEvent', event);
    req.set('namespace', namespace);
    return req;
  }

});
