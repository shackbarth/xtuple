#!/bin/bash

set -e

echo -n "Checking for sudo..."
if ! which sudo ;
then
  echo "Please install sudo and grant yourself access to sudo:"
  echo
  echo "   # apt-get install sudo"
  echo "   # addgroup $USER sudo"
  echo
  exit 1
fi

alias sudo='sudo env PATH=$PATH $@'

# Make sure we have all the essential tools we need
sudo apt-get update
sudo apt-get -q -y install \
  git \
  curl \
  python-software-properties \
  software-properties-common

NODE_VERSION=0.10.31

DEBDIST=`lsb_release -c -s`
echo "Trying to install xTuple for platform ${DEBDIST}"

RUN_DIR=$(pwd)
LOG_FILE=$RUN_DIR/install.log
cp $LOG_FILE $LOG_FILE.old 2>&1 &> /dev/null || true
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

PG_VERSION=9.1
DATABASE=dev
RUNALL=true
XT_VERSION=
BASEDIR=/usr/local/src
LIBS_ONLY=
XT_DIR=$RUN_DIR
XTUPLE_REPO='http://sourceforge.net/projects/postbooks/files/mobile-debian'

while getopts ":d:ipnhmx-:" opt; do
  case $opt in
    d)
      PG_VERSION=$OPTARG
      echo $PG_VERSION
      ;;
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
	 echo "To install everything, run bash /scripts/install_xtuple.sh"
	 echo ""
	 echo -e "  -h\t\t"
	 echo -e "  -i\t\t"
	 echo -e "  -p\t\t"
	 echo -e "  -n\t\t"
	 echo -e "  -m\t\t"
	 echo -e "  -x\t\t"
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
  log "installing debian packages..."
  if [ "${DEBDIST}" = "wheezy" ];
  then
    # for Debian wheezy (7.x) we need some things from the wheezy-backports
    sudo add-apt-repository -y "deb http://ftp.debian.org/debian wheezy-backports main"
  fi
  sudo add-apt-repository -y "deb http://apt.postgresql.org/pub/repos/apt/ ${DEBDIST}-pgdg main"
  sudo wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
  sudo apt-get -qq update 2>&1 | tee -a $LOG_FILE
  sudo apt-get -q -y install curl build-essential libssl-dev \
    postgresql-${PG_VERSION} postgresql-server-dev-${PG_VERSION} \
    postgresql-contrib-${PG_VERSION} postgresql-${PG_VERSION}-plv8 2>&1 \
    | tee -a $LOG_FILE

  if [ ! -d "/usr/local/nvm" ]; then
    sudo rm -f /usr/local/bin/nvm
    sudo mkdir /usr/local/nvm
    sudo git clone https://github.com/xtuple/nvm.git /usr/local/nvm
    sudo ln -s /usr/local/nvm/nvm_bin.sh /usr/local/bin/nvm
    sudo chmod +x /usr/local/bin/nvm
  fi
  sudo nvm install $NODE_VERSION
  sudo nvm use $NODE_VERSION
  sudo nvm alias default $NODE_VERSION
  sudo nvm alias xtuple $NODE_VERSION

  # use latest npm
  sudo npm install -fg npm@1.4.25
	# npm no longer supports its self-signed certificates
	log "telling npm to use known registrars..."
	npm config set ca ""
        sudo chown -R $USER $HOME/.npm

  log "installing npm modules..."
  npm install --unsafe-perm 2>&1 | tee -a $LOG_FILE
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

	PGDIR=/etc/postgresql/${PG_VERSION}/main

  log "copying configs..."
	sudo cp $PGDIR/postgresql.conf $PGDIR/postgresql.conf.default
	sudo cat $PGDIR/postgresql.conf.default | sed "s/#listen_addresses = \S*/listen_addresses = \'*\'/" | sed "s/#custom_variable_classes = ''/custom_variable_classes = 'plv8'/" | sudo tee $PGDIR/postgresql.conf > /dev/null
	sudo chown postgres $PGDIR/postgresql.conf

	sudo cp $PGDIR/pg_hba.conf $PGDIR/pg_hba.conf.default
	sudo cat $PGDIR/pg_hba.conf.default | sed "s/local\s*all\s*postgres.*/local\tall\tpostgres\ttrust/" | sed "s/local\s*all\s*all.*/local\tall\tall\ttrust/" | sed "s#host\s*all\s*all\s*127\.0\.0\.1.*#host\tall\tall\t127.0.0.1/32\ttrust#" | sudo tee $PGDIR/pg_hba.conf > /dev/null
	sudo chown postgres $PGDIR/pg_hba.conf

  log "restarting postgres..."
	sudo service postgresql restart

  log "dropping existing db, if any..."
	sudo -u postgres dropdb $DATABASE || true

	cdir $BASEDIR/postgres

  log "Setup database"
    sudo wget -qO init.sql http://sourceforge.net/projects/postbooks/files/03%20PostBooks-databases/4.2.1/init.sql/download
	sudo -u postgres psql -q -f 'init.sql' 2>&1 | tee -a $LOG_FILE
}

init_everythings() {
	log "Setting properties of admin user"

	cdir $XT_DIR/node-datasource

	cat sample_config.js | sed "s/testDatabase: \"\"/testDatabase: '$DATABASE'/" > config.js
	log "Configured node-datasource"
	log "The database is now set up..."

	mkdir -p $XT_DIR/node-datasource/lib/private
	cdir $XT_DIR/node-datasource/lib/private
	cat /dev/urandom | tr -dc '0-9a-zA-Z!@#$%^&*_+-'| head -c 64 > salt.txt
	log "Created salt"
	cat /dev/urandom | tr -dc '0-9a-zA-Z!@#$%^&*_+-'| head -c 64 > encryption_key.txt
	log "Created encryption key"
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
  cat sample_login_data.js | sed "s/org: \'dev\'/org: \'$DATABASE\'/" > login_data.js
	log "Created testing login_data.js"

	cdir $XT_DIR
	npm run-script test-build 2>&1 | tee -a $LOG_FILE

	log "You can login to the database and mobile client with:"
	log "  username: admin"
	log "  password: admin"
	log "Installation now finished."
	log "Run the following commands to start the datasource:"
	if [ $USERNAME ]
	then
		log "cd node-datasource"
		log "node main.js"
	else
		log "cd /usr/local/src/xtuple/node-datasource/"
		log "node main.js"
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
