import React, { Component } from "react";
import "../../App.css";
import { Link } from "react-router-dom";
//"Borst.js inneholder alt av funksjonalitet for spillet "Børst"
//Denne klassen henter tilfeldige navn fra medlemmene til kalaset, og lager spørsmål

//denne funksjonen setter opp en kontakt med databasen
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

class Borst extends Component {
  constructor(props) {
    super(props);
    this.EventHandler = this.EventHandler.bind(this);
    this.state = {
      username: loadFromStorage("username"),
      members: ["pelle"],
      bgColor: ["#E53030", "#392D84", "#4B4B4A", "#29DCCB", "#1D3341"],
      selectedColor: " ",
      selectedQuestion: " ",
      currentName: " ",
      currentIndex: 0,
      promiseIsResolved: false,
      spørsmålDatabase: [],
      nyeSpørsmål: [],
      button: false
    };
  }
  //denne funksjonen blir kalt med en gang du går inn på siden og henter og behandler nødvendig data
  componentDidMount() {
    const url = "http://127.0.0.1:8000/api/users/";
    console.log("dette er det som blir logget");
    fetch(url).then(response => console.log(response.json()));
    this.GetAllQuestions();
    this.GetAllMembers();
    this.GetRandomColor();
    this.MakeQuestions();
  }
  //denne funksjonen setter et tilfeldig navn fra medlemmene til databasen som currentName
  RandomName() {
    console.log("DU ER NÅ I RANDOMNAME FUNKSJONEN");
    let name = this.state.members[
      Math.floor(Math.random() * this.state.members.length)
    ];
    this.setState({
      currentName: name
    });
  }
  //Denne funksjonen itererer gjennom alle spørsmålene som er i databasen, og setter inn et tilfeldig navn
  //i teksten det står "#". Den setter så "nyeSpørsmål" til en liste med alle spørsmål + navn
  async MakeQuestions() {
    let navneArray = [];
    for (var i = 0; i < this.state.spørsmålDatabase.length; i++) {
      if (this.state.spørsmålDatabase[i].includes("#")) {
        let string1 = this.state.spørsmålDatabase[i];
        await this.RandomName();
        let string2 = string1.replace("#", this.state.currentName);
        console.log("string2", string2);
        navneArray.push(string2);
      } else {
        navneArray.push(this.state.spørsmålDatabase[i]);
      }
    }
    console.log("navneArray", navneArray);
    this.setState({
      nyeSpørsmål: navneArray
    });
  }
  //Dette skjer når du trykker på knappen "neste spørsmål"
  //Bakgrunnsfargen endres og et nytt spørsmål oppdateres på siden
  async EventHandler(props) {
    if (!this.state.promiseIsResolved) {
      await this.MakeQuestions();

      this.setState({
        promiseIsResolved: true
      });
    }
    this.GetRandomColor();
    this.GetNextQuestion();
  }
  //Denne funksjonen går gjennom listen med de nye spørsmålene.
  //indexen øker med 1 for hver gang, og et nytt spørsmål blir i satt i klassen state som "selectedQuestion"
  GetNextQuestion() {
    var item = this.state.nyeSpørsmål[this.state.currentIndex];
    var index = this.state.currentIndex + 1;
    if (this.state.nyeSpørsmål.length === index - 1) {
      this.setState({
        selectedQuestion: "Det er dessverre ikke flere spørsmål",
        button: true
      });
    } else {
      this.setState({
        selectedQuestion: item,
        currentIndex: index
      });
    }
  }
  //Setter en tilfeldig farge fra listen med bakgrunnsgarger som "selectedColor"
  GetRandomColor() {
    var item = this.state.bgColor[
      Math.floor(Math.random() * this.state.bgColor.length)
    ];
    this.setState({
      selectedColor: item
    });
  }
  //Henter alle spørsmålene fra databasen og setter det i klassens state
  GetAllQuestions = e => {
    let spørsmål = [];
    window
      .fetch(this.props.database_url_borst)
      .then(response => {
        return response.json();
      })
      .then(data => {
        data.map(member => {
          spørsmål.push(member.text);
          return true;
        });
      });
    this.setState(state => {
      return { spørsmålDatabase: spørsmål };
    });
  };
  //henter alle medlemmene i kalaset fra databasen og setter det i klassens state
  GetAllMembers = e => {
    let memberArray = [];
    window
      .fetch(this.props.database_url_names)
      .then(response => {
        return response.json();
      })
      .then(data => {
        data.map(member => {
          if (member.kalasID === JSON.parse(localStorage.getItem("kalas_id"))) {
            memberArray.push(member.name);
            return true;
          }
          return true;
        });
      });
    this.setState(state => {
      return { members: memberArray };
    });
  };

  render() {
    let button;
    if (this.state.button === false) {
      button = (
        <button className="borstButton" onClick={this.EventHandler}>
          Neste Spørsmål
        </button>
      );
    } else {
      button = (
        <Link to="">
          <button className="borstButton">Trykk her for å komme tilbake</button>
        </Link>
      );
    }
    return (
      <div
        className="borstWrapper"
        style={{ backgroundColor: this.state.selectedColor }}
      >
        <h1 className="borstTekst">{this.state.selectedQuestion}</h1>
        <div>{button}</div>
      </div>
    );
  }
}

export default Borst;
