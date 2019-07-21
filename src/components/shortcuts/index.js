import { createElement } from 'rax';
import Shortcuts from './shortcuts';
import { useContainer } from '../../hooks/container';
import { ShortcutsContainer } from '../../containers/shortcuts';

export default function(props) {
  const { shortcuts } = useContainer(ShortcutsContainer);

  return (
    <Shortcuts
      shortcuts={shortcuts}
      {...props}
    />
  );
}