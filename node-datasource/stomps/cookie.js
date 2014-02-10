// Stomp on Express's cookie serialize() to not send an "expires" value to the browser.
// This makes the browser cooke a "session" cookie that will never expire and only
// gets removed when the user closes the browser. We still set express.session.cookie.maxAge
// below so our persisted session gets an expires value, but not the browser cookie.
// See this issue for more details: https://github.com/senchalabs/connect/issues/328

exports.serialize = function (name, val, opt) {
  "use strict";

  // Need to add encode here for the stomp to work.
  var encode = encodeURIComponent;

  var pairs = [name + '=' + encode(val)];
  opt = opt || {};

  if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
  if (opt.domain) pairs.push('Domain=' + opt.domain);
  if (opt.path) pairs.push('Path=' + opt.path);
  // TODO - Override here, skip this.
  //if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
  if (opt.httpOnly) pairs.push('HttpOnly');
  if (opt.secure) pairs.push('Secure');

  return pairs.join('; ');
};
