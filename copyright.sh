#!/bin/bash
for FILE in `find * -type f -name \*.js | grep -v node_modules` ; do if grep -q Copyright $FILE ; then sed -i '' -e '/Copyright:/s/2011/2012/' -e '/Copyright:/s/$/.  This file is part of the/' -e '/Copyright:/a\
//            xTuple ERP: PostBooks Edition, a free and open source\
//            Enterprise Resource Planning software suite.\
//            It is licensed to you under the Common Public Attribution\
//            License version 1.0, the full text of which (including\
//            xTuple-specific Exhibits) is available at www.xtuple.com/CPAL.\
//            By using this software, you agree to be bound by its terms.\
' $FILE; fi ; done
