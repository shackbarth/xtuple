rm -rf ../../jsdoc/out
../../jsdoc/jsdoc -t ./templates/xtuple -c ./jsdoc.conf.json -d ../../jsdoc/out -r ../lib/backbone-x/source ../lib/tools/source ../lib/enyo-x/source/widgets ../lib/enyo-x/source/views ../lib/enyo-x/source/app.js ../lib/enyo-x/source/core.js ./jsdoc_README.md
