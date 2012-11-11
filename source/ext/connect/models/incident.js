/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, Globalize: true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.connect.initIncidentModels = function () {

    // Define email processing
    var sendEmail = function () {
      var that = this,
        profile = this.getValue('category.emailProfile'),
        from,
        replyTo,
        to,
        cc,
        bcc,
        subject,
        body,
        batch,
        offset = (new Date()).getTimezoneOffset(),
        now = new Date(new Date() - offset * 60 * 1000),
        format = function (str) {
          str = str || "";
          var parser = /\{([^}]+)\}/g, // Finds curly braces
            tokens,
            attr;
          tokens = str.match(parser);
          _.each(tokens, function (token) {
            attr = token.slice(1, token.indexOf('}'));
            str = str.replace(token, that.getValue(attr));
          });
          return str;
        },
        // Finish handling batch when we get an id.
        callback = function () {
          batch.off('change:id', callback);
          batch.set({
            action: "Email",
            createdBy: XM.currentUser.id,
            created: now,
            scheduled: now,
            from: from,
            replyTo: replyTo,
            to: to,
            cc: cc,
            bcc: bcc,
            subject: subject,
            body: body,
            fileName: 'incident'
          });
          batch.save();
        };
      if (profile) {
        from = format(profile.get('from'));
        replyTo = format(profile.get('replyTo'));
        to = format(profile.get('to'));
        cc = format(profile.get('cc'));
        bcc = format(profile.get('bcc'));
        subject = format(profile.get('subject'));
        body = format(profile.get('body'));

        // Create and submit the email batch record
        batch = new XM.Batch();
        batch.on('change:id', callback);
        batch.initialize(null, {isNew: true});
      }
    };

    // Enhance `save` function to generate email after successful commit
    // We don't use `extend` to avoid risk of over-writing something else
    // Instead inject `options` into existing save function
    var save = XM.Incident.prototype.save;
    XM.Incident.prototype.save = function (key, value, options) {
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        options = value;
      }

      options = options ? _.clone(options) : {};
      var that = this,
        K = XM.Model,
        success = options.success,
        status = this.getStatus(),
        statusString = this.getIncidentStatusString() ? this.getIncidentStatusString().toUpperCase() : undefined,
        isNotUpdated = _.size(this.prime) === 0,
        newComment = _.find(this.get('comments').models, function (comment) {
          return comment.getStatus() === K.READY_NEW;
        });

      options.success = function (model, resp, options) {
        sendEmail.call(that);
        if (success) { success(model, resp, options); }
      };

      // Set change text
      if (status === K.READY_NEW && this.get('status') !== 'N') {
        this._lastChange = "_incidentCreatedStatus".loc()
                                                   .replace("{status}", statusString);
      } else if (status === K.READY_NEW) {
        this._lastChange = "_incidentCreated".loc();
      } else if (this.original('status') !== this.get('status')) {
        this._lastChange = "_incidentChangedStatus".loc()
                                                   .replace("{status}", statusString);
      } else if (newComment && isNotUpdated) {
        this._lastChange = "_incidentNewComment".loc();
      } else {
        this._lastChange = "_incidentUpdated".loc();
      }
      this._lastChange += ":";

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        value = options;
      }

      // Now call the original
      save.call(this, key, value, options);
    };

    // Supporting functions for email processing
    XM.Incident = XM.Incident.extend(
      /** @scope XM.Incident.prototype */ {

      getChangeString: function () {
        return this._lastChange;
      },

      emailBcc: function () {
        return "john@xtuple.com";
      },

      getLastCommentString: function () {
        var comments = this.get('comments'),
          comment,
          ret = "";
        if (comments.length) {
          // Sort by date descending and take first
          comments.comparator = function (a, b) {
            var aval = a.get('created'),
              bval = b.get('created');
            return XT.date.compare(bval, aval);
          };
          comments.sort();
          comment = comments.models[0];
          ret = "_latestComment".loc() +
                " (" + comment.get('createdBy') + ")" +
                "\n\n" +
                comment.get('text');
        }
        return ret;
      },

      getHistoryString: function () {
        var history = this.get('history'),
          ret = "",
          isFirst = true;
        if (history.length) {
          // Sort by date ascending
          history.comparator = function (a, b) {
            var aval = a.get('created'),
              bval = b.get('created');
            return XT.date.compare(aval, bval);
          };
          history.sort();
          _.each(history.models, function (model) {
            var offset = (new Date()).getTimezoneOffset(), // hack: the data should include timezone
              created = new Date(model.get('created').getTime() + offset * 60 * 1000),
              fdate = Globalize.format(created, "d"),
              ftime = Globalize.format(created, "t");
            if (!isFirst) { ret += "\n"; }
            isFirst = false;
            ret += (fdate + ' ' + ftime).rightPad(' ', 24);
            ret += model.get('createdBy').slice(0, 17).rightPad(' ', 18);
            ret += model.get('description');
          });
        }
        return ret;
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.IncidentEmailProfile = XM.Document.extend(
      /** @scope XM.IncidentEmailProfile.prototype */ {

      recordType: 'XM.IncidentEmailProfile',

      documentKey: 'name'

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.IncidentEmailProfileCollection = XM.Collection.extend({
      /** @scope XM.IncidentEmailProfileCollection.prototype */

      model: XM.IncidentEmailProfile

    });
  };

}());
