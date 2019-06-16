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

/**
 * @param {object} param0
 * @param {Function} param0.dispatch
 */
export function activateRoomsList({ dispatch }) {
  dispatch(actions.activeShortcutsChanged([]));
}

/**
 * @param {object} param0
 * @param {ChatworkClient} param0.client
 * @param {Function} param0.dispatch
 * @param {object[]} param0.messages
 * @param {number} param0.activeRoomId
 * @param {object} param0.messagesList
 */
export function activateMessagesList({
  messagesList,
  client,
  dispatch,
  messages,
  activeRoomId
}) {
  dispatch(actions.activeShortcutsChanged([
    {
      key: 'return',
      description: 'Preview',
      handler: () => {
        const index = messagesList.selected; // FIXME selected
        const message = messages[index];
        dispatch(actions.previewMessage(message));
      }
    },
    {
      key: 'C-e',
      description: 'Edit',
      handler: () => {
        const index = messagesList.selected; // FIXME selected
        const message = messages[index];
        messagesList.screen.readEditor({ value: message.body }, async (error, body) => {
          if (error) {
            throw error; // TODO error handling
          }
          await updateMessage({
            client,
            dispatch,
            id: message.id,
            roomId: activeRoomId,
            body
          });
        });
      }
    }
  ]));
}

/**
 * @param {object} param0
 * @param {Function} param0.dispatch
 * @param {object} param0.messageEditor
 * @param {ChatworkClient} param0.client
 * @param {number} param0.activeRoomId
 */
export function activateMessageEditor({
  dispatch,
  messageEditor,
  client,
  activeRoomId
}) {
  dispatch(actions.activeShortcutsChanged([
    {
      key: 'C-s',
      description: 'Submit',
      handler: async () => {
        await addMessageToRoom({
          body: messageEditor.getValue(),
          client,
          dispatch,
          targetRoomId: activeRoomId
        });
        messageEditor.clearValue();
      }
    },
    {
      key: 'C-e',
      description: 'Open editor',
      handler: () => messageEditor.readEditor(value => {
        messageEditor.setValue(value);
      })
    }
  ]));
}

/**
 * @param {object} param0
 * @param {Function} param0.dispatch
 */
export function activateMessagePreviewer({ dispatch }) {
  dispatch(actions.activeShortcutsChanged([
    {
      key: 'escape',
      description: 'Close',
      handler: () => dispatch(actions.unpreviewMessage())
    }
  ]));
}