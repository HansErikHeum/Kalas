import React, { Component } from "react";
import "../../App.css";
import { withRouter } from "react-router-dom";

// Admin-siden som har lenke til databasen sin admin-siden
class Admin extends Component {
  render() {
    if (this.props.database_url_admin !== undefined) {
      return (
        <div className="wrapper">
          <img
            src={"/logo_svart.png"}
            style={{ maxWidth: "50%" }}
            alt="Svart Kalas-logo"
          ></img>
          <h1>
            <a
              target="_blank"
              href={this.props.database_url_admin}
              rel="noopener noreferrer"
              style={{ color: "white" }}
            >
              Klikk her for å komme til Adminsiden
            </a>
          </h1>
        </div>
      );
    }
    return (
      <div>
        <h1>Adminsiden er utilgjengelig</h1>
      </div>
    );
  }
}

export default withRouter(Admin);
