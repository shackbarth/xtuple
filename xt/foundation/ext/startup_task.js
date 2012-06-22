
enyo.kind({
  name: "XT.StartupTask",
  kind: "Component",
  published: {
    taskName: "",
    waitingList: [],
    isComplete: false,
    task: null
  },
  events: {
    onComplete:"",
    onNotifyDidComplete:""
  },
  handlers: {
    onComplete: "didComplete",
    onOtherTaskDidComplete: "checkWaitingList"
  },
  checkWaitingList: function(inSender, inTaskName) {
    // check to see if this is one we're waiting for...
    this.log(this.getTaskName(), arguments);
    var wl = this.getWaitingList();
    
    if (wl && wl.length > 0) {
      if (wl.indexOf(inTaskName) > -1) {
        this.log(this.getTaskName(), "needs to remove %@ from waiting list".f(inTaskName));
        this.setWaitingList((wl = _.without(wl, inTaskName)));
        this.log(this.getTaskName(), wl);
      }
    }
  },
  exec: function() {
    // execute the task
    this.log(this.getTaskName());
    
    if (this.getIsComplete()) {
      this.log("Called my exec again?");
      return true;
    }
    
    var task = this.getTask();
    if (!task || !(task instanceof Function)) {
      this.error("Could not execute without an actual task");
      return false;
    } else if (this.getWaitingList().length > 0) {
      this.log(this.getTaskName(), "waiting on ", this.getWaitingList());
      return false;
    } else { 
      task.call(this);
      return true;
    }
  },
  didComplete: function() {
    this.log(this.getTaskName());
    this.setIsComplete(true);
    this.doNotifyDidComplete();
  },
  create: function() {
    this.inherited(arguments);
    if (!this.getTaskName()) {
      this.setTaskName(_.uniqueId("xt_task_"));
    }
    XT.getStartupManager().registerTask(this);
  }
});

XT.StartupTask.create = function(inProps) {
  return new XT.StartupTask(inProps);
};

new (enyo.kind({
  name: "XT.StartupTaskManager",
  kind: "Component",
  published: {
    queue: [],
    tasks: {},
    completed: [],
    isStarted: false
  },
  create: function() {
    this.inherited(arguments);
    
    // create an accessible global that all
    // startup tasks can depend on
    XT.getStartupManager = enyo.bind(this, "_this");
  },
  registerTask: function(task) {
    var name = task.getTaskName();
    var tasks = this.getTasks();
    var queue = this.getQueue();
    if (!tasks[name]) {
      tasks[name] = {
        task: task
      };
      
      // we want to be able to send/receive events
      // through the chain
      task.setOwner(this);
      
      if (this.getIsStarted()) {
        
        this.log("this bitch was started yo");
        
        task.exec();
      } else {
        
        this.log("pushing %@ to the queue".f(task.getTaskName()));
        queue.push(task);
      }
    } else {
      this.log("Attempt to register task multiple times");
    }    
  },
  handlers: {
    onNotifyDidComplete: "taskDidComplete"
  },
  taskDidComplete: function(inEvent) {
    var taskName = inEvent.getTaskName();
    var completed = this.getCompleted();
    var tasks = this.getTasks();
    var task;
    var entry;
    var num = Object.keys(tasks).length;
    
    completed.push(taskName);
    
    this.log(taskName);
    
    for (task in tasks) {
      if (tasks.hasOwnProperty(task)) {
        entry = tasks[task];
        task = entry.task;
        if (task.getIsComplete()) {
          continue;
        }
        task.waterfall("onOtherTaskDidComplete", taskName, this);
      }
    }
    
    if (num > completed.length) {
      this.start();
    } else { this.log("All tasks have checked in"); }
  },
  start: function() {
    if (this.getIsStarted()) {
      return false;
    }
    
    var queue = this.getQueue();
    var re = [];
    var idx = 0;
    var task;
    var len = queue.length;
    
    this.log(queue);
    
    if (!queue || queue.length <= 0) {
      this.log("No tasks in queue");
      this.setIsStarted(true);
      return;
    }
    
    for (; idx < len; ++idx) {
      task = queue.shift();
      if (!task.exec()) {
        
        this.log("task %@ was not ready and is being re-added to queue".f(task.getTaskName()));
        re.push(task);
      }
    }
    
    if (re.length > 0) {
      this.setQueue(re);
    } else {
      
      // to let it auto-finish
      this.start();
    }
  },
  isCompleted: function(inTaskName) {
    var completed = this.getCompleted();
    var idx;
    if ((idx = completed.indexOf(inTaskName)) > -1) {
      return idx;
    } else { return false; }
  },
  _this: function() {
    return this;
  }
}))();