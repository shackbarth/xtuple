var users = [
    { id: '1', username: 'bob', password: 'secret', name: 'Bob Smith' },
    { id: '2', username: 'joe', password: 'password', name: 'Joe Davis' }
];


exports.find = function(id, done) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.id === id.id) {
      return done(null, user);
    }
  }
  return done(null, null);
};

exports.findByUsername = function(username, done) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    X.debug('findByUsername i: ', i);
    X.debug('users i: ', users);
    if (user.username === username) {
      X.debug('Found username: ', username);
      return done(null, user);
    }
  }

  X.debug('Cannot find username: ', username);
  return done(null, null);
};
