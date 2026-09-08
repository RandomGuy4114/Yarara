#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <tcl.h>
#include <tk.h>

#if defined(_WIN32)
  #define EXPORT __declspec(dllexport)
#else
  #define EXPORT __attribute__((visibility("default")))
#endif

EXPORT int run_tk_app(const char* title, int width, int height, const char* widgets) {
    // Dummy arguments for Tcl initialization
    char *argv[] = { "yarara_app", NULL };
    int argc = 1;

    Tcl_FindExecutable(argv[0]);

    Tcl_Interp *interp = Tcl_CreateInterp();
    if (interp == NULL) {
        fprintf(stderr, "Failed to create Tcl interpreter.\n");
        return 1;
    }

    if (Tcl_Init(interp) == TCL_ERROR) {
        fprintf(stderr, "Tcl_Init error: %s\n", Tcl_GetStringResult(interp));
        Tcl_DeleteInterp(interp);
        return 1;
    }

    if (Tk_Init(interp) == TCL_ERROR) {
        fprintf(stderr, "Tk_Init error: %s\n", Tcl_GetStringResult(interp));
        Tcl_DeleteInterp(interp);
        return 1;
    }

    // widgets is a caller-built Tcl script (see stdlib/core/tk.ya) that
    // creates and packs whatever widgets the Yarara program asked for —
    // the window's contents aren't hardcoded here anymore. Sized
    // dynamically since a customized window's widget script can be
    // arbitrarily long.
    const char *header_fmt = "wm title . \"%s\"\nwm geometry . %dx%d\n";
    size_t script_len = strlen(header_fmt) + strlen(title) + strlen(widgets) + 64;
    char *script = malloc(script_len);
    if (script == NULL) {
        fprintf(stderr, "run_tk_app: out of memory building the window script.\n");
        Tcl_DeleteInterp(interp);
        return 1;
    }
    snprintf(script, script_len, header_fmt, title, width, height);
    strncat(script, widgets, script_len - strlen(script) - 1);

    int eval_result = Tcl_Eval(interp, script);
    free(script);
    if (eval_result == TCL_ERROR) {
        fprintf(stderr, "Tcl_Eval error: %s\n", Tcl_GetStringResult(interp));
        Tcl_DeleteInterp(interp);
        return 1;
    }

    // A bare command-line-launched Tk app creates its window, but nothing
    // brings it to the foreground/gives it focus on its own — without
    // this it can end up hidden behind other windows.
    Tcl_Eval(interp, "wm deiconify .");
    Tcl_Eval(interp, "raise .");
    Tcl_Eval(interp, "wm attributes . -topmost 1");
    Tcl_Eval(interp, "after 200 {wm attributes . -topmost 0}");
    Tcl_Eval(interp, "focus -force .");

    // Tk_MainLoop blocks the calling thread until the window closes
    Tk_MainLoop();

    Tcl_DeleteInterp(interp);
    return 0;
}