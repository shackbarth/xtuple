RUN_DIR=$(pwd)
LOG_FILE=$RUN_DIR/install.log
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
XT_VERSION=
NODE_VERSION=
varlog RUN_DIR
BASEDIR=/usr/local/src
varlog BASEDIR
LIBS_ONLY=
if [ $SUDO_USER ]
then
	XT_DIR=$RUN_DIR/..
	varlog XT_DIR
else
	log "Must run with sudo, not as root."
	exit -1
fi
XTUPLE_REPO='http://sourceforge.net/projects/postbooks/files/mobile-debian'
varlog XTUPLE_REPO

while getopts ":icbpgnh-:" opt; do
  case $opt in
    i)
      # Install packages
      RUNALL=
      INSTALL=true
      ;;
    c)
      # Clone repos
      RUNALL=
      CLONE=true
      ;;
    b)
      # Build v8, plv8 and nodejs
      RUNALL=
      BUILD=true
      ;;
    p)
      # Configure postgress
      RUNALL=
      POSTGRES=true
      ;;
    g)
      # Grab and install all the submodules/extensions
      RUNALL=
      GRAB=true
	 if [ -z "$SUDO_USER" ]
	 then
		log "Must run with sudo, not as root."
		return 1
	 fi
      ;;
    n)
      # iNitialize the databases and stuff
      RUNALL=
      INIT=true
	 if [ -z "$SUDO_USER" ]
	 then
		log "Must run with sudo, not as root."
		return 1
	 fi
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
	 echo "This script must be run with sudo."
	 echo ""
	 echo "To install everything, just do sudo ./install_xtuple.sh"
	 echo "Everything will go in /usr/local/src/xtuple"
	 echo ""
	 echo -e "  -b\t\t"
	 echo -e "  -c\t\t"
	 echo -e "  -g\t\t"
	 echo -e "  -h\t\t"
	 echo -e "  -i\t\t"
	 echo -e "  -n\t\t"
	 echo -e "  -p\t\t"
      ;;
  esac
done

if [ $RUNALL ]
then
	INSTALL=true
	CLONE=true
	BUILD=true
	POSTGRES=true
	GRAB=true
	INIT=true
fi

if [ $USERINIT ]
then
	INSTALL=
	CLONE=
	BUILD=
	POSTGRES=
	GRAB=
	INIT=
fi

if [ -z "$NODE_VERSION" ]
then
	NODE_VERSION=0.8.22-1_amd64
	varlog NODE_VERSION
fi

