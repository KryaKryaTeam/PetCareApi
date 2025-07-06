@echo off
echo Welcome to start helper!
echo Set up env config for start

:: Prompt if it's a dev start
:isDEV
set /p is_dev=Is dev start? (Y/N): 

if /i "%is_dev%"=="Y" (
    set DEV_MODE=true
) else if /i "%is_dev%"=="N" (
    set DEV_MODE=false
) else (
    echo Invalid answer. Please enter Y or N.
    goto isDEV
)

set SWAGGER_HOST=localhost:3000
set SWAGGER_SCHEMA="http"

:: Start docker with current environment variables
echo.
echo Starting Docker Compose...
docker compose up --no-attach mongo --build 

pause