(function () {
  'use strict';

  /**
   * @namespace bi
   */
  XM.bi = { };

  /**
   * @class Report
   */
  XM.bi.Report = Backbone.Model.extend({

    handlers: {
      'print email': 'handleAction'
    },

    urlRoot: '/generate-report',
    
    /**
     * @override
     */
    url: function (action) {
      var model = this.get('entity'),
        kind = this.editableModel || this.recordType,
        url = this.urlRoot + "?nameSpace=%@&type=%@&id=%@"
        .f(kind.prefix(), kind.suffix(), model.id);

      if (action) {
        url += "&action=" + action;
      }

      return url;
    },

    /**
     * @override
     */
    toJSON: function (action) {
      var kind = this.editableModel || this.recordType;
      return {
        nameSpace: kind.prefix(),
        type: kind.suffix(),
        id: this.id,
        action: action
      };
    },

    /**
     * Perform an action on this report.
     *
     * @listens print
     * @listens email
     */
    handleAction: function (action) {
      XT.dataSource.callRoute("generate-report", this.toJSON(action), {
        success: _.bind(this.trigger, this, action + ':success'),
        error: _.bind(this.trigger, this, action + ':error'),
      });
    },

    /**
     * @param entity 
     */
    initialize: function (entity) {
      this.set('entity', entity);
    }
  });

  /**
   * @mixin ReportMixin
   *
   * XXX compatibility shim; functionally unecessary
   * TODO #refactor
   */
  XM.bi.ReportMixin = {
    doEmail: function () {
      return new XM.bi.Report(this).trigger('email');
    },
    doPrint: function () {
      return new XM.bi.Report(this).trigger('print');
    },
    getReportUrl: function (action) {
      return new XM.bi.Report(this).url(action);
    }
  };
})();
