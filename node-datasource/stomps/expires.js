// Stomping on express/connect's Cookie.prototype to only update the expires property
// once a minute. Otherwise it's hit on every session check. This cuts down on chatter.
// See more details here: https://github.com/senchalabs/connect/issues/670
exports.expires = function (date) {
  "use strict";

  if (date === null || this._expires === null) {
    // Initialize "this._expires" when creating a new cookie.
    this._expires = date;
    this.originalMaxAge = this.maxAge;
  } else if (date instanceof Date) {
    // This captures a certain "set" call we are interested in.
    var expiresDate;

    if (typeof this._expires === 'string') {
      expiresDate = new Date(this._expires);
    }

    if (this._expires instanceof Date) {
      expiresDate = this._expires;
    }

    // If the difference between the new time, "date", and the old time, "this._expires",
    // is more than 1 minute, then we update it which updates the db and cache magically.
    // OR if they match, we need to update "this._expires" so it's a instanceof Date.
    //console.log("updates in: ", 60000 - (date - expiresDate));
    if ((date - expiresDate > 60000) || (JSON.stringify(date) === JSON.stringify(expiresDate))) {
      //console.log("expires updated: ", date - expiresDate);
      this._expires = date;
      this.originalMaxAge = this.maxAge;
    }
  }
};