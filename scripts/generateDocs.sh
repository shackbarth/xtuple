# presupposes that you've installed jsdoc 3.2.2 in an adjacent folder to xtuple
# XXX it really does have to be 3.2.2
# TODO: put jsdoc in package.json
# usage:
# cd scripts
# ./generateDocs.sh
# open jsdoc/out/index.html with a browser to see what it looks like
# Any items in the Global part of the rightbar are probably there because the tag is miswritten
#
rm -rf ../../jsdoc/out
../../jsdoc/jsdoc -t ./templates/xtuple -c ./jsdoc.conf.json -d ../../jsdoc/out -r ../lib/backbone-x/source ../lib/tools/source ../lib/enyo-x/source/widgets ../lib/enyo-x/source/views ../lib/enyo-x/source/app.js ../lib/enyo-x/source/core.js ./jsdoc_README.md
