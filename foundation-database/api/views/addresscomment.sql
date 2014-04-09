-- Address Comment

SELECT dropIfExists('VIEW', 'addresscomment', 'api');
CREATE VIEW api.addresscomment
AS 
   SELECT 
     addr_number::varchar AS Address_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM addr, cmnttype, comment
   WHERE ((comment_source='ADDR')
   AND (comment_source_id=addr_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.addresscomment TO xtrole;
COMMENT ON VIEW api.addresscomment IS 'Address Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.addresscomment DO INSTEAD

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
    'ADDR',
    getAddrId(NEW.Address_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.addresscomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.addresscomment DO INSTEAD NOTHING;
