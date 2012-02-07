@echo off
set /p ver=Input zTree's version (3.0 or 3.1) :
set file=core excheck exedit

cd ../WebContent/js/

copy /B all.txt jquery.ztree.all-%ver%.js
copy /B all.txt jquery.ztree.all-%ver%.min.js

for %%a in (%file%) do (
echo compiler file: %%a-%ver%.js to %%a-%ver%.min.js
copy /B %%a.txt+jquery.ztree.%%a.js jquery.ztree.%%a-%ver%.js
java -jar ../../compiler/compiler.jar --js jquery.ztree.%%a-%ver%.js --js_output_file jquery.ztree.%%a-%ver%.min.tmp.js
copy /B %%a.txt+jquery.ztree.%%a-%ver%.min.tmp.js jquery.ztree.%%a-%ver%.min.js

copy /B jquery.ztree.all-%ver%.js+jquery.ztree.%%a-%ver%.js+all.txt jquery.ztree.all-%ver%.js
copy /B jquery.ztree.all-%ver%.min.js+jquery.ztree.%%a-%ver%.min.js+all.txt jquery.ztree.all-%ver%.min.js
copy /B jquery.ztree.%%a-%ver%.min.js ..\..\..\zTreeWeb\web3.0_Design\js\jquery.ztree.%%a-%ver%.js
)

del *.tmp.js

cd ../../compiler/

echo Press Enter to end......
set /p start=