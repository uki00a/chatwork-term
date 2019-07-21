import { createElement, useState, useEffect, useRef, useCallback } from 'rax';
import RoomsList from './rooms-list';
import { useContainer } from '../../hooks/container';
import { usePolling } from '../../hooks/polling';
import { ShortcutsContainer } from '../../containers/shortcuts';
import { StatusContainer } from '../../containers/status';

export default function({ client, settings, ...restProps }) {
  const [rooms, setRooms] = useState([]);
  const roomsList = useRef(null);
  const { activateShortcuts, keypressHandler } = useContainer(ShortcutsContainer);
  const { setStatus, clearStatus } = useContainer(StatusContainer);

  const pollingHandler = useCallback(async () => {
    const rooms = await client.listRooms();
    // FIXME
    if (rooms.some(x => x.unreadNum > 0)) {
      setRooms(rooms);
    }
  }, [client]);

  usePolling(settings, pollingHandler);

  useEffect(() => {
    setStatus('Loading list of rooms...');
    client.listRooms().then(rooms => {
      setRooms(rooms);
      clearStatus();
      roomsList.current.focus();
    });
  }, [client, setStatus, clearStatus]);

  const handleFocus = useCallback(() => {
    activateShortcuts([]);
  }, [activateShortcuts]);

  return (
    <RoomsList
      ref={roomsList}
      rooms={rooms}
      onFocus={handleFocus}
      onKeypress={keypressHandler}
      {...restProps}
    />
  );
}

