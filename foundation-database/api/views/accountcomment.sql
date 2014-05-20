-- Account Comment

DROP VIEW api.accountcomment;
CREATE VIEW api.accountcomment
AS 
   SELECT 
     crmacct_number::varchar AS account_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM crmacct, cmnttype, comment
   WHERE ((comment_source='CRMA')
   AND (comment_source_id=crmacct_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.accountcomment TO xtrole;
COMMENT ON VIEW api.accountcomment IS 'Account Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.accountcomment DO INSTEAD

  INSERT INTO comment (
    comment_date,
    comment_source,
    comment_source_id,
    comment_user,
    comment_cmnttype_id,
    comment_text
    )
  VALUES (
    COALESCE(NEW.date,now()),
    'CRMA',
    getCrmAcctId(NEW.account_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.accountcomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.accountcomment DO INSTEAD NOTHING;
