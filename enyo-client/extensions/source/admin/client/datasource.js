/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.admin.initDatasource = function () {

    /*
      Sends a request to node to synchronize a user to an instance database

      @param {Object} payload
      @param {String} payload.username
      @param {String} payload.organization
      @param {String} payload.group
      @param {String} payload.active
      @param {String} payload.propername
      @param {String} payload.email
    */
    XT.DataSource.syncUser = function (payload, options) {
      var that = this,
        ajax = new enyo.Ajax({
          url: "/syncUser",
          success: options ? options.success : undefined,
          error: options ? options.error : undefined
        });

      ajax.response(this.ajaxSuccess);
      ajax.go(payload);
    };

    /*
      Run the db maintenance script to sync the organization instance database

      @param {Object} payload
      @param {String} payload.organization
      @param {Boolean} payload.initialize
      @param {Array} payload.extensions
    */
    XT.DataSource.runMaintenance = function (payload, options) {
      var that = this,
        ajax = new enyo.Ajax({
          url: "/maintenance",
          success: options ? options.success : undefined,
          error: options ? options.error : undefined
        });

      ajax.response(this.ajaxSuccess);
      ajax.go(payload);
    };
  };

}());
