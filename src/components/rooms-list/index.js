import { createElement, forwardRef } from 'rax';
import blessed from 'neo-blessed';

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

export default RoomsList;
