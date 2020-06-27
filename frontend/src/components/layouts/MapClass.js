//må laste inn npm install --save react-geocode
//og npm install --save google-maps-react
//må legge inn     "react-google-maps": "^9.4.5", i package.json

import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import Geocode from "react-geocode";

// API-nøkkel for bruk av Google Maps
Geocode.setApiKey("Denne må du finne selv");

const WrappedMap = withScriptjs(withGoogleMap(Map));

// Database-addressen
const database_url_coordinates = "//localhost:8000/api/coordinates/";
const database_url_requests = "//localhost:8000/api/requests/";
const database_url_names = "//localhost:8000/api/names/";

// Beskriver hvordan kartet skal se ut
function Map() {
  Geocode.setApiKey("Denne må du finne selv");
  Geocode.enableDebug();
  const [selectedKalas, setSelectedKalas] = useState(null);
  const [data, setData] = useState({ hits: [] });

  function removeMember(MemberID) {
    console.log("Fjerner medlem med ID: ", MemberID);

    window.fetch(database_url_names + MemberID + "/", {
      method: "DELETE"
    });

    window.location.reload();
  }

  function sendMergeRequest(SenderID, RecieverID) {
    console.log("Sender merge request");

    window
      .fetch(database_url_requests, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Token " + JSON.parse(localStorage.getItem("token"))
        },
        body: JSON.stringify({
          kalasSender: parseInt(SenderID),
          kalasReciver: parseInt(RecieverID)
        })
      })
      .then(response => {
        console.log("Merge request response: ", response.json());
        console.log("Token: " + localStorage.getItem("token"));
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(database_url_coordinates);
      setData(result);
    };
    fetchData();
  }, []);

  if (data.data === undefined) {
    return <div>Laster...</div>;
  }

  return (
    <GoogleMap
      defaultOptions={{
        streetViewControl: false,
        minZoom: 5,
        maxZoom: 15,
        styles: [
          {
            featureType: "all",
            elementType: "labels.text",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off"
              }
            ]
          }
        ]
      }}
      defaultZoom={13}
      defaultCenter={{ lat: 63.418827, lng: 10.402732 }}
      style={{ width: "100vw", height: "70vh" }}
    >
      {
        (console.log("Dataene er ", data),
        data.data.map(kalasobjekt => {
          if (kalasobjekt.username !== "admin" && kalasobjekt.kalas !== null) {
            return (
              <>
                {kalasobjekt.kalas.id ===
                JSON.parse(localStorage.getItem("kalas_id")) ? (
                  <Marker
                    key={kalasobjekt.kalas.id}
                    position={{
                      lat: parseFloat(kalasobjekt.kalas.lat),
                      lng: parseFloat(kalasobjekt.kalas.lng)
                    }}
                    icon={{
                      url:
                        "https://image.flaticon.com/icons/svg/931/931949.svg",
                      scaledSize: new window.google.maps.Size(50, 50)
                    }}
                    onClick={() => {
                      setSelectedKalas(kalasobjekt);
                    }}
                  />
                ) : (
                  <Marker
                    key={kalasobjekt.kalas.id}
                    position={{
                      lat: parseFloat(kalasobjekt.kalas.lat),
                      lng: parseFloat(kalasobjekt.kalas.lng)
                    }}
                    icon={{
                      url: "/logo_blå.png",
                      //url:
                      //"https://www.rr-a.no/wp-content/uploads/2018/01/map-marker-icon.png",
                      scaledSize: new window.google.maps.Size(45, 15)
                    }}
                    onClick={() => {
                      setSelectedKalas(kalasobjekt);
                      document.getElementById("requestSent").style.display =
                        "none";
                    }}
                  />
                )}
              </>
            );
          }
          return null;
        }))
      }
      {selectedKalas && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedKalas.kalas.lat),
            lng: parseFloat(selectedKalas.kalas.lng)
          }}
          onCloseClick={() => {
            setSelectedKalas(null);
            document.getElementById("requestSent").style.display = "none";
          }}
        >
          <div>
            {selectedKalas.kalas.id ===
              JSON.parse(localStorage.getItem("kalas_id")) && (
              <div>
                <h2>Ditt Kalas!</h2>
                <p>
                  Kapasitiet: {JSON.parse(localStorage.getItem("capacity"))}
                </p>
                <p>
                  Addresse: {JSON.parse(localStorage.getItem("address"))},{" "}
                  {JSON.parse(localStorage.getItem("postal"))}
                </p>
                <p>
                  Telefonnummer:{" "}
                  {JSON.parse(localStorage.getItem("phoneNumber"))}
                </p>
                <div>
                  Andre medlemmer:{" "}
                  {selectedKalas.kalas.names.map(medlem => {
                    return (
                      <div className="submitData">
                        <p>{medlem.name}</p>
                        <button
                          style={{ width: "50%" }}
                          onClick={() => removeMember(medlem.id)}
                        >
                          Fjern {medlem.name}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedKalas.kalas.id !==
              JSON.parse(localStorage.getItem("kalas_id")) && (
              <div>
                <h2>{selectedKalas.username}</h2>
                <p>Eier: {selectedKalas.kalas.fullName}</p>
                <p>Kapasitiet: {selectedKalas.kalas.capacity}</p>
                <div className="submitData">
                  <button
                    onClick={() => {
                      sendMergeRequest(
                        JSON.parse(localStorage.getItem("kalas_id")),
                        selectedKalas.kalas.id
                      );
                      document.getElementById("requestSent").style.display =
                        "block";
                      document.getElementById("requestSent").innerHTML =
                        "Forespørsel sendt!";
                    }}
                  >
                    Merge hos {selectedKalas.username}!
                  </button>
                </div>
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

// Beskriver Kartets dimensjoner og start sted
class MapClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latiude: null,
      longitude: null,
      userAdress: null,
      allMarkers: ""
    };
  }

  render() {
    return (
      <div style={{ width: "100vw", heigth: "100vh" }}>
        <WrappedMap
          googleMapURL={
            "https://maps.googleapis.com/maps/api/js?key=(her må du sette nøkkelen).exp&libraries=geometry,drawing,places"
          }
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `70vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}
export default MapClass;
