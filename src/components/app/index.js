import {
  createElement,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  useRef
} from 'rax';
import RoomsList from '../rooms-list';
import MessagesList from '../messages-list';
import MessageEditor from '../message-editor';
import MessagePreviewer from '../message-previewer';
import Status from '../status';
import Shortcuts from '../shortcuts';
import reducer from './reducer';
import * as operations from './operations';
import { startPolling } from './polling';

/**
 * @param {object} param0
 * @param {ReturnType<import('../../modules/chatwork/client').default>} param0.client
 * @param {import('../../modules/config').Settings} param0.settings
 */
export default function App({
  settings,
  client,
  initialState
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const roomsList = useRef(null);
  const messagesList = useRef(null);
  const messageEditor = useRef(null);

  useEffect(() => {
    process.on('unhandledRejection', error => {
      roomsList.current.screen.debug(error);
    });
  }, []);

  useEffect(() => {
    Promise.all([
      operations.loadRooms({ client, dispatch }),
      operations.getMe({ client, dispatch })
    ]).then(() => {
      roomsList.current.focus();
    });
  }, [client]);

  useEffect(() => {
    if (state.messages.length > 0) { // FIXME
      messagesList.current.focus();
    }
  }, [state.messages]);


  useEffect(() => {
    if (settings.enablePolling) {
      return startPolling({
        client,
        settings,
        dispatch,
        targetRoomId: state.activeRoomId
      });
    }
  }, [state.activeRoomId, messagesList, client, settings]);

  const handleRoomSelect = useCallback(async room => {
    await operations.activateRoom({
      client,
      dispatch,
      targetRoomId: room.id
    });
  }, [client]);

  const activeRoom = useMemo(() => {
    return state.rooms.find(x => x.id === state.activeRoomId);
  }, [state.rooms, state.activeRoomId]);

  const activateRoomsList = useCallback(() => {
    operations.activateRoomsList({ dispatch });
  }, []);

  const activateMessagesList = useCallback(() => {
    operations.activateMessagesList({
      messagesList: messagesList.current,
      dispatch,
      messages: state.messages,
      activeRoomId: state.activeRoomId,
      me: state.me,
      client
    });
  }, [state.messages, state.activeRoomId, state.me, client]);

  const activateMessageEditor = useCallback(() => {
    operations.activateMessageEditor({
      dispatch,
      messageEditor: messageEditor.current,
      client,
      activeRoomId: state.activeRoomId
    });
  }, [state.activeRoomId, client]);

  const activateMessagePreviewer = useCallback(() => {
    operations.activateMessagePreviewer({ dispatch });
  }, []);

  const handleShortcut = useCallback((ch, key) => { // eslint-disable-line
    const shortcut = state.activeShortcuts.find(x => x.key === key.full);
    if (shortcut) {
      shortcut.handler();
      return false;
    }
  }, [state.activeShortcuts]);

  return (
    <box>
      <RoomsList
        position={{ width: '25%', height: '95%' }}
        style={state.theme.list}
        rooms={state.rooms}
        ref={roomsList}
        onSelect={handleRoomSelect}
        onKeypress={handleShortcut}
        onFocus={activateRoomsList}
      />
      <box
        label={activeRoom ? activeRoom.name : ''}
        border='line'
        position={{ left: '25%', width: '75%', height: '95%' }}>
        <MessagesList
          hidden={state.messages.length === 0}
          position={{ height: '75%', width: '98%' }}
          ref={messagesList}
          messages={state.messages}
          style={state.theme.box}
          onKeypress={handleShortcut}
          onFocus={activateMessagesList}
        />
        <MessageEditor
          hidden={state.messages.length === 0}
          ref={messageEditor}
          position={{ height: '20%', top: '75%', width: '98%' }}
          style={state.theme.editor}
          onKeypress={handleShortcut}
          onFocus={activateMessageEditor}
        />
      </box>
      <MessagePreviewer
        open={state.messagePreviewer != null}
        message={state.messagePreviewer}
        onFocus={activateMessagePreviewer}
        onKeypress={handleShortcut}
        style={state.theme.box}
        position={{ width: '100%', height: '95%' }}
      />
      <Status
        status={state.status}
        position={{ height: '2%', top: '95%', width: '100%' }}
      />
      <Shortcuts
        position={{ height: '3%', top: '97%', width: '100%' }}
        shortcuts={state.activeShortcuts}
      />
    </box>
  );
}
