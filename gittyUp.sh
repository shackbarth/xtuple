#!/bin/bash
# Update all git repos from xtuple branch
echo "******Updating xtuple******"
git checkout xtuple
git pull
git checkout master
git merge xtuple
git submodule update --recursive
cd enyo-client/application/tools
sudo ./deploy.sh
cd ../../..