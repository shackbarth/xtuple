#!/bin/bash
# Version -1...
# pclark@xtuple.com
#  sh ./createcloud.sh -U pclark@xtuple.com -d evive /usr/local/pg916/bin

PROG=`basename $0`

usage() {
  echo "$PROG usage:"
  echo
  echo "$PROG -H"
  echo "$PROG [ -U email@domain.com ] [ -d dbname] path-to-PGBIN"
  echo
  echo "-H	print this help and exit"
  echo "-U	User Account (default $MUSER)"
  echo "-d	Database to Create (default ($DB)"
  echo "-h	hostname"
  echo "-p	port"
  echo "-g	Group"
  echo "-t  Template DB to use"
  echo
}

ARGS=`getopt HU:d: $*`

if [ $? != 0 ] ; then
  usage
  exit 1
fi

set -- $ARGS

while [ "$1" != -- ] ; do
  case "$1" in
    -H)   usage ; exit 0 ;;
    -U)   export MUSER="$2" ; shift ;;
    -d)   export DB="$2" ; shift ;;
    *)    usage ; exit 1 ;;
  esac
  shift
done
shift

# past the --

if [ $# -lt 1 ] ; then
  echo $PROG: One server to monitor is required
  usage
  exit 1
elif [ $# -gt 1 ] ; then
  echo $PROG: multiple servers named - ignoring more than the first 1
fi

PGBIN="$1"

PROG=`basename $0`
DBTMP='/root/createcloud/tmp'
TMPDIR='/root/createcloud/templates'
SHTMP='/root/createcloud/shscript'
#TMPLIST=`ls -t $TMPDIR`

PGBIN="/usr/local/pg916/bin"
PGPORT="5432"
PGUSER="admin"

PGHOST="db01-mobile.xtuple.com"

LICS="3"
TMPLATE="postbooks_demo-4.0.0.backup"
GLOBAL="global"
MTO="pclark@xtuple.com"

MAILPRGM='/usr/bin/mutt'
PGPASS=`pwgen -A0 8`
WORKDATE=`/bin/date "+%m%d%Y_%T"`

call_python() {
/usr/bin/python2 << EOPYTHON
import bcrypt
# generate the hash
hashed = bcrypt.hashpw('$PGPASS', bcrypt.gensalt(10))
print hashed

EOPYTHON
}

HASH=`call_python`

LIVEDB=${DB}
DEMODB=${DB}_demo
ADMIN=$MUSER
USER=$ADMIN
SALT=xTuple
ENHPASS=`echo -n  ${PGPASS}${SALT}${USER} | md5sum | cut -d ' ' -f 1`

echo -e "CREATE ROLE "$LIVEDB"; CREATE USER \"$USER\" IN GROUP "$LIVEDB", xtrole PASSWORD '$ENHPASS'; CREATE DATABASE "$LIVEDB" OWNER admin; GRANT ALL ON DATABASE "$LIVEDB" TO "$LIVEDB"; REVOKE ALL ON DATABASE "$LIVEDB" FROM public; GRANT CONNECT ON DATABASE "$LIVEDB" TO monitor;" | $PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST postgres

# Load the db as whatever user created above
$PGBIN/pg_restore --host $PGHOST --port $PGPORT --username $PGUSER -d $LIVEDB $TMPDIR/$TMPLATE

# Set Permissions
echo "INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) (SELECT usrpref_name, usrpref_value, '$ADMIN' FROM usrpref WHERE usrpref_username='admin');" |$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST $LIVEDB
echo "INSERT INTO usrpriv (usrpriv_priv_id, usrpriv_username) (SELECT priv_id, '$ADMIN' from priv);" |$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST $LIVEDB
echo "UPDATE curr_symbol SET curr_base = TRUE WHERE curr_id = 1" |$PGBIN/psql -A -t -U $USER -p $PGPORT -h $PGHOST $LIVEDB
echo "INSERT INTO emp (emp_code, emp_number, emp_username, emp_warehous_id, emp_wage, emp_extrate, emp_wage_type, emp_extrate_period, emp_wage_period) VALUES ('$ADMIN', '$ADMIN', '$ADMIN', 35, 0, 0,'H','H','H');" |$PGBIN/psql -A -t -U $USER -p $PGPORT -h $PGHOST $LIVEDB

# Create User, Format is name@domain.com, hash comes from bcrypt random password

echo "INSERT INTO xt.usr (usr_id, usr_password) VALUES ('$ADMIN', '$HASH')" |$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST global

echo "INSERT INTO xt.org (org_name, org_dbserver_name, org_descrip, org_licenses, org_active, org_group) VALUES ('"$LIVEDB"', 'prod-01', '"$LIVEDB"', '"$LICS"', True, '"$LIVEDB"');"|$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST global

echo "INSERT INTO xt.usrorg (usrorg_usr_id, usrorg_org_name, usrorg_username) VALUES ('$ADMIN', '"$LIVEDB"', '$USER');"|$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST global
echo "INSERT INTO xt.usrorg (usrorg_usr_id, usrorg_org_name, usrorg_username) VALUES ('admin', '"$LIVEDB"', 'admin');"|$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST global

echo "INSERT INTO xt.orgext (orgext_org_name, orgext_ext_id) SELECT '"$LIVEDB"', ext_id from xt.ext WHERE ext_name = 'project';"|$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST global
echo "INSERT INTO xt.orgext (orgext_org_name, orgext_ext_id) SELECT '"$LIVEDB"', ext_id from xt.ext WHERE ext_name = 'crm';"|$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST global
#echo "INSERT INTO xt.orgext (orgext_org_name, orgext_ext_id) SELECT '"$LIVEDB"', ext_id from xt.ext WHERE ext_name = 'sales';"|$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST global

echo "INSERT INTO xt.useracct (useracct_username, useracct_active, useracct_propername, useracct_email, useracct_locale_id, useracct_disable_export) VALUES ('$MUSER',TRUE,'update me','$MUSER',NULL,NULL);"|$PGBIN/psql -A -t -U $PGUSER -p $PGPORT -h $PGHOST global

#Let's see what xTuple Version
echo "\t \\\\ \o tmp1.txt \\\\ SELECT metric_value FROM metric WHERE metric_name = 'DatabaseName';" | $PGBIN/psql -U $MUSER -h $PGHOST -p $PGPORT $LIVEDB
DBVER=`cat tmp1.txt`
rm tmp1.txt

#Let's see what xTuple Version
echo "\t \\\\ \o tmp2.txt \\\\ SELECT metric_value FROM metric WHERE metric_name = 'Application';" | $PGBIN/psql -U $MUSER -h $PGHOST -p $PGPORT $LIVEDB
APPVER=`cat tmp2.txt`
rm tmp2.txt

#Let's see what xTuple Version
echo "\t \\\\ \o tmp3.txt \\\\ SELECT metric_value FROM metric WHERE metric_name = 'ServerVersion';" | $PGBIN/psql -U $MUSER -h $PGHOST -p $PGPORT $LIVEDB
XTVER=`cat tmp3.txt`
rm tmp3.txt

#Let's see what Package Versions
echo "\t \\\\ \o tmp4.txt \\\\ SELECT (pkghead_name||', v.'||pkghead_version) FROM pkghead ORDER BY pkghead_name;" | $PGBIN/psql -U $MUSER -h $PGHOST -p $PGPORT $LIVEDB
PGPAK=`cat tmp4.txt`
rm tmp4.txt

          
cat << EOF >> $DBTMP/dbload-$WORKDATE.txt
Greetings,

We have created an individual xTuple Mobile Web account for you.

Go to mobile.xtuple.com (best experienced with a recent iOS
or Android device)

Login with the following:
Username: $ADMIN
Password: $PGPASS

You will see a database called $DB - click that, and you're
on your way!

We look forward to your feedback.  And thank you for your interest
in xTuple!

Best regards,

Ned

EOF

## Creates a shell script to send up to the server and is picked up by a cron job. 
## Depending on where this script is run from, this might be optional.

cat << EOF >> $SHTMP/${DB}_${WORKDATE}.sh
#!/bin/bash
# Database Cleanup for $DB
# User: $MUSER
# Created $WORKDATE
# scp $SHTMP/${DB}_${WORKDATE}.sh root@65.220.34.251:/root/mobilecleanup/filein/.

cd /usr/local/xtuple/database/client/source
psql -U admin -h 172.20.10.20 $DB < init_script.sql
cd /usr/local/xtuple/public-extensions/source/project/database/source
psql -U admin -h 172.20.10.20 $DB < init_script.sql
cd /usr/local/xtuple/public-extensions/source/crm/database/source
psql -U admin -h 172.20.10.20 $DB < init_script.sql
#cd /usr/local/xtuple/public-extensions/source/sales/database/source
#psql -U admin -h 172.20.10.20 $DB < init_script.sql

cd /usr/local/xtuple/database/orm/installer
./installer.js -cli -h prod-01 -d $DB -u admin -p 5432 -P admin --path ../../../database/client/orm/
./installer.js -cli -h prod-01 -d $DB -u admin -p 5432 -P admin --path ../../../public-extensions/source/project/database/orm/
./installer.js -cli -h prod-01 -d $DB -u admin -p 5432 -P admin --path ../../../public-extensions/source/crm/database/orm/
#./installer.js -cli -h prod-01 -d $DB -u admin -p 5432 -P admin --path ../../../public-extensions/source/sales/database/orm/

echo "BEGIN; INSERT INTO usrpriv ( usrpriv_id, usrpriv_priv_id, usrpriv_username) (SELECT nextval(('usrpriv_usrpriv_id_seq')),priv_id,'$MUSER' FROM (select 
priv_id, priv_name,usrpriv_username from priv LEFT OUTER JOIN usrpriv ON (priv_id=usrpriv_priv_id AND usrpriv_username='$MUSER') ORDER by priv_id) as data 
WHERE usrpriv_username is null); COMMIT;" | psql -A -t -U admin -p $PGPORT -h 172.20.10.20 $LIVEDB

