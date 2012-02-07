@echo off
set /p ver=Input zTree's version (3.0 or 3.1) :

set p=publish

cd ../

rmdir /s/q %p%
mkdir %p%

xcopy WebContent\css publish\css\ /S /E
xcopy WebContent\demo publish\demo\ /S /E

cd publish
mkdir js
cd ../

xcopy WebContent\js\jquery-1.4.4.min publish\js\
xcopy WebContent\js\*%ver%.js publish\js\
xcopy WebContent\js\*%ver%.min.js publish\js\
xcopy WebContent\doc\*3.x.txt publish\
xcopy ..\zTreeWeb\web3.0_Design\api publish\api\ /S /E

cd compiler

echo Press Enter to end......
set /p start=