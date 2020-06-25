// Man må laste ned 'react-router-dom' ved å skrive: "npm install react-router-dom"
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import MapClass from "../layouts/MapClass";
import "../../App.css";

// Sjekker om det er noen feilmeldinger når man legger til medlem
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

// Database-url for requests
const database_url_requests = "//localhost:8000/api/requests/";

// /logget-inn siden
class LoggedIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: loadFromStorage("username"),
      fullName: loadFromStorage("fullName"),
      capacity: loadFromStorage("capacity"),
      phoneNumber: loadFromStorage("phoneNumber"),
      address: loadFromStorage("address"),
      postal: loadFromStorage("postal"),
      password: loadFromStorage("password"),
      lat: loadFromStorage("user_lat"),
      lng: loadFromStorage("user_lng"),
      rejects: [],
      requests: [],
      memberName: null,
      // Medlemmer som er i kalaset, utenom personen som har registrert seg (altså fullName).
      members: [],
      formErrors: {
        memberName: "",
      },
      loggedInFeedback: "",
    };
  }

  getMergeRequest = (e) => {
    let loggedInThis = this;
    loggedInThis.setState(() => ({ requests: [] }));
    window
      .fetch(database_url_requests, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Token " + JSON.parse(localStorage.getItem("token")),
        },
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let i = 0;
        for (i = 1; i < data.total + 1; i++) {
          loggedInThis.setState({
            requests: this.state.requests.concat([data[i]]),
          });
          //loggedInThis.state.requests.push(data[i].username + " ønsker å merge med deg. De sender følgende melding: " + data[i].message)
          console.log("Requests er nå: ", loggedInThis.state.requests);
        }
      });
  };

  acceptMergeRequest(MergeID) {
    console.log("Aksepterer merge request");

    window
      .fetch(this.props.database_url_merge, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Token " + JSON.parse(localStorage.getItem("token")),
        },
        body: JSON.stringify({
          requestID: parseInt(MergeID),
        }),
      })
      .then(() => {
        console.log("Accept merge request");
        window.location.reload();
      });
  }

  rejectMergeRequest(MergeID) {
    let loggedInThis = this;
    loggedInThis.setState({
      rejects: this.state.rejects.concat(MergeID),
    });
  }

  logOut = (e) => {
    e.preventDefault();

    let loggedInThis = this;
    localStorage.clear();
    loggedInThis.props.history.push("/");
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let loggedInThis = this;

    if (formValid(this.state)) {
      console.log(`
      --SENDER INN--
      Navn: ${this.state.memberName}
      `);

      window.fetch(loggedInThis.props.database_url_names, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.state.memberName,
          kalasID: JSON.parse(localStorage.getItem("kalas_id")),
        }),
      });

      window.location.reload();
    } else {
      loggedInThis.setState(() => ({
        loggedInFeedback: "En eller flere felter er ugyldig, prøv igjen",
      }));
      console.error("REGISTRERING MISLYKTES - VIS FEILMELDING");
    }
  };

  handleChange = (e) => {
    this.setState(() => ({ loggedInFeedback: "" }));
    const { name, value } = e.target;
    // Kopierer formErrors
    let formErrors = this.state.formErrors;

    switch (name) {
      case "memberName":
        formErrors.memberName =
          value.length < 1 ? "Navn må bestå av minst en bokstav" : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  render() {
    const { formErrors } = this.state;

    // Dersom man ikke er logget inn
    if (
      loadFromStorage("isLoggedIn") === false ||
      loadFromStorage("isLoggedIn") === undefined
    ) {
      this.props.history.push("/logg-inn");
      return null;
    }
    // Dersom man er logget inn
    if (loadFromStorage("hasChanged") === true) {
      localStorage.setItem("hasChanged", false);
    }

    return (
      <div>
        <h1>Du er nå logget inn!</h1>
        <h1>Hei, {this.state.fullName}</h1>
        <h1>
          Ditt kalas, {this.state.username}, har plass til {this.state.capacity}{" "}
          stykker,
        </h1>
        <label>
          på addressen {this.state.address}, {this.state.postal}, og kan
          kontaktes på tlf: {this.state.phoneNumber}.
        </label>
        <p
          id="requestSent"
          style={({ display: "none" }, { color: "green" })}
        ></p>
        <div>
          <MapClass />
        </div>
        <h1>
          {loadFromStorage("isLoggedIn") === true && (
            <Link to="/borst" style={{ textDecoration: "none" }}>
              <div className="submitData">
                <button type="submit" style={{ width: "20%" }}>
                  Spill Børst
                </button>
              </div>
            </Link>
          )}
        </h1>
        <div className="loggedInWrapper">
          <div className="loggedin-form-wrapper">
            <h1>Legg til medlemmer i ditt kalas!</h1>
            <form onSubmit={this.handleSubmit} noValidate>
              <span className="feedbackMessage">
                {this.state.loggedInFeedback}
              </span>
              <div className="memberName">
                <label className="label_input" htmlFor="memberName">
                  Medlem
                </label>
                <input
                  type="text"
                  className={formErrors.memberName.length > 0 ? "error" : null}
                  placeholder="Navn"
                  name="memberName"
                  noValidate
                  onChange={this.handleChange}
                />
                {formErrors.memberName.length > 0 && (
                  <span className="errorMessage">{formErrors.memberName}</span>
                )}
              </div>
              <div className="submitData">
                <button type="submit">Legg til medlem!</button>
              </div>
            </form>
          </div>
        </div>

        <div className="submitData">
          <button
            type="submit"
            style={{ width: "20%" }}
            onClick={this.getMergeRequest}
          >
            Hent forespørseler!
          </button>
        </div>

        <div className="submitData">
          <h1>Forespørseler:</h1>
          {this.state.requests.map((request) => {
            if (this.state.rejects.indexOf(request.id) === -1) {
              return (
                <div>
                  <p>{request.username} ønsker å merge kalas hos deg!</p>
                  <p>Antall: {request.members.length + 1}</p>
                  <p>Melding: {request.message}</p>
                  <button
                    type="submit"
                    style={{ width: "20%" }}
                    onClick={() => {
                      this.acceptMergeRequest(request.id);
                    }}
                  >
                    Godta
                  </button>
                  <button
                    type="submit"
                    style={{ width: "20%" }}
                    onClick={() => this.rejectMergeRequest(request.id)}
                  >
                    Avslå
                  </button>
                </div>
              );
            }
            return null;
          })}
          <button type="submit" style={{ width: "20%" }} onClick={this.logOut}>
            Logg ut
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(LoggedIn);
