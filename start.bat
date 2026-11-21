@echo off
echo ========================================================
echo   Starting GlucoCare Diabetes Healthcare Application...
echo ========================================================
echo.

node -v >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Using system Node.js
    node server.js
) else (
    echo [INFO] Using embedded runtime...
    set ELECTRON_RUN_AS_NODE=1
    "C:\Users\My world\AppData\Local\Programs\antigravity\Antigravity.exe" server.js
)

pause
