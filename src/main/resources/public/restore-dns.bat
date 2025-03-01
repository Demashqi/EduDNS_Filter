@echo off
setlocal enabledelayedexpansion

echo Restoring default DNS values (setting to DHCP) for active network interfaces...

:: Enumerate active network interfaces (skip header lines)
for /f "skip=3 tokens=1,2,3,4,*" %%A in ('netsh interface ipv4 show interfaces') do (
    if "%%D"=="connected" (
         set "INTERFACE_NAME=%%E"
         echo Restoring DNS for interface: "!INTERFACE_NAME!"
         netsh interface ipv4 set dnsserver name="!INTERFACE_NAME!" source=dhcp
    )
)

echo Default DNS values restored.
pause
