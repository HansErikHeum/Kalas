import React, { Component } from "react";
import "../../App.css";
import { Link } from "react-router-dom";

// Henter data fra localStorage
function loadFromStorage(state) {
  try {
    const serializedState = JSON.parse(localStorage.getItem(state));
    if (serializedState === null) return undefined;
    return serializedState;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

// "Landing-page"
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infotext: ""
    };
  }

  render() {
    // Dersom man ikke er logget inn
    let infotext = "";

    if (
      loadFromStorage("isLoggedIn") === false ||
      loadFromStorage("isLoggedIn") === undefined
    ) {
      infotext = "Logg inn for å se tilgjengelige Kalas i nærheten";
    }
    // Dersom man er logget inn
    else {
      this.props.history.push("/logget-inn");
    }

    return (
      <div style={{ width: "100vw", height: "70vh" }}>
        <h1>Velkommen til Kalas!</h1>
        <h2>{infotext}</h2>
        <img
          src={"/logo_blå.png"}
          style={{ maxWidth: "50%" }}
          alt="Blå Kalas-logo"
        ></img>
        <h1>
          <Link
            className="header-link2"
            to="/registrering"
            style={{ textDecoration: "none" }}
          >
            Opprett Kalas
          </Link>
        </h1>

        <h1>
          <Link
            className="header-link2"
            to="/logg-inn"
            style={{ textDecoration: "none" }}
          >
            Logg inn på eksisterende kalas
          </Link>
        </h1>
      </div>
    );
  }
}

export default Home;
