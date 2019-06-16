// @ts-check
import * as actions from './actions';

/**
 * @typedef {ReturnType<import('../../modules/chatwork/client').default>} ChatworkClient
 */

/**
 * @param {object} param0
 * @param {ChatworkClient} param0.client
 * @param {Function} param0.dispatch
 */
export async function loadRooms({ client, dispatch }) {
  const rooms = await client.listRooms();
  dispatch(actions.listRoomsSuccess(rooms));
}

/**
 * @param {object} param0
 * @param {ChatworkClient} param0.client
 * @param {Function} param0.dispatch
 * @param {number} param0.targetRoomId
 */
export async function listMessagesInRoom({ client, dispatch, targetRoomId }) {
  const messages = await client.listMessagesInRoom(targetRoomId);
  dispatch(actions.listMessagesSuccess(messages));
}

/**
 * @param {object} param0
 * @param {ChatworkClient} param0.client
 * @param {Function} param0.dispatch
 * @param {number} param0.targetRoomId
 */
export async function activateRoom({ client, dispatch, targetRoomId }) {
  dispatch(actions.activeRoomChanged(targetRoomId));
  await listMessagesInRoom({ client, dispatch, targetRoomId });
}

/**
 * @param {object} param0
 * @param {ChatworkClient} param0.client
 * @param {Function} param0.dispatch
 * @param {number} param0.targetRoomId
 * @param {string} param0.body
 */
export async function addMessageToRoom({ client, dispatch, targetRoomId, body }) {
  const id = await client.addMessageToRoom(body, targetRoomId);
  const newMessage = await client.getMessageById(id, targetRoomId);
  dispatch(actions.addMessageToRoomSuccess({ message: newMessage, targetRoomId }));
}

/**
 * @param {object} param0
 * @param {ChatworkClient} param0.client
 * @param {Function} param0.dispatch
 * @param {number} param0.roomId
 * @param {number} param0.id
 * @param {string} param0.body
 */
export async function updateMessage({ client, dispatch, roomId, id, body }) {
  await client.updateMessage({ id, roomId, body });
  dispatch(actions.updateMessage({ id, roomId, body }));
}