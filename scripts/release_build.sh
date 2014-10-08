#!/usr/bin/env bash
MAJ=$1
MIN=$2
PAT=$3

# Usage: ./scripts/release_build.sh 4 5 0-beta
echo "BUILDING RELEASE "$MAJ"."$MIN"."$PAT""

#git fetch XTUPLE
#git checkout XTUPLE/$MAJ"_"$MIN"_"x

rm -rf scripts/output
npm run-script build-basic-postbooks-package-sql
npm run-script build-basic-empty
npm run-script build-basic-postbooks-demo
npm run-script build-basic-quickstart
cd ../private-extensions

#git fetch XTUPLE
#git checkout XTUPLE/$MAJ"_"$MIN"_"x

npm run-script build-basic-manufacturing-package-sql
npm run-script build-basic-manufacturing-empty
npm run-script build-basic-manufacturing-quickstart
npm run-script build-basic-manufacturing-demo
npm run-script build-basic-distribution-package-sql
npm run-script build-basic-distribution-empty
npm run-script build-basic-distribution-quickstart

#postbooks upgrade
cd ../xtuple
mkdir scripts/output/postbooks-upgrade-$MAJ$MIN$PAT
cp scripts/xml/postbooks_package.xml scripts/output/postbooks-upgrade-$MAJ$MIN$PAT/package.xml
cp scripts/output/postbooks_upgrade.sql scripts/output/postbooks-upgrade-$MAJ$MIN$PAT
cd scripts/output
tar -zcvf postbooks-upgrade-$MAJ$MIN$PAT.gz postbooks-upgrade-$MAJ$MIN$PAT/

#distribution upgrade
cd ../../
mkdir scripts/output/distribution-upgrade-$MAJ$MIN$PAT
cp scripts/xml/distribution_package.xml scripts/output/distribution-upgrade-$MAJ$MIN$PAT/package.xml
cp scripts/output/postbooks_upgrade.sql scripts/output/distribution-upgrade-$MAJ$MIN$PAT
cp scripts/output/inventory_upgrade.sql scripts/output/distribution-upgrade-$MAJ$MIN$PAT
cp scripts/output/distribution_upgrade.sql scripts/output/distribution-upgrade-$MAJ$MIN$PAT
cd scripts/output
tar -zcvf distribution-upgrade-$MAJ$MIN$PAT.gz distribution-upgrade-$MAJ$MIN$PAT/

#distribution install
cd ../../
mkdir scripts/output/distribution-install-$MAJ$MIN$PAT
cp scripts/xml/distribution_install.xml scripts/output/distribution-install-$MAJ$MIN$PAT/package.xml
cp scripts/output/postbooks_upgrade.sql scripts/output/distribution-install-$MAJ$MIN$PAT
cp scripts/output/inventory_basic_install.sql scripts/output/distribution-install-$MAJ$MIN$PAT
cp scripts/output/inventory_upgrade.sql scripts/output/distribution-install-$MAJ$MIN$PAT
cp scripts/output/distribution_basic_install.sql scripts/output/distribution-install-$MAJ$MIN$PAT
cp scripts/output/distribution_upgrade.sql scripts/output/distribution-install-$MAJ$MIN$PAT
cd scripts/output
tar -zcvf distribution-install-$MAJ$MIN$PAT.gz distribution-install-$MAJ$MIN$PAT/

#manufacturing upgrade
cd ../../
mkdir scripts/output/manufacturing-upgrade-$MAJ$MIN$PAT
cp scripts/xml/xtmfg_package.xml scripts/output/manufacturing-upgrade-$MAJ$MIN$PAT/package.xml
cp scripts/output/postbooks_upgrade.sql scripts/output/manufacturing-upgrade-$MAJ$MIN$PAT
cp scripts/output/inventory_upgrade.sql scripts/output/manufacturing-upgrade-$MAJ$MIN$PAT
cp scripts/output/manufacturing_upgrade.sql scripts/output/manufacturing-upgrade-$MAJ$MIN$PAT
cd scripts/output
tar -zcvf manufacturing-upgrade-$MAJ$MIN$PAT.gz manufacturing-upgrade-$MAJ$MIN$PAT/

