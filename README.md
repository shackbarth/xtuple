xtuple
======

xTuple Enterprise Resource Planning

To migrate to this new repo:
fork github.com/xtuple/xtuple.git

    cd /path/to/git/home
    git clone https://github.com/yourgithubname/xtuple.git
    cd xtuple
    git submodule update --init --recursive
    cd node-datasource
    npm install
    cd node_modules/express
    npm install
    cd ../../xt
    npm install
    cd ..

#copy over old datasource stuff if you have it
cp ../../node-datasource/config.js .
cp ../../node-datasource/lib/private/* lib/private/
#that was that

cd ../enyo-client/extensions
./tools/buildExtensions.sh

# talk to Steve about getting the imports/debug file for extension development

cd node-datasource
sudo ./main.js
