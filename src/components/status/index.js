import { createElement } from 'rax';
import { useContainer } from '../../hooks/container';
import { StatusContainer } from '../../containers/status';

export default function(props) {
  const { status } = useContainer(StatusContainer);

  return (
    <Status
      status={status}
      {...props}
    />
  );
}

const Status = ({ status, ...restProps }) => (
  <box { ...restProps }>
    { status }
  </box>
);