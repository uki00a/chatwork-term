export const SET_ME = 'SET_ME';
export const LIST_ROOMS_SUCCESS = 'LIST_ROOMS_SUCCESS';
export const LIST_MESSAGES_SUCCESS = 'LIST_MESSAGES_SUCCESS';
export const ACTIVE_ROOM_CHANGED = 'ACTIVE_ROOM_CHANGED';
export const ADD_MESSAGE_TO_ROOM_SUCCESS = 'ADD_MESSAGE_TO_ROOM_SUCCESS';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const ACTIVATE_SHORTCUTS = 'ACTIVATE_SHORTCUTS';
export const PREVIEW_MESSAGE = 'PREVIEW_MESSAGE';
export const UNPREVIEW_MESSAGE = 'UNPREVIEW_MESSAGE';
export const SET_STATUS = 'SET_STATUS';
export const CLEAR_STATUS = 'CLEAR_STATUS';

export function setMe(me) {
  return { type: SET_ME, payload: me };
}

export function listRoomsSuccess(rooms) {
  return { type: LIST_ROOMS_SUCCESS, payload: rooms };
}

export function listMessagesSuccess(messages) {
  return { type: LIST_MESSAGES_SUCCESS, payload: messages };
}

export function activeRoomChanged(targetRoomId) {
  return { type: ACTIVE_ROOM_CHANGED, payload: targetRoomId };
}

export function addMessageToRoomSuccess(payload) {
  return { type: ADD_MESSAGE_TO_ROOM_SUCCESS, payload };
}

export function updateMessage(payload) {
  return { type: UPDATE_MESSAGE, payload };
}

export function activateShortcuts(shortcuts) {
  return { type: ACTIVATE_SHORTCUTS, payload: shortcuts }
}

export function previewMessage(message) {
  return { type: PREVIEW_MESSAGE, payload: message };
}

export function unpreviewMessage() {
  return { type: UNPREVIEW_MESSAGE };
}

export function setStatus(status) {
  return { type: SET_STATUS, payload: status };
}

export function clearStatus() {
  return { type: CLEAR_STATUS };
}
