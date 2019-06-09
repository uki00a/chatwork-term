import { forwardRef, createElement } from 'rax';

const MessageEditor = forwardRef((props, ref) => {
  return (
    <textbox
      ref={ref}
      clickable
      keyable
      keys
      vi
      inputOnFocus
      border='line'
      { ...props }
    />
  );
});

export default MessageEditor;
