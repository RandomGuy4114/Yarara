import "../App.css";
import { motion, useScroll } from "motion/react";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import Playground from "../components/Playground";
import { useNavigate } from "react-router";
import { useState } from "react";

const KEYWORDS = [
  "ramo", "ambue", "aja", "he'i", "pytaguañemu", "mbo'ehakoty", "ha'e",
  "japo", "mbojevy", "pyahu", "che", "ha", "térã", "nahániri", "myengovia",
  "python",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};



// Classifies every character of a snippet (comment / string / keyword /
// number / plain) so the typed-out background code can be syntax
// highlighted instead of a flat wall of grey text.
function classifyCode(text) {
  const tokenRegex = new RegExp(
    `(#.*)|("(?:\\\\.|[^"\\\\])*")|\\b(${KEYWORDS.join("|")})\\b|\\b\\d+(?:\\.\\d+)?\\b`,
    "g"
  );
  const classes = new Array(text.length).fill("plain");
  let match;
  while ((match = tokenRegex.exec(text)) !== null) {
    const cls = match[1] ? "comment" : match[2] ? "string" : match[3] ? "keyword" : "number";
    for (let i = match.index; i < match.index + match[0].length; i++) {
      classes[i] = cls;
    }
  }
  return classes;
}

function App() {

  let nav = useNavigate();
  const [code] = useState(`# --------------------------
# YARARA: FASTFETCH EXAMPLE
# By: FormalBlaze
# Creation Date: 2026-09-03
# --------------------------

# OS Library
pytaguañemu "stdlib/core/os"

# Color Library
pytaguañemu "stdlib/core/sa'y"

# Get operating system and user info
currentOS = os.plataforma()
currentUser = os.user()
currentVersion = os.version()
hostName = os.hostname()
shell = os.rekoShell()

# Output formatted values
FetchLine1 = currentUser + " - " + hostName
FetchLine2 = col("OS / Version: ", "yellow") + currentOS
FetchLine3 = col("User: ", "green") + currentUser

he'i FetchLine1
he'i FetchLine2
he'i FetchLine3`);

  const [codeClasses] = useState(() => classifyCode(code));

  const renderCodeChars = () =>
    code.split("").map((char, index) => (
      <span key={index} className={`code-${codeClasses[index]}`}>
        {char}
      </span>
    ));

  return (
    <div className="App">
      <Topbar absolute={true} />
      <div className="App-header">
        {/* Endlessly scrolling syntax-highlighted code background */}
        <div className="bg-code">
          <motion.div
            className="bg-code-scroll"
            animate={{ y: ["-50%", "0%"] }}
            transition={{ duration: 16, ease: "linear", repeat: Infinity }}
          >
            <pre>{renderCodeChars()}</pre>
            <pre aria-hidden="true">{renderCodeChars()}</pre>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          From Native Tongue<br />
          <span style={{ color: "#a8bf77" }}>to Native Code</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          Yarara is a programming language in the Guarani language, designed to
          be as close to natural Guarani as possible. It is a high-level
          language that compiles to native code, allowing for efficient
          execution of programs.
        </motion.p>
        <motion.div
          className="App-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
        >
          <button onClick={() => nav("/docs/getting-started")}>
            Get Started
          </button>
          <button className="border-btn" onClick={() => nav("/docs")}>
            Documentation
          </button>
        </motion.div>
      </div>

      <div className="App-features">
        <h1>Features</h1>
        <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        
        className="Feature-holder">
          <motion.div
            className="App-feature"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2>Natural Language</h2>
            <p>
              Yarara is designed to be as close to natural Guarani as possible,
              making it easy for native speakers to learn and use.
            </p>
          </motion.div>

          <motion.div
            className="App-feature"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2>High-Level Language</h2>
            <p>
              Yarara is a high-level language that abstracts away low-level
              details, allowing developers to focus on solving problems rather
              than managing memory.
            </p>
          </motion.div>

          <motion.div
            className="App-feature"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2>Native Code Compilation</h2>
            <p>
              Yarara compiles to native code, allowing for efficient execution
              of programs and making it suitable for a wide range of
              applications.
            </p>
          </motion.div>

          <motion.div
            className="App-feature"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2>Open Source</h2>
            <p>
              Yarara is open source, allowing the community to contribute and
              improve the language.
            </p>
          </motion.div>

          <motion.div
            className="App-feature"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2>Library Support</h2>
            <p>
              Yarara allows developers to leverage existing libraries and
              frameworks, making it easier to build complex applications.
            </p>
          </motion.div>

          <motion.div
            className="App-feature"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2>Cross-Platform</h2>
            <p>
              Yarara is designed to be cross-platform, allowing developers to
              build applications that run on multiple operating systems.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="App-why">
        <div className="App-why-text">
          <h1 style={{ textAlign: "center" }}>Why Yarara?</h1>
          <p style={{ fontSize: "1.25rem", textAlign: "center" }}>
            Yarara is the perfect choice for developers who want to program in
            a language that feels natural and is easy to use, mainly targeted to
            the Guarani-speaking community.
          </p>
        </div>
        <div className="App-why-image">
          <motion.div
            className="App-why-playground"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <Playground compact />
          </motion.div>
        </div>
      </div>

      <div className="App-contribute">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          Contribute to Yarara
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          Yarara is an open-source project I made for fun, and I am extremely grateful for any contributions, whether it's code, documentation, or just spreading the word. Check out the GitHub repository and join the community! ❤️
        </motion.p>
        <div className="Contribute-panels">
          <motion.div
            className="Contribute-panel"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            whileHover={{
              scale: 1.03,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <h2>Code</h2>
            <p>
              Contribute to the Yarara compiler, libraries, or tools. Check out
              the GitHub repository and submit pull requests or report issues.
            </p>
          </motion.div>

          <motion.div
            className="Contribute-panel"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
            whileHover={{
              scale: 1.03,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <h2>Documentation</h2>
            <p>
              Help improve the Yarara documentation, tutorials, and examples. Your
              contributions will make it easier for others to learn and use
              Yarara.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="App-comparison">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          Yarara vs Python
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          Yarara is heavily inspired by Python, it even uses python
          as the base for the interpreter, but it is designed to be
          in the Guarani language and follows some different design
          choices found in other languages, such as JavaScript.
        </motion.p>
        <div className="Comparison-panels">
          <motion.div
            className="Comparison-panel"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "backOut"}}
          >
            <h3>Yarara</h3>
            <p>A programming language designed for the Guarani language.</p>
            <p>Curly braces are used for code blocks.</p>
            <p>For loops do not exist.</p>
            <p>No Dict / Map data structures.</p>
            <p>Python function that drops you into python, (just in case you need something that isn't available in Yarara :D).</p>
            <p>Built-in C library calling capabilities.</p>
            <p>Built in support for running commands on the system.</p>
            <p>Identifiers can contain Guarani structure.</p>
          </motion.div>
          <motion.div
            className="Comparison-panel"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "backOut"}}
          >
            <h3>Python</h3>
            <p>A programming language designed for English speakers.</p>
            <p>Uses indentation instead of curly braces.</p>
            <p>For loops exist.</p>
            <p>Dict / Map data structures exist.</p>
            <p>C libraries can be used, but they require a library.</p>
            <p>Running commands on the system requires a library.</p>
            <p>Identifiers can only contain English structure.</p>
          </motion.div>
          <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}

          >
            At the end of the day, Python is still a great language, but Yarara is designed for its own purpose.
          </motion.p>
        </div>
      </div>


      <div className="App-cta">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          Ready to get started?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          Start your journey with Yarara today and experience the power of
          programming in Guarani.
        </motion.p>
        <motion.code
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          className="App-cta-code"
        >
          bash &lt;(curl -sSL https://raw.githubusercontent.com/RandomGuy4114/Yarara/refs/heads/main/tools/yararainstall.sh)
        </motion.code>
        <p style={{ textAlign: "center", fontStyle: "italic" }}>This script will install Yarara on your system.</p>
        
      </div>
      <Footer />
    </div>
  );
}

export default App;