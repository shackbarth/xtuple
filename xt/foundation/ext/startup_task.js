

enyo.mixin(XT,
  /** */ {
    
  _startupTasks: [],
  
  _startupCompleted: false,
  
  _startupListeners: []
  

});


enyo.kind(
  /** */ {

  name: "XT.StartupTaskManager",
  
  kind: "Component",
  
  addTask: function(task) {
    if (XT._startupCompleted) {
      if (task instanceof Function) {
        task();
      }
    } else {
      XT._startupTasks.push(task);
    }
  },
  
  addListener: function(listener, method) {
    var callback;
    
    if (listener && method) {
      if (listener[method] instanceof Function) {
        callback = listener[method];
      }
    } else if (listener && !method && listener instanceof Function) {
      callback = listener;
    }
    
    if (XT._startupCompelted) {
      callback();
    } else {
      XT._startupListeners.push(callback);
    }

  },
  
  flush: function() {
    var tasks;
    var task;
    var idx = 0;
    
    if (XT._startupCompleted) {
      
      enyo.log("Flush called for startup tasks but already completed");
      
      return;
    } else if (XT._startupTasks.length <= 0) {
      
      enyo.log("No startup tasks to issue");
      
      return;
    } else {
      
      enyo.log("Flushing startup tasks");
      
      tasks = XT._startupTasks;
      for (; idx < tasks.length; ++idx) {
        task = tasks[idx];
        if (task && task instanceof Function) {
          task();
        }
      }
    }
  },
  
  taskComplete: function() {    
    if (XT._startupCompleted) {
      return;
    }
    
    if (XT._startupTasks.length <= 0) {
      return;
    }
    
    XT._startupTasks.pop();
    
    if (XT._startupTasks.length === 0) {
      XT._startupComplete = true;
      this.notifyCompleted();
    }
  },
  
  notifyCompleted: function() {
    var listeners = XT._startupListeners;
    var idx = 0;
    var listener;
    if (listeners && listeners.length > 0) {
      for (; idx < listeners.length; ++idx) {
        listener = listeners[idx];
        if (listener && listener instanceof Function) {
          listener();
        }
      }
    }
  }
    
});

XT.StartupTask = new XT.StartupTaskManager();