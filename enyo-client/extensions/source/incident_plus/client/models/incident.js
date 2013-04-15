/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.incidentPlus.initIncidentModels = function () {

    var init = XM.Incident.prototype.bindEvents;
    XM.Incident = XM.Incident.extend({

      bindEvents: function () {
        init.apply(this, arguments);
        this.on('change:project', this.projectDidChange);
      },

      projectDidChange: function () {
        var project = this.get('project'),
          status = this.getStatus(),
          K = XM.Model;
        this.setReadOnly('foundIn', false);
        this.setReadOnly('fixedIn', false);
        if (this.isReady()) {
          this.set('foundIn', null);
          this.set('fixedIn', null);
        }
        this.setReadOnly('foundIn', !project);
        this.setReadOnly('fixedIn', !project);
      },

      /**
        projectDidChange does not pick up the change to
        project when the model is getting loaded, so take
        extra steps to set the read-only correctly on the
        load of the model.
       */
      statusDidChange: function (model, status) {
        XM.Document.prototype.statusDidChange.apply(this, arguments);

        var project = this.get('project');

        if (model.isReady()) {
          this.setReadOnly('foundIn', !project);
          this.setReadOnly('fixedIn', !project);
        }
      }
    });
  };

}());
