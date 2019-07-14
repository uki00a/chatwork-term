import { createElement } from 'rax';
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

const Shortcuts = ({ shortcuts, ...restProps }) => {
  const label = [
    { key: 'C-c', description: 'Quit' }
  ].concat(shortcuts).map(x => `${x.key}: ${x.description}`).join(', ');

  return (
    <text
      content={label}
      tags
      {...restProps}
    />
  );
};