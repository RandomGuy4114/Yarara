import '../App.css'
import { Link } from 'react-router'

export default function Footer() {
  return (
    <div className="footer">
        <div className="footer-left">
            <p>Made By FormalBlaze & Contributors</p>
        </div>
        <div className="footer-right">
            <Link to="/docs">Documentation</Link>
            <a href="https://github.com/RandomGuy4114/Yarara" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
    </div>
  )
}