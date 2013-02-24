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
  echo
}
 
#Process the arguments
while getopts U:Hd:h:p:g:t: opt
do
   case "$opt" in
      U) PGUSER=$OPTARG;;
      H) usage;;
      d) ORGNAME=$OPTARG;;
      h) DBSERVERHOST=$OPTARG;;
      p) PORT=$OPTARG;;
      g) GROUPNAME=$OPTARG;;
      t) POSTBOOKSTYPE=$OPTARG;;
      \?) usage;;
   esac
done

# TODO: backup file should depend on postbooks type
BACKUPFILE='/home/shackbarth/Devel/tools/xtuple/masterref-4.0.0.backup' 

# TODO: how to use the group argument?
echo 'dropdb -U $PGUSER -h $DBSERVERHOST -p $PORT $ORGNAME'
echo 'createdb -U $PGUSER -h $DBSERVERHOST -p $PORT -T template1 $ORGNAME'
echo 'pg_restore -U $PGUSER -h $DBSERVERHOST -p $PORT -d $ORGNAME $BACKUPFILE'
