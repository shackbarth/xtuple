#!/usr/bin/env bash
MAJ=$1
MIN=$2
PAT=$3

echo "BUILDING RELEASE "$MAJ"."$MIN"."$PAT""

git fetch XTUPLE
git checkout XTUPLE/$MAJ"_"$MIN"_"x

rm -rf scripts/output
npm run-script build-basic-postbooks-package-sql
npm run-script build-basic-empty
npm run-script build-basic-postbooks-demo
npm run-script build-basic-quickstart
cd ../private-extensions

git fetch XTUPLE
git checkout XTUPLE/$MAJ"_"$MIN"_"x

npm run-script build-basic-manufacturing-package-sql
npm run-script build-basic-manufacturing-empty
npm run-script build-basic-manufacturing-quickstart
npm run-script build-basic-manufacturing-demo
npm run-script build-basic-distribution-package-sql
npm run-script build-basic-distribution-empty
npm run-script build-basic-distribution-quickstart
#postbooks package
cd ../xtuple
mkdir scripts/output/pb$MAJ$MIN$PAT
cp scripts/xml/postbooks_package.xml scripts/output/pb$MAJ$MIN$PAT/package.xml
cp scripts/output/toolkit.sql scripts/output/pb$MAJ$MIN$PAT
cp scripts/output/updates.sql scripts/output/pb$MAJ$MIN$PAT
cd scripts/output
tar -zcvf pb$MAJ$MIN$PAT.gz pb$MAJ$MIN$PAT/
#distribution package
cd ../../
mkdir scripts/output/dist$MAJ$MIN$PAT
cp scripts/xml/distribution_package.xml scripts/output/dist$MAJ$MIN$PAT/package.xml
cp scripts/output/updates.sql scripts/output/dist$MAJ$MIN$PAT
cp scripts/output/inventory_upgrade.sql scripts/output/dist$MAJ$MIN$PAT
cd scripts/output
tar -zcvf dist$MAJ$MIN$PAT.gz dist$MAJ$MIN$PAT/
#postbooks to distribution
cd ../../
mkdir scripts/output/pbtodist$MAJ$MIN$PAT
cp scripts/xml/distribution_install.xml scripts/output/pbtodist$MAJ$MIN$PAT/package.xml
cp scripts/output/inventory_basic_install.sql scripts/output/pbtodist$MAJ$MIN$PAT
cp scripts/output/inventory_upgrade.sql scripts/output/pbtodist$MAJ$MIN$PAT
cd scripts/output
tar -zcvf pbtodist$MAJ$MIN$PAT.gz pbtodist$MAJ$MIN$PAT/
#xtmfg packages
cd ../../
mkdir scripts/output/xtmfg$MAJ$MIN$PAT
cp scripts/xml/xtmfg_package.xml scripts/output/xtmfg$MAJ$MIN$PAT/package.xml
#cp scripts/output/updates.sql scripts/output/xtmfg$MAJ$MIN$PAT
#cp scripts/output/inventory_upgrade.sql scripts/output/xtmfg$MAJ$MIN$PAT
cp scripts/output/manufacturing_upgrade.sql scripts/output/xtmfg$MAJ$MIN$PAT
cd scripts/output
tar -zcvf xtmfg_upgrade-$MAJ$MIN$PAT.gz xtmfg$MAJ$MIN$PAT/

cd ../../
mkdir scripts/output/xtmfg_install$MAJ$MIN$PAT
cp scripts/xml/xtmfg_install.xml scripts/output/xtmfg_install$MAJ$MIN$PAT/package.xml
cp scripts/output/manufacturing_basic_install.sql scripts/output/xtmfg_install$MAJ$MIN$PAT
cp scripts/output/manufacturing_upgrade.sql scripts/output/xtmfg_install$MAJ$MIN$PAT
cd scripts/output
tar -zcvf xtmfg_install-$MAJ$MIN$PAT.gz xtmfg_install$MAJ$MIN$PAT/

ADMIN=admin
PORT=5432
HOST=xtuple-vagrant

DB_LIST="postbooks_demo empty quickstart distempty distquickstart mfgempty mfgquickstart mfgdemo";
for DB in $DB_LIST ; do
  /usr/bin/pg_dump --host $HOST --username $ADMIN --port $PORT --format c --file $DB-$MAJ.$MIN.$PAT.backup $DB
done

#cleanup
cd ../..
rm -rf scripts/output/pb$MAJ$MIN$PAT/
rm -rf scripts/output/updates.sql
rm -rf scripts/output/toolkit.sql
rm -rf scripts/output/pbtodist$MAJ$MIN$PAT/
rm -rf scripts/output/dist$MAJ$MIN$PAT/
rm -rf scripts/output/distribution_upgrade.sql
rm -rf scripts/output/distribution_basic_install.sql
rm -rf scripts/output/inventory_basic_install.sql
rm -rf scripts/output/inventory_upgrade.sql
rm -rf scripts/output/xtmfg$MAJ$MIN$PAT/
rm -rf scripts/output/xtmfg_install$MAJ$MIN$PAT/
rm -rf scripts/output/manufacturing_basic_install.sql
rm -rf scripts/output/manufacturing_upgrade.sql
