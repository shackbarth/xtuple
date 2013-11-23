rm -rf ../../jsdoc/outspecs
../../jsdoc/jsdoc -t ./templates/xtuple_specs -c ./jsdoc.conf.json -d ../../jsdoc/outspecs ../test/lib/specs.js ../test/specs ./jsdoc_spec_README.md
