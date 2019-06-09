import { createElement } from 'rax';

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

export default Shortcuts;