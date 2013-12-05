#!/bin/bash

alias sudo='sudo env PATH=$PATH $@'

NODE_VERSION=0.8.26

RUN_DIR=$(pwd)
LOG_FILE=$RUN_DIR/install.log
sudo cp $LOG_FILE $LOG_FILE.old 2>&1
log() {
	echo "xtuple >> $@"
	echo $@ >> $LOG_FILE
}

varlog() {
  log $(eval "echo $1 = \$$1")
}

cdir() {
	cd $1
	log "Changing directory to $1"
}

DATABASE=dev
RUNALL=true
XT_VERSION=
BASEDIR=/usr/local/src
LIBS_ONLY=
XT_DIR=$RUN_DIR
XTUPLE_REPO='http://sourceforge.net/projects/postbooks/files/mobile-debian'

while getopts ":ipnhm-:" opt; do
  case $opt in
    i)
      # Install packages
      RUNALL=
      INSTALL=true
      ;;
    p)
      # Configure postgress
      RUNALL=
      POSTGRES=true
      ;;
    n)
      # iNitialize the databases and stuff
      RUNALL=
      INIT=true
      ;;
    m)
      RUNALL=
      NPM_INSTALL=true
      ;;
    x)
      # Checkout a specific version of the xTuple repo
	 XT_VERSION=$OPTARG
	 ;;
    init)
      # only for initializing a fresh debian package install
      RUNALL=
	 USERINIT=true
	 ;;
    node)
      # select the version to use for nodejs
	 NODE_VERSION=$OPTARG
	 varlog NODE_VERSION
	 ;;
    h)
      echo "Usage: install_xtuple [OPTION]"
	 echo "Build the full xTuple Mobile Development Environment."
	 echo ""
	 echo "To install everything, run sudo ./scripts/install_xtuple.sh"
	 echo "Everything will go in /usr/local/src/xtuple"
	 echo ""
	 echo -e "  -b\t\t"
	 echo -e "  -c\t\t"
	 echo -e "  -g\t\t"
	 echo -e "  -h\t\t"
	 echo -e "  -i\t\t"
	 echo -e "  -n\t\t"
	 echo -e "  -p\t\t"
   exit 0;
      ;;
  esac
done

if [ $RUNALL ]
then
	INSTALL=true
	POSTGRES=true
	INIT=true
fi

if [ $USERINIT ]
then
	INSTALL=
	POSTGRES=
	INIT=
fi

if [ -z "$NODE_VERSION" ]
then
	varlog NODE_VERSION
fi

install_packages() {
  wget -qO- http://anonscm.debian.org/loggerhead/pkg-postgresql/postgresql-common/trunk/download/head:/apt.postgresql.org.s-20130224224205-px3qyst90b3xp8zj-1/apt.postgresql.org.sh | sudo bash > /dev/null
  sudo apt-get -qq update 2>&1 | tee -a $LOG_FILE
  sudo apt-get -q install git libssl-dev build-essential postgresql-9.1 postgresql-9.1-plv8 postgresql-contrib postgresql-server-dev-9.1 2>&1 | tee -a $LOG_FILE

  if [ -d "$HOME/.nvm" ]; then
    log "nvm installed."
    source $HOME/.nvm/nvm.sh
  else
    wget -qO- https://raw.github.com/xtuple/nvm/master/install.sh | bash
    nvm install $NODE_VERSION
  fi
  npm install -q 2>&1 | tee -a $LOG_FILE
}

# Use only if running from a debian package install for the first time
user_init() {
	if [ "$USER" = "root" ]
	then
		echo "Run this as a normal user"
		return 1
	fi
	echo "WARNING: This will wipe clean the xtuple folder in your home directory."
	echo "Hit ctrl-c to cancel."
	read PAUSE
	read -p "Github username: " USERNAME ERRS
	rm -rf ~/xtuple

	git clone git://github.com/$USERNAME/xtuple.git
	git remote add xtuple git://github.com/xtuple/xtuple.git
}

# Configure postgres and initialize postgres databases

