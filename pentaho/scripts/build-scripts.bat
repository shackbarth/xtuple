echo ON
call groovyc -cp C:\pentaho\reportDesigner\lib\* com\xTuple\TableModelReflect.groovy
call groovyc -cp C:\pentaho\reportDesigner\lib\* com\xTuple\PropertyBundle.groovy
echo ran compile
call jar -cf xTupleScripts.jar com\xTuple\*.class
echo ran jar