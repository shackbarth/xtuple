
XT.devUI = XT.Server.create(
  /** @lends XT.devUI.prototype */ {

  port: XT.opts['dev-ui-port'],
  useWebSocket: YES,
  name: 'devUI',
  autoStart: YES,
  server: XT.connect.createServer(
    XT.connect.static(XT.fs.basePath + '/www')
  )
});
