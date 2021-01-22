import "./App.css";
import React, { useState, useEffect } from "react";

import Login from "./components/Login";
import store from "./store";
import TalkBox from "./components/TalkBox";
import Loading from "./components/Loading";
import MediaContainer from "./components/MediaContainer";
import imgSearch from "./Assets/Images/search.svg";
import arrowDown from "./Assets/Images/arrow-down.svg";
import arrowDownInactive from "./Assets/Images/arrow-down-inactive.svg";

import authConfig from "./dhw-config.json";

const axios = require("axios");

const Home = ({ entrance }) => {
  const convertedEntrance = authConfig[entrance];
  const [talks, setTalks] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchIdx, setSearchIdx] = useState(-1);

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

  useEffect(() => {
    setSearchIdx(searchResult.length - 1);
  }, [searchResult]);
  useEffect(() => {
    searchIdx !== -1 && searchResult[searchIdx].scrollIntoView();
  }, [searchIdx]);

  const search = () => {
    const searchInput = document.querySelector(".searchInput");
    const value = searchInput.value;

    if (value !== "") {
      const talks = document.getElementsByClassName("talkBox");
      const talkHeader = document.querySelector(".talkHeader");
      let matched = [];

      for (let t of talks) {
        if (t.innerText.includes(value)) matched.push(t);
      }
      // idx = matched.length - 1;
      const resultCount = document.createElement("p");
      resultCount.className = "searchResultCount";
      resultCount.innerText = `${matched.length} 건 검색됨`;

      const firstChild = talkHeader.children.item(0);
      if (firstChild.tagName === "P") talkHeader.removeChild(firstChild);
      talkHeader.insertBefore(resultCount, searchInput);

      if (matched.length > 0) setSearchResult(matched);
    }
  };
  const showNext = () => {
    searchIdx === searchResult.length - 1
      ? alert("마지막 검색 결과입니다")
      : setSearchIdx(searchIdx + 1);
  };
  const showPrev = () => {
    searchIdx === 0
      ? alert("가장 첫 검색 결과입니다")
      : setSearchIdx(searchIdx - 1);
  };

  return (
    <div className="App">
      <div className="talkHeader">
        <input type="text" className="searchInput" />
        <img
          src={imgSearch}
          alt="검색"
          className="imgSearch"
          onClick={search}
        />
        {searchResult.length > 0 ? (
          <img
            src={arrowDown}
            alt="다음"
            className="btnArrow btnActive"
            onClick={showNext}
          />
        ) : (
          <img src={arrowDownInactive} alt="다음" className="btnArrow" />
        )}
        {searchResult.length > 0 ? (
          <img
            src={arrowDown}
            alt="이전"
            className="btnArrow btnActive arrowUp"
            onClick={showPrev}
          />
        ) : (
          <img
            src={arrowDownInactive}
            alt="이전"
            className="btnArrow arrowUp"
          />
        )}
        {/* <img
          src={searchResult.length > 0 ? arrowDown : arrowDownInactive}
          alt="다음"
          className={search}
          onClick={searchResult.length > 0 ? showNext : () => {}}
        />
        <img
          src={searchResult.length > 0 ? arrowDown : arrowDownInactive}
          alt="이전"
          className="btnArrow arrowUp"
          onClick={searchResult.length > 0 ? showPrev : () => {}}
        /> */}
      </div>
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
