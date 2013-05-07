#!/usr/bin/env python

import argparse
import subprocess
import os
import sys
import time

print "All output is saved in a file called output.txt in the current directory"

parser = argparse.ArgumentParser(
  description="Creates a database (drops too) restores it and initializes it",
  prog='ResetDB',
  epilog="All output from commands are saved to a file called 'output.txt' in the current directory"
)
parser.add_argument('--database', '-d', type=str, help="the name of the database", dest='d', default='380postbooks')
parser.add_argument('--host', '-H', type=str, help="the hostname of the database server", dest='H', default='localhost')
parser.add_argument('--backup', '-b', type=str, help="the path to the database backup to restore", dest='b', default='./postbooks_demo.backup')
parser.add_argument('--user', '-u', type=str, help="specify if owner user is different than admin", dest='u', default='admin')

args = parser.parse_args()
  
# save output from subprocesses
out = open('output.txt', 'w')

try:
  print "Dropping database", args.H, args.d, "if it exists"
  subprocess.call(['dropdb', '-U', args.u, '-h', args.H, args.d], stdout=out, stderr=out)
  print "Creating database", args.d
  subprocess.call(['createdb', '-U', args.u, '-h', args.H, '-T', 'template1', args.d], stdout=out, stderr=out)
  print "Restoring from backup file", args.b
  subprocess.call(['pg_restore', '-U', args.u, '-h', args.H, '-d', args.d, args.b], stdout=out, stderr=out)
  print "Running init script 'source/init_instance.sql'"
  subprocess.call(['psql', '-U', args.u, '-h', args.H, '-d', args.d, '-f', 'init_instance.sql'], cwd='source', stdout=out, stderr=out)
finally:
  out.close()

print "Complete. Make sure to review 'output.txt' for debugging."
