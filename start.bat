@echo off
echo Welcome to start helper!
echo Set up env config for start

set "ENV_FILE=.env"
set "FIELD_NAME=GOOGLE_CLIENT_ID"
set "SWAGGER_HOST=localhost:3000"
set "SWAGGER_SCHEMA=http"

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

setlocal EnableDelayedExpansion

:: 1. Does the .env file already exist?
if not exist "%ENV_FILE%" (
    echo %ENV_FILE% not found. Creating it...
    type nul > "%ENV_FILE%"
)

:: 2. Check if FIELD=... is already present
findstr /b /c:"%FIELD_NAME%=" "%ENV_FILE%" >nul
if %errorlevel%==0 (
    goto run
)

:: 3. Prompt the user for a value
:ask
set /p "FIELD_VALUE=Enter value for %FIELD_NAME%: "
if "%FIELD_VALUE%"=="" (
    echo Value cannot be empty — please try again.
    goto ask
)

:: 4. Append the line to the .env file
echo %FIELD_NAME%=%FIELD_VALUE%>>"%ENV_FILE%"
echo Added %FIELD_NAME% to %ENV_FILE%.

if not exist ".gitignore" (
    echo .env > ".gitignore"
)

:run

:: Start docker with current environment variables
echo.
echo Starting Docker Compose...
docker compose up --no-attach mongo --build 

pause