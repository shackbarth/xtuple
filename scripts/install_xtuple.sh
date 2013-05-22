RUNALL=true
WORKAROUND=true
XT_VERSION=
RUN_DIR=$(pwd)
BASEDIR=/usr/local/src
if [ $SUDO_USER ]
then
	XT_DIR=/home/$SUDO_USER/xtuple
else
	echo "Must run with sudo, not as root."
	exit -1
fi
XTUPLE_REPO='mobile-repo.xtuple.com'

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
		echo "Must run with sudo, not as root."
		return 1
	 fi
      ;;
    n)
      # iNitialize the databases and stuff
      RUNALL=
      INIT=true
	 if [ -z "$SUDO_USER" ]
	 then
		echo "Must run with sudo, not as root."
		return 1
	 fi
      ;;
    x)
      # Checkout a specific version of the xTuple repo
	 XT_VERSION=$OPTARG
	 ;;
    W)
      # Don't use the ugly workarounds
      WORKAROUND=
      ;;
    init)
      # only for initializing a fresh debian package install
      RUNALL=
	 USERINIT=true
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

if [ $CLONE ]
then
	echo "Make sure you have created a github account and have forked the xTuple repos."
	echo "Also make sure you have uploaded your ssh key to your github."
	read -p "Github username: " USERNAME ERRS
fi