echo "$DB = host=172.20.10.20 port=5432 dbname=$DB" >> /etc/pgbouncer/pgbouncer.ini
service pgbouncer restart

EOF

# cat $SHTMP/${DB}_${WORKDATE}.sh >> $DBTMP/dbload-$WORKDATE.txt

echo "Sending Shell Script named ${DB}_${WORKDATE}.sh to Mobile Server to be run"
scp $SHTMP/${DB}_${WORKDATE}.sh root@65.220.34.251:/root/mobilecleanup/filein/.

#Cron will run the above script on server
#
#scp $SHTMP/${DB}.sh root@65.220.34.251:/root/shscript/.
#Wait 4 minutes, above should have run on server.

export EMAIL=CloudCreator@xtuple.com
MSUB="$DB created for you on $HOSTNAME"
MES="${DBTMP}/dbload-$WORKDATE.txt"

# $MAILPRGM -s "DEMO Cloud DB named $LIVEDB created for you on mobile.xtuple.com" $MTO < $MES
#$MAILPRGM -s "xTuple Mobile Web account created!" $MUSER < $MES
#$MAILPRGM -s "An xTuple Mobile Web instance has been created for you on mobile.xtuple.com!" $MTO < $MES
$MAILPRGM -s "$DB created on mobile.xtuple.com!" $MTO < $MES

# Wait to finish on Server...

exit 0;
