/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global Globalize:true, XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @namespace

    A mixin to use for documents that send email on save.
    Use with email profile implementations.
  */
  XM.EmailSendMixin = {
    /** @scope XM.EmailSendMixin */

    emailDocumentName: "",

    emailProfileAttribute: null,

    emailStatusMethod: null,

    save: function (key, value, options) {
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        options = value;
      }
      options = options ? _.clone(options) : {};

      var success = options.success,
        status = this.getStatus(),
        statusString = this[this.emailStatusMethod]() ? this[this.emailStatusMethod]().toUpperCase() : undefined,
        isNotUpdated = _.size(this.prime) === 0,
        newComment = _.find(this.get('comments').models, function (comment) {
          return comment.getStatus() === XM.Model.READY_NEW;
        }),
        name = this.emailDocumentName,
        that = this;

      options.success = function (model, resp, options) {
        var profile = model.getValue(that.emailProfileAttribute),
          formattedContent = {},
          emailOptions = {error: function () {
            XT.log("Error sending email with " + name + " details");
          }},
          format = function (str) {
            str = str || "";
            var parser = /\{([^}]+)\}/g, // Finds curly braces
              tokens,
              attr;
            tokens = str.match(parser);
            _.each(tokens, function (token) {
              attr = token.slice(1, token.indexOf('}'));
              str = str.replace(token, model.getValue(attr));
            });
            return str;
          };

        if (profile && profile.attributes) {
          // this profile model has pretty much exactly the right key/value pairs so
          // we can pass it straight to node. We do want to perform the "format" transform
          // on all of the values on the object.
          _.each(profile.attributes, function (value, key, list) {
            if (typeof value === 'string') {
              formattedContent[key] = format(value);
            }
          });

          XT.dataSource.sendEmail(formattedContent, emailOptions);
        } // else there's no email profile profiled

        if (success) { success(model, resp, options); }
      };

      // Set change text
      if (status === XM.Model.READY_NEW && this.get('status') !== 'N') {
        this._lastChange = "_documentCreatedStatus".loc()
                                                   .replace("{document}", name)
                                                   .replace("{status}", statusString);
      } else if (status === XM.Model.READY_NEW) {
        this._lastChange = "_documentCreated".loc();
      } else if (this.original('status') !== this.get('status')) {
        this._lastChange = "_documentChangedStatus".loc()
                                                   .replace("{document}", name)
                                                   .replace("{status}", statusString);
      } else if (newComment && isNotUpdated) {
        this._lastChange = "_documentNewComment".loc().replace("{document}", name);
      } else {
        this._lastChange = "_documentUpdated".loc().replace("{document}", name);
      }
      this._lastChange += ":";

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        value = options;
      }

      XM.Document.prototype.save.call(this, key, value, options);
    }

  };

}());

