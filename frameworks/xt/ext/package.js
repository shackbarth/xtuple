
XT.Package = SC.Package.extend(
  /** @lends XT.Package.prototype */ {

  loadJavaScript: function(packageName) {
    return arguments.callee.base.apply(this, arguments);
  }

});
