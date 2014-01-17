#!/bin/sh
LOG_FILE='stop_bi.log'
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
log "Stop BI server listening on port 8843                "
log "######################################################"
log "######################################################"
log ""
cdir ../../ErpBI/biserver-ce/
./stop-pentaho.sh

