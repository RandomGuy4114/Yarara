import "../App.css";
import { motion, inView } from "motion/react";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function FAQ() {
    return(
        <div className="App-FAQ">
            <Topbar absolute />
            <div className="App-FAQ-header">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                >
                    Frequently Asked Questions
                </motion.h1>
            </div>
            <div className="FAQ-section-header">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                >
                    What is Yarara?
                </motion.h2>
            </div>
            <div className="FAQ-section-content">
                <p>
                    Yarara is a programming language similar to Python, but designed to be in the Guarani language. It is a high-level, interpreted language that is easy to learn and use, making it a great choice for beginners and experienced programmers alike.
                </p>
                <p>
                    The name "Yarara" comes from the name of a South American snake, which explains why the language's logo is a snake and why the language is based off of Python. The language is designed to be simple and intuitive, with a focus on readability and ease of use.
                </p>
                <p>
                    This project started as a fun experiment to see if it was possible to create a programming language in Guarani, and has since grown into a full-fledged language with its own syntax and features. The goal of Yarara is to make programming more accessible to people who speak Guarani, and to promote the use of the language in the tech community.
                </p>
            </div>
            <div className="FAQ-section-header">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                >
                    Why create a programming language in Guarani?
                </motion.h2>
            </div>
            <div className="FAQ-section-content">
                <p>
                    The reason why I created a programming language in Guarani is because I wanted to promote the creation of programming languages in languages other than English, I believe that programming should be accessible to everyone, regardless of their native language. By creating a programming language in Guarani, I hope to inspire others to create programming languages in their own languages, and to promote the use of Guarani in the tech community.
                </p>
                <p>
                    Also, why not? I thought it would be fun to create a programming language in Guarani, and I wanted to see if it was possible. I believe that programming languages should be fun and creative, and that they should reflect the culture and language of the people who use them.
                </p>
            </div>
            <Footer />
        </div>
    )
}