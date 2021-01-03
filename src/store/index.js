import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

export default createStore((state, action) => {
  if (state === undefined)
    return {
      list: [],
      idx: 0,
      mediaSwitch: false,
      mediaType: "",
      loading: true,
      files: [],
      talker: "",
      talkDate: "",
    };
  switch (action.type) {
    case "INIT_RESOURCE":
      return { ...state, list: action.list };
    case "MARK_MEDIA":
      if (!state.list) return state;
      return { ...state, idx: action.newIdx };
    case "OFF_MEDIA":
      return { ...state, mediaSwitch: false };
    case "OFF_LOADING":
      return { ...state, loading: false };
    case "SET_MEDIAS":
      return {
        ...state,
        files: action.files,
        mediaType: action.mediaType,
        mediaSwitch: true,
      };
    case "SET_LAST_TALKER":
      return { ...state, talker: action.talker, talkDate: action.talkDate };
    default:
      return state;
  }
}, composeWithDevTools());
