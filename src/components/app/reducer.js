import {
  SET_ME,
  LIST_ROOMS_SUCCESS,
  LIST_MESSAGES_SUCCESS,
  ACTIVE_ROOM_CHANGED,
  ADD_MESSAGE_TO_ROOM_SUCCESS,
  UPDATE_MESSAGE,
  ACTIVATE_SHORTCUTS,
  PREVIEW_MESSAGE,
  UNPREVIEW_MESSAGE,
  SET_STATUS,
  CLEAR_STATUS
} from './actions';

export const initialState = Object.freeze({
  rooms: [],
  messages: [],
  activeRoomId: null,
  activeShortcuts: [],
  theme: null,
  messagePreviewer: null,
  me: null,
  status: null
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case SET_ME:
    return { ...state, me: action.payload };
  case LIST_ROOMS_SUCCESS:
    return { ...state, rooms: action.payload };
  case LIST_MESSAGES_SUCCESS:
    return { ...state, messages: action.payload };
  case ACTIVE_ROOM_CHANGED:
    return { ...state, activeRoomId: action.payload };
  case ADD_MESSAGE_TO_ROOM_SUCCESS:
    if (state.activeRoomId === action.payload.targetRoomId) {
      return {
        ...state,
        messages: state.messages.concat(action.payload.message)
      };
    } else {
      return state;
    }
  case UPDATE_MESSAGE:
    if (state.activeRoomId === action.payload.roomId) {
      return {
        ...state,
        messages: state.messages.map(x => {
          if (x.id === action.payload.id) {
            return { ...x, body: action.payload.body };
          } else {
            return x;
          }
        })
      };
    } else {
      return state;
    }
  case ACTIVATE_SHORTCUTS:
    return { ...state, activeShortcuts: action.payload };
  case PREVIEW_MESSAGE:
    return { ...state, messagePreviewer: action.payload };
  case UNPREVIEW_MESSAGE:
    return { ...state, messagePreviewer: null };
  case SET_STATUS:
    return { ...state, status: action.payload };
  case CLEAR_STATUS:
    return { ...state, status: '' };
  default:
    return state;
  }
}