#manufacturing install
cd ../../
mkdir scripts/output/manufacturing-install-$MAJ$MIN$PAT
cp scripts/xml/xtmfg_install.xml scripts/output/manufacturing-install-$MAJ$MIN$PAT/package.xml
cp scripts/output/postbooks_upgrade.sql scripts/output/manufacturing-install-$MAJ$MIN$PAT
cp scripts/output/inventory_basic_install.sql scripts/output/manufacturing-install-$MAJ$MIN$PAT
cp scripts/output/inventory_upgrade.sql scripts/output/manufacturing-install-$MAJ$MIN$PAT
cp scripts/output/manufacturing_basic_install.sql scripts/output/manufacturing-install-$MAJ$MIN$PAT
cp scripts/output/manufacturing_upgrade.sql scripts/output/manufacturing-install-$MAJ$MIN$PAT
cd scripts/output
tar -zcvf manufacturing-install-$MAJ$MIN$PAT.gz manufacturing-install-$MAJ$MIN$PAT/

#enterprise upgrade
cd ../../
mkdir scripts/output/enterprise-upgrade-$MAJ$MIN$PAT
cp scripts/xml/ent_package.xml scripts/output/enterprise-upgrade-$MAJ$MIN$PAT/package.xml
cp scripts/output/postbooks_upgrade.sql scripts/output/enterprise-upgrade-$MAJ$MIN$PAT
cp scripts/output/inventory_upgrade.sql scripts/output/enterprise-upgrade-$MAJ$MIN$PAT
cp scripts/output/distribution_upgrade.sql scripts/output/enterprise-upgrade-$MAJ$MIN$PAT
cp scripts/output/manufacturing_upgrade.sql scripts/output/enterprise-upgrade-$MAJ$MIN$PAT
cd scripts/output
tar -zcvf enterprise-upgrade-$MAJ$MIN$PAT.gz enterprise-upgrade-$MAJ$MIN$PAT/

#enterprise install
cd ../../
mkdir scripts/output/enterprise-install-$MAJ$MIN$PAT
cp scripts/xml/ent_install.xml scripts/output/enterprise-install-$MAJ$MIN$PAT/package.xml
cp scripts/output/postbooks_upgrade.sql scripts/output/enterprise-install-$MAJ$MIN$PAT
cp scripts/output/inventory_basic_install.sql scripts/output/enterprise-install-$MAJ$MIN$PAT
cp scripts/output/inventory_upgrade.sql scripts/output/enterprise-install-$MAJ$MIN$PAT
cp scripts/output/distribution_basic_install.sql scripts/output/enterprise-install-$MAJ$MIN$PAT
cp scripts/output/distribution_upgrade.sql scripts/output/enterprise-install-$MAJ$MIN$PAT
cp scripts/output/manufacturing_basic_install.sql scripts/output/enterprise-install-$MAJ$MIN$PAT
cp scripts/output/manufacturing_upgrade.sql scripts/output/enterprise-install-$MAJ$MIN$PAT
cd scripts/output
tar -zcvf enterprise-install-$MAJ$MIN$PAT.gz enterprise-install-$MAJ$MIN$PAT/

ADMIN=admin
PORT=5432
HOST=localhost

DB_LIST="postbooks_demo empty quickstart distempty distquickstart mfgempty mfgquickstart mfgdemo";
for DB in $DB_LIST ; do
  /usr/bin/pg_dump --host $HOST --username $ADMIN --port $PORT --format c --file $DB-$MAJ.$MIN.$PAT.backup $DB
done

#cleanup
cd ../..
rm -rf scripts/output/postbooks-upgrade-$MAJ$MIN$PAT/
rm -rf scripts/output/postbooks_upgrade.sql
rm -rf scripts/output/distribution-install-$MAJ$MIN$PAT/
rm -rf scripts/output/distribution-upgrade-$MAJ$MIN$PAT/
rm -rf scripts/output/distribution_upgrade.sql
rm -rf scripts/output/distribution_basic_install.sql
rm -rf scripts/output/inventory_basic_install.sql
rm -rf scripts/output/inventory_upgrade.sql
rm -rf scripts/output/manufacturing-install-$MAJ$MIN$PAT/
rm -rf scripts/output/manufacturing-upgrade-$MAJ$MIN$PAT/
rm -rf scripts/output/enterprise-upgrade-$MAJ$MIN$PAT/
rm -rf scripts/output/enterprise-install-$MAJ$MIN$PAT/
rm -rf scripts/output/manufacturing_basic_install.sql
rm -rf scripts/output/manufacturing_upgrade.sql
