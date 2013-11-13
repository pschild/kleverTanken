node r.js -o build.js

xcopy "..\src\resources\css\app.css" "..\target\resources\css\" /Y
xcopy "..\src\resources\fonts" "..\target\resources\fonts" /E /Y
xcopy "..\src\resources\images" "..\target\resources\images" /E /Y

xcopy "..\src\scripts\lib\require_*min.js" "..\target\scripts\lib\" /Y

xcopy "..\src\data\php" "..\target\data\php\" /E /Y
del "..\target\data\php\connection.php"

xcopy "..\src\index.html" "..\target\" /Y