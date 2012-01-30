#!/usr/bin/python
# @author W. Cole Davis

# FOR 2.6 (default in Mac OS 10.6)
# REQUIRES CURL WITH SHELL ACCESS

from optparse import OptionParser
from subprocess import check_call

parser = OptionParser()
parser.add_option("-t", "--type", dest="type", help="HTTP request type [ REQUIRED ]")
parser.add_option("-f", "--file", dest="filename", help="filename to use as content for request [ REQUIRED IF POST ]")
parser.add_option("-p", "--port", dest="port", help="port of the locally running node.js instance [ REQUIRED ]")
parser.add_option("-u", "--url", dest="url", help="URL to be attached to the request [ REQUIRED ]")

(options, args) = parser.parse_args()

filename=options.filename
httptype=options.type
port=options.port
url=options.url or "/"

if httptype == None or port == None:
  parser.print_help()
  exit(-1)

if httptype == "POST" and file == None:
  parser.print_help()
  exit(-1)

if file == None:
  execCmd="curl -X %s http://localhost:%s%s" % (httptype, port, url)
else:
  execCmd="curl -X %s -d @%s -H \"Content-Type: application/json\" http://localhost:%s%s" % (httptype, filename, port, url)

print "Executing: %s" % (execCmd)

check_call(execCmd, shell=True)

print ""
