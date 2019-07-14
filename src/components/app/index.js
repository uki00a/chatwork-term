import {
  createElement,
  useEffect,
  useRef,
  useState
} from 'rax';
import RoomsList from '../rooms-list';
import MessagesList from '../messages-list';
import MessageEditor from '../message-editor';
import MessagePreviewer from '../message-previewer';
import Status from '../status';
import Shortcuts from '../shortcuts';
import { startPolling } from './polling';

/**
 * @param {object} param0
 * @param {ReturnType<import('../../modules/chatwork/client').default>} param0.client
 * @param {import('../../modules/config').Settings} param0.settings
 */
export default function App({
  settings,
  client,
  theme
}) {
  const root = useRef(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    process.on('unhandledRejection', error => {
      root.current.screen.debug(error);
    });
  }, []);

  useEffect(() => {
    client.getMe().then(setMe);
  }, [client]);

  return (
    <box ref={root}>
      <RoomsList
        settings={settings}
        client={client}
        position={{ width: '25%', height: '95%' }}
        style={theme.list}
        onSelect={setActiveRoom}
      />
      <box
        label={activeRoom ? activeRoom.name : ''}
        border='line'
        position={{ left: '25%', width: '75%', height: '95%' }}>
        <MessagesList
          settings={settings}
          roomId={activeRoom ? activeRoom.id : null}
          client={client}
          position={{ height: '75%', width: '98%' }}
          me={me}
          style={theme.box}
        />
        <MessageEditor
          roomId={activeRoom ? activeRoom.id : null}
          client={client}
          position={{ height: '20%', top: '75%', width: '98%' }}
          style={theme.editor}
        />
      </box>
      <MessagePreviewer
        style={theme.box}
        position={{ width: '80%', height: '80%', left: 'center', top: 'center' }}
      />
      <Status
        position={{ height: '2%', top: '95%', width: '100%' }}
      />
      <Shortcuts
        position={{ height: '3%', top: '97%', width: '100%' }}
      />
    </box>
  );
}
