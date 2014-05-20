xTuple
======

xTuple Enterprise Resource Planning Mobile-Web client

[![Build Status](https://travis-ci.org/xtuple/xtuple.png)](https://travis-ci.org/xtuple/xtuple)

### Installing this project

*We strongly recommend that you install this project in a virtual
machine created with our automated VM creation script:*
[Creating a Virtual Development Environment using Vagrant](https://github.com/xtuple/xtuple-vagrant/blob/master/README.md)

If you choose to install your own OS, whether on physical hardware or in a
VM, we cannot support you. That said, the setup script in step 3 requires a
64 bit Ubuntu machine.  We have only tested this with Ubuntu 12.04.  *If
you do not have 64 bit hardware the install script will not work* and you
will have to do a manual build.  It is best if you do not already have
postgres installed on your machine.

#### 0. Fork this repository onto your own github account
Navigate to http://github.com/xtuple/xtuple and click the FORK button.

#### 1. Check out the xtuple repository
We recommend checking out the latest tagged release. If you want to just
check out the latest code you can skip the last step below (the 'git checkout').

    git clone --recursive git://github.com/<username>/xtuple.git
    cd xtuple
    git remote add XTUPLE git://github.com/xtuple/xtuple.git
    git fetch XTUPLE
    git checkout `git describe --abbrev=0`

#### 2. Run the install script

    bash scripts/install_xtuple.sh

You will be prompted for `sudo` credentials; installation will take a few
minutes.

#### 3. Setup and run the server

    cd node-datasource
    node main.js

Launch your local browser and navigate to the address `localhost:8888`. Default username and password are `admin`.

### Release Notes

View the [Release Notes](RELEASE.md) to see a change log.

### Additional Resources

  * [How to Setup xTuple](https://github.com/xtuple/xtuple/wiki/How-to-set-up-xTuple)
  * [Creating a Virtual Development Environment using Vagrant](https://github.com/xtuple/xtuple-vagrant/blob/master/README.md)
  * [Architectural Overview](https://github.com/xtuple/xtuple/wiki/Overview)
  * [Building an Extension Tutorial](https://github.com/xtuple/xtuple-extensions/blob/master/docs/TUTORIAL.md)
  * [API documentation](http://xtuple.com/jsdoc)
  * [Developer Wiki](https://github.com/xtuple/xtuple/wiki)
