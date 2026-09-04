import "../App.css"
import { motion } from "motion/react"
import Topbar from "../components/Topbar"
import Footer from "../components/Footer"
import { Link, useNavigate } from "react-router"

function App() {
  let nav = useNavigate()
  return (
    <div className="App">
      <Topbar absolute={true} />
      <div className="App-header">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          From Native Tongue<br /><span style={{ color: "#a8bf77" }}>to Native Code</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          Yarara is a programming language in the Guarani language, designed to be as close to natural Guarani as possible. It is a high-level language that compiles to native code, allowing for efficient execution of programs. 
        </motion.p>
        <motion.div className="App-buttons"
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
        <div className="Feature-holder">
          <motion.div className="App-feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <h2>Natural Language</h2>
            <p>Yarara is designed to be as close to natural Guarani as possible, making it easy for native speakers to learn and use.</p>
          </motion.div>
          <motion.div className="App-feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <h2>High-Level Language</h2>
            <p>Yarara is a high-level language that abstracts away low-level details, allowing developers to focus on solving problems rather than managing memory and other low-level concerns.</p>
          </motion.div>
          <motion.div className="App-feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          >
            <h2>Native Code Compilation</h2>
            <p>Yarara compiles to native code, allowing for efficient execution of programs and making it suitable for a wide range of applications.</p>
          </motion.div>
          <motion.div className="App-feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
          >
            <h2>Open Source</h2>
            <p>Yarara is open source, allowing the community to contribute and improve the language.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="App-feature">
            <h2>Library Support</h2>
            <p>Yarara allows developers to leverage existing libraries and frameworks, making it easier to build complex applications.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="App-feature">
            <h2>Cross-Platform</h2>
            <p>Yarara is designed to be cross-platform, allowing developers to build applications that run on multiple operating systems.</p>
          </motion.div>
        </div>
      </div>
      <div className="App-why">
        <div className="App-why-text">
          <h1 style={{textAlign: "center"}}>Why Yarara?</h1>
          <p style={{fontSize: '1.25rem', textAlign: "center", padding: '0 60px'}}>Yarara is the perfect choice for developers who want to program in a language that feels natural and is easy to use, this is mainly targeted to the Guarani-speaking community.</p>
        </div>
        <div className="App-why-image">
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            src="/YararaExample.png" width={500} height={500} style={{border: '1px solid #ccc', borderRadius: '10px', objectFit: 'cover'}} alt="Code Example" />
        </div>
      </div>
      <div className="App-cta">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          Ready to get started?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          Start your journey with Yarara today and experience the power of programming in Guarani.
        </motion.p>
        <motion.div className="App-buttons"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
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
      <Footer />
    </div>
  )
}

export default App