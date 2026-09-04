import "../App.css";
import { Link, useNavigate } from "react-router";

export default function Topbar({absolute= false}) {
  let nav = useNavigate();
  return (
    <div className="topbar" style={{position: absolute ? "absolute" : "relative"}}>
      <div className="topbar-left">
        <img 
          className="topbar-logo" 
          onClick={() => nav("/")} 
          src="/YararaLogoFull.png" 
          alt="Yarara Logo" 
          width={"200px"}
        />
      </div>
      <div className="topbar-right">
        <Link to="/docs">Documentation</Link>
        <a href="https://github.com/RandomGuy4114/Yarara" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  );
}