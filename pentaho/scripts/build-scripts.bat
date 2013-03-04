echo ON
call groovyc -cp C:\pentaho\reportDesigner\lib\* TableModelReflect.groovy
echo ran compile
call jar -cf mobileReportScripts.jar *.class
echo ran jar