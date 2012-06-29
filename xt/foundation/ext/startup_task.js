
(function(){
  var st = XT.StartupTask = function(inProps) {
    
    // defaults
    this._properties = {
      taskName: "",
      waitingList: [],
      isComplete: false,
      task: null
    };
    
    // custom props
    for (var key in inProps) {
      if (inProps.hasOwnProperty(key)) {
        this._properties[key] = inProps[key];
      }
    }
    
    if (!this.get("taskName") || this.get("taskName") === "") {
      this.set("taskName", _.uniqueId("xt_task_"));
    }
    
    XT.getStartupManager().registerTask(this);
  };
  
  st.prototype.get = function(key) {
    var properties = this._properties;
    var value = properties[key];
    return value;
  };
  
  st.prototype.set = function(key, value) {
    var properties = this._properties;
  
    if (typeof key === 'string' && value) {
      properties[key] = value;
    } else if (key && !value) {
      value = key;
      for (var prop in value) {
        if (value.hasOwnProperty(prop)) {
          this.set(prop, value[prop]);
        }
      }
    }
    return this;
  };
  
  st.prototype.checkWaitingList = function(inTaskName) {
    // check to see if this is one we're waiting for...
    //this.log(this.getTaskName(), arguments);
    var wl = this.get("waitingList");
    
    if (wl && wl.length > 0) {
      if (wl.indexOf(inTaskName) > -1) {
        //this.log(this.getTaskName(), "needs to remove %@ from waiting list".f(inTaskName));
        this.set("waitingList", ((wl = _.without(wl, inTaskName))));
        //this.log(this.getTaskName(), wl);
      }
    }
  };
  
  st.prototype.exec = function() {
    // execute the task
    //this.log(this.getTaskName());
    
    if (this.get("isComplete")) {
      //this.log("Called my exec again?");
      return true;
    }
    
    var task = this.get("task");
    if (!task || !(task instanceof Function)) {
      this.error("Could not execute without an actual task");
      return false;
    } else if (this.get("waitingList").length > 0) {
      //this.log(this.getTaskName(), "waiting on ", this.getWaitingList());
      return false;
    } else { 
      task.call(this);
      return true;
    }
  };
  
  st.prototype.didComplete = function() {
    //console.log("TASK COMPLETED: ", this.get("taskName"));
    this.set("isComplete", true);
    XT.getStartupManager().taskDidComplete(this);
  };
  
  st.create = function(inProps) {
    return new st(inProps);
  };
  
})();

(function() {
  
  var stm = XT.StartupTaskManager = function() {
    XT.getStartupManager = _.bind(function() {
      return this;
    }, this);
    
    this._properties = {
      queue: [],
      tasks: {},
      completed: [],
      isStarted: false,
      callbacks: []
    };
  };
  
  stm.prototype.get = function(key) {
    var properties = this._properties;
    var value = properties[key];
    return value;
  };
  
  stm.prototype.set = function(key, value) {
    var properties = this._properties;
  
    if (typeof key === 'string' && value) {
      properties[key] = value;
    } else if (key && !value) {
      value = key;
      for (var prop in value) {
        if (value.hasOwnProperty(prop)) {
          this.set(prop, value[prop]);
        }
      }
    }
    return this;
  }; 
  
  stm.prototype.registerTask = function(task) {
    var name = task.get("taskName");
    var tasks = this.get("tasks");
    var queue = this.get("queue");
    if (!tasks[name]) {
      tasks[name] = {
        task: task
      };
    }
    
    if (this.get("isStarted")) {
      task.exec();
    } else {
      queue.push(task);
    }
  };
  
  stm.prototype.taskDidComplete = function(inTask) {
    var taskName = inTask.get("taskName");
    var completed = this.get("completed");
    var tasks = this.get("tasks");
    var task;
    var entry;
    var num = Object.keys(tasks).length;
    
    completed.push(taskName);
    
    for (task in tasks) {
      if (tasks.hasOwnProperty(task)) {
        entry = tasks[task];
        task = entry.task;
        if (task.get("isComplete")) {
          continue;
        }
        task.checkWaitingList(taskName);
      }
    }
    
    if (num > completed.length) {
      this.start();
    } else {
      // we're all done
      this.allDone();
    }
  };
  
  stm.prototype.start = function() {
    if (this.get("isStarted")) {
      return false;
    }
    
    var queue = this.get("queue");
    var re = [];
    var idx = 0;
    var task;
    var len = queue.length;
    
    if (!queue || queue.length <= 0) {
      this.set("isStarted", true);
      return;
    }
    
    for (; idx < len; ++idx) {
      task = queue.shift();
      if (!task.exec()) {
        re.push(task);
      }
    }
    
    if (re.length > 0) {
      this.set("queue", re);
    } else {
      this.start();
    }
  };
  
  stm.prototype.registerCallback = function(callback) {
    var callbacks = this.get("callbacks") || [];
    callbacks.push(callback);
  };
  
  stm.prototype.allDone = function() {
    var callbacks = this.get("callbacks") || [];
    while (callbacks.length > 0) {
      var cb = callbacks.shift();
      if (cb && cb instanceof Function) {
        cb();
      }
    }
  };
  
  new XT.StartupTaskManager();
  
})();