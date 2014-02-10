// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, setInterval:true, clearInterval:true */

(function () {
  "use strict";

  /**
    @class `XM.SimpleModel` is an abstract class designed to operate with `XT.DataSource`.
    It should be subclassed for any specific implementation. Subclasses should
    include a `recordType` the data source will use to retrieve the record.

    To create a new model include `isNew` in the options:
    <pre><code>
      // Create a new class
      XM.MyModel = XM.SimpleModel.extend({
        recordType: 'XM.MyModel'
      });

      // Instantiate a new model object
      m = new XM.MyModel(null, {isNew: true});
   </code></pre>
    To load an existing record include an id in the attributes:
    <pre><code>
      m = new XM.MyModel({id: 1});
      m.fetch();
    </code></pre>

    @name XM.SimpleModel
    @description To create a new model include `isNew` in the options:
    @param {Object} Attributes
    @param {Object} Options
    @extends XM.ModelMixin
    @extends Backbone.Model
  */
  XM.SimpleModel = Backbone.Model.extend(/** @lends XM.SimpleModel# */ XM.ModelMixin);

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.SimpleModel, /** @lends XM.SimpleModel# */ XM.ModelClassMixin);

}());
