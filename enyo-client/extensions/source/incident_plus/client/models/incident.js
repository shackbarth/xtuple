/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.incidentPlus.initIncidentModels = function () {
  
    var init = XM.Incident.prototype.initialize;
    XM.Incident = XM.Incident.extend({

      initialize: function () {
        init.apply(this, arguments);
        this.on('change:project', this.projectDidChange);
        this.projectDidChange();
      },
      
      projectDidChange: function () {
        var project = this.get('project'),
          status = this.getStatus(),
          K = XM.Model;
        this.setReadOnly('foundIn', false);
        this.setReadOnly('fixedIn', false);
        if (status & K.READY) {
          this.set('foundIn', null);
          this.set('fixedIn', null);
        }
        this.setReadOnly('foundIn', !project);
        this.setReadOnly('fixedIn', !project);
      }

    });
    
  };

}());
