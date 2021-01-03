import React from "react";
import LoadingImg from "../Assets/Images/loading_heart.svg";
import store from "../store";

const Loading = () => {
  // console.log("#loading");
  const { loading } = store.getState();
  if (!loading) return null;
  return (
    <div className="loading">
      <div className="box-loading-img">
        <img src={LoadingImg} className="loadingImg" alt="로딩이미지" />
      </div>
      <p className="description-loading">잠시만 기다려주세요~</p>
    </div>
  );
};

export default Loading;
