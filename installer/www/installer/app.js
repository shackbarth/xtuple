
enyo.kind({
  name: "App",
  kind: "FittableColumns",
  classes: "orm-app onyx",
  fit: true,
  components: [
    {name: "left", kind: "OrmLeft"},
    {name: "controls", kind: "OrmControls"}
  ],
  published: {
    hostname: "localhost",
    port: 9080
  },
  start: function () {
    var c;
    
    // this is top-down and ugly...
    this.$.controls.refreshAck = _.bind(this.refreshed, this);
    this.$.controls.installAck = _.bind(this.installed, this);
    this.$.controls.selectAck = _.bind(this.selected, this);
    
    c = this.cookie = this.getCookie();
    console.log("cookie", c);
    
    if (c) {
      if (c.datasource) {
        this.$.controls.setDatasourceCredentials(c.datasource);
      }
      if (c.database) {
        this.$.controls.setDatabaseCredentials(c.database);
      }
    }
  },
  getCookie: function () {
    var c = this.cookie = enyo.getCookie("installercredentials");
    return c? JSON.parse(c): undefined;
  },
  setCookie: function (value) {
    var c = this.getCookie();
    if (c) c = enyo.mixin(c, value);
    else c = value;
    enyo.setCookie("installercredentials", JSON.stringify(c));
    return this.getCookie();
  },
  updateDatasource: function () {
    var source = this.getHostname(),
        port = this.getPort(), sock, url;
    if (this._sock) {
      this._sock.socket.disconnectSync();
      io.sockets = {};
    }
    url = "http://"+source+":"+port+"/orm";
    
    log({type: "info", message: "attempting to connect to '"+url+"'"});
    
    sock = this._sock = io.connect(url);
    
    sock.on("connect", _.bind(this.connect, this));
    sock.on("disconnect", _.bind(this.disconnected, this));
    sock.on("error", _.bind(this.didNotConnect, this));
    sock.on("message", _.bind(this.receivedMessage, this));
  },
  connect: function () {
    var c = this.cookie, credentials;
    log({type: "info", message: "successfully connected to the datasource"});
    this._sock.emit("refresh", this.$.controls.refreshAck);
    this.$.controls.$.buttons.children[1].setDisabled(false);
    
    credentials = this.$.controls.getDatasourceCredentials();
    this.setCookie({datasource: credentials});
    
    this.$.controls.submitDatabaseCredentials();
  },
  didNotConnect: function () {
    log({type: "error", message: "could not connect to the datasource"});
  },
  disconnected: function () {
    log({type: "info", message: "disconnected from datasource"});
  },
  installed: function (values) {
    console.log("installed(): ", values);
  },
  refreshed: function (orms) {
    this.$.left.$.list.setOrms(orms);
  },
  receivedMessage: function (message) {
    log({type: "server", message: message});
  },
  selected: function (ok) {
    var c = this.cookie, credentials;
    if (ok && !this.validDatabase) {
      this.validDatabase = true;
      if (!this.hasNotifiedConnected) {
        log({type: "info", message: "successfully connected to the database"});
        this.hasNotifiedConnected = true;
      }
      //_.each(this.$.controls.children, function (wrapper) {
      //  _.each(wrapper.children, function (decorator) {
      //    if (decorator.children && decorator.children.length > 0) {
      //      _.each(decorator.children, function (child) {
      //        if (child.kind === "onyx.Input") {
      //          child.setDisabled(true);
      //          decorator.receiveBlur();
      //        }
      //      });
      //    }
      //  });
      //});
      this.$.controls.$.buttons.children[0].setDisabled(false);
      
      credentials = this.$.controls.getDatabaseCredentials();
      this.setCookie({database: credentials});
    } else { 
      this.validDatabase = false;
      this.$.controls.$.buttons.children[0].setDisabled(true);
    }
  }
});

enyo.kind({
  name: "OrmLeft",
  kind: "FittableRows",
  fit: true,
  components: [
    {name: "list", kind: "OrmList"},
    {name: "console", kind: "OrmConsole"}
  ]
});

