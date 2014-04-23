git fetch XTUPLE
git checkout XTUPLE/4_4_x
rm -rf scripts/output
npm run-script build-basic-postbooks-package-sql
npm run-script build-basic-empty
npm run-script build-basic-postbooks-demo
npm run-script build-basic-quickstart

../private-extensions
git fetch XTUPLE
git checkout XTUPLE/4_4_x
npm run-script build-basic-manufacturing-package-sql
npm run-script build-basic-distribution-package-sql
npm run-script build-basic-manufacturing-empty
npm run-script build-basic-manufacturing-quickstart
npm run-script build-basic-manufacturing-demo
npm run-script build-basic-distribution-empty
npm run-script build-basic-distribution-quickstart
npm run-script build-basic-distribution-demo
