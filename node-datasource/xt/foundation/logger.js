
var _path   = require('path');
var _fs     = require('fs');

/**
 Deals with logging.

 @class
 @extends X.Object
*/
X.Logger = X.Object.extend(/** @lends X.Logger */ {

  /**
   Initializes the logger.
  */
  init: function () {
    var path = this.get('path');
    var current = new Date().getTime(); // TODO: need real date not millis
    var filename = _path.join(path, "%@.log".f(current));

    try {
      if (_path.existsSync(path)) {

      }
    } catch (err) {
      issue(X.fatal("Could not find path to log files", err));
    }
  }

});
