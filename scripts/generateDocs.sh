rm -rf ../../jsdoc/out
#../../jsdoc/jsdoc -l -d ../../jsdoc/out -r ../lib/backbone-x/source ../lib/tools/source ../lib/enyo-x/source/widgets ../lib/enyo-x/source/views ../enyo-client/application/source ../enyo-client/extensions/source ../node-datasource/routes  

# using the xtuple templates gives me a Error: fs.writeFileSync requires an encoding on Rhino!
# not sure why
#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../lib/backbone-x/source
#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../lib/enyo-x/source/widgets/
#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../lib/enyo-x/source/views/

#the above error has been corrected and all the paths appended to the below string:
# to include README.md's just append the path to it at then end of the string i.e. ../README.md
../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../lib/backbone-x/source ../lib/tools/source ../lib/enyo-x/source/widgets ../lib/enyo-x/source/views ../node-datasource/routes 
#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../lib/backbone-x/source  
#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../lib/enyo-x/source/widgets 
#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../lib/enyo-x/source/views 
#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../lib/tools/source 
#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../node-datasource/routes ../lib/backbone-x/source 

#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../enyo-client/application/source 
#../../jsdoc/jsdoc -l -t ./templates/xtuple -d ../../jsdoc/out -r ../enyo-client/extensions/source  

