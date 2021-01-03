import React, { useState, useEffect } from "react";
import store from "../store";

const axios = require("axios");

const MediaContainer = () => {
  const [uriList, setUriList] = useState([]);
  const [videoName, setVideoName] = useState("");
  const [audioName, setAudioName] = useState("");

  useEffect(() => {
    store.subscribe(() => {
      const { mediaSwitch, files, mediaType } = store.getState();

      if (mediaSwitch) {
        const mediaContainer = document.querySelector(".mediaContainer");
        switch (mediaType) {
          case "picture":
            Promise.all(
              files.map((filename) => {
                return axios
                  .get(`http://127.0.0.1:3001/getImg?fileName=${filename}`)
                  .then((res) => res.data.data);
              })
            )
              .then((resArr) => {
                setVideoName("");
                setAudioName("");
                setUriList(resArr);
                return resArr.length;
              })
              .then((dataLength) => {
                // const mediaContainer = document.querySelector(
                //   ".mediaContainer"
                // );

                if (dataLength === 1)
                  mediaContainer.style.justifyContent = "center";
                else mediaContainer.style.justifyContent = "space-between";

                mediaContainer.style.height = "100%";
              });
            break;
          case "video":
            // const mediaContainer = document.querySelector(".mediaContainer");
            mediaContainer.style.justifyContent = "center";
            mediaContainer.style.height = "100%";
            setUriList([]);
            setAudioName("");
            setVideoName(files[0]);
            break;
          case "audio":
            // mediaContainer = document.querySelector(".mediaContainer");
            mediaContainer.style.justifyContent = "center";
            mediaContainer.style.height = "100%";
            setUriList([]);
            setVideoName("");
            setAudioName(files[0]);
            break;
          default:
            break;
        }
      }
    });
  }, []);

  return (
    <div
      className="mediaContainer"
      onClick={(e) => {
        if (["IMG", "VIDEO", "AUDIO"].includes(e.target.tagName))
          e.target.parentNode.style.height = 0;
        else e.target.style.height = 0;
        store.dispatch({ type: "OFF_MEDIA" });
      }}
    >
      {uriList.map((uri, idx) => {
        return (
          <img
            key={idx}
            src={"data:image/jpg;base64," + uri}
            alt=""
            className="talkImg"
            onLoad={(e) => {
              const w = e.target.width;
              const h = e.target.height;
              if (w >= h) e.target.className = "talkImg-horizontal";
              else e.target.className = "talkImg-vertical";
            }}
          />
        );
      })}
      {videoName && (
        <video
          controls
          className="talkVideo"
          src={`http://127.0.0.1:3001/streamVideo?filename=${videoName}`}
        ></video>
      )}
      {audioName && (
        <audio
          className="talkAudio"
          src={`http://127.0.0.1:3001/streamAudio?filename=${audioName}`}
          controls
        />
      )}
    </div>
  );
};

export default MediaContainer;
