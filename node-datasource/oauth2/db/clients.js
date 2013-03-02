// TODO - Need to store and check against:
// -- approved callback URLs
// -- client type, e.g. "installed applicaion", "web server", "service account"
// OAuth 2.0 server should respond differently based on the cleint type.
var clients = [
    { id: '1', name: 'xTuple', clientId: '766398752140.apps.googleusercontent.com', clientSecret: 'sXZdl3_RJgykttfoT_BOyJuK' }
];


exports.find = function(id, done) {
  for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i];
    if (client.id === id) {
      return done(null, client);
    }
  }
  return done(null, null);
};

exports.findByClientId = function(clientId, done) {
  for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i];
    if (client.clientId === clientId) {
      return done(null, client);
    }
  }
  return done(null, null);
};
