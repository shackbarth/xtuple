
var _path   = require('path');
var _fs     = require('fs');

XT.Logger = XT.Object.extend(
  /** @scope XT.Logger.prototype */ {

  init: function() {
    var path = this.get('path');
    var current = new Date().getTime(); // TODO: need real date not millis
    var filename = _path.join(path, "%@.log".f(current));
    
    try {
      if (_path.existsSync(path)) {
        
      }
    } catch (err) {
      issue(XT.fatal("Could not find path to log files", err));
    }
  }
    
});