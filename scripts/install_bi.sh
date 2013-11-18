#!/bin/sh
RUN_DIR=$(pwd)
LOG_FILE=$RUN_DIR/install_bi.log
mv $LOG_FILE $LOG_FILE.old
log() {
	echo $@
	echo $@ >> $LOG_FILE
}

varlog() {
	log $(eval "echo $1 = \$$1")
}

cdir() {
	cd $1
	log "Changing directory to $1"
}

RUNALL=true
BI_DIR=$RUN_DIR/../../bi
XT_DIR=$RUN_DIR/..
export BISERVER_HOME=$RUN_DIR/../../ErpBI
DATABASE=dev
TENANT=default
COMMONNAME=$(hostname)
export JAVA_HOME=$(readlink -f /usr/bin/javac | sed "s:bin/javac::")

while getopts ":iebcpd:t:n:j:" opt; do
  case $opt in
    e)
      # Install ErpBI and configure
      RUNALL=
      DOWNLOAD=true
      ;;
    b)
      # Build BI solution and Reports and install
      RUNALL=
      RUN=true
      ;;
    c)
      # Create erpbi database and load tenant data
      RUNALL=
      CONFIGURE=true
      ;;
    p)
      # Prep the Mobile Client to connect to BI Server
      RUNALL=
      PREP=true
      ;;
    d)
      # Set database name to extract
      DATABASE=$OPTARG
	  echo $DATABASE
      ;;
    t)
      # Set tenant name
      TENANT=$OPTARG
	  echo $TENANT
      ;;
    n)
      # Common name for self signed SSL certificate
      COMMONNAME=$OPTARG
	  echo $COMMONNAME
      ;;
    j)
      # Java home
      export JAVA_HOME=$OPTARG
	  echo $JAVA_HOME
      ;; 
    \?)
      log "Invalid option: -"$OPTARG
      exit 1
      ;;
    :)
      log "Option -"$OPTARG" requires an argument."
      exit 1
      ;;
  esac
done

if [ $RUNALL ]
then
	DOWNLOAD=true
	RUN=true
	CONFIGURE=true
	PREP=true
fi

if  ! test -e $JAVA_HOME/bin/javac ;
then
	log ""
	log "#############################################################"
	log "#############################################################"
    log "Sorry can not find javac.  Set Java Home with the -j argument"
	log "#############################################################"
	log "#############################################################"
	log ""
    exit 1
fi

if  ! test -d $XT_DIR ;
then
	log ""
	log "#############################################################"
	log "#############################################################"
    log "Sorry xtuple folder not found.  You must clone xtuple"
	log "#############################################################"
	log "#############################################################"
	log ""
    exit 1
fi

install_packages () {
	log ""
	log "######################################################"
	log "######################################################"
	log "Install prereqs."
	log "######################################################"
	log "######################################################"
	log ""
	apt-get install -qy git openjdk-6-jdk maven2
}

#git clone https://github.com/xtuple/bi

download_files () {
	log ""
	log "######################################################"
	log "######################################################"
	log "Download ErpBI, set permissions and generate keystore "
	log "and truststore for SSL with self signed cert using    "
	log "common name "$COMMONNAME
	log "######################################################"
	log "######################################################"
	log ""
    cdir $RUN_DIR/../..
	rm -R ErpBI
	rm ErpBI.zip
	wget http://sourceforge.net/projects/erpbi/files/candidate-release/ErpBI.zip/download -O ErpBI.zip
	unzip ErpBI.zip  2>1 | tee -a $LOG_FILE
	
	cdir $BISERVER_HOME/biserver-ce/
	chmod 755 -R . 2>1 | tee -a $LOG_FILE
	
	cdir $BISERVER_HOME/biserver-ce/ssl-keys
	rm cacerts.jks
	rm keystore_server.jks
	rm server.cer
	keytool -genkey -alias tomcat -keyalg RSA -keypass changeit -storepass changeit -keystore keystore_server.jks -dname "cn="$COMMONNAME", ou=xTuple, o=xTuple, c=US"
	keytool -export -alias tomcat -file server.cer -storepass changeit -keystore keystore_server.jks
	keytool -import -alias tomcat -v -trustcacerts -file server.cer -keypass changeit -storepass changeit -keystore cacerts.jks -noprompt
	
	cdir $BISERVER_HOME/biserver-ce/tomcat/conf/Catalina/localhost
	mv pentaho.xml pentaho.xml.sample
	cat pentaho.xml.sample | \
	sed s/org.h2.Driver/org.postgresql.Driver/ | \
	sed s#jdbc:h2:../../../h2database/erpbi#jdbc:postgresql://localhost:5432/erpbi# \
	> pentaho.xml  2>1 | tee -a $LOG_FILE
}

