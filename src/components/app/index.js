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
import Shortcuts from '../shortcuts';
import reducer from './reducer';
import * as actions from './actions';
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
  const messagePreviewer = useRef(null);

  useEffect(() => {
    process.on('unhandledRejection', error => {
      roomsList.current.screen.debug(error);
    });
  }, []);

  useEffect(async () => {
    await operations.loadRooms({ client, dispatch });
    roomsList.current.focus();
  }, []);

  useEffect(() => {
    if (state.messages.length > 0) { // FIXME
      messagesList.current.focus();
    }
  }, [state.messages]);

  if (settings.enablePolling) {
    useEffect(() => {
      return startPolling({
        client,
        settings,
        dispatch,
        targetRoomId: state.activeRoomId
      });
    }, [state.activeRoomId, messagesList]);
  }

  const handleRoomSelect = useCallback(async room => {
    await operations.activateRoom({
      client,
      dispatch,
      targetRoomId: room.id
    });
  }, [state.activeRoomId]);

  const addMessageToRoom = useCallback(async body => {
    await operations.addMessageToRoom({
      client,
      dispatch,
      targetRoomId: state.activeRoomId,
      body: body
    });
  }, [state.activeRoomId]);

  const activeRoom = useMemo(() => {
    return state.rooms.find(x => x.id === state.activeRoomId);
  }, [state.activeRoomId]);

  const activateRoomsList = useCallback(() => {
    dispatch(actions.activeShortcutsChanged([]));
  }, []); 

  const activateMessagesList = useCallback(() => {
    dispatch(actions.activeShortcutsChanged([
      {
        key: 'return',
        description: 'Preview',
        handler: () => {
          const index = messagesList.current.selected; // FIXME selected
          const message = state.messages[index];
          dispatch(actions.previewMessage(message));
        }
      }
    ]));
  }, [state.messages, messagesList]);

  const activateMessageEditor = useCallback(() => {
    dispatch(actions.activeShortcutsChanged([
      {
        key: 'C-s',
        description: 'Submit',
        handler: () => {
          addMessageToRoom(messageEditor.current.getValue());
          messageEditor.current.clearValue();
        }
      },
      {
        key: 'C-e',
        description: 'Open editor',
        handler: () => messageEditor.current.readEditor(value => {
          messageEditor.current.setValue(value);
        })
      }
    ]));
  }, [messageEditor]);

  const activateMessagePreviewer = useCallback(() => {
    dispatch(actions.activeShortcutsChanged([
      {
        key: 'escape',
        description: 'Close',
        handler: () => dispatch(actions.unpreviewMessage())
      }
    ]));
  }, [messagePreviewer]);

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
      <Shortcuts
        position={{ height: '5%', top: '95%', width: '100%' }}
        shortcuts={state.activeShortcuts}
      />
    </box>
  );
}
