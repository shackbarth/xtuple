
(function () {
  "use strict";
  XM.RestCollection = Backbone.Collection.extend({

    //
    // Our Google-style REST API doesn't provide the data in the exact way that
    // backbone is used to, but it's real close and the mapping is easy
    //
    parse: function (response) {
      return response.data.data;
    },

    //
    // Describe the location of the REST endpoint
    //
    url: function () {
      // let's keep the concept of recordType, but map the PascalCase to the
      // the armadillo-case that our REST service expects
      var recordType = this.model.prototype.recordType.substring(3);
      var path = XT.String.decamelize(recordType).replace(/_/g, "-");
      return XT.getOrganizationPath() + "/browser-api/v1/resources/" + path;
    }
  });

})();

