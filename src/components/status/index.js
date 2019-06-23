import { createElement } from 'rax';

const Status = ({ status, ...restProps }) => (
  <box { ...restProps }>
    { status }
  </box>
);

export default Status;
