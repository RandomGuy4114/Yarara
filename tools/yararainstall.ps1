<#
.SYNOPSIS
    Installs Yarara on Windows.
.DESCRIPTION
    Clones the Yarara repo (or copies a local checkout with -Path), compiles the
    native library, and installs a 'yarara' command onto the current user's PATH.
    Needs Python 3, git, and a C compiler (gcc, e.g. from MinGW-w64/MSYS2).
.PARAMETER Path
    Install from a local checkout instead of cloning from GitHub.
.PARAMETER Debug_
    Reserved to mirror the -d flag of the POSIX installer (no effect yet).
.EXAMPLE
    irm https://raw.githubusercontent.com/RandomGuy4114/Yarara/main/tools/yararainstall.ps1 | iex
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File tools\yararainstall.ps1 -Path .
#>
param(
    [string]$Path,
    [switch]$Debug_
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) {
    Write-Host $msg
}

function Command-Exists($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

Write-Host "--------------------------------------------------------"
Write-Host "                  YARARA INSTALLER                      "
Write-Host "--------------------------------------------------------"
Write-Host " Welcome to the Yarara Installer! This script will help"
Write-Host "you install Yarara on your system. The installation will"
Write-Host "     start in 5 seconds. Press Ctrl+C to cancel."
Write-Host "--------------------------------------------------------"
Start-Sleep -Seconds 5

$fixedActive = $false
if ($PSBoundParameters.ContainsKey('Path')) {
    if ([string]::IsNullOrWhiteSpace($Path)) {
        Write-Host "No path provided. Please use the -Path option to specify a path."
        exit 1
    }
    if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
        Write-Host "The provided path '$Path' is not a valid directory."
        exit 1
    }
    $fixedActive = $true
    $resolvedPath = (Resolve-Path -LiteralPath $Path).Path

    Write-Host "Fixed path mode is active. Using provided path: $resolvedPath"
    Write-Step "STEP 0.1: Checking if Yarara is in the provided path..."
    if (Test-Path -LiteralPath (Join-Path $resolvedPath "src\Interpreter.py")) {
        Write-Host "Yarara found in the provided path. Proceeding with installation..."
    } else {
        Write-Host "Yarara is not found in the provided path. Please ensure that the path is correct and contains Yarara."
        exit 1
    }
}

Write-Step "STEP 1.1: Checking for Python 3..."
$python = $null
foreach ($candidate in @("python", "python3", "py")) {
    if (Command-Exists $candidate) {
        try {
            $verOutput = & $candidate --version 2>&1
            if ($verOutput -match "Python 3") {
                $python = $candidate
                break
            }
        } catch {}
    }
}
if ($null -eq $python) {
    Write-Host "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
}
Write-Host "Python 3 is installed ($python)."

Write-Step "STEP 1.2: Checking for git..."
if (-not $fixedActive) {
    if (-not (Command-Exists "git")) {
        Write-Host "git is not installed. Please install git and try again."
        exit 1
    }
    Write-Host "git is installed."
} else {
    Write-Host "Skipped (fixed path mode)."
}

Write-Step "STEP 1.3: Checking for C compiler..."
if (-not (Command-Exists "gcc")) {
    Write-Host "C compiler (gcc) is not installed. Please install a MinGW-w64/MSYS2 gcc and try again."
    exit 1
}
Write-Host "C compiler (gcc) is installed."

Write-Step "STEP 1.4: Checking if Yarara is already installed..."
$binDir = Join-Path $HOME "AppData\Local\Yarara\bin"
$wrapperPath = Join-Path $binDir "yarara.cmd"
if (Command-Exists "yarara") {
    $reply = Read-Host "Yarara is already installed, do you want to uninstall it? (y/n)"
    if ($reply -match '^[Yy]') {
        Write-Host "Uninstalling Yarara..."
        Remove-Item -Force -ErrorAction SilentlyContinue $wrapperPath
        Remove-Item -Recurse -Force -ErrorAction SilentlyContinue (Join-Path $HOME "Yarara-install")
        Write-Host "Yarara has been uninstalled."
    } else {
        Write-Host "Installation aborted."
        exit 0
    }
}

Write-Step "STEP 1.5: Checking if the installation directory exists..."
$installDir = Join-Path $HOME "Yarara-install"
if (Test-Path -LiteralPath $installDir) {
    Write-Host "Installation directory already exists. Removing it..."
    Remove-Item -Recurse -Force $installDir
}

Write-Step "STEP 1.6: Entering the installation directory..."
New-Item -ItemType Directory -Path $installDir | Out-Null
Set-Location $installDir

if ($fixedActive) {
    Write-Step "STEP 2.1: Copying Yarara from $resolvedPath..."
    Copy-Item -Recurse -Force $resolvedPath (Join-Path $installDir "Yarara")
} else {
    Write-Step "STEP 2.1: Cloning the Yarara repository..."
    git clone "https://github.com/RandomGuy4114/Yarara"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "git clone failed."
        exit 1
    }
}

Write-Host "Entering the Yarara directory..."
Set-Location (Join-Path $installDir "Yarara")

Write-Step "STEP 2.2: Remove Unnecessary Files..."
foreach ($item in @("Docs", "examples", "extensions", "website")) {
    if (Test-Path $item) {
        Remove-Item -Recurse -Force $item
        Write-Host "Removed $item"
    }
}
if (Test-Path "README.md") {
    Remove-Item -Force "README.md"
    Write-Host "Removed README.md"
}

Write-Step "STEP 2.3: Compiling C Code..."
New-Item -ItemType Directory -Force -Path "native\build" | Out-Null
& gcc -shared -O2 -o "native\build\os_native.dll" "native\os_native.c"
if ($LASTEXITCODE -ne 0 -or -not (Test-Path "native\build\os_native.dll")) {
    Write-Host "Failed to compile native\os_native.c. Please check that gcc works and try again."
    exit 1
}
Write-Host "Compiled native\build\os_native.dll"

Write-Step "STEP 3.1: Installing the 'yarara' command..."
$interpreterPath = Join-Path (Get-Location) "src\Interpreter.py"

New-Item -ItemType Directory -Force -Path $binDir | Out-Null

$wrapperContent = "@echo off`r`n$python `"$interpreterPath`" %*`r`n"
Set-Content -Path $wrapperPath -Value $wrapperContent -Encoding ASCII

if (Test-Path $wrapperPath) {
    Write-Host "Installed the 'yarara' command to $wrapperPath"
} else {
    Write-Host "Failed to install the 'yarara' command to $wrapperPath."
    exit 1
}

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$binDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$binDir", "User")
    $env:Path = "$env:Path;$binDir"
    Write-Host "--------------------------------------------------------"
    Write-Host " Installation complete! Added $binDir to your user PATH."
    Write-Host " Open a new terminal and try: yarara -v"
    Write-Host "--------------------------------------------------------"
} else {
    Write-Host "--------------------------------------------------------"
    Write-Host " Installation complete! Open a new terminal and try:"
    Write-Host " yarara -v"
    Write-Host "--------------------------------------------------------"
}
