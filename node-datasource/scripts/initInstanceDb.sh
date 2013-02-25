#!/bin/bash
 
PROG=`basename $0`

usage() {
  echo "$PROG usage:"
  echo
  echo "-H	Print this help and exit"
  echo "-U	User Account"
  echo "-d	Database name to create"
  echo "-h	Hostname"
  echo "-p	Port"
  echo "-g	Group"
  echo "-t  Type of database to create"
  echo "-r  Dir of psql binaries"
  echo
}
 
#Process the arguments
while getopts U:Hd:h:p:g:t:r: opt
do
   case "$opt" in
      U) PGUSER=$OPTARG;;
      H) usage;;
      d) ORGNAME=$OPTARG;;
      h) DBSERVERHOST=$OPTARG;;
      p) PORT=$OPTARG;;
      g) GROUPNAME=$OPTARG;;
      t) POSTBOOKSTYPE=$OPTARG;;
      r) BINARYDIR=$OPTARG;;
      \?) usage;;
   esac
done

# TODO: backup file should depend on postbooks type
BACKUPFILE='/home/shackbarth/Devel/tools/xtuple/masterref-4.0.0.backup' 

if [ $BINARYDIR = "implicit" ]; then
  $BINARYDIR=""
fi

DROPCOMMAND=$BINARYDIR"dropdb"
CREATECOMMAND=$BINARYDIR"createdb"
RESTORECOMMAND=$BINARYDIR"pg_restore"
PSQLCOMMAND=$BINARYDIR"psql"

echo '$DROPCOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT $ORGNAME'
echo '$CREATECOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT -T template1 $ORGNAME'
echo '$RESTORECOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT -d $ORGNAME $BACKUPFILE'
echo '$PSQLCOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT -d $ORGNAME -c "CREATE ROLE xtrole"'
echo '$PSQLCOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT -d $ORGNAME -c "CREATE ROLE $GROUPNAME"'
$DROPCOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT $ORGNAME
$CREATECOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT -T template1 $ORGNAME
$RESTORECOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT -d $ORGNAME $BACKUPFILE
$PSQLCOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT -d $ORGNAME -c "CREATE ROLE xtrole"
$PSQLCOMMAND -U $PGUSER -h $DBSERVERHOST -p $PORT -d $ORGNAME -c "CREATE ROLE $GROUPNAME"
