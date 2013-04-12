@echo off
del editor.min.js
java -jar ../../../../compiler/compiler.jar --js editor.js --js_output_file editor.min.js


echo Press Enter to end......
set /p start=