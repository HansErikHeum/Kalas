// Man må laste ned 'react-router-dom' ved å skrive: "npm install react-router-dom"
import React, { Component } from "react";
import "./App.css";
import Register from "./components/auth/Register";
import Navigation from "./components/layouts/Navigation";
import Admin from "./components/pages/Admin";
import Home from "./components/pages/Home";
import LogIn from "./components/auth/LogIn";
import LoggedIn from "./components/pages/LoggedIn";
import Borst from "./components/pages/Borst";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Selve appen og overordnede egenskaper som database url
class App extends Component {
  constructor(props) {
    super(props);

    // Denne må endres avhenging av IP-adressen til databasen
    this.database_url = "//127.0.0.1:8000";
    this.database_url_register = this.database_url + "/api/register/";
    this.database_url_admin = this.database_url + "/admin";
    this.database_url_login = this.database_url + "/api/login/";
    this.database_url_coordinates = this.database_url + "/api/coordinates/";
    this.database_url_names = this.database_url + "/api/names/";
    this.database_url_merge = this.database_url + "/api/merge/";
    this.database_url_borst = this.database_url + "/api/borst/";
  }

  render() {
    let appDatabase_url_register = this.database_url_register;
    let appDatabase_url_admin = this.database_url_admin;
    let appDatabase_url_login = this.database_url_login;
    let appDatabase_url_coordinates = this.database_url_coordinates;
    let appDatabase_url_names = this.database_url_names;
    let appDatabase_url_merge = this.database_url_merge;
    let appDatabase_url_borst = this.database_url_borst;

    return (
      <Router>
        <div className="App">
          <Navigation />
          <Switch>
            <Route
              exact
              path="/registrering"
              render={props => (
                <Register database_url_register={appDatabase_url_register} />
              )}
            />
            <Route
              exact
              path="/admin"
              render={props => (
                <Admin database_url_admin={appDatabase_url_admin} />
              )}
            />
            <Route
              exact
              path="/logg-inn"
              render={props => (
                <LogIn
                  database_url_login={appDatabase_url_login}
                  database_url_coordinates={appDatabase_url_coordinates}
                />
              )}
            />
            <Route
              exact
              path="/logget-inn"
              render={props => (
                <LoggedIn
                  database_url_names={appDatabase_url_names}
                  database_url_merge={appDatabase_url_merge}
                />
              )}
            />
            <Route
              exact
              path="/borst"
              render={props => (
                <Borst
                  database_url_names={appDatabase_url_names}
                  database_url_borst={appDatabase_url_borst}
                />
              )}
            />
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
