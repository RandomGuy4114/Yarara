import { useRef, useState } from "react";
import { loadPyodide } from "pyodide";
import interpreterSource from "../../../src/Interpreter.py?raw";

// Everything up to the CLI entry point: just the tokenizer, parser and
// Interpreter class definitions, with no top-level side effects. The
// playground drives these directly instead of going through sys.argv.
const INTERPRETER_MODULE_SOURCE = interpreterSource.split(
  'if __name__ == "__main__":'
)[0];

// The real interpreter build is served from /public/pyodide (a copy of the
// exact runtime bundled in node_modules/pyodide) so the version always
// matches what loadPyodide() expects — no CDN version-skew risk.
const PYODIDE_INDEX_URL = "/pyodide/";

const RUN_DRIVER = `
import io, contextlib

_buf = io.StringIO()
try:
    with contextlib.redirect_stdout(_buf):
        _tokens = tokenize(yarara_source)
        _parser = Parser(_tokens)
        _ast_statements = _parser.parse()
        _interpreter = Interpreter()
        for _stmt in _ast_statements:
            _interpreter.evaluate(_stmt)
except Exception as _e:
    _buf.write(f"Error: {_e}")
_buf.getvalue()
`;

// Example snippets loaded by the buttons above the editor.
const EXAMPLES = {
  "Hello World": `he'i "Hello, World!"`,
  Fibonacci: `japo fibo_loop(n) {
    a = 0
    b = 1
    i = 0
    aja i < n {
        he'i a
        temp = a + b
        a = b
        b = temp
        i = i + 1
    }
}

fibo_loop(10)`,
  Conditionals: `edad = 20

ramo edad >= 18 {
    he'i "adulto"
} ambue {
    he'i "menor"
}`,
};

function Playground({ compact = false }) {
  const [code, setCode] = useState(EXAMPLES["Hello World"]);
  const [output, setOutput] = useState("");
  // idle -> loading -> ready (or error). Pyodide (a ~13MB Wasm runtime) is
  // only loaded once the user actually asks to run something — loading it
  // eagerly on mount competes with the hero's entrance animation for the
  // main thread and stalls it.
  const [status, setStatus] = useState("idle");
  const pyodideRef = useRef(null);

  const ensurePyodide = async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setStatus("loading");
    const pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });
    // Interpreter.py resolves ROOT_DIR from __file__ at import time; give
    // it a harmless stand-in path since there's no real filesystem here.
    pyodide.globals.set("__file__", "/home/pyodide/Interpreter.py");
    pyodide.runPython(INTERPRETER_MODULE_SOURCE);
    pyodideRef.current = pyodide;
    return pyodide;
  };

  const handleRun = async () => {
    if (status === "loading" || status === "running") return;

    try {
      const pyodide = await ensurePyodide();
      setStatus("running");
      pyodide.globals.set("yarara_source", code);
      const result = await pyodide.runPythonAsync(RUN_DRIVER);
      setOutput(result || "// (program produced no output)");
      setStatus("ready");
    } catch (err) {
      console.error("Yarara playground run failed:", err);
      setOutput(`Error: ${err.message}`);
      setStatus("ready");
    }
  };

  const busy = status === "loading" || status === "running";
  const runLabel =
    status === "loading" ? "Loading..." : status === "running" ? "Running..." : "▶ Run";
  const placeholder =
    status === "loading"
      ? "// Loading the Python interpreter (Pyodide)..."
      : "// Output will appear here";

  return (
    <div className={`Playground${compact ? " Playground-compact" : ""}`}>
      {!compact && (
        <>
          <h1>Try Yarara</h1>
          <p>
            Write a bit of Yarara below and hit Run to see it in action,
            right here in your browser.
          </p>
        </>
      )}

      <div className="playground-examples">
        {Object.keys(EXAMPLES).map((name) => (
          <button
            key={name}
            className="border-btn playground-example-btn"
            onClick={() => setCode(EXAMPLES[name])}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="playground-container">
        <div className="playground-pane playground-pane-input">
          <div className="playground-pane-header">
            <span>input.ya</span>
            <button
              className="playground-run-btn"
              onClick={handleRun}
              disabled={busy}
            >
              {runLabel}
            </button>
          </div>
          <textarea
            className="playground-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder={`he'i "Hello, World!"`}
          />
        </div>

        <div className="playground-pane playground-pane-output">
          <div className="playground-pane-header">
            <span>output</span>
          </div>
          <pre className="playground-output">{output || placeholder}</pre>
        </div>
      </div>
    </div>
  );
}

export default Playground;
