#!/bin/sh

echo "--------------------------------------------------------"
echo "                  YARARA UNINSTALLER                    "
echo "--------------------------------------------------------"
echo "It's sad to see you go! This script will help you remove"
echo "Yarara from your system. The uninstallation will start in"
echo "          5 seconds. Press Ctrl+C to cancel."
echo "--------------------------------------------------------"
sleep 5
echo "STEP 1.1: Checking if Yarara is installed..."
if command -v yarara >/dev/null 2>&1; then
    echo "Yarara is installed. Proceeding with uninstallation..."
else
    echo "Yarara is not installed. Nothing to uninstall."
    exit 0
fi

echo "STEP 1.2: Uninstalling Yarara..."
# The installer falls back to ~/.local/bin/yarara when /usr/local/bin
# isn't writable, so both locations need checking here.
rm -f /usr/local/bin/yarara
rm -f "$HOME/.local/bin/yarara"
rm -rf "$HOME/Yarara-install"
echo "Yarara has been successfully uninstalled."