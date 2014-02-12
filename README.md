xTuple
======

xTuple Enterprise Resource Planning Mobile-Web client

[![Build Status](https://travis-ci.org/xtuple/xtuple.png)](https://travis-ci.org/xtuple/xtuple)

### Installing this project

The install script for this project is Debian based and designed to run on a 64 bit Ubuntu 12.04 machine. *If you do not have 64 bit hardware the install script will not work for you* and you will have to do a manual build. It is best if you do not already have postgres installed on your machine.

#### 1. Fork this repo onto your own github account
We recommend checking out the latest tagged release, but if you want to just
checkout the lastest code you can skip this next step. Find and checkout the
latest tag with the following:

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

  * [Creating a Virtual Development Environment using Vagrant](https://github.com/xtuple/xtuple-vagrant/blob/master/README.md)
  * [Architectural Overview](https://github.com/xtuple/xtuple/wiki/Overview)
  * [Building an Extension Tutorial](https://github.com/xtuple/xtuple-extensions/blob/master/docs/TUTORIAL.md)
  * [API documentation](http://xtuple.com/jsdoc)
  * [Developer Wiki](https://github.com/xtuple/xtuple/wiki)
