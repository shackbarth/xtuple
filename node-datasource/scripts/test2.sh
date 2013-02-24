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
while getopts U:Hd:h: opt
do
   case "$opt" in
      U) PGUSER=$OPTARG;;
      H) usage;;
      d) ORGNAME=$OPTARG;;
      h) HOSTNAME=$OPTARG;;
      \?) usage;;
   esac
done

echo $PGUSER
echo $ORGNAME
echo $HOSTNAME
