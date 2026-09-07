#!/bin/sh

fixed_active=false

while getopts ":df:" opt; do
  case $opt in
    d)
      debug="-d"
      ;;
    f)
      path="$OPTARG"
      fixedpath="-f"
      fixed_active=true
      
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

if [ "$fixed_active" = true ]; then
    if [ -z "$path" ]; then
        echo "No path provided. Please use the -f option to specify a path."
        exit 1
    fi

    if [ ! -d "$path" ]; then
        echo "The provided path '$path' is not a valid directory."
        exit 1
    fi

    # Canonicalize to an absolute path now, before any 'cd' elsewhere in
    # this script makes a relative -f path resolve against the wrong
    # directory.
    path="$(cd "$path" && pwd)"

    echo "Fixed path mode is active. Using provided path: $path"
    echo "STEP 0.1: Checking if Yarara is in the provided path..."
    if [ -f "$path/src/Interpreter.py" ]; then
        echo "Yarara found in the provided path. Proceeding with installation..."
    else
        echo "Yarara is not found in the provided path. Please ensure that the path is correct and contains Yarara."
        exit 1
    fi
fi


echo "--------------------------------------------------------"
echo "                  YARARA INSTALLER                      "
echo "--------------------------------------------------------"
echo " Welcome to the Yarara Installer! This script will help"
echo "you install Yarara on your system. The installation will"
echo "     start in 5 seconds. Press Ctrl+C to cancel."
echo "--------------------------------------------------------"
sleep 5
echo "STEP 1.1: Checking for Python 3..."
if command -v python3 >/dev/null 2>&1; then
    echo "Python 3 is installed."
else
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

echo "STEP 1.2: Checking for git..."
if command -v git >/dev/null 2>&1; then
    echo "git is installed."
else
    echo "git is not installed. Please install git and try again."
    exit 1
fi

echo "STEP 1.3: Checking for C compiler..."
if command -v gcc >/dev/null 2>&1; then
    echo "C compiler (gcc) is installed."
else
    echo "C compiler (gcc) is not installed. Please install gcc and try again."
    exit 1
fi

echo "STEP 1.4: Checking if Yarara is already installed..."
if command -v yarara >/dev/null 2>&1; then
    printf "Yarara is already installed, do you want to uninstall it? (y/n) "
    read -r REPLY
    case "$REPLY" in
        [Yy]*)
            echo "Uninstalling Yarara..."
            rm -f /usr/local/bin/yarara
            rm -f "$HOME/.local/bin/yarara"
            rm -rf "$HOME/Yarara-install"
            echo "Yarara has been uninstalled."
            ;;
        *)
            echo "Installation aborted."
            exit 0
            ;;
    esac
fi

echo "STEP 1.5: Checking if the installation directory exists..."

if [ -d "$HOME/Yarara-install" ]; then
    echo "Installation directory already exists. Removing it..."
    rm -rf "$HOME/Yarara-install"
fi

echo "STEP 1.6: Entering the installation directory..."
mkdir -p "$HOME/Yarara-install"
cd "$HOME/Yarara-install" || exit 1

if [ "$fixed_active" = true ]; then
    # Copy rather than use $path directly, since the cleanup step below
    # deletes files (Docs, examples, README.md, ...) — running that
    # against the user's own -f directory would destroy their real files.
    echo "STEP 2.1: Copying Yarara from $path..."
    cp -r "$path" "Yarara"
else
    echo "STEP 2.1: Cloning the Yarara repository..."
    git clone "https://github.com/RandomGuy4114/Yarara"
fi

echo "Entering the Yarara directory..."
cd "Yarara" || exit 1

echo "STEP 2.2: Remove Unnecessary Files..."
rm -rf Docs && echo "Removed Docs"
rm -rf examples && echo "Removed examples"
rm -rf extensions && echo "Removed extensions" 
rm -rf website && echo "Removed website"
rm README.md && echo "Removed README.md"

echo "STEP 2.3: Compiling C Code..."

mkdir -p native/build
gcc -shared -fPIC -O2 -o native/build/libos_native.so native/os_native.c

if [ -f native/build/libos_native.so ]; then
    echo "Compiled native/build/libos_native.so"
else
    echo "Failed to compile native/os_native.c. Please check that gcc works and try again."
    exit 1
fi

echo "STEP 3.1: Installing the 'yarara' command..."

INTERPRETER_PATH="$(pwd)/src/Interpreter.py"


if [ -w /usr/local/bin ]; then
    BIN_DIR="/usr/local/bin"
else
    BIN_DIR="$HOME/.local/bin"
    mkdir -p "$BIN_DIR"
fi

WRAPPER_PATH="$BIN_DIR/yarara"

cat > "$WRAPPER_PATH" <<EOF
#!/bin/sh
exec python3 "$INTERPRETER_PATH" "\$@"
EOF
chmod +x "$WRAPPER_PATH"

if [ -x "$WRAPPER_PATH" ]; then
    echo "Installed the 'yarara' command to $WRAPPER_PATH"
else
    echo "Failed to install the 'yarara' command to $WRAPPER_PATH."
    exit 1
fi

case ":$PATH:" in
    *":$BIN_DIR:"*)
        echo "--------------------------------------------------------"
        echo " Installation complete! Open a new terminal (or run"
        echo " 'hash -r') and try: yarara -v"
        echo "--------------------------------------------------------"
        ;;
    *)
        echo "--------------------------------------------------------"
        echo " Installation complete! $BIN_DIR isn't on your PATH yet."
        echo " Add this to your shell's startup file (e.g. ~/.zshrc or"
        echo " ~/.bashrc), then open a new terminal:"
        echo ""
        echo "     export PATH=\"$BIN_DIR:\$PATH\""
        echo "--------------------------------------------------------"
        ;;
esac 