enyo.kind({
  name: "OrmControls",
  kind: "FittableRows",
  classes: "orm-controls",
  keyPressed: function (inSender) {
    var sock = app._sock;
    if (inSender.parent.name.indexOf("database") > -1) {
      // if we don't have a socket yet, we can't do anything
      if (!sock) return;
      else this.submitDatabaseCredentials();
    } else { this.checkDatasourceCredentials(); }
  },
  submitDatabaseCredentials: function () {
    var sock = app._sock, options = this.getDatabaseCredentials();
    if (!sock) return;
    else sock.emit("select", options, this.selectAck);
  },
  getDatabaseCredentials: function () {
    return {
      hostname: this.$.databaseHostname.children[0].getValue(),
      port: this.$.databasePort.children[0].getValue(),
      username: this.$.databaseUsername.children[0].getValue(),
      password: this.$.databasePassword.children[0].getValue(),
      organization: this.$.databaseOrganization.children[0].getValue()
    };
  },
  setDatabaseCredentials: function(values) {
    this.$.databaseHostname.children[0].setValue(values.hostname);
    this.$.databasePort.children[0].setValue(values.port);
    this.$.databaseUsername.children[0].setValue(values.username);
    this.$.databasePassword.children[0].setValue(values.password);
    this.$.databaseOrganization.children[0].setValue(values.organization);
  },
  getDatasourceCredentials: function () {
    return {
      hostname: this.$.datasourceHostname.children[0].getValue(),
      port: this.$.datasourcePort.children[0].getValue()
    };
  },
  setDatasourceCredentials: function (values) {
    this.$.datasourceHostname.children[0].setValue(values.hostname);
    this.$.datasourcePort.children[0].setValue(values.port);
    this.checkDatasourceCredentials();
  },
  checkDatasourceCredentials: function () {
    var hostname, port, credentials = this.getDatasourceCredentials();
    hostname = credentials.hostname;
    port = credentials.port;
    if (hostname === "" || port === "" || !(port.match(/\d{4}/))) return;
    if (hostname === app.getHostname() && port === app.getPort()) return;
    app.setHostname(hostname);
    app.setPort(port);
    app.updateDatasource();
  },
  components: [
    {name: "databaseForm", kind: "onyx.Groupbox", components: [
      {kind: "onyx.GroupboxHeader", content: "Database Options"},
      {name: "databaseHostname", kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", placeholder: "Hostname", onkeyup: "keyPressed"}]},
      {name: "databasePort", kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", placeholder: "Port", onkeyup: "keyPressed"}]},
      {name: "databaseUsername", kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", placeholder: "Username", onkeyup: "keyPressed"}]},
      {name: "databasePassword", kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", placeholder: "Password", type: "password", onkeyup: "keyPressed"}]},
      {name: "databaseOrganization", kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", placeholder: "Organization", onkeyup: "keyPressed"}]}
    ]},
    {name: "datasourceForm", kind: "onyx.Groupbox", components: [
      {kind: "onyx.GroupboxHeader", content: "Datasource Options"},
      {name: "datasourceHostname", kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", placeholder: "Hostname", onkeyup: "keyPressed"}]},
      {name: "datasourcePort", kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", placeholder: "Port", onkeyup: "keyPressed"}]}]},
    {name: "buttons", kind: "FittableRows", fit: true, components: [
      {kind: "onyx.Button", content: "Install Enabled", ontap: "installTapped", disabled: true},
      {kind: "onyx.Button", content: "Refresh List", ontap: "refreshTapped", disabled: true}]}
  ],
  installTapped: function () {
    var sock = app._sock;
    sock.emit("install", this.installAck);
  },
  refreshTapped: function () {
    var sock = app._sock;
    sock.emit("refresh", this.refreshAck);
  },
  refreshAck: null,
  installAck: null,
  selectAck: null
});

enyo.kind({
  name: "OrmRepeater",
  kind: "FlyweightRepeater",
  style: "height: inherit; ",
  multiSelect: true
});

enyo.kind({
  name: "OrmList",
  classes: "orm-list",
  kind: "Scroller",
  fit: true,
  published: {
    orms: null,
    renderable: null
  },
  components: [
    {name: "list", kind: "OrmRepeater", onSetupItem: "setupItem", components: [
      {name: "item", kind: "OrmListItem"}]}
  ],
  ormsChanged: function () {
    var orms = this.getOrms(), ret = [];
    _.each(orms, function (namespace) {
      _.each(namespace, function (orm) {
        ret.push(orm);
      });
    });
    this.setRenderable(ret);
    this.$.list.setCount(ret.length);
    this.$.list.render();
  },
  setupItem: function (inSender, inEvent) {
    var orms = this.getRenderable(), idx = inEvent.index, orm,
        missing, failed, unknown;
    orm = orms[idx];
    missing = orm.missingDependencies || [];
    failed = orm.failedDependencies || [];
    unknown = orm.unknownDependencies || [];

    this.$.item.$.header.setContent(orm.type);
    this.$.item.$.namespace.setContent("namespace: " + orm.nameSpace);
    this.$.item.$.comment.setContent("comment: " + orm.comment);
    this.$.item.$.filename.setContent("filename: " + orm.filename);
    this.$.item.$.table.setContent("table: " + orm.table);
    
    if (missing.length > 0) this.$.item.createComponent({classes: "display-text",
      content: "missing dependencies: " + missing.join(", ")});
    
    if (failed.length > 0) this.$.item.createComponent({classes: "display-text",
      content: "failed dependencies: " + _.uniq(failed).join(", ")});
      
    this.$.item.$.header.addRemoveClass("disabled", !orm.enabled);
  }
});

enyo.kind({
  name: "OrmListItem",
  kind: "onyx.Groupbox",
  create: function () {
    this.inherited(arguments);
    this.originals = this.children.slice();
  },
  components: [
    {name: "header", kind: "onyx.GroupboxHeader"},
    {name: "namespace", classes: "display-text"},
    {name: "comment", classes: "display-text"},
    {name: "filename", classes: "display-text"},
    {name: "table", classes: "display-text"}
  ],
  teardownChildren: function () {
    var orig, children, child, i = 0, idx;
    this.inherited(arguments);
    orig = this.originals;
    children = this.children.slice();
    for (; i < children.length; ++i) {
      child = children[i];
      if (orig.indexOf(child) === -1) {
        idx = this.children.indexOf(child);
        if (idx !== -1) this.children.splice(idx, 1);
      }
    }
  }
});

enyo.kind({
  name: "OrmConsole",
  classes: "orm-console",
  published: {
    "messages": []
  },
  create: function () {
    this.inherited(arguments);
    window.ormConsole = this;
    window.log = _.bind(this.logItem, this);
  },
  logItem: function (message) {
    var obj;
    if (typeof message === "string") obj = {type: "info", message: message};
    else obj = message;
    this.getMessages().push(obj);
    this.$.list.setCount(this.getMessages().length);
    this.$.list.reset();
    this.$.list.scrollToEnd();
  },
  components: [
    {name: "list", kind: "List", style: "height: 190px; ", onSetupItem: "setupItem", components: [
      {name: "item", kind: "ConsoleListItem"}]}
  ],
  setupItem: function (inSender, inEvent) {
    var messages = this.getMessages(), idx = inEvent.index, message;
    message = messages[idx];
    this.$.item.$.prefix.setContent(message.type);
    this.$.item.$.message.setContent(message.message);
  }
});

enyo.kind({
  name: "ConsoleListItem",
  kind: "FittableColumns",
  classes: "console-list-item",
  fit: true,
  components: [
    {name: "prefix", classes: "console-list-item-prefix"},
    {name: "message", classes: "console-list-item-message"}
  ]
});