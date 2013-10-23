rm -rf ../../jsdoc/outspecs
../../jsdoc/jsdoc -t ./templates/xtuple_specs -c ./jsdoc.conf.json -d ../../jsdoc/outspecs ../test/mocha/lib/specs.js ../test/mocha/specs ./jsdoc_spec_README.md
