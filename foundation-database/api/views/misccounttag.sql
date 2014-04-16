-- Simple Journal Entry
SELECT dropifexists('view','misccounttag','api');
CREATE VIEW api.misccounttag
AS 
  SELECT
    'This view is for inserts only'::text as site,
    'This view is for inserts only'::text as item_number,
    0::numeric as quantity,
    'This view is for inserts only'::text as comment;

GRANT ALL ON TABLE api.misccounttag TO xtrole;
COMMENT ON VIEW api.misccounttag IS 'Miscellaneous Count Tag';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.misccounttag DO INSTEAD

SELECT postMiscCount( 
  getItemsiteId(
  COALESCE(NEW.site,
		(SELECT warehous_code
		 FROM usrpref,whsinfo
		 WHERE (usrpref_username=getEffectiveXtUser())
		 AND (usrpref_name='PreferredWarehouse')
		 AND (warehous_id=CAST(usrpref_value AS INTEGER)))), NEW.item_number),
  NEW.quantity,
  NEW.comment
     );

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.misccounttag DO INSTEAD

  NOTHING;
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.misccounttag DO INSTEAD

  NOTHING;
