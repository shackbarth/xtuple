#!/bin/sh
set -x
DIR_REL=`dirname $0`
cd $DIR_REL
DIR=`pwd`
cd -
mvn clean
mvn install
mvn process-resources
