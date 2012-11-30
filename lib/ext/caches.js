(function () {
  X.userCache = X.Cache.create({prefix: "users"});
  X.sessionCache = X.Cache.create({
    prefix: "session",
    init: function () {
      this._super.init.call(this);
      X.Session.cache = this;
    }
  });
  X.proxyCache = X.Cache.create({prefix: "proxy"});
}());