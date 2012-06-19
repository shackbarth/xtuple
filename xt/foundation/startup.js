
XT.StartupTask.addTask(function() {
  var options = {};
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XT.session.loadSessionObjects(XT.session.ALL, options);
});