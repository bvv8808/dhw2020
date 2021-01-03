import React from "react";

import store from "../store";

const DateBox = ({ date }) => {
  return <div className="dateBox">{date}</div>;
};

const LostPicture = ({ boxSide, type }) => {
  let mediaType = "";
  switch (type) {
    case "picture":
      mediaType = "사진";
      break;
    case "video":
      mediaType = "동영상";
      break;
    case "audio":
      mediaType = "음성메시지";
      break;
    default:
      break;
  }
  return (
    <div className={`talkContainer ${boxSide}`}>
      <div className="talkBox lostMedia">[유실된 {mediaType}]</div>
    </div>
  );
};

const convertDate = (date) => {
  const arr = date.split(". ");
  // console.log(arr);
  const ymd = `${arr[0]}${arr[1].padStart(2, "0")}${arr[2].padStart(2, "0")}_`;
  const temp = arr[3].split(":");
  const ampmh = temp[0].split(" ");
  let hh;
  if (ampmh[0] === "오전") {
    hh = ampmh[1] === "12" ? "00" : ampmh[1].padStart(2, "0");
  } else if (ampmh[0] === "오후") {
    hh = ampmh[1] === "12" ? ampmh[1] : String(Number(ampmh[1]) + 12);
  }
  // const h = ampmh[0] === "오후" ? Number(ampmh[1]) + 12 : Number(ampmh[1]);
  // const hh = String(h).padStart(2, "0");
  if (hh === undefined)
    console.log(
      "## convert ERR ",
      date,
      ampmh[1] === "오후",
      typeof ampmh[1],
      ampmh[1],
      Number(ampmh[1]) + 12,
      String(Number(ampmh[1]) + 12)
    );

  return ymd + hh + temp[1];
};

const TalkBox = ({ talk, entrance }) => {
  switch (talk[0]) {
    case "emptyLine":
      return <br></br>;
    case "date":
      return <DateBox date={talk[1]} />;
    case "talk":
      let date,
        talker = "나";
      if (!talk[2]) {
        const state = store.getState();
        date = state.talkDate;
        talker = state.talker;
        const boxSide = talker === entrance ? "box-right" : "box-left";

        return (
          <div className={`talkContainer ${boxSide}`}>
            <div className="talkBox">{talk[1]}</div>
          </div>
        );
      }
      [date, talker] = talk[1].split(",").map((v) => v.trim());
      store.dispatch({
        type: "SET_LAST_TALKER",
        talker: talker,
        talkDate: date,
      });

      const boxSide = talker === entrance ? "box-right" : "box-left";

      // 미디어는 텍스트 클릭 시 별도의 커버 화면에서 렌더링.
      let filenames = [];
      if (talk[2].startsWith("사진")) {
        // console.log("# Picture ");
        if (talk[2] === "사진") {
          const { idx, list } = store.getState();
          // console.log(idx);
          const imgName = list[idx];
          const imgDate = imgName.substr(0, 13);
          const talkDate = convertDate(date);

          if (imgDate !== talkDate) {
            // console.log("LOST ", idx, talkDate, imgDate, date);
            return <LostPicture boxSide={boxSide} type="picture" />;
          }
          filenames.push(imgName);
          store.dispatch({ type: "MARK_MEDIA", newIdx: idx + 1 });
        } else if (talk[2].endsWith("장")) {
          const n = Number(
            talk[2].substring(0, talk[2].length - 1).substring(3)
          );
          const state = store.getState();
          let idx = state.idx;
          const { list } = state;
          for (let i = 0; i < n; i++) {
            const imgName = list[idx];
            const imgDate = imgName.substr(0, 13);
            const talkDate = convertDate(date);
            if (imgDate === talkDate) {
              // console.log("LOST ", idx, talkDate, imgDate, date);
              // return <LostPicture boxSide={boxSide} type="picture" />;
              filenames.push(imgName);
              idx++;
            }

            // store.dispatch({ type: "MARK_MEDIA", newIdx: idx + 1 });
          }
          store.dispatch({ type: "MARK_MEDIA", newIdx: idx });
          if (!filenames.length) {
            // console.log("<LOST PICTURES> ", idx, date);
            return <LostPicture boxSide={boxSide} type="picture" />;
          }
        } else
          return (
            <div className={`talkContainer ${boxSide}`}>
              <div className="talkBox">{talk[2]}</div>
            </div>
          );

        return (
          <div className={`talkContainer ${boxSide}`}>
            <div className="talkBox mediaBox">
              <button
                className="btnMedia"
                onClick={() => {
                  store.dispatch({
                    type: "SET_MEDIAS",
                    files: filenames,
                    mediaType: "picture",
                  });
                }}
                value={filenames}
              >
                사진
              </button>
            </div>
          </div>
        );
      } else if (talk[2] === "동영상") {
        const { idx, list } = store.getState();
        const videoName = list[idx];
        const videoDate = videoName.substr(0, 13);
        const talkDate = convertDate(date);
        // console.log("## ", videoDate, talkDate);
        if (videoDate !== talkDate) {
          console.log("<LOST VIDEO> ", idx, talkDate, videoDate, date);
          return <LostPicture boxSide={boxSide} type="video" />;
        }

        filenames.push(videoName);
        store.dispatch({ type: "MARK_MEDIA", newIdx: idx + 1 });

        return (
          <div className={`talkContainer ${boxSide}`}>
            <div className="talkBox mediaBox">
              <button
                onClick={() => {
                  store.dispatch({
                    type: "SET_MEDIAS",
                    files: filenames,
                    mediaType: "video",
                  });
                }}
                value={filenames}
              >
                동영상
              </button>
            </div>
          </div>
        );
      } else if (talk[2] === "음성메시지") {
        const { idx, list } = store.getState();
        const audioName = list[idx];
        const audioDate = audioName.substr(0, 13);
        const talkDate = convertDate(date);
        console.log("## ", audioDate, talkDate);
        if (audioDate !== talkDate) {
          console.log("<LOST AUDIO> ", idx, talkDate, audioDate, date);
          return <LostPicture boxSide={boxSide} type="audio" />;
        }

        filenames.push(audioName);
        store.dispatch({ type: "MARK_MEDIA", newIdx: idx + 1 });

        return (
          <div className={`talkContainer ${boxSide}`}>
            <div className="talkBox mediaBox">
              <button
                onClick={() => {
                  store.dispatch({
                    type: "SET_MEDIAS",
                    files: filenames,
                    mediaType: "audio",
                  });
                }}
                value={filenames}
              >
                음성메시지
              </button>
            </div>
          </div>
        );
      }
      return (
        <div className={`talkContainer ${boxSide}`}>
          <div className="talkBox">{talk[2]}</div>
        </div>
      );
    default:
      return null;
  }
};

export default TalkBox;
