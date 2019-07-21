import { forwardRef, createElement} from 'rax';

const MessageEditor = forwardRef((props, ref) => {
  return (
    <textarea
      ref={ref}
      keyable
      vi
      inputOnFocus
      border='line'
      { ...props }
    />
  );
});

export default MessageEditor;