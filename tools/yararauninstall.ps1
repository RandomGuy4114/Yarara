<#
.SYNOPSIS
    Uninstalls Yarara from Windows.
.EXAMPLE
    irm https://raw.githubusercontent.com/RandomGuy4114/Yarara/main/tools/yararauninstall.ps1 | iex
#>

$ErrorActionPreference = "Stop"

function Command-Exists($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

Write-Host "--------------------------------------------------------"
Write-Host "                  YARARA UNINSTALLER                    "
Write-Host "--------------------------------------------------------"
Write-Host "It's sad to see you go! This script will help you remove"
Write-Host "Yarara from your system. The uninstallation will start in"
Write-Host "          5 seconds. Press Ctrl+C to cancel."
Write-Host "--------------------------------------------------------"
Start-Sleep -Seconds 5

Write-Host "STEP 1.1: Checking if Yarara is installed..."
$binDir = Join-Path $HOME "AppData\Local\Yarara\bin"
$wrapperPath = Join-Path $binDir "yarara.cmd"
if (-not (Command-Exists "yarara") -and -not (Test-Path $wrapperPath)) {
    Write-Host "Yarara is not installed. Nothing to uninstall."
    exit 0
}
Write-Host "Yarara is installed. Proceeding with uninstallation..."

Write-Host "STEP 1.2: Uninstalling Yarara..."
Remove-Item -Force -ErrorAction SilentlyContinue $wrapperPath
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue (Join-Path $HOME "Yarara-install")

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -like "*$binDir*") {
    $newPath = ($userPath -split ';' | Where-Object { $_ -ne $binDir -and $_ -ne "" }) -join ';'
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}

Write-Host "Yarara has been successfully uninstalled."
