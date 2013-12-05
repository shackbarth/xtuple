// date format: 2013-12-03T00:00:00.000Z
(function () {
  'use strict';

  var Query = require('./query'),
    SourceQuery = require('./source_query'),
    isValidDate = _.isValidDate([
      moment.defaultFormat
    ]);

  /**
   * @class RestQuery
   */
  function SocketQuery (query) {
    SocketQuery.call(this, SocketQuery.template, query);
  }

})();
