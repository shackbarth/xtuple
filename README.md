xTuple
======

xTuple Enterprise Resource Planning Mobile-Web client


### Installing this project

This project is meant to run on Ubuntu 12.04. It is best if you do
not already have postgres installed on your machine.

To install this project, first fork this repo onto your own github account
and clone it into your preferred source directory. Then run:

```bash
cd xtuple/scripts
sudo ./install_xtuple.sh
```

This will take a while. Then, to start the datasource, run

```bash
cd xtuple/node-datasource
sudo ./main.js
```

### Release Notes

View the [Release Notes](RELEASE.md) to see a change log.

### Additional Resources

  * [Setting up an Ubuntu Virtual Machine](https://github.com/jrogelstad/xtuple/blob/master/docs/UBUNTU_SETUP.md)
  * [Architectural Overview](https://github.com/xtuple/xtuple/blob/master/docs/OVERVIEW.md)
  * [Building an Extension Tutorial](https://github.com/xtuple/xtuple-extensions/blob/master/docs/TUTORIAL.md)