run_scripts() {
	log ""
	log "######################################################"
	log "######################################################"
	log "Build BI solution and reports and move to ErpBI at:   "
	log $BISERVER_HOME
	log "######################################################"
	log "######################################################"
	log ""
	cdir $BI_DIR/olap-schema
	mvn install 2>1 | tee -a $LOG_FILE
	java -jar Saxon-HE-9.4.jar -s:src/erpi-sogl-tenant-xtuple.xml -xsl:style.xsl -o:target/erpi-schema.xml
	mvn process-resources 2>1 | tee -a $LOG_FILE

	cdir ../pentaho-extensions/oauthsso
	mvn clean 2>1 | tee -a $LOG_FILE
	mvn install 2>1 | tee -a $LOG_FILE
	mvn process-resources 2>1 | tee -a $LOG_FILE

	cdir ../dynschema
	mvn install 2>1 | tee -a $LOG_FILE
	mvn process-resources 2>1 | tee -a $LOG_FILE

	cdir ../../etl
	mvn install 2>1 | tee -a $LOG_FILE
	mvn process-resources 2>1 | tee -a $LOG_FILE
	
	cdir $XT_DIR/pentaho/report-datasource
	sh build.sh  2>1 | tee -a $LOG_FILE
}

configure_pentaho() {
	log ""
	log "######################################################"
	log "######################################################"
	log "Create datamart database erpbi.  Extract data from dev"
	log "and load data into tenant default.dev".
	log "######################################################"
	log "######################################################"
	log ""
	createdb -U postgres -O admin erpbi 2>1 | tee -a $LOG_FILE
	cdir $BISERVER_HOME/data-integration
	export KETTLE_HOME=properties/psg-linux
	
	mv $KETTLE_HOME/.kettle/kettle.properties $KETTLE_HOME/.kettle/kettle.properties.sample  2>1 | tee -a $LOG_FILE
	cat $KETTLE_HOME/.kettle/kettle.properties.sample | \
	sed s'#erpi.source.url=.*#erpi.source.url=jdbc\:postgresql\://localhost\:5432/'$DATABASE'#' | \
	sed s'#erpi.tenant.id=.*#erpi.tenant.id='$TENANT'.'$DATABASE'#' \
	> $KETTLE_HOME/.kettle/kettle.properties  2>1 | tee -a $LOG_FILE
	
	sh kitchenkh.sh -file=../ErpBI/ETL/JOBS/Load.kjb -level=Basic
}

prep_mobile() {
	log ""
	log "######################################################"
	log "######################################################"
	log "Prepare mobile app to use the BI Server. Create keys  "
    log "for REST api used by single sign on.  Update config.js"
    log "with BI Server URL https://"$COMMONNAME":8443"
	log "######################################################"
	log "######################################################"
	log ""
	mkdir $XT_DIR/node-datasource/lib/rest-keys
	cdir $XT_DIR/node-datasource/lib/rest-keys
	openssl genrsa -out server.key 1024 2>1 | tee -a $LOG_FILE
	openssl rsa -in server.key -pubout > server.pub 2>1 | tee -a $LOG_FILE

	cdir $XT_DIR/node-datasource
	mv config.js config.js.old 2>1 | tee -a $LOG_FILE
	cat config.js.old | \
	sed 's#biKeyFile: .*#biKeyFile: \"./lib/rest-keys/server.key\",#' | \
	sed 's#biServerUrl: .*#biServerUrl: \"https://'$COMMONNAME':8443/pentaho/\",#'| \
	sed 's#uniqueTenantId: .*#uniqueTenantId: \"'$TENANT'",#' | \
	sed 's#biUrl: .*#biUrl: \"https://'$COMMONNAME':8443/pentaho/content/reporting/reportviewer/report.html\?solution=xtuple\&path=%2Fprpt\&locale=en_US\&userid=reports\&password=password\&output-target=pageable/pdf\",#' \
	> config.js
}

install_packages

if [ $? -ne 0 ]
then
	log "bad."
fi

if [ $DOWNLOAD ]
then
	download_files
fi

if [ $RUN ]
then
	run_scripts
fi

if [ $CONFIGURE ]
then
	configure_pentaho
fi

if [ $PREP ]
then
	prep_mobile
fi

log ""
log "######################################################"
log "######################################################"
log "                FINISED! READ ME                      "
log "If you use the self signed certificate created by this"
log "script you will need to accept the certificate in your"
log "browser.  Use one of the Print buttons in the Mobile  "
log "Web Client to accept the certificate."
log ""
log "If reports were installed or updated you will need to "
log "refresh the BI Server repository cache:               "
log "  Connect to https://"$COMMONNAME":8443"
log "  login as user:admin, password:Car54WhereRU"
log "  tools > Refresh > Repository Cache"
log "  tools > Refresh > Reporting Metadata"
log "  tools > Refresh > Reporting Data Cache"
log "######################################################"
log "######################################################"
log ""