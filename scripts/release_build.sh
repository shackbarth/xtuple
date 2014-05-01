#git fetch XTUPLE
#git checkout XTUPLE/4_4_x

rm -rf scripts/output
npm run-script build-basic-postbooks-package-sql
npm run-script build-basic-empty
npm run-script build-basic-postbooks-demo
npm run-script build-basic-quickstart
cd ../private-extensions

#git fetch XTUPLE
#git checkout XTUPLE/4_4_x

npm run-script build-basic-manufacturing-package-sql
npm run-script build-basic-manufacturing-empty
npm run-script build-basic-manufacturing-quickstart
npm run-script build-basic-distribution-package-sql
npm run-script build-basic-distribution-empty
npm run-script build-basic-distribution-quickstart

cd ../xtuple
mkdir scripts/output/pb441
cp scripts/xml/postbooks_package.xml scripts/output/pb441/package.xml
cp scripts/output/toolkit.sql scripts/output/pb441
cp scripts/output/updates.sql scripts/output/pb441
cd scripts/output
tar -zcvf pb441.gz pb441/

cd ../../
mkdir scripts/output/dist441
cp scripts/xml/distribution_package.xml scripts/output/dist441/package.xml
cp scripts/output/updates.sql scripts/output/dist441
cp scripts/output/inventory_upgrade.sql scripts/output/dist441
cd scripts/output
tar -zcvf dist441.gz dist441/

cd ../../
mkdir scripts/output/pbtodist441
cp scripts/xml/distribution_install.xml scripts/output/pbtodist441/package.xml
cp scripts/output/inventory_basic_install.sql scripts/output/pbtodist441
cp scripts/output/inventory_upgrade.sql scripts/output/pbtodist441
cd scripts/output
tar -zcvf 441pbtodist.gz pbtodist441/

cd ../../
mkdir scripts/output/xtmfg441
cp scripts/xml/xtmfg_package.xml scripts/output/xtmfg441/package.xml
#cp scripts/output/updates.sql scripts/output/xtmfg441
#cp scripts/output/inventory_upgrade.sql scripts/output/xtmfg441
cp scripts/output/manufacturing_upgrade.sql scripts/output/xtmfg441
cd scripts/output
tar -zcvf xtmfg_upgrade-441.gz xtmfg441/

cd ../../
mkdir scripts/output/xtmfg_install441
cp scripts/xml/xtmfg_install.xml scripts/output/xtmfg_install441/package.xml
cp scripts/output/manufacturing_basic_install.sql scripts/output/xtmfg_install441
cp scripts/output/manufacturing_upgrade.sql scripts/output/xtmfg_install441
cd scripts/output
tar -zcvf xtmfg_install-441.gz xtmfg_install441/
