import { createElement } from 'rax';
import Status from './status';
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