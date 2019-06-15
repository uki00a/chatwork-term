export const LIST_ROOMS_SUCCESS = 'LIST_ROOMS_SUCCESS';
export const LIST_MESSAGES_SUCCESS = 'LIST_MESSAGES_SUCCESS';
export const ACTIVE_ROOM_CHANGED = 'ACTIVE_ROOM_CHANGED';
export const ADD_MESSAGE_TO_ROOM_SUCCESS = 'ADD_MESSAGE_TO_ROOM_SUCCESS';
export const ACTIVE_SHORTCUTS_CHANGED = 'ACTIVE_SHORTCUTS_CHANGED';
export const PREVIEW_MESSAGE = 'PREVIEW_MESSAGE';
export const UNPREVIEW_MESSAGE = 'UNPREVIEW_MESSAGE';

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

export function activeShortcutsChanged(shortcuts) {
  return { type: ACTIVE_SHORTCUTS_CHANGED, payload: shortcuts }
}

export function previewMessage(message) {
  return { type: PREVIEW_MESSAGE, payload: message };
}

export function unpreviewMessage() {
  return { type: UNPREVIEW_MESSAGE };
}