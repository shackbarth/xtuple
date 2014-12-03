```
$ cd xtuple-accounting
$ grunt browserify
$ npm link

$ cd xtuple
$ npm link ../xtuple-accounting
$ ./scripts/build_app.js -d demo_dev -e node_modules/xtuple-accounting -n
```
- Go to `https://host:8443`
- Login to the application
- Then goto `https://host:8443/accounting`
