#!/bin/bash

dropdb -h localhost dev7
createdb -U admin -h localhost -T template1 dev7
pg_restore -U admin -h localhost -d dev7 ~/Devel/tools/xtuple/masterref-4.0.0.backup 


