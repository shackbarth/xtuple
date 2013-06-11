/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XV:true, Backbone:true, _:true */

(function () {
  "use strict";

  var st = XT.StartupTask = function (inProps) {
    var key;

    // defaults
    this._properties = {
      taskName: "",
      waitingList: [],
      isComplete: false,
      task: null
    };

    // custom props
    for (key in inProps) {
      if (inProps.hasOwnProperty(key)) {
        this._properties[key] = inProps[key];
      }
    }

    if (!this.get("taskName") || this.get("taskName") === "") {
      this.set("taskName", _.uniqueId("xt_task_"));
    }

    XT.getStartupManager().registerTask(this);
  };

  st.prototype.get = function (key) {
    var properties = this._properties,
      value = properties[key];
    return value;
  };

  st.prototype.set = function (key, value) {
    var properties = this._properties,
      prop;

    if (typeof key === 'string' && value) {
      properties[key] = value;
    } else if (key && !value) {
      value = key;
      for (prop in value) {
        if (value.hasOwnProperty(prop)) {
          this.set(prop, value[prop]);
        }
      }
    }
    return this;
  };

  st.prototype.checkWaitingList = function (inTaskName) {
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

  st.prototype.exec = function () {
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
    }
    if (this.get("waitingList").length > 0) {
      //this.log(this.getTaskName(), "waiting on ", this.getWaitingList());
      return false;
    }
    task.call(this);
    return true;

  };

  st.prototype.didCompleteCache = function (cache, cacheName) {
    var recordType, storeCollection;

    recordType = cache.model.prototype.recordType;

    storeCollection = _.find(Backbone.Relational.store._collections, function (coll) {
      return coll.model && coll.model.prototype.recordType === recordType;
    });

    XV.registerModelCache(recordType, cacheName);

    if (!storeCollection) {
      // Backbone-relational won't put a collection into the store if it has no models
      // We really do need the collection in there, though, to bind with right now
      // so force it in there.
      storeCollection = Backbone.Relational.store._createCollection(cache.model);
    }

    storeCollection.on("statusChange", cache.autoSync, cache);

    this.set("isComplete", true);
    XT.getStartupManager().taskDidComplete(this);
  };

  st.prototype.didComplete = function () {
    this.set("isComplete", true);
    XT.getStartupManager().taskDidComplete(this);
  };

  st.create = function (inProps) {
    return new XT.StartupTask(inProps);
  };

}());

(function () {
  "use strict";

  var stm = XT.StartupTaskManager = function () {
    XT.getStartupManager = _.bind(function () {
      return this;
    }, this);

    this._properties = {
      queue: [],
      tasks: {},
      completed: [],
      isStarted: false,
      callbacks: [],
      eachCallbacks: []
    };
  }, manager;

  stm.prototype.get = function (key) {
    var properties = this._properties,
      value = properties[key];
    return value;
  };

  stm.prototype.set = function (key, value) {
    var properties = this._properties,
      prop;

    if (typeof key === 'string' && value) {
      properties[key] = value;
    } else if (key && !value) {
      value = key;
      for (prop in value) {
        if (value.hasOwnProperty(prop)) {
          this.set(prop, value[prop]);
        }
      }
    }
    return this;
  };

  stm.prototype.registerTask = function (task) {
    var name = task.get("taskName"),
      tasks = this.get("tasks"),
      queue = this.get("queue");
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

  stm.prototype.taskDidComplete = function (inTask) {
    var taskName = inTask.get("taskName"),
      completed = this.get("completed"),
      callbacks = this.get("eachCallbacks") || [],
      i,
      cb,
      tasks = this.get("tasks"),
      task,
      entry,
      num = Object.keys(tasks).length;

    completed.push(taskName);

    for (i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb && cb instanceof Function) {
        cb();
      }
    }

    for (task in tasks) {
      if (tasks.hasOwnProperty(task)) {
        entry = tasks[task];
        task = entry.task;
        if (!task.get("isComplete")) {
          task.checkWaitingList(taskName);
        }
      }
    }

    if (num > completed.length) {
      this.start();
    } else {
      // we're all done
      this.allDone();
    }
  };

  stm.prototype.start = function () {
    if (this.get("isStarted")) {
      return false;
    }

    var queue = this.get("queue"),
      re = [],
      idx,
      task,
      len = queue.length;

    if (!queue || queue.length <= 0) {
      this.set("isStarted", true);
      return;
    }

    for (idx = 0; idx < len; idx += 1) {
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

  stm.prototype.registerCallback = function (callback, onEach) {
    var callbacks = onEach ? this.get("eachCallbacks") : this.get("callbacks");
    callbacks.push(callback);
  };

  stm.prototype.allDone = function () {
    var callbacks = this.get("callbacks") || [],
      cb;
    while (callbacks.length > 0) {
      cb = callbacks.shift();
      if (cb && cb instanceof Function) {
        cb();
      }
    }
  };

  manager = new XT.StartupTaskManager();

}());
