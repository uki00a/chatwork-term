import {
  LIST_ROOMS_SUCCESS,
  LIST_MESSAGES_SUCCESS,
  ACTIVE_ROOM_CHANGED,
  ADD_MESSAGE_TO_ROOM_SUCCESS
} from './actions';

export default function reducer(state, action) {
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
  default:
    return state;
  }
}
