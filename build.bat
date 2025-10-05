@echo off
echo Building Next.js application...
set NODE_OPTIONS=--max-old-space-size=4096
set NODE_ENV=production
npx next build
if %ERRORLEVEL% EQU 0 (
    echo Build completed successfully!
) else (
    echo Build failed with error code %ERRORLEVEL%
)
pause
