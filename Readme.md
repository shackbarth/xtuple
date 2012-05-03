XTUPLE CLIENT
=============

The xTuple client now runs on Blossom.

Prerequisites
-------------

* [blossom] (https://github.com/fohr/blossom) -- see below
* [datasource] (https://github.com/xtuple/datasource) -- follow instructions has own prerequisites
* [database] (https://github.com/xtuple/database) -- follow instructions has own prerequisites

Installing Blossom
------------------

Blossom's buildtools run on Node, so you'll need to install that first:

    http://nodejs.org/

This automatically includes npm, the Node Package Manager.

At the top-level of the xtuple/client project, do:

    $ mkdir node_modules
    $ cd node_modules
    $ git clone https://github.com/fohr/blossom.git

This makes the 'blossom' module available to npm.

When you need a newer version of blossom, simply do:

    $ cd node_modules
    $ git pull

And you'll be up-to-date.