#!/bin/sh
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