import React, { Component } from "react";
import "../../App.css";
import { Link, withRouter } from "react-router-dom";
// Importerer modulen for fetch(), for å installere skriv inn følgende i terminalen: "npm install whatwg-fetch --save"
import "whatwg-fetch";

const numberRegex = RegExp(/^[0-9]*$/);

// Sjekker om det er noen errors, ser på formErrors
//...rest er alle andre verdier i Register sin this.state
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

// Sjekker statusen etter å ha sent POST
function checkStatus(response) {
  console.log("checkStatus - statusText: ", response);
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

// Lagrer alle states i nettleseren
function saveAllToLocalStorage(states) {
  saveToLocalStorage("username", states.username);
  saveToLocalStorage("capacity", states.capacity);
  saveToLocalStorage("fullName", states.fullName);
  saveToLocalStorage("phoneNumber", states.phoneNumber);
  saveToLocalStorage("address", states.address);
  saveToLocalStorage("postal", states.postal);
  // Lager en verdi som bekrefter at brukeren er logget inn
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("hasChanged", "true");
}

// Henter data fra localStorage
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

// Er /registrering siden
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      capacity: null,
      fullName: null,
      phoneNumber: null,
      address: null,
      postal: null,
      password: null,
      formErrors: {
        username: "",
        capacity: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        postal: "",
        password: "",
      },
      registerFeedback: "",
    };
  }

  // Sier hva som skal skje når man trykker på "opprett kalas"
  handleSubmit = (e) => {
    e.preventDefault();

    let registerThis = this;

    if (formValid(this.state)) {
      console.log(`
      --SENDER INN--
      Kalasnavn: ${this.state.username}
      Kapasitet: ${this.state.capacity}
      Fullt navn: ${this.state.fullName}
      Telefonnummer: ${this.state.phoneNumber}
      Adresse: ${this.state.address}
      Poststed: ${this.state.postal}
      Passord: ${this.state.password}
      `);
      window
        .fetch(registerThis.props.database_url_register, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.state.username,
            capacity: this.state.capacity,
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            address: this.state.address,
            postal: this.state.postal,
            password: this.state.password,
          }),
        })
        .then(checkStatus)
        .then(parseJSON)
        .then((response) => {
          console.log("Response: " + response);
          saveToLocalStorage("kalas_id", response.kalas_id);
          saveToLocalStorage("user_id", response.user_id);
          saveToLocalStorage("token", response.token);
          saveToLocalStorage("user_lat", response.lat);
          saveToLocalStorage("user_lng", response.lng);
          return response;
        })
        .then(function (data) {
          registerThis.setState(() => ({
            registerFeedback:
              "Registreringen var vellykket! Du vil nå bli logget inn...",
          }));
          document.getElementById("feedbackMessageText").style.color = "green";
          saveAllToLocalStorage(registerThis.state);
          console.log("request succeeded with JSON response", data);
          setTimeout(function () {
            registerThis.props.history.push("/logget-inn");
          }, 3000);
        })
        .catch(function (error) {
          registerThis.setState(() => ({
            registerFeedback:
              "Registrering mislyktes, prøv igjen med et annet kalasnavn",
          }));
          console.log("request failed", error);
        });
    } else {
      registerThis.setState(() => ({
        registerFeedback: "En eller flere felter er ugyldig, prøv igjen",
      }));
      console.error("REGISTRERING MISLYKTES - VIS FEILMELDING");
    }
  };

  // Sier hva som skal skje når vi skriver i tekstfeltene
  handleChange = (e) => {
    e.preventDefault();
    this.setState(() => ({ registerFeedback: "" }));
    const { name, value } = e.target;
    // Kopierer formErrors
    let formErrors = this.state.formErrors;

    switch (name) {
      case "username":
        formErrors.username =
          value.length < 1 ? "Kalasnavn må bestå av minst en bokstav" : "";
        break;
      case "capacity":
        formErrors.capacity =
          value.length < 1 || value < 1 || !numberRegex.test(value)
            ? "Kapasitet må være et heltall større enn null"
            : "";
        break;
      case "fullName":
        formErrors.fullName =
          value.length < 1 ? "Navn må bestå av minst en bokstav" : "";
        break;
      case "phoneNumber":
        formErrors.phoneNumber =
          value.length === 8 && numberRegex.test(value)
            ? ""
            : "Telefonnummer må bestå av nøyaktig 8 siffer";
        break;
      case "address":
        formErrors.address =
          value.length < 1 ? "Adresse må bestå av minst en bokstav" : "";
        break;
      case "postal":
        formErrors.postal =
          value.length < 1 ? "Poststed må bestå av minst en bokstav" : "";
        break;
      case "password":
        formErrors.password =
          value.length < 6 ? "Passord må bestå av minst 6 tegn " : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  render() {
    const { formErrors } = this.state;

    if (loadFromStorage("isLoggedIn") === true) {
      this.props.history.push("/logget-inn");
      return null;
    }

    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h1>Opprett Kalas nå!</h1>
          <form onSubmit={this.handleSubmit} noValidate>
            <span id="feedbackMessageText" className="feedbackMessage">
              {this.state.registerFeedback}
            </span>

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

            <div className="capacity">
              <label className="label_input" htmlFor="capacity">
                Kapasitet
              </label>
              <input
                type="text"
                className={formErrors.capacity.length > 0 ? "error" : null}
                placeholder="Kapasitet"
                name="capacity"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.capacity.length > 0 && (
                <span className="errorMessage">{formErrors.capacity}</span>
              )}
            </div>

            <div className="fullName">
              <label className="label_input" htmlFor="fullName">
                Fullt navn
              </label>
              <input
                type="text"
                className={formErrors.fullName.length > 0 ? "error" : null}
                placeholder="Fullt navn"
                name="fullName"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.fullName.length > 0 && (
                <span className="errorMessage">{formErrors.fullName}</span>
              )}
            </div>

            <div className="phoneNumber">
              <label className="label_input" htmlFor="phoneNumber">
                Telefonnummer
              </label>
              <input
                type="text"
                className={formErrors.phoneNumber.length > 0 ? "error" : null}
                placeholder="Telefonnummer"
                name="phoneNumber"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.phoneNumber.length > 0 && (
                <span className="errorMessage">{formErrors.phoneNumber}</span>
              )}
            </div>

            <div className="address">
              <label className="label_input" htmlFor="address">
                Adresse
              </label>
              <input
                type="text"
                className={formErrors.address.length > 0 ? "error" : null}
                placeholder="Adresse"
                name="address"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.address.length > 0 && (
                <span className="errorMessage">{formErrors.address}</span>
              )}
            </div>

            <div className="postal">
              <label className="label_input" htmlFor="postal">
                Poststed
              </label>
              <input
                type="text"
                className={formErrors.postal.length > 0 ? "error" : null}
                placeholder="Poststed"
                name="postal"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.postal.length > 0 && (
                <span className="errorMessage">{formErrors.postal}</span>
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
              <button type="submit">Opprett Kalas!</button>
              <small>
                <Link class="form-link" to="/logg-inn">
                  Logg inn på eksisterende Kalas
                </Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
