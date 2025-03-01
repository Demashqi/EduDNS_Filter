@echo off
setlocal enabledelayedexpansion

:: Flush DNS cache
echo Flushing DNS cache...
ipconfig /flushdns
if %errorlevel% equ 0 (
    echo DNS cache flushed successfully.
) else (
    echo Failed to flush DNS cache. Continuing anyway...
)

:: Detect private IPv4 address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP_ADDRESS=%%a
    set IP_ADDRESS=!IP_ADDRESS: =!
    goto :IP_FOUND
)

:IP_FOUND
if "%IP_ADDRESS%"=="" (
    echo Error: Could not detect private IPv4 address.
    pause
    exit /b 1
)

echo Detected private IPv4 address: %IP_ADDRESS%

:: Detect active network interfaces and configure DNS
echo Detecting active network interfaces...
for /f "skip=3 tokens=1,2,3,4,*" %%A in ('netsh interface ipv4 show interfaces') do (
    if "%%D"=="connected" (
         set "INTERFACE_NAME=%%E"
         echo Configuring DNS for interface: "!INTERFACE_NAME!"
         netsh interface ipv4 add dnsserver name="!INTERFACE_NAME!" address=%IP_ADDRESS% index=1
    )
)

echo DNS successfully configured to use %IP_ADDRESS%!
echo You may need to restart your network connection for changes to take effect.
pause
