@echo off
setlocal EnableDelayedExpansion
echo Welcome to start helper!
echo Set up env config for start

set "ENV_FILE=.env"
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


:: Create .env if missing
if not exist "%ENV_FILE%" (
    echo %ENV_FILE% not found. Creating it...
    type nul > "%ENV_FILE%"
)

call :RandStr "RAND1"
call :RandStr "RAND2"

:: Call subroutines to collect env values
call :EnsureEnv "GOOGLE_CLIENT_ID"
call :EnsureEnv "FRONTEND_URL"
call :EnsureEnvDefault "COOKIE_DOMAIN" "localhost"
call :EnsureEnvDefault "JWT_SECRET_ACCESS" %RAND1%
call :EnsureEnvDefault "JWT_SECRET_REFRESH" %RAND2%
call :EnsureEnvDefault "SESSION_EXP_TIME" "25920000"
call :EnsureEnvDefault "JWT_ACCESS_EXP" "3h"
call :EnsureEnvDefault "JWT_REFRESH_EXP" "3d"

:: Ensure .env is in .gitignore
if not exist ".gitignore" (
    echo .env > ".gitignore"
) else (
    findstr /x ".env" ".gitignore" >nul || echo .env>>".gitignore"
)

echo Start configuration:

:: Show .env so the user can verify
echo.
echo === .env contents ===
type "%ENV_FILE%"
echo =====================

pause

:: Start Docker
echo.
echo Starting Docker Compose...
docker compose up --no-attach mongo --build

pause
exit /b

:: ----------------------------------------
:EnsureEnv
:: Prompt until user gives a non-empty value
:: %1 = VAR_NAME
set VAR_NAME=%~1
set VALUE=

findstr /b /c:"%VAR_NAME%=" "%ENV_FILE%" >nul
if errorlevel 1 (
    :askLoop
    set /p VALUE=Enter value for %VAR_NAME%: 
    if "!VALUE!"=="" (
        echo Value cannot be empty — please try again.
        goto askLoop
    )
    echo %VAR_NAME%=!VALUE!>>"%ENV_FILE%"
    echo Added %VAR_NAME% to %ENV_FILE%.
)
goto :EOF

:EnsureEnvDefault
:: Prompt with optional default
:: %1 = VAR_NAME
:: %2 = default fallback

set VAR_NAME=%~1
set DEFAULT_VAL=%~2
set VALUE=

findstr /b /c:"%VAR_NAME%=" "%ENV_FILE%" >nul
if errorlevel 1 (
    set /p VALUE="Enter value for %VAR_NAME% (Leave empty for default [%DEFAULT_VAL%]): "
    if "!VALUE!"=="" (
        echo %VAR_NAME%=%DEFAULT_VAL%>>"%ENV_FILE%"
    ) else (
        echo %VAR_NAME%=!VALUE!>>"%ENV_FILE%"
    )
    echo Added %VAR_NAME% to %ENV_FILE%.
)
goto :EOF

:RandStr

set VAR_NAME=%~1

set "string=abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
set "result="
for /L %%i in (1,1,30) do call :add
call set "%VAR_NAME%=%result%"
goto :EOF

:add
set /a x=%random% %% 62 
set result=%result%!string:~%x%,1!
goto :EOF