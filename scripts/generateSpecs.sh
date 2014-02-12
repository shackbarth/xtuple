rm -rf ../../jsdoc/outspecsuser
../../jsdoc/jsdoc -t ./templates/xtuple_specs -c ./jsdoc-user.conf.json -d ../../jsdoc/outspecsuser ../test/specs ./jsdoc_spec_user_README.md
rm -rf ../../jsdoc/outspecs
../../jsdoc/jsdoc -t ./templates/xtuple_specs -c ./jsdoc.conf.json -d ../../jsdoc/outspecs ../test/specs ./jsdoc_spec_README.md
