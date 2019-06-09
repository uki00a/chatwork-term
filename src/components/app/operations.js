import * as actions from './actions';

export async function loadRooms({ client, dispatch }) {
  const rooms = await client.listRooms();
  dispatch(actions.listRoomsSuccess(rooms));
}

export async function listMessagesInRoom({ client, dispatch, targetRoomId }) {
  const messages = await client.listMessagesInRoom(targetRoomId);
  dispatch(actions.listMessagesSuccess(messages));
}

export async function activateRoom({ client, dispatch, targetRoomId }) {
  dispatch(actions.activeRoomChanged(targetRoomId));
  await listMessagesInRoom({ client, dispatch, targetRoomId });
}

export async function addMessageToRoom({ client, dispatch, targetRoomId, body }) {
  const id = await client.addMessageToRoom(body, targetRoomId);
  const newMessage = await client.getMessageById(id, targetRoomId);
  dispatch(actions.addMessageToRoomSuccess({ message: newMessage, targetRoomId }));
}
