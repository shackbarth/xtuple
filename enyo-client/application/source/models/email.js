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

    /**
      Builds a list of email addresses to send messages to.
      Looks for a contact primary email address, owner
      and assigned to user email addresses. Loops through dirty
      records workflow, if it exists, and adds the same. Also removes
      the current user's address.

      @param {String} hard coded "to" addresses
      @returns {String}
    */
    buildToString: function (toAddresses) {
      var attrs = this.getClass().getAttributeNames(),
        to = toAddresses ? toAddresses.split(",") : [],
        that = this,
        workflow,
        email;

      // Add contact email
      if (_.contains(attrs, "contact")) {
        email = this.getValue("contact.primaryEmail");
        if (email) { to.push(email); }
      }

      // Add owner email
      if (_.contains(attrs, "owner")) {
        email = this.getValue("owner.email");
        if (email) { to.push(email); }
      }

      // Add assigned to email
      if (_.contains(attrs, "assignedTo")) {
        email = this.getValue("assignedTo.email");
        if (email) { to.push(email); }
      }

      // Add workflow users to email
      if (_.contains(attrs, "workflow")) {
        workflow = this.get("workflow");
        _.each(workflow.models, function (item) {
          if (item.isDirty()) {
            to = that.buildToString.call(item, to.join()).split(",");
          }
        });
      }

      // Remove duplicates
      to = _.unique(to);

      // Remove current user
      email = XM.currentUser.get("email");
      if (email) { to = _.without(to, email); }

      return to.toString();
    },

    getChangeString: function () {
      return this._lastChange;
    },

    getLastCommentString: function () {
      var comments = this.get('comments'),
        // public comments is an array even though comments is a collection
        comment,
        ret = "",
        Klass;

      if (comments.length) {
        // If public flag exists on these comments, only show public ones
        if (_.contains(comments.at(0).getClass().getAttributeNames(), "isPublic")) {
          comments = comments.filter(function (comment) {
            return comment.get("isPublic");
          });
        }

        if (comments.length) {

          // Sort by date descending and take first
          comments = _.sortBy(comments, function (comment) {
            return -1 * comment.get('created').getTime();
          });
          comment = comments[0];
          ret = "_latestComment".loc() +
                " (" + comment.get('createdBy') + ")" +
                "\n\n" +
                comment.get('text');
        }
      }
      return ret;
    },

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
        that = this,
        profile = this.getValue(this.emailProfileAttribute),
        to = profile ? this.buildToString("") : "";

      options.success = function (model, resp, options) {
        var formattedContent = {},
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

          formattedContent.to = to ? to + "," + formattedContent.to : formattedContent.to;

          // Build up "to" address list.
          formattedContent.to = that.buildToString(formattedContent.to);

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

