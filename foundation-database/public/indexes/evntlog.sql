SELECT dropIfExists('index', 'evntlog_evntlog_username_idx');
CREATE INDEX evntlog_evntlog_username_idx ON evntlog(evntlog_username);