setup_postgres() {
	sudo mkdir -p $BASEDIR/postgres
	if [ $? -ne 0 ]
	then
		return 1
	fi

	PGDIR=/etc/postgresql/9.1/main
	sudo cp $PGDIR/postgresql.conf $PGDIR/postgresql.conf.default
	if [ $? -ne 0 ]
	then
		return 2
	fi
	sudo cat $PGDIR/postgresql.conf.default | sed "s/#listen_addresses = \S*/listen_addresses = \'*\'/" | sed "s/#custom_variable_classes = ''/custom_variable_classes = 'plv8'/" | sudo tee -a $PGDIR/postgresql.conf > /dev/null
	sudo chown postgres $PGDIR/postgresql.conf
	sudo cp $PGDIR/pg_hba.conf $PGDIR/pg_hba.conf.default
	sudo cat $PGDIR/pg_hba.conf.default | sed "s/local\s*all\s*postgres.*/local\tall\tpostgres\ttrust/" | sed "s/local\s*all\s*all.*/local\tall\tall\ttrust/" | sed "s#host\s*all\s*all\s*127\.0\.0\.1.*#host\tall\tall\t127.0.0.1/32\ttrust#" | sudo tee -a $PGDIR/pg_hba.conf > /dev/null
	sudo chown postgres $PGDIR/pg_hba.conf

	sudo service postgresql restart

	log "Dropping old databases if they already exist..."
	sudo dropdb -U postgres $DATABASE

	cdir $BASEDIR/postgres
	wget -q http://sourceforge.net/api/file/index/project-id/196195/mtime/desc/limit/200/rss
	wait
  NEWESTVERSION=$(cat rss | grep -o '03%20PostBooks-databases\/4.[0-9].[0-9]\(RC\)\?\/postbooks_demo-4.[0-9].[0-9]\(RC\)\?.backup\/download' | grep -o '4.[0-9].[0-9]\(RC\)\?' | head -1)
	rm rss

	if [ -z "$NEWESTVERSION" ]
	then
		NEWESTVERSION="4.2.0"
		log "Couldn't find the latest version. Using $NEWESTVERSION instead."
	fi

	if [ ! -f postbooks_demo-$NEWESTVERSION.backup ]
	then
		wget -qO postbooks_demo-$NEWESTVERSION.backup http://sourceforge.net/projects/postbooks/files/03%20PostBooks-databases/$NEWESTVERSION/postbooks_demo-$NEWESTVERSION.backup/download
		wget -qO init.sql http://sourceforge.net/projects/postbooks/files/03%20PostBooks-databases/$NEWESTVERSION/init.sql/download
		wait
		if [ ! -f postbooks_demo-$NEWESTVERSION.backup ]
		then
			log "Failed to download files from sourceforge."
			log "Download the postbooks demo database and init.sql from sourceforge into"
			log "$BASEDIR/postgres then run 'install_xtuple -pn' to finish installing this package."
			return 3
		fi
	fi

	log "Setup database"

	sudo psql -q -U postgres -f 'init.sql' 2>&1 | tee -a $LOG_FILE
	sudo createdb -U postgres -O admin $DATABASE 2>&1 | tee -a $LOG_FILE
	sudo pg_restore -U postgres -d $DATABASE postbooks_demo-$NEWESTVERSION.backup 2>&1 | tee -a $LOG_FILE
	sudo psql -U postgres $DATABASE -c "CREATE EXTENSION plv8" 2>&1 | tee -a $LOG_FILE
  cp postbooks_demo-$NEWESTVERSION.backup $XT_DIR/test/lib/demo-test.backup
}

init_everythings() {
	log "Setting properties of admin user"

	cdir $XT_DIR/node-datasource

	cat sample_config.js | sed 's/bindAddress: "localhost",/bindAddress: "0.0.0.0",/' | sed "s/testDatabase: \"\"/testDatabase: '$DATABASE'/" > config.js
	log "Configured node-datasource"
	log "The database is now set up..."

	sudo mkdir -p $XT_DIR/node-datasource/lib/private
	cdir $XT_DIR/node-datasource/lib/private
	cat /dev/urandom | tr -dc '0-9a-zA-Z!@#$%^&*_+-'| head -c 64 > salt.txt
	log "Created salt"
	openssl genrsa -des3 -out server.key -passout pass:xtuple 1024 2>&1 | tee -a $LOG_FILE
	openssl rsa -in server.key -passin pass:xtuple -out key.pem -passout pass:xtuple 2>&1 | tee -a $LOG_FILE
	openssl req -batch -new -key key.pem -out server.csr -subj '/CN='$(hostname) 2>&1 | tee -a $LOG_FILE
	openssl x509 -req -days 365 -in server.csr -signkey key.pem -out server.crt 2>&1 | tee -a $LOG_FILE
	if [ $? -ne 0 ]
	then
		log "Failed to generate server certificate in $XT_DIR/node-datasource/lib/private"
		return 3
	fi

	cdir $XT_DIR/test/lib
  rm -f login_data.js
  echo "exports.data = {" >> login_data.js
  echo "  webaddress: ''," >> login_data.js
  echo "  username: 'admin', //------- Enter the xTuple username" >> login_data.js
  echo "  pwd: 'admin', //------ enter the password here" >> login_data.js
  echo "  org: '$DATABASE', //------ enter the database name here" >> login_data.js
  echo "  suname: '', //-------enter the sauce labs username" >> login_data.js
  echo "  sakey: '' //------enter the sauce labs access key" >> login_data.js
  echo "};" >> login_data.js
	log "Created testing login_data.js"

	cdir $XT_DIR
	node scripts/build_app.js -d $DATABASE 2>&1 | tee -a $LOG_FILE
	sudo psql -U postgres $DATABASE -c "select xt.js_init(); insert into xt.usrext (usrext_usr_username, usrext_ext_id) select 'admin', ext_id from xt.ext where ext_location = '/core-extensions';" 2>&1 | tee -a $LOG_FILE

	log "You can login to the database and mobile client with:"
	log "\tusername: admin"
	log "\tpassword: admin"
	log "Installation now finished."
	log "Run the following commands to start the datasource:"
	if [ $USERNAME ]
	then
		log "cd ~/xtuple/node-datasource"
		log "sudo node main.js"
	else
		log "cd /usr/local/src/xtuple/node-datasource/"
		log "sudo node main.js"
	fi
}

if [ $USERINIT ]
then
	user_init
fi

if [ $INSTALL ]
then
  log "install_packages()"
	install_packages
	if [ $? -ne 0 ]
	then
		log "package installation failed."
		exit 1
	fi
fi

if [ $POSTGRES ]
then
  log "setup_postgres()"
	setup_postgres
	if [ $? -ne 0 ]
	then
		exit 4
	fi
fi
if [ $INIT ]
then
  log "init_everythings()"
	init_everythings
	if [ $? -ne 0 ]
	then
		log "init_everythings failed"
	fi
fi

log "All Done!"
