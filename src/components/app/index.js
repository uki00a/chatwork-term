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
import Shortcuts from '../shortcuts';
// FIXME
import { createScrollHandler } from '../messages-list/handlers';
import reducer from './reducer';
import * as actions from './actions';
import * as operations from './operations';

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

  useEffect(async () => {
    await operations.loadRooms({ client, dispatch });
  }, []);

  useEffect(() => {
    const handler = createScrollHandler(messagesList.current);
    messagesList.current.on('scroll', handler);
  }, []);

  useEffect(() => {
    if (state.messages.length > 0) { // FIXME
      messagesList.current.setScrollPerc(100);
      messagesList.current.focus();
    }
  }, [state.messages]);

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

  const handleShortcut = useCallback((ch, key) => { // eslint-disable-line
    const shortcut = state.activeShortcuts.find(x => x.key === key.full); 
    messagesList.current.screen.debug(key)
    if (shortcut) {
      shortcut.handler();
      return false;
    }
  }, [state.activeShortcuts]);

  const activateRoomsList = useCallback(() => {
    dispatch(actions.activeShortcutsChanged([]));
  }, []); 

  const activateMessagesList = useCallback(() => {
    dispatch(actions.activeShortcutsChanged([]));
  }, []);

  const activateMessageEditor = useCallback(() => {
    dispatch(actions.activeShortcutsChanged([
      {
        key: 'C-s',
        description: 'Submit',
        handler: () => addMessageToRoom(messageEditor.current.getValue())
      }
    ]));
  }, [messageEditor, addMessageToRoom]);

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
        focused
      />
      <box
        label={activeRoom ? activeRoom.name : ''}
        border='line'
        position={{ left: '25%', width: '75%', height: '95%' }}>
        <MessagesList
          position={{ height: '75%', width: '98%' }}
          ref={messagesList}
          messages={state.messages}
          style={state.theme.box}
          onKeypress={handleShortcut}
          onFocus={activateMessagesList}
        />
        <MessageEditor
          ref={messageEditor}
          position={{ height: '20%', top: '75%', width: '98%' }}
          style={state.theme.editor}
          onKeypress={handleShortcut}
          onFocus={activateMessageEditor}
        />
      </box>
      <Shortcuts
        position={{ height: '5%', top: '95%', width: '100%' }}
        shortcuts={state.activeShortcuts}
      />
    </box>
  );
}
