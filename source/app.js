/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, _:true, document:true, window:true */

(function () {

  var UNINITIALIZED = 0;
  var LOADING_SESSION = 1;
  var DOWNLOADING_EXTENSIONS = 2;
  var LOADING_EXTENSIONS = 3;
  var LOADING_SCHEMA = 4;
  var LOADING_APP_DATA = 5;
  var RUNNING = 6;

  enyo.kind({
    name: "XV.App",
    fit: true,
    classes: "xt-app enyo-unselectable",
    published: {
      isStarted: false
    },
    handlers: {
      onListAdded: "addPulloutItem",
      onModelChange: "modelChanged",
      onParameterChange: "parameterDidChange",
      onNavigatorEvent: "togglePullout",
      onHistoryChange: "refreshHistoryPanel",
      onHistoryItemSelected: "selectHistoryItem",
      onAnimateProgressFinish: "startupProcess",
      onSearch: "waterfallSearch"
    },
    components: [
      { name: "postbooks", kind: "XV.ModuleContainer",  onTransitionStart: "handlePullout" },
      { name: "pullout", kind: "XV.Pullout", onAnimateFinish: "pulloutAnimateFinish" }
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
    create: function () {
      this._cachePullouts = [];
      this.inherited(arguments);
      XT.app = this;
      window.onbeforeunload = function () {
        return "_exitPageWarning".loc();
      };
    },
    handlePullout: function (inSender, inEvent) {
      var showing = inSender.getActive().showPullout || false;
      this.$.pullout.setShowing(showing);
    },
    modelChanged: function (inSender, inEvent) {
      this.$.container.getNavigator().waterfall("onModelChange", inEvent);
    },
    parameterDidChange: function (inSender, inEvent) {
      if (this.getIsStarted()) {
        this.$.postbooks.getNavigator().waterfall("onParameterChange", inEvent);
      }
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
      XT.log("Load from history: " + inEvent.workspace + " " + inEvent.id);
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
        len,
        text,
        inEvent,
        ajax, extensionSuccess, extensionError, extensionLocation, extensionName, extensionPrivilegeName,
        extensionCount = 0, extensionsDownloaded = 0,
        eachCallback = function () {
          var completed = startupManager.get('completed').length;
          progressBar.animateProgressTo(completed);
        };

      // 1: Load session data
      if (this.state === UNINITIALIZED) {
        this.state = LOADING_SESSION;
        startupManager.registerCallback(eachCallback, true);
        XT.dataSource.connect();
        len = startupManager.get('queue').length +
          startupManager.get('completed').length;
        progressBar.setMax(len);

      // 2: Download extensions
      } else if (this.state === LOADING_SESSION) {
        this.state = DOWNLOADING_EXTENSIONS;

        extensionSuccess = function (inSender, inResponse) {
          XT.log("Installing extension " + inSender.url);
          eval(inResponse); // MWA HA HA HA

          extensionsDownloaded++;
          if (extensionsDownloaded === extensionCount) {
            that.startupProcess();
          }
        };
        extensionError = function (inSender, inResponse) {
          XT.log("Error download extensions");
        };

        // download all extensions
        for (i = 0; i < XT.session.extensions.length; i++) {
          extensionLocation = XT.session.extensions[i].location;
          extensionName = XT.session.extensions[i].name;
          extensionPrivilegeName = XT.session.extensions[i].privilegeName;
          if (!XT.session.privileges.get(extensionPrivilegeName)) {
            // don't load the extension if the user doesn't have
            // access rights
            continue;
          }
          extensionCount++;
          // the convention for where to find the built js file is something like
          // /public-extensions/builds/crm/crm.js
          ajax = new enyo.Ajax({
            url: extensionLocation + "/builds/" + extensionName + "/" + extensionName + ".js",
            handleAs: "text"
          });
          ajax.go();
          ajax.response(extensionSuccess);
          ajax.error(extensionError);
        }

        if (extensionCount === 0) {
          // if no extensions are loaded we still need a way to move forward
          this.startupProcess();
        }

      // 3: Initialize extensions
      } else if (this.state === DOWNLOADING_EXTENSIONS) {

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
        startupManager.registerCallback(function () {
          that.startupProcess();
        });

        XT.StartupTask.create({
          taskName: "loadSessionSchema",
          task: function () {
            var options = {
              success: _.bind(this.didComplete, this)
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
        this.state = RUNNING;
        XT.app.$.postbooks.next();
        XT.app.$.postbooks.getNavigator().activate();
      }
    },
    start: function () {
      if (this.getIsStarted()) { return; }
      XT.app = this;

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
    waterfallSearch: function (inSender, inEvent) {
      this.$.postbooks.waterfall("onSearch", inEvent);
    }
  });
}());
