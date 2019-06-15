import {
  LIST_ROOMS_SUCCESS,
  LIST_MESSAGES_SUCCESS,
  ACTIVE_ROOM_CHANGED,
  ADD_MESSAGE_TO_ROOM_SUCCESS,
  ACTIVE_SHORTCUTS_CHANGED,
  PREVIEW_MESSAGE,
  UNPREVIEW_MESSAGE
} from './actions';

export const initialState = {
  rooms: [],
  messages: [],
  activeRoomId: null,
  activeShortcuts: [],
  theme: null,
  messagePreviewer: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
  case ACTIVE_SHORTCUTS_CHANGED:
    return { ...state, activeShortcuts: action.payload };
  case PREVIEW_MESSAGE:
    return { ...state, messagePreviewer: action.payload };
  case UNPREVIEW_MESSAGE:
    return { ...state, messagePreviewer: null };
  default:
    return state;
  }
}
