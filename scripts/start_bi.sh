#!/bin/sh
LOG_FILE='start_bi.log'
log() {
	echo $@
	echo $@ >> $LOG_FILE
}
cdir() {
	cd $1
	log "Changing directory to $1"
}
log ""
log "######################################################"
log "######################################################"
log "Start BI server listening on port 8843                "
log "######################################################"
log "######################################################"
log ""
cdir ../../ErpBI/biserver-ce/
./start-pentaho.sh

log ""
log "######################################################"
log "######################################################"
log "Refresh repository and clear OLAP Cache.             "
log "######################################################"
log "######################################################"
log ""

sleep 10

wget -O tempresponse.txt "http://localhost:8080/pentaho/Publish?publish=now&class=org.pentaho.platform.engine.services.solution.SolutionPublisher&userid=admin&password=Car54WhereRU"
rm tempresponse.txt
wget -O tempresponse.txt "http://localhost:8080/pentaho/ViewAction?solution=admin&path=&action=clear_mondrian_schema_cache.xaction&userid=admin&password=Car54WhereRU"
rm tempresponse.txt