install_packages() {
	apt-get -q update &&
	apt-get -q -y install vim git subversion build-essential postgresql-9.1 postgresql-contrib postgresql-server-dev-9.1
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
	
	cd $BASEDIR
	if [ ! -d plv8js ]
	then
		echo "Cloning https://code.google.com/p/plv8js/"
		git clone https://code.google.com/p/plv8js/
	else
		echo "Found /usr/src/plv8js"
	fi
	if [ ! -d v8 ]
	then
		echo "Cloning git://github.com/v8/v8.git"
		git clone git://github.com/v8/v8.git
	else
		echo "Found /usr/src/v8"
	fi
	
	cd /home/$SUDO_USER
	# the user should have cloned their fork, not xtuple's
	if [ -d xtuple ]
	then
		echo "Found xtuple directory in /home/$SUDO_USER"
		cd xtuple
		
		git status 2>1 > /dev/null
		if [ $? -ne 0 ]
		then
			echo "Error: xtuple directory is not a git repo."
		fi
		
		if [ -z "$(git remote -v | grep git://github.com/xtuple/xtuple.git)" ]
		then
			echo "Adding xtuple remote"
			su $SUDO_USER -c "git remote add xtuple git://github.com/xtuple/xtuple.git"
		fi
		if [ $XT_VERSION ]
		then
			echo "Checking out $XT_VERSION"
			su $SUDO_USER -c "git checkout $XT_VERSION"
		fi
	elif [ $USERNAME ]
	then
		echo "Did not find xtuple directory in /home/$SUDO_USER."
		echo "Cloning git://github.com/$USERNAME/xtuple.git"
		su $SUDO_USER -c "git clone git://github.com/$USERNAME/xtuple.git"
		su $SUDO_USER -c "git remote add xtuple git://github.com/xtuple/xtuple.git"
		if [ $XT_VERSION ]
		then
			echo "Checking out $XT_VERSION"
			su $SUDO_USER -c "git checkout $XT_VERSION"
		fi
	else
		echo "ERROR: username not set. NOT cloning any user fork."
		return 2
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
	
	cd $RUN_DIR
	
	echo "Checking if nodejs is installed"
	dpkg -s nodejs 2>1 > /dev/null
	if [ $? -eq 0 ]
	then
		echo "nodejs is installed."
	else
		echo "nodejs is not installed"
		
		echo "Looking for nodejs_0.8.22-1_amd64.deb in $(pwd)"
		if [ ! -f nodejs_0.8.22-1_amd64.deb ]
		then
			echo "File not found. Attempting to download http://$XTUPLE_REPO/nodejs_0.8.22-1_amd64.deb"
			wget -q http://$XTUPLE_REPO/nodejs_0.8.22-1_amd64.deb && wait

			if [ $? -ne 0 ]
			then
				echo "Error occured while downloading ($?)"
				echo "Compiling from source"
				mkdir $XT_DIR/install
				cd $XT_DIR/install

				apt-get -q update
				apt-get -q -y install git cdbs curl devscripts debhelper dh-buildinfo zlib1g-dev

				git clone git://github.com/mark-webster/node-debian.git
				cd node-debian
				./build.sh clean 0.8.22
				./build.sh 0.8.22
				echo "Installing $XT_DIR/install/node-debian/nodejs_0.8.22-1_amd64.deb"
				dpkg -i $XT_DIR/install/node-debian/nodejs_0.8.22-1_amd64.deb
			fi
		else
			echo "Installing nodejs_0.8.22-1_amd64.deb"
			dpkg -i nodejs_0.8.22-1_amd64.deb
		fi
	fi
	
	cd $RUN_DIR
	echo "Checking if v8 or xtuple-mobileweb-lib is installed."
	dpkg -s xtuple-mobileweb-lib 2>1 > /dev/null
	if [ $? -eq 0 ]
	then
		echo "xtuple-mobileweb-lib is installed."
	else
		echo "Looking for xtuple-mobileweb-lib in $(pwd)"
		XTUPLE_LIB_DEB=$(ls | grep xtuple-mobileweb-lib | head -1)
		if [ $XTUPLE_LIB_DEB ]
		then
			echo "Installing xtuple-mobileweb-lib"
			dpkg -i $XTUPLE_LIB_DEB
		else
			echo "Package not found."
			
			echo "Attempting to download http://$XTUPLE_REPO/xtuple-mobileweb-lib_1.3.4-0_amd64.deb"
			wget -q http://$XTUPLE_REPO/xtuple-mobileweb-lib_1.3.4-0_amd64.deb && wait
			if [ $? -ne 0 ]
			then
				echo "Error occured while downloading ($?)"
			
				echo "Checking if libv8 is installed"
				dpkg -s libv8 2>1 > /dev/null
				if [ $? -eq 0 ]
				then
					echo "libv8 is installed"
				else
					echo "libv8 is not installed."
					
					echo "Looking for libv8-3.16.5_3.16.5-1_amd64.deb in $(pwd)"
					if [ -f libv8-3.16.5_3.16.5-1_amd64.deb ]
					then
						echo "Installing libv8-3.16.5_3.16.5-1_amd64.deb"
						dpkg -i libv8-3.16.5_3.16.5-1_amd64.deb
					else
						echo "File not found."
						echo "Attempting to download http://$XTUPLE_REPO/libv8-3.16.5_3.16.5-1_amd64.deb"
						
						wget -q http://$XTUPLE_REPO/libv8-3.16.5_3.16.5-1_amd64.deb && wait
						if [ $? -ne 0 ]
						then
							echo "Error occured while downloading ($?)"
							echo "Compiling from source."
			
							cd $BASEDIR/v8
							git checkout 3.16.5
			
							make dependencies
			
							make library=shared native
							echo "Installing library."
							cp $BASEDIR/v8/out/native/lib.target/libv8.so /usr/lib/ #root
						else
							echo "Installing libv8-3.16.5_3.16.5-1_amd64.deb"
							dpkg -i libv8-3.16.5_3.16.5-1_amd64.deb
						fi
					fi
				fi
				
				cd $RUN_DIR
				echo "Checking if plv8js is installed."
				dpkg -s postgresql-9.1-plv8 2>1 > /dev/null
				if [ $? -eq 0 ]
				then
					echo "plv8js is installed"
				else
					echo "plv8js is not installed"
					
					echo "Looking for postgresql-9.1-plv8_1.4.0-1_amd64.deb in $(pwd)"
					if [ ! -f postgresql-9.1-plv8_1.4.0-1_amd64.deb ]
					then
						echo "File not found."
						echo "Attempting to download http://$XTUPLE_REPO/postgresql-9.1-plv8_1.4.0-1_amd64.deb"
						wget -q http://$XTUPLE_REPO/postgresql-9.1-plv8_1.4.0-1_amd64.deb && wait

						if [ $? -ne 0 ]
						then
							echo "Error occured while downloading ($?)"
							echo "Compiling from source"
							cd $BASEDIR/plv8
							make V8_SRCDIR=../v8 CPLUS_INCLUDE_PATH=../v8/include
							if [ $? -ne 0 ]
							then
								return 1
							fi
							echo "Installing plv8js."
							make install
						else
							echo "Installing postgresql-9.1-plv8_1.4.0-1_amd64.deb"
							dpkg -i postgresql-9.1-plv8_1.4.0-1_amd64.deb
						fi
					else
						echo "Installing postgresql-9.1-plv8_1.4.0-1_amd64.deb"
						dpkg -i postgresql-9.1-plv8_1.4.0-1_amd64.deb
					fi
				fi
			fi
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
	
	echo ""
	echo "Dropping old databases if they already exist..."
	echo ""
	dropdb -U postgres global
	dropdb -U postgres dev
	
	cd $BASEDIR/postgres
	wget http://sourceforge.net/api/file/index/project-id/196195/mtime/desc/limit/200/rss
	wait
	NEWESTVERSION=$(cat rss | grep -o /03%20PostBooks-databases/4.[0-9].[0-9]/postbooks_demo-4.[0-9].[0-9].backup/download | grep -o 4.[0-9].[0-9] | head -1)
	rm rss

	if [ -z "$NEWESTVERSION" ]
	then
		NEWESTVERSION="4.0.3"
		echo "######################################################"
		echo "Couldn't find the latest version. Using $NEWESTVERSION instead."
		echo "######################################################"
	fi

	if [ ! -f postbooks_demo-$NEWESTVERSION.backup ]
	then
		wget -O postbooks_demo-$NEWESTVERSION.backup http://sourceforge.net/projects/postbooks/files/03%20PostBooks-databases/$NEWESTVERSION/postbooks_demo-$NEWESTVERSION.backup/download
		wget -O init.sql http://sourceforge.net/projects/postbooks/files/03%20PostBooks-databases/$NEWESTVERSION/init.sql/download
		wait
		if [ ! -f postbooks_demo-$NEWESTVERSION.backup ]
		then
			echo "Failed to download files from sourceforge."
			echo "Download the postbooks demo database and init.sql from sourceforge into"
			echo "$BASEDIR/postgres then run 'install_xtuple -pn' to finish installing this package."
			return 3
		fi
	fi

	echo "######################################################"
	echo "######################################################"
	echo "Setup databases"
	echo "######################################################"
	echo "######################################################"
	echo ""

	psql -q -U postgres -f 'init.sql'

	createdb -U postgres -O admin dev
	createdb -U postgres -O admin global 

	pg_restore -U postgres -d dev postbooks_demo-$NEWESTVERSION.backup

	psql -U postgres dev -c "CREATE EXTENSION plv8"
	
	cd $XT_DIR/enyo-client/database/source/
	psql -U admin -d dev -p 5432 -h localhost -f "init_instance.sql"

	cd $XT_DIR/node-datasource/database/source/
	psql -U admin -d global -p 5432 -h localhost -f "init_global.sql"

	cd $XT_DIR/enyo-client/extensions/source/admin/database/source
	psql -U admin -d dev -p 5432 -h localhost -f "init_script.sql"
	cd $XT_DIR/enyo-client/extensions/source/crm/database/source
	psql -U admin -d dev -p 5432 -h localhost -f "init_script.sql"
	cd $XT_DIR/enyo-client/extensions/source/incident_plus/database/source
	psql -U admin -d dev -p 5432 -h localhost -f "init_script.sql"
	cd $XT_DIR/enyo-client/extensions/source/project/database/source
	psql -U admin -d dev -p 5432 -h localhost -f "init_script.sql"
	cd $XT_DIR/enyo-client/extensions/source/sales/database/source
	psql -U admin -d dev -p 5432 -h localhost -f "init_script.sql"

	#cd $BASEDIR/private-extensions/source/connect/database/source
	#psql -U admin -d dev -p 5432 -h localhost -f "init_script.sql"
}

