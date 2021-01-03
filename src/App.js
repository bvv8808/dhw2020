import "./App.css";
import React, { useState, useEffect } from "react";

import Login from "./components/Login";
import store from "./store";
import TalkBox from "./components/TalkBox";
import Loading from "./components/Loading";
import MediaContainer from "./components/MediaContainer";

import authConfig from "./dhw-config.json";

const axios = require("axios");

const Home = ({ entrance }) => {
  const convertedEntrance = authConfig[entrance];
  const [talks, setTalks] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:3001/texts?lineLimit=1000`)

      .then((res) => {
        store.dispatch({ type: "INIT_RESOURCE", list: res.data.resourceList });
        setTalks(res.data.talks);
      })
      .then(() => {
        const container = document.querySelector(".container");
        container.scrollTo(0, container.scrollHeight);
      })
      .then(() => store.dispatch({ type: "OFF_LOADING" }))
      .catch((err) => console.log(err));

    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      {talks.length > 0 ? (
        <div className="container">
          {talks.map((talk, idx) => (
            <TalkBox talk={talk} key={idx} entrance={convertedEntrance} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
      <MediaContainer />
    </div>
  );
};

function App() {
  const uidRow = document.cookie
    .split("; ")
    .find((row) => row.startsWith("uid"));
  const stateUid = uidRow ? uidRow.split("=")[1] : null;

  const [uid, setUid] = useState(stateUid);

  return (
    <div className="App">
      {uid ? <Home entrance={uid} /> : <Login setUid={setUid} />}
    </div>
  );
}

export default App;
