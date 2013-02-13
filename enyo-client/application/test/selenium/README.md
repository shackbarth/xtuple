Aurora_Sel
==========
This repository contains the Selenium scripts written for Aurora mobile web client using 'wd for node.js'
package - https://github.com/admc/wd. 
Node.js and wd package should be installed in your system to execute the automation scripts.
Run a selenium standalone server instance 
(download it from http://code.google.com/p/selenium/downloads/detail?name=selenium-server-standalone-2.28.0.jar&can=2&q=)
in a command terminal and continue executing the scripts from
another terminal by running the file seleniumtest.js in the following format.

$ node seleniumtest <browsername> <OS name> <browser version>

ex: node seleniumtest safari "Mac 10.6" 5

Note: Please rename the 'loginDataSample.js' file in the lib folder to 'loginData.js' and add the login credentials for xTuple and Saucelabs accounts




