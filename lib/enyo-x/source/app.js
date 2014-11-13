/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global Backbone:true, enyo:true, XT:true, _:true, document:true, window:true, XM:true */

(function () {

  var UNINITIALIZED = 0;
  var LOADING_SESSION = 1;
  var LOADING_EXTENSIONS = 3;
  var LOADING_SCHEMA = 4;
  var LOADING_APP_DATA = 5;
  var RUNNING = 6;

  /**
    Application kind. Contains two components, "postbooks", which is a module container,
    and the pullout.
   */
  enyo.kind(
    /** @lends XV.App# */{
    name: "XV.App",
    classes: "enyo-fit enyo-unselectable",
    published: {
      isStarted: false,
      debug: false,
      keyCapturePatterns: []
    },
    handlers: {
      onListAdded: "addPulloutItem",
      onModelChange: "modelChanged",
      onParameterChange: "parameterDidChange",
      onNavigatorEvent: "togglePullout",
      onHistoryChange: "refreshHistoryPanel",
      onHistoryItemSelected: "selectHistoryItem",
      onSearch: "waterfallSearch",
      onWorkspace: "waterfallWorkspace",
      onColumnsChange: "columnsDidChange"
    },
    /*
      Three use cases:
      hotkey mode (triggered by alt)
      notify popup mode (if the notify popup is showing)
      pattern-match mode
    */
    handleKeyDown: function (inSender, inEvent) {
      var that = this,
        keyCode = inEvent.which,
        exoticTransforms = {},
        numberShiftCharacters = ")!@#$%^&*(";

      // exotic transforms. sorta hackish, but the inEvent codes coming
      // through are not always the ones we want

      // http://stackoverflow.com/questions/1898129/javascript-subtract-keycode
      exoticTransforms[XT.ASCII.VULGAR_HALF] = XT.ASCII.N_DASH;
      if (_.contains(Object.keys(exoticTransforms), "" + keyCode)) {
        // account for inexplicably wrongly mapped keys
        keyCode = exoticTransforms[keyCode];
      } else if (inEvent.shiftKey && keyCode >= XT.ASCII.ZERO && keyCode <= XT.ASCII.NINE) {
        // shift-number should be transformed into the appropriate character
        // XXX jingoistic implementation
        keyCode = numberShiftCharacters.charCodeAt(keyCode - XT.ASCII.ZERO);
      }

      // remember the last 10 key presses
      this._keyBufferArray.push(keyCode);
      this._keyBufferArray = this._keyBufferArray.slice(-10);

      // not working
      if (this.$.postbooks.isNotifyPopupShowing()) {
        this.$.postbooks.notifyKey(keyCode, inEvent.shiftKey);
        return;
      }

      if (inEvent.altKey) {
        inEvent.cancelBubble = true;
        inEvent.returnValue = false;
        this.processHotKey(keyCode);
        return true;
      }
      if (this._keyBufferEndPattern) {
        // we're in record mode, so record.
        this._keyBuffer = this._keyBuffer + String.fromCharCode(keyCode);
      }

      if (this._keyBufferEndPattern &&
          _.isEqual(this._keyBufferArray.slice(-1 * this._keyBufferEndPattern.length), this._keyBufferEndPattern) &&
          this._falsePositives) {
        this._falsePositives--;

      } else if (this._keyBufferEndPattern &&
          _.isEqual(this._keyBufferArray.slice(-1 * this._keyBufferEndPattern.length), this._keyBufferEndPattern)) {

        // first slice the end pattern off the payload
        this._keyBuffer = this._keyBuffer.substring(0, this._keyBuffer.length - this._keyBufferEndPattern.length);

        // we've matched an end pattern. Send the recorded buffer to the appropriate method
        this[this._keyBufferMethod](this._keyBuffer);
        this._keyBuffer = "";
        this._keyBufferEndPattern = undefined;
        this._falsePositives = undefined;
      }

      // specification of the key capture patterns themselves are up to the subkind
      _.each(this.getKeyCapturePatterns(), function (pattern) {
        if (_.isEqual(that._keyBufferArray.slice(-1 * pattern.start.length), pattern.start)) {
          // we've matched a start pattern. Now we're in record mode, waiting for a match to the end pattern
          that._keyBuffer = that._keyBuffer || "";
          that._keyBufferEndPattern = pattern.end;
          that._keyBufferMethod = pattern.method;
          that._falsePositives = pattern.falsePositives;
        }
      });

    },
    // the components array is overriden by the subkind
    components: [
      {name: "postbooks", kind: "XV.ModuleContainer",  onTransitionStart: "handlePullout"},
      {name: "pullout", kind: "XV.Pullout", onAnimateFinish: "pulloutAnimateFinish"},
      {name: "signals", kind: "enyo.Signals", onkeydown: "handleKeyDown"},
    ],
    state: UNINITIALIZED,
    /**
      Passes the pullout payload straight from the sender (presumably the list
      containing the pullout parameter) to the pullout, who will deal with
      adding it.
     */
    addPulloutItem: function (inSender, inEvent) {
      if (!this.$.pullout) {
        this._cachePullouts.push(inEvent);
        return;
      }
      this.$.pullout.addPulloutItem(inSender, inEvent);
    },
    columnsDidChange: function (inSender, inEvent) {
      this.$.postbooks.getNavigator().waterfall("onColumnsChange", inEvent);
    },
    create: function () {
      this._cachePullouts = [];
      this._keyBufferArray = [];
      this.inherited(arguments);
      XT.app = this;
      // make even modal popups hear keydown (necessary for keyboarding the notify popup)
      enyo.dispatcher.autoForwardEvents.keydown = 1;
      window.onbeforeunload = function () {
        return "_exitPageWarning".loc();
      };
    },
    handlePullout: function (inSender, inEvent) {
      var showing = inSender.getActive().showPullout || false;
      this.$.pullout.setShowing(showing);
    },
    /*
      When a model is changed, we want to reflect the new state across
      the app, so we bubble all the way up there and waterfall down.
      Currently, the only things that are updated by this process are the lists.
    */
    modelChanged: function (inSender, inEvent) {
      //
      // Waterfall down to all lists to tell them to update themselves
      //
      this.$.postbooks.getNavigator().waterfall("onModelChange", inEvent);
    },
    parameterDidChange: function (inSender, inEvent) {
      if (this.getIsStarted()) {
        this.$.postbooks.getNavigator().waterfall("onParameterChange", inEvent);
      }
    },
    /**
      Implemented by the subkind
    */
    processHotKey: function (keyCode) {
    },
    /**
     * Manages the "lit-up-ness" of the icon buttons based on the pullout.
     * If the pull-out is put away, we want all buttons to dim. If the pull-out
     * is activated, we want the button related to the active pullout pane
     * to light up. The presentation of these buttons take care of themselves
     * if the user actually clicks on the buttons.
     */
    pulloutAnimateFinish: function (inSender, inEvent) {
      var activeIconButton;

      if (inSender.value === inSender.max) {
        // pullout is active
        if (this.$.pullout.getSelectedPanel() === 'history') {
          activeIconButton = 'history';
        } else {
          activeIconButton = 'search';
        }
      } else if (inSender.value === inSender.min) {
        // pullout is inactive
        activeIconButton = null;
      }
      this.$.postbooks.getNavigator().setActiveIconButton(activeIconButton);
    },
    refreshHistoryPanel: function (inSender, inEvent) {
      this.$.pullout.refreshHistoryList();
    },
    /**
      When a history item is selected we bubble an event way up the application.
      Note that we create a sort of ersatz model to mimic the way the handler
      expects to have a model with the event to know what to drill down into.
    */
    selectHistoryItem: function (inSender, inEvent) {
      inEvent.eventName = "onWorkspace";
      this.waterfall("onWorkspace", inEvent);
    },
    startupProcess: function () {
      var startupManager = XT.getStartupManager(),
        progressBar = XT.app.$.postbooks.getStartupProgressBar(),
        that = this,
        prop,
        ext,
        extprop,
        i = 0,
        task,
        startupTaskCount,
        text,
        inEvent,
        ajax,
        extensionSuccess,
        extensionError,
        extensionLocation,
        extensionName,
        extensionPrivilegeName,
        extensionCount = 0,
        extensionsDownloaded = 0,
        extensionPayloads = [],
        loginInfo,
        details,
        eachCallback = function () {
          var completed = startupManager.get('completed').length;
          progressBar.animateProgressTo(completed);
          if (completed === startupTaskCount) {
            that.startupProcess();
          }
        };

      // 1: Load session data
      if (this.state === UNINITIALIZED) {
        this.state = LOADING_SESSION;
        startupManager.registerCallback(eachCallback, true);
        XT.dataSource.connect();
        startupTaskCount = startupManager.get('queue').length + startupManager.get('completed').length;
        progressBar.setMax(startupTaskCount);

      // #2 is off high-wire walking the Grand Canyon

      // 3: Initialize extensions
      } else if (this.state === LOADING_SESSION) {

        this.state = LOADING_EXTENSIONS;
        text = "_loadingExtensions".loc() + "...";
        XT.app.$.postbooks.getStartupText().setContent(text);
        for (prop in XT.extensions) {
          if (XT.extensions.hasOwnProperty(prop)) {
            ext = XT.extensions[prop];
            for (extprop in ext) {
              if (ext.hasOwnProperty(extprop) &&
                  typeof ext[extprop] === "function") {
                //XT.log('Installing ' + prop + ' ' + extprop);
                ext[extprop]();
              }
            }
          }
          i++;
        }
        this.startupProcess();

      // 4. Load Schema
      } else if (this.state === LOADING_EXTENSIONS) {
        this.state = LOADING_SCHEMA;
        text = "_loadingSchema".loc() + "...";
        XT.app.$.postbooks.getStartupText().setContent(text);
        XT.StartupTask.create({
          taskName: "loadSessionSchema",
          task: function () {
            var task = this,
              options = {
                success: function () {
                  task.didComplete();
                  that.startupProcess();
                }
              };
            XT.session.loadSessionObjects(XT.session.SCHEMA, options);
          }
        });

      // 5 Load Application Data
      } else if (this.state === LOADING_SCHEMA) {
        // Run startup tasks
        this.state = LOADING_APP_DATA;
        text = "_loadingApplicationData".loc() + "...";
        XT.app.$.postbooks.getStartupText().setContent(text);
        progressBar.setMax(XT.StartupTasks.length);
        progressBar.setProgress(0);

        // there's a new startup task count now that
        // the second stage of tasks are being loaded.
        startupTaskCount = startupManager.get('queue').length +
          startupManager.get('completed').length +
          XT.StartupTasks.length;

        // create a new each callback to manage the completion of this step
        // the previously registered callback isn't doing any harm. It would be
        // best to unregister the previous eachCallback and replicate the code
        // here that advances the progress bar. This would make the animation look
        // better. There's not a great way to unregister a startup callback, though.
        eachCallback = function () {
          var completed = startupManager.get('completed').length;
          if (completed === startupTaskCount) {
            that.startupProcess();
          }
        };

        startupManager.registerCallback(eachCallback, true);
        for (i = 0; i < XT.StartupTasks.length; i++) {
          task = XT.StartupTasks[i];
          XT.StartupTask.create(task);
        }

      // 6. Finish up
      } else if (this.state === LOADING_APP_DATA) {
        // Go to the navigator
        for (i = 0; i < this._cachePullouts.length; i++) {
          inEvent = this._cachePullouts[i];
          this.$.pullout.addPulloutItem(null, inEvent);
        }
        loginInfo = XT.app.$.postbooks.getNavigator().loginInfo();
        details = XT.session.details;
        loginInfo.setContent(details.username + " · " + details.organization);
        this.state = RUNNING;
        that.startupProcess();

      // TODO - 7. Initiate Empty Database Startup "checklist" process for empty/quick start databases
      } else if (this.state === RUNNING) {
        // No process in place so proceed to activate
        XM.Tuplespace.trigger("activate");
        XT.app.$.postbooks.activate();

        // Send no Base Currency event
        if (!XT.baseCurrency()) {
          this.waterfallNoBaseCurr();
        }
        Backbone.history.start();
      }
    },
    start: function (debug) {
      if (this.getIsStarted()) {return; }
      XT.app = this;
      this.setDebug(debug);

      // Run through the multi-step start process
      this.startupProcess();

      // lets not allow this to happen again
      this.setIsStarted(true);
    },
    show: function () {
      if (this.getShowing() && this.getIsStarted()) {
        this.renderInto(document.body);
      } else {
        this.inherited(arguments);
      }
    },
    togglePullout: function (inSender, inEvent) {
      this.$.pullout.togglePullout(inSender, inEvent);
    },
    waterfallNoBaseCurr: function (inSender, inEvent) {
      this.$.postbooks.waterfall("onNoBaseCurr", inEvent);
      return true;
    },
    waterfallSearch: function (inSender, inEvent) {
      this.$.postbooks.waterfall("onSearch", inEvent);
      return true; // don't want to double up
    },
    waterfallWorkspace: function (inSender, inEvent) {
      this.$.postbooks.waterfall("onWorkspace", inEvent);
      return true; // don't want to double up
    }
  });
}());
