echo ON
call groovyc -cp .\lib\* com\xTuple\TableModelReflect.groovy
call groovyc -cp .\lib\* com\xTuple\PropertyBundle.groovy
echo ran compile
call jar -cf xTupleScripts.jar com\xTuple\*.class
echo ran jar