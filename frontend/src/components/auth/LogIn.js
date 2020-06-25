import React, { Component } from "react";
import "../../App.css";
import { Link, withRouter } from "react-router-dom";

// Sjekker om det er noen errors, ser på ...rest, som er alle verdier i LogIn sin this.state
const formValid = ({ formErrors, ...rest }) => {
  // Setter valid til true som default
  let valid = true;

  // Sjekker om noen av verdiene i formErrors har en feilmelding, hvis en verdi har det,
  // så settes valid til å være false
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  Object.values(rest).forEach((val) => {
    val === null && (valid = false);
  });

  return valid;
};

//Hjelpefunksjon til saveAllToLocalStorage
function saveToLocalStorage(stateName, stateValue) {
  try {
    const serializedStateName = stateName;
    const serializedStateValue = JSON.stringify(stateValue);
    localStorage.setItem(serializedStateName, serializedStateValue);
  } catch (e) {
    console.log(e);
  }
}
//Henter data fra localstorage
function loadFromStorage(state) {
  try {
    const serializedState = JSON.parse(localStorage.getItem(state));
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

// Sjekker statusen etter å ha sent POST
function checkStatus(response) {
  console.log("checkStatus - statusText: ", response.statusText);
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

// Gjør om response til JSON
function parseJSON(response) {
  return response.json();
}

// LogIn-klassen, viser /logg-inn
class LogIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      formErrors: {
        username: "",
        password: "",
      },
      logInFeedback: "",
      items: [],
      totalReactPackages: "",
    };
  }

  // Sier hva som skal skje når man trykker på "opprett kalas"
  handleSubmit = (e) => {
    e.preventDefault();
    let logInThis = this;

    if (formValid(this.state)) {
      console.log(`
      --SENDER INN--
      Kalasnavn: ${this.state.username}
      Passord: ${this.state.password}
      URL: ${logInThis.props.database_url_login}
      `);

      window
        .fetch(logInThis.props.database_url_login, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
          }),
        })
        .then(checkStatus)
        .then(parseJSON)
        .then((response) => {
          console.log("Response: " + response);
          saveToLocalStorage("token", response.token);
          saveToLocalStorage("username", response.username);
          saveToLocalStorage("user_id", response.user_id);
          saveToLocalStorage("kalas_id", response.kalas_id);
          saveToLocalStorage("capacity", response.capacity);
          saveToLocalStorage("fullName", response.fullName);
          saveToLocalStorage("phoneNumber", response.phoneNumber);
          saveToLocalStorage("time", response.time);
          saveToLocalStorage("postal", response.postal);
          saveToLocalStorage("address", response.address);
          saveToLocalStorage("user_lat", response.lat);
          saveToLocalStorage("user_lng", response.lng);
          // Lager en verdi som bekrefter at brukeren er logget inn
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("hasChanged", "true");
          return response;
        })
        .then(function (data) {
          logInThis.setState(() => ({
            logInFeedback:
              "Innlogging var vellykket! Du vil nå bli logget inn...",
          }));

          console.log("request succeeded with JSON response", data);

          setTimeout(function () {
            logInThis.props.history.push({
              path: "/logget-inn",
              coordinates: logInThis.state.totalReactPackages,
            });
          }, 3000);
        })
        .catch(function (error) {
          logInThis.setState(() => ({
            logInFeedback: "Innlogging mislyktes, prøv igjen",
          }));
          console.log("request failed", error);
        });
    } else {
      logInThis.setState(() => ({
        logInFeedback: "Kalasnavn og/eller passord er ugyldig, prøv igjen",
      }));
      console.error("INNLOGGING MISLYKTES - VIS FEILMELDING");
    }
  };

  // Sier hva som skal skje når vi skriver i tekstfeltene
  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    // Kopierer formErrors
    let formErrors = this.state.formErrors;
    let logInThis = this;
    logInThis.setState(() => ({ logInFeedback: "" }));

    switch (name) {
      case "username":
        formErrors.username = value.length < 1 ? "Skriv inn Kalasnavn" : "";
        break;
      case "password":
        formErrors.password = value.length < 1 ? "Skriv inn passord" : "";
        break;
      default:
        break;
    }

    this.setState({ [name]: value }, () => console.log(this.state));
  };

  render() {
    const { formErrors } = this.state;

    //Sjekker om man er logget inn, dersom man er det så sendes man til /logget-inn
    if (loadFromStorage("isLoggedIn") === true) {
      this.props.history.push("/logget-inn");
      return null;
    }
    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h1>Logg inn nå!</h1>
          <span className="feedbackMessage">{this.state.logInFeedback}</span>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="username">
              <label className="label_input" htmlFor="username">
                Kalasnavn
              </label>
              <input
                type="text"
                className={formErrors.username.length > 0 ? "error" : null}
                placeholder="Kalasnavn"
                name="username"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.username.length > 0 && (
                <span className="errorMessage">{formErrors.username}</span>
              )}
            </div>

            <div className="password">
              <label className="label_input" htmlFor="password">
                Passord
              </label>
              {/* Type = "password" skjuler passordet */}
              <input
                type="password"
                className={formErrors.password.length > 0 ? "error" : null}
                placeholder="Passord"
                name="password"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.password.length > 0 && (
                <span className="errorMessage">{formErrors.password}</span>
              )}
            </div>

            <div className="submitData">
              <button type="submit">Logg inn på Kalas!</button>
              <small>
                <Link to="/registrering">Opprett ett nytt kalas</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(LogIn);
