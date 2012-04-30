
XT.Package = SC.Package.extend(
  /** @lends XT.Package.prototype */ {

  loadJavaScriptForPackage: function(packageName) {
    var package = SC.PACKAGE_MANIFEST[packageName];
    var log = this.log;
    var self = this;
    
    BUILDER_SOCKET.emit('fetch', { request: 'package', package: packageName }, 
    function(content) {
      package.source = content;
      SC.run(function() {
        self._sc_packageDidLoad(packageName);
      });
    });
  }

});
