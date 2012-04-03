
// start the primary datasource server process
XT.dataServer = XT.Server.create({
  name: 'dataServer',
  port: XT.opts['server-port'],
  autoStart: true,
  router: XT.dataRouter
});
