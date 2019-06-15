import { createElement, useRef, useState, useEffect } from 'rax';
import parseMarkdown from '../../modules/markdown';

export default function MessagePreviewer({ message, open = false, ...restProps }) {
  const messagePreviewer = useRef(null);

  const [focusable, setFocusable] = useState(open);

  useEffect(() => {
    if (messagePreviewer.current == null) {
      return;
    }

    setFocusable(open);
    if (open) {
      messagePreviewer.current.setIndex(1000);
      messagePreviewer.current.focus();
      messagePreviewer.current.setFront();
      messagePreviewer.current.setContent(parseMarkdown(message.body));
      messagePreviewer.current.show();
    } else {
      messagePreviewer.current.screen.rewindFocus();
      messagePreviewer.current.hide();
      messagePreviewer.current.setBack();
    }
  }, [messagePreviewer, message, open]);

  return (
    <box
      focusable={focusable}
      scrollable
      scrollbar
      keyable={focusable}
      vi
      ref={messagePreviewer}
      { ...restProps }
    />
  );
}
