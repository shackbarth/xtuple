rm -rf ../../jsdoc/out
# to include README.md's just append the path to it at then end of the string i.e. ../README.md
../../jsdoc/jsdoc -l -c ./jsdoc.conf.json -d ../../jsdoc/out -r ../lib/backbone-x/source ../lib/tools/source ../lib/enyo-x/source/widgets ../lib/enyo-x/source/views ../lib/enyo-x/source/app.js ../lib/enyo-x/source/core.js ./jsdoc_README.md ./jsdoc_README.md
