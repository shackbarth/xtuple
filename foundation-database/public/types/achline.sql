SELECT dropIfExists('FUNCTION', 'formatachchecks(integer, integer, text)',
                    'public');
SELECT dropIfExists('FUNCTION', 'formatabachecks(integer, integer, text)',
                    'public');
SELECT dropIfExists('TYPE',     'achline', 'public');

CREATE TYPE achline AS (achline_checkhead_id  INTEGER,
                        achline_batch         TEXT,
                        achline_type          TEXT,
                        achline_value         TEXT
                       );
