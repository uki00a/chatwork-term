import { createElement, forwardRef, useState, useEffect, useRef, useCallback } from 'rax';
import blessed from 'neo-blessed';
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

const RoomsList = forwardRef(({
  rooms = [],
  onSelect,
  ...restProps
}, ref) => (
  <list
    onSelect={(_, index) => onSelect(rooms[index])}
    ref={ref}
    items={rooms.map(formatRoomName)}
    width='90%'
    height='85%'
    left='5%'
    top='11%'
    keys
    vi
    keyable
    border='line'
    tags
    {...restProps}>
  </list>
));

function formatRoomName(room) {
  return room.unreadNum > 0
    ? `{bold}${blessed.helpers.escape(room.name)} (${room.unreadNum}){/}`
    : room.name;
}

