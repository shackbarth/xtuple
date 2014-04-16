select dropifexists('FUNCTION', 'getflcoldata(int,int)');
select dropifexists('FUNCTION', 'getflcoldata(character,integer[], boolean)');
select dropifexists('TYPE', 'flcoldata');
CREATE TYPE flcoldata AS (
  flcoldata_column  	INTEGER,
  flcoldata_start   	DATE,
  flcoldata_end        DATE
);
