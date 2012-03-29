// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @mixin

  (Document your Model here)

  @version 0.1
*/


XM.Settings = {
  
  /**
    @type String
  */
  privilege: null,
  
  /** 
    Binding to global settings to which all properties on a settings object should bind to.
  */
  settingsBinding: SC.Binding.from('XT.session.settings').noDelay(),

  /** 
    Commit changes to settings properties to the server. Will dispatch to a function with
    the same class name as that of the class this mixin is used in with a function call
    of 'commitSettings.' There must be a matching function call on the server to receive the
    request.
  */
  commitSettings: function() {  
    var self = this,
        globalChanged = XM.session.getPath('settings.changed');
        changed = {},
        privilege = this.get('privilege');
        
    if(!XM.session.get('privileges').get(privilege)) return NO;

    for(var i = 0; i < self.getPath('_bindings.length'); i++) {
      var prop = self.get('_bindings').objectAt(i),
          key = self.get(prop)._fromPropertyKey.replace(/\w+\./i, '');

      if(key !== 'settings' && globalChanged.indexOf(key) > -1) {
        changed[key] = XT.session.settings.get(key);
      }
    }
    
    callback = function(error, result) {
      if(!error) {
        // Remove committed changes from array
        for(var prop in changed) {
          globalChanged.removeObject(prop);
        }
      }
    }
    
    dispatch = XM.Dispatch.create({
      className: self.get('className'),
      functionName: 'commitSettings',
      parameters: changed,
      target: self,
      action: callback
    });

    XT.store.dispatch(dispatch);
    
    return this;
  }
  
};


