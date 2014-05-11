CREATE OR REPLACE VIEW apmemo AS 
SELECT apopen_id, apopen_docnumber
FROM apopen
WHERE apopen_doctype IN ('D', 'C');
REVOKE ALL ON TABLE apmemo FROM PUBLIC;
GRANT  ALL ON TABLE apmemo TO xtrole;
