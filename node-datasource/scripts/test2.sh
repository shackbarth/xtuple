#!/bin/sh

#http://stackoverflow.com/questions/192249/how-do-i-parse-command-line-arguments-in-bash

# A POSIX variable
OPTIND=1         # Reset in case getopts has been used previously in the shell.

# Initialize our own variables:
output_file=""
verbose=0

while getopts "h?vf:" opt; do
    case "$opt" in
    h|\?)
        show_help
        exit 0
        ;;
    v)  verbose=1
        ;;
    f)  output_file=$OPTARG
        ;;
    esac
done

shift $((OPTIND-1))

[ "$1" = "--" ] && shift

echo "verbose=$verbose, output_file='$output_file', Leftovers: $@"

# End of file
