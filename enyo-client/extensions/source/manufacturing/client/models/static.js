/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initStaticModels = function () {

    // These are hard coded collections that may be turned into tables at a later date
    var i;

    // Explode Work Order's Effective as of
    var explodeWOEffectiveJson = [
      { id: XM.WorkOrder.START_DATE, name: "_workOrderStartDate".loc() },
      { id: XM.WorkOrder.EXPLOSION_DATE, name: "_dateOfExplosion".loc() }
    ];
    XM.ExplodeWOEffectiveModel = Backbone.Model.extend({
    });
    XM.ExplodeWOEffectiveCollection = Backbone.Collection.extend({
      model: XM.ExplodeWOEffectiveModel
    });
    XM.explodeWOEffectives = new XM.ExplodeWOEffectiveCollection();
    for (i = 0; i < explodeWOEffectiveJson.length; i++) {
      var explodeWOEffective = new XM.ExplodeWOEffectiveModel(explodeWOEffectiveJson[i]);
      XM.explodeWOEffectives.add(explodeWOEffective);
    }

    // Default Work Order Explosion Level
    var wOExplosionLevelJson = [
      { id: XM.WorkOrder.SINGLE_LEVEL, name: "_singleLevel".loc() },
      { id: XM.WorkOrder.MULTIPLE_LEVEL, name: "_multipleLevel".loc() }
    ];
    XM.WOExplosionLevelModel = Backbone.Model.extend({
    });
    XM.WOExplosionLevelCollection = Backbone.Collection.extend({
      model: XM.WOExplosionLevelModel
    });
    XM.wOExplosionLevels = new XM.WOExplosionLevelCollection();
    for (i = 0; i < wOExplosionLevelJson.length; i++) {
      var wOExplosionLevel = new XM.WOExplosionLevelModel(wOExplosionLevelJson[i]);
      XM.wOExplosionLevels.add(wOExplosionLevel);
    }

    // Job Items Work Order Cost Recognition Defaults
    var jobItemCosDefaultJson = [
      { id: XM.WorkOrder.TO_DATE, name: "_toDate".loc() },
      { id: XM.WorkOrder.PROPORTIONAL, name: "_proportional".loc() }
    ];
    XM.JobItemCosDefaultModel = Backbone.Model.extend({
    });
    XM.JobItemCosDefaultCollection = Backbone.Collection.extend({
      model: XM.JobItemCosDefaultModel
    });
    XM.jobItemCosDefaults = new XM.JobItemCosDefaultCollection();
    for (i = 0; i < jobItemCosDefaultJson.length; i++) {
      var jobItemCosDefault = new XM.JobItemCosDefaultModel(jobItemCosDefaultJson[i]);
      XM.jobItemCosDefaults.add(jobItemCosDefault);
    }

  };

}());
