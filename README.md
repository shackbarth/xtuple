xTuple
======

xTuple Enterprise Resource Planning Mobile-Web client


### Installing this project

The install script for this project is Debian based and tested to run on Ubuntu 12.04. It is best if you do
not already have postgres installed on your machine.

To install this project, first fork this repo onto your own github account
and clone it into your preferred source directory. Then run:

    cd xtuple/scripts
    sudo ./install_xtuple.sh

This will take a while. Then, to start the datasource, run

    cd ../node-datasource
    sudo ./main.js

Launch your local browser and navigate to the address `localhost`. Default username and password are `admin`.

### Release Notes

View the [Release Notes](RELEASE.md) to see a change log.

### Additional Resources

  * [Setting up an Ubuntu Virtual Machine](https://github.com/xtuple/xtuple/blob/master/docs/UBUNTU_SETUP.md)
  * [Architectural Overview](https://github.com/xtuple/xtuple/blob/master/docs/OVERVIEW.md)
  * [Building an Extension Tutorial](https://github.com/xtuple/xtuple-extensions/blob/master/docs/TUTORIAL.md)
