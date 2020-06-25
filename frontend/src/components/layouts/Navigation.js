import React from "react";
import "../../App.css";
import { Link } from "react-router-dom";

// Utseende til navigation-baren
function Navigation() {
  return (
    <nav>
      <Link to="">
        <img
          src={"/logo_hvit.png"}
          style={{ maxWidth: "25%" }}
          alt="Hvit Kalas-logo"
        ></img>
      </Link>

      <ul className="Navigation-links"></ul>
    </nav>
  );
}

export default Navigation;
