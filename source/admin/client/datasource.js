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
        complete = function (response) {
          var params = {}, error;

          // handle error
          if (response.isError) {
            if (options && options.error) {
              params.error = response.message;
              error = XT.Error.clone('xt1001', { params: params });
              options.error.call(that, error);
            }
            return;
          }

          // handle success
          if (options && options.success) {
            options.success.call(that, response.data);
          }
        };

      return XT.Request
               .handle('function/syncUser')
               .notify(complete)
               .send(payload);
    };
  };

}());
