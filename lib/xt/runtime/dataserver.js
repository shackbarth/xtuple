
// start the primary datasource server process
XT.dataServer = XT.Server.create({
  name: 'dataServer',
  port: XT.opts['server-port'],
  autoStart: true,
  router: XT.dataRouter,
  useWebSocket: true
});

// MAYBE THIS SHOULDN'T GO HERE BUT I DON'T KNOW
// WHERE ELSE TO PUT IT RIGHT NOW
XT.dataServer.setSocketHandler(
  '/session',
  'connection',
  XT.sessionStore._xt_initSocket,
  XT.sessionStore
);
