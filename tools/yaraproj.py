import os
import sys
from pathlib import Path

def main():
    if len(sys.argv) >= 2:
        if sys.argv[1] == "init":
            cwd = Path.cwd()
            print("Oñepyrũma Yarara Rembiapo pyahu ápe: " + str(cwd))
            projname = input(f"Eiporavo Tembiapo Réra ({cwd.name}) : ")
            if projname == "":
                projname = cwd.name
            projpath = cwd / projname
            if not projpath.exists():
                projpath.mkdir()
                (projpath / "package.json").write_text('{\n    "téra": "' + projname + '",\n    "je\'eháicha": "0.1.0"\n}')
                (projpath / "main.ya").write_text('# ¡Peju porãite yarara-pe!\n')
                print(f"Tembiapo {projname} oñembosako'íma ápe: {projpath}")
            else:
                print(f"Tembiapo {projname} oĩmahína ápe: {projpath}")
        else:
            print("Mba'eapoharã ojeikuaa'ỹva. Eipuru 'init' rejapo hag̃ua tembiapo pyahu.")
    else:
        print("Eipuru kócha: yaraproj.py init")


if __name__ == "__main__":
    main()


# UNFINISHED
# IGNORE PLEASE :_(