install_packages() {
	apt-get -q update 2>1 | tee -a $LOG_FILE
	apt-get -q -y install vim git subversion build-essential postgresql-9.1 postgresql-contrib postgresql-server-dev-9.1 2>1 | tee -a $LOG_FILE
	log "apt-get returned $?"
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

# Clone repo
clone_repo() {
	mkdir -p $BASEDIR
	if [ $? -ne 0 ]
	then
		return 1
	fi
	
	cdir $BASEDIR
	if [ ! -d plv8js ]
	then
		log "Cloning https://code.google.com/p/plv8js/"
		git clone https://code.google.com/p/plv8js/ 2>1 | tee -a $LOG_FILE
	else
		log "Found /usr/src/plv8js"
	fi
	if [ ! -d v8 ]
	then
		log "Cloning git://github.com/v8/v8.git"
		git clone git://github.com/v8/v8.git 2>1 | tee -a $LOG_FILE
	else
		log "Found /usr/src/v8"
	fi
	
	cdir $XT_DIR
	# add remote
	if [ -z "$(git remote -v | grep xtuple/xtuple.git)" ]
	then
		log "Adding xtuple remote"
		su $SUDO_USER -c "git remote add --track master xtuple https://github.com/xtuple/xtuple.git"
	fi
	
	if [ $XT_VERSION ]
	then
		log "Checking out $XT_VERSION"
		su $SUDO_USER -c "git checkout $XT_VERSION" 2>1 | tee -a $LOG_FILE
	fi
}

# Build dependencies
build_deps() {
	# for each dependency
	# 1. check if it's installed
	# 2. look to see if the file is already downloaded
	# 3. if not, see if we can download the pre-made deb package
	# 4. if not, compile from source
	# the source should be cloned whether we need to compile or not
	
	cdir $RUN_DIR
	
	log "Checking if nodejs is installed"
	dpkg -s nodejs 2>1 > /dev/null
	if [ $? -eq 0 ]
	then
		log "nodejs is installed."
	else
		log "nodejs is not installed"
		
		log "Looking for nodejs_$NODE_VERSION.deb in $(pwd)"
		if [ ! -f nodejs_$NODE_VERSION.deb ]
		then
			log "File not found. Attempting to download $XTUPLE_REPO/nodejs_$NODE_VERSION.deb"
			wget -q $XTUPLE_REPO/nodejs_$NODE_VERSION.deb && wait

			if [ $? -ne 0 ]
			then
				log "Error occured while downloading ($?)"
				log "Compiling from source"
				mkdir $XT_DIR/install
				cdir $XT_DIR/install

				apt-get -q update 2>1 | tee -a $LOG_FILE
				apt-get -q -y install git cdbs curl devscripts debhelper dh-buildinfo zlib1g-dev 2>1 | tee -a $LOG_FILE

				git clone git://github.com/mark-webster/node-debian.git 2>1 | tee -a $LOG_FILE
				cdir node-debian
				./build.sh clean $(log $NODE_VERSION | grep -o "0\.[0-9]\.[0-9]*") 2>1 | tee -a $LOG_FILE
				./build.sh $(log $NODE_VERSION | grep -o "0\.[0-9]\.[0-9]*") 2>1 | tee -a $LOG_FILE
				log "Installing $XT_DIR/install/node-debian/nodejs_$NODE_VERSION.deb"
				dpkg -i $XT_DIR/install/node-debian/nodejs_$NODE_VERSION.deb 2>1 | tee -a $LOG_FILE
			else
				log "Installing nodejs_$NODE_VERSION.deb"
				dpkg -i nodejs_$NODE_VERSION.deb 2>1 | tee -a $LOG_FILE
			fi
		else
			log "Installing nodejs_$NODE_VERSION.deb"
			dpkg -i nodejs_$NODE_VERSION.deb 2>1 | tee -a $LOG_FILE
		fi
	fi
	
	cdir $RUN_DIR
	log "Checking if libv8 is installed"
	dpkg -s libv8 2>1 > /dev/null
	if [ $? -eq 0 ]
	then
		log "libv8 is installed"
	else
		log "libv8 is not installed."
		
		log "Looking for libv8-3.16.5_3.16.5-1_amd64.deb in $(pwd)"
		if [ -f libv8-3.16.5_3.16.5-1_amd64.deb ]
		then
			log "Installing libv8-3.16.5_3.16.5-1_amd64.deb"
			dpkg -i libv8-3.16.5_3.16.5-1_amd64.deb 2>1 | tee -a $LOG_FILE
		else
			log "File not found."
			log "Attempting to download $XTUPLE_REPO/libv8-3.16.5_3.16.5-1_amd64.deb"
			
			wget -q $XTUPLE_REPO/libv8-3.16.5_3.16.5-1_amd64.deb && wait
			if [ $? -ne 0 ]
			then
				log "Error occured while downloading ($?)"
				log "Compiling from source."

				cdir $BASEDIR/v8
				git checkout 3.16.5 2>1 | tee -a $LOG_FILE

				make dependencies 2>1 | tee -a $LOG_FILE

				make library=shared native 2>1 | tee -a $LOG_FILE
				log "Installing library."
				cp $BASEDIR/v8/out/native/lib.target/libv8.so /usr/lib/ #root
			else
				log "Installing libv8-3.16.5_3.16.5-1_amd64.deb"
				dpkg -i libv8-3.16.5_3.16.5-1_amd64.deb 2>1 | tee -a $LOG_FILE
			fi
		fi
	fi
	
	cdir $RUN_DIR
	log "Checking if plv8js is installed."
	dpkg -s postgresql-9.1-plv8 2>1 > /dev/null
	if [ $? -eq 0 ]
	then
		log "plv8js is installed"
	else
		log "plv8js is not installed"
		
		log "Looking for postgresql-9.1-plv8_1.4.0-1_amd64.deb in $(pwd)"
		if [ ! -f postgresql-9.1-plv8_1.4.0-1_amd64.deb ]
		then
			log "File not found."
			log "Attempting to download $XTUPLE_REPO/postgresql-9.1-plv8_1.4.0-1_amd64.deb"
			wget -q $XTUPLE_REPO/postgresql-9.1-plv8_1.4.0-1_amd64.deb && wait

			if [ $? -ne 0 ]
			then
				log "Error occured while downloading ($?)"
				log "Compiling from source"
				cdir $BASEDIR/plv8
				make V8_SRCDIR=../v8 CPLUS_INCLUDE_PATH=../v8/include 2>1 | tee -a $LOG_FILE
				if [ $? -ne 0 ]
				then
					return 1
				fi
				log "Installing plv8js."
				make install 2>1 | tee -a $LOG_FILE
			else
				log "Installing postgresql-9.1-plv8_1.4.0-1_amd64.deb"
				dpkg -i postgresql-9.1-plv8_1.4.0-1_amd64.deb 2>1 | tee -a $LOG_FILE
			fi
		else
			log "Installing postgresql-9.1-plv8_1.4.0-1_amd64.deb"
			dpkg -i postgresql-9.1-plv8_1.4.0-1_amd64.deb 2>1 | tee -a $LOG_FILE
		fi
	fi
}

# Configure postgres and initialize postgres databases

setup_postgres() {
	mkdir -p $BASEDIR/postgres
	if [ $? -ne 0 ]
	then
		return 1
	fi
	
	PGDIR=/etc/postgresql/9.1/main
	mv $PGDIR/postgresql.conf $PGDIR/postgresql.conf.default
	if [ $? -ne 0 ]
	then
		return 2
	fi
	cat $PGDIR/postgresql.conf.default | sed "s/#listen_addresses = \S*/listen_addresses = \'*\'/" | sed "s/#custom_variable_classes = ''/custom_variable_classes = 'plv8'/" > $PGDIR/postgresql.conf
	chown postgres $PGDIR/postgresql.conf
	mv $PGDIR/pg_hba.conf $PGDIR/pg_hba.conf.default
	cat $PGDIR/pg_hba.conf.default | sed "s/local\s*all\s*postgres.*/local\tall\tpostgres\ttrust/" | sed "s/local\s*all\s*all.*/local\tall\tall\ttrust/" | sed "s#host\s*all\s*all\s*127\.0\.0\.1.*#host\tall\tall\t127.0.0.1/32\ttrust#" > $PGDIR/pg_hba.conf
	chown postgres $PGDIR/pg_hba.conf

	service postgresql restart
	
	log ""
	log "Dropping old databases if they already exist..."
	log ""
	dropdb -U postgres dev
	
	cdir $BASEDIR/postgres
	wget http://sourceforge.net/api/file/index/project-id/196195/mtime/desc/limit/200/rss
	wait
	NEWESTVERSION=$(cat rss | grep -o /03%20PostBooks-databases/4.[0-9].[0-9]/postbooks_demo-4.[0-9].[0-9].backup/download | grep -o 4.[0-9].[0-9] | head -1)
	rm rss

	if [ -z "$NEWESTVERSION" ]
	then
		NEWESTVERSION="4.0.3"
		log "######################################################"
		log "Couldn't find the latest version. Using $NEWESTVERSION instead."
		log "######################################################"
	fi

	if [ ! -f postbooks_demo-$NEWESTVERSION.backup ]
	then
		wget -O postbooks_demo-$NEWESTVERSION.backup http://sourceforge.net/projects/postbooks/files/03%20PostBooks-databases/$NEWESTVERSION/postbooks_demo-$NEWESTVERSION.backup/download
		wget -O init.sql http://sourceforge.net/projects/postbooks/files/03%20PostBooks-databases/$NEWESTVERSION/init.sql/download
		wait
		if [ ! -f postbooks_demo-$NEWESTVERSION.backup ]
		then
			log "Failed to download files from sourceforge."
			log "Download the postbooks demo database and init.sql from sourceforge into"
			log "$BASEDIR/postgres then run 'install_xtuple -pn' to finish installing this package."
			return 3
		fi
	fi

	log "######################################################"
	log "######################################################"
	log "Setup database"
	log "######################################################"
	log "######################################################"
	log ""

	psql -q -U postgres -f 'init.sql' 2>1 | tee -a $LOG_FILE

	createdb -U postgres -O admin dev 2>1 | tee -a $LOG_FILE

	pg_restore -U postgres -d dev postbooks_demo-$NEWESTVERSION.backup 2>1 | tee -a $LOG_FILE

	psql -U postgres dev -c "CREATE EXTENSION plv8" 2>1 | tee -a $LOG_FILE
	
	cdir $XT_DIR/enyo-client/database/source/
	psql -U admin -d dev -p 5432 -h localhost -f "init_instance.sql" 2>1 | tee -a $LOG_FILE

	cdir $XT_DIR/enyo-client/extensions/source/crm/database/source
	psql -U admin -d dev -p 5432 -h localhost -f "init_script.sql" 2>1 | tee -a $LOG_FILE
	cdir $XT_DIR/enyo-client/extensions/source/project/database/source
	psql -U admin -d dev -p 5432 -h localhost -f "init_script.sql" 2>1 | tee -a $LOG_FILE
	cdir $XT_DIR/enyo-client/extensions/source/sales/database/source
	psql -U admin -d dev -p 5432 -h localhost -f "init_script.sql" 2>1 | tee -a $LOG_FILE
}

# Pull submodules

pull_modules() { 
	cdir $XT_DIR
	git submodule update --init --recursive 2>1 | tee -a $LOG_FILE
	if [ $? -ne 0 ]
	then
		return 1
	fi

	if [ -z $(which npm) ]
	then
		log "Couldn't find npm"
		return 2
	fi
	npm install 2>1 | tee -a $LOG_FILE
	npm install -g mocha 2>1 | tee -a $LOG_FILE

    cdir node-datasource/test/shared
    rm -f login_data.js
    echo "exports.data = {" >> login_data.js
    echo "  webaddress: ''," >> login_data.js
    echo "  username: 'admin', //------- Enter the xTuple username" >> login_data.js
    echo "  pwd: 'admin', //------ enter the password here" >> login_data.js
    echo "  org: 'dev', //------ enter the database name here" >> login_data.js
    echo "  suname: '', //-------enter the sauce labs username" >> login_data.js
    echo "  sakey: '' //------enter the sauce labs access key" >> login_data.js
    echo "}" >> login_data.js
	log "Created testing login_data.js"

	cdir ../../../enyo-client/extensions
    rm -f debug.js
    echo "enyo.depends(" > debug.js
    echo "  '/dev/core-extensions/source/project/client/package.js'," >> debug.js
    echo "  '/dev/core-extensions/source/crm/client/package.js'," >> debug.js
    echo "  '/dev/core-extensions/source/sales/client/package.js'" >> debug.js
    echo ");" >> debug.js
	log "Created debug.js"
}

init_everythings() {
	cdir $XT_DIR/enyo-client/extensions
	./tools/buildExtensions.sh 2>1 | tee -a $LOG_FILE
	
	# deploy enyo client
	cdir ../application
	rm -rf deploy
	cdir tools
	./deploy.sh 2>1 | tee -a $LOG_FILE
	
	log ""
	log "######################################################"
	log "######################################################"
	log "Running the ORM installer on the database"
	log "######################################################"
	log "######################################################"
	log ""
	
	cdir $XT_DIR/node-datasource/installer/
	./installer.js -h localhost -d dev -u admin -p 5432 -P admin --path ../../enyo-client/database/orm/ 2>1 | tee -a $LOG_FILE
	./installer.js -h localhost -d dev -u admin -p 5432 -P admin --path ../../enyo-client/extensions/source/crm/database/orm 2>1 | tee -a $LOG_FILE
	./installer.js -h localhost -d dev -u admin -p 5432 -P admin --path ../../enyo-client/extensions/source/project/database/orm 2>1 | tee -a $LOG_FILE
	./installer.js -h localhost -d dev -u admin -p 5432 -P admin --path ../../enyo-client/extensions/source/sales/database/orm 2>1 | tee -a $LOG_FILE

	log ""
	log "######################################################"
	log "######################################################"
	log "Setting properties of admin user"
	log "######################################################"
	log "######################################################"
	log ""

	psql -U postgres dev -c "select xt.js_init(); insert into xt.usrext (usrext_usr_username, usrext_ext_id) select 'admin', ext_id from xt.ext where ext_location = '/core-extensions';" 2>1 | tee -a $LOG_FILE
  
	cdir $XT_DIR/node-datasource

	cat sample_config.js | sed 's/bindAddress: "localhost",/bindAddress: "0.0.0.0",/' | sed 's/testDatabase: ""/testDatabase: "dev"/' > config.js
	log "Configured node-datasource"

	log ""
	log "The database is now set up..."
	log ""
	
	mkdir -p $XT_DIR/node-datasource/lib/private
	cdir $XT_DIR/node-datasource/lib/private
	cat /dev/urandom | tr -dc '0-9a-zA-Z!@#$%^&*_+-'| head -c 64 > salt.txt
	log "Created salt"
	openssl genrsa -des3 -out server.key -passout pass:xtuple 1024 2>1 | tee -a $LOG_FILE
	openssl rsa -in server.key -passin pass:xtuple -out key.pem -passout pass:xtuple 2>1 | tee -a $LOG_FILE
	openssl req -batch -new -key key.pem -out server.csr 2>1 | tee -a $LOG_FILE
	openssl x509 -req -days 365 -in server.csr -signkey key.pem -out server.crt 2>1 | tee -a $LOG_FILE
	if [ $? -ne 0 ]
	then
		log ""
		log "######################################################"
		log "Failed to generate server certificate in $XT_DIR/node-datasource/lib/private"
		log "######################################################"
		return 3
	fi
	
	log ""
	log "######################################################"
	log "######################################################"
	log "You can login to the database and mobile client with:"
	log "username: admin"
	log "password: admin"
	log "######################################################"
	log "######################################################"
	log ""
	log "Installation now finished."
	log ""
	log "Run the following commands to start the datasource:"
	log ""
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
	log "## install_packages ##"
	install_packages
	log "## install_packages returned $? ##"
fi

if [ $CLONE ]
then
	log "## clone_repo ##"
	clone_repo
	log "## clone_repo returned $? ##"
	if [ $? -eq 2 ]
	then
		log "Tried URL: git://github.com/$USERNAME/xtuple.git"
		exit 2
	fi
fi
if [ $BUILD ]
then
	log "## build_repo ##"
	build_deps
	log "## build_repo returned $? ##"
	if [ $? -ne 0 ]
	then
		log "plv8 failed to build. Try fiddling with it manually." 1>&2
		exit 3
	fi
fi
if [ $POSTGRES ]
then
	log "## setup_postgres ##"
	setup_postgres
	log "## setup_postgres returned $? ##"
	if [ $? -ne 0 ]
	then
		exit 4
	fi
fi
if [ $GRAB ]
then
	log "## pull_modules ##"
	pull_modules
	log "## pull_modules returned $? ##"
	if [ $? -eq 1 ]
	then
		log "Updating the submodules failed.  Hopefully this doesn't happen."
		exit 5
	fi
	if [ $? -eq 2 ]
	then
		log "npm executable not found.  Check if node compiled and installed properly. Deb file should exist in /usr/local/src/node-debian"
	fi
fi
if [ $INIT ]
then
	log "## init_everythings ##"
	init_everythings
	log "## init_everythings returned $? ##"
	if [ $? -ne 0 ]
	then
		log "bad."
	fi
fi

log "All Done!"
