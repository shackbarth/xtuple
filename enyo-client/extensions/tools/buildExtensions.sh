#!/bin/bash
# Build extensions
# Note that the expectation is that this be run from the extensions directory,
# i.e. enyo-client/extensions, not enyo-client/extensions/tools

rm -rf builds
mkdir builds

node ./tools/nodeBuildExtensions.js
