import { createElement, forwardRef } from 'rax';

const RoomsList = forwardRef(({
  rooms = [],
  onSelect,
  ...restProps
}, ref) => (
  <list
    onSelect={(_, index) => onSelect(rooms[index])}
    ref={ref}
    items={rooms.map(x => x.name)}
    width='90%'
    height='85%'
    left='5%'
    top='11%'
    keys
    vi
    clickable
    keyable
    mouse
    border='line'
    tags
    {...restProps}>
  </list>
));

export default RoomsList;
