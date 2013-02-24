#!/bin/bash
 
#Set a default value for the $cell variable
cell="test"
 
#Check to see if at least one argument was specified
if [ $# -lt 1 ] ; then
   echo "You must specify at least 1 argument."
   exit 1
fi
 
#Process the arguments
while getopts c:hin: opt
do
   case "$opt" in
      c) cell=$OPTARG;;
      h) usage;;
      i) info="yes";;
      n) name=$OPTARG;;
      \?) usage;;
   esac
done

echo $cell
echo $name
echo 'hi'
