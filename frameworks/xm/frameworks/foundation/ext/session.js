// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
sc_require('ext/store');
sc_require('ext/dispatch');
sc_require('ext/data_source');
/** @instance

An object that contains user login information for quick access at run time.

  @extends SC.Object
*/

XM.session = SC.Object.create({

  METRICS:              0x0100,
  PRIVILEGES:           0x0200,
  LOCALE:               0x0400,
  ALL:                  0x0100 | 0x0200 | 0x0400,

  privileges: null,
  
  store: XM.store,

  /**
  Loads session objects for metrics, preferences and privileges into local memory.
  Types XM.session.METRICS, XM.session.LOCALE or types XM.session.PRIVILEGES
  can be passed as bitwise operators. If no arguments are passed the default is
  XM.session.ALL which will load all session objects.
  */
  load: function(types) {
    var self = this,
        store = this.get('store');
    
    if(types === undefined) types = this.ALL;

    if(types & this.PRIVILEGES) {
      var dispatch,
          callback = self.didFetchPrivileges,
        
      dispatch = XM.Dispatch.create({
        className: 'XM.Session',
        functionName: 'privileges',
        target: self,
        action: callback
      });

      store.dispatch(dispatch);
    }

    if(types & this.METRICS) {
      var dispatch,
          callback = self.didFetchMetrics,
      
      dispatch = XM.Dispatch.create({
        className: 'XM.Session',
        functionName: 'metrics',
        target: self,
        action: callback
      });

      store.dispatch(dispatch);
    }

    if(types & this.LOCALE) {
      var dispatch,
          callback = self.didFetchLocale
      
      dispatch = XM.Dispatch.create({
        className: 'XM.Session',
        functionName: 'locale',
        target: self,
        action: callback
      });

      store.dispatch(dispatch);
    }

    return YES;
  },

  didFetchMetrics: function(error, response) {
    // Create an object for metrics
    var metrics = SC.Object.create({
      // Return false if property not found
      get: function(key) {
        for(prop in this) {
          if(prop === key) return this[prop];
        }

        return NO;
      },
      
      set: function(key, value) {
        this._changed.push(key);
        
        arguments.callee.base.apply(this, arguments);
      },
      
      _changed: []
      
    });

    // Loop through the response and set a metric for each found
    response.forEach(function(item) {
      var value = item.value

      // Cast to boolean where appropriate
      if(value === 't') value = YES;
      else if(value == 'f') value = NO;

      metrics.set(item.metric, value);
    });

    metrics._changed = [];
    
    // Attach the metrics to the session object
    this.set('metrics', metrics);

    return YES
  },

  didFetchPrivileges: function(error, response) {
    // Create a special object for privileges where the get function returns NO if it can't find the key
    var privileges = SC.Object.create({
      get: function(key) {
        if(typeof key === 'boolean') return key;
        
        for(prop in this) {
          if(prop === key) return this[prop];
        }

        return NO;
      }
    });

    // Loop through the response and set a privilege for each found
    response.forEach(function(item) {
      privileges.set(item.privilege, item.isGranted);
    });

    // Attach the privileges to the session object
    this.set('privileges', privileges);

    return YES
  },

  didFetchLocale: function(error, response) {
    // Attach the locale to the session object
    this.set('locale', response);

    return YES
  },
  
  commitMetrics: function() {
    var m = this.get('metrics'),
        self = this, metrics = {}, 
        dispatch, store = this.get('store');
    
    if(!m || !m._changed || !m._changed.length) return;
    
    // build list of metrics that changed
    for(var i = 0; i < m._changed.length; i++) {
      metrics[m._changed[i]] = m.get(m._changed[i]);
    }
  
    // response handler
    callback = function(error, result) {
      if(!error) self.load(self.METRICS);
    }
  
    dispatch = XM.Dispatch.create({
      className: 'XM.Session',
      functionName: 'commitMetrics',
      parameters: metrics,
      target: self,
      action: callback
    });

    store.dispatch(dispatch);
    
  },
  
  init: function() {
    arguments.callee.base.apply(this, arguments);
    XM.DataSource.ready(this.load, this);  
  },
  
});



