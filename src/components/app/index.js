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
// FIXME
import { createScrollHandler } from '../messages-list/handlers';
import reducer from './reducer';
import * as operations from './operations';

export default function App({
  settings,
  client,
  initialState
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const roomsList = useRef(null);
  const messagesList = useRef(null);

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

  return (
    <box>
      <RoomsList
        position={{ width: '25%' }}
        style={state.theme.list}
        rooms={state.rooms}
        ref={roomsList}
        onSelect={handleRoomSelect}
        focused
      />
      <box
        label={activeRoom ? activeRoom.name : ''}
        border='line'
        position={{ left: '25%', width: '75%' }}>
        <MessagesList
          position={{ height: '78%', width: '98%' }}
          ref={messagesList}
          messages={state.messages}
          style={state.theme.box}
        />
        <MessageEditor
          position={{ height: '20%', top: '78%', width: '98%' }}
          style={state.theme.editor}
        />
      </box>
    </box>
  );
}