# Pull submodules

pull_modules() { 
	cd $XT_DIR
	git submodule update --init --recursive
	if [ $? -ne 0 ]
	then
		return 1
	fi

	if [ -z $(which npm) ]
	then
		return 2
	fi
	npm install
	
	rm -f debug.js
	echo "enyo.depends(" > debug.js
	echo "  '/public-extensions/source/project/client/package.js'," >> debug.js
	echo "  '/public-extensions/source/crm/client/package.js'," >> debug.js
	echo "  '/public-extensions/source/admin/client/package.js'," >> debug.js
	echo "  '/public-extensions/source/incident_plus/client/package.js'," >> debug.js
	echo "  '/public-extensions/source/sales/client/package.js'" >> debug.js
	echo ");" >> debug.js
}

init_everythings() {
	cd $XT_DIR/enyo-client/extensions
	./tools/buildExtensions.sh
	
	# deploy enyo client
	cd ../application
	rm -rf deploy
	cd tools
	./deploy.sh 
	
	echo ""
	echo "######################################################"
	echo "######################################################"
	echo "Running the ORM installer on the databases"
	echo "######################################################"
	echo "######################################################"
	echo ""
	
	cd $XT_DIR/node-datasource/installer/
	./installer.js -cli -h localhost -d dev -u admin -p 5432 -P admin --path ../../enyo-client/database/orm/
	./installer.js -cli -h localhost -d global -u admin -p 5432 -P admin --path ../database/orm/
	./installer.js -cli -h localhost -d dev -u admin -p 5432 -P admin --path ../../enyo-client/extensions/source/crm/database/orm
	./installer.js -cli -h localhost -d dev -u admin -p 5432 -P admin --path ../../enyo-client/extensions/source/incident_plus/database/orm
	./installer.js -cli -h localhost -d dev -u admin -p 5432 -P admin --path ../../enyo-client/extensions/source/project/database/orm
	./installer.js -cli -h localhost -d dev -u admin -p 5432 -P admin --path ../../enyo-client/extensions/source/sales/database/orm
	#./installer.js -cli -h localhost -d dev -u admin -p 5432 -P admin --path ../../../private-extensions/source/connect/database/orm/
	
	echo ""
	echo "######################################################"
	echo "######################################################"
	echo "Adding user and organization to the databases"
	echo "######################################################"
	echo "######################################################"
	echo ""

	psql -U postgres global -c "INSERT INTO xt.dbserver (dbserver_name, dbserver_hostname, dbserver_port, dbserver_password, dbserver_username) VALUES ('localhost', 'localhost', 5432, 'admin', 'admin');"
	psql -U postgres global -c "INSERT INTO xt.org (org_name, org_dbserver_name, org_licenses, org_active) VALUES ('dev', 'localhost', 10, True);"
	psql -U postgres global -c "INSERT INTO xt.org (org_name, org_dbserver_name, org_licenses, org_active) VALUES ('global', 'localhost', 10, True);"
	psql -U postgres global -c "INSERT INTO xt.usrorg (usrorg_usr_id, usrorg_org_name, usrorg_username) VALUES ('admin', 'dev', 'admin');"

	psql -U postgres global -c "INSERT INTO xt.ext (ext_name, ext_descrip, ext_location, ext_priv_name) VALUES ('admin', 'Administration extension', '/public-extensions', 'AccessAdminExtension');"

	psql -U postgres global -c "INSERT INTO xt.orgext (orgext_org_name, orgext_ext_id) SELECT 'dev', ext_id from xt.ext WHERE ext_name = 'admin';"
	psql -U postgres global -c "UPDATE xt.usr SET usr_password='\$2a\$10\$orE6aDt4lAOkS0eLZPer5OVCYOrVOpiRGhVa3uyueRvW4Mh4BLGeW' WHERE usr_id='admin';"

	cd $XT_DIR/node-datasource
	cat sample_config.js | sed 's/bindAddress: "localhost",/bindAddress: "0.0.0.0",/' > config.js

	echo ""
	echo "Databaes are now setup..."
	echo ""
	
	mkdir -p $XT_DIR/node-datasource/lib/private
	cd $XT_DIR/node-datasource/lib/private
	cat /dev/urandom | tr -dc '0-9a-zA-Z!@#$%^&*_+-'| head -c 64 > salt.txt
	openssl genrsa -des3 -out server.key -passout pass:xtuple 1024 &&
	openssl rsa -in server.key -passin pass:xtuple -out key.pem -passout pass:xtuple &&
	openssl req -batch -new -key key.pem -out server.csr &&
	openssl x509 -req -days 365 -in server.csr -signkey key.pem -out server.crt
	if [ $? -ne 0 ]
	then
		echo ""
		echo "######################################################"
		echo "Failed to generate server certificate in $XT_DIR/node-datasource/lib/private"
		echo "######################################################"
	fi
	
	echo ""
	echo "######################################################"
	echo "######################################################"
	echo "You can login to the database and mobile client with:"
	echo "username: admin"
	echo "password: admin"
	echo "######################################################"
	echo "######################################################"
	echo ""
	echo "Installation now finished."
	echo ""
	echo "Run the following commands to start the datasource:"
	echo ""
	if [ $USERNAME ]
	then
		echo "cd ~/xtuple/node-datasource"
		echo "sudo node main.js"
	else
		echo "cd /usr/local/src/xtuple/node-datasource/"
		echo "sudo node main.js"
	fi
}

if [ $USERINIT ]
then
	user_init
fi

if [ $INSTALL ]
then
	install_packages
	if [ $? -ne 0 ]
	then
		exit 1
	fi
fi

if [ $CLONE ]
then
	clone_repo
	if [ $? -eq 2 ]
	then
		echo "Tried URL: git://github.com/$USERNAME/xtuple.git"
		exit 2
	fi
fi
if [ $BUILD ]
then
	build_deps
	if [ $? -ne 0 ]
	then
		echo "plv8 failed to build. Try fiddling with it manually." 1>&2
		exit 3
	fi
fi
if [ $POSTGRES ]
then
	setup_postgres
	if [ $? -ne 0 ]
	then
		exit 4
	fi
fi
if [ $GRAB ]
then
	pull_modules
	if [ $? -eq 1 ]
	then
		echo "Updating the submodules failed.  Hopefully this doesn't happen."
		exit 5
	fi
	if [ $? -eq 2 ]
	then
		echo "npm executable not found.  Check if node compiled and installed properly. Deb file should exist in /usr/local/src/node-debian"
	fi
fi
if [ $INIT ]
then
	init_everythings
	if [ $? -ne 0 ]
	then
		echo "."
	fi
fi

echo "All Done